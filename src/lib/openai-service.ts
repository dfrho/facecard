import { ProfileFormData, ScriptVersion } from "@/types/profile";

// This would come from environment variables in a real implementation
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

/**
 * Generate a script using OpenAI based on profile data
 * 
 * In a real implementation with the OpenAI SDK, this would call the OpenAI API
 * For development without exposing API keys, we use a template approach
 */
export async function generateScript(profileData: ProfileFormData): Promise<string> {
  try {
    // If we have an API key and are in a secure environment, use the OpenAI API
    if (OPENAI_API_KEY && process.env.NODE_ENV === 'production') {
      return await callOpenAIApi(profileData);
    } else {
      // For development or when no API key is available, use the template
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      return createScriptFromTemplate(profileData);
    }
  } catch (error) {
    console.error('Error generating script:', error);
    throw new Error('Failed to generate script. Please try again.');
  }
}

/**
 * Save a script version to history
 */
export async function saveScriptVersion(
  script: string, 
  profileId: string, 
  source: 'ai' | 'user' = 'user'
): Promise<ScriptVersion> {
  const version: ScriptVersion = {
    id: generateVersionId(),
    content: script,
    timestamp: new Date().toISOString(),
    source
  };
  
  // In a real implementation, this would save to a database
  // For now, we could store it in localStorage
  try {
    const existingVersions = localStorage.getItem(`script_versions_${profileId}`);
    const versions = existingVersions ? JSON.parse(existingVersions) : [];
    versions.push(version);
    localStorage.setItem(`script_versions_${profileId}`, JSON.stringify(versions));
    return version;
  } catch (error) {
    console.error('Error saving script version:', error);
    return version; // Still return the version even if saving fails
  }
}

/**
 * Get all script versions for a profile
 */
export function getScriptVersions(profileId: string): ScriptVersion[] {
  try {
    const versionsJson = localStorage.getItem(`script_versions_${profileId}`);
    return versionsJson ? JSON.parse(versionsJson) : [];
  } catch (error) {
    console.error('Error getting script versions:', error);
    return [];
  }
}

/**
 * Generate a unique version ID
 */
function generateVersionId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Convert tone value to a descriptive string
 */
function getToneDescription(toneValue: number): string {
  if (toneValue <= 3) {
    return 'friendly and casual';
  } else if (toneValue <= 7) {
    return 'professional but approachable';
  } else {
    return 'formal and business-focused';
  }
}

/**
 * Create a script from profile data using a template
 * This is a placeholder for the actual OpenAI implementation
 */
function createScriptFromTemplate(data: ProfileFormData): string {
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
    contactMethod
  } = data;

  // Determine tone
  const tone = getToneDescription(toneValue);

  // Format name
  const fullName = `${firstName} ${lastName}`;

  // Format job info
  const jobInfo = company ? `${jobTitle} at ${company}` : jobTitle;

  // Format superpower
  let superpowerText = '';
  if (superpower) {
    if (superpower === 'other' && otherSuperpower) {
      superpowerText = otherSuperpower;
    } else if (superpower === 'connect') {
      superpowerText = 'connecting people like a human LinkedIn';
    } else if (superpower === 'ideas') {
      superpowerText = 'turning ideas into businesses';
    } else if (superpower === 'creative') {
      superpowerText = 'making things look and sound amazing';
    } else if (superpower === 'problems') {
      superpowerText = 'solving impossible problems';
    } else if (superpower === 'inspire') {
      superpowerText = 'inspiring people to take action';
    } else if (superpower === 'vibes') {
      superpowerText = 'bringing the good vibes';
    }
  }

  // Format audience
  let audienceText = '';
  if (audience) {
    if (audience === 'other' && otherAudience) {
      audienceText = otherAudience;
    } else if (audience === 'aspiring') {
      audienceText = 'aspiring entrepreneurs who don\'t know where to start';
    } else if (audience === 'retention') {
      audienceText = 'businesses struggling with customer retention';
    } else if (audience === 'career') {
      audienceText = 'people looking for their next big career move';
    } else if (audience === 'likeminded') {
      audienceText = 'cool, like-minded professionals looking to connect';
    }
  }

  // Format skills
  const skillsText = interests && interests.length > 0
    ? `My key areas of expertise include ${interests.slice(0, 3).join(', ')}.`
    : '';

  // Format introduction based on tone
  let introduction = '';
  if (tone === 'friendly and casual') {
    introduction = `Hey there! I'm ${firstName}, a ${jobInfo}.`;
  } else if (tone === 'professional but approachable') {
    introduction = `Hello, I'm ${fullName}, a ${jobInfo}.`;
  } else {
    introduction = `Greetings, my name is ${fullName}. I'm a ${jobInfo}.`;
  }

  // Build the script
  let script = introduction + '\n\n';

  if (industry) {
    script += `I work in the ${industry} industry. `;
  }

  if (mainValue) {
    script += `${mainValue} `;
  }

  if (secondaryValue) {
    script += `I also ${secondaryValue} `;
  }

  if (superpowerText) {
    script += `\n\nMy professional superpower is ${superpowerText}. `;
  }

  if (skillsText) {
    script += `\n\n${skillsText} `;
  }

  if (audienceText) {
    script += `\n\nI'm particularly passionate about helping ${audienceText}. `;
  }

  if (funFact) {
    script += `\n\nHere's something you might not expect: ${funFact} `;
  }

  // Add the ask section
  if (primaryAsk) {
    script += `\n\nRight now, I'm looking for ${primaryAsk}. `;

    if (secondaryAsk) {
      script += `I'm also interested in ${secondaryAsk}. `;
    }
  }

  // Add contact info if provided
  if (contactMethod) {
    script += `\n\nYou can reach me via ${contactMethod}. `;
  } else {
    script += `\n\nPlease feel free to reach out if you'd like to connect! `;
  }

  // Final line based on tone
  if (tone === 'friendly and casual') {
    script += `\n\nLooking forward to connecting with you!`;
  } else if (tone === 'professional but approachable') {
    script += `\n\nI look forward to the opportunity to connect and explore potential synergies.`;
  } else {
    script += `\n\nThank you for your consideration. I look forward to potential collaboration.`;
  }

  return script;
}

/**
 * Create a prompt for the OpenAI API based on profile data
 */
function createOpenAIPrompt(data: ProfileFormData): string {
  const tone = getToneDescription(data.toneValue);
  
  return `
You are a professional copywriter creating a 15-30 second video script for a business professional.
The script should showcase their skills, what they can offer, and what they need help with.
It should sound natural and authentic, like the person is speaking directly to the viewer.

TONE: ${tone}

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
- Primary Ask (What they need): ${data.primaryAsk || 'Not specified'}
- Secondary Ask: ${data.secondaryAsk || 'Not specified'}
- Contact Method: ${data.contactMethod || 'Not specified'}
- Interests/Skills: ${data.interests && data.interests.length > 0 ? data.interests.join(', ') : 'Not specified'}

REQUIREMENTS:
1. The script should be concise and under 200 words
2. Format with line breaks for easier reading/performance
3. Include their main value proposition early
4. End with a clear call to action
5. Maintain their authentic voice
6. Absolutely NO formal marketing language or buzzwords
7. Make it sound like a real person speaking naturally
8. Include ONLY the script text, no other instructions or explanations

SCRIPT:
`;
}

/**
 * Call the OpenAI API with fetch
 * This is a simplified implementation that would be replaced with the real OpenAI SDK
 */
async function callOpenAIApi(profileData: ProfileFormData): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is required');
  }

  try {
    const prompt = createOpenAIPrompt(profileData);
    
    // This would be replaced with actual OpenAI API calls
    // Here's an example of how it might look with fetch
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional copywriter creating video scripts.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    // Fall back to template-based generation if API fails
    return createScriptFromTemplate(profileData);
  }
}