// No need to import ProfileFormData as it's not used directly here

/**
 * Convert tone value to a descriptive string
 */
export function getToneDescription(toneValue: number): string {
  if (toneValue <= 3) {
    return 'friendly and casual';
  } else if (toneValue <= 7) {
    return 'professional but approachable';
  } else {
    return 'formal and business-focused';
  }
}

/**
 * Get writing style based on industry and tone
 */
export function getIndustryStyle(industry: string, tone: string): string {
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
  
  // Default style based on tone
  return tone === 'friendly and casual'
    ? 'authentic and conversational, highlighting personal strengths'
    : 'professional and articulate, emphasizing expertise';
}

/**
 * Format superpower text
 */
export function formatSuperpower(superpower: string, otherSuperpower: string): string {
  if (!superpower) return '';
  
  if (superpower === 'other' && otherSuperpower) {
    return otherSuperpower;
  } else if (superpower === 'connect') {
    return 'connecting people like a human LinkedIn';
  } else if (superpower === 'ideas') {
    return 'turning ideas into businesses';
  } else if (superpower === 'creative') {
    return 'making things look and sound amazing';
  } else if (superpower === 'problems') {
    return 'solving impossible problems';
  } else if (superpower === 'inspire') {
    return 'inspiring people to take action';
  } else if (superpower === 'vibes') {
    return 'bringing the good vibes';
  }
  
  return '';
}

/**
 * Format audience text
 */
export function formatAudience(audience: string, otherAudience: string): string {
  if (!audience) return '';
  
  if (audience === 'other' && otherAudience) {
    return otherAudience;
  } else if (audience === 'aspiring') {
    return 'aspiring entrepreneurs who don\'t know where to start';
  } else if (audience === 'retention') {
    return 'businesses struggling with customer retention';
  } else if (audience === 'career') {
    return 'people looking for their next big career move';
  } else if (audience === 'likeminded') {
    return 'cool, like-minded professionals looking to connect';
  }
  
  return '';
}

/**
 * Format skills text
 */
export function formatSkills(interests: string[]): string {
  if (!interests || interests.length === 0) return '';
  
  return `My key areas of expertise include ${interests.slice(0, 3).join(', ')}.`;
}

/**
 * Generate a unique ID for script versions
 */
export function generateUniqueId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}
