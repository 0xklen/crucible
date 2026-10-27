// Vercel serverless function — GET /api/launches
// Returns the shared launch feed straight from the repo (launches.json) so a
// launch made anywhere in the world shows up for every visitor on the next poll.
//
// Reads via the GitHub API for freshness (no CDN cache). Set GITHUB_TOKEN in
// the Vercel env to lift the unauthenticated rate limit.

const REPO = process.env.CRUCIBLE_REPO || '0xklen/crucible'
const PATH = 'launches.json'

export default async function handler(req, res) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers)
    res.end()
    return
  }

  if (req.method !== 'GET') {
    res.writeHead(405, headers)
    res.end(JSON.stringify({ error: 'method not allowed' }))
    return
  }

  const ghHeaders = {
    'User-Agent': 'crucible-launchpad',
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (process.env.GITHUB_TOKEN) {
    ghHeaders.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  try {
    const r = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${PATH}`,
      { headers: ghHeaders },
    )
    if (!r.ok) throw new Error(`github ${r.status}`)
    const body = await r.json()
    const launches = JSON.parse(Buffer.from(body.content, 'base64').toString('utf8'))
    res.writeHead(200, headers)
    res.end(JSON.stringify(launches))
  } catch (e) {
    res.writeHead(502, headers)
    res.end(
      JSON.stringify({
        error: 'launch feed unavailable',
        detail: String((e && e.message) || e),
      }),
    )
  }
}
