import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeFullProfile } from '@/test/profile-fixture';
import { ProfileFormData } from '@/types/profile';
import { POST } from './route';

const anthropic = vi.hoisted(() => ({
  create: vi.fn(),
  clientOptions: [] as unknown[],
}));

vi.mock('@anthropic-ai/sdk', () => ({
  default: class {
    messages = { create: anthropic.create };

    constructor(options: unknown) {
      anthropic.clientOptions.push(options);
    }
  },
}));

const auth = vi.hoisted(() => ({ getServerSession: vi.fn(), userCount: 0 }));
vi.mock('next-auth', () => ({ getServerSession: auth.getServerSession }));

function post(body: string, headers: Record<string, string> = {}) {
  return POST(
    new NextRequest('http://localhost/api/generate-script', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json', ...headers },
    })
  );
}

function postProfile(profile: ProfileFormData | Record<string, unknown>) {
  return post(JSON.stringify(profile));
}

beforeEach(() => {
  anthropic.create.mockReset();
  anthropic.clientOptions.length = 0;
  // A fresh user per test, so the per-user rate limit never carries over between tests.
  auth.userCount += 1;
  auth.getServerSession.mockResolvedValue({
    user: { id: `user-${auth.userCount}`, name: 'Ada Lovelace', email: 'ada@example.com' },
  });
});

describe('POST /api/generate-script access and limits', () => {
  it('rejects signed-out requests without calling Claude', async () => {
    vi.stubEnv('CLAUDE_API_KEY', 'test-key');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    auth.getServerSession.mockResolvedValue(null);

    const response = await postProfile(makeFullProfile());

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: 'Please sign in to generate a script.' });
    expect(anthropic.create).not.toHaveBeenCalled();
    expect(JSON.parse(warn.mock.calls[0][0])).toMatchObject({
      event: 'script_generation_rejected',
      reason: 'unauthenticated',
    });
  });

  it('rejects fields over the length limit', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const response = await postProfile(makeFullProfile({ funFact: 'x'.repeat(1001) }));

    expect(response.status).toBe(400);
    expect((await response.json()).error).toBe('"funFact" is too long (maximum 1000 characters).');
    expect(anthropic.create).not.toHaveBeenCalled();
  });

  it('rejects malformed and non-object bodies', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect((await post('{not json')).status).toBe(400);
    expect((await post('"just a string"')).status).toBe(400);
    expect((await post('[1, 2, 3]')).status).toBe(400);
  });

  it('rejects bodies declared larger than 100 KB before parsing them', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const response = await post(JSON.stringify(makeFullProfile()), { 'Content-Length': '200000' });

    expect(response.status).toBe(413);
  });

  it('limits each user to 20 generations an hour', async () => {
    vi.stubEnv('CLAUDE_API_KEY', '');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    for (let i = 0; i < 20; i++) {
      expect((await postProfile(makeFullProfile())).status).toBe(200);
    }
    const limited = await postProfile(makeFullProfile());

    expect(limited.status).toBe(429);
    expect(Number(limited.headers.get('Retry-After'))).toBeGreaterThan(0);
    expect((await limited.json()).error).toMatch(/try again in \d+ minutes?/);
    expect(JSON.parse(warn.mock.calls[0][0])).toMatchObject({ reason: 'rate_limited' });

    // Another user is unaffected.
    auth.getServerSession.mockResolvedValue({ user: { id: 'someone-else' } });
    expect((await postProfile(makeFullProfile())).status).toBe(200);
  });
});

describe('POST /api/generate-script', () => {
  it('falls back to the template script when no Claude API key is set', async () => {
    vi.stubEnv('CLAUDE_API_KEY', '');

    const response = await postProfile(makeFullProfile());

    expect(response.status).toBe(200);
    const { script } = await response.json();
    expect(script).toContain('Ada');
    expect(script).toContain('My professional superpower is solving impossible problems.');
    expect(anthropic.create).not.toHaveBeenCalled();
  });

  it('asks Claude for a script built from the profile', async () => {
    vi.stubEnv('CLAUDE_API_KEY', 'test-key');
    anthropic.create.mockResolvedValue({ content: [{ type: 'text', text: "Hi, I'm Ada." }] });

    const response = await postProfile(makeFullProfile());

    expect(await response.json()).toEqual({ script: "Hi, I'm Ada." });
    expect(anthropic.clientOptions).toEqual([{ apiKey: 'test-key' }]);
    expect(anthropic.create).toHaveBeenCalledTimes(1);

    const request = anthropic.create.mock.calls[0][0];
    expect(request.model).toEqual(expect.any(String));
    expect(request.max_tokens).toBe(1024);
    expect(request.messages).toHaveLength(1);
    expect(request.messages[0].role).toBe('user');
    expect(request.messages[0].content).toContain('- Name: Ada Lovelace');
    expect(request.messages[0].content).toContain('- Primary Ask: intros to seed-stage founders');
  });

  it('strips bracketed stage directions and extra blank lines', async () => {
    vi.stubEnv('CLAUDE_API_KEY', 'test-key');
    anthropic.create.mockResolvedValue({
      content: [
        {
          type: 'text',
          text: "[Scene: office]\nHi, I'm Ada.\n\n\n\n[Camera pans]\nLet's talk.\n[Fade out]",
        },
      ],
    });

    const { script } = await (await postProfile(makeFullProfile())).json();

    expect(script).toBe("Hi, I'm Ada.\n\nLet's talk.");
  });

  it('returns an empty script when Claude sends no text', async () => {
    vi.stubEnv('CLAUDE_API_KEY', 'test-key');
    anthropic.create.mockResolvedValue({ content: [] });

    const { script } = await (await postProfile(makeFullProfile())).json();

    expect(script).toBe('');
  });

  it('surfaces Claude API errors', async () => {
    vi.stubEnv('CLAUDE_API_KEY', 'test-key');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    anthropic.create.mockRejectedValue(new Error('overloaded'));

    await expect(postProfile(makeFullProfile())).rejects.toThrow(
      'Claude API call failed: overloaded'
    );
  });
});
