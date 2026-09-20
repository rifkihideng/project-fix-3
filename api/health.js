// api/health.js — Serverless function untuk cek status chatbot di Vercel.
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
