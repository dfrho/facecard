import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function VideoPage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Your AI-Generated Video</h1>
          <p className="text-muted-foreground">
            Preview your video business card and share it with your network.
          </p>
        </div>
        
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Video Preview</h2>
              <p className="text-sm text-muted-foreground">
                Your AI-generated video business card based on your profile and script.
              </p>
            </div>
            
            <div className="overflow-hidden rounded-xl border shadow-sm">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-muted-foreground"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polygon points="10 8 16 12 10 16 10 8" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium">Your Video Will Appear Here</p>
                  <p className="text-sm text-muted-foreground">
                    Click the button below to generate your video
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-center">
                <Button className="w-full max-w-md">
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
                    <path d="M4 11v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8" />
                    <path d="M4 5v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5" />
                    <path d="M14.5 5V3a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1v2" />
                    <line x1="12" y1="10" x2="12" y2="16" />
                    <line x1="9" y1="13" x2="15" y2="13" />
                  </svg>
                  Generate Video
                </Button>
              </div>
              
              <div className="rounded-xl border p-4">
                <h3 className="text-lg font-medium mb-2">Video Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="avatar-style">Avatar Style</Label>
                    <select
                      id="avatar-style"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="realistic">Realistic</option>
                      <option value="animated">Animated</option>
                      <option value="stylized">Stylized</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="background">Background</Label>
                    <select
                      id="background"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="office">Office</option>
                      <option value="gradient">Gradient</option>
                      <option value="cityscape">Cityscape</option>
                      <option value="abstract">Abstract</option>
                      <option value="custom">Custom (Upload)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="voice-style">Voice Style</Label>
                    <select
                      id="voice-style"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="professional">Professional</option>
                      <option value="friendly">Friendly</option>
                      <option value="energetic">Energetic</option>
                      <option value="calm">Calm</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Target Duration</Label>
                    <select
                      id="duration"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="15">15 seconds</option>
                      <option value="20">20 seconds</option>
                      <option value="30">30 seconds</option>
                      <option value="45">45 seconds</option>
                      <option value="60">60 seconds</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="rounded-xl border p-4">
                <h3 className="text-lg font-medium mb-2">Branding</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo">Logo (Optional)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="logo"
                        type="file"
                        className="flex h-10 w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="colors">Brand Colors (Optional)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        id="secondaryColor"
                        type="color"
                        className="w-16 h-10 p-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Link href="/create-profile/script">
                <Button variant="outline">Back</Button>
              </Link>
              <Link href="/create-profile/share">
                <Button>Share Video</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}