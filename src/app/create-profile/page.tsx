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
        <p className="font-sans-body text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (status === 'authenticated') {
    return (
      <div className="container max-w-4xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="space-y-8">
          <div className="space-y-3">
            <span className="font-sans-body text-xs uppercase tracking-[0.2em] text-muted-foreground">Step 1 of 5</span>
            <h1 className="font-display italic text-3xl sm:text-4xl font-semibold text-foreground">
              Create Your Profile
            </h1>
            <p className="font-sans-body text-muted-foreground sm:text-lg">
              Tell us about yourself and we&apos;ll craft your AI-powered video business card.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 sm:p-8 shadow-sm">
            <div className="space-y-5">
              <div className="space-y-1.5">
                <h2 className="font-display text-xl font-semibold text-foreground">Profile Information</h2>
                <p className="font-sans-body text-sm text-muted-foreground">
                  We&apos;ll use this to personalize your video business card.
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
