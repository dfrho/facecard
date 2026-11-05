import { ProfileFormData } from "@/types/profile";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getToneDescription, getIndustryStyle } from "@/lib/script-utils";
import { generateEnhancedScript } from "@/lib/script-generator";
import { authOptions } from "@/lib/auth";
import { validateScriptRequest } from "@/lib/profile-validation";
import { createRateLimiter } from "@/lib/rate-limit";
import Anthropic from "@anthropic-ai/sdk";

// A real profile is a few KB; anything far larger is not a legitimate request.
const MAX_BODY_BYTES = 100_000;

// Every generation is a paid Claude call. 20 an hour per user allows plenty of
// regenerating while editing, but not bulk use. See src/lib/rate-limit.ts for its limits.
const generationLimiter = createRateLimiter({ limit: 20, windowMs: 60 * 60 * 1000 });

function reject(
  reason: string,
  status: number,
  message: string,
  details: Record<string, unknown> = {},
  headers: Record<string, string> = {}
) {
  console.warn(JSON.stringify({ event: "script_generation_rejected", reason, ...details }));
  return NextResponse.json({ error: message }, { status, headers });
}

/**
 * API route handler for generating scripts. Signed-in users only: each request spends
 * Claude credits, so it is also size-checked and rate-limited per user.
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; email?: string | null } | undefined;
  const userId = user?.id || user?.email;
  if (!userId) {
    const ip = req.ip ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    return reject("unauthenticated", 401, "Please sign in to generate a script.", { ip });
  }

  const declaredBytes = Number(req.headers.get("content-length") ?? 0);
  if (declaredBytes > MAX_BODY_BYTES) {
    return reject("too_large", 413, "That profile is too large to turn into a script.", {
      userId,
      bytes: declaredBytes,
    });
  }

  const body = await req.json().catch(() => undefined);
  const validation = validateScriptRequest(body);
  if (!validation.ok) {
    return reject("invalid", 400, validation.error, { userId });
  }

  const limit = generationLimiter.check(userId);
  if (!limit.allowed) {
    const minutes = Math.ceil(limit.retryAfterSeconds / 60);
    return reject(
      "rate_limited",
      429,
      `You've generated a lot of scripts in the last hour. Please try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
      { userId },
      { "Retry-After": String(limit.retryAfterSeconds) }
    );
  }

  const script = await generateScriptWithClaude(validation.profile);
  return NextResponse.json({ script });
}

/**
 * Generate script with Claude
 */
async function generateScriptWithClaude(
  profileData: ProfileFormData
): Promise<string> {
  const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

  if (!CLAUDE_API_KEY) {
    return generateEnhancedScript(profileData);
  }

  try {
    const prompt = createPrompt(profileData);

    const client = new Anthropic({ apiKey: CLAUDE_API_KEY });

    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 1024,
      system: "You are a professional copywriter creating video scripts. You output ONLY the spoken words — never scene directions, stage directions, or bracketed text of any kind.",
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = response.content.find(b => b.type === 'text');
    const raw = textBlock && textBlock.type === 'text' ? textBlock.text : '';

    const result = raw
      .replace(/\[[^\]]*\]/g, '')  // strip [Scene: ...] and any bracketed directions
      .replace(/\n{3,}/g, '\n\n')  // collapse extra blank lines left behind
      .trim();
    return result;

  } catch (error) {
    console.error('Error calling Claude API:', error);
    const message = error instanceof Error ? error.message : 'Unknown Claude API error';
    throw new Error(`Claude API call failed: ${message}`);
  }
}

function createPrompt(data: ProfileFormData): string {
  const tone = getToneDescription(data.toneValue);
  const style = getIndustryStyle(data.industry || '', tone);

  // Create personality hints
  const personalityHints = [];
  if (data.funFact) personalityHints.push(`Has an interesting background: ${data.funFact}`);
  if (data.superpower === 'connect') personalityHints.push('Is a natural connector and networker');
  if (data.superpower === 'ideas') personalityHints.push('Is an innovative thinker and idea generator');
  if (data.superpower === 'creative') personalityHints.push('Has a creative and artistic mindset');
  if (data.superpower === 'problems') personalityHints.push('Is an analytical problem-solver');
  if (data.superpower === 'inspire') personalityHints.push('Is motivational and inspiring');
  if (data.superpower === 'vibes') personalityHints.push('Is upbeat and brings positive energy');

  // Build the prompt
  return `
You are a professional copywriter creating a 15-30 second video script for a business professional.
The script should showcase their skills, what they can offer, and what they need help with.
It should sound natural and authentic, like the person is speaking directly to the viewer.

TONE: ${tone}
WRITING STYLE: ${style}

PERSONALITY: ${personalityHints.length > 0 ? personalityHints.join('. ') : 'Professional and authentic'}

PROFILE INFORMATION:
- Name: ${data.firstName} ${data.lastName}
- Job Title: ${data.jobTitle}
- Company: ${data.company || 'Not specified'}
- Industry: ${data.industry || 'Not specified'}
- Professional Superpower: ${data.superpower === 'other' ? data.otherSuperpower : data.superpower}
- Main Value Proposition: ${data.mainValue}
- Secondary Value: ${data.secondaryValue || 'Not specified'}
- Who They Help: ${data.audience === 'other' ? data.otherAudience : data.audience}
- Fun Fact: ${data.funFact || 'Not specified'}
- Primary Ask: ${data.primaryAsk || 'Not specified'}
- Secondary Ask: ${data.secondaryAsk || 'Not specified'}
- Contact Method: ${data.contactMethod || 'Not specified'}
- Skills: ${data.skills || 'Not specified'}
- Interests: ${data.interests && data.interests.length > 0 ? data.interests.join(', ') : 'Not specified'}
- Key Achievements: ${data.achievements || 'Not specified'}
- Currently Seeking: ${data.seeking || 'Not specified'}
- Ideal Connection: ${data.idealConnection || 'Not specified'}

REQUIREMENTS:
1. The script should be concise and under 200 words
2. Format with line breaks for easier reading
3. Include their main value proposition early
4. End with a clear call to action
5. Make it sound like a real person speaking naturally
6. NO formal marketing language or buzzwords
7. NO scene directions, stage directions, or bracketed instructions of any kind (e.g. no "[Scene: ...]", "[Camera pans...]", "[Fade out]", etc.)
8. Output ONLY the spoken words the person will say — nothing else

SCRIPT:
`;
}
