import { ProfileFormData } from "@/types/profile";
import { NextRequest, NextResponse } from "next/server";

// API constants
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = "gpt-4-turbo"; // Using the latest model for better results

/**
 * API route handler for generating scripts
 */
export async function POST(req: NextRequest) {
  try {
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
    const script = await generateScriptWithOpenAI(profileData);

    // Return generated script
    return NextResponse.json({ script });
  } catch (error) {
    console.error("Error generating script:", error);
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
  // If no API key, use a fallback method
  if (!OPENAI_API_KEY) {
    return generateLocalScript(profileData);
  }

  try {
    // Create prompt for OpenAI
    const prompt = createOpenAIPrompt(profileData);

    // Call OpenAI API
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a professional copywriter creating video scripts.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `OpenAI API error: ${response.status} ${
          errorData.error?.message || "Unknown error"
        }`
      );
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    // Fall back to local generation if API fails
    return generateLocalScript(profileData);
  }
}

/**
 * Create a prompt for OpenAI based on profile data
 */
function createOpenAIPrompt(data: ProfileFormData): string {
  const tone = getToneDescription(data.toneValue);
  const style = getIndustryStyle(data.industry || '', tone);
  
  // Extract personality hints from the data
  const personalityHints = [];
  if (data.funFact) personalityHints.push(`Has an interesting background: ${data.funFact}`);
  if (data.superpower === 'connect') personalityHints.push('Is a natural connector and networker');
  if (data.superpower === 'ideas') personalityHints.push('Is an innovative thinker and idea generator');
  if (data.superpower === 'creative') personalityHints.push('Has a creative and artistic mindset');
  if (data.superpower === 'problems') personalityHints.push('Is an analytical problem-solver');
  if (data.superpower === 'inspire') personalityHints.push('Is motivational and inspiring');
  if (data.superpower === 'vibes') personalityHints.push('Is upbeat and brings positive energy');
  if (data.superpower === 'other' && data.otherSuperpower) {
    personalityHints.push(`Describes their superpower as: ${data.otherSuperpower}`);
  }

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
- Company: ${data.company || "Not specified"}
- Industry: ${data.industry || "Not specified"}
- Professional Superpower: ${data.superpower === "other" ? data.otherSuperpower : data.superpower}
- Main Value Proposition: ${data.mainValue}
- Secondary Value: ${data.secondaryValue || "Not specified"}
- Who They Help: ${data.audience === "other" ? data.otherAudience : data.audience}
- Fun Fact: ${data.funFact || "Not specified"}
- Primary Ask (What they need): ${data.primaryAsk || "Not specified"}
- Secondary Ask: ${data.secondaryAsk || "Not specified"}
- Contact Method: ${data.contactMethod || "Not specified"}
- Interests/Skills: ${data.interests && data.interests.length > 0 ? data.interests.join(", ") : "Not specified"}

REQUIREMENTS:
1. The script should be concise and under 200 words
2. Format with line breaks for easier reading/performance
3. Include their main value proposition early
4. End with a clear call to action
5. Maintain their authentic voice
6. Absolutely NO formal marketing language or buzzwords
7. Make it sound like a real person speaking naturally
8. Structure the script with natural paragraph breaks for easier performance
9. Adapt your language style to match their industry and personality
10. Include ONLY the script text, no other instructions or explanations

SCRIPT:
`;
}

/**
 * Convert tone value to a descriptive string
 */
function getToneDescription(toneValue: number): string {
  if (toneValue <= 3) {
    return "friendly and casual";
  } else if (toneValue <= 7) {
    return "professional but approachable";
  } else {
    return "formal and business-focused";
  }
}

/**
 * Get writing style based on industry and tone
 */
function getIndustryStyle(industry: string, tone: string): string {
  // Normalize the industry name
  const normalizedIndustry = industry.toLowerCase();
  
  // Map industries to specific writing styles
  if (normalizedIndustry.includes('tech') || normalizedIndustry.includes('software') || normalizedIndustry.includes('ai')) {
    return tone === 'friendly and casual' 
      ? 'innovative and forward-thinking with a touch of technical expertise'
      : 'technical yet accessible, focusing on innovation and solutions';
  }
  
  if (normalizedIndustry.includes('finance') || normalizedIndustry.includes('banking') || normalizedIndustry.includes('investment')) {
    return tone === 'friendly and casual'
      ? 'trustworthy and knowledgeable about financial matters, with an approachable style'
      : 'authoritative and precise, emphasizing expertise and reliability';
  }
  
  if (normalizedIndustry.includes('health') || normalizedIndustry.includes('medical') || normalizedIndustry.includes('care')) {
    return tone === 'friendly and casual'
      ? 'empathetic and reassuring, with a personal touch'
      : 'professional and credible, with a caring undertone';
  }
  
  if (normalizedIndustry.includes('creative') || normalizedIndustry.includes('design') || normalizedIndustry.includes('art')) {
    return tone === 'friendly and casual'
      ? 'expressive and imaginative, showcasing creative flair'
      : 'polished and inspiring, highlighting creative expertise';
  }
  
  // Default style based on tone
  return tone === 'friendly and casual'
    ? 'authentic and conversational, highlighting personal strengths'
    : 'professional and articulate, emphasizing expertise';
}

/**
 * Fallback function to generate a script locally
 * This is a simplified version of the script template in openai-service.ts
 */
function generateLocalScript(data: ProfileFormData): string {
  const {
    firstName,
    lastName,
    jobTitle,
    company,
    toneValue,
    industry,
    mainValue,
    secondaryValue,
    superpower,
    otherSuperpower,
    funFact,
    interests = [],
    audience,
    otherAudience,
    primaryAsk,
    secondaryAsk,
    contactMethod,
  } = data;

  // Determine tone
  const tone = getToneDescription(toneValue);

  // Format name and job info
  const fullName = `${firstName} ${lastName}`;
  const jobInfo = company ? `${jobTitle} at ${company}` : jobTitle;

  // Format introduction based on tone
  let script = "";
  if (tone === "friendly and casual") {
    script = `Hey there! I'm ${firstName}, a ${jobInfo}.\n\n`;
  } else if (tone === "professional but approachable") {
    script = `Hello, I'm ${fullName}, a ${jobInfo}.\n\n`;
  } else {
    script = `Greetings, my name is ${fullName}. I'm a ${jobInfo}.\n\n`;
  }

  // Add value propositions
  if (industry) {
    script += `I work in the ${industry} industry. `;
  }

  if (mainValue) {
    script += `${mainValue} `;
  }

  if (secondaryValue) {
    script += `I also ${secondaryValue}\n\n`;
  }

  // Add superpower
  let superpowerText = "";
  if (superpower) {
    if (superpower === "other" && otherSuperpower) {
      superpowerText = otherSuperpower;
    } else if (superpower === "connect") {
      superpowerText = "connecting people like a human LinkedIn";
    } else if (superpower === "ideas") {
      superpowerText = "turning ideas into businesses";
    } else if (superpower === "creative") {
      superpowerText = "making things look and sound amazing";
    } else if (superpower === "problems") {
      superpowerText = "solving impossible problems";
    } else if (superpower === "inspire") {
      superpowerText = "inspiring people to take action";
    } else if (superpower === "vibes") {
      superpowerText = "bringing the good vibes";
    }
  }

  if (superpowerText) {
    script += `My professional superpower is ${superpowerText}.\n\n`;
  }

  // Add skills
  if (interests && interests.length > 0) {
    script += `My key areas of expertise include ${interests
      .slice(0, 3)
      .join(", ")}.\n\n`;
  }

  // Add who they help
  let audienceText = "";
  if (audience) {
    if (audience === "other" && otherAudience) {
      audienceText = otherAudience;
    } else if (audience === "aspiring") {
      audienceText = "aspiring entrepreneurs who don't know where to start";
    } else if (audience === "retention") {
      audienceText = "businesses struggling with customer retention";
    } else if (audience === "career") {
      audienceText = "people looking for their next big career move";
    } else if (audience === "likeminded") {
      audienceText = "cool, like-minded professionals looking to connect";
    }
  }

  if (audienceText) {
    script += `I'm particularly passionate about helping ${audienceText}.\n\n`;
  }

  // Add fun fact
  if (funFact) {
    script += `Here's something you might not expect: ${funFact}\n\n`;
  }

  // Add asks
  if (primaryAsk) {
    script += `Right now, I'm looking for ${primaryAsk}. `;
    if (secondaryAsk) {
      script += `I'm also interested in ${secondaryAsk}.\n\n`;
    } else {
      script += "\n\n";
    }
  }

  // Add contact info and closing
  if (contactMethod) {
    script += `You can reach me via ${contactMethod}. `;
  } else {
    script += `Please feel free to reach out if you'd like to connect! `;
  }

  // Final line based on tone
  if (tone === "friendly and casual") {
    script += `Looking forward to connecting with you!`;
  } else if (tone === "professional but approachable") {
    script += `I look forward to the opportunity to connect and explore potential synergies.`;
  } else {
    script += `Thank you for your consideration. I look forward to potential collaboration.`;
  }

  return script;
}
