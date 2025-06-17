'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation'; // For redirecting unauthenticated users
import { useEffect, useState } from 'react'; // Added useState
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card components

// Profile data structure - matches expected API response
interface UserProfile {
  name?: string;
  bio?: string;
  interests?: string[];
  linkedin_url?: string | null;
  github_url?: string | null;
  personal_website_url?: string | null;
  avatar_url?: string | null;
  video_intro_url?: string | null;
  // Add other fields as necessary
}

export default function MyProfilePage() {
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/api/auth/signin'); // Or your app's login page
    }
  }, [status]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (status === 'authenticated') {
        setIsLoadingProfile(true);
        setProfileError(null);
        try {
          const response = await fetch('/api/user-profile');
          if (response.ok) {
            const data = await response.json();
            setProfileData(data);
          } else if (response.status === 404) {
            setProfileError('Profile not found. You might need to create one.');
            setProfileData(null);
          } else {
            const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
            setProfileError(errorData.error || 'Failed to fetch profile.');
            setProfileData(null);
          }
        } catch (err) {
          setProfileError('A network error occurred while fetching profile.');
          setProfileData(null);
        } finally {
          setIsLoadingProfile(false);
        }
      }
    };

    fetchProfileData();
  }, [status, session]); // session is included as fetch depends on authenticated user

  if (status === 'loading') {
    return <p>Loading session...</p>;
  }

  if (status === 'unauthenticated' || !session) {
    // This case might be brief due to the redirect in useEffect,
    // but it's good practice to handle it.
    return <p>Access Denied. Please log in.</p>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Information Section */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingProfile && <p>Loading profile details...</p>}
            {profileError && !isLoadingProfile && <p className="text-red-500">Error: {profileError}</p>}
            {!isLoadingProfile && profileData && (
              <div className="space-y-2">
                <p><strong>Name:</strong> {profileData.name || 'Not set'}</p>
                <p><strong>Bio:</strong> {profileData.bio || 'Not set'}</p>
                <p><strong>Interests:</strong> {profileData.interests?.join(', ') || 'Not set'}</p>
                {profileData.linkedin_url && (
                  <p><strong>LinkedIn:</strong> <a href={profileData.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{profileData.linkedin_url}</a></p>
                )}
                {profileData.github_url && (
                  <p><strong>GitHub:</strong> <a href={profileData.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{profileData.github_url}</a></p>
                )}
                {profileData.personal_website_url && (
                  <p><strong>Website:</strong> <a href={profileData.personal_website_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{profileData.personal_website_url}</a></p>
                )}
                {profileData.avatar_url && (
                  <div>
                    <p><strong>Avatar:</strong></p>
                    <img src={profileData.avatar_url} alt="User Avatar" className="w-24 h-24 rounded-full object-cover mt-1" />
                  </div>
                )}
              </div>
            )}
            {!isLoadingProfile && !profileData && !profileError && (
              <p>No profile data found. You might need to create your profile.</p>
            )}
          </CardContent>
        </Card>

        {/* Video Introduction Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Video Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingProfile && <p>Loading video information...</p>}
            {profileError && !isLoadingProfile && (
              <p className="text-red-500">Could not load video information: {profileError.includes("Profile not found") ? "Profile not found." : profileError}</p>
            )}
            {!isLoadingProfile && !profileError && profileData?.video_intro_url && (
              <div
                className="aspect-video w-full rounded-lg overflow-hidden shadow-lg bg-muted"
                dangerouslySetInnerHTML={{ __html: profileData.video_intro_url }}
              />
            )}
            {!isLoadingProfile && !profileError && (!profileData || !profileData.video_intro_url) && (
              <p>You haven't added a video introduction yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
