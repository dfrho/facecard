import Link from 'next/link';
import { Button } from '@/components/ui/button';

const free = [
  '1 video business card',
  'AI script generation (up to 3 regenerations)',
  '1 Loom recording per card',
  'Shareable link',
];

const pro = [
  'Up to 5 video business cards',
  'Unlimited script regenerations per card',
  'Unlimited re-recordings per card',
  'Link, QR code & embed sharing',
  'Custom slug (facecard.ai/v/yourname)',
];

function Check() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
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

export default function PricingPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="noise-bg relative overflow-hidden py-20 sm:py-28">
        <div className="container relative z-10 px-4 md:px-6 text-center space-y-5 max-w-2xl mx-auto">
          <span className="font-sans-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Pricing
          </span>
          <h1 className="font-display italic text-5xl font-semibold leading-tight text-foreground sm:text-6xl">
            Simple, honest pricing.
          </h1>
          <p className="font-sans-body text-lg text-muted-foreground leading-relaxed">
            Start free. Upgrade when you need more cards, more takes, and more ways to share.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="container px-4 md:px-6 pb-24">
        <div className="mx-auto max-w-4xl grid gap-6 md:grid-cols-2 md:gap-8">

          {/* Free */}
          <div className="rounded-xl border border-border bg-card p-8 flex flex-col">
            <div className="space-y-2 mb-8">
              <p className="font-sans-body text-xs uppercase tracking-[0.2em] text-muted-foreground">Free</p>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-5xl font-semibold text-foreground">$0</span>
                <span className="font-sans-body text-muted-foreground">/ month</span>
              </div>
              <p className="font-sans-body text-sm text-muted-foreground">
                Everything you need to make your first impression.
              </p>
            </div>

            <ul className="space-y-3 flex-1 mb-8">
              {free.map(item => (
                <li key={item} className="flex items-start gap-3">
                  <Check />
                  <span className="font-sans-body text-sm text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/create-profile">
              <Button variant="outline" className="w-full">
                Get Started Free
              </Button>
            </Link>
          </div>

          {/* Pro */}
          <div className="rounded-xl border-2 border-primary bg-card p-8 flex flex-col relative">
            <div className="absolute -top-3 left-8">
              <span className="font-sans-body text-xs uppercase tracking-[0.15em] bg-primary text-primary-foreground px-3 py-1 rounded-full">
                Most Popular
              </span>
            </div>

            <div className="space-y-2 mb-8">
              <p className="font-sans-body text-xs uppercase tracking-[0.2em] text-primary">Pro</p>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-5xl font-semibold text-foreground">$45</span>
                <span className="font-sans-body text-muted-foreground">/ month</span>
              </div>
              <p className="font-sans-body text-sm text-muted-foreground">
                Multiple cards and unlimited flexibility for serious networkers.
              </p>
            </div>

            <ul className="space-y-3 flex-1 mb-8">
              {pro.map(item => (
                <li key={item} className="flex items-start gap-3">
                  <Check />
                  <span className="font-sans-body text-sm text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/create-profile">
              <Button className="w-full gap-2">
                Start with Pro
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Button>
            </Link>
          </div>
        </div>

        {/* FAQ nudge */}
        <p className="text-center font-sans-body text-sm text-muted-foreground mt-12">
          Questions?{' '}
          <a href="mailto:hello@facecard.ai" className="text-primary hover:underline underline-offset-4">
            Get in touch
          </a>
          {' '}and we&apos;ll help you choose.
        </p>
      </section>
    </div>
  );
}
