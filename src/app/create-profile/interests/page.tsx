import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function InterestsPage() {
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
                <div className="space-y-2">
                  <Label htmlFor="skills">Professional Skills</Label>
                  <Input 
                    id="skills" 
                    placeholder="e.g., Project Management, Web Development, Data Analysis" 
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
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="seeking">What are you currently seeking?</Label>
                  <select 
                    id="seeking"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="" disabled selected>Select an option</option>
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
                  />
                </div>
              </div>
              
              <div className="flex justify-between">
                <Link href="/create-profile">
                  <Button type="button" variant="outline">Back</Button>
                </Link>
                <div className="space-x-2">
                  <Button type="button" variant="outline">Save Draft</Button>
                  <Link href="/create-profile/script">
                    <Button type="button">Generate Script</Button>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}