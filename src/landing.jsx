/* global React, ReactDOM, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor, TweakText, TweakToggle,
   Nav, Hero, Marquee, HowItWorks, DashboardPreview, Features, Quote, LiveSite, Pricing, FAQ, ContactForm, FinalCTA, Footer */

const { useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "forest",
  "heroVariant": "spark",
  "showMarquee": true,
  "showDashboard": true,
  "showPricing": true,
  "headlineMode": "default"
}/*EDITMODE-END*/;

const HEADLINES = {
  default: {
    before: "Autonomous content. Real ",
    spark: "affiliate",
    middle: " revenue.",
    serif: "An epiphany per niche.",
  },
  punchy: {
    before: "Five ",
    spark: "agents",
    middle: ". One revenue stream.",
    serif: "On autopilot, for real.",
  },
  editorial: {
    before: "Content that ",
    spark: "earns",
    middle: " while you sleep.",
    serif: "The ATH engine, reborn.",
  },
};

function App(){
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply palette via data-attribute on <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-palette", t.palette);
  }, [t.palette]);

  const onSignup = (email) => {
    if (!email) return;
    // playful toast
    const el = document.createElement("div");
    el.textContent = `✦ Welcome aboard, ${email.split("@")[0]} — check your inbox.`;
    Object.assign(el.style, {
      position: "fixed", bottom: "32px", left: "50%", transform: "translateX(-50%)",
      background: "var(--ink)", color: "var(--honey)", padding: "14px 22px",
      borderRadius: "999px", fontFamily: "Epilogue, sans-serif", fontSize: "14px",
      zIndex: 9999, boxShadow: "0 30px 60px -20px rgba(0,0,0,.5)",
      opacity: 0, transition: "opacity .25s ease, transform .25s ease"
    });
    document.body.appendChild(el);
    requestAnimationFrame(() => { el.style.opacity = 1; el.style.transform = "translateX(-50%) translateY(-6px)"; });
    setTimeout(() => { el.style.opacity = 0; setTimeout(() => el.remove(), 300); }, 2400);
  };

  const headline = HEADLINES[t.headlineMode] || HEADLINES.default;

  return (
    <React.Fragment>
      <Nav onCta={() => document.querySelector(".hero-form input")?.focus()} />
      <Hero
        headline={headline}
        sub="Five AI agents discover niches, write SEO articles, inject affiliate links and publish straight to your site — entirely on autopilot. You keep the revenue."
        onSubmit={onSignup}
      />
      {t.showMarquee && <Marquee />}
      <HowItWorks />
      {t.showDashboard && <DashboardPreview />}
      <Features />
      <Quote />
      <LiveSite />
      {t.showPricing && <Pricing />}
      <FAQ />
      <ContactForm />
      <FinalCTA onSubmit={onSignup} />
      <Footer />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Palette" />
        <TweakRadio
          label="Theme"
          value={t.palette}
          onChange={(v) => setTweak("palette", v)}
          options={[
            { value: "forest",    label: "Forest" },
            { value: "midnight",  label: "Midnight" },
            { value: "sage",      label: "Sage" },
          ]}
        />

        <TweakSection label="Headline" />
        <TweakRadio
          label="Style"
          value={t.headlineMode}
          onChange={(v) => setTweak("headlineMode", v)}
          options={[
            { value: "default",   label: "Hero" },
            { value: "punchy",    label: "Punchy" },
            { value: "editorial", label: "Editorial" },
          ]}
        />

        <TweakSection label="Sections" />
        <TweakToggle label="Logo marquee"      value={t.showMarquee}   onChange={(v) => setTweak("showMarquee", v)} />
        <TweakToggle label="Dashboard preview" value={t.showDashboard} onChange={(v) => setTweak("showDashboard", v)} />
        <TweakToggle label="Pricing"           value={t.showPricing}   onChange={(v) => setTweak("showPricing", v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
