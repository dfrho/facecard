'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const isOnFlow = pathname.startsWith('/create-profile');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleGoogleLogin = useCallback(() => {
    signIn('google', { callbackUrl: '/create-profile' });
  }, []);

  const handleLinkedInLogin = useCallback(() => {
    signIn('linkedin', { callbackUrl: '/create-profile' });
  }, []);

  const handleLogout = useCallback(() => {
    signOut({ callbackUrl: '/' });
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center">
          <span className="font-display italic text-xl font-semibold text-foreground tracking-tight">
            FaceCard
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/features"
            className="font-sans-body text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="font-sans-body text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Pricing
          </Link>

          {session ? (
            <div className="flex items-center gap-3">
              {session.user?.image && (
                <Link href="/create-profile/profile">
                  <Image
                    src={session.user.image}
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="rounded-full ring-2 ring-border hover:ring-primary transition-all"
                  />
                </Link>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout} className="font-sans-body">
                Logout
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="font-sans-body">Login</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="font-sans-body">
                <DropdownMenuItem onClick={handleGoogleLogin}>Sign in with Google</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLinkedInLogin}>Sign in with LinkedIn</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {!isOnFlow && (
            <Link href="/create-profile">
              <Button size="sm" className="font-sans-body gap-1.5">
                Get Started
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container px-4 py-5 space-y-4">
            <Link href="/features" className="block font-sans-body text-sm text-muted-foreground hover:text-primary transition-colors py-1">
              Features
            </Link>
            <Link href="/pricing" className="block font-sans-body text-sm text-muted-foreground hover:text-primary transition-colors py-1">
              Pricing
            </Link>

            {session ? (
              <div className="flex items-center gap-3 pt-2">
                {session.user?.image && (
                  <Link href="/create-profile/profile">
                    <Image src={session.user.image} alt="User Avatar" width={32} height={32} className="rounded-full" />
                  </Link>
                )}
                <Button variant="outline" size="sm" className="w-full font-sans-body" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full font-sans-body">Login</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="font-sans-body">
                    <DropdownMenuItem onClick={handleGoogleLogin}>Sign in with Google</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLinkedInLogin}>Sign in with LinkedIn</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {!isOnFlow && (
                  <Link href="/create-profile" className="block">
                    <Button size="sm" className="w-full font-sans-body">Get Started</Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
