// CRUCIBLE — the launchpad for AI agents. Agents forge tokens on the
// Robinhood network (chainId 4663) by telling their own agent what to
// launch. One prompt, no forms. All launch figures below are SAMPLE data —
// the demo has no live backend.

export const CHAIN = {
  id: 4663,
  name: 'Robinhood',
  gas: 'ETH',
  dex: 'Robinhood DEX',
  rpc: 'https://rpc.mainnet.chain.robinhood.com',
}

// The agents you can tell. `prompt` is the copy-paste instruction the user
// hands to that agent.
export const AGENTS = [
  { id: 'hermes', name: 'Hermes', by: 'Nous Research' },
  { id: 'claude', name: 'Claude Code', by: 'Anthropic' },
  { id: 'codex', name: 'Codex', by: 'OpenAI' },
  { id: 'cursor', name: 'Cursor', by: 'Anysphere' },
  { id: 'opencode', name: 'OpenCode', by: 'SST' },
  { id: 'any', name: 'Any agent', by: 'agent-agnostic' },
]

// One prompt to rule them all — fill the blanks, paste it, the agent does the rest.
export const PROMPT =
  'Launch a token on CRUCIBLE: name <NAME>, ticker <TICKER>, 1,000,000,000 fixed supply, anti-snipe tax on at open. Deploy it on the Robinhood network and report the contract address.'

export const LAUNCHES = [
  { id: 'nova', name: 'Nova', symbol: 'NOVA', color: '#e2483d', agent: 'Hermes',
    desc: 'A deflationary store of value with a staking engine.',
    mcap: 12840000, holders: 3120, progress: 78,
    supply: '1,000,000,000', created: '2d ago' },
  { id: 'helios', name: 'Helios', symbol: 'HEL', color: '#f4b829', agent: 'Claude Code',
    desc: 'Solar-energy RWA tokens, minted against verified generation.',
    mcap: 9410000, holders: 2480, progress: 61,
    supply: '1,000,000,000', created: '5d ago' },
  { id: 'atlas', name: 'Atlas', symbol: 'ATL', color: '#3d8cff', agent: 'Codex',
    desc: 'A mapping and geospatial data network owned by its mappers.',
    mcap: 7200000, holders: 1950, progress: 44,
    supply: '1,000,000,000', created: '1d ago' },
  { id: 'orbital', name: 'Orbital', symbol: 'ORB', color: '#8c6cff', agent: 'Cursor',
    desc: 'Launchpad and satellite telemetry settlement, per uplink.',
    mcap: 5100000, holders: 1420, progress: 33,
    supply: '1,000,000,000', created: '8d ago' },
  { id: 'pulse', name: 'Pulse', symbol: 'PLS', color: '#43c25c', agent: 'OpenCode',
    desc: 'A heartbeat-oracle paying keepers for on-chain health checks.',
    mcap: 4300000, holders: 1180, progress: 27,
    supply: '1,000,000,000', created: '12d ago' },
  { id: 'vector', name: 'Vector', symbol: 'VEC', color: '#231e16', agent: 'Hermes',
    desc: 'Directional liquidity routing for the hook ecosystem.',
    mcap: 3100000, holders: 870, progress: 19,
    supply: '1,000,000,000', created: '3d ago' },
  { id: 'aurum', name: 'Aurum', symbol: 'AUR', color: '#e6a23c', agent: 'Claude Code',
    desc: 'Tokenised gold, redeemable and audited on-chain.',
    mcap: 2700000, holders: 640, progress: 14,
    supply: '1,000,000,000', created: '15d ago' },
  { id: 'titan', name: 'Titan', symbol: 'TTN', color: '#857d6e', agent: 'Any agent',
    desc: 'Heavy-duty compute marketplace settled per inference.',
    mcap: 1900000, holders: 410, progress: 9,
    supply: '1,000,000,000', created: '6d ago' },
]

export const MACHINES = [
  { id: 'press', name: 'The Press', role: 'Mints the token',
    desc: 'A coin press stamps your supply into existence on the Robinhood network. The agent names it, the press strikes the full amount in one block.',
    file: '/machines/press.html' },
  { id: 'vendor', name: 'The Vending Machine', role: 'Sells along the curve',
    desc: 'Buyers feed ETH and the machine vends tokens at the bonding-curve price. Every sale moves the curve toward graduation.',
    file: '/machines/vendor.html' },
  { id: 'vault', name: 'The Vault', role: 'Locks and graduates',
    desc: 'When the curve completes, the raised liquidity is locked into the Vault and seeded into a Robinhood DEX pool. Trading continues there forever.',
    file: '/machines/vault.html' },
]
