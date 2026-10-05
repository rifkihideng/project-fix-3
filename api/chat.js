// api/chat.js — Serverless function chatbot AI (Groq) untuk Vercel.
// Butuh environment variable: GROQ_API_KEY (dan opsional GROQ_MODEL).
import { site, packages, faqs } from '../src/data/portfolio.js';
import { applyCors } from '../lib/cors.js';
import { createRateLimiter, getClientIp } from '../lib/rate-limit.js';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Rate limit chatbot per IP. Di serverless (Vercel) limiter in-memory bersifat
// best-effort; untuk limit yang konsisten gunakan Upstash Redis (lihat lib/rate-limit.js).
const CHAT_RATE_LIMIT = Number(process.env.CHAT_RATE_LIMIT) || 10;
const CHAT_RATE_WINDOW_MS = Number(process.env.CHAT_RATE_WINDOW_MS) || 60_000;
const chatLimiter = createRateLimiter({
  limit: CHAT_RATE_LIMIT,
  windowMs: CHAT_RATE_WINDOW_MS,
});

const SYSTEM_PROMPT = [
  `Kamu adalah asisten virtual di website portofolio ${site.name}.`,
  'Jawab singkat, jelas, ramah, dan gunakan bahasa yang sama dengan pertanyaan pengguna (default Bahasa Indonesia).',
  '',
  'Informasi pemilik:',
  `- Nama: ${site.name}`,
  `- Profesi: ${site.role}`,
  `- Lokasi: ${site.location}`,
  `- Email: ${site.email}`,
  `- Telepon: ${site.phone}`,
  `- WhatsApp: ${site.whatsapp}`,
  `- Status: ${site.status}`,
  '',
  'Layanan / paket yang tersedia:',
  ...packages.map((p) => `- ${p.name}: ${p.price} — ${p.description}`),
  '',
  'FAQ:',
  ...faqs.map((f) => `- Q: ${f.question}\n  A: ${f.answer}`),
  '',
  'Aturan:',
  '- Jangan mengarang harga, kontak, atau layanan di luar data di atas.',
  '- Jika pengguna ingin memesan atau menghubungi, arahkan ke WhatsApp ' +
    `${site.whatsapp} atau email ${site.email}.`,
  '- Jika pertanyaan di luar konteks, jawab sopan lalu arahkan kembali ke layanan.',
].join('\n');

async function handleChat(messages, lang = 'id') {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY belum diatur di environment Vercel');
  }

  const langNote =
    lang === 'en'
      ? 'Jawablah SEMUA balasan dalam Bahasa Inggris (English), apa pun bahasa pertanyaan pengguna.'
      : 'Jawablah SEMUA balasan dalam Bahasa Indonesia, apa pun bahasa pertanyaan pengguna.';

  const history = messages
    .filter((m) => m && typeof m.content === 'string')
    .slice(-12)
    .map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }));

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'system', content: `${SYSTEM_PROMPT}\n\n${langNote}` }, ...history],
      temperature: 0.4,
      max_completion_tokens: 500,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Groq error ${response.status}: ${text.slice(0, 300)}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content ?? 'Maaf, saya tidak bisa menjawab saat ini.';
}

export default async function handler(req, res) {
  applyCors(req, res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method tidak diizinkan' });
    return;
  }

  const limit = chatLimiter(getClientIp(req, { trustProxy: true }));
  if (!limit.allowed) {
    res.setHeader('Retry-After', Math.ceil(limit.retryAfterMs / 1000));
    res.status(429).json({
      error: 'Terlalu banyak permintaan. Coba lagi nanti.',
      retryAfterMs: limit.retryAfterMs,
    });
    return;
  }

  try {
    const body = req.body || {};
    if (!Array.isArray(body.messages)) {
      res.status(400).json({ error: 'messages harus berupa array' });
      return;
    }
    const reply = await handleChat(body.messages, body.lang);
    res.status(200).json({ reply });
  } catch (error) {
    console.error('[api/chat]', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server. Coba lagi nanti.' });
  }
}
