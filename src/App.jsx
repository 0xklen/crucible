import React, { useEffect, useState } from 'react'
import { LAUNCHES, MACHINES, CHAIN, AGENTS, LAUNCH_PROMPT, BUY_PROMPT } from './data.js'

const fmt = n => {
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B'
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M'
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K'
  return '$' + n
}

const shortCa = a => (a ? a.slice(0, 6) + '…' + a.slice(-4) : '')

function useHash() {
  const [h, setH] = useState(location.hash || '#/')
  useEffect(() => {
    const f = () => setH(location.hash || '#/')
    addEventListener('hashchange', f)
    return () => removeEventListener('hashchange', f)
  }, [])
  return h
}

function Machine({ file, title }) {
  if (!file) {
    return <div className="mach placeholder">
      <div className="mach-mark">✦</div>
      <p className="mach-cap">Figure coming soon.</p>
    </div>
  }
  return <div className="mach">
    <iframe src={file} title={title} loading="lazy" />
  </div>
}

function Spark({ color }) {
  const d = 'M2,52 L12,44 L20,48 L28,40 L36,42 L44,34 L52,36 L60,28 L68,30 L76,22 L84,24 L92,16 L100,18'
  return <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="spark">
    <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (e) {
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      try { document.execCommand('copy') } catch (e2) {}
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }
  return <button className={'copy' + (copied ? ' on' : '')} onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
}

function CaRow({ ca }) {
  return <div className="ca-row">
    <span className="ca-label">CA</span>
    <code className="ca">{ca}</code>
    <CopyButton text={ca} />
  </div>
}

function LaunchCard({ l, nav }) {
  return <button className="card" onClick={() => nav('#/token/' + l.id)}>
    <div className="card-top">
      <span className="dot" style={{ background: l.color }} />
      <div className="card-name"><b>{l.name}</b><span>{l.symbol} — by {l.agent}</span></div>
      <span className="pin">RHO</span>
    </div>
    <Spark color={l.color} />
    <div className="card-meta">
      <span>MC {fmt(l.mcap)}</span>
      <span>{l.holders.toLocaleString()} holders</span>
    </div>
    <div className="bar"><i style={{ width: l.progress + '%', background: l.color }} /></div>
    <div className="card-foot"><span>bonding curve</span><b>{l.progress}%</b></div>
    <div className="card-ca">CA {shortCa(l.ca)}</div>
  </button>
}

function BuyPanel({ ca, setCa, amount, setAmount }) {
  const prompt = BUY_PROMPT(ca, amount)
  return <div className="prompt-hero">
    <label className="ca-field">Contract address — paste any token's CA
      <input value={ca} onChange={e => setCa(e.target.value)} placeholder="0x…" spellCheck={false} autoComplete="off" />
    </label>
    <label className="amt">Amount in ETH
      <input value={amount} onChange={e => setAmount(e.target.value)} inputMode="decimal" placeholder="0.1" />
    </label>
    <p className="prompt-text">{prompt}</p>
    <div className="prompt-actions"><CopyButton text={prompt} /></div>
  </div>
}

function Home({ nav, go }) {
  const featured = LAUNCHES.slice(0, 4)
  const [name, setName] = useState('')
  const [ticker, setTicker] = useState('')
  const [buyId, setBuyId] = useState(LAUNCHES[0].id)
  const [ca, setCa] = useState(LAUNCHES[0].ca)
  const [amount, setAmount] = useState('0.1')
  const launchPrompt = LAUNCH_PROMPT(name, ticker)

  return <>
    <section className="hero">
      <div className="wrap hero-inner">
        <p className="eyebrow">Robinhood network — for AI agents</p>
        <h1 className="display">Forge and trade tokens with your agent.</h1>
        <p className="lede">CRUCIBLE is the launchpad for AI agents. Tell Hermes, Claude or Codex what to launch, or paste a contract address and tell your agent to buy on the bonding curve — no forms, no wallets, no clicks.</p>
        <div className="hero-cta">
          <button className="btn" onClick={() => go('launch')}>Launch a token</button>
          <button className="btn ghost" onClick={() => go('buy')}>Buy on the curve</button>
        </div>
      </div>
      <div className="wrap hero-fig">
        <Machine file={MACHINES[0].file} title="The Press" />
      </div>
    </section>

    <section className="strip wrap">
      <div className="stat"><b>{AGENTS.length}</b><span>agents supported</span></div>
      <div className="stat"><b>{LAUNCHES.length}</b><span>tokens forged</span></div>
      <div className="stat"><b>{CHAIN.name}</b><span>network</span></div>
      <div className="stat"><b>{CHAIN.id}</b><span>chain id</span></div>
    </section>

    <section className="wrap block" id="how">
      <h2 className="h2">Two things your agent can do</h2>
      <p className="sub">Launch a token, or buy one. Both are one prompt pasted into your agent.</p>
      <div className="flows">
        <div className="flow-card">
          <span className="flow-tag">Launch</span>
          <h3>Mint a token</h3>
          <ol>
            <li>Tell your agent the name, ticker and supply.</li>
            <li>It deploys the token on Robinhood.</li>
            <li>It hands you back the contract address.</li>
          </ol>
          <button className="btn ghost" onClick={() => go('launch')}>Build the prompt</button>
        </div>
        <div className="flow-card">
          <span className="flow-tag">Buy</span>
          <h3>Buy on the curve</h3>
          <ol>
            <li>Paste the contract address to your agent.</li>
            <li>Tell it how much ETH to buy.</li>
            <li>It buys on the bonding curve and reports the fill.</li>
          </ol>
          <button className="btn ghost" onClick={() => go('buy')}>Build the prompt</button>
        </div>
      </div>
    </section>

    <section className="wrap block" id="launch">
      <h2 className="h2">Launch a token</h2>
      <p className="sub">Fill the blanks, copy, paste into your agent. That is the whole launch flow.</p>
      <div className="builder">
        <div className="builder-fields">
          <label>Name<input value={name} onChange={e => setName(e.target.value)} placeholder="Nova" /></label>
          <label>Ticker<input value={ticker} onChange={e => setTicker(e.target.value)} placeholder="NOVA" maxLength={8} /></label>
        </div>
        <div className="prompt-hero">
          <p className="prompt-text">{launchPrompt}</p>
          <div className="prompt-actions"><CopyButton text={launchPrompt} /></div>
        </div>
      </div>
      <div className="agents">
        {AGENTS.map(a => (
          <div className="agent-card" key={a.id}>
            <h3>{a.name}</h3>
            <p className="by">by {a.by}</p>
            <p className="agent-line">Open {a.name}, paste the prompt, fill the blanks, send.</p>
          </div>
        ))}
      </div>
    </section>

    <section className="wrap block" id="buy">
      <h2 className="h2">Buy with your agent</h2>
      <p className="sub">Pick a token, copy its contract address, and paste the buy prompt into your agent. Buying only ever happens through an agent.</p>
      <div className="buy-picker">
        {featured.map(l => (
          <button key={l.id} className={'chip' + (buyId === l.id ? ' on' : '')} onClick={() => { setBuyId(l.id); setCa(l.ca) }}>
            <span className="chip-dot" style={{ background: l.color }} />{l.symbol}
          </button>
        ))}
      </div>
      <BuyPanel ca={ca} setCa={setCa} amount={amount} setAmount={setAmount} />
    </section>

    <section className="wrap block" id="launches">
      <div className="section-head">
        <h2 className="h2">On the curve</h2>
        <span className="sample">sample data</span>
      </div>
      <div className="grid">
        {featured.map(l => <LaunchCard key={l.id} l={l} nav={nav} />)}
      </div>
      <div className="center"><button className="btn ghost" onClick={() => nav('#/launches')}>View all launches</button></div>
    </section>

    <section className="wrap block" id="machines">
      <h2 className="h2">The machines</h2>
      <p className="sub">Three industrial machines run the launchpad for the agents.</p>
      <div className="machines">
        {MACHINES.map(m => (
          <div className="mach-card" key={m.id}>
            <Machine file={m.file} title={m.name} />
            <h3>{m.name}</h3>
            <p className="role">{m.role}{m.soon ? <span className="soon">Coming soon!</span> : null}</p>
            <p className="desc">{m.desc}</p>
          </div>
        ))}
      </div>
    </section>
  </>
}

function Launches({ nav }) {
  return <section className="wrap page">
    <button className="link back" onClick={() => nav('#/')}>← Home</button>
    <h1 className="display">Launches</h1>
    <p className="lede">Every token here was forged by an agent on the Robinhood network. Figures are sample data for the demo.</p>
    <div className="grid">
      {LAUNCHES.map(l => <LaunchCard key={l.id} l={l} nav={nav} />)}
    </div>
  </section>
}

function Token({ id, nav }) {
  const l = LAUNCHES.find(x => x.id === id)
  const [amount, setAmount] = useState('0.1')
  const [ca, setCa] = useState(l ? l.ca : '')
  if (!l) return <section className="wrap page"><h1 className="display">Not found</h1><button className="link" onClick={() => nav('#/launches')}>← Back</button></section>
  return <section className="wrap page">
    <button className="link back" onClick={() => nav('#/launches')}>← All launches</button>
    <div className="coin-head">
      <span className="dot big" style={{ background: l.color }} />
      <div className="coin-title">
        <h1>{l.name} <small>{l.symbol}</small></h1>
        <p className="coin-desc">{l.desc}</p>
        <p className="sub">forged by {l.agent} · supply {l.supply} · on {CHAIN.name}</p>
      </div>
    </div>
    <div className="panel buy-panel">
      <h3>Buy with your agent</h3>
      <BuyPanel ca={ca} setCa={setCa} amount={amount} setAmount={setAmount} />
    </div>
    <div className="panel detail-panel">
      <CaRow ca={l.ca} />
      <div className="drow"><span>Total supply</span><b>{l.supply}</b></div>
      <div className="drow"><span>Market cap</span><b>{fmt(l.mcap)}</b></div>
      <div className="drow"><span>Holders</span><b>{l.holders.toLocaleString()}</b></div>
      <div className="drow"><span>Forged by</span><b>{l.agent}</b></div>
    </div>
    <div className="panel grad-panel">
      <h3>Graduation → {CHAIN.dex}</h3>
      <p className="sub">When the curve completes, liquidity locks and seeds a Robinhood DEX pool.</p>
      <div className="bar"><i style={{ width: l.progress + '%', background: l.color }} /></div>
      <div className="card-foot"><span>curve progress</span><b>{l.progress}%</b></div>
    </div>
    <p className="hint">Demo build — sample data, simulated launches.</p>
  </section>
}

export default function App() {
  const hash = useHash()
  const nav = h => { location.hash = h }
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  const onHome = parts[0] !== 'launches' && parts[0] !== 'token'
  const scrollTo = id => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
  const go = id => {
    if (!onHome) { location.hash = '#/'; setTimeout(() => scrollTo(id), 60) }
    else scrollTo(id)
  }

  let page
  if (parts[0] === 'launches') page = <Launches nav={nav} />
  else if (parts[0] === 'token') page = <Token key={parts[1]} id={parts[1]} nav={nav} />
  else page = <Home nav={nav} go={go} />

  return <div className="app">
    <header className="nav">
      <div className="wrap nav-inner">
        <button className="brand" onClick={() => nav('#/')}>
          <img src="/logo.svg" alt="" width="22" height="22" /> CRUCIBLE
        </button>
        <nav>
          {[['launch', 'Launch'], ['buy', 'Buy'], ['launches', 'Launches'], ['machines', 'Machines']].map(([k, label]) =>
            <button key={k} onClick={() => go(k)}>{label}</button>)}
        </nav>
        <span className="chain-chip">{CHAIN.name} {CHAIN.id}</span>
      </div>
    </header>
    <main>{page}</main>
    <footer className="foot">
      <div className="wrap foot-inner">
        <div className="foot-brand">
          <p className="fbrand"><img src="/logo.svg" alt="" /> CRUCIBLE</p>
          <p className="fline">The launchpad for AI agents.<br />Forge and trade on the Robinhood network.</p>
        </div>
        <div className="foot-col">
          <h4>Launchpad</h4>
          {[['Launch', 'launch'], ['Buy', 'buy'], ['Launches', 'launches'], ['Machines', 'machines']].map(([label, id]) =>
            <button key={id} onClick={() => go(id)}>{label}</button>)}
        </div>
        <div className="foot-col">
          <h4>Network</h4>
          <span>{CHAIN.name}</span>
          <span>chain id {CHAIN.id}</span>
          <span>gas {CHAIN.gas}</span>
        </div>
        <div className="foot-col">
          <h4>Agents</h4>
          <span>{AGENTS.map(a => a.name).join(', ')}</span>
        </div>
      </div>
      <div className="foot-bar">
        <div className="wrap foot-bar-inner">
          <span>CRUCIBLE © 2026</span>
          <span>demo build — sample data, simulated launches</span>
        </div>
      </div>
    </footer>
  </div>
}
