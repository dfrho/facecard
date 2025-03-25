import { ProfileFormData } from "@/types/profile";

/**
 * API service for communicating with back-end endpoints
 */

/**
 * Generate a script using the server-side API
 */
export async function generateScriptAPI(profileData: ProfileFormData): Promise<string> {
  try {
    const response = await fetch('/api/generate-script', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`API error: ${response.status} ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.script;
  } catch (error) {
    console.error('Error calling generate script API:', error);
    throw error;
  }
}

/**
 * Upload a profile photo
 * This is a placeholder for a real implementation that would upload to a server or cloud storage
 */
export async function uploadProfilePhoto(file: File): Promise<string> {
  // In a real implementation, this would upload the file to a server or cloud storage
  // For now, we'll just create a data URL
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      reject(error);
    }
  });
}

/**
 * Save a user profile to the server
 * This is a placeholder for a real implementation that would save to a database
 */
export async function saveUserProfile(profileData: ProfileFormData): Promise<{ success: boolean, profileId?: string }> {
  // In a real implementation, this would save the profile to a database
  try {
    // Simulate an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a profile ID
    const profileId = `${profileData.firstName}-${profileData.lastName}-${Date.now()}`.toLowerCase().replace(/\s+/g, '-');
    
    return { 
      success: true, 
      profileId 
    };
  } catch (error) {
    console.error('Error saving profile:', error);
    return { success: false };
  }
}

/**
 * Generate a video using HeyGen API
 * This is a placeholder for a real implementation
 */
export async function generateVideo(script: string, options: {
  avatarStyle?: string;
  backgroundColor?: string;
  voiceType?: string;
}): Promise<{ videoUrl: string, thumbnailUrl: string }> {
  // In a real implementation, this would call the HeyGen API
  try {
    // Simulate an API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Return placeholder URLs
    return {
      videoUrl: 'https://example.com/video.mp4',
      thumbnailUrl: 'https://example.com/thumbnail.jpg'
    };
  } catch (error) {
    console.error('Error generating video:', error);
    throw new Error('Failed to generate video. Please try again.');
  }
}

/**
 * Provide health check to ensure API is responsive
 */
export async function apiHealthCheck(): Promise<boolean> {
  try {
    const response = await fetch('/api/health', {
      method: 'GET',
      cache: 'no-store',
    });
    
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
}