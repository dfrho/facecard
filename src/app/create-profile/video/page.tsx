'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { oembed } from '@loomhq/loom-embed';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { loadFormData } from '@/lib/form-utils';
import { RecordedVideo, useLoomRecorder } from '@/lib/use-loom-recorder';

// The sandbox Loom app is for local development; deployed builds use the production app.
const LOOM_APP_ID =
  process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_LOOM_SANDBOX_PUBLIC_APP_ID
    : process.env.NEXT_PUBLIC_LOOM_PUBLIC_APP_ID;

export default function VideoPage() {
  return (
    <Suspense fallback={<div>Loading script...</div>}>
      <VideoPageContent />
    </Suspense>
  );
}

function VideoPageContent() {
  const searchParams = useSearchParams();
  const [scriptContent, setScriptContent] = useState<string | null>(null);
  const [loomVideoHtml, setLoomVideoHtml] = useState<string | null>(null);
  const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInsert = useCallback(async ({ sharedUrl }: RecordedVideo) => {
    if (!sharedUrl) {
      setError("Loom didn't return a link to your video. Please try again.");
      return;
    }
    try {
      const { html } = await oembed(sharedUrl);
      setLoomVideoHtml(html);
      setError(null);
    } catch (embedError) {
      console.error('Error fetching Loom oEmbed data:', embedError);
      setError('Your video was saved, but it could not be shown here. Please try inserting it again.');
    }
  }, []);

  const recorder = useLoomRecorder({ appId: LOOM_APP_ID, onInsert: handleInsert });
  const recorderState = recorder.state;

  const startRecording = () => {
    // Close the instructions first: while the dialog is open the rest of the page,
    // including Loom's recorder panel, can't be clicked.
    setIsInstructionModalOpen(false);
    recorder.open();
  };

  // Prefer the script saved with the profile, then fall back to the URL parameter.
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
      } catch (decodeError) {
        console.error('Error decoding script parameter:', decodeError);
        setScriptContent(null);
      }
    }
  }, [searchParams]);

  const recordButtonLabel =
    recorderState.status === 'loading'
      ? 'Setting up recorder...'
      : recorderState.status === 'unavailable'
        ? 'Recording unavailable'
        : loomVideoHtml
          ? 'Record Again'
          : 'Record Video';

  const message = error ?? (recorderState.status === 'unavailable' ? recorderState.message : null);

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
          {/* Left column: script */}
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">Your Script</h2>
            <Card className="bg-muted/40 h-[240px] overflow-y-auto sm:h-[400px]">
              <CardContent className="pt-6">
                {scriptContent ? (
                  <p className="whitespace-pre-wrap">{scriptContent}</p>
                ) : (
                  <p className="text-muted-foreground">No script found. Go back and generate one.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right column: recording */}
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">Record</h2>
            {loomVideoHtml ? (
              <div
                className="aspect-video w-full rounded-lg overflow-hidden shadow-lg"
                dangerouslySetInnerHTML={{ __html: loomVideoHtml }}
              />
            ) : (
              <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center">
                <p className="text-muted-foreground text-center px-4">
                  Click &quot;Record Video&quot; below. Your video will appear here after recording.
                </p>
              </div>
            )}
            {message && (
              <div
                role="alert"
                className="mb-4 rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive"
              >
                <p>{message}</p>
              </div>
            )}
            <div className="flex justify-center pt-4">
              <Button
                id="loom-record-trigger-button"
                size="lg"
                disabled={recorderState.status !== 'ready'}
                onClick={() => setIsInstructionModalOpen(true)}
              >
                {recordButtonLabel}
              </Button>
              <Dialog open={isInstructionModalOpen} onOpenChange={setIsInstructionModalOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Prepare for Recording</DialogTitle>
                    <DialogDescription>
                      Loom will open next. Allow camera and microphone access when your browser
                      asks, then start recording.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button id="modal-loom-record-button" onClick={startRecording}>
                      Continue to Recording
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
