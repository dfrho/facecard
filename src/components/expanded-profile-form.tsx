import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React from "react";

export function ExpandedProfileForm() {
  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Basic Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" placeholder="Enter your first name" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="Enter your last name" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input id="jobTitle" placeholder="Enter your job title" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">Company / Organization</Label>
          <Input id="company" placeholder="Enter your company or organization" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter your email address" />
        </div>
      </div>

      {/* Style Selector */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-medium">Setting the Tone (Style Selector)</h3>
        <div className="space-y-2">
          <Label htmlFor="toneSlider">How do you want to come across?</Label>
          <div className="space-y-2">
            <input
              id="toneSlider"
              type="range"
              min="1"
              max="10"
              defaultValue="5"
              className="w-full"
            />
            <div className="flex justify-between text-sm">
              <span>Friendly & Casual 😎</span>
              <span>Professional but Approachable 📢</span>
              <span>Straight to Business 💼</span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Introduction */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-medium">Who's That? Oh, It's YOU!</h3>
        
        <div className="space-y-2">
          <Label htmlFor="introduction">Imagine you just walked into a room and someone introduces you. What do they say?</Label>
          <Input 
            id="introduction" 
            placeholder="Example: &quot;This is Sam—he&apos;s the guy who knows EVERYONE in tech!&quot;" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="superpower">What&apos;s your superpower?</Label>
          <select 
            id="superpower"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="" disabled selected>Select your superpower or type your own</option>
            <option value="connect">I connect people like a human LinkedIn 🔗</option>
            <option value="ideas">I turn ideas into businesses 💡</option>
            <option value="creative">I make things look (or sound) amazing 🎨🎙️</option>
            <option value="problems">I solve impossible problems 🕵️</option>
            <option value="inspire">I inspire people to take action 🚀</option>
            <option value="vibes">I bring the good vibes 😎</option>
            <option value="other">Other (please specify below)</option>
          </select>
          <Input id="otherSuperpower" placeholder="Enter your own superpower" className="mt-2" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="funFact">What&apos;s a fun fact that makes people go, &quot;Wait…WHAT?!&quot;</Label>
          <Input
            id="funFact"
            placeholder="Example: &quot;I once sold everything I owned and moved to Bali.&quot; 🌴 &quot;I own 237 pairs of sneakers.&quot; 👟"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="industry">What industry or niche are you in?</Label>
          <Input
            id="industry"
            placeholder="Be specific! Instead of &quot;Tech,&quot; say &quot;AI-powered marketing automation.&quot;"
          />
          <p className="text-xs text-muted-foreground">
            Be specific! Instead of &quot;Fitness,&quot; say &quot;Strength training for busy professionals.&quot;
          </p>
        </div>
      </div>
      
      {/* Skills and Value */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-medium">What&apos;s Your Magic? (Aka, How Can You Help?)</h3>

        <div className="space-y-2">
          <Label htmlFor="mainValue">What&apos;s the ONE thing people should reach out to you for?</Label>
          <Input
            id="mainValue"
            placeholder="Example: &quot;I help startups get their first 1,000 customers.&quot;"
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
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="audience">Who do you LOVE helping the most?</Label>
          <select 
            id="audience"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="" disabled selected>Select who you love helping most</option>
            <option value="aspiring">Aspiring entrepreneurs who don't know where to start 🚀</option>
            <option value="retention">Businesses struggling with customer retention 💰</option>
            <option value="career">People looking for their next big career move 🎯</option>
            <option value="likeminded">Just cool, like-minded people looking to connect 🤝</option>
            <option value="other">Other (please specify below)</option>
          </select>
          <Input id="otherAudience" placeholder="Enter who you love helping most" className="mt-2" />
        </div>
      </div>
      
      {/* Your Ask Section */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-medium">Your Ask – What You Need Help With</h3>

        <div className="space-y-2">
          <Label htmlFor="primaryAsk">Right now, what&apos;s the #1 thing you need help with?</Label>
          <Input
            id="primaryAsk"
            placeholder="Example: &quot;I&apos;m looking for beta testers for my AI tool&quot;"
          />
          <p className="text-xs text-muted-foreground">
            Make it clear! Be specific about what you're looking for.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="secondaryAsk">What&apos;s a secondary thing you&apos;d love support with? (Optional)</Label>
          <Input
            id="secondaryAsk"
            placeholder="Example: &quot;I need intros to potential angel investors&quot;"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contactMethod">What&apos;s the best way for someone to reach you?</Label>
          <Input
            id="contactMethod"
            placeholder="Social media, email, calendar link, or just &quot;DM me&quot;"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">
          Save Draft
        </Button>
        <Link href="/create-profile/interests">
          <Button type="button">Next: Interests & Skills</Button>
        </Link>
      </div>
    </div>
  );
}
