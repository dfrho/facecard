export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the caller can try again; 0 when allowed. */
  retryAfterSeconds: number;
}

/**
 * A sliding-window limiter kept in memory. On Vercel each function instance has its own
 * copy, so this stops bursts from one user on an instance but is not a hard global limit;
 * pair it with a spend limit on the Anthropic account (or move to a shared store such as
 * Upstash Redis if a strict limit is needed).
 */
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, number[]>();

  function prune(now: number) {
    hits.forEach((times, key) => {
      if (times.every(time => time <= now - windowMs)) {
        hits.delete(key);
      }
    });
  }

  return {
    check(key: string, now: number = Date.now()): RateLimitResult {
      if (hits.size > 10_000) {
        prune(now);
      }
      const recent = (hits.get(key) ?? []).filter(time => time > now - windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return {
          allowed: false,
          retryAfterSeconds: Math.max(1, Math.ceil((recent[0] + windowMs - now) / 1000)),
        };
      }
      recent.push(now);
      hits.set(key, recent);
      return { allowed: true, retryAfterSeconds: 0 };
    },
  };
}
