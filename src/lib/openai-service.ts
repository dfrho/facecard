import { ProfileFormData } from "@/types/profile";

/**
 * Generate a script using OpenAI based on profile data
 * 
 * In a real implementation, this would call the OpenAI API
 * For development, this uses a template approach
 */
export async function generateScript(profileData: ProfileFormData): Promise<string> {
  try {
    // In a real implementation, we would call the OpenAI API here
    // For development, we'll simulate it with a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a script based on the profile data
    return createScriptFromTemplate(profileData);
  } catch (error) {
    console.error('Error generating script:', error);
    throw new Error('Failed to generate script. Please try again.');
  }
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
 * In a real implementation, this would be the function to call the OpenAI API
 * It would use the RAG approach to maintain the user's authentic voice
 */
async function callOpenAI(profileData: ProfileFormData): Promise<string> {
  // This is a placeholder for the actual OpenAI API call
  // In a real implementation, you would:
  // 1. Format the profile data into a prompt
  // 2. Call the OpenAI API with the prompt
  // 3. Process and return the response
  
  // For now, just return the template-based script
  return createScriptFromTemplate(profileData);
}
