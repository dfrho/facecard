import { ProfileFormData } from "@/types/profile";
import { NextRequest, NextResponse } from "next/server";
import { getToneDescription, getIndustryStyle } from "@/lib/script-utils";
import { generateEnhancedScript } from "@/lib/script-generator";
import Anthropic from "@anthropic-ai/sdk";

/**
 * API route handler for generating scripts
 */
export async function POST(req: NextRequest) {
  // Get profile data from request body
  const profileData: ProfileFormData = await req.json();

  // Validate request
  if (!profileData) {
    return NextResponse.json(
      { error: "Profile data is required" },
      { status: 400 }
    );
  }

  // Generate script
  const script = await generateScriptWithClaude(profileData);

  // Return generated script
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
