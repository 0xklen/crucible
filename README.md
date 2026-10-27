<div align="center">

# CONCAVE

**The launchpad for AI agents.**

Forge tokens and buy on the bonding curve by telling your agent — one prompt, no forms, no wallets.

[![React](https://img.shields.io/badge/React-18-149eca?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Foundry](https://img.shields.io/badge/Foundry-tested-f4b829?style=flat-square&logo=ethereum&logoColor=white)](contracts)
[![Robinhood](https://img.shields.io/badge/network-Robinhood%204663-f4b829?style=flat-square)](https://robinhood.com)
[![License](https://img.shields.io/badge/license-MIT-231e16?style=flat-square)](LICENSE)

</div>

![CONCAVE hero](docs/screenshot.png)

---

## What this is

CONCAVE is a launchpad where the operator is an agent, not a dashboard.
Minting a token **and** buying on the bonding curve both happen by telling
your agent what to do.

- **Launch** — tell your agent the name, ticker and supply. It deploys a
  bonding-curve token on the Robinhood network and hands back the contract
  address.
- **Buy** — paste any contract address (CA) to your agent and tell it how much
  ETH to buy. It buys on the bonding curve and reports the fill.

No connect-wallet, no manual order form, no clicks. The prompt is the whole UI.

## For agents — import this repo

The repo ships real tooling, not just a prompt. Agents install the skill and
drive the contract directly.

```bash
# Hermes (or any SKILL.md-based agent): install the skill
cp -r skill ~/.hermes/skills/concave
```

The skill (`skill/SKILL.md`) teaches the agent the exact `forge`/`cast`
commands to deploy, buy and sell. The contract is a real, tested bonding
curve:

- `contracts/src/ConcaveToken.sol` — ERC-20 with `price(n) = K * n`;
  `buy()` mints along the curve, `sell()` burns and refunds.
- `contracts/test/ConcaveToken.t.sol` — 4 tests proving the curve math.
- `contracts/script/Deploy.s.sol` — deploy helper.

```bash
cd contracts
forge install          # fetch forge-std (already vendored)
forge test             # prove the curve math — 4 tests pass
```

### Launch

```
Launch a token on CONCAVE: name Nova, ticker NOVA, 1,000,000,000 fixed
supply, anti-snipe tax on at open. Deploy it on the Robinhood network and
report the contract address.
```

### Buy on the curve (paste any CA)

```
Buy 0.1 ETH of the token at <CONTRACT_ADDRESS> on the CONCAVE bonding curve
on the Robinhood network. Report the tokens received and the price paid.
```

## Features

- **Free-form CA input** — the buy flow accepts any contract address you paste,
  not just the sample tokens.
- **Prompt builders** — type a name/ticker (launch) or a CA + amount (buy),
  get a ready-to-paste prompt with one-click copy.
- **Agent roster** — Hermes, Claude Code, Codex, Cursor, OpenCode, or any agent.
- **Importable skill** — `skill/SKILL.md` plus a tested Foundry contract.
- **The machines** — three embedded isometric figures (The Press, The Vending
  Machine, The Vault) drawn by the Colorfigures engine: mint → sell → graduate.
- **Paper/ink theme** — plain warm-paper background in the machines' own palette.

## Network

| | |
|---|---|
| Chain | Robinhood |
| Chain id | `4663` |
| Gas | `ETH` |
| RPC | `https://rpc.mainnet.chain.robinhood.com` |
| Graduation | Robinhood DEX |

## Run the site

```bash
npm install
npm run dev          # -> http://localhost:5175
npm run build        # production build -> dist/
```

## Repo layout

```
concave/
├── src/               React app (Vite)
├── public/            logo, machine figures
├── contracts/         Foundry: bonding-curve token + tests + deploy script
├── skill/             SKILL.md — the agent-importable tooling
├── scripts/           gen_logo.py (reproduces the mark)
└── docs/              screenshot
```

## Notes

Site launch figures are sample data (labelled in the UI). The `ConcaveToken`
contract is real and tested; deploying it on Robinhood spends real ETH for gas.
