import { ProfileFormData } from "@/types/profile";
import { 
  getToneDescription, 
  formatSuperpower, 
  formatAudience, 
  formatSkills,
  getIndustryStyle 
} from './script-utils';
import {
  generateIntroduction,
  formatValueSection,
  formatAudienceSection,
  formatFunFactSection,
  formatAsksSection,
  formatClosingSection
} from './script-formatter';

/**
 * Generate an enhanced script from profile data
 * This provides a more natural and personalized experience 
 */
export function generateEnhancedScript(data: ProfileFormData): string {
  const {
    firstName,
    lastName,
    jobTitle,
    company,
    toneValue = 5,
    industry = '',
    mainValue = '',
    secondaryValue = '',
    superpower = '',
    otherSuperpower = '',
    funFact = '',
    interests = [],
    audience = '',
    otherAudience = '',
    primaryAsk = '',
    secondaryAsk = '',
    contactMethod = ''
  } = data;

  // Determine tone
  const tone = getToneDescription(toneValue);
  
  // Format name and job info
  const fullName = `${firstName} ${lastName}`;
  const jobInfo = company ? `${jobTitle} at ${company}` : jobTitle;
  
  // Process profile components
  const superpowerText = formatSuperpower(superpower, otherSuperpower);
  const audienceText = formatAudience(audience, otherAudience);
  const skillsText = formatSkills(interests);
  
  // Start building the script
  let script = generateIntroduction(firstName, fullName, jobInfo, tone);
  
  // Add industry and value propositions
  script += formatValueSection(industry, mainValue, secondaryValue, tone);
  
  // Add superpower section if available
  if (superpowerText) {
    script += `\n\nMy professional superpower is ${superpowerText}.`;
  }

  // Add skills if available
  if (skillsText) {
    script += `\n\n${skillsText}`;
  }

  // Add audience information if available
  if (audienceText) {
    script += formatAudienceSection(audienceText, tone);
  }

  // Add fun fact if available
  if (funFact) {
    script += formatFunFactSection(funFact, tone);
  }

  // Add asks (primary and secondary)
  if (primaryAsk || secondaryAsk) {
    script += formatAsksSection(primaryAsk, secondaryAsk, tone);
  }

  // Add contact info and closing
  script += formatClosingSection(contactMethod, tone);

  return script;
}

/**
 * Create an enhanced prompt for OpenAI API
 */
export function createEnhancedPrompt(data: ProfileFormData): string {
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
- Skills: ${data.skills || 'Not specified'}
- Interests: ${data.interests && data.interests.length > 0 ? data.interests.join(', ') : 'Not specified'}
- Key Achievements: ${data.achievements || 'Not specified'}
- Currently Seeking: ${data.seeking || 'Not specified'}
- Ideal Connection: ${data.idealConnection || 'Not specified'}

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
