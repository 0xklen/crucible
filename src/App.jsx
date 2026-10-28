import React, { useEffect, useState } from 'react'
import { LAUNCHES, MACHINES, CHAIN, SKILL, USAGE } from './data.js'

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

function useLaunches() {
  const [launches, setLaunches] = useState(LAUNCHES)
  const [live, setLive] = useState(false)
  useEffect(() => {
    let stop = false
    const load = async () => {
      try {
        const r = await fetch('/api/launches', { cache: 'no-store' })
        if (!r.ok) throw new Error('offline')
        const data = await r.json()
        if (Array.isArray(data) && data.length && !stop) {
          setLaunches(data)
          setLive(true)
        }
      } catch (e) {
        /* no /api in local dev — keep the bundled sample data */
      }
    }
    load()
    const t = setInterval(load, 15000)
    return () => { stop = true; clearInterval(t) }
  }, [])
  return { launches, live }
}

function LiveBadge({ live }) {
  return live
    ? <span className="sample live">● live feed</span>
    : <span className="sample">sample data</span>
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

function CodeBlock({ text }) {
  return <div className="code-block">
    <pre>{text}</pre>
    <CopyButton text={text} />
  </div>
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

function Home({ nav, go, launches, live }) {
  const featured = launches.slice(0, 4)
  return <>
    <section className="hero">
      <div className="wrap hero-inner">
        <p className="eyebrow">Robinhood network — for AI agents</p>
        <h1 className="display">Your agent runs the launchpad.</h1>
        <p className="lede">Install the crucible-launchpad skill from the repo and your agent launches, buys and sells tokens on Robinhood. The skill makes a fresh wallet for you — no private keys, no forms, no wallet pop-ups.</p>
        <div className="hero-cta">
          <button className="btn" onClick={() => go('install')}>Install the skill</button>
          <button className="btn ghost" onClick={() => go('use')}>How to use it</button>
        </div>
      </div>
      <div className="wrap hero-fig">
        <Machine file={MACHINES[0].file} title="The Press" />
      </div>
    </section>

    <section className="strip wrap">
      <div className="stat"><b>1</b><span>skill to install</span></div>
      <div className="stat"><b>{launches.length}</b><span>tokens launched</span></div>
      <div className="stat"><b>{CHAIN.name}</b><span>network</span></div>
      <div className="stat"><b>{CHAIN.id}</b><span>chain id</span></div>
    </section>

    <section className="wrap block" id="install">
      <h2 className="h2">Install the skill</h2>
      <p className="sub">Clone the repo and drop the skill into your agent's skills directory. On first use the skill creates a fresh encrypted wallet for you — you never paste a private key.</p>
      <div className="install">
        <div className="install-meta">
          <span className="mono-label">Repo</span>
          <a className="link" href={SKILL.repo} target="_blank" rel="noopener">{SKILL.repo.replace('https://', '')}</a>
          <span className="mono-label">Skill</span>
          <b>{SKILL.name}</b>
        </div>
        <CodeBlock text={SKILL.install} />
        <p className="hint">Start a new agent session after installing — the skill loads on demand.</p>
      </div>
    </section>

    <section className="wrap block" id="use">
      <h2 className="h2">Launch, buy, sell</h2>
      <p className="sub">Say it in plain language. The skill runs the command underneath.</p>
      <div className="usage">
        {USAGE.map(u => (
          <div className="usage-card" key={u.id}>
            <h3>{u.title}</h3>
            <p className="say"><b>Say:</b> “{u.say}”</p>
            <p className="does">{u.does}</p>
            <CodeBlock text={u.cmd} />
          </div>
        ))}
      </div>
    </section>

    <section className="wrap block" id="launches">
      <div className="section-head">
        <h2 className="h2">Launched with the skill</h2>
        <LiveBadge live={live} />
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

function Launches({ nav, launches, live }) {
  return <section className="wrap page">
    <button className="link back" onClick={() => nav('#/')}>← Home</button>
    <h1 className="display">Launches</h1>
    <p className="lede">Every token here was launched through the crucible-launchpad skill on the Robinhood network. <LiveBadge live={live} /></p>
    <div className="grid">
      {launches.map(l => <LaunchCard key={l.id} l={l} nav={nav} />)}
    </div>
  </section>
}

function Token({ id, nav, launches }) {
  const l = launches.find(x => x.id === id)
  if (!l) return <section className="wrap page"><h1 className="display">Not found</h1><button className="link" onClick={() => nav('#/launches')}>← Back</button></section>
  const buyCmd = USAGE.find(u => u.id === 'buy').cmd.replace('<CA>', l.ca)
  const sellCmd = USAGE.find(u => u.id === 'sell').cmd.replace('<CA>', l.ca)
  return <section className="wrap page">
    <button className="link back" onClick={() => nav('#/launches')}>← All launches</button>
    <div className="coin-head">
      <span className="dot big" style={{ background: l.color }} />
      <div className="coin-title">
        <h1>{l.name} <small>{l.symbol}</small></h1>
        <p className="coin-desc">{l.desc}</p>
        <p className="sub">launched by {l.agent} · supply {l.supply} · on {CHAIN.name}</p>
      </div>
    </div>
    <div className="panel detail-panel">
      <CaRow ca={l.ca} />
      <div className="drow"><span>Total supply</span><b>{l.supply}</b></div>
      <div className="drow"><span>Market cap</span><b>{fmt(l.mcap)}</b></div>
      <div className="drow"><span>Holders</span><b>{l.holders.toLocaleString()}</b></div>
      <div className="drow"><span>Launched by</span><b>{l.agent}</b></div>
    </div>
    <div className="panel grad-panel">
      <h3>Buy or sell with the skill</h3>
      <p className="sub">Your agent runs these on Robinhood using the crucible-launchpad skill.</p>
      <CodeBlock text={buyCmd} />
      <CodeBlock text={sellCmd} />
    </div>
    <div className="panel grad-panel">
      <h3>Graduation → {CHAIN.dex}</h3>
      <div className="bar"><i style={{ width: l.progress + '%', background: l.color }} /></div>
      <div className="card-foot"><span>curve progress</span><b>{l.progress}%</b></div>
    </div>
    <p className="hint">Demo build — sample data, simulated launches.</p>
  </section>
}

export default function App() {
  const hash = useHash()
  const { launches, live } = useLaunches()
  const nav = h => { location.hash = h }
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  const onHome = parts[0] !== 'launches' && parts[0] !== 'token'
  const scrollTo = id => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
  const go = id => {
    if (!onHome) { location.hash = '#/'; setTimeout(() => scrollTo(id), 60) }
    else scrollTo(id)
  }

  let page
  if (parts[0] === 'launches') page = <Launches nav={nav} launches={launches} live={live} />
  else if (parts[0] === 'token') page = <Token key={parts[1]} id={parts[1]} nav={nav} launches={launches} />
  else page = <Home nav={nav} go={go} launches={launches} live={live} />

  return <div className="app">
    <header className="nav">
      <div className="wrap nav-inner">
        <button className="brand" onClick={() => nav('#/')}>
          <img src="/logo.svg" alt="" width="22" height="22" /> CRUCIBLE
        </button>
        <nav>
          {[['install', 'Install'], ['use', 'How to use'], ['launches', 'Launches'], ['machines', 'Machines']].map(([k, label]) =>
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
          <p className="fline">The launchpad for AI agents.<br />Install the skill, forge and trade on Robinhood.</p>
          <a className="link social" href="https://x.com/buildoncrucible" target="_blank" rel="noopener">@buildoncrucible on X ↗</a>
        </div>
        <div className="foot-col">
          <h4>Launchpad</h4>
          {[['Install', 'install'], ['How to use', 'use'], ['Launches', 'launches'], ['Machines', 'machines']].map(([label, id]) =>
            <button key={id} onClick={() => go(id)}>{label}</button>)}
        </div>
        <div className="foot-col">
          <h4>Network</h4>
          <span>{CHAIN.name}</span>
          <span>chain id {CHAIN.id}</span>
          <span>gas {CHAIN.gas}</span>
        </div>
        <div className="foot-col">
          <h4>Skill</h4>
          <span>{SKILL.name}</span>
          <a className="link" href={SKILL.repo} target="_blank" rel="noopener">github.com/0xklen/crucible</a>
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
