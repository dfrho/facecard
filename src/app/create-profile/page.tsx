'use client';

import { ExpandedProfileForm } from "@/components/expanded-profile-form";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CreateProfilePage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated *after* loading is complete
    if (status === 'unauthenticated') {
      router.push('/'); // Redirect to homepage
    }
  }, [status, router]);

  // Show loading state while session is being checked
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading session...</p> 
      </div>
    );
  }

  // Only render the main content if authenticated
  if (status === 'authenticated') {
    return (
      <div className="container max-w-4xl px-4 sm:px-6 py-8 sm:py-10 md:py-12">
        <div className="space-y-6">
          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold">Create Your Profile</h1>
            <p className="text-muted-foreground sm:text-lg">
              Tell us about yourself and we&apos;ll help you create your AI-powered video business card.
            </p>
          </div>

          <div className="rounded-xl border bg-card p-4 sm:p-6 shadow-sm">
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-lg sm:text-xl font-semibold">Step 1: Profile Information</h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  We&apos;ll use this information to personalize your video business card.
                </p>
              </div>
              <ExpandedProfileForm />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render nothing or a placeholder if unauthenticated (useEffect handles redirect)
  return null;
}
