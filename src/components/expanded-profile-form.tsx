'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProfileFormData, FormErrors } from '@/types/profile';
import { 
  defaultFormData, 
  saveFormDraft, 
  saveFormData, 
  loadFormData, 
  validateFormData 
} from '@/lib/form-utils';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function ExpandedProfileForm() {
  const router = useRouter();

  // State to manage form data
  const [formData, setFormData] = useState<ProfileFormData>(defaultFormData);

  // State for form validation
  const [errors, setErrors] = useState<FormErrors>({});

  // State for loading/submitting
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for showing save confirmation
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  // Load saved draft or persisted data on component mount
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const storedData = loadFormData();
        if (storedData) {
          // Ensure toneValue is a number
          if (storedData.toneValue) {
            storedData.toneValue = Number(storedData.toneValue);
          }
          setFormData(storedData);
        }
      } catch (error) {
        console.error('Error loading saved form data:', error);
        // If there's an error parsing the JSON, use the default form data
        setFormData(defaultFormData);
      }
    };

    loadSavedData();
  }, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;

    // Handle numeric inputs (like range sliders)
    if (type === 'range' || type === 'number') {
      setFormData(prev => ({
        ...prev,
        [id]: Number(value),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value,
      }));
    }

    // Clear error for this field when user types
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: '',
      }));
    }
  };

  // Handle select changes
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));

    // Clear error for this field when user selects
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: '',
      }));
    }
  };

  // Save form data as draft
  const saveDraft = () => {
    try {
      // Use our utility function to save the draft
      saveFormDraft(formData);

      // Show confirmation message
      setShowSaveConfirmation(true);

      // Hide confirmation message after 3 seconds
      setTimeout(() => {
        setShowSaveConfirmation(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('There was an error saving your draft. Please try again.');
    }
  };

  // Custom validation function that extends our utility validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields validation with improved checks
    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length > 50) {
      newErrors.firstName = 'First name must be under 50 characters';
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length > 50) {
      newErrors.lastName = 'Last name must be under 50 characters';
    }

    if (!formData.jobTitle?.trim()) {
      newErrors.jobTitle = 'Job title is required';
    } else if (formData.jobTitle.length > 100) {
      newErrors.jobTitle = 'Job title must be under 100 characters';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }

    // At least one value proposition is required
    if (!formData.mainValue?.trim()) {
      newErrors.mainValue = 'Please share what people can reach out to you for';
    } else if (formData.mainValue.length > 200) {
      newErrors.mainValue = 'Please keep your main value under 200 characters';
    }

    // If industry is provided, validate length
    if (formData.industry?.trim() && formData.industry.length > 100) {
      newErrors.industry = 'Industry description must be under 100 characters';
    }

    // If fun fact is provided, validate length
    if (formData.funFact?.trim() && formData.funFact.length > 200) {
      newErrors.funFact = 'Fun fact must be under 200 characters';
    }

    // Set the errors
    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission to next step
  const handleNextStep = () => {
    setIsSubmitting(true);
    
    if (validateForm()) {
      try {
        // Use our utility function to save form data
        saveFormData(formData);
        
        // Navigate to next step
        router.push('/create-profile/interests');
      } catch (error) {
        console.error('Error saving form data:', error);
        setIsSubmitting(false);
      }
    } else {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-5">
        <h3 className="text-base font-medium sm:text-lg">Basic Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">
              First Name {errors.firstName && <span className="text-red-500 text-sm ml-1">*</span>}
            </Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter your first name"
              className={errors.firstName ? 'border-red-500' : ''}
            />
            {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">
              Last Name {errors.lastName && <span className="text-red-500 text-sm ml-1">*</span>}
            </Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Enter your last name"
              className={errors.lastName ? 'border-red-500' : ''}
            />
            {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="jobTitle">
            Job Title {errors.jobTitle && <span className="text-red-500 text-sm ml-1">*</span>}
          </Label>
          <Input
            id="jobTitle"
            value={formData.jobTitle}
            onChange={handleInputChange}
            placeholder="Enter your job title"
            className={errors.jobTitle ? 'border-red-500' : ''}
          />
          {errors.jobTitle && <p className="text-red-500 text-xs">{errors.jobTitle}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company / Organization</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={handleInputChange}
            placeholder="Enter your company or organization"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email {errors.email && <span className="text-red-500 text-sm ml-1">*</span>}
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
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
              value={formData.toneValue}
              onChange={handleInputChange}
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
          <Label htmlFor="introduction">
            Imagine you just walked into a room and someone introduces you. What do they say?
          </Label>
          <Input
            id="introduction"
            value={formData.introduction}
            onChange={handleInputChange}
            placeholder='Example: "This is Sam—he&apos;s the guy who knows EVERYONE in tech!"'
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="superpower">What&apos;s your superpower?</Label>
          <select
            id="superpower"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.superpower}
            onChange={handleSelectChange}
          >
            <option value="" disabled>
              Select your superpower or type your own
            </option>
            <option value="connect">I connect people like a human LinkedIn 🔗</option>
            <option value="ideas">I turn ideas into businesses 💡</option>
            <option value="creative">I make things look (or sound) amazing 🎨🎙️</option>
            <option value="problems">I solve impossible problems 🕵️</option>
            <option value="inspire">I inspire people to take action 🚀</option>
            <option value="vibes">I bring the good vibes 😎</option>
            <option value="other">Other (please specify below)</option>
          </select>
          {formData.superpower === 'other' && (
            <Input
              id="otherSuperpower"
              value={formData.otherSuperpower}
              onChange={handleInputChange}
              placeholder="Enter your own superpower"
              className="mt-2"
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="funFact">
            What&apos;s a fun fact that makes people go, &quot;Wait…WHAT?!&quot;
          </Label>
          <Input
            id="funFact"
            value={formData.funFact}
            onChange={handleInputChange}
            placeholder='Example: "I once sold everything I owned and moved to Bali." 🌴'
          />
          {errors.funFact && <p className="text-red-500 text-xs">{errors.funFact}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">What industry or niche are you in?</Label>
          <Input
            id="industry"
            value={formData.industry}
            onChange={handleInputChange}
            placeholder='Be specific! E.g., "AI-powered marketing automation"'
          />
          <p className="text-xs text-muted-foreground">
            Be specific! Instead of &quot;Fitness,&quot; say &quot;Strength training for busy
            professionals.&quot;
          </p>
          {errors.industry && <p className="text-red-500 text-xs">{errors.industry}</p>}
        </div>
      </div>

      {/* Skills and Value */}
      <div className="space-y-5 border-t pt-6">
        <h3 className="text-base font-medium sm:text-lg">
          What&apos;s Your Magic? (Aka, How Can You Help?)
        </h3>

        <div className="space-y-2">
          <Label htmlFor="mainValue">
            What&apos;s the ONE thing people should reach out to you for?{' '}
            {errors.mainValue && <span className="text-red-500 text-sm ml-1">*</span>}
          </Label>
          <Input
            id="mainValue"
            value={formData.mainValue}
            onChange={handleInputChange}
            placeholder='Example: "I help startups get their first 1,000 customers."'
            className={errors.mainValue ? 'border-red-500' : ''}
          />
          {errors.mainValue ? (
            <p className="text-red-500 text-xs">{errors.mainValue}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Be specific! Make it clear exactly how you can help others.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondaryValue">
            What&apos;s another way you bring value? (Optional)
          </Label>
          <Input
            id="secondaryValue"
            value={formData.secondaryValue}
            onChange={handleInputChange}
            placeholder='Example: "I also advise on content marketing for B2B brands."'
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="audience">Who do you LOVE helping the most?</Label>
          <select
            id="audience"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.audience}
            onChange={handleSelectChange}
          >
            <option value="" disabled>
              Select who you love helping most
            </option>
            <option value="aspiring">
              Aspiring entrepreneurs who don&apos;t know where to start 🚀
            </option>
            <option value="retention">Businesses struggling with customer retention 💰</option>
            <option value="career">People looking for their next big career move 🎯</option>
            <option value="likeminded">Just cool, like-minded people looking to connect 🤝</option>
            <option value="other">Other (please specify below)</option>
          </select>
          {formData.audience === 'other' && (
            <Input
              id="otherAudience"
              value={formData.otherAudience}
              onChange={handleInputChange}
              placeholder="Enter who you love helping most"
              className="mt-2"
            />
          )}
        </div>
      </div>

      {/* Your Ask Section */}
      <div className="space-y-5 border-t pt-6">
        <h3 className="text-base font-medium sm:text-lg">Your Ask – What You Need Help With</h3>

        <div className="space-y-2">
          <Label htmlFor="primaryAsk">
            Right now, what&apos;s the #1 thing you need help with?
          </Label>
          <Input
            id="primaryAsk"
            value={formData.primaryAsk}
            onChange={handleInputChange}
            placeholder='Example: "I&apos;m looking for beta testers for my AI tool"'
          />
          <p className="text-xs text-muted-foreground">
            Make it clear! Be specific about what you&apos;re looking for.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondaryAsk">
            What&apos;s a secondary thing you&apos;d love support with? (Optional)
          </Label>
          <Input
            id="secondaryAsk"
            value={formData.secondaryAsk}
            onChange={handleInputChange}
            placeholder='Example: "I need intros to potential angel investors"'
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactMethod">What&apos;s the best way for someone to reach you?</Label>
          <Input
            id="contactMethod"
            value={formData.contactMethod}
            onChange={handleInputChange}
            placeholder='Social media, email, calendar link, or just "DM me"'
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 border-t pt-6">
        <div className="flex-1 flex items-center">
          {showSaveConfirmation && (
            <div className="inline-flex items-center px-2 py-1 rounded-md bg-green-50 text-green-700 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
              Draft saved successfully!
            </div>
          )}
        </div>
        <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={saveDraft}>
          Save Draft
        </Button>
        <Button
          type="button"
          className="w-full sm:w-auto"
          onClick={handleNextStep}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Next: Interests & Skills'}
        </Button>
      </div>
    </div>
  );
}