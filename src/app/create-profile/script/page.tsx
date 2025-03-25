"use client";

import { Button } from "@/components/ui/button";
import { ProfileFormData } from "@/types/profile";
import { loadFormData, saveFormData, mergeFormData } from "@/lib/form-utils";
import { generateScript } from "@/lib/openai-service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ScriptPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProfileFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState("");
  const [editedScript, setEditedScript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load profile data from previous steps
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // Use the form utility to load data
        const storedData = loadFormData();
        
        if (storedData) {
          setFormData(storedData);
          
          // If there's already a generated script, use it
          if (storedData.generatedScript) {
            setGeneratedScript(storedData.generatedScript);
            setEditedScript(storedData.generatedScript);
            setIsLoading(false);
          } else {
            // Otherwise generate a new script
            await generateScriptFromProfile(storedData);
          }
        } else {
          // If no data, go back to first step
          router.push('/create-profile');
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
        setError('Failed to load profile data. Please go back and try again.');
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [router]);

  // Function to generate a script based on form data
  const generateScriptFromProfile = async (data: ProfileFormData) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Call our script generation service
      const script = await generateScript(data);
      setGeneratedScript(script);
      setEditedScript(script);
    } catch (error) {
      console.error('Error generating script:', error);
      setError('Failed to generate script. Please try again.');
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
    }
  };

  // Handle script regeneration
  const handleRegenerateScript = async () => {
    if (formData) {
      await generateScriptFromProfile(formData);
    }
  };

  // Handle script editing
  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedScript(e.target.value);
  };

  // Continue to next step
  const handleNextStep = () => {
    if (!formData) return;
    
    setIsSubmitting(true);
    
    try {
      // Add the edited script to the form data
      const updatedFormData = mergeFormData(formData, {
        generatedScript: editedScript
      });
      
      // Save to storage
      saveFormData(updatedFormData);
      
      // Navigate to next step
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
              <h2 className="text-xl font-semibold">Script Preview</h2>
              <p className="text-sm text-muted-foreground">
                This script has been generated based on your profile information.
              </p>
            </div>
            
            {error && (
              <div className="rounded-md bg-red-50 p-4 mb-6">
                <div className="flex">
                  <div className="text-sm text-red-700">
                    <p>{error}</p>
                  </div>
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
                  <blockquote className="italic whitespace-pre-line">
                    {generatedScript}
                  </blockquote>
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
                        <path d="M14.5 9.5 16 7" />
                        <path d="m16.5 11.5 2-1.5" />
                        <path d="M14.5 14.5 16 17" />
                        <path d="M10.5 14.5 9 17" />
                        <path d="M8.5 11.5 6.5 10" />
                        <path d="M10.5 9.5 9 7" />
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