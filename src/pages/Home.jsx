import { Link } from "react-router-dom";
import QuoteWidget from "../components/QuoteWidget";
import SavingsCalculator from "../components/SavingsCalculator";
import HorizontalGallery from "../components/HorizontalGallery";
import ReviewsMarquee from "../components/ReviewsMarquee";
import ClipText from "../components/ClipText";
import Icon from "../components/Icon";
import { SERVICES, SERVICE_AREAS } from "../data";

// Cursor spotlight — writes CSS vars straight on the node, no React state.
const spot = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

const CUBE_FACES = [
  { cls: "cf-front", img: "/img/cube/face-1.jpg", label: "Same-day repair" },
  { cls: "cf-bottom", img: "/img/cube/face-2.jpg", label: "Installation" },
  { cls: "cf-back", img: "/img/cube/face-3.jpg", label: "Maintenance" },
  { cls: "cf-top", img: "/img/cube/face-4.jpg", label: "Air quality" },
];

// Panels for the pinned horizontal rail — the five services plus the shop.
const PANELS = [
  ...SERVICES.map((s, i) => ({
    to: `/services/${s.slug}`,
    img: `/img/page-service-${s.slug}.jpg`,
    index: String(i + 1).padStart(2, "0"),
    eyebrow: `from SAR ${s.basePrice.toLocaleString()}`,
    title: s.name,
    desc: s.short,
    cta: "Explore",
  })),
  {
    to: "/shop",
    img: "/img/bg/bg-shop.jpg",
    index: String(SERVICES.length + 1).padStart(2, "0"),
    eyebrow: "Six systems · installation bundled",
    title: "Shop AC units",
    desc: "High-SEER systems with installation, haul-away and 0% instalments built in.",
    cta: "Browse units",
  },
];

export default function Home() {
  return (
    <div className="cine">
      {/* ── HERO: 3D rolodex ── */}
      <section className="cine-hero">
        <div className="cine-hero-bgtext" aria-hidden="true">COOLAIR</div>

        <div>
          <div className="cine-stage">
            <div className="cube">
              {CUBE_FACES.map((f) => (
                <div key={f.cls} className={`cube-face ${f.cls}`}>
                  <img src={f.img} alt="" />
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="cine-hero-copy">
            <h1 className="cine-display">
              <ClipText text="Cold air," />
              <br />
              <ClipText text="on demand" className="cine-grad-text" delay={0.22} />
            </h1>
            <p>
              Same-day AC repair, replacement and maintenance. Instant online pricing,
              real technicians, no phone tag.
            </p>
            <div className="cine-ctas">
              <Link to="/book" className="btn btn-primary btn-lg">Book now</Link>
              <a href="tel:+966112002665" className="btn btn-outline btn-lg">
                <Icon name="phone" size={16} /> +966 11 200 2665
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee of proof ── */}
      <div className="marquee" aria-label="Certifications and reviews">
        <div className="marquee-track">
          {[0, 1].map((dup) => (
            <span key={dup} aria-hidden={dup === 1} style={{ display: "contents" }}>
              <span><Icon name="check" size={13} /> Licensed &amp; insured</span>
              <span><Icon name="star" size={13} /> 4.9 on Google</span>
              <span><Icon name="clock" size={13} /> Same-day in most zips</span>
              <span><Icon name="shield" size={13} /> 1-yr repair warranty</span>
              <span><Icon name="award" size={13} /> NATE certified</span>
              <span><Icon name="card" size={13} /> 0% APR for 12 months</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Instant quote ── */}
      <section>
        <div className="container">
          <p className="cine-eyebrow" style={{ marginBottom: 14 }}>Instant pricing</p>
          <QuoteWidget />
        </div>
      </section>

      {/* ── What we handle: vertical scroll drives a horizontal rail ── */}
      <HorizontalGallery panels={PANELS} />

      {/* ── Why us, on a glow stage ── */}
      <section className="cine-glow">
        <div className="container">
          <h2 className="cine-section-title" style={{ textAlign: "center", marginBottom: 12 }}>
            <ClipText text="Why they" />
            <br />
            <ClipText text="switch" delay={0.16} />
          </h2>
          <p style={{ textAlign: "center", color: "var(--muted)", maxWidth: 46, margin: "0 auto 40px", maxWidth: "44ch" }}>
            Five things the typical local HVAC outfit still gets wrong.
          </p>

          <div className="grid grid-3" style={{ alignItems: "stretch" }}>
            <div className="cine-glass">
              <p className="cine-eyebrow">Response</p>
              <div className="cine-price">Same-day</div>
              <p style={{ color: "var(--muted)", marginTop: 8 }}>Most zips, most days. Others quote 2 to 5 business days.</p>
            </div>

            <div className="cine-glass featured">
              <p className="cine-eyebrow" style={{ color: "#8a5a3a" }}>Pricing</p>
              <div className="cine-price">Upfront</div>
              <p style={{ marginTop: 8 }}>
                A real range online before anyone visits, and a flat rate agreed before a panel comes off.
              </p>
              <p style={{ marginTop: 14, fontWeight: 700 }}>Never “we'll call you back”.</p>
            </div>

            <div className="cine-glass">
              <p className="cine-eyebrow">Warranty</p>
              <div className="cine-price">1 year</div>
              <p style={{ color: "var(--muted)", marginTop: 8 }}>Parts and labour on every repair. Typical cover is 30 to 90 days.</p>
            </div>
          </div>

          <div style={{ marginTop: 44 }}>
            <SavingsCalculator />
          </div>
        </div>
      </section>

      {/* ── Proof ── */}
      <section>
        <ReviewsMarquee />
      </section>

      {/* ── Coverage ── */}
      <section className="section-tint">
        <div className="container grid grid-2" style={{ alignItems: "center" }}>
          <div>
            <p className="cine-eyebrow">Coverage</p>
            <h2 className="cine-section-title" style={{ margin: "10px 0 18px" }}>
              <ClipText text="Four zones" />
            </h2>
            <div>
              {SERVICE_AREAS.map((a) => (
                <span key={a.zone} className="zone-pill">
                  <Icon name="pin" size={12} /> {a.zone} — {a.response}
                </span>
              ))}
            </div>
            <p style={{ marginTop: 22 }}>
              <Link to="/service-areas" className="btn btn-outline">Check your zip</Link>
            </p>
          </div>
          <div className="map-frame cine-spot" onMouseMove={spot}>
            <img src="/img/map-metro.jpg" alt="CoolAir coverage across the metro" />
            <span className="map-caption">4 zones · 16 zip codes</span>
          </div>
        </div>
      </section>

      {/* ── Closing statement ── */}
      <section className="cine-glow" style={{ textAlign: "center" }}>
        <div className="container">
          <h2 className="cine-section-title">
            <ClipText text="Ready when" />
            <br />
            <ClipText text="you are" delay={0.18} />
          </h2>
          <p style={{ color: "var(--muted)", margin: "18px auto 30px", maxWidth: "42ch" }}>
            Pick a real time slot online in under a minute.
          </p>
          <Link to="/book" className="btn btn-primary btn-lg">Book now</Link>
          <div className="cine-footer-mark" aria-hidden="true">COOLAIR</div>
        </div>
      </section>
    </div>
  );
}
