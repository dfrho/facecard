import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import React from 'react';
import { Providers } from '@/components/providers'; // Import the client side provider

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KnowMe - AI Video Business Cards',
  description: 'Create compelling video introductions with AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {' '}
          {/* Wrap your content with Providers */}
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
