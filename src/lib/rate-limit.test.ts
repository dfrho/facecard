import { describe, expect, it } from 'vitest';
import { createRateLimiter } from './rate-limit';

const HOUR = 60 * 60 * 1000;

describe('createRateLimiter', () => {
  it('allows up to the limit within the window, then blocks', () => {
    const limiter = createRateLimiter({ limit: 3, windowMs: HOUR });
    const start = 1_000_000;

    expect(limiter.check('ada', start).allowed).toBe(true);
    expect(limiter.check('ada', start + 1).allowed).toBe(true);
    expect(limiter.check('ada', start + 2).allowed).toBe(true);

    const blocked = limiter.check('ada', start + 3);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBe(3600);
  });

  it('allows again once the oldest request leaves the window', () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: HOUR });

    limiter.check('ada', 0);
    limiter.check('ada', 10 * 60 * 1000);
    expect(limiter.check('ada', 30 * 60 * 1000).allowed).toBe(false);

    expect(limiter.check('ada', HOUR + 1).allowed).toBe(true);
  });

  it('tracks each key separately', () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: HOUR });

    expect(limiter.check('ada', 0).allowed).toBe(true);
    expect(limiter.check('ada', 1).allowed).toBe(false);
    expect(limiter.check('grace', 1).allowed).toBe(true);
  });

  it('does not count blocked attempts against the user', () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: HOUR });

    limiter.check('ada', 0);
    for (let i = 1; i < 50; i++) limiter.check('ada', i);

    expect(limiter.check('ada', HOUR + 1).allowed).toBe(true);
  });
});
