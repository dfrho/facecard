// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeProfile } from '@/test/profile-fixture';
import { generateScript, getScriptVersions, saveScriptVersion } from './openai-enhanced';

function mockFetch(response: { ok: boolean; status?: number; body?: unknown; text?: string }) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: response.ok,
    status: response.status ?? 200,
    json: async () => response.body,
    text: async () => response.text ?? '',
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('generateScript', () => {
  it('posts the profile to the script API and returns the script', async () => {
    const fetchMock = mockFetch({ ok: true, body: { script: 'Hi, I am Ada.' } });
    const profile = makeProfile();

    await expect(generateScript(profile)).resolves.toBe('Hi, I am Ada.');

    expect(fetchMock).toHaveBeenCalledWith('/api/generate-script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
  });

  it('includes the status and body when the API fails', async () => {
    mockFetch({ ok: false, status: 500, text: 'Claude API call failed' });

    await expect(generateScript(makeProfile())).rejects.toThrow(
      'Failed to generate script: API route failed: 500 - Claude API call failed'
    );
  });

  it("uses the API's own message when it explains the failure", async () => {
    mockFetch({
      ok: false,
      status: 429,
      text: JSON.stringify({ error: 'Please try again in 12 minutes.' }),
    });

    await expect(generateScript(makeProfile())).rejects.toThrow(
      'Failed to generate script: Please try again in 12 minutes.'
    );
  });

  it('wraps network errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Network down')));

    await expect(generateScript(makeProfile())).rejects.toThrow(
      'Failed to generate script: Network down'
    );
  });
});

describe('script version history', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts empty', () => {
    expect(getScriptVersions('profile-1')).toEqual([]);
  });

  it('stores versions newest first, per profile', async () => {
    const first = await saveScriptVersion('First draft', 'profile-1', 'ai');
    const second = await saveScriptVersion('Second draft', 'profile-1');
    await saveScriptVersion('Other profile', 'profile-2');

    const versions = getScriptVersions('profile-1');
    expect(versions.map(v => v.content)).toEqual(['Second draft', 'First draft']);
    expect(versions[0]).toEqual(second);
    expect(versions[1]).toEqual(first);
    expect(first.source).toBe('ai');
    expect(second.source).toBe('user');
    expect(Number.isNaN(Date.parse(first.timestamp))).toBe(false);
  });

  it('returns an empty history when stored data is corrupted', () => {
    localStorage.setItem('script_versions_profile-1', '{not json');
    expect(getScriptVersions('profile-1')).toEqual([]);
  });
});
