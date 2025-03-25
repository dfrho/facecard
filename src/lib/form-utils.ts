import { ProfileFormData, FormErrors } from "@/types/profile";

// Storage keys
const FORM_DRAFT_KEY = 'profileFormDraft';
const FORM_DATA_KEY = 'profileFormData';

// Default form data
export const defaultFormData: ProfileFormData = {
  // Basic Information
  firstName: '',
  lastName: '',
  jobTitle: '',
  company: '',
  email: '',

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
};

/**
 * Save form data as a draft to localStorage
 */
export function saveFormDraft(data: ProfileFormData): void {
  localStorage.setItem(FORM_DRAFT_KEY, JSON.stringify(data));
}

/**
 * Save form data to sessionStorage for use across form steps
 */
export function saveFormData(data: ProfileFormData): void {
  // Save to sessionStorage for cross-page sharing
  sessionStorage.setItem(FORM_DATA_KEY, JSON.stringify(data));
  
  // Also save to localStorage as a backup
  localStorage.setItem(FORM_DATA_KEY, JSON.stringify(data));
}

/**
 * Load form data from storage
 * First tries sessionStorage, then localStorage
 */
export function loadFormData(): ProfileFormData | null {
  // First try to get from sessionStorage (for navigation between steps)
  const sessionData = sessionStorage.getItem(FORM_DATA_KEY);
  if (sessionData) {
    return JSON.parse(sessionData);
  }
  
  // Then try localStorage (for saved drafts)
  const localData = localStorage.getItem(FORM_DATA_KEY);
  if (localData) {
    return JSON.parse(localData);
  }
  
  // Finally try draft data
  const draftData = localStorage.getItem(FORM_DRAFT_KEY);
  if (draftData) {
    return JSON.parse(draftData);
  }
  
  return null;
}

/**
 * Validate form data
 */
export function validateFormData(data: ProfileFormData): FormErrors {
  const errors: FormErrors = {};
  
  // Required fields validation
  if (!data.firstName.trim()) errors.firstName = 'First name is required';
  if (!data.lastName.trim()) errors.lastName = 'Last name is required';
  if (!data.jobTitle.trim()) errors.jobTitle = 'Job title is required';
  if (!data.email.trim()) errors.email = 'Email is required';
  else if (!/^\S+@\S+\.\S+$/.test(data.email)) errors.email = 'Email format is invalid';
  
  // At least one value proposition is required
  if (!data.mainValue.trim()) {
    errors.mainValue = 'Please share what people can reach out to you for';
  }
  
  return errors;
}

/**
 * Clear all form data from storage
 */
export function clearFormData(): void {
  sessionStorage.removeItem(FORM_DATA_KEY);
  localStorage.removeItem(FORM_DATA_KEY);
}

/**
 * Merge partial form data with existing data
 */
export function mergeFormData(existingData: ProfileFormData, newData: Partial<ProfileFormData>): ProfileFormData {
  return {
    ...existingData,
    ...newData,
  };
}
