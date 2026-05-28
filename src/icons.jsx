/* global React */
// Inline SVG icons + the Apithany glyph + brand pieces.

const Icon = {
  search: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
  ),
  pencil: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 4l6 6L8 22H2v-6L14 4z"/></svg>
  ),
  bolt: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></svg>
  ),
  rss: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1.5" fill="currentColor"/></svg>
  ),
  link: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>
  ),
  hex: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" {...p}><path d="M12 2.5 21 7v10l-9 4.5L3 17V7z"/></svg>
  ),
  chart: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/></svg>
  ),
  agent: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="4" y="7" width="16" height="12" rx="3"/><circle cx="9" cy="13" r="1.5" fill="currentColor"/><circle cx="15" cy="13" r="1.5" fill="currentColor"/><path d="M12 3v4"/><circle cx="12" cy="3" r="1" fill="currentColor"/></svg>
  ),
  spark: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2 13.8 8.2 20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z"/></svg>
  ),
  wp: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18"/></svg>
  ),
  globe: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 4.5 7 4.5 9s-1.5 5.5-4.5 9c-3-3.5-4.5-7-4.5-9s1.5-5.5 4.5-9z"/></svg>
  ),
  shield: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" {...p}><path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3z"/></svg>
  ),
  arrow: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>
  ),
};

/* ============================================
   APITHANY GLYPH
   A hex (api/honeycomb nod) + interior spark (epiphany).
   The negative space inside also reads as a gem (revelation moment).
   ============================================ */
function ApithanyGlyph({ size = 36, accent = "var(--honey)", ink = "var(--ink)" }){
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ display: "block" }}>
      {/* outer rounded hex */}
      <path d="M20 3 33.5 10.5 33.5 25.5 20 33 6.5 25.5 6.5 10.5z"
        fill={ink} stroke={accent} strokeWidth="1.2" strokeLinejoin="round" />
      {/* inner gem */}
      <path d="M20 12 27 17.5 20 26 13 17.5z" fill={accent} />
      {/* spark cross */}
      <path d="M20 9.5v3M20 27v2M11 18.5h2M27 18.5h2"
        stroke={accent} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/* The wordmark — "Apithany" with API highlighted */
function Wordmark({ onDark = false, size = 26 }){
  return (
    <span className={"wordmark" + (onDark ? " on-dark" : "")} style={{ fontSize: size }}>
      <span className="ath">api</span>thany
    </span>
  );
}

/* Combined brand block: glyph + wordmark + tag */
function Brand({ onDark = false, withTag = true }){
  return (
    <div className="brand-block">
      <div className="glyph" style={onDark ? { background: "var(--ink-2)" } : null}>
        <ApithanyGlyph size={22} />
      </div>
      <div>
        <Wordmark onDark={onDark} />
        {withTag && <div className="tag" style={onDark ? { color: "var(--moss-2)" } : null}>by Eastware Solutions</div>}
      </div>
    </div>
  );
}

Object.assign(window, { Icon, ApithanyGlyph, Wordmark, Brand });
