#!/usr/bin/env node
// Report a launch to the shared feed.
//
// The crucible-launchpad skill calls this right after a successful `forge
// create`. It appends the new token to launches.json in the repo and commits
// it through the GitHub API, so the website shows it to everyone on the next
// poll. No private key is read here — only the public CA, name and symbol.
//
// Auth: GITHUB_TOKEN env var, else the `gh` CLI's token (`gh auth token`).
//
// Usage:
//   node scripts/report-launch.mjs \
//     --name "Nova" --symbol "NOVA" --ca 0x... \
//     [--agent "Hermes"] [--desc "..."] [--dry-run]

import { execSync } from 'node:child_process'

const REPO = process.env.CRUCIBLE_REPO || '0xklen/crucible'
const PATH = 'launches.json'
const API = `https://api.github.com/repos/${REPO}/contents/${PATH}`

function arg(name) {
  const i = process.argv.indexOf('--' + name)
  return i === -1 ? null : process.argv[i + 1]
}

const dryRun = process.argv.includes('--dry-run')
const name = arg('name')
const symbol = arg('symbol')
const ca = arg('ca')
const agent = arg('agent') || 'agent'
const desc = arg('desc') || `${name} — launched through the crucible-launchpad skill.`

if (!name || !symbol || !ca) {
  console.error(
    'usage: node scripts/report-launch.mjs --name <name> --symbol <SYM> --ca <0x..> [--agent <agent>] [--desc <desc>] [--dry-run]',
  )
  process.exit(2)
}

function ghToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN
  try {
    return execSync('gh auth token', { encoding: 'utf8' }).trim()
  } catch {
    return ''
  }
}

const token = ghToken()
const ghHeaders = {
  'User-Agent': 'crucible-launchpad',
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
}
if (token) ghHeaders.Authorization = `Bearer ${token}`

const launch = {
  id: symbol.toLowerCase() + '-' + Date.now().toString(36),
  name,
  symbol,
  color: '#f4b829',
  agent,
  ca: ca.startsWith('0x') ? ca : '0x' + ca,
  desc,
  mcap: 0,
  holders: 0,
  progress: 0,
  supply: '1,000,000,000',
  created: new Date().toISOString().slice(0, 10),
}

const get = await fetch(API, { headers: ghHeaders })
if (!get.ok) {
  console.error(`failed to read ${PATH}: ${get.status} ${await get.text()}`)
  process.exit(1)
}
const { content, sha } = await get.json()
const current = JSON.parse(Buffer.from(content, 'base64').toString('utf8'))
current.push(launch)
const next = Buffer.from(JSON.stringify(current, null, 2) + '\n').toString('base64')

if (dryRun) {
  console.log(JSON.stringify(launch, null, 2))
  console.log(`would append to ${PATH} (${current.length} launches total)`)
  process.exit(0)
}

const put = await fetch(API, {
  method: 'PUT',
  headers: ghHeaders,
  body: JSON.stringify({ message: `launch: ${symbol} (${ca})`, content: next, sha }),
})
if (!put.ok) {
  console.error(`failed to commit ${PATH}: ${put.status} ${await put.text()}`)
  process.exit(1)
}
console.log(`reported launch ${symbol} -> ${ca}`)
