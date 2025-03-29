import { ProfileFormData, ScriptVersion } from "@/types/profile";
import { generateUniqueId } from './script-utils';
import { generateEnhancedScript } from './script-generator';

// API key from environment variables
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;

/**
 * Generate a script using OpenAI based on profile data
 */
export async function generateScript(profileData: ProfileFormData): Promise<string> {
  try {
    // Check if we should use the API or fallback
    if (OPENAI_API_KEY) {
      try {
        // Log attempt to use API
        console.log('Attempting to use OpenAI API with key available:', !!OPENAI_API_KEY);
        
        // First try the API route
        return await callAPIRoute(profileData);
      } catch (apiError) {
        console.warn('API route failed:', apiError);
        // Fall back to local generation
        await new Promise(resolve => setTimeout(resolve, 1000));
        return generateEnhancedScript(profileData);
      }
    } else {
      // No API key available, use the enhanced template
      console.log('No OpenAI API key available, using enhanced template');
      await new Promise(resolve => setTimeout(resolve, 1500));
      return generateEnhancedScript(profileData);
    }
  } catch (error) {
    console.error('Error generating script:', error);
    throw new Error('Failed to generate script. Please try again.');
  }
}

/**
 * Call the API route for script generation
 */
async function callAPIRoute(profileData: ProfileFormData): Promise<string> {
  const response = await fetch('/api/generate-script', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });
  
  if (!response.ok) {
    throw new Error(`API route failed: ${response.status}`);
  }
  
  const result = await response.json();
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
    console.error('Error saving script version:', error);
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
    console.error('Error getting script versions:', error);
    return [];
  }
}
