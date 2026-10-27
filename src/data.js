// CONCAVE — the launchpad for AI agents. Agents forge tokens on the
// Robinhood network (chainId 4663) and buy on the bonding curve, all by
// telling their own agent what to do. One prompt, no forms, no clicks.
// All launch figures and contract addresses below are SAMPLE data — the
// demo has no live backend.

export const CHAIN = {
  id: 4663,
  name: 'Robinhood',
  gas: 'ETH',
  dex: 'Robinhood DEX',
  rpc: 'https://rpc.mainnet.chain.robinhood.com',
}

// The agents you can tell.
export const AGENTS = [
  { id: 'hermes', name: 'Hermes', by: 'Nous Research' },
  { id: 'claude', name: 'Claude Code', by: 'Anthropic' },
  { id: 'codex', name: 'Codex', by: 'OpenAI' },
  { id: 'cursor', name: 'Cursor', by: 'Anysphere' },
  { id: 'opencode', name: 'OpenCode', by: 'SST' },
  { id: 'any', name: 'Any agent', by: 'agent-agnostic' },
]

// LAUNCH — the prompt that mints a token. Fill the blanks, paste, done.
export const LAUNCH_PROMPT = (name, ticker) =>
  `Launch a token on CONCAVE: name ${name || '<NAME>'}, ticker ${ticker || '<TICKER>'}, 1,000,000,000 fixed supply, anti-snipe tax on at open. Deploy it on the Robinhood network and report the contract address.`

// BUY — the prompt that buys on the bonding curve, keyed off the contract
// address (CA) the launch returned.
export const BUY_PROMPT = (ca, amountEth) =>
  `Buy ${amountEth} ETH of the token at ${ca} on the CONCAVE bonding curve on the Robinhood network. Report the tokens received and the price paid.`

// Sample token launches. `ca` is the contract address the launching agent
// returned; it is what a buyer pastes to their own agent to buy.
export const LAUNCHES = [
  { id: 'nova', name: 'Nova', symbol: 'NOVA', color: '#e2483d', agent: 'Hermes',
    ca: '0x9f3c2a7e4b5d8f1a6c0e9b2d3f4a5b6c7d8e9f0',
    desc: 'A deflationary store of value with a staking engine.',
    mcap: 12840000, holders: 3120, progress: 78,
    supply: '1,000,000,000', created: '2d ago' },
  { id: 'helios', name: 'Helios', symbol: 'HEL', color: '#f4b829', agent: 'Claude Code',
    ca: '0x1b8a3d5c7e9f1a2b4c6d8e0f2a4b6c8d0e2f4a6',
    desc: 'Solar-energy RWA tokens, minted against verified generation.',
    mcap: 9410000, holders: 2480, progress: 61,
    supply: '1,000,000,000', created: '5d ago' },
  { id: 'atlas', name: 'Atlas', symbol: 'ATL', color: '#3d8cff', agent: 'Codex',
    ca: '0x47c2e5a8d0f3b6c9e1a4d7f0b3c6e9a1d4f7b0c3',
    desc: 'A mapping and geospatial data network owned by its mappers.',
    mcap: 7200000, holders: 1950, progress: 44,
    supply: '1,000,000,000', created: '1d ago' },
  { id: 'orbital', name: 'Orbital', symbol: 'ORB', color: '#8c6cff', agent: 'Cursor',
    ca: '0x2a5d8f1b4e7c9a0d3f6b8e1c4a7d0f3b6e9c1a4d',
    desc: 'Launchpad and satellite telemetry settlement, per uplink.',
    mcap: 5100000, holders: 1420, progress: 33,
    supply: '1,000,000,000', created: '8d ago' },
  { id: 'pulse', name: 'Pulse', symbol: 'PLS', color: '#43c25c', agent: 'OpenCode',
    ca: '0x8c4f1a6d9e2b5c7f0a3d6e9b1c4f7a0d3e6b9c1f4',
    desc: 'A heartbeat-oracle paying keepers for on-chain health checks.',
    mcap: 4300000, holders: 1180, progress: 27,
    supply: '1,000,000,000', created: '12d ago' },
  { id: 'vector', name: 'Vector', symbol: 'VEC', color: '#231e16', agent: 'Hermes',
    ca: '0x5d0a3c6f9e2b5d8f1a4c7e0b3d6f9a2c5e8b1d4f7',
    desc: 'Directional liquidity routing for the hook ecosystem.',
    mcap: 3100000, holders: 870, progress: 19,
    supply: '1,000,000,000', created: '3d ago' },
  { id: 'aurum', name: 'Aurum', symbol: 'AUR', color: '#e6a23c', agent: 'Claude Code',
    ca: '0xe3a6d9f2b5c8e1a4d7f0b3c6e9a2d5f8b1c4e7a0d',
    desc: 'Tokenised gold, redeemable and audited on-chain.',
    mcap: 2700000, holders: 640, progress: 14,
    supply: '1,000,000,000', created: '15d ago' },
  { id: 'titan', name: 'Titan', symbol: 'TTN', color: '#857d6e', agent: 'Any agent',
    ca: '0x7f1c4a7d0e3b6f9c2a5e8d1b4f7c0a3e6d9b2f5c8',
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
