// CRUCIBLE — the launchpad for AI agents. The user installs the
// `crucible-launchpad` skill from the repo and their agent runs launch,
// buy and sell on the Robinhood network (chainId 4663) directly.
// Launch figures and contract addresses below are SAMPLE data — the demo
// has no live backend.

export const CHAIN = {
  id: 4663,
  name: 'Robinhood',
  gas: 'ETH',
  dex: 'Robinhood DEX',
  rpc: 'https://rpc.mainnet.chain.robinhood.com',
}

export const SKILL = {
  name: 'crucible-launchpad',
  repo: 'https://github.com/0xklen/crucible',
  install: `git clone https://github.com/0xklen/crucible\ncp -r crucible/skill ~/.hermes/skills/crucible-launchpad`,
}

// What you say to your agent, and the command the skill runs underneath.
export const USAGE = [
  {
    id: 'launch',
    title: 'Launch',
    say: 'Launch a token called Nova with ticker NOVA.',
    does: 'The skill deploys the bonding-curve token on Robinhood and hands back the contract address.',
    cmd: 'forge create contracts/src/CrucibleToken.sol:CrucibleToken --broadcast --rpc-url $ETH_RPC_URL --keystore ~/.crucible/wallet.json --constructor-args "Nova" "NOVA" 1000000000',
  },
  {
    id: 'buy',
    title: 'Buy',
    say: 'Buy 0.1 ETH of 0x… (paste the contract address).',
    does: 'The skill calls buy() on the bonding curve and reports the tokens received.',
    cmd: 'cast send <CA> "buy(address,uint256)" <buyer> <minTokens> --value 0.1ether --rpc-url $ETH_RPC_URL --keystore ~/.crucible/wallet.json',
  },
  {
    id: 'sell',
    title: 'Sell',
    say: 'Sell 1000 NOVA.',
    does: 'The skill calls sell() and reports the ETH returned.',
    cmd: 'cast send <CA> "sell(uint256)" <amount> --rpc-url $ETH_RPC_URL --keystore ~/.crucible/wallet.json',
  },
]

// Sample launches made through the skill. `ca` is the contract address the
// launching agent returned; a buyer pastes it to their own agent to buy.
// This is the offline fallback — the live feed (launches.json + /api/launches)
// is the source of truth.
export const LAUNCHES = [
  { id: 'orbit-ai', name: 'Orbit AI', symbol: 'ORBIT', color: '#f4b829', agent: 'Hermes',
    ca: '0x3EBb03F3B43728E492120B3D4C50e22109E46887',
    desc: 'Orbit AI token on Robinhood.',
    mcap: 4200, volume: 3100, holders: 1, progress: 0,
    supply: '1,000,000,000', created: '2026-10-28' },
  { id: 'nebula', name: 'Nebula', symbol: 'NEB', color: '#8c6cff', agent: 'Hermes',
    ca: '0xD542BAb3a157E02717d3A26755586751eDBD2535',
    desc: 'Nebula token on Robinhood.',
    mcap: 7600, volume: 5200, holders: 1, progress: 0,
    supply: '1,000,000,000', created: '2026-10-28' },
  { id: 'pulsar', name: 'Pulsar', symbol: 'PLS', color: '#e2483d', agent: 'Hermes',
    ca: '0xf7Ef6e34595617F5Ea78DC844FB360E7B6158691',
    desc: 'Pulsar token on Robinhood.',
    mcap: 3400, volume: 8900, holders: 1, progress: 0,
    supply: '1,000,000,000', created: '2026-10-28' },
  { id: 'comet', name: 'Comet', symbol: 'CMT', color: '#3d8cff', agent: 'Hermes',
    ca: '0x18490Af2888f4BEF09B5596C2d3A15291F2398D8',
    desc: 'Comet token on Robinhood.',
    mcap: 9800, volume: 6400, holders: 1, progress: 0,
    supply: '1,000,000,000', created: '2026-10-28' },
]

export const MACHINES = [
  { id: 'press', name: 'The Press', role: 'Mints the token',
    desc: 'A coin press stamps your supply into existence on the Robinhood network. The agent names it, the press strikes the full amount in one block.',
    file: '/machines/press.html' },
  { id: 'vendor', name: 'The Vending Machine', role: 'Sells along the curve', soon: true,
    desc: 'Buyers feed ETH and the machine vends tokens at the bonding-curve price. Every sale moves the curve toward graduation.',
    file: '/machines/vendor.html' },
  { id: 'vault', name: 'The Vault', role: 'Locks and graduates', soon: true,
    desc: 'When the curve completes, the raised liquidity is locked into the Vault and seeded into a Robinhood DEX pool. Trading continues there forever.',
    file: '/machines/vault.html' },
]
