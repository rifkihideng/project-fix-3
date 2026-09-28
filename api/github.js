// api/github.js — Serverless function: proxy statistik GitHub agar tidak kena rate-limit browser.
// Opsional environment variable: GITHUB_TOKEN (personal access token) untuk menaikkan rate limit.

const GITHUB_USER = 'rifkihideng';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

let cache = { data: null, ts: 0 };
const TTL = 60 * 60 * 1000; // 1 jam

async function fetchGithubStats() {
  const headers = { Accept: 'application/vnd.github+json' };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;

  const response = await fetch(`https://api.github.com/users/${GITHUB_USER}`, { headers });
  if (!response.ok) throw new Error(`GitHub error ${response.status}`);

  const data = await response.json();
  return {
    repos: data.public_repos,
    followers: data.followers,
    following: data.following,
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // Cache di CDN Vercel selama 1 jam agar jarang memanggil API GitHub.
  res.setHeader('Cache-Control', 'public, s-maxage=3600, max-age=3600, stale-while-revalidate=86400');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method tidak diizinkan' });
    return;
  }

  try {
    if (cache.data && Date.now() - cache.ts < TTL) {
      return res.status(200).json(cache.data);
    }
    const stats = await fetchGithubStats();
    cache = { data: stats, ts: Date.now() };
    res.status(200).json(stats);
  } catch (error) {
    // Jika ada cache (walaupun kedaluwarsa), pakai sebagai fallback.
    if (cache.data) {
      return res.status(200).json(cache.data);
    }
    res.status(502).json({ error: 'Gagal mengambil statistik GitHub' });
  }
}
