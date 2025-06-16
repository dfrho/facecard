'use client'; // Mark as client component

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef, useCallback, Suspense } from "react"; // Import useEffect, useState, useRef
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Import Card components

const LOOM_BUTTON_ID = "loom-sdk-button"; // Define button ID

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
  console.log(">>> Current NODE_ENV:", process.env.NODE_ENV);
  // Determine which Loom App ID to use based on the environment
  const loomPublicAppId =
    process.env.NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_LOOM_SANDBOX_PUBLIC_APP_ID
      : process.env.NEXT_PUBLIC_LOOM_PUBLIC_APP_ID;

  // Function to setup Loom SDK
  const setupLoom = useCallback(async (buttonElement: HTMLButtonElement) => {
    try {
      console.log(">>> [setupLoom] Starting setup for button:", buttonElement);

      // 1. Check support first
      const support = await isSupported();
      if (!support.supported) {
        console.warn(">>> [setupLoom] Loom SDK not supported:", support.error);
        setLoomStatus('unsupported');
        const notSupportedErrorMsg = `Your browser does not support video recording${support.error ? `: ${support.error}` : '.'}. Please try using a different browser.`;
        setError(notSupportedErrorMsg);
        throw new Error("Loom SDK not supported: " + (support.error || 'Unknown reason'));
      }
      console.log(">>> [setupLoom] isSupported check passed.");

      // 2. Check for valid App ID (must be string)
      if (typeof loomPublicAppId !== 'string' || !loomPublicAppId) {
        console.error(">>> [setupLoom] Invalid or missing Loom Public App ID.");
        const missingIdErrorMsg = "Loom configuration is missing. Cannot initialize recorder.";
        setError(missingIdErrorMsg);
        setLoomStatus('error');
        throw new Error("Invalid or missing Loom Public App ID.");
      }
      console.log(">>> [setupLoom] App ID check passed.");

      // 3. Create instance (App ID is now guaranteed to be a string)
      const { configureButton } = await createInstance({
        publicAppId: loomPublicAppId,
        mode: 'standard',
      });

      console.log(">>> [setupLoom] createInstance successful.");

      // 4. Configure button
      if (!configureButton) {
        console.error(">>> [setupLoom] configureButton function not returned from createInstance!");
        const noConfigureFnErrorMsg = "Failed to get Loom configuration function.";
        setError(noConfigureFnErrorMsg);
        setLoomStatus('error');
        throw new Error("configureButton function not returned from createInstance.");
      }

      const sdkButton = configureButton({ element: buttonElement });

      console.log(">>> [setupLoom] configureButton called. SDK Button object:", sdkButton);

      // Defensive check: ensure sdkButton looks like a valid object with 'on' method
      if (!sdkButton || typeof sdkButton.on !== 'function') {
        console.error(">>> [setupLoom] Failed to get valid sdkButton object (or .on method missing)!");
        const invalidSdkButtonErrorMsg = "Failed to configure Loom button object.";
        setError(invalidSdkButtonErrorMsg);
        setLoomStatus('error');
        throw new Error("Invalid sdkButton object received from configureButton.");
      }

      // 5. Attach event listeners with correct names
      sdkButton.on('insert-click', async (record) => {
        // Check if user is subscribed (assuming this function exists and is relevant)
        // if (!isSubscribed()) return; // Temporarily commented out for debugging

        console.log(">>> Loom insert-click received.", record);
        const { sharedUrl } = record;

        if (sharedUrl) {
          try {
            console.log(">>> Fetching oembed for:", sharedUrl);
            // Assuming oembed function fetches embed HTML from Loom API
            const { html } = await oembed(sharedUrl);
            console.log(">>> oembed fetched successfully.");
            setLoomVideoHtml(html); // Use the correct state setter
            setIsVideoAvailable(true); // Set video available flag
            setIsInstructionModalOpen(false); // Close instruction modal
          } catch (oembedError) {
            console.error('Error fetching Loom oEmbed data:', oembedError);
            setError('Failed to load video embed details. Please try inserting again.');
          }
        } else {
          console.error('Loom insert-click payload did not contain sharedUrl:', record);
          setError('Failed to get video URL from Loom.');
        }
      });

      console.log(">>> [setupLoom] 'insert-click' listener attached.");

      sdkButton.on('cancel', () => { // Corrected event name
        console.log('Loom recording cancelled.');
        setLoomVideoHtml(null);
        setIsVideoAvailable(false);
      });

      console.log(">>> [setupLoom] 'cancel' listener attached."); // Corrected log

      // Add other listeners if needed (e.g., 'start', 'complete')
      sdkButton.on('complete', () => { // Corrected signature: no payload
        console.log('Loom recording complete.'); // Update log message
      });

      console.log(">>> [setupLoom] 'complete' listener attached."); // Corrected log

      console.log(">>> [setupLoom] Setup completed successfully.");
      setLoomStatus('supported'); // Mark as supported if setup succeeds

    } catch (err) {
      const error = err as Error; // Type assertion
      console.error('Error setting up Loom SDK:', error.message);
      // Ensure setError and setLoomStatus are called if not already by specific checks
      // This might be redundant if all specific checks already set these, but acts as a fallback.
      if (loomStatus !== 'error' && loomStatus !== 'unsupported') {
        setError('Failed to initialize video recording. Please refresh the page or check console.');
        setLoomStatus('error');
      }
      throw error; // Re-throw the error to be caught by modalButtonRefCallback
    }
  }, [loomPublicAppId, setError, setLoomStatus]); // Added setError and setLoomStatus to deps

  // Ref callback to configure Loom button when it's mounted
  const modalButtonRefCallback = useCallback((node: HTMLButtonElement | null) => {
    // Debugging logs
    console.log(">>> [modalButtonRefCallback] Called. Node:", node);
    console.log(`    - loomPublicAppId present: ${!!loomPublicAppId}`);
    console.log(`    - loomSDKInitializedRef.current: ${loomSDKInitializedRef.current}`);

    if (node && loomPublicAppId && !loomSDKInitializedRef.current) {
      console.log(">>> [modalButtonRefCallback] Conditions met. Calling setupLoom...");
      setupLoom(node)
        .then(() => {
          loomSDKInitializedRef.current = true; // Mark SDK as initialized
          setIsModalButtonConfigured(true); // Mark button as configured for UI updates
        })
        .catch(setupError => {
          console.error(">>> [modalButtonRefCallback] setupLoom promise rejected:", setupError.message);
          // Ensure UI reflects that the button is not ready/configured
          setIsModalButtonConfigured(false);
          loomSDKInitializedRef.current = false; // Ensure initialized ref is false if setup fails
          // setError and setLoomStatus are primarily handled within setupLoom now.
        });
    } else if (node && loomSDKInitializedRef.current) {
      console.log(">>> [modalButtonRefCallback] SDK already initialized. Ensuring button is configured for UI.");
      // If SDK was previously initialized successfully, ensure the button state reflects this.
      setIsModalButtonConfigured(true);
    } else if (node && !loomPublicAppId) {
      console.warn(">>> [modalButtonRefCallback] Node exists, but App ID missing.");
      node.disabled = true;
      console.warn('Loom button rendered, but Public App ID is missing.');
    } else if (!node) {
      console.log(">>> modalButtonRefCallback cleanup running (node is null).");
      loomSDKInitializedRef.current = false; // Reset SDK initialization status
      setIsModalButtonConfigured(false); // Reset button UI configuration state
    } else if (node && !loomSDKInitializedRef.current) {
      // This case handles when the node is present, App ID is present, but SDK is not yet initialized.
      // It's covered by the first `if` block, but adding a log here for clarity or future conditions.
      console.log(">>> [modalButtonRefCallback] Node present, App ID present, SDK not initialized - setupLoom should be called.");
    } else {
      // Catch-all for other conditions, e.g. node is present but loomSDKInitializedRef.current is true (already handled)
      // or other unexpected states.
      console.log(">>> [modalButtonRefCallback] Conditions not met for setupLoom or cleanup. Current state:",
        `node: ${!!node}, loomPublicAppId: ${!!loomPublicAppId}, loomSDKInitializedRef: ${loomSDKInitializedRef.current}`);
    }
  }, [loomPublicAppId, setupLoom]); // Dependencies updated

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
    // No change to checkLoomSupport needed based on current request,
    // but it's good to ensure its error handling is also robust if it sets similar states.
    if (isMounted) {
      checkLoomSupport();
    }
  }, [isMounted, checkLoomSupport]);

  // Effect to track component mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Effect to read script from URL query params
  useEffect(() => {
    const scriptParam = searchParams.get('script');
    if (scriptParam) {
      // Decode if necessary (browsers usually handle basic encoding, but good practice)
      try {
        setScriptContent(decodeURIComponent(scriptParam));
      } catch (e) {
        console.error("Error decoding script parameter:", e);
        setScriptContent("Error loading script."); // Show error in UI
      }
    } else {
      setScriptContent("No script provided."); // Handle case where script is missing
    }
  }, [searchParams]);

  return (
    <div className="container max-w-4xl py-12">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column: Script Display */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Your Script</h2>
          <Card className="bg-muted/40 h-[400px] overflow-y-auto"> {/* Fixed height and scroll */} 
            <CardContent className="pt-6">
              {scriptContent ? (
                <p className="whitespace-pre-wrap">{scriptContent}</p> // Preserve whitespace
              ) : (
                <p className="text-muted-foreground">Loading script...</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Video Recording */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Record Your Video</h2>
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
                  : 'Click \"Record Video\" below. Your video will appear here after recording.'}
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
                    Please select "Camera Only" in the Loom interface that appears next before starting your recording.
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
  );
}