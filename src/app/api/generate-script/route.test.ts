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

function postProfile(profile: ProfileFormData) {
  return POST(
    new NextRequest('http://localhost/api/generate-script', {
      method: 'POST',
      body: JSON.stringify(profile),
      headers: { 'Content-Type': 'application/json' },
    })
  );
}

beforeEach(() => {
  anthropic.create.mockReset();
  anthropic.clientOptions.length = 0;
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
