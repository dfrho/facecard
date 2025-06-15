import { ProfileFormData, ScriptVersion } from "@/types/profile";
import { generateUniqueId } from './script-utils';
import { generateEnhancedScript } from './script-generator';

// API key from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Generate a script using OpenAI based on profile data
 */
export async function generateScript(profileData: ProfileFormData): Promise<string> {
  try {
    if (OPENAI_API_KEY) {
      // Key is present, attempt to call the API route directly.
      // If callAPIRoute fails, the error will propagate up.
      console.log('OpenAI API key found, attempting API call...');
      return await callAPIRoute(profileData);
    } else {
      // No API key available, throw an error.
      console.error('OpenAI API key is not configured.');
      throw new Error('OpenAI API key is not configured. Cannot generate script via API.');
    }
  } catch (error) {
    console.error('Error in generateScript:', error);
    // Re-throw the original error or a more user-friendly one
    // Check if error is an instance of Error to access message safely
    const message = error instanceof Error ? error.message : 'An unknown error occurred during script generation.';
    throw new Error(`Failed to generate script: ${message}`);
  }
}

/**
 * Call the API route for script generation
 */
async function callAPIRoute(profileData: ProfileFormData): Promise<string> {
  // console.log('Calling API route with profile data');
  
  const response = await fetch('/api/generate-script', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });
    
  // console.log('API route response status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    // console.error(`API route failed: ${response.status}`, errorText);
    throw new Error(`API route failed: ${response.status} - ${errorText}`);
  }
  
  const result = await response.json();
  // console.log('API route returned script with length:', result.script ? result.script.length : 0);
  return result.script;
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
    id: generateUniqueId(),
    content: script,
    timestamp: new Date().toISOString(),
    source
  };
  
  try {
    // Get existing versions and add new one at the beginning
    const existingVersions = getScriptVersions(profileId);
    const versions = [version, ...existingVersions];
    localStorage.setItem(`script_versions_${profileId}`, JSON.stringify(versions));
    return version;
  } catch (error) {
    // console.error('Error saving script version:', error);
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
    // console.error('Error getting script versions:', error);
    return [];
  }
}
