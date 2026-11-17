/* global React, ReactDOM,
   Nav, Hero, Marquee, HowItWorks, DashboardPreview, Features, Quote, LiveSite, Pricing, FAQ, ContactForm, FinalCTA, Footer */

// Page composition. The design-time "Tweaks" panel was removed for production;
// the chosen palette is applied as a static data attribute below.

const HEADLINE = {
  before: "Autonomous content. Real ",
  spark: "affiliate",
  middle: " revenue.",
  serif: "An epiphany per niche.",
};

document.documentElement.setAttribute("data-palette", "forest");

function App(){
  return (
    <React.Fragment>
      <Nav onCta={() => document.querySelector(".hero-form input")?.focus()} />
      <Hero
        headline={HEADLINE}
        sub="Five AI agents discover niches, write SEO articles, insert your affiliate links and publish straight to your WordPress site. You keep the revenue."
      />
      <Marquee />
      <HowItWorks />
      <DashboardPreview />
      <Features />
      <Quote />
      <LiveSite />
      <Pricing />
      <FAQ />
      <ContactForm />
      <FinalCTA />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
