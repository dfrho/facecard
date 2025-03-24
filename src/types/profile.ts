export interface ProfileFormData {
  // Basic Information
  firstName: string;
  lastName: string;
  jobTitle: string;
  company: string;
  email: string;
  
  // Style/Tone
  toneValue: number;
  
  // Personal Introduction
  introduction: string;
  superpower: string;
  otherSuperpower: string;
  funFact: string;
  industry: string;
  
  // Skills and Value
  mainValue: string;
  secondaryValue: string;
  audience: string;
  otherAudience: string;
  
  // Your Ask
  primaryAsk: string;
  secondaryAsk: string;
  contactMethod: string;
  
  // Additional fields added in later steps
  interests?: string[];
  generatedScript?: string;
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  email?: string;
  mainValue?: string;
  [key: string]: string | undefined;
}
