import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SharePage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Share Your Video Business Card</h1>
          <p className="text-muted-foreground">
            Share your video with your network and track engagement.
          </p>
        </div>
        
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Your Shareable Link</h2>
              <p className="text-sm text-muted-foreground">
                Copy and share this link with your network.
              </p>
            </div>
            
            <div className="flex gap-2">
              <Input 
                readOnly 
                value="https://knowme.ai/v/abcd1234" 
                className="flex-1"
              />
              <Button variant="outline">
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
                  className="h-4 w-4"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                <span className="sr-only">Copy</span>
              </Button>
            </div>
            
            <div className="rounded-xl border p-4">
              <h3 className="text-lg font-medium mb-2">QR Code</h3>
              <div className="flex items-center justify-center">
                <div className="border border-muted w-40 h-40 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">QR Code Preview</p>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <Button variant="outline" size="sm">Download QR Code</Button>
              </div>
            </div>
            
            <div className="rounded-xl border p-4">
              <h3 className="text-lg font-medium mb-2">Share on Social Media</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
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
                    className="h-4 w-4 text-blue-500"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                  Facebook
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
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
                    className="h-4 w-4 text-blue-400"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                  </svg>
                  Twitter
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
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
                    className="h-4 w-4 text-blue-600"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                  LinkedIn
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
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
                    className="h-4 w-4"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Email
                </Button>
              </div>
            </div>
            
            <div className="rounded-xl border p-4">
              <h3 className="text-lg font-medium mb-2">Embed on Website</h3>
              <div className="space-y-2">
                <Label htmlFor="embed-code">Embed Code</Label>
                <textarea
                  id="embed-code"
                  className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  readOnly
                  value={`<iframe src="https://knowme.ai/embed/abcd1234" width="400" height="225" frameborder="0" allowfullscreen></iframe>`}
                />
              </div>
              <div className="flex justify-end mt-2">
                <Button variant="outline" size="sm">Copy Code</Button>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Link href="/create-profile/video">
                <Button variant="outline">Back</Button>
              </Link>
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}