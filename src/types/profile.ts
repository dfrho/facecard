export interface ProfileFormData {
  // Basic Information
  firstName: string;
  lastName: string;
  jobTitle: string;
  company: string;
  email: string;
  // Additional basic info
  photoUrl?: string;
  location?: string;
  website?: string;
  linkedin?: string;

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

  // Additional fields for enhanced profile
  professionalBio?: string;
  yearsExperience?: string;
  education?: string;
  languages?: string[];
  certifications?: string[];

  // Fields added in later steps
  interests?: string[];
  skills?: string;
  achievements?: string;
  seeking?: string;
  idealConnection?: string;
  generatedScript?: string;
  
  // Form tracking
  completedSteps?: FormStep[];
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  email?: string;
  mainValue?: string;
  industry?: string;
  primaryAsk?: string;
  contactMethod?: string;
  otherSuperpower?: string;
  otherAudience?: string;
  website?: string;
  linkedin?: string;
  [key: string]: string | undefined;
}

// Form step types for tracking progress
export type FormStep = 
  | 'basic' 
  | 'introduction' 
  | 'value' 
  | 'ask' 
  | 'interests' 
  | 'script' 
  | 'video' 
  | 'share';

// Form section type for UI organization
export type FormSection = 
  | 'basic' 
  | 'style' 
  | 'introduction' 
  | 'value' 
  | 'ask' 
  | 'advanced';

// Form field type for validation and display
export interface FormField {
  id: keyof ProfileFormData;
  label: string;
  type: 'text' | 'email' | 'textarea' | 'select' | 'range' | 'checkbox' | 'radio' | 'file' | 'url';
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  section: FormSection;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  conditional?: {
    field: keyof ProfileFormData;
    value: string | boolean | number;
  };
}

// Video generation options
export interface VideoOptions {
  avatarStyle?: 'professional' | 'casual' | 'creative';
  backgroundColor?: string;
  includeSubtitles?: boolean;
  musicTrack?: string;
  duration?: 'short' | 'medium' | 'long';
  callToAction?: string;
}

// Script version history
export interface ScriptVersion {
  id: string;
  content: string;
  timestamp: string;
  source: 'ai' | 'user';
}
