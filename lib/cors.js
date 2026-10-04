// lib/cors.js — Allowlist CORS untuk endpoint API.
// Panggilan API di frontend bersifat same-origin (path relatif /api/...),
// jadi CORS hanya perlu dibuka untuk origin yang diizinkan secara eksplisit.
// Tambahkan origin lain lewat env ALLOWED_ORIGIN (dipisah koma) bila perlu.

const DEFAULT_ORIGINS = 'http://localhost:5173,http://127.0.0.1:5173';

const ALLOWED_ORIGINS = new Set(
  (process.env.ALLOWED_ORIGIN || DEFAULT_ORIGINS)
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
);

export function corsHeaders(req) {
  const origin = req?.headers?.origin;
  if (!origin || !ALLOWED_ORIGINS.has(origin)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export function applyCors(req, res) {
  const headers = corsHeaders(req);
  for (const [key, value] of Object.entries(headers)) {
    res.setHeader(key, value);
  }
}
