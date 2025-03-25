import { ProfileFormData, FormErrors, FormStep } from "@/types/profile";

// Storage keys
const FORM_DRAFT_KEY = 'profileFormDraft';
const FORM_DATA_KEY = 'profileFormData';
const FORM_STEP_KEY = 'profileFormStep';
const FORM_LAST_EDITED_KEY = 'profileFormLastEdited';

// Default form data
export const defaultFormData: ProfileFormData = {
  // Basic Information
  firstName: '',
  lastName: '',
  jobTitle: '',
  company: '',
  email: '',
  photoUrl: '',
  location: '',
  website: '',
  linkedin: '',

  // Style/Tone
  toneValue: 5,

  // Personal Introduction
  introduction: '',
  superpower: '',
  otherSuperpower: '',
  funFact: '',
  industry: '',

  // Skills and Value
  mainValue: '',
  secondaryValue: '',
  audience: '',
  otherAudience: '',
  
  // Your Ask
  primaryAsk: '',
  secondaryAsk: '',
  contactMethod: '',
  
  // Added fields for enhanced profile
  professionalBio: '',
  yearsExperience: '',
  education: '',
  languages: [],
  certifications: [],

  // Form step tracking
  completedSteps: [],
};

/**
 * Save form data as a draft to localStorage
 */
export function saveFormDraft(data: ProfileFormData): void {
  try {
    localStorage.setItem(FORM_DRAFT_KEY, JSON.stringify(data));
    updateLastEditedTimestamp();
  } catch (error) {
    console.error('Error saving form draft:', error);
  }
}

/**
 * Save form data to sessionStorage for use across form steps
 */
export function saveFormData(data: ProfileFormData, step?: FormStep): void {
  try {
    // Save to sessionStorage for cross-page sharing
    sessionStorage.setItem(FORM_DATA_KEY, JSON.stringify(data));

    // Also save to localStorage as a backup
    localStorage.setItem(FORM_DATA_KEY, JSON.stringify(data));

    // Update timestamp
    updateLastEditedTimestamp();

    // If a step is provided, mark it as completed and save
    if (step) {
      markStepAsCompleted(data, step);
    }
  } catch (error) {
    console.error('Error saving form data:', error);
  }
}

/**
 * Update the last edited timestamp
 */
function updateLastEditedTimestamp(): void {
  try {
    localStorage.setItem(FORM_LAST_EDITED_KEY, new Date().toISOString());
  } catch (error) {
    console.error('Error updating last edited timestamp:', error);
  }
}

/**
 * Get the last edited timestamp
 */
export function getLastEditedTimestamp(): Date | null {
  try {
    const timestamp = localStorage.getItem(FORM_LAST_EDITED_KEY);
    return timestamp ? new Date(timestamp) : null;
  } catch (error) {
    console.error('Error getting last edited timestamp:', error);
    return null;
  }
}

/**
 * Mark a form step as completed
 */
export function markStepAsCompleted(data: ProfileFormData, step: FormStep): ProfileFormData {
  if (!data.completedSteps) {
    data.completedSteps = [];
  }

  if (!data.completedSteps.includes(step)) {
    data.completedSteps.push(step);
  }

  // Save the updated data
  saveFormData(data);

  return data;
}

/**
 * Check if a step is completed
 */
export function isStepCompleted(data: ProfileFormData | null, step: FormStep): boolean {
  if (!data || !data.completedSteps) {
    return false;
  }

  return data.completedSteps.includes(step);
}

/**
 * Load form data from storage
 * First tries sessionStorage, then localStorage
 */
export function loadFormData(): ProfileFormData | null {
  try {
    // First try to get from sessionStorage (for navigation between steps)
    const sessionData = sessionStorage.getItem(FORM_DATA_KEY);
    if (sessionData) {
      const parsedData = JSON.parse(sessionData);
      return ensureAllFields(parsedData);
    }

    // Then try localStorage (for saved drafts)
    const localData = localStorage.getItem(FORM_DATA_KEY);
    if (localData) {
      const parsedData = JSON.parse(localData);
      return ensureAllFields(parsedData);
    }

    // Finally try draft data
    const draftData = localStorage.getItem(FORM_DRAFT_KEY);
    if (draftData) {
      const parsedData = JSON.parse(draftData);
      return ensureAllFields(parsedData);
    }

    return null;
  } catch (error) {
    console.error('Error loading form data:', error);
    return null;
  }
}

/**
 * Ensure all fields are present in the form data
 * This helps with backward compatibility if fields are added to the form
 */
function ensureAllFields(data: Partial<ProfileFormData>): ProfileFormData {
  return {
    ...defaultFormData,
    ...data,
  };
}

/**
 * Save the current form step
 */
export function saveCurrentStep(step: FormStep): void {
  try {
    localStorage.setItem(FORM_STEP_KEY, step);
  } catch (error) {
    console.error('Error saving current step:', error);
  }
}

/**
 * Load the current form step
 */
export function loadCurrentStep(): FormStep | null {
  try {
    const step = localStorage.getItem(FORM_STEP_KEY) as FormStep | null;
    return step;
  } catch (error) {
    console.error('Error loading current step:', error);
    return null;
  }
}

/**
 * Validate form data
 */
export function validateFormData(data: ProfileFormData, step?: FormStep): FormErrors {
  const errors: FormErrors = {};

  // Basic fields validation (always validate these regardless of step)
  if (!data.firstName?.trim()) errors.firstName = 'First name is required';
  if (!data.lastName?.trim()) errors.lastName = 'Last name is required';
  if (!data.jobTitle?.trim()) errors.jobTitle = 'Job title is required';
  if (!data.email?.trim()) errors.email = 'Email is required';
  else if (!/^\S+@\S+\.\S+$/.test(data.email)) errors.email = 'Email format is invalid';

  // Only validate specific fields for a given step if a step is provided
  if (step === 'basic' || !step) {
    // Basic profile validations are already covered above
    
    // Validate URLs if provided
    if (data.website) {
      try {
        new URL(data.website);
      } catch (e) {
        errors.website = 'Please enter a valid URL (include https://)';
      }
    }
    
    if (data.linkedin) {
      if (!data.linkedin.includes('linkedin.com')) {
        errors.linkedin = 'Please enter a valid LinkedIn URL';
      }
    }
  }

  if (step === 'introduction' || !step) {
    // Validate introduction fields
    if (data.superpower === 'other' && !data.otherSuperpower?.trim()) {
      errors.otherSuperpower = 'Please specify your superpower';
    }
    
    if (!data.industry?.trim()) {
      errors.industry = 'Please specify your industry or niche';
    }
  }

  if (step === 'value' || !step) {
    // Validate value proposition fields
    if (!data.mainValue?.trim()) {
      errors.mainValue = 'Please share what people can reach out to you for';
    }
    
    if (data.audience === 'other' && !data.otherAudience?.trim()) {
      errors.otherAudience = 'Please specify who you love helping';
    }
  }

  if (step === 'ask' || !step) {
    // Validate ask fields
    if (!data.primaryAsk?.trim()) {
      errors.primaryAsk = 'Please share what you need help with';
    }
    
    if (!data.contactMethod?.trim()) {
      errors.contactMethod = 'Please specify how people can contact you';
    }
  }

  return errors;
}

/**
 * Validate a specific field
 */
export function validateField(data: ProfileFormData, fieldName: keyof ProfileFormData): string | undefined {
  // Email validation
  if (fieldName === 'email') {
    if (!data.email?.trim()) return 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(data.email)) return 'Email format is invalid';
  }
  
  // Required text fields
  if (['firstName', 'lastName', 'jobTitle'].includes(fieldName)) {
    if (!data[fieldName]?.toString().trim()) return `${fieldName} is required`;
  }
  
  // Value proposition
  if (fieldName === 'mainValue') {
    if (!data.mainValue?.trim()) return 'Please share what people can reach out to you for';
  }
  
  // Other field validations
  if (fieldName === 'otherSuperpower' && data.superpower === 'other') {
    if (!data.otherSuperpower?.trim()) return 'Please specify your superpower';
  }
  
  if (fieldName === 'otherAudience' && data.audience === 'other') {
    if (!data.otherAudience?.trim()) return 'Please specify who you love helping';
  }
  
  // Website URL validation
  if (fieldName === 'website' && data.website) {
    try {
      new URL(data.website);
    } catch (e) {
      return 'Please enter a valid URL (include https://)';
    }
  }
  
  // LinkedIn URL validation
  if (fieldName === 'linkedin' && data.linkedin) {
    if (!data.linkedin.includes('linkedin.com')) {
      return 'Please enter a valid LinkedIn URL';
    }
  }
  
  return undefined;
}

/**
 * Clear all form data from storage
 */
export function clearFormData(): void {
  try {
    sessionStorage.removeItem(FORM_DATA_KEY);
    localStorage.removeItem(FORM_DATA_KEY);
    localStorage.removeItem(FORM_DRAFT_KEY);
    localStorage.removeItem(FORM_STEP_KEY);
    localStorage.removeItem(FORM_LAST_EDITED_KEY);
  } catch (error) {
    console.error('Error clearing form data:', error);
  }
}

/**
 * Calculate completion percentage of the form
 */
export function calculateCompletionPercentage(data: ProfileFormData): number {
  // Define essential fields that count toward completion
  const essentialFields: (keyof ProfileFormData)[] = [
    'firstName', 'lastName', 'jobTitle', 'email',
    'introduction', 'superpower', 'mainValue',
    'primaryAsk', 'contactMethod'
  ];

  // Additional fields that contribute to completion but aren't essential
  const additionalFields: (keyof ProfileFormData)[] = [
    'company', 'industry', 'funFact', 'secondaryValue',
    'audience', 'secondaryAsk', 'photoUrl', 'linkedin'
  ];

  // Calculate how many essential fields are filled
  const essentialFilled = essentialFields.filter(field => {
    // Special case for superpower
    if (field === 'superpower' && data.superpower === 'other') {
      return !!data.otherSuperpower?.trim();
    }
    
    // Special case for audience
    if (field === 'audience' && data.audience === 'other') {
      return !!data.otherAudience?.trim();
    }
    
    return !!data[field]?.toString().trim();
  }).length;

  // Calculate how many additional fields are filled
  const additionalFilled = additionalFields.filter(field => {
    return !!data[field]?.toString().trim();
  }).length;

  // Calculate completion percentage
  // Essential fields count for 80% of completion, additional fields for 20%
  const essentialPercentage = (essentialFilled / essentialFields.length) * 80;
  const additionalPercentage = (additionalFilled / additionalFields.length) * 20;
  const totalPercentage = Math.min(100, Math.round(essentialPercentage + additionalPercentage));

  return totalPercentage;
}

/**
 * Merge partial form data with existing data
 */
export function mergeFormData(existingData: ProfileFormData, newData: Partial<ProfileFormData>): ProfileFormData {
  const mergedData = {
    ...existingData,
    ...newData,
  };
  
  // Handle arrays properly (ensure we don't lose data if newData has empty arrays)
  if (Array.isArray(existingData.interests) && !newData.interests) {
    mergedData.interests = existingData.interests;
  }
  
  if (Array.isArray(existingData.languages) && !newData.languages) {
    mergedData.languages = existingData.languages;
  }
  
  if (Array.isArray(existingData.certifications) && !newData.certifications) {
    mergedData.certifications = existingData.certifications;
  }

  return mergedData;
}

/**
 * Auto-save form data after a delay
 */
let autoSaveTimeout: NodeJS.Timeout | null = null;
export function autoSaveFormData(data: ProfileFormData, delay: number = 2000): void {
  // Clear any existing timeout
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }
  
  // Set a new timeout
  autoSaveTimeout = setTimeout(() => {
    saveFormDraft(data);
  }, delay);
}