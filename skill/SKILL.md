---
name: concave
description: Launch and buy bonding-curve tokens on the Robinhood network.
version: 0.1.0
author: Jay (0xklen), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [concave, bonding-curve, robinhood, token-launch, foundry, defi]
---

# Concave

CONCAVE is the launchpad for AI agents: tokens are minted and bought on a
linear bonding curve on the Robinhood network, driven entirely by an agent —
no human forms, no wallet UI. This skill runs the on-chain side of that flow
(deploy the token, buy and sell on the curve) using Foundry.

The token contract is `contracts/src/ConcaveToken.sol`: an ERC-20 whose price
is `price(n) = K * n`, where `K` is set at deploy. `buy()` mints along the
curve, `sell()` burns and refunds.

## When to Use

- The user asks an agent to launch a token on Robinhood, or buy/sell one.
- A prompt from the Concave site (paste the CA and an amount) needs executing.
- Do not use for: tokens with a different curve or a factory that is not
  `ConcaveToken`.

## Prerequisites

- Foundry: `forge` and `cast` on PATH (`~/.foundry/bin`).
- A funded account: export `PRIVATE_KEY` (and set `ETH_RPC_URL` or pass
  `--rpc-url`).
- Robinhood network facts: chain id `4663`, gas token `ETH`,
  RPC `https://rpc.mainnet.chain.robinhood.com`.

```bash
export ETH_RPC_URL=https://rpc.mainnet.chain.robinhood.com
export PRIVATE_KEY=0x...   # never print this
```

## Quick Reference

```bash
# Deploy a token (returns the CA — this is what buyers paste)
forge create contracts/src/ConcaveToken.sol:ConcaveToken \
  --constructor-args "Nova" "NOVA" 1000000000 --rpc-url "$ETH_RPC_URL" --private-key "$PRIVATE_KEY"

# Or via the script (env TOKEN_NAME / TOKEN_SYMBOL / CURVE_K)
forge script contracts/script/Deploy.s.sol:Deploy --rpc-url "$ETH_RPC_URL" --broadcast

# Buy on the curve (value in wei; minTokens is slippage protection)
cast send <CA> "buy(address,uint256)" <buyer> <minTokens> --value 0.1ether --rpc-url "$ETH_RPC_URL" --private-key "$PRIVATE_KEY"

# Sell on the curve
cast send <CA> "sell(uint256)" <tokenAmount> --rpc-url "$ETH_RPC_URL" --private-key "$PRIVATE_KEY"

# Read state
cast call <CA> "totalSupply()(uint256)" --rpc-url "$ETH_RPC_URL"
cast call <CA> "K()(uint256)" --rpc-url "$ETH_RPC_URL"
```

## Procedure

### Launch a token

1. Confirm the chain before spending gas: `cast chain-id` must return `4663`.
2. Choose `name`, `symbol`, and the curve slope `K` in wei (1 gwei is a sane
   default; a token priced near 1 ETH at 1M supply wants K ≈ 2e12).
3. Deploy with `forge create` (or the script). Capture the returned contract
   address — that is the CA.
4. Verify it landed: `cast code <CA>` must be non-`0x`, and
   `cast call <CA> "name()(string)"` must echo the name.

### Buy on the curve (from a pasted CA)

1. Validate the CA is a 40-hex `0x` address before any call.
2. Compute the minimum tokens for the ETH amount so slippage is bounded, or
   pass `0` to accept the curve fill.
3. `cast send <CA> "buy(address,uint256)" <buyer> <minTokens> --value <eth>`.
4. Read back `balanceOf(buyer)` and the `Buy` event to confirm the fill.

### Sell on the curve

1. Read `balanceOf(msg.sender)`; the amount to sell must not exceed it.
2. `cast send <CA> "sell(uint256)" <amount>`.
3. Confirm the ETH returned by reading the `Sell` event or the balance delta.

## Pitfalls

- The `buy` refund is sent back automatically (dust), so the account ends the
  call having paid exactly the curve cost, not the full `--value`.
- `sell` reverts with `balance` if the amount exceeds the sender's balance —
  read the balance first instead of letting the call revert.
- `ethForTokens`/`costForTokens` are views; calling `ethForTokens(m, s)` with
  `m > 2*s + 1` underflows and panics. Only call them with valid state.
- No anti-snipe or graduation logic lives in the token contract — that is
  launchpad-side, not here.

## Verification

Run the contract tests to prove the curve math before any mainnet spend:

```bash
cd contracts && forge test
```

All four tests must pass (buy mints and refunds dust, sell returns the exact
cost, slippage floor, balance guard).
