'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { createInstance } from '@loomhq/record-sdk';

type SDKResult = Awaited<ReturnType<typeof createInstance>>;
type SDKButton = ReturnType<SDKResult['configureButton']>;

export interface RecordedVideo {
  sharedUrl: string;
}

export type LoomRecorderState =
  | { status: 'loading' }
  | { status: 'ready' }
  | { status: 'unavailable'; message: string };

export const NOT_CONFIGURED_MESSAGE = "Video recording isn't set up for this site yet.";
export const SETUP_FAILED_MESSAGE =
  "The Loom recorder couldn't start. Please refresh the page or try again later.";

/**
 * A plain-language explanation for each reason Loom reports a browser as unsupported.
 * The reasons are the string values of the SDK's SDKUnsupportedReasons, which it exports as a type only.
 */
export function unsupportedMessage(reason: string | undefined): string {
  switch (reason) {
    case 'third-party-cookies-disabled':
      return 'Loom needs third-party cookies to record. Allow them for this site, or try Chrome, Edge or Firefox.';
    case 'no-media-streams-support':
      return "This browser can't access a camera for recording. Try Chrome, Edge or Firefox.";
    case 'incompatible-browser':
    default:
      return "This browser can't record with Loom. Try Chrome, Edge or Firefox.";
  }
}

/**
 * Sets up the Loom recorder once for the page and exposes a function that opens it.
 * Loom is started when the page loads (not when a button mounts), so the recorder
 * survives the instructions dialog opening and closing.
 */
export function useLoomRecorder({
  appId,
  onInsert,
}: {
  appId: string | undefined;
  // The core no-unused-vars rule doesn't understand parameter names in TypeScript function types.
  // eslint-disable-next-line no-unused-vars
  onInsert: (video: RecordedVideo) => void;
}) {
  const [state, setState] = useState<LoomRecorderState>({ status: 'loading' });
  const buttonRef = useRef<SDKButton | null>(null);
  const onInsertRef = useRef(onInsert);
  onInsertRef.current = onInsert;

  useEffect(() => {
    if (!appId) {
      setState({ status: 'unavailable', message: NOT_CONFIGURED_MESSAGE });
      return;
    }

    let cancelled = false;
    let sdk: SDKResult | undefined;

    const setUp = async () => {
      // The SDK touches `document` as soon as it loads, so it must only be imported in the browser.
      const [{ createInstance, RecordingType }, { isSupported }] = await Promise.all([
        import('@loomhq/record-sdk'),
        import('@loomhq/record-sdk/is-supported'),
      ]);
      if (cancelled) return;

      const support = isSupported();
      if (!support.supported) {
        setState({ status: 'unavailable', message: unsupportedMessage(support.error) });
        return;
      }

      const instance = await createInstance({
        mode: 'standard',
        publicAppId: appId,
        config: {
          allowedRecordingTypes: [RecordingType.CameraOnly],
          defaultRecordingType: RecordingType.CameraOnly,
        },
      });
      sdk = instance;
      if (cancelled) {
        instance.teardown();
        return;
      }

      const status = instance.status();
      if (!status.success) {
        console.error(
          'Loom recorder failed to start. Check that this site is an allowed domain for the ' +
            'Loom app in the Loom developer portal.',
          status
        );
        setState({ status: 'unavailable', message: SETUP_FAILED_MESSAGE });
        return;
      }

      const button = instance.configureButton();
      button.on('insert-click', video => onInsertRef.current(video));
      buttonRef.current = button;
      setState({ status: 'ready' });
    };

    setUp().catch(error => {
      console.error('Loom recorder failed to start:', error);
      if (!cancelled) {
        setState({ status: 'unavailable', message: SETUP_FAILED_MESSAGE });
      }
    });

    return () => {
      cancelled = true;
      buttonRef.current = null;
      sdk?.teardown();
    };
  }, [appId]);

  const open = useCallback(() => {
    buttonRef.current?.openPreRecordPanel();
  }, []);

  return { state, open };
}
