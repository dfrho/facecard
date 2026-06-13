import { ProfileFormData, ScriptVersion } from "@/types/profile";
import { generateUniqueId } from './script-utils';

/**
 * Generate a script using OpenAI based on profile data
 */
export async function generateScript(profileData: ProfileFormData): Promise<string> {
  try {
    return await callAPIRoute(profileData);
  } catch (error) {
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
