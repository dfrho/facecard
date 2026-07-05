import Link from 'next/link';
import { Button } from '@/components/ui/button';

const features = [
  {
    num: '01',
    title: 'AI Script Generation',
    tagline: 'Words that sound like you, not a template.',
    description:
      'Answer a few questions about your work, your goals, and who you want to reach. Claude — Anthropic\'s AI — writes a personalized 15–30 second script that captures your voice and communicates your value clearly. No generic phrasing, no filler.',
    details: [
      'Tailored to your role, industry, and audience',
      'Regenerate as many times as you need (Pro: unlimited)',
      'Edit the script before you record',
      'Version history so you can go back anytime',
    ],
  },
  {
    num: '02',
    title: 'One-Take Video Recording',
    tagline: 'Record in your browser. No gear required.',
    description:
      'FaceCard uses Loom\'s recording SDK so you can record a clean, professional video directly in your browser — with your script visible on screen as a teleprompter. No editing software, no lighting rigs, no production overhead.',
    details: [
      'Camera-only recording for a personal, face-forward feel',
      'Script displayed as you record — no memorizing',
      'Re-record as many times as you need (Pro: unlimited)',
      'Works on any modern browser — no installs',
    ],
  },
  {
    num: '03',
    title: 'Instant Sharing',
    tagline: 'One link, everywhere you network.',
    description:
      'The moment your video is ready, you get a shareable link, a QR code, and an embed snippet — so your video card works whether you\'re sending a cold email, speaking at an event, or linking from your LinkedIn profile.',
    details: [
      'Shareable link ready immediately after recording',
      'QR code you can print on a physical business card',
      'Embed code for your personal site or portfolio',
      'Custom slug with your name on Pro (facecard.ai/v/yourname)',
    ],
  },
  {
    num: '04',
    title: 'Multiple Cards',
    tagline: 'Different audiences deserve different introductions.',
    description:
      'A job seeker, a freelance consultant, and a conference speaker all have different stories to tell. Pro lets you maintain up to five distinct video cards — each with its own script, recording, and share link — so you always show up with the right message.',
    details: [
      'Up to 5 independent video cards on Pro',
      'Each card has its own script, recording, and link',
      'Switch between cards from your dashboard',
      'Free plan includes 1 card to get started',
    ],
    proOnly: true,
  },
];

function Check() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-primary mt-0.5"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function FeaturesPage() {
  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section className="noise-bg relative overflow-hidden py-14 sm:py-20 md:py-28">
        <div className="container relative z-10 px-4 md:px-6 max-w-2xl mx-auto text-center space-y-4 sm:space-y-5">
          <span className="font-sans-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Features
          </span>
          <h1 className="font-display italic text-4xl font-semibold leading-tight text-foreground sm:text-5xl md:text-6xl">
            Everything in one take.
          </h1>
          <p className="font-sans-body text-base text-muted-foreground leading-relaxed sm:text-lg">
            From AI-written script to shareable video card — the entire workflow lives in FaceCard.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/create-profile">
              <Button size="lg" className="gap-2 text-base px-8">
                Get Started Free
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="text-base px-8">
                See Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature rows */}
      <section className="container px-4 md:px-6 py-10 sm:py-16 md:py-24">
        <div className="mx-auto max-w-4xl divide-y divide-border">
          {features.map(f => (
            <div key={f.num} className="grid grid-cols-[48px_1fr] gap-5 py-9 sm:grid-cols-[64px_1fr] sm:gap-8 sm:py-14 md:grid-cols-[80px_1fr_1fr] md:gap-16">

              {/* Number */}
              <span className="font-display italic text-3xl font-semibold text-primary leading-none sm:text-5xl">
                {f.num}
              </span>

              {/* Left: title + description */}
              <div className="space-y-4">
                <div className="space-y-1">
                  {f.proOnly && (
                    <span className="inline-block font-sans-body text-xs uppercase tracking-[0.15em] text-primary border border-primary/40 rounded-full px-2.5 py-0.5 mb-1">
                      Pro
                    </span>
                  )}
                  <h2 className="font-display text-2xl font-semibold text-foreground">{f.title}</h2>
                  <p className="font-sans-body text-sm text-primary font-medium">{f.tagline}</p>
                </div>
                <p className="font-sans-body text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
              </div>

              {/* Right: detail bullets */}
              <ul className="space-y-3 md:pt-1">
                {f.details.map(d => (
                  <li key={d} className="flex items-start gap-2.5">
                    <Check />
                    <span className="font-sans-body text-sm text-foreground">{d}</span>
                  </li>
                ))}
              </ul>

            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="noise-bg relative overflow-hidden bg-primary py-14 sm:py-20 md:py-24">
        <div className="container relative z-10 px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center space-y-6 sm:space-y-8">
            <h2 className="font-display italic text-3xl font-semibold text-primary-foreground sm:text-4xl md:text-5xl leading-tight">
              Ready to make your introduction unforgettable?
            </h2>
            <p className="font-sans-body text-base text-primary-foreground/75 leading-relaxed sm:text-lg">
              Create your first video business card for free. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create-profile">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-base px-10 gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  Get Started Free
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-10 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
