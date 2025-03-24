"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ProfileFormData } from "@/types/profile";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function InterestsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProfileFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Available interests to choose from
  const availableInterests = [
    "Artificial Intelligence", "Marketing", "Finance", "Design",
    "Product Management", "Sales", "Business Development",
    "Leadership", "Venture Capital", "Startups", "E-commerce",
    "Data Science", "Mobile Development", "Web Development",
    "Public Speaking", "Writing", "Creative Direction",
    "Growth Hacking", "Social Media", "SEO", "Content Creation"
  ];

  // Load previous form data
  useEffect(() => {
    const loadProfileData = () => {
      const savedData = sessionStorage.getItem('profileFormData');
      if (savedData) {
        setFormData(JSON.parse(savedData));
      } else {
        // If no data, go back to first step
        router.push('/create-profile');
      }
      setIsLoading(false);
    };

    const timer = setTimeout(loadProfileData, 300);
    return () => clearTimeout(timer);
  }, [router]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(interest)) {
        return prev.filter(item => item !== interest);
      } else {
        return [...prev, interest];
      }
    });
  };

  const handleNextStep = () => {
    if (!formData) return;

    // Combine previous form data with interests
    const updatedFormData: ProfileFormData = {
      ...formData,
      interests: selectedInterests
    };

    // Save to session storage
    sessionStorage.setItem('profileFormData', JSON.stringify(updatedFormData));

    // Navigate to next step
    router.push('/create-profile/script');
  };

  const handleBackStep = () => {
    if (!formData) return;
    
    // Save selected interests before going back
    const updatedFormData: ProfileFormData = {
      ...formData,
      interests: selectedInterests
    };

    // Update session storage
    sessionStorage.setItem('profileFormData', JSON.stringify(updatedFormData));

    // Go back to previous step
    router.push('/create-profile');
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
          <h1 className="text-2xl sm:text-3xl font-bold">Your Interests & Skills</h1>
          <p className="text-muted-foreground sm:text-lg">
            Select topics you&apos;re interested in or skilled at to help us create a more personalized script.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4 sm:p-6 shadow-sm">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold">Step 2: Interests & Skills</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Select at least 3-5 interests or skills that represent you professionally.
              </p>
            </div>

            <div className="space-y-4">
              <Label>Your Professional Interests & Skills</Label>
              <div className="flex flex-wrap gap-2">
                {availableInterests.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      selectedInterests.includes(interest)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background hover:bg-muted border-input'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
              {selectedInterests.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {selectedInterests.length} selected
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={handleBackStep}
              >
                Back to Profile
              </Button>
              <Button
                type="button"
                className="w-full sm:w-auto"
                onClick={handleNextStep}
                disabled={selectedInterests.length < 3}
              >
                Next: Generate Script
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}