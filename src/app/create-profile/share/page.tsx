'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loadFormData } from '@/lib/form-utils';

interface SavedVideo {
  url: string;
  // Used to name the downloaded QR code, e.g. "alex-rivera-facecard-qr.png".
  fileName: string;
}

function qrFileName(firstName?: string, lastName?: string): string {
  const slug = [firstName, lastName]
    .filter(Boolean)
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '');
  return slug ? `${slug}-facecard-qr.png` : 'facecard-qr.png';
}

export default function SharePage() {
  // undefined while reading storage, null when no video has been recorded yet.
  const [video, setVideo] = useState<SavedVideo | null | undefined>(undefined);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = loadFormData();
    setVideo(
      stored?.videoUrl
        ? { url: stored.videoUrl, fileName: qrFileName(stored.firstName, stored.lastName) }
        : null
    );
  }, []);

  useEffect(() => {
    if (!video) return;
    let cancelled = false;
    // A large PNG with a full quiet zone, so a downloaded code still scans when printed.
    QRCode.toDataURL(video.url, {
      width: 512,
      margin: 4,
      errorCorrectionLevel: 'M',
      color: { dark: '#181513', light: '#ffffff' },
    })
      .then(dataUrl => {
        if (!cancelled) setQrDataUrl(dataUrl);
      })
      .catch(error => console.error('Error making the QR code:', error));
    return () => {
      cancelled = true;
    };
  }, [video]);

  const copyLink = async () => {
    if (!video) return;
    try {
      await navigator.clipboard.writeText(video.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying the link:', error);
    }
  };

  return (
    <div className="container max-w-4xl px-4 sm:px-6 py-10 sm:py-14">
      <div className="space-y-8">
        <div className="space-y-3">
          <span className="font-sans-body text-xs uppercase tracking-[0.2em] text-muted-foreground">Step 5 of 5</span>
          <h1 className="font-display italic text-3xl sm:text-4xl font-semibold text-foreground">
            Share Your Card
          </h1>
          <p className="font-sans-body text-muted-foreground sm:text-lg">
            Share your video with your network and start making connections.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 sm:p-8 shadow-sm">
          <div className="space-y-6">
            <div className="space-y-1.5">
              <h2 className="font-display text-xl font-semibold text-foreground">Your Shareable Link</h2>
              <p className="font-sans-body text-sm text-muted-foreground">
                Copy and share this link with your network.
              </p>
            </div>
            
            {video === null && (
              <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
                <p>
                  Record your video first. Your link and QR code will appear here.{' '}
                  <Link href="/create-profile/video" className="font-medium text-primary underline">
                    Go to Step 4
                  </Link>
                </p>
              </div>
            )}

            {video && (
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={video.url}
                  aria-label="Your video link"
                  className="flex-1"
                />
                <Button variant="outline" onClick={copyLink} className="gap-2">
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
                  <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
                </Button>
              </div>
            )}

            <div className="rounded-xl border p-4">
              <h3 className="text-lg font-medium mb-2">QR Code</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Scanning it opens your video. Add it to slides, name badges or a printed card.
              </p>
              <div className="flex items-center justify-center">
                {qrDataUrl ? (
                  <Image
                    src={qrDataUrl}
                    alt="QR code that opens your video"
                    width={160}
                    height={160}
                    unoptimized
                    className="rounded-md ring-1 ring-border"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-md border border-dashed border-border flex items-center justify-center p-3">
                    <p className="text-sm text-center text-muted-foreground">
                      {video === null ? 'Appears after you record' : 'Making your QR code…'}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex justify-center mt-4">
                {qrDataUrl && video ? (
                  <Button variant="outline" size="sm" asChild>
                    <a href={qrDataUrl} download={video.fileName}>
                      Download QR Code
                    </a>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" disabled>
                    Download QR Code
                  </Button>
                )}
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
                  value={`<iframe src="https://facecard.ai/embed/abcd1234" width="400" height="225" frameborder="0" allowfullscreen></iframe>`}
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
              {/* There is no dashboard yet; the home page shows the "pick up where you left off" card. */}
              <Link href="/">
                <Button>Done</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}