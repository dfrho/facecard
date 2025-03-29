import { ProfileFormData } from "@/types/profile";
import { NextRequest, NextResponse } from "next/server";
import { getToneDescription, getIndustryStyle } from "@/lib/script-utils";
import { generateEnhancedScript } from "@/lib/script-generator";
import OpenAI from "openai";

// API constants
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
// Try with a more widely available model to debug
const OPENAI_MODEL = "gpt-3.5-turbo";

/**
 * API route handler for generating scripts
 */
export async function POST(req: NextRequest) {
  console.log("API route handler triggered");
  try {
    // Get profile data from request body
    const profileData: ProfileFormData = await req.json();
    console.log("Received profile data:", JSON.stringify(profileData, null, 2));

    // Validate request
    if (!profileData) {
      console.log("Profile data is missing, returning 400");
      return NextResponse.json(
        { error: "Profile data is required" },
        { status: 400 }
      );
    }

    // Generate script
    console.log("Calling generateScriptWithOpenAI");
    const script = await generateScriptWithOpenAI(profileData);
    console.log("Generated script length:", script.length);

    // Return generated script
    return NextResponse.json({ script });
  } catch (error) {
    console.error("Error generating script:", error);
    // Log more detailed error information
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      { error: "Failed to generate script" },
      { status: 500 }
    );
  }
}

/**
 * Generate script with OpenAI
 */
async function generateScriptWithOpenAI(
  profileData: ProfileFormData
): Promise<string> {
  // Check if API key is available and log it (masked)
  const hasApiKey = !!OPENAI_API_KEY;
  const maskedKey = hasApiKey ? 
    `${OPENAI_API_KEY.substring(0, 3)}...${OPENAI_API_KEY.substring(OPENAI_API_KEY.length - 4)}` : 
    'undefined';
  console.log("OpenAI API Key status:", hasApiKey ? "Available" : "Missing");
  console.log("Masked API Key:", maskedKey);
  console.log("Using model:", OPENAI_MODEL);

  // If no API key, use the fallback method
  if (!OPENAI_API_KEY) {
    console.log("No OpenAI API key found, using fallback method");
    return generateEnhancedScript(profileData);
  }

  try {
    // Create prompt for OpenAI
    const prompt = createPrompt(profileData);
    console.log("Created prompt with length:", prompt.length);
    
    console.log("Initializing OpenAI client");
    try {
      // Initialize OpenAI client
      // Handle both traditional API keys (sk-...) and Project API keys (sk-proj-...)
      const client = new OpenAI({
        apiKey: OPENAI_API_KEY,
        baseURL: OPENAI_API_KEY.startsWith('sk-proj-') ? 'https://api.openai.com/v1' : undefined
      });
      console.log("OpenAI client initialized successfully");
      
      console.log("Calling OpenAI API with model:", OPENAI_MODEL);
      
      // Call OpenAI API with documented syntax
      const response = await client.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a professional copywriter creating video scripts."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });
      
      console.log("OpenAI API call successful");
      
      if (!response.choices || response.choices.length === 0) {
        console.error("OpenAI returned no choices");
        throw new Error("OpenAI returned no choices");
      }
      
      const result = response.choices[0].message.content?.trim() || "";
      console.log("Generated content length:", result.length);
      return result;
    } catch (clientError) {
      console.error("Error initializing or using OpenAI client:", clientError);
      throw clientError;
    }
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    
    console.log("Falling back to local generation due to API error");
    // Fall back to local generation if API fails
    return generateEnhancedScript(profileData);
  }
}

/**
 * Create a prompt for OpenAI
 */
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

SCRIPT:
`;
}
