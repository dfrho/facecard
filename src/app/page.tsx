import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ResumeCard } from "@/components/resume-card";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="noise-bg relative overflow-hidden py-14 sm:py-20 md:py-28 lg:py-36">
        <div className="container relative z-10 px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col space-y-6 sm:space-y-8">
              <div className="space-y-3 sm:space-y-4">
                <span className="animate-fade-up-1 inline-block font-sans-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  AI-Powered Video Business Cards
                </span>
                <h1 className="animate-fade-up-2 font-display italic text-4xl font-semibold leading-[1.15] tracking-tight sm:text-5xl sm:leading-[1.1] md:text-6xl lg:text-7xl text-foreground">
                  Make your introduction{" "}
                  <span className="text-primary">unforgettable.</span>
                </h1>
                <p className="animate-fade-up-3 font-sans-body max-w-[520px] text-base text-muted-foreground leading-relaxed sm:text-lg">
                  Create compelling 15–30 second video introductions that clearly communicate who you are, what you offer, and what you need.
                </p>
              </div>
              <div className="animate-fade-up-4 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link href="/create-profile">
                  <Button size="lg" className="gap-2 text-base px-8">
                    Get Started
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </Button>
                </Link>
                <Link href="/features">
                  <Button size="lg" variant="outline" className="text-base px-8">
                    See How It Works
                  </Button>
                </Link>
              </div>
            </div>

            {/* Abstract card mockup */}
            <div className="animate-fade-up-3 hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-sm">
                <div className="absolute -top-4 -left-4 w-full h-full rounded-2xl border-2 border-primary/20 bg-card" />
                <div className="relative rounded-2xl border border-border bg-card p-8 shadow-lg">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center">
                        <span className="font-display italic text-primary text-lg font-semibold">K</span>
                      </div>
                      <div>
                        <p className="font-display font-semibold text-foreground">Alex Rivera</p>
                        <p className="font-sans-body text-sm text-muted-foreground">Product Designer · San Francisco</p>
                      </div>
                    </div>
                    <div className="rounded-xl bg-background border border-border aspect-video flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/15" />
                      <div className="relative flex flex-col items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-primary/90 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-primary-foreground ml-0.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        </div>
                        <span className="font-sans-body text-xs text-muted-foreground">0:24</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 rounded-full bg-border w-full" />
                      <div className="h-2 rounded-full bg-border w-4/5" />
                      <div className="h-2 rounded-full bg-border w-3/5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ResumeCard />

      {/* Features — numbered editorial layout */}
      <section className="py-14 sm:py-20 md:py-28">
        <div className="container px-4 md:px-6">
          <div className="mb-10 space-y-3 sm:mb-16">
            <span className="font-sans-body text-xs uppercase tracking-[0.2em] text-muted-foreground">What you get</span>
            <h2 className="font-display italic text-3xl font-semibold text-foreground sm:text-4xl md:text-5xl">
              Everything you need<br />to stand out.
            </h2>
          </div>

          <div className="divide-y divide-border">
            <div className="grid grid-cols-[48px_1fr] gap-5 py-8 sm:grid-cols-[64px_1fr] sm:gap-8 sm:py-12 md:grid-cols-[80px_1fr_1fr] md:gap-12">
              <span className="font-display italic text-3xl font-semibold text-primary leading-none sm:text-5xl">01</span>
              <div className="space-y-2">
                <h3 className="font-display text-xl font-semibold text-foreground sm:text-2xl">AI Script Generation</h3>
                <p className="font-sans-body text-muted-foreground leading-relaxed max-w-md">
                  Answer a few questions about your work and goals. Claude writes a personalized 15–30 second script that sounds exactly like you — no generic AI voice.
                </p>
              </div>
              <div className="hidden md:block" />
            </div>

            <div className="grid grid-cols-[48px_1fr] gap-5 py-8 sm:grid-cols-[64px_1fr] sm:gap-8 sm:py-12 md:grid-cols-[80px_1fr_1fr] md:gap-12">
              <span className="font-display italic text-3xl font-semibold text-primary leading-none sm:text-5xl">02</span>
              <div className="space-y-2">
                <h3 className="font-display text-xl font-semibold text-foreground sm:text-2xl">One-Take Video Recording</h3>
                <p className="font-sans-body text-muted-foreground leading-relaxed max-w-md">
                  Record directly in your browser with your script on screen. No equipment, no editing software, no production team needed.
                </p>
              </div>
              <div className="hidden md:block" />
            </div>

            <div className="grid grid-cols-[48px_1fr] gap-5 py-8 sm:grid-cols-[64px_1fr] sm:gap-8 sm:py-12 md:grid-cols-[80px_1fr_1fr] md:gap-12">
              <span className="font-display italic text-3xl font-semibold text-primary leading-none sm:text-5xl">03</span>
              <div className="space-y-2">
                <h3 className="font-display text-xl font-semibold text-foreground sm:text-2xl">Instant Sharing</h3>
                <p className="font-sans-body text-muted-foreground leading-relaxed max-w-md">
                  Share via QR code, link, or embed anywhere. Your video card works on LinkedIn, in email signatures, and at events.
                </p>
              </div>
              <div className="hidden md:block" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="noise-bg relative overflow-hidden bg-primary py-14 sm:py-20 md:py-24">
        <div className="container relative z-10 px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center space-y-6 sm:space-y-8">
            <h2 className="font-display italic text-3xl font-semibold text-primary-foreground sm:text-4xl md:text-5xl leading-tight">
              Ready to introduce yourself differently?
            </h2>
            <p className="font-sans-body text-base text-primary-foreground/75 leading-relaxed sm:text-lg">
              Create your AI-powered video business card in minutes and elevate every professional introduction you make.
            </p>
            <Link href="/create-profile">
              <Button
                size="lg"
                variant="secondary"
                className="text-base px-10 gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Get Started for Free
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
