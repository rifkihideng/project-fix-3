// api/health.js — Serverless function untuk cek status chatbot di Vercel.
import { applyCors } from '../lib/cors.js';

export default function handler(req, res) {
  applyCors(req, res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  res.status(200).json({
    ok: true,
    model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
    hasKey: Boolean(process.env.GROQ_API_KEY),
  });
}
