'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';

const messages: Record<string, { heading: string; body: string }> = {
  OAuthAccountNotLinked: {
    heading: 'Sign in with your original account.',
    body: 'An account with this email address already exists, but it was created with a different sign-in method. Please use the same provider you signed in with originally — either Google or LinkedIn.',
  },
  OAuthSignin: {
    heading: 'Sign-in failed.',
    body: 'Something went wrong starting the sign-in flow. Please try again.',
  },
  OAuthCallback: {
    heading: 'Sign-in could not complete.',
    body: 'There was a problem returning from the sign-in provider. Please try again.',
  },
  AccessDenied: {
    heading: 'Access denied.',
    body: 'You do not have permission to sign in. Please contact support if you believe this is a mistake.',
  },
  Configuration: {
    heading: 'Server configuration error.',
    body: 'There is a problem with the server configuration. Please contact support.',
  },
  Default: {
    heading: 'Something went wrong.',
    body: 'An unexpected error occurred during sign-in. Please try again.',
  },
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') ?? 'Default';
  const { heading, body } = messages[error] ?? messages.Default;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-3">
          <span className="font-sans-body text-xs uppercase tracking-[0.2em] text-destructive">
            Sign-in error
          </span>
          <h1 className="font-display italic text-3xl font-semibold text-foreground sm:text-4xl">
            {heading}
          </h1>
          <p className="font-sans-body text-muted-foreground leading-relaxed">
            {body}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-3">
          <p className="font-sans-body text-sm font-medium text-foreground">Try signing in again</p>
          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              className="w-full gap-3 font-sans-body"
              onClick={() => window.location.href = '/api/auth/signin/google?callbackUrl=/create-profile'}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </Button>
            <Button
              className="w-full gap-3 font-sans-body bg-[#0077B5] hover:bg-[#006399] text-white"
              onClick={() => window.location.href = '/api/auth/signin/linkedin?callbackUrl=/create-profile'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Sign in with LinkedIn
            </Button>
          </div>
        </div>

        <Link href="/" className="inline-block font-sans-body text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <ErrorContent />
    </Suspense>
  );
}
