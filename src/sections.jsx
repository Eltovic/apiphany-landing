/* global React, Brand, Wordmark, ApithanyGlyph, Icon */

const { useState, useEffect } = React;

/* ============================================
   NAV
   ============================================ */
function Nav({ onCta }){
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { href: "#how",       label: "How it works" },
    { href: "#features",  label: "Agents" },
    { href: "#live-site", label: "Results" },
    { href: "#pricing",   label: "Pricing" },
    { href: "#faq",       label: "FAQ" },
  ];
  function close(){ setMenuOpen(false); }
  return (
    <div className="nav-root" data-screen-label="00 Nav">
      <div className="wrap nav">
        <Brand />
        <nav className="nav-links">
          {links.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}
        </nav>
        <div className="nav-cta">
          <a className="btn btn-ghost" href="https://app.apithany.com/login">Sign in</a>
          <button className="btn btn-primary" onClick={onCta}>
            Get started <Icon.arrow width="16" height="16" />
          </button>
        </div>
        {/* mobile hamburger */}
        <button
          className="nav-hamburger"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen(v => !v)}
        >
          <span className={`ham-line ${menuOpen ? "open" : ""}`} />
          <span className={`ham-line ${menuOpen ? "open" : ""}`} />
          <span className={`ham-line ${menuOpen ? "open" : ""}`} />
        </button>
      </div>

      {menuOpen && (
        <>
          <div className="nav-drawer-backdrop" onClick={close} />
          <div className="nav-drawer">
            {links.map(l => (
              <a key={l.href} href={l.href} className="drawer-link" onClick={close}>{l.label}</a>
            ))}
            <div className="drawer-actions">
              <a className="btn btn-ghost" href="https://app.apithany.com/login" onClick={close}>Sign in</a>
              <button className="btn btn-primary" onClick={() => { close(); onCta && onCta(); }}>
                Get started <Icon.arrow width="16" height="16" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ============================================
   HERO
   ============================================ */
function Hero({ headline, sub, onSubmit }){
  const [email, setEmail] = useState("");
  const [sent, setSent]   = useState(false);

  async function handleHeroSubmit(e){
    e.preventDefault();
    try {
      await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "hero" }),
      });
    } catch (_) { /* silent — don't block UX */ }
    setSent(true);
    onSubmit && onSubmit(email);
  }

  return (
    <section className="hero" data-screen-label="01 Hero" id="top">
      <div className="wrap hero-grid">
        <div>
          <span className="eyebrow">The ATH engine · v3</span>
          <h1>
            {headline.before}
            <span className="ath-spark">{headline.spark}</span>
            {headline.middle}
            <br />
            <span className="serif">{headline.serif}</span>
          </h1>
          <p className="lede">{sub}</p>

          {sent ? (
            <div className="hero-sent">
              <span>✦</span> Check your inbox — we'll be in touch.
            </div>
          ) : (
            <form className="hero-form" onSubmit={handleHeroSubmit}>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                Get started <Icon.arrow width="16" height="16" />
              </button>
            </form>
          )}
          <div className="hero-microcopy">
            <span><span className="dot" /> Plans from $49 / mo</span>
            <span>· Setup in minutes</span>
            <span>· Cancel anytime</span>
          </div>
        </div>

        <HeroStage />
      </div>
    </section>
  );
}

/* the playful right-side stage */
function HeroStage(){
  return (
    <div className="hero-stage">
      <div className="hero-orb" />
      <div className="hero-honey-glow" />

      {/* big central glyph */}
      <div style={{ position: "relative", width: "55%", aspectRatio: "1/1", display: "grid", placeItems: "center" }}>
        <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
          <defs>
            <radialGradient id="hex-glow" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="var(--honey)" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="var(--honey)" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="90" fill="url(#hex-glow)"/>
          {/* big hex */}
          <path d="M100 20 165 60 165 140 100 180 35 140 35 60z"
            fill="var(--ink-2)" stroke="var(--honey)" strokeWidth="1.5"/>
          {/* gem */}
          <path d="M100 55 140 85 100 150 60 85z" fill="var(--honey)"/>
          <path d="M100 55 140 85 100 100 60 85z" fill="var(--honey-2)" opacity="0.6"/>
          {/* sparks */}
          <g stroke="var(--honey)" strokeWidth="2" strokeLinecap="round">
            <path d="M100 32v8M100 162v8M22 100h8M170 100h8" />
          </g>
          <g fill="var(--paper)">
            <circle cx="80" cy="74" r="2" />
            <circle cx="118" cy="88" r="1.5" />
            <circle cx="90" cy="120" r="1.5" />
          </g>
        </svg>
      </div>

      {/* floating cards */}
      <div className="float-card" style={{ top: "8%", left: "-4%", animationDelay: "0s" }}>
        <span className="badge"><Icon.search width="14" height="14" /></span>
        <div>
          <div style={{ fontWeight: 600 }}>Niche found</div>
          <div style={{ fontSize: 11, color: "var(--muted-cream)" }}>cold-brew gear · score 87</div>
        </div>
      </div>

      <div className="float-card dark honey" style={{ top: "42%", right: "-8%", animationDelay: "1.5s" }}>
        <span className="badge"><Icon.bolt width="14" height="14" /></span>
        <div>
          <div style={{ fontWeight: 600 }}>Article published</div>
          <div style={{ fontSize: 11, color: "var(--moss-2)" }}>2,400 words · 6 affiliate links</div>
        </div>
      </div>

      <div className="float-card" style={{ bottom: "24%", left: "4%", animationDelay: "3s" }}>
        <span className="badge"><Icon.chart width="14" height="14" /></span>
        <div>
          <div style={{ fontWeight: 600 }}>+$148 today</div>
          <div style={{ fontSize: 11, color: "var(--muted-cream)" }}>Amazon · 12 conversions</div>
        </div>
      </div>

      <div className="float-card" style={{ bottom: "4%", right: "0%", animationDelay: "4.5s" }}>
        <span className="badge"><Icon.link width="14" height="14" /></span>
        <div>
          <div style={{ fontWeight: 600 }}>DR +4 this week</div>
          <div style={{ fontSize: 11, color: "var(--muted-cream)" }}>8 pitches · 3 links won</div>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   MARQUEE
   ============================================ */
function Marquee(){
  const items = ["Amazon Associates", "Impact", "ShareASale", "CJ Affiliate", "Awin", "Rakuten", "ClickBank", "PartnerStack"];
  return (
    <section className="marquee">
      <div className="wrap" style={{ marginBottom: 12 }}>
        <div className="marquee-label">Connected to the networks that matter</div>
      </div>
      <div className="marquee-track">
        {[...items, ...items, ...items].map((it, i) => (
          <span className="marquee-item" key={i}>
            {it}<span className="glyph-tiny" />
          </span>
        ))}
      </div>
    </section>
  );
}

/* ============================================
   HOW IT WORKS — 4 agent steps
   ============================================ */
function HowItWorks(){
  const steps = [
    { n: "01", title: "Discover", icon: <Icon.search width="20" height="20" />, body: "Scout agent scores 10,000+ niches across 10 dimensions — search volume, competition, payout, intent, and affiliate availability." },
    { n: "02", title: "Brief", icon: <Icon.hex width="20" height="20" />, body: "Strategy agent picks winning keywords and writes briefs with structure, target intent, link slots, and GEO priority scoring." },
    { n: "03", title: "Write & Score", icon: <Icon.pencil width="20" height="20" />, body: "Author agent drafts GEO-tuned articles scored for AI citation readiness. Editor validates facts, inserts affiliate links, and runs AEO quality checks." },
    { n: "04", title: "Publish & Pin", icon: <Icon.bolt width="20" height="20" />, body: "Publisher ships to WordPress with full schema markup, AIOSEO meta, and featured image — then auto-pins to Pinterest and posts to LinkedIn." },
  ];
  return (
    <section className="section-dark" id="how" data-screen-label="02 How it works">
      <div className="wrap">
        <span className="eyebrow">How Apithany works</span>
        <h2>Five agents.<br />One <span className="serif">epiphany</span> per niche.</h2>
        <div className="steps">
          {steps.map((s) => (
            <div className="step" key={s.n}>
              <div className="step-no">{s.n}</div>
              <h3 style={{ marginTop: 16 }}>{s.title}</h3>
              <p>{s.body}</p>
              <div className="step-icon" style={{ marginTop: "auto" }}>{s.icon}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   DASHBOARD PREVIEW (faux product screenshot)
   ============================================ */
function DashboardPreview(){
  return (
    <section className="preview-section" data-screen-label="03 Dashboard">
      <div className="wrap">
        <span className="eyebrow">The ATH engine, live</span>
        <h2 style={{ fontSize: "clamp(36px, 4.5vw, 60px)", letterSpacing: "-0.03em", color: "var(--paper)", marginTop: 18, maxWidth: 720 }}>
          Watch your agents work, <span className="serif" style={{ color: "var(--honey)" }}>in real time.</span>
        </h2>

        <div className="preview-frame">
          <div className="preview-bar">
            <span className="dot" style={{ background: "#E08A7F" }} />
            <span className="dot" style={{ background: "#E8B84A" }} />
            <span className="dot" style={{ background: "#7FB66E" }} />
            <span className="url">app.apithany.com / dashboard</span>
          </div>
          <FakeDashboard />
        </div>
      </div>
    </section>
  );
}

function FakeDashboard(){
  return (
    <div className="preview-body preview-layout" style={{ display: "grid", gap: 28, padding: 28 }}>
      {/* sidebar */}
      <div className="preview-sidebar">
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: ".12em", color: "var(--muted-cream)", textTransform: "uppercase", marginBottom: 14 }}>Workspace</div>
        {["Niches", "Articles", "Affiliate links", "Revenue", "Agents", "Settings"].map((it, i) => (
          <div key={it} style={{
            padding: "8px 12px",
            borderRadius: 10,
            marginBottom: 4,
            background: i === 3 ? "var(--cream)" : "transparent",
            color: "var(--ink-text)",
            fontSize: 14,
            fontWeight: i === 3 ? 600 : 400
          }}>
            {it}
            {i === 1 && <span style={{ float: "right", fontSize: 11, background: "var(--accent)", color: "white", padding: "1px 6px", borderRadius: 999 }}>12</span>}
          </div>
        ))}
      </div>
      {/* main */}
      <div>
        {/* row stats */}
        <div className="preview-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 }}>
          {[
            { lbl: "Revenue (30d)", val: "$4,820", trend: "+38%" },
            { lbl: "Articles live", val: "147", trend: "+12 this wk" },
            { lbl: "Clicks", val: "9,431", trend: "+22%" },
            { lbl: "Conv. rate", val: "4.8%", trend: "+0.6pt" },
          ].map((s, i) => (
            <div key={i} style={{ background: "var(--cream)", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 11, color: "var(--muted-cream)", fontFamily: "JetBrains Mono", letterSpacing: ".08em", textTransform: "uppercase" }}>{s.lbl}</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: "var(--ink)", marginTop: 6, letterSpacing: "-0.02em" }}>{s.val}</div>
              <div style={{ fontSize: 11, color: "var(--accent-deep)", marginTop: 4 }}>{s.trend}</div>
            </div>
          ))}
        </div>

        {/* chart */}
        <div style={{ background: "var(--cream)", borderRadius: 12, padding: 18, marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>Revenue · last 30 days</div>
            <div style={{ display: "flex", gap: 6 }}>
              {["7d", "30d", "90d"].map((p, i) => (
                <span key={p} style={{
                  fontSize: 11, padding: "4px 8px", borderRadius: 6,
                  background: i === 1 ? "var(--ink)" : "transparent",
                  color: i === 1 ? "var(--paper)" : "var(--muted-cream)",
                  fontFamily: "JetBrains Mono"
                }}>{p}</span>
              ))}
            </div>
          </div>
          <svg viewBox="0 0 600 120" style={{ width: "100%", height: 120 }}>
            <defs>
              <linearGradient id="ch" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35"/>
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d="M0 90 L40 82 L80 86 L120 70 L160 74 L200 60 L240 55 L280 62 L320 48 L360 52 L400 38 L440 42 L480 28 L520 32 L560 18 L600 22 L600 120 L0 120 Z"
              fill="url(#ch)" />
            <path d="M0 90 L40 82 L80 86 L120 70 L160 74 L200 60 L240 55 L280 62 L320 48 L360 52 L400 38 L440 42 L480 28 L520 32 L560 18 L600 22"
              fill="none" stroke="var(--accent-deep)" strokeWidth="2" />
          </svg>
        </div>

        {/* agent log */}
        <div style={{ background: "var(--ink)", color: "var(--paper)", borderRadius: 12, padding: 18, fontFamily: "JetBrains Mono", fontSize: 12.5, lineHeight: 1.7 }}>
          <div style={{ color: "var(--moss-2)", marginBottom: 8 }}>// Agent log · live</div>
          <div><span style={{ color: "var(--honey)" }}>scout</span>     ▸ niche <span style={{ color: "var(--paper)" }}>"gaming headsets"</span> — score 93 · 6 networks</div>
          <div><span style={{ color: "var(--honey)" }}>strategist</span> ▸ 8 keyword briefs → AEO priority queue</div>
          <div><span style={{ color: "var(--honey)" }}>author</span>    ▸ drafted <span style={{ color: "var(--paper)" }}>"Best Gaming Headsets 2026"</span> · 2,840 words</div>
          <div><span style={{ color: "var(--honey)" }}>editor</span>    ▸ AEO 88/100 · GEO pass · 6 affiliate links</div>
          <div><span style={{ color: "var(--accent)" }}>publisher</span> ▸ <span style={{ color: "var(--paper)" }}>live · schema + Pinterest pin</span> ✓</div>
          <div><span style={{ color: "var(--moss-2)" }}>link-agent</span>▸ 3 broken links found · 2 directory pitches queued</div>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   FEATURES grid (bento-ish)
   ============================================ */
function Features(){
  return (
    <section className="features-section" id="features" data-screen-label="04 Features">
      <div className="wrap">
        <div className="features-head">
          <div>
            <span className="eyebrow">The agent stack</span>
            <h2>Built like a <span className="serif">newsroom</span> that never sleeps.</h2>
          </div>
          <p>Five specialised agents, one shared brain. They argue, fact-check, and iterate until your post is ready to publish — and then they publish it.</p>
        </div>

        <div className="feature-grid">
          <div className="feature span-3 tall" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div className="ficon"><Icon.search width="20" height="20" /></div>
              <h3>Niche Discovery, scored on 10 axes</h3>
              <p>Search volume, commercial intent, payout, competition, seasonality, affiliate availability, content gaps and four more — fused into a single 0–100 opportunity score.</p>
            </div>
            <NicheChips />
          </div>

          <div className="feature span-3 tall honey">
            <div className="ficon"><Icon.pencil width="20" height="20" /></div>
            <h3>SEO-tuned drafts in your tone</h3>
            <p>Train the editor on three of your best posts. New articles match cadence, structure and reading level — not just the keyword.</p>
            <ToneSwatches />
          </div>

          <div className="feature span-2">
            <div className="ficon"><Icon.link width="20" height="20" /></div>
            <h3>Smart affiliate links</h3>
            <p>Inserted contextually, deduped, and rotated by EPC. Geo-aware for Amazon Associates.</p>
          </div>

          <div className="feature span-2">
            <div className="ficon"><Icon.rss width="20" height="20" /></div>
            <h3>WordPress, fully automated</h3>
            <p>Publishes with schema markup, AIOSEO meta, featured image, and sitemap ping. Syncs to Pinterest and LinkedIn — zero manual steps.</p>
          </div>

          <div className="feature span-2">
            <div className="ficon"><Icon.shield width="20" height="20" /></div>
            <h3>AI Citation Ready</h3>
            <p>Every article is AEO + GEO scored before publish. Structured so ChatGPT, Perplexity, and Google SGE cite your content by name.</p>
          </div>

          {/* DR Outreach — full-width new feature */}
          <div className="feature" style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="ficon"><Icon.chart width="20" height="20" /></div>
              <span style={{
                fontSize: 11, fontFamily: "JetBrains Mono", letterSpacing: ".1em",
                textTransform: "uppercase", padding: "3px 8px", borderRadius: 999,
                background: "var(--honey)", color: "var(--ink)", fontWeight: 600,
              }}>New</span>
            </div>
            <h3 style={{ margin: 0 }}>Domain Rating growth, on autopilot</h3>
            <p style={{ margin: 0 }}>
              A link-building agent scans for broken external links on high-DR sites, unlinked brand mentions across the web, and 21 verified niche directories. AI drafts the outreach email for each opportunity — you review and approve with one click. DR compounds every week without any manual prospecting.
            </p>
            {/* Stats — 3-column grid so each cell gets equal width on any screen size */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", paddingTop: 4 }}>
              {[
                { val: "21",    lbl: "Verified directories" },
                { val: "5",     lbl: "Link channels" },
                { val: "1-tap", lbl: "Approve & send" },
              ].map(s => (
                <div key={s.lbl} style={{ textAlign: "center", padding: "14px 8px", background: "var(--cream)", borderRadius: 12 }}>
                  <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--ink)", lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: "var(--muted)", fontFamily: "JetBrains Mono", letterSpacing: ".06em", textTransform: "uppercase", marginTop: 6, lineHeight: 1.4 }}>{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NicheChips(){
  const chips = [
    { n: "Gaming Gear Reviews", s: 93 },
    { n: "Personal Finance Tools", s: 91 },
    { n: "Home Security Systems", s: 88 },
    { n: "Budget Travel Tips", s: 79 },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 22 }}>
      {chips.map((c) => (
        <div key={c.n} style={{
          background: "var(--cream)", border: "1px solid var(--cream-2)",
          borderRadius: 10, padding: "10px 12px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontSize: 13
        }}>
          <span style={{ color: "var(--ink)", fontWeight: 500 }}>{c.n}</span>
          <span style={{
            fontFamily: "JetBrains Mono",
            background: c.s >= 85 ? "var(--accent)" : "var(--ink)",
            color: "var(--paper)",
            padding: "2px 8px", borderRadius: 999, fontSize: 11
          }}>{c.s}</span>
        </div>
      ))}
    </div>
  );
}

function ToneSwatches(){
  const samples = ["chatty", "expert", "punchy", "warm", "deadpan"];
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 18, flexWrap: "wrap" }}>
      {samples.map((s, i) => (
        <span key={s} style={{
          background: i === 1 ? "var(--ink)" : "rgba(11,33,24,.08)",
          color: i === 1 ? "var(--honey)" : "var(--ink)",
          padding: "5px 10px", borderRadius: 999,
          fontFamily: "JetBrains Mono", fontSize: 11.5,
          letterSpacing: ".05em"
        }}>{s}</span>
      ))}
    </div>
  );
}

/* ============================================
   LIVE SITE — REVIEWERS GUILD
   ============================================ */
function LiveSite(){
  const niches = [
    { tag: "Personal Finance", title: "Best Budgeting Apps of 2025" },
    { tag: "Pet Health",       title: "Royal Canin vs Purina Pro Plan" },
    { tag: "Home Security",    title: "Ring vs Arlo: Full Comparison" },
    { tag: "Budget Travel",    title: "Cheapest Ways to Fly to Europe" },
  ];
  return (
    <section className="live-section" id="live-site" data-screen-label="05b Live Site">
      <div className="wrap">
        <div className="live-grid">

          <div className="live-copy">
            <span className="eyebrow">Built with Apithany</span>
            <h2 style={{ color: "var(--ink)" }}>Ranked by Google.<br /><span className="serif" style={{ color: "var(--ink)" }}>Running on autopilot.</span></h2>
            <p>Reviewers&apos; Guild is a live affiliate blog running entirely on Apithany — no writers, no editorial team. Five AI agents pick niches, write GEO-tuned articles, inject affiliate links, and publish daily.</p>
            <div className="live-stats">
              <div className="live-stat">
                <span className="live-num">229<span className="serif">+</span></span>
                <span className="live-lbl">Articles live</span>
              </div>
              <div className="live-stat">
                <span className="live-num">6</span>
                <span className="live-lbl">Active niches</span>
              </div>
              <div className="live-stat">
                <span className="live-num">Daily</span>
                <span className="live-lbl">New content</span>
              </div>
            </div>
            <a href="https://www.reviewersguild.blog" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <span>See it live</span> <Icon.arrow width="16" height="16" />
            </a>
          </div>

          <div className="live-browser">
            <div className="browser-chrome">
              <div className="browser-dots"><span /><span /><span /></div>
              <div className="browser-url">reviewersguild.blog</div>
            </div>
            <div className="browser-body">
              <div className="browser-hero-strip">
                <div className="strip-line w-60" />
                <div className="strip-line w-40" />
              </div>
              <div className="browser-posts">
                {niches.map(p => (
                  <div key={p.tag} className="browser-post-row">
                    <span className="browser-niche-tag">{p.tag}</span>
                    <span className="browser-post-title">{p.title}</span>
                  </div>
                ))}
              </div>
              <div className="browser-footer-strip">
                <span className="strip-badge">Awin</span>
                <span className="strip-badge">Amazon</span>
                <span className="strip-badge">CJ Affiliate</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ============================================
   QUOTE / SOCIAL PROOF
   ============================================ */
function Quote(){
  return (
    <section className="quote-section" id="proof" data-screen-label="05 Social proof">
      <div className="wrap">
        <div className="quote-card">
          <div>
            <div className="quote-eyebrow">From the founder</div>
            <blockquote>
              "We built Apithany to run our own affiliate network. Reviewers&apos; Guild went from zero to 229 published articles across 6 niches — with no writers and no editorial team. Every article is scored for AI citation readiness before it ships."
            </blockquote>
            <div className="who">
              <div className="avatar">I</div>
              <div>
                <div style={{ color: "var(--ink)", fontWeight: 600 }}>Isaac Matovu</div>
                <div>Founder · Eastware Solutions</div>
              </div>
            </div>
          </div>
          <div className="quote-stats">
            <div className="quote-stat">
              <div className="num">229<span className="serif">+</span></div>
              <div className="lbl">Articles published</div>
            </div>
            <div className="quote-stat">
              <div className="num">6</div>
              <div className="lbl">Active niches</div>
            </div>
            <div className="quote-stat">
              <div className="num">$0</div>
              <div className="lbl">Content spend</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   PRICING
   ============================================ */
function Pricing(){
  const [annual, setAnnual] = useState(false);

  const plans = [
    { name: "Starter", mo: 49, yr: 39, desc: "Launch your first autonomous niche site.", model: "Gemini 2.5 Flash", feat: false, cta: "Get started", href: "https://app.apithany.com/register", items: [
      "1 site · 30 articles / mo",
      "1 niche · AEO/GEO scoring",
      "Auto-provisioned WordPress site",
      "Awin + Amazon affiliates",
      "Pinterest + Email distribution",
    ]},
    { name: "Pro", mo: 149, yr: 119, desc: "Scale across niches with Claude-powered writing.", model: "Claude Sonnet 4.6", feat: true, cta: "Start with Pro", href: "https://app.apithany.com/register?plan=pro", items: [
      "1 site · 100 articles / mo",
      "5 niches · Regional targeting (10 markets)",
      "All social channels",
      "A/B headline testing · Priority queue",
      "All affiliate networks",
    ]},
    { name: "Agency", mo: 349, yr: 279, desc: "Unlimited scale for agencies and portfolios.", model: "Claude Sonnet 4.6", feat: false, cta: "Talk to us", href: "#contact", items: [
      "Up to 3 sites · 300 articles / mo",
      "Unlimited niches · CTR title optimizer",
      "SSO + audit log",
      "White-label dashboard",
      "Slack-shared CSM",
    ]},
  ];

  return (
    <section className="pricing-section" id="pricing" data-screen-label="06 Pricing">
      <div className="wrap">
        <span className="eyebrow">Pricing</span>
        <h2 style={{ fontSize: "clamp(36px, 4.5vw, 60px)", color: "var(--ink)", marginTop: 18, maxWidth: 700 }}>
          One price. <span className="serif" style={{ color: "var(--accent-deep)" }}>Every agent.</span>
        </h2>

        <div className="billing-toggle">
          <button className={"toggle-opt" + (!annual ? " active" : "")} onClick={() => setAnnual(false)}>
            Monthly
          </button>
          <button className={"toggle-opt" + (annual ? " active" : "")} onClick={() => setAnnual(true)}>
            Annual <span className="save-badge">Save 20%</span>
          </button>
        </div>

        <div className="pricing-grid">
          {plans.map((p) => {
            const price = annual ? p.yr : p.mo;
            return (
              <div key={p.name} className={"plan" + (p.feat ? " feat" : "")}>
                {p.feat && <div className="badge-feat">Most popular</div>}
                <h3>{p.name}</h3>
                <div className="model-badge">{p.model}</div>
                <div className="price">${price}<small>/ mo</small></div>
                {annual && <div className="annual-note">Billed ${price * 12} / year</div>}
                <p className="desc">{p.desc}</p>
                <ul>{p.items.map((it) => <li key={it}>{it}</li>)}</ul>
                <button
                  className={"btn " + (p.feat ? "btn-on-dark" : "btn-primary")}
                  style={{ width: "100%" }}
                  onClick={() => {
                    if (p.href.startsWith("#")) {
                      document.querySelector(p.href)?.scrollIntoView({ behavior: "smooth" });
                    } else {
                      window.location.href = p.href;
                    }
                  }}
                >
                  {p.cta} <Icon.arrow width="16" height="16" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   FAQ
   ============================================ */
function FAQ(){
  const [open, setOpen] = useState(null);

  const items = [
    {
      q: "How does the article writing actually work?",
      a: "Five specialised agents collaborate on every article. A Scout identifies high-opportunity niches, a Strategist writes the brief, an Author drafts 2,000–3,500 words, an Editor runs AEO/GEO quality scoring, and a Publisher ships it to WordPress with schema markup, AIOSEO meta, and a featured image — all without you touching a keyboard.",
    },
    {
      q: "Do I need an existing WordPress site?",
      a: "No. Every plan includes an auto-provisioned WordPress site with hosting. If you already have a site, connect it during onboarding with your WP application password and Apithany will publish directly to it.",
    },
    {
      q: "Can I use my own affiliate accounts?",
      a: "Yes. You bring your own Awin, Amazon Associates, and CJ/ShareASale credentials. Every affiliate link inserted into your articles earns revenue directly in your account — we never take a cut of your commissions.",
    },
    {
      q: "What's AEO/GEO scoring and why does it matter?",
      a: "Answer Engine Optimisation (AEO) and Generative Engine Optimisation (GEO) measure how likely your content is to be cited by AI assistants like ChatGPT, Perplexity, and Google SGE. Every Apithany article is scored before publish. Articles below 65/100 are automatically improved before going live.",
    },
    {
      q: "Which niches perform best?",
      a: "Our Scout agent scores niches across 10 dimensions in real time. Top categories include SaaS product reviews, gaming gear, personal finance tools, home security, and budget travel. Niches with strong affiliate payouts and moderate competition score highest — you can run the niche scorer on any category in your dashboard.",
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes — no lock-in on monthly plans. Cancel from billing settings at any time and your site and content remain yours. Annual plans are billed upfront and non-refundable after 7 days.",
    },
  ];

  return (
    <section className="faq-section" id="faq" data-screen-label="07 FAQ">
      <div className="wrap">
        <span className="eyebrow">FAQ</span>
        <h2>Common questions, <span className="serif">straight answers.</span></h2>
        <div className="faq-list">
          {items.map((item, i) => (
            <div
              key={i}
              className={"faq-item" + (open === i ? " open" : "")}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className="faq-q">
                <span>{item.q}</span>
                <span className="faq-chevron">{open === i ? "−" : "+"}</span>
              </div>
              {open === i && <div className="faq-a">{item.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   FINAL CTA
   ============================================ */
function FinalCTA({ headline, onSubmit }){
  const [email, setEmail] = useState("");
  const [sent, setSent]   = useState(false);

  async function handleCtaSubmit(e){
    e.preventDefault();
    try {
      await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "cta" }),
      });
    } catch (_) { /* silent */ }
    setSent(true);
    onSubmit && onSubmit(email);
  }

  return (
    <section className="cta-section" id="cta" data-screen-label="07 CTA">
      <div className="wrap">
        <div className="cta-card">
          <span className="eyebrow" style={{ color: "var(--moss-2)" }}>Get started</span>
          <h2 style={{ marginTop: 20 }}>
            Your next <span className="serif">epiphany</span><br /> ships itself.
          </h2>
          {sent ? (
            <div className="hero-sent" style={{ margin: "32px auto 0", maxWidth: 420 }}>
              <span>✦</span> Check your inbox — we&apos;ll be in touch.
            </div>
          ) : (
            <form className="hero-form" onSubmit={handleCtaSubmit}>
              <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <button className="btn btn-primary" type="submit">
                Get started <Icon.arrow width="16" height="16" />
              </button>
            </form>
          )}
          <div style={{ marginTop: 18, fontSize: 13.5, color: "var(--moss-2)" }}>
            Plans from $49 / mo · cancel anytime
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   FOOTER
   ============================================ */
function Footer(){
  return (
    <footer data-screen-label="08 Footer">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Brand onDark />
            <p style={{ marginTop: 20, maxWidth: 320, fontSize: 14, color: "var(--moss-2)" }}>
              Apithany is powered by the ATH Engine — autonomous content, real affiliate revenue. Made by people who got tired of writing about sleep tracker rings.
            </p>
          </div>
          <div>
            <h4>Product</h4>
            <ul>
              <li><a href="#features">Agents</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><a href="https://app.apithany.com/login">Sign in</a></li>
              <li><a href="mailto:support@eastwaresolutions.com">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 Eastware Solutions International LLC · Apithany™</span>
          <span style={{ display: "flex", gap: 18 }}>
            <a href="https://app.apithany.com/privacy" target="_blank" rel="noopener noreferrer">Privacy</a>
            <a href="https://app.apithany.com/terms" target="_blank" rel="noopener noreferrer">Terms</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ============================================
   CONTACT FORM
   ============================================ */
function ContactForm(){
  const [form, setForm] = useState({ name: "", company: "", email: "", type: "general", message: "" });
  const [status, setStatus] = useState("idle");

  const types = [
    { value: "general",     label: "General inquiry" },
    { value: "enterprise",  label: "Enterprise / Agency" },
    { value: "partnership", label: "Partnership" },
    { value: "demo",        label: "Request a demo" },
  ];

  function update(e){ setForm({ ...form, [e.target.name]: e.target.value }); }

  async function handleSubmit(e){
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent"){
    return (
      <section className="contact-section" id="contact" data-screen-label="08 Contact">
        <div className="wrap">
          <div className="contact-success">
            <Icon.spark width="36" height="36" style={{ color: "var(--accent)" }} />
            <h3>Message received.</h3>
            <p>We'll get back to you within one business day.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="contact-section" id="contact" data-screen-label="08 Contact">
      <div className="wrap">
        <div className="contact-grid">
          <div className="contact-copy">
            <span className="eyebrow">Get in touch</span>
            <h2>Let's talk <span className="serif">business.</span></h2>
            <p>Agencies, enterprise teams, and potential partners — we respond within one business day.</p>
            <a href="mailto:support@eastwaresolutions.com" className="contact-email">
              <Icon.rss width="15" height="15" />
              support@eastwaresolutions.com
            </a>
          </div>

          <form className="contact-form-card" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>
                <span>Your name</span>
                <input type="text" name="name" value={form.name} onChange={update} placeholder="Jane Smith" required />
              </label>
              <label>
                <span>Company</span>
                <input type="text" name="company" value={form.company} onChange={update} placeholder="Acme Inc." />
              </label>
            </div>
            <label>
              <span>Email</span>
              <input type="email" name="email" value={form.email} onChange={update} placeholder="jane@acme.com" required />
            </label>
            <label>
              <span>Inquiry type</span>
              <select name="type" value={form.type} onChange={update}>
                {types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </label>
            <label>
              <span>Message</span>
              <textarea name="message" value={form.message} onChange={update} placeholder="Tell us about your project…" rows={4} required />
            </label>
            <button className="btn btn-primary" type="submit" style={{ width: "100%" }} disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : <><span>Send message</span> <Icon.arrow width="16" height="16" /></>}
            </button>
            {status === "error" && (
              <p className="form-error">
                Something went wrong — email us directly at <a href="mailto:support@eastwaresolutions.com">support@eastwaresolutions.com</a>
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Nav, Hero, Marquee, HowItWorks, DashboardPreview, Features, Quote, LiveSite, Pricing, FAQ, ContactForm, FinalCTA, Footer });
