'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ProfileFormData } from "@/types/profile";
import { loadFormData, saveFormData, saveCurrentStep } from "@/lib/form-utils";

export function ExpandedProfileForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProfileFormData | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [toneValue, setToneValue] = useState(5);
  const [introduction, setIntroduction] = useState("");
  const [superpower, setSuperpower] = useState("");
  const [otherSuperpower, setOtherSuperpower] = useState("");
  const [funFact, setFunFact] = useState("");
  const [industry, setIndustry] = useState("");
  const [mainValue, setMainValue] = useState("");
  const [secondaryValue, setSecondaryValue] = useState("");
  const [audience, setAudience] = useState("");
  const [otherAudience, setOtherAudience] = useState("");
  const [primaryAsk, setPrimaryAsk] = useState("");
  const [secondaryAsk, setSecondaryAsk] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing form data when the component mounts
  useEffect(() => {
    const storedData = loadFormData();
    if (storedData) {
      setFormData(storedData);
      
      // Initialize form fields with stored values if they exist
      if (storedData.firstName) setFirstName(storedData.firstName);
      if (storedData.lastName) setLastName(storedData.lastName);
      if (storedData.jobTitle) setJobTitle(storedData.jobTitle);
      if (storedData.company) setCompany(storedData.company);
      if (storedData.email) setEmail(storedData.email);
      if (storedData.toneValue) setToneValue(storedData.toneValue);
      if (storedData.introduction) setIntroduction(storedData.introduction);
      if (storedData.superpower) setSuperpower(storedData.superpower);
      if (storedData.otherSuperpower) setOtherSuperpower(storedData.otherSuperpower);
      if (storedData.funFact) setFunFact(storedData.funFact);
      if (storedData.industry) setIndustry(storedData.industry);
      if (storedData.mainValue) setMainValue(storedData.mainValue);
      if (storedData.secondaryValue) setSecondaryValue(storedData.secondaryValue);
      if (storedData.audience) setAudience(storedData.audience);
      if (storedData.otherAudience) setOtherAudience(storedData.otherAudience);
      if (storedData.primaryAsk) setPrimaryAsk(storedData.primaryAsk);
      if (storedData.secondaryAsk) setSecondaryAsk(storedData.secondaryAsk);
      if (storedData.contactMethod) setContactMethod(storedData.contactMethod);
    }
  }, []);

  const handleSaveDraft = () => {
    try {
      // Create updated form data object
      const updatedFormData: ProfileFormData = {
        firstName,
        lastName,
        jobTitle,
        company,
        email,
        toneValue,
        introduction,
        superpower,
        otherSuperpower,
        funFact,
        industry,
        mainValue,
        secondaryValue,
        audience,
        otherAudience,
        primaryAsk,
        secondaryAsk,
        contactMethod,
        // Maintain any existing fields that aren't being updated
        ...(formData || {})
      };

      // Save to storage
      saveFormData(updatedFormData);
      
      // Show success message
      setError("Draft saved successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    } catch (error) {
      console.error("Error saving draft:", error);
      setError("Failed to save draft. Please try again.");
    }
  };

  const handleNextStep = () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Basic validation
      if (!firstName || !lastName || !email || !jobTitle) {
        setError("Please fill in all required fields: First Name, Last Name, Job Title, and Email.");
        setIsSubmitting(false);
        return;
      }

      // Create updated form data object
      const updatedFormData: ProfileFormData = {
        firstName,
        lastName,
        jobTitle,
        company,
        email,
        toneValue,
        introduction,
        superpower,
        otherSuperpower,
        funFact,
        industry,
        mainValue,
        secondaryValue,
        audience,
        otherAudience,
        primaryAsk,
        secondaryAsk,
        contactMethod,
        // Maintain any existing fields that aren't being updated
        ...(formData || {})
      };

      // Save to storage and mark step as completed
      saveFormData(updatedFormData, 'basic');
      saveCurrentStep('basic');

      // Navigate to next step
      router.push("/create-profile/interests");
    } catch (error) {
      console.error("Error saving profile data:", error);
      setError("Failed to save your information. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className={`p-3 rounded-md ${error.includes("saved successfully") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"} text-sm`}>
          {error}
        </div>
      )}
      
      {/* Basic Information */}
      <div className="space-y-5">
        <h3 className="text-base font-medium sm:text-lg">Basic Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input 
              id="firstName" 
              placeholder="Enter your first name" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input 
              id="lastName" 
              placeholder="Enter your last name" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job Title *</Label>
          <Input 
            id="jobTitle" 
            placeholder="Enter your job title" 
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company / Organization</Label>
          <Input 
            id="company" 
            placeholder="Enter your company or organization" 
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="Enter your email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Style Selector */}
      <div className="space-y-5 border-t pt-6">
        <h3 className="text-base font-medium sm:text-lg">Setting the Tone (Style Selector)</h3>
        <div className="space-y-2">
          <Label htmlFor="toneSlider">How do you want to come across?</Label>
          <div className="space-y-3">
            <input
              id="toneSlider"
              type="range"
              min="1"
              max="10"
              value={toneValue}
              onChange={(e) => setToneValue(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex flex-wrap justify-between text-xs sm:text-sm">
              <span className="mr-1">Friendly & Casual 😎</span>
              <span className="mx-1 text-center">Professional but Approachable 📢</span>
              <span className="ml-1">Straight to Business 💼</span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Introduction */}
      <div className="space-y-5 border-t pt-6">
        <h3 className="text-base font-medium sm:text-lg">Who&apos;s That? Oh, It&apos;s YOU!</h3>

        <div className="space-y-2">
          <Label htmlFor="introduction">Imagine you just walked into a room and someone introduces you. What do they say?</Label>
          <Input
            id="introduction"
            placeholder="Example: &quot;This is Sam—he&apos;s the guy who knows EVERYONE in tech!&quot;"
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="superpower">What&apos;s your superpower?</Label>
          <select
            id="superpower"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={superpower}
            onChange={(e) => setSuperpower(e.target.value)}
          >
            <option value="" disabled>Select your superpower or type your own</option>
            <option value="connect">I connect people like a human LinkedIn 🔗</option>
            <option value="ideas">I turn ideas into businesses 💡</option>
            <option value="creative">I make things look (or sound) amazing 🎨🎙️</option>
            <option value="problems">I solve impossible problems 🕵️</option>
            <option value="inspire">I inspire people to take action 🚀</option>
            <option value="vibes">I bring the good vibes 😎</option>
            <option value="other">Other (please specify below)</option>
          </select>
          <Input 
            id="otherSuperpower" 
            placeholder="Enter your own superpower" 
            className="mt-2"
            value={otherSuperpower}
            onChange={(e) => setOtherSuperpower(e.target.value)}
            disabled={superpower !== 'other'}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="funFact">What&apos;s a fun fact that makes people go, &quot;Wait…WHAT?!&quot;</Label>
          <Input
            id="funFact"
            placeholder="Example: &quot;I once sold everything I owned and moved to Bali.&quot; 🌴"
            value={funFact}
            onChange={(e) => setFunFact(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">What industry or niche are you in?</Label>
          <Input
            id="industry"
            placeholder="Be specific! E.g., &quot;AI-powered marketing automation&quot;"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Be specific! Instead of &quot;Fitness,&quot; say &quot;Strength training for busy professionals.&quot;
          </p>
        </div>
      </div>

      {/* Skills and Value */}
      <div className="space-y-5 border-t pt-6">
        <h3 className="text-base font-medium sm:text-lg">What&apos;s Your Magic? (Aka, How Can You Help?)</h3>

        <div className="space-y-2">
          <Label htmlFor="mainValue">What&apos;s the ONE thing people should reach out to you for?</Label>
          <Input
            id="mainValue"
            placeholder="Example: &quot;I help startups get their first 1,000 customers.&quot;"
            value={mainValue}
            onChange={(e) => setMainValue(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Be specific! Make it clear exactly how you can help others.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondaryValue">What&apos;s another way you bring value? (Optional)</Label>
          <Input
            id="secondaryValue"
            placeholder="Example: &quot;I also advise on content marketing for B2B brands.&quot;"
            value={secondaryValue}
            onChange={(e) => setSecondaryValue(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="audience">Who do you LOVE helping the most?</Label>
          <select
            id="audience"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          >
            <option value="" disabled>Select who you love helping most</option>
            <option value="aspiring">Aspiring entrepreneurs who don&apos;t know where to start 🚀</option>
            <option value="retention">Businesses struggling with customer retention 💰</option>
            <option value="career">People looking for their next big career move 🎯</option>
            <option value="likeminded">Just cool, like-minded people looking to connect 🤝</option>
            <option value="other">Other (please specify below)</option>
          </select>
          <Input 
            id="otherAudience" 
            placeholder="Enter who you love helping most" 
            className="mt-2"
            value={otherAudience}
            onChange={(e) => setOtherAudience(e.target.value)}
            disabled={audience !== 'other'}
          />
        </div>
      </div>

      {/* Your Ask Section */}
      <div className="space-y-5 border-t pt-6">
        <h3 className="text-base font-medium sm:text-lg">Your Ask – What You Need Help With</h3>

        <div className="space-y-2">
          <Label htmlFor="primaryAsk">Right now, what&apos;s the #1 thing you need help with?</Label>
          <Input
            id="primaryAsk"
            placeholder="Example: &quot;I&apos;m looking for beta testers for my AI tool&quot;"
            value={primaryAsk}
            onChange={(e) => setPrimaryAsk(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Make it clear! Be specific about what you&apos;re looking for.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondaryAsk">What&apos;s a secondary thing you&apos;d love support with? (Optional)</Label>
          <Input
            id="secondaryAsk"
            placeholder="Example: &quot;I need intros to potential angel investors&quot;"
            value={secondaryAsk}
            onChange={(e) => setSecondaryAsk(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactMethod">What&apos;s the best way for someone to reach you?</Label>
          <Input
            id="contactMethod"
            placeholder="Social media, email, calendar link, or just &quot;DM me&quot;"
            value={contactMethod}
            onChange={(e) => setContactMethod(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 border-t pt-6">
        <Button 
          type="button" 
          variant="outline" 
          className="w-full sm:w-auto"
          onClick={handleSaveDraft}
        >
          Save Draft
        </Button>
        <Button 
          type="button" 
          className="w-full sm:w-auto"
          onClick={handleNextStep}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Next: Interests & Skills"}
        </Button>
      </div>
    </div>
  );
}