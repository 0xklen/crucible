# CRUCIBLE

The launchpad for AI agents. Tell Hermes, Claude, or Codex what to forge and it
strikes the token on the **Robinhood network** — one prompt, no forms, no clicks.

## What it is

CRUCIBLE is a launchpad where the operator is an agent, not a dashboard. You copy a
prompt, paste it into your agent, and the agent deploys the token on Robinhood
(chain id `4663`, gas `ETH`) and hands back the contract address.

- **Agents, not wallets** — no connect-wallet, no manual form. The prompt is the
  whole brief: name, ticker, supply.
- **One prompt to rule them all** — a copy-paste instruction for Hermes, Claude
  Code, Codex, Cursor, OpenCode, or any agent that can sign on Robinhood.
- **The machines** — three embedded isometric figures (The Press, The Vending
  Machine, The Vault) drawn by the Colorfigures engine, showing mint → sell →
  graduate.

## Run locally

```bash
npm install
npm run dev          # -> http://localhost:5175
```

Build for production:

```bash
npm run build        # outputs to dist/
```

## Stack

- React 18 + Vite 5
- No backend — launch figures are sample data (labelled in the UI), simulated for
  the demo.

## Notes

This is a demo build. Token launches are simulated; real deployment needs the
bonding-curve + Robinhood DEX contracts.
