import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="space-y-3">
            <span className="font-display italic text-xl font-semibold text-foreground">FaceCard</span>
            <p className="font-sans-body text-sm text-muted-foreground max-w-xs leading-relaxed">
              AI-powered video business cards for professionals who want to make every introduction count.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-sans-body text-xs uppercase tracking-[0.15em] text-foreground font-medium">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/features" className="font-sans-body text-sm text-muted-foreground hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="font-sans-body text-sm text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-sans-body text-xs uppercase tracking-[0.15em] text-foreground font-medium">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="font-sans-body text-sm text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="font-sans-body text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-sans-body text-xs uppercase tracking-[0.15em] text-foreground font-medium">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="font-sans-body text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="font-sans-body text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-sans-body text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} FaceCard. All rights reserved.
          </p>
          <p className="font-sans-body text-xs text-muted-foreground">
            Made with intention.
          </p>
        </div>
      </div>
    </footer>
  );
}
