import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ScriptPage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Your AI-Generated Script</h1>
          <p className="text-muted-foreground">
            Review and edit your personalized video script below.
          </p>
        </div>
        
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Script Preview</h2>
              <p className="text-sm text-muted-foreground">
                This script has been generated based on your profile information.
              </p>
            </div>
            
            <div className="rounded-md border bg-muted/20 p-6">
              <blockquote className="italic">
                <p>
                  Hi, I&apos;m [Your Name], a [Job Title] at [Company]. With over [X] years of experience in [Skills], 
                  I&apos;m passionate about [Interests] and have a proven track record of [Achievements].
                </p>
                <p className="mt-2">
                  I&apos;m currently seeking [What You&apos;re Seeking] and would love to connect with [Ideal Connection].
                </p>
                <p className="mt-2">
                  Let&apos;s explore how we might create value together. Feel free to reach out at [Email]!
                </p>
              </blockquote>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-center">
                <Button variant="outline" className="w-full max-w-md">
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
                  defaultValue="Hi, I'm [Your Name], a [Job Title] at [Company]. With over [X] years of experience in [Skills], I'm passionate about [Interests] and have a proven track record of [Achievements].

I'm currently seeking [What You're Seeking] and would love to connect with [Ideal Connection].

Let's explore how we might create value together. Feel free to reach out at [Email]!"
                />
              </div>
            </div>
            
            <div className="flex justify-between">
              <Link href="/create-profile/interests">
                <Button variant="outline">Back</Button>
              </Link>
              <Link href="/create-profile/video">
                <Button>Generate Video</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}