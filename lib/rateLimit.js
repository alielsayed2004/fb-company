// In-memory sliding-window rate limiter.
// Note: on Vercel each serverless instance keeps its own memory, so limits are per instance.
// For a hard global limit, back this with a shared store (e.g. Upstash Redis / Vercel KV).
const buckets = new Map();

export function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  return (forwarded ? forwarded.split(',')[0].trim() : null) || request.headers.get('x-real-ip') || 'unknown';
}

// Returns { limited, retryAfterSeconds }.
export function rateLimit(key, { limit, windowMs }) {
  const now = Date.now();
  const windowStart = now - windowMs;
  const recent = (buckets.get(key) || []).filter((t) => t > windowStart);

  if (recent.length >= limit) {
    buckets.set(key, recent);
    const retryAfterSeconds = Math.max(1, Math.ceil((recent[0] + windowMs - now) / 1000));
    return { limited: true, retryAfterSeconds };
  }

  recent.push(now);
  buckets.set(key, recent);

  if (buckets.size > 5000) {
    for (const [k, times] of buckets.entries()) {
      const active = times.filter((t) => t > windowStart);
      if (active.length === 0) buckets.delete(k);
      else buckets.set(k, active);
    }
  }

  return { limited: false, retryAfterSeconds: 0 };
}
