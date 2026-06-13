'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { loadFormData } from '@/lib/form-utils';
import { ProfileFormData } from '@/types/profile';

interface ResumeDest {
  href: string;
  label: string;
  step: number;
  stepName: string;
}

function getResumeDest(data: ProfileFormData): ResumeDest {
  if (data.generatedScript || data.completedSteps?.includes('script')) {
    return { href: '/create-profile/video', label: 'Continue to Recording', step: 4, stepName: 'Record Your Video' };
  }
  if (data.completedSteps?.includes('interests')) {
    return { href: '/create-profile/script', label: 'Generate Your Script', step: 3, stepName: 'Your Script' };
  }
  if (data.completedSteps?.some(s => ['basic', 'introduction', 'value', 'ask'].includes(s))) {
    return { href: '/create-profile/interests', label: 'Continue to Skills & Interests', step: 2, stepName: 'Skills & Interests' };
  }
  return { href: '/create-profile', label: 'Continue Your Profile', step: 1, stepName: 'Create Your Profile' };
}

export function ResumeCard() {
  const { data: session, status } = useSession();
  const [dest, setDest] = useState<ResumeDest | null>(null);
  const [firstName, setFirstName] = useState<string>('');

  useEffect(() => {
    if (status !== 'authenticated') return;

    const data = loadFormData();
    if (!data) return;

    const hasProgress =
      (data.completedSteps && data.completedSteps.length > 0) ||
      Boolean(data.generatedScript);

    if (!hasProgress) return;

    setDest(getResumeDest(data));
    setFirstName(data.firstName || session?.user?.name?.split(' ')[0] || '');
  }, [status, session]);

  if (status !== 'authenticated' || !dest) return null;

  return (
    <section className="container px-4 md:px-6 py-6">
      <div className="rounded-xl border border-border bg-card px-6 py-5 sm:px-8 sm:py-6 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
        <div className="flex-1 space-y-1.5">
          <p className="font-sans-body text-xs uppercase tracking-[0.2em] text-primary">
            {firstName ? `Welcome back, ${firstName}` : 'Welcome back'}
          </p>
          <h2 className="font-display italic text-xl font-semibold text-foreground">
            Pick up where you left off.
          </h2>
          <p className="font-sans-body text-sm text-muted-foreground">
            Step {dest.step} of 5 — {dest.stepName}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href={dest.href}>
            <Button size="sm" className="gap-2">
              {dest.label}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Button>
          </Link>
          <Link href="/create-profile" className="font-sans-body text-sm text-muted-foreground hover:text-foreground transition-colors">
            Start over
          </Link>
        </div>
      </div>
    </section>
  );
}
