import { Link } from "react-router-dom";
import QuoteWidget from "../components/QuoteWidget";
import ReviewsCarousel from "../components/ReviewsCarousel";
import SavingsCalculator from "../components/SavingsCalculator";
import Icon, { SERVICE_ICONS } from "../components/Icon";
import { SERVICES, COMPARISON, SERVICE_AREAS } from "../data";

export default function Home() {
  return (
    <div className="page-bg" style={{ "--bg-img": "url('/img/bg/bg-home.jpg')" }}>
      {/* Hero — max 4 elements: headline, subtext, 2 CTAs (trust strip moved below) */}
      <div className="hero">
        <div className="container hero-grid">
          <div>
            <h1>
              AC trouble? <em>Same-day service</em>,<br />upfront pricing, zero phone tag.
            </h1>
            <p className="lead">
              Instant online quotes and real-time booking for repair, replacement, and maintenance.
            </p>
            <div className="hero-ctas">
              <Link to="/book" className="btn btn-primary btn-lg">Book now</Link>
              <a href="tel:5550102665" className="btn btn-outline btn-lg">
                <Icon name="phone" size={17} /> Call (555) 010-COOL
              </a>
            </div>
          </div>
          <img className="hero-photo" src="/img/hero.jpg" alt="Cool, comfortable modern home interior" />
        </div>
      </div>

      {/* Trust strip — its own slim section below the hero */}
      <div className="trust-strip">
        <div className="container trust-strip-inner">
          <span><Icon name="check" size={15} /> Licensed &amp; insured</span>
          <span><Icon name="star" size={15} /> 4.9 · 1,200+ Google reviews</span>
          <span><Icon name="clock" size={15} /> Same-day in most zips</span>
          <span><Icon name="shield" size={15} /> 1-yr repair warranty</span>
        </div>
      </div>

      {/* AI instant quote widget */}
      <section style={{ paddingTop: 44 }}>
        <div className="container">
          <QuoteWidget />
        </div>
      </section>

      {/* Services grid */}
      <section className="center">
        <div className="container">
          <h2 className="section-title">What do you need done?</h2>
          <p className="section-sub">Five specialties, one team — every job priced upfront.</p>
          <div className="grid grid-3" style={{ textAlign: "left" }}>
            {SERVICES.map((s) => (
              <Link key={s.slug} to={`/services/${s.slug}`} className="card hoverable">
                <span className="icon"><Icon name={SERVICE_ICONS[s.slug]} size={22} /></span>
                <h3>{s.name}</h3>
                <p>{s.short}</p>
                <span className="card-link">Learn more →</span>
              </Link>
            ))}
            <Link to="/shop" className="card hoverable">
              <span className="icon"><Icon name="cart" size={22} /></span>
              <h3>Shop AC Units</h3>
              <p>Browse high-SEER systems with bundled installation and financing.</p>
              <span className="card-link">Browse units →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Why us / comparison table */}
      <section style={{ background: "rgba(250,251,249,0.9)", backdropFilter: "blur(3px)" }}>
        <div className="container">
          <h2 className="section-title">Why homeowners switch to CoolAir</h2>
          <p className="section-sub">A straight comparison with the typical local HVAC outfit.</p>
          <div className="table-wrap">
            <table className="styled">
              <thead>
                <tr><th></th><th>CoolAir Co.</th><th>Typical competitor</th></tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.feature}>
                    <td style={{ fontWeight: 600 }}>{row.feature}</td>
                    <td className="us"><Icon name="check" size={15} /> {row.us}</td>
                    <td className="them"><Icon name="x" size={14} /> {row.them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="center">
        <div className="container">
          <h2 className="section-title">Rated 4.9 on Google</h2>
          <p className="section-sub">Fresh reviews, pulled in automatically after every completed job.</p>
          <ReviewsCarousel />
        </div>
      </section>

      {/* Service area map — real map */}
      <section style={{ background: "rgba(250,251,249,0.9)", backdropFilter: "blur(3px)" }}>
        <div className="container grid grid-2" style={{ alignItems: "center" }}>
          <div>
            <h2 className="section-title">Serving the whole metro</h2>
            <p className="section-sub">
              Same-day service in Central Metro and the North Suburbs; next-day everywhere else we cover.
            </p>
            <div>
              {SERVICE_AREAS.map((a) => (
                <span key={a.zone} className="zone-pill">
                  <Icon name="pin" size={13} /> {a.zone} — {a.response}
                </span>
              ))}
            </div>
            <p style={{ marginTop: 18 }}>
              <Link to="/service-areas" className="btn btn-outline">Check your zip code</Link>
            </p>
          </div>
          <div className="map-frame">
            <img src="/img/map-metro.jpg" alt="CoolAir service coverage across the metro — 4 zones, 16 zip codes" />
            <span className="map-caption">4 zones · 16 zip codes</span>
          </div>
        </div>
      </section>

      {/* Financing / pricing transparency */}
      <section className="center">
        <div className="container">
          <h2 className="section-title">No surprises on price</h2>
          <p className="section-sub">
            0% APR financing for 12 months on new systems — and see what an upgrade saves you first.
          </p>
          <SavingsCalculator />
          <p style={{ marginTop: 22 }}>
            <Link to="/financing" className="btn btn-primary">Explore financing options</Link>
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="banner-cta">
            <h2>Ready when you are</h2>
            <p>Pick a real time slot online in under a minute.</p>
            <Link to="/book" className="btn btn-lg" style={{ background: "#fff", color: "var(--accent)" }}>
              Book now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
