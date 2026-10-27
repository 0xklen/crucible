<div align="center">

# CRUCIBLE

**The launchpad for AI agents.**

Install the `crucible-launchpad` skill and your agent launches, buys and sells tokens on Robinhood.

[![React](https://img.shields.io/badge/React-18-149eca?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Foundry](https://img.shields.io/badge/Foundry-tested-f4b829?style=flat-square&logo=ethereum&logoColor=white)](contracts)
[![Robinhood](https://img.shields.io/badge/network-Robinhood%204663-f4b829?style=flat-square)](https://robinhood.com)
[![License](https://img.shields.io/badge/license-MIT-231e16?style=flat-square)](LICENSE)

</div>

![CRUCIBLE hero](docs/screenshot.png)

---

## What this is

CRUCIBLE is a launchpad where the operator is an agent, not a dashboard. You
install one skill and your agent does the rest — no forms, no wallet pop-ups,
no copy-paste prompts, and **no pasted private key**: the skill creates a
fresh encrypted wallet for you and signs with it.

- **Launch** — say "launch a token called Nova (NOVA)". The skill deploys a
  bonding-curve token on Robinhood and hands back the contract address.
- **Buy** — paste the contract address, say how much ETH. The skill buys on the
  curve.
- **Sell** — say "sell 1000 NOVA". The skill sells and returns the ETH.

## Install the skill

```bash
git clone https://github.com/0xklen/crucible
cp -r crucible/skill ~/.hermes/skills/crucible-launchpad
```

Start a new agent session after installing — the skill loads on demand.

The skill (`skill/SKILL.md`) holds every instruction and all the data the agent
needs: the Robinhood network config, the deploy/buy/sell `forge` and `cast`
commands, and the pitfalls. It drives a real, tested bonding curve:

- `contracts/src/CrucibleToken.sol` — ERC-20 with `price(n) = K * n`;
  `buy()` mints along the curve, `sell()` burns and refunds.
- `contracts/test/CrucibleToken.t.sol` — 4 tests proving the curve math.
- `contracts/script/Deploy.s.sol` — deploy helper.

```bash
cd contracts
forge install          # fetch forge-std (already vendored)
forge test             # prove the curve math — 4 tests pass
```

## Features

- **Importable skill** — `skill/SKILL.md` (crucible-launchpad) plus a tested
  Foundry contract. This is the product; the site is the instruction hub.
- **Fresh wallet, no key pasting** — the skill runs `cast wallet new` on first
  use, stores an encrypted keystore, and signs with `--keystore`. You set the
  password; the agent never sees the private key.
- **Install + usage on the site** — how to install the skill, and what to say
  to launch, buy and sell, with the underlying commands shown.
- **Launches** — every token launched through the skill is listed with its
  contract address and one-click copy.
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
crucible/
├── src/               React app (Vite) — the instruction hub
├── public/            logo, machine figures
├── contracts/         Foundry: bonding-curve token + tests + deploy script
├── skill/             SKILL.md — crucible-launchpad, the agent tooling
├── scripts/           gen_logo.py (reproduces the mark)
└── docs/              screenshot
```

## Notes

Site launch figures are sample data (labelled in the UI). The `CrucibleToken`
contract is real and tested; deploying it on Robinhood spends real ETH for gas.
