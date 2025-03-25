import { ProfileFormData } from "@/types/profile";

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
  
  // Default style based on tone
  return tone === 'friendly and casual'
    ? 'authentic and conversational, highlighting personal strengths'
    : 'professional and articulate, emphasizing expertise';
}