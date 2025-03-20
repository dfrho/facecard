import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export function UserProfileForm() {
  return (
    <form className="space-y-6">
      <div className="space-y-4">
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
        
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn URL (optional)</Label>
          <Input id="linkedin" placeholder="https://linkedin.com/in/yourprofile" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="profileSummary">Profile Summary</Label>
          <textarea
            id="profileSummary"
            className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Write a brief summary about yourself and your professional background"
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
    </form>
  );
}