'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ProfileFormData, FormErrors } from "@/types/profile";
import { 
  saveFormData, 
  saveFormDraft, 
  loadFormData, 
  defaultFormData,
  validateFormData,
  validateField,
  autoSaveFormData
} from "@/lib/form-utils";

export function UserProfileForm() {
  // State for form data and UI status
  const [formData, setFormData] = useState<ProfileFormData>(defaultFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [dirtyFields, setDirtyFields] = useState<Set<keyof ProfileFormData>>(new Set());

  // Load existing form data on component mount
  useEffect(() => {
    const existingData = loadFormData();
    if (existingData) {
      setFormData(existingData);
    }
  }, []);

  // Auto-save when form data changes
  useEffect(() => {
    if (dirtyFields.size > 0) {
      autoSaveFormData(formData);
    }
  }, [formData, dirtyFields]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Mark field as dirty
    setDirtyFields(prev => {
      const updated = new Set(prev);
      updated.add(id as keyof ProfileFormData);
      return updated;
    });
    
    // Validate field on change
    const fieldError = validateField(
      { ...formData, [id]: value },
      id as keyof ProfileFormData
    );
    
    // Update errors
    setErrors(prev => ({
      ...prev,
      [id]: fieldError
    }));
  };

  // Handle save draft
  const handleSaveDraft = () => {
    setIsSaving(true);
    
    try {
      saveFormDraft(formData);
      setSaveMessage("Draft saved successfully!");
      
      // Clear save message after 3 seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error saving draft:", error);
      setSaveMessage("Error saving draft");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const formErrors = validateFormData(formData, 'basic');
    setErrors(formErrors);
    
    // Check if form is valid
    if (Object.keys(formErrors).length === 0) {
      setIsSaving(true);
      
      try {
        // Save form data
        saveFormData(formData, 'basic');
        
        // Clear dirty fields
        setDirtyFields(new Set());
        
        // Show success message
        setSaveMessage("Profile saved successfully!");
        
        // Redirect would happen here in a real implementation
      } catch (error) {
        console.error("Error saving form:", error);
        setSaveMessage("Error saving profile");
      } finally {
        setIsSaving(false);
      }
    } else {
      // Scroll to first error
      const firstErrorField = Object.keys(formErrors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="flex items-center">
              First Name 
              {errors.firstName && <span className="text-red-500 text-sm ml-1">*</span>}
            </Label>
            <Input 
              id="firstName" 
              placeholder="Enter your first name" 
              value={formData.firstName}
              onChange={handleInputChange}
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="flex items-center">
              Last Name
              {errors.lastName && <span className="text-red-500 text-sm ml-1">*</span>}
            </Label>
            <Input 
              id="lastName" 
              placeholder="Enter your last name" 
              value={formData.lastName}
              onChange={handleInputChange}
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="jobTitle" className="flex items-center">
            Job Title
            {errors.jobTitle && <span className="text-red-500 text-sm ml-1">*</span>}
          </Label>
          <Input 
            id="jobTitle" 
            placeholder="Enter your job title" 
            value={formData.jobTitle}
            onChange={handleInputChange}
            className={errors.jobTitle ? "border-red-500" : ""}
          />
          {errors.jobTitle && <p className="text-red-500 text-xs">{errors.jobTitle}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company / Organization</Label>
          <Input 
            id="company" 
            placeholder="Enter your company or organization" 
            value={formData.company}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center">
            Email
            {errors.email && <span className="text-red-500 text-sm ml-1">*</span>}
          </Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="Enter your email address" 
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location (optional)</Label>
          <Input 
            id="location" 
            placeholder="City, Country" 
            value={formData.location || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn URL (optional)</Label>
          <Input 
            id="linkedin" 
            placeholder="https://linkedin.com/in/yourprofile" 
            value={formData.linkedin || ""}
            onChange={handleInputChange}
            className={errors.linkedin ? "border-red-500" : ""}
          />
          {errors.linkedin && <p className="text-red-500 text-xs">{errors.linkedin}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website (optional)</Label>
          <Input 
            id="website" 
            placeholder="https://yourwebsite.com" 
            value={formData.website || ""}
            onChange={handleInputChange}
            className={errors.website ? "border-red-500" : ""}
          />
          {errors.website && <p className="text-red-500 text-xs">{errors.website}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="professionalBio">Professional Bio (optional)</Label>
          <textarea
            id="professionalBio"
            className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Write a brief summary about yourself and your professional background"
            value={formData.professionalBio || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Auto-save indicator */}
      {dirtyFields.size > 0 && !saveMessage && (
        <div className="text-xs text-muted-foreground italic">
          Changes will be auto-saved
        </div>
      )}

      {/* Save message */}
      {saveMessage && (
        <div className={`text-sm px-2 py-1 rounded-md inline-flex items-center ${
          saveMessage.includes("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
        }`}>
          {saveMessage.includes("Error") ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M20 6L9 17l-5-5"></path>
            </svg>
          )}
          {saveMessage}
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Draft"}
        </Button>
        <Link href="/create-profile/interests">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Next: Interests & Skills"}
          </Button>
        </Link>
      </div>
    </form>
  );
}