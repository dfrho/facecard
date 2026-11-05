import { describe, expect, it } from 'vitest';
import { unsupportedMessage } from './use-loom-recorder';

describe('unsupportedMessage', () => {
  it('explains each reason Loom gives for an unsupported browser', () => {
    expect(unsupportedMessage('third-party-cookies-disabled')).toContain('third-party cookies');
    expect(unsupportedMessage('no-media-streams-support')).toContain('access a camera');
    expect(unsupportedMessage('incompatible-browser')).toContain("can't record with Loom");
  });

  it('falls back to the generic browser message for unknown reasons', () => {
    expect(unsupportedMessage(undefined)).toBe(unsupportedMessage('incompatible-browser'));
  });
});
