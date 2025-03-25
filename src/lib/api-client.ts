import { ProfileFormData, VideoOptions } from '@/types/profile';

// API base URLs
const API_BASE_URL = '/api';

/**
 * General fetch function with error handling
 */
async function fetchWithErrorHandling<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API error: ${response.status} ${
          errorData.error || 'Unknown error'
        }`
      );
    }

    return await response.json() as T;
  } catch (error) {
    console.error('API client error:', error);
    throw error;
  }
}

/**
 * Generate a script using the API
 */
export async function generateScriptViaApi(
  profileData: ProfileFormData
): Promise<string> {
  const response = await fetchWithErrorHandling<{ script: string }>(
    `${API_BASE_URL}/generate-script`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    }
  );

  return response.script;
}

/**
 * Generate a video using the API
 */
export async function generateVideoViaApi(
  profileData: ProfileFormData,
  script: string,
  options: VideoOptions = {}
): Promise<{ videoUrl: string; previewUrl: string }> {
  const response = await fetchWithErrorHandling<{
    videoUrl: string;
    previewUrl: string;
  }>(`${API_BASE_URL}/generate-video`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      profile: profileData,
      script,
      options,
    }),
  });

  return response;
}

/**
 * Generate a shareable link for a video
 */
export async function generateShareableLink(
  profileId: string,
  videoUrl: string
): Promise<{ shareUrl: string; qrCodeUrl: string }> {
  const response = await fetchWithErrorHandling<{
    shareUrl: string;
    qrCodeUrl: string;
  }>(`${API_BASE_URL}/share`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      profileId,
      videoUrl,
    }),
  });

  return response;
}

/**
 * Check if the API is available
 * This can be used to determine whether to use client-side fallbacks
 */
export async function isApiAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
}
