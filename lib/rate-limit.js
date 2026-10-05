// lib/rate-limit.js — Rate limiter sederhana berbasis IP (sliding window, in-memory).
//
// Untuk server lokal (server.js) yang berjalan terus-menerus, limiter ini bekerja
// penuh karena state tersimpan dalam satu proses.
//
// Untuk serverless (Vercel), state in-memory bersifat best-effort: setiap instance
// punya Map sendiri dan bisa di-reset saat cold start. Jika butuh limit yang
// konsisten lintas instance, integrasikan Upstash Redis:
//   https://upstash.com/docs/redis/sdks/ts/overview
// (env: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN).

const DEFAULT_LIMIT = 10;
const DEFAULT_WINDOW_MS = 60_000;
const CLEANUP_INTERVAL_MS = 60_000;

export function createRateLimiter({
  limit = DEFAULT_LIMIT,
  windowMs = DEFAULT_WINDOW_MS,
} = {}) {
  const max = Math.max(1, Math.floor(limit) || DEFAULT_LIMIT);
  const window = Math.max(1000, Math.floor(windowMs) || DEFAULT_WINDOW_MS);
  const hits = new Map(); // ip -> number[] (timestamp request)
  let lastCleanup = Date.now();

  return function rateLimit(ip = 'unknown') {
    const now = Date.now();
    const cutoff = now - window;

    // Bersihkan entri lama secara berkala agar Map tidak membengkak.
    if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
      lastCleanup = now;
      for (const [key, timestamps] of hits) {
        const fresh = timestamps.filter((t) => t > cutoff);
        if (fresh.length === 0) hits.delete(key);
        else hits.set(key, fresh);
      }
    }

    const timestamps = (hits.get(ip) || []).filter((t) => t > cutoff);

    if (timestamps.length >= max) {
      const retryAfterMs = Math.max(0, timestamps[0] + window - now);
      hits.set(ip, timestamps);
      return { allowed: false, remaining: 0, retryAfterMs };
    }

    timestamps.push(now);
    hits.set(ip, timestamps);
    return { allowed: true, remaining: max - timestamps.length, retryAfterMs: 0 };
  };
}

export function getClientIp(req, { trustProxy = false } = {}) {
  // Di balik proxy tepercaya (mis. edge Vercel), IP klien ada di header pertama
  // X-Forwarded-For. Jangan aktifkan trustProxy pada server yang bisa diakses
  // langsung tanpa proxy, karena header ini bisa dipalsukan klien.
  if (trustProxy) {
    const xff = req?.headers?.['x-forwarded-for'];
    if (typeof xff === 'string' && xff.trim()) {
      return xff.split(',')[0].trim();
    }
  }

  const raw = req?.socket?.remoteAddress || req?.connection?.remoteAddress || '';
  return raw.replace(/^::ffff:/, '') || 'unknown';
}
