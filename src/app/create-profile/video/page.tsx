'use client'; // Mark as client component

import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import { loadFormData } from '@/lib/form-utils';
import { createInstance } from "@loomhq/record-sdk"; // Use createInstance
import { isSupported } from "@loomhq/record-sdk/is-supported"; // Import isSupported separately
import { oembed } from "@loomhq/loom-embed";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'; // Import Dialog components
import {
  Card,
  CardContent,
} from "@/components/ui/card"; // Import Card components

export default function VideoPage() {
  return (
    <Suspense fallback={<div>Loading script...</div>}>
      <VideoPageContent />
    </Suspense>
  );
}

// Inner component that uses client-side hooks
function VideoPageContent() {
  const searchParams = useSearchParams(); // Get search params
  const [scriptContent, setScriptContent] = useState<string | null>(null);

  const [loomVideoHtml, setLoomVideoHtml] = useState<string | null>(null);
  const loomButtonRef = useRef<HTMLButtonElement>(null);
  const [isMounted, setIsMounted] = useState(false); // State for hydration check
  const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false); // State for modal
  const [loomStatus, setLoomStatus] = useState<'pending' | 'supported' | 'unsupported' | 'error'>('pending'); // Track SDK status
  const [isModalButtonConfigured, setIsModalButtonConfigured] = useState(false); // Track if modal button is configured
  const [isVideoAvailable, setIsVideoAvailable] = useState(false); // State for video availability
  const [error, setError] = useState<string | null>(null); // Add error state
  const loomSDKInitializedRef = useRef(false); // Ref to track SDK initialization
  // Determine which Loom App ID to use based on the environment
  const loomPublicAppId =
    process.env.NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_LOOM_SANDBOX_PUBLIC_APP_ID
      : process.env.NEXT_PUBLIC_LOOM_PUBLIC_APP_ID;

  // Function to setup Loom SDK
  const setupLoom = useCallback(async (buttonElement: HTMLButtonElement) => {
    try {
      // 1. Check support first
      const support = await isSupported();
      if (!support.supported) {
        setLoomStatus('unsupported');
        const notSupportedErrorMsg = `Your browser does not support video recording${support.error ? `: ${support.error}` : '.'}. Please try using a different browser.`;
        setError(notSupportedErrorMsg);
        throw new Error("Loom SDK not supported: " + (support.error || 'Unknown reason'));
      }

      // 2. Check for valid App ID (must be string)
      if (typeof loomPublicAppId !== 'string' || !loomPublicAppId) {
        const missingIdErrorMsg = "Loom configuration is missing. Cannot initialize recorder.";
        setError(missingIdErrorMsg);
        setLoomStatus('error');
        throw new Error("Invalid or missing Loom Public App ID.");
      }

      // 3. Create instance (App ID is now guaranteed to be a string)
      const { configureButton } = await createInstance({
        publicAppId: loomPublicAppId,
        mode: 'standard',
        config: {
          allowedRecordingTypes: ['cam' as never],
          defaultRecordingType: 'cam' as never,
        },
      });

      // 4. Configure button
      if (!configureButton) {
        const noConfigureFnErrorMsg = "Failed to get Loom configuration function.";
        setError(noConfigureFnErrorMsg);
        setLoomStatus('error');
        throw new Error("configureButton function not returned from createInstance.");
      }

      const sdkButton = configureButton({ element: buttonElement });

      // Defensive check: ensure sdkButton looks like a valid object with 'on' method
      if (!sdkButton || typeof sdkButton.on !== 'function') {
        const invalidSdkButtonErrorMsg = "Failed to configure Loom button object.";
        setError(invalidSdkButtonErrorMsg);
        setLoomStatus('error');
        throw new Error("Invalid sdkButton object received from configureButton.");
      }

      // 5. Attach event listeners with correct names
      sdkButton.on('insert-click', async (record) => {
        const { sharedUrl } = record;
        if (sharedUrl) {
          try {
            const { html } = await oembed(sharedUrl);
            setLoomVideoHtml(html);
            setIsVideoAvailable(true);
            setIsInstructionModalOpen(false);
          } catch (oembedError) {
            // Keep this console.error as it's a genuine runtime error condition
            console.error('Error fetching Loom oEmbed data:', oembedError);
            setError('Failed to load video embed details. Please try inserting again.');
          }
        } else {
          // Keep this console.error as it's a genuine runtime error condition
          console.error('Loom insert-click payload did not contain sharedUrl:', record);
          setError('Failed to get video URL from Loom.');
        }
      });

      sdkButton.on('cancel', () => {
        setLoomVideoHtml(null);
        setIsVideoAvailable(false);
      });

      sdkButton.on('complete', () => {
        // Placeholder for any logic on recording completion
      });

      setLoomStatus('supported'); // Mark as supported if setup succeeds

    } catch (err) {
      const error = err as Error;
      // Ensure setError and setLoomStatus are called if not already by specific checks
      if (loomStatus !== 'error' && loomStatus !== 'unsupported') {
        setError('Failed to initialize video recording. Please refresh the page or check console.');
        setLoomStatus('error');
      }
      throw error; // Re-throw the error to be caught by modalButtonRefCallback
    }
  }, [loomPublicAppId, setError, setLoomStatus, loomStatus]);

  // Ref callback to configure Loom button when it's mounted
  const modalButtonRefCallback = useCallback((node: HTMLButtonElement | null) => {
    if (node && loomPublicAppId && !loomSDKInitializedRef.current) {
      setupLoom(node)
        .then(() => {
          loomSDKInitializedRef.current = true;
          setIsModalButtonConfigured(true);
        })
        .catch(() => {
          // Error is logged and state set within setupLoom or its rethrow handler
          setIsModalButtonConfigured(false);
          loomSDKInitializedRef.current = false;
        });
    } else if (node && loomSDKInitializedRef.current) {
      setIsModalButtonConfigured(true);
    } else if (node && !loomPublicAppId) {
      node.disabled = true;
    } else if (!node) {
      loomSDKInitializedRef.current = false;
      setIsModalButtonConfigured(false);
    }
  }, [loomPublicAppId, setupLoom]);

  // Use useCallback to memoize checkLoomSupport
  const checkLoomSupport = useCallback(async () => {
    setLoomStatus('pending'); // Reset status on check
    // Check for App ID existence here
    if (!loomPublicAppId) {
      console.error(`Loom Public App ID is not configured for ${process.env.NODE_ENV} environment.`);
      // Update UI - disable trigger button?
      if (loomButtonRef.current) {
        loomButtonRef.current.disabled = true;
        loomButtonRef.current.textContent = "Loom Unavailable";
      }
      setLoomStatus('error');
      return;
    }

    const { supported, error } = await isSupported();

    if (!supported) {
      console.warn(`Loom SDK not supported: ${error}`);
      // Update status and disable trigger button
      if (loomButtonRef.current) {
        loomButtonRef.current.disabled = true;
        loomButtonRef.current.textContent = "Loom Not Supported";
      }
      setLoomStatus('unsupported');
      return;
    }

    console.log('Loom is supported.');
    setLoomStatus('supported'); // Mark as supported, ready for modal config
  }, [loomPublicAppId]);

  // Effect to check Loom support on mount
  useEffect(() => {
    if (isMounted) {
      checkLoomSupport();
    }
  }, [isMounted, checkLoomSupport]);

  // Effect to track component mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Effect to read script: prefer stored form data, fall back to URL param
  useEffect(() => {
    const stored = loadFormData();
    if (stored?.generatedScript) {
      setScriptContent(stored.generatedScript);
      return;
    }
    const scriptParam = searchParams.get('script');
    if (scriptParam) {
      try {
        setScriptContent(decodeURIComponent(scriptParam));
      } catch (e) {
        console.error("Error decoding script parameter:", e);
        setScriptContent(null);
      }
    }
  }, [searchParams]);

  return (
    <div className="container max-w-4xl px-4 sm:px-6 py-10 sm:py-14">
      <div className="space-y-8">
        <div className="space-y-3">
          <span className="font-sans-body text-xs uppercase tracking-[0.2em] text-muted-foreground">Step 4 of 5</span>
          <h1 className="font-display italic text-3xl sm:text-4xl font-semibold text-foreground">
            Record Your Video
          </h1>
        </div>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column: Script Display */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-foreground">Your Script</h2>
          <Card className="bg-muted/40 h-[240px] overflow-y-auto sm:h-[400px]"> {/* Fixed height and scroll */}
            <CardContent className="pt-6">
              {scriptContent ? (
                <p className="whitespace-pre-wrap">{scriptContent}</p>
              ) : (
                <p className="text-muted-foreground">No script found. Go back and generate one.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Video Recording */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-foreground">Record</h2>
          {/* Video Embed Area */}
          {loomVideoHtml ? (
            <div
              className="aspect-video w-full rounded-lg overflow-hidden shadow-lg"
              dangerouslySetInnerHTML={{ __html: loomVideoHtml }}
            />
          ) : (
            <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center">
              <p className="text-muted-foreground text-center px-4">
                {isVideoAvailable
                  ? 'Video processing...'
                  : 'Click "Record Video" below. Your video will appear here after recording.'}
              </p>
            </div>
          )}
          {/* Error Display Area */}
          {error && (
            <div className="mb-4 rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              <p>{error}</p>
            </div>
          )}
          {/* Recording Controls / Button Area */}
          <div className="flex justify-center pt-4">
            <Dialog open={isInstructionModalOpen} onOpenChange={setIsInstructionModalOpen}>
              <DialogTrigger asChild>
                {/* Main trigger button */}
                <Button
                  ref={loomButtonRef}
                  id="loom-record-trigger-button"
                  disabled={!isMounted || loomStatus !== 'supported'}
                  variant="default"
                  size="lg"
                  onClick={() => setIsInstructionModalOpen(true)} // Open modal on click
                >
                  {isMounted
                    ? loomStatus === 'supported'
                    ? isVideoAvailable ? 'Record Again' : 'Record Video' // Video available means SDK was supported
                      : loomStatus === 'pending'
                    ? 'Checking Support...'
                      : loomStatus === 'unsupported'
                    ? 'Browser Not Supported'
                    : loomStatus === 'error'
                    ? 'Loom Setup Error' // Generic error from SDK setup
                    : 'Record Video' // Default if supported but no video yet
                    : 'Loading...'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Prepare for Recording</DialogTitle>
                  <DialogDescription>
                    Please select &quot;Camera Only&quot; in the Loom interface that appears next before starting your recording.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  {/* This button is now configured by Loom */}
                  <Button
                    ref={modalButtonRefCallback} // Use the callback ref here
                    id="modal-loom-record-button"
                    // Disable if not mounted OR if SDK is not initialized (isModalButtonConfigured is false)
                    // OR if there's an error/unsupported status from the initial checkLoomSupport via loomStatus
                    disabled={!isMounted || !isModalButtonConfigured || loomStatus === 'error' || loomStatus === 'unsupported'}
                  >
                    {isMounted
                      ? loomStatus === 'unsupported'
                        ? 'Browser Not Supported'
                        : loomStatus === 'error'
                          ? 'Error Loading Loom'
                          : isModalButtonConfigured
                            ? 'Continue to Recording'
                            : 'Loom Loading...'
                      : 'Loading...'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}