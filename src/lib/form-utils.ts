import { ProfileFormData, FormStep } from "@/types/profile";

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
  
  // Interests and skills form fields
  skills: '',
  interests: [],
  achievements: '',
  seeking: '',
  idealConnection: '',

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
