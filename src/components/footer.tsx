import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-4 md:gap-8">
          <div className="space-y-4 sm:space-y-5">
            <h3 className="text-base font-medium sm:text-lg">Product</h3>
            <ul className="space-y-3 sm:space-y-2">
              <li>
                <Link href="/features" className="text-sm text-muted-foreground hover:text-foreground active:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground active:text-foreground">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4 sm:space-y-5">
            <h3 className="text-base font-medium sm:text-lg">Company</h3>
            <ul className="space-y-3 sm:space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground active:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground active:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4 sm:space-y-5">
            <h3 className="text-base font-medium sm:text-lg">Legal</h3>
            <ul className="space-y-3 sm:space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground active:text-foreground">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground active:text-foreground">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4 sm:space-y-5">
            <h3 className="text-base font-medium sm:text-lg">KnowMe</h3>
            <p className="text-sm text-muted-foreground">AI-Powered Video Business Card Platform</p>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 md:pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} KnowMe. All rights reserved.
        </div>
      </div>
    </footer>
  );
}