"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function VideoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  // Load profile data from previous steps
  useEffect(() => {
    const loadProfileData = () => {
      const savedData = sessionStorage.getItem('profileFormData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        
        // If there's no script saved, go back to script page
        if (!parsedData.generatedScript) {
          router.push('/create-profile/script');
          return;
        }
      } else {
        // If no data, go back to first step
        router.push('/create-profile');
        return;
      }
      setIsLoading(false);
    };
    
    const timer = setTimeout(loadProfileData, 500);
    return () => clearTimeout(timer);
  }, [router]);

  // Simulate video generation
  const handleGenerateVideo = () => {
    setIsGenerating(true);
    
    // In a real implementation, this would call an API like HeyGen
    // For now, we'll simulate the generation with a timeout
    setTimeout(() => {
      setIsGenerating(false);
      setVideoReady(true);
    }, 3000);
  };

  // Share video page
  const handleShare = () => {
    // In a real implementation, this would create a shareable link
    alert("Your video business card is ready to share!");
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
          <h1 className="text-2xl sm:text-3xl font-bold">Your Video Business Card</h1>
          <p className="text-muted-foreground sm:text-lg">
            Generate your AI-powered video using your personalized script.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4 sm:p-6 shadow-sm">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Video Preview</h2>
              <p className="text-sm text-muted-foreground">
                Your AI-generated video business card will appear here.
              </p>
            </div>

            <div className="rounded-md border bg-muted/20 p-4 flex items-center justify-center">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center p-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                  <p className="text-muted-foreground">Generating your AI video...</p>
                  <p className="text-xs text-muted-foreground mt-2">This may take a minute</p>
                </div>
              ) : videoReady ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-full max-w-md aspect-video bg-gradient-to-b from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Your video is ready!</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Click the play button to preview your AI-generated video business card.
                  </p>
                  <div className="flex space-x-3">
                    <Button onClick={handleShare} className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                        <polyline points="16 6 12 2 8 6"></polyline>
                        <line x1="12" y1="2" x2="12" y2="15"></line>
                      </svg>
                      Share Video
                    </Button>
                    <Button variant="outline" onClick={() => setVideoReady(false)}>
                      Regenerate
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-full max-w-md aspect-video bg-gradient-to-b from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                      <line x1="7" y1="2" x2="7" y2="22"></line>
                      <line x1="17" y1="2" x2="17" y2="22"></line>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <line x1="2" y1="7" x2="7" y2="7"></line>
                      <line x1="2" y1="17" x2="7" y2="17"></line>
                      <line x1="17" y1="17" x2="22" y2="17"></line>
                      <line x1="17" y1="7" x2="22" y2="7"></line>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Ready to generate your video</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Click the button below to generate your AI-powered video business card using your script.
                  </p>
                  <Button onClick={handleGenerateVideo}>Generate Video</Button>
                </div>
              )}
            </div>

            <div className="rounded-md border bg-muted/10 p-4">
              <h3 className="text-base font-medium mb-2">Your Script</h3>
              <blockquote className="italic text-sm whitespace-pre-line p-3 bg-background rounded border">
                {formData?.generatedScript || "No script found"}
              </blockquote>
            </div>

            <div className="flex justify-between">
              <Link href="/create-profile/script">
                <Button variant="outline">Back to Script</Button>
              </Link>
              <Link href="/">
                <Button 
                  variant={videoReady ? "default" : "outline"}
                  disabled={!videoReady}
                >
                  Finish
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}