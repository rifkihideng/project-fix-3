// server.js — Backend kecil untuk chatbot AI (Groq, gratis).
// Jalankan: node server.js  (default port 3001)
// Butuh: GROQ_API_KEY di file .env atau environment variable.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, packages, faqs } from './src/data/portfolio.js';
import { corsHeaders } from './lib/cors.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env sederhana (tanpa dependency).
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}
loadEnv();

const PORT = Number(process.env.PORT) || 3001;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

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

function sendJson(req, res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    ...corsHeaders(req),
  });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new Error('Body terlalu besar'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(raw));
    req.on('error', reject);
  });
}

async function handleChat(messages, lang = 'id') {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY belum diatur di .env');
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

let githubCache = { data: null, ts: 0 };
const GITHUB_TTL = 60 * 60 * 1000; // 1 jam

async function fetchGithubStats() {
  const headers = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch('https://api.github.com/users/rifkihideng', { headers });
  if (!response.ok) throw new Error(`GitHub error ${response.status}`);
  const data = await response.json();
  return {
    repos: data.public_repos,
    followers: data.followers,
    following: data.following,
  };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') {
    sendJson(req, res, 204, {});
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/health') {
    sendJson(req, res, 200, { ok: true, model: GROQ_MODEL, hasKey: Boolean(GROQ_API_KEY) });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/chat') {
    try {
      const raw = await readBody(req);
      const body = raw ? JSON.parse(raw) : {};
      if (!Array.isArray(body.messages)) {
        sendJson(req, res, 400, { error: 'messages harus berupa array' });
        return;
      }
      const reply = await handleChat(body.messages, body.lang);
      sendJson(req, res, 200, { reply });
    } catch (error) {
      console.error('[api/chat]', error);
      sendJson(req, res, 500, { error: 'Terjadi kesalahan pada server. Coba lagi nanti.' });
    }
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/github') {
    try {
      if (!githubCache.data || Date.now() - githubCache.ts > GITHUB_TTL) {
        githubCache = { data: await fetchGithubStats(), ts: Date.now() };
      }
      sendJson(req, res, 200, githubCache.data);
    } catch (error) {
      console.error('[api/github]', error);
      if (githubCache.data) {
        sendJson(req, res, 200, githubCache.data);
      } else {
        sendJson(req, res, 502, { error: 'Gagal mengambil statistik GitHub' });
      }
    }
    return;
  }

  sendJson(req, res, 404, { error: 'Tidak ditemukan' });
});

server.listen(PORT, () => {
  console.log(`Chatbot backend berjalan di http://localhost:${PORT}`);
  console.log(`Model: ${GROQ_MODEL}`);
  console.log(
    GROQ_API_KEY ? 'GROQ_API_KEY: ✓ terdeteksi' : 'GROQ_API_KEY: ✗ belum diatur (lihat .env.example)'
  );
});
