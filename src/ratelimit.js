// Fixed-window rate limit for public share links: LIMIT requests per WINDOW_MS per client.
export const LIMIT = 30;
export const WINDOW_MS = 60 * 1000;
const hits = new Map();

export function rateLimit(req, res, next) {
  const key = req.get('x-forwarded-for') || req.ip;
  const now = Date.now();
  let entry = hits.get(key);
  if (!entry) {
    entry = { start: now, count: 0 };
    hits.set(key, entry);
  }
  if (now - entry.start > WINDOW_MS) entry = { start: now, count: 0 };
  if (entry.count > LIMIT) return res.status(429).json({ error: 'too many requests' });
  entry.count++;
  next();
}
