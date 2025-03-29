'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProfileFormData } from "@/types/profile";
import { loadFormData, saveFormData, mergeFormData, saveCurrentStep } from "@/lib/form-utils";

export default function InterestsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProfileFormData | null>(null);
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [achievements, setAchievements] = useState("");
  const [seeking, setSeeking] = useState("");
  const [idealConnection, setIdealConnection] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing form data when the component mounts
  useEffect(() => {
    const storedData = loadFormData();
    if (storedData) {
      setFormData(storedData);
      
      // Initialize form fields with stored values if they exist
      if (storedData.skills) setSkills(storedData.skills);
      if (storedData.interests && Array.isArray(storedData.interests)) {
        setInterests(storedData.interests.join(", "));
      }
      if (storedData.achievements) setAchievements(storedData.achievements);
      if (storedData.seeking) setSeeking(storedData.seeking);
      if (storedData.idealConnection) setIdealConnection(storedData.idealConnection);
    } else {
      // If no data exists, redirect to the first step
      router.push("/create-profile");
    }
  }, [router]);

  const handleGenerateScript = () => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData) {
        setError("Profile data not found. Please start from the beginning.");
        setIsSubmitting(false);
        return;
      }

      // Process interests into an array
      const interestsArray = interests
        .split(",")
        .map(item => item.trim())
        .filter(item => item.length > 0);

      // Update the form data with interests information
      const updatedFormData = mergeFormData(formData, {
        skills: skills,
        interests: interestsArray,
        achievements: achievements,
        seeking: seeking,
        idealConnection: idealConnection,
      });

      // Save the updated form data and mark this step as completed
      saveFormData(updatedFormData, 'interests');
      saveCurrentStep('interests');

      // Navigate to the script page
      router.push("/create-profile/script");
    } catch (error) {
      console.error("Error saving interests data:", error);
      setError("Failed to save your information. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-4xl py-12">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create Your Profile</h1>
          <p className="text-muted-foreground">
            Tell us about your skills and interests to complete your AI-powered video business card.
          </p>
        </div>
        
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Step 2: Skills & Interests</h2>
              <p className="text-sm text-muted-foreground">
                These details will help us generate an engaging script that highlights your unique value.
              </p>
            </div>
            
            <form className="space-y-6">
              <div className="space-y-4">
                {error && (
                  <div className="p-3 rounded-md bg-red-50 text-red-800 text-sm">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="skills">Professional Skills</Label>
                  <Input 
                    id="skills" 
                    placeholder="e.g., Project Management, Web Development, Data Analysis" 
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple skills with commas
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="interests">Professional Interests</Label>
                  <Input 
                    id="interests" 
                    placeholder="e.g., Artificial Intelligence, Blockchain, Sustainability" 
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple interests with commas
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="achievements">Key Achievements</Label>
                  <textarea
                    id="achievements"
                    className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Briefly describe 2-3 of your most significant professional achievements"
                    value={achievements}
                    onChange={(e) => setAchievements(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="seeking">What are you currently seeking?</Label>
                  <select 
                    id="seeking"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={seeking}
                    onChange={(e) => setSeeking(e.target.value)}
                  >
                    <option value="" disabled>Select an option</option>
                    <option value="new_opportunities">New Career Opportunities</option>
                    <option value="networking">Professional Networking</option>
                    <option value="clients">New Clients</option>
                    <option value="partnerships">Business Partnerships</option>
                    <option value="investors">Investors</option>
                    <option value="mentorship">Mentorship</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ideal_connection">Describe your ideal connection</Label>
                  <textarea
                    id="ideal_connection"
                    className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Who would you most like to connect with and why?"
                    value={idealConnection}
                    onChange={(e) => setIdealConnection(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex justify-between">
                <Link href="/create-profile">
                  <Button type="button" variant="outline">Back</Button>
                </Link>
                <div className="space-x-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      if (formData) {
                        // Save as draft without proceeding
                        const draftData = mergeFormData(formData, {
                          skills: skills,
                          interests: interests.split(",").map(item => item.trim()).filter(item => item.length > 0),
                          achievements: achievements,
                          seeking: seeking,
                          idealConnection: idealConnection,
                        });
                        saveFormData(draftData);
                      }
                    }}
                  >
                    Save Draft
                  </Button>
                  <Button 
                    type="button"
                    onClick={handleGenerateScript}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Generate Script"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}