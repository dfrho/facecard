import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-100 py-20 dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                  AI-Powered Video Business Cards
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Create compelling 15-30 second video introductions that clearly communicate your skills, offerings, and needs.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/create-profile">
                  <Button size="lg" className="w-full">Get Started</Button>
                </Link>
                <Link href="/features">
                  <Button size="lg" variant="outline" className="w-full">Learn More</Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[350px] w-[350px] rounded-xl bg-gradient-to-b from-blue-500 to-purple-600 p-1 shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white dark:bg-gray-950">
                  <div className="text-center">
                    <p className="text-lg font-semibold">Video Preview</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Your AI-generated video will appear here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Key Features</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl dark:text-gray-400">
                Everything you need to create professional video business cards
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
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
                  className="h-6 w-6 text-primary"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M7 7h10v2H7z" />
                  <path d="M7 11h5v2H7z" />
                  <path d="M7 15h8v2H7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">AI Script Generation</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Generate personalized scripts that capture your authentic voice
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
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
                  className="h-6 w-6 text-primary"
                >
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Video Generation</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Create professional videos with AI avatars and custom branding
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
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
                  className="h-6 w-6 text-primary"
                >
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <path d="M16 6 12 2 8 6" />
                  <path d="M12 2v13" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Easy Sharing</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Share your video business card with QR codes and social media integration
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-12 text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to stand out?</h2>
              <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl">
                Create your AI-powered video business card today and elevate your professional networking.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/create-profile">
                <Button size="lg" variant="secondary" className="w-full">
                  Get Started for Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}