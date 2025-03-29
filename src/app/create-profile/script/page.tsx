'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileFormData, ScriptVersion } from '@/types/profile';
import { loadFormData, saveFormData, mergeFormData, saveCurrentStep } from '@/lib/form-utils';
import { generateScript, saveScriptVersion, getScriptVersions } from '@/lib/openai-enhanced';

export default function ScriptPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProfileFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const [editedScript, setEditedScript] = useState('');
  const [scriptVersions, setScriptVersions] = useState<ScriptVersion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScriptHistory, setShowScriptHistory] = useState(false);

  const getProfileId = useCallback((data: ProfileFormData): string => {
    return `${data.firstName}-${data.lastName}-${data.email}`.toLowerCase().replace(/\s+/g, '-');
  }, []);

  const generateScriptFromProfile = useCallback(async (data: ProfileFormData) => {
    setIsGenerating(true);
    setError(null);

    try {
      const script = await generateScript(data);

      setGeneratedScript(script);
      setEditedScript(script);

      const profileId = getProfileId(data);
      const version = await saveScriptVersion(script, profileId, 'ai');
      setScriptVersions(prev => [version, ...prev]);
    } catch (error) {
      console.error('Error generating script:', error);
      setError('Failed to generate script. Please try again.');
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
    }
  }, [getProfileId, setGeneratedScript, setEditedScript, setScriptVersions, setError, setIsGenerating, setIsLoading]);

  // Load profile data from previous steps
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const storedData = loadFormData();

        if (storedData) {
          setFormData(storedData);
          saveCurrentStep('script');

          if (storedData.generatedScript) {
            setGeneratedScript(storedData.generatedScript);
            setEditedScript(storedData.generatedScript);

            const versions = getScriptVersions(getProfileId(storedData));
            setScriptVersions(versions);

            setIsLoading(false);
          } else {
            await generateScriptFromProfile(storedData);
          }
        } else {
          router.push('/create-profile');
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
        setError('Failed to load profile data. Please go back and try again.');
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [router, generateScriptFromProfile, getProfileId]);

  const handleRegenerateScript = async () => {
    if (formData) {
      await generateScriptFromProfile(formData);
    }
  };

  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedScript(e.target.value);

    const saveEdits = async () => {
      if (formData) {
        const profileId = getProfileId(formData);
        const version = await saveScriptVersion(e.target.value, profileId, 'user');
        setScriptVersions(prev => [version, ...prev]);
      }
    };

    const timeoutId = setTimeout(saveEdits, 2000);
    return () => clearTimeout(timeoutId);
  };

  const loadScriptVersion = (version: ScriptVersion) => {
    setEditedScript(version.content);
    setShowScriptHistory(false);
  };

  const handleNextStep = () => {
    if (!formData) return;

    setIsSubmitting(true);

    try {
      const updatedFormData = mergeFormData(formData, {
        generatedScript: editedScript,
      });

      saveFormData(updatedFormData, 'script');
      router.push('/create-profile/video');
    } catch (error) {
      console.error('Error saving script:', error);
      setError('Failed to save script. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl px-4 sm:px-6 py-8 sm:py-10 md:py-12 flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl px-4 sm:px-6 py-8 sm:py-10 md:py-12">
      <div className="space-y-6">
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold">Your AI-Generated Script</h1>
          <p className="text-muted-foreground sm:text-lg">
            Review and edit your personalized video script below.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4 sm:p-6 shadow-sm">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Script Preview</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowScriptHistory(!showScriptHistory)}
                >
                  {showScriptHistory ? 'Hide History' : 'Show History'}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                This script has been generated based on your profile information.
              </p>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 mb-6">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {showScriptHistory && scriptVersions.length > 0 && (
              <div className="space-y-3 mb-4">
                <h3 className="font-medium">Script History</h3>
                <div className="max-h-40 overflow-y-auto space-y-2 border rounded-md p-3">
                  {scriptVersions.map(version => (
                    <div
                      key={version.id}
                      className="flex justify-between items-center text-sm p-2 rounded hover:bg-muted cursor-pointer"
                      onClick={() => loadScriptVersion(version)}
                    >
                      <div className="flex items-center">
                        <span
                          className={`mr-2 px-2 py-0.5 rounded-full text-xs ${
                            version.source === 'ai'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {version.source === 'ai' ? 'AI' : 'You'}
                        </span>
                        <span className="text-muted-foreground">
                          {new Date(version.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <Button size="sm" variant="ghost">
                        Load
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isGenerating ? (
              <div className="flex flex-col items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                <p className="text-muted-foreground">Generating your personalized script...</p>
              </div>
            ) : (
              <>
                <div className="rounded-md border bg-muted/20 p-6">
                  <blockquote className="italic whitespace-pre-line">{generatedScript}</blockquote>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      className="w-full max-w-md"
                      onClick={handleRegenerateScript}
                      disabled={isGenerating}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4"
                      >
                        <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z" />
                      </svg>
                      Regenerate Script
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Edit Script</h3>
                    <textarea
                      className="flex h-48 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={editedScript}
                      onChange={handleScriptChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Your edits are automatically saved as you type.
                    </p>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-between">
              <Link href="/create-profile/interests">
                <Button variant="outline">Back</Button>
              </Link>
              <Button
                onClick={handleNextStep}
                disabled={isGenerating || !editedScript.trim() || isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Next: Generate Video'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
