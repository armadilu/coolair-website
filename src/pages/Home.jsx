import { Link } from "react-router-dom";
import QuoteWidget from "../components/QuoteWidget";
import ReviewsCarousel from "../components/ReviewsCarousel";
import SavingsCalculator from "../components/SavingsCalculator";
import Icon, { SERVICE_ICONS } from "../components/Icon";
import { SERVICES, SERVICE_AREAS } from "../data";

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

      {/* Kinetic trust marquee — one per page, pauses on hover */}
      <div className="marquee" aria-label="Certifications and reviews">
        <div className="marquee-track">
          {[0, 1].map((dup) => (
            <span key={`set-${dup}`} aria-hidden={dup === 1} style={{ display: "contents" }}>
              <span><Icon name="check" size={15} /> Licensed &amp; insured</span>
              <span><Icon name="star" size={15} /> 4.9 on Google</span>
              <span><Icon name="clock" size={15} /> Same-day in most zips</span>
              <span><Icon name="shield" size={15} /> 1-yr repair warranty</span>
              <span><Icon name="award" size={15} /> NATE-certified technicians</span>
              <span><Icon name="check" size={15} /> EPA 608 certified</span>
              <span><Icon name="star" size={15} /> "Booked at 9am, cool house by 2pm"</span>
              <span><Icon name="card" size={15} /> 0% APR for 12 months</span>
            </span>
          ))}
        </div>
      </div>

      {/* AI instant quote widget */}
      <section style={{ paddingTop: 44 }}>
        <div className="container">
          <QuoteWidget />
        </div>
      </section>

      {/* Services — sticky-stack: panels pin and stack as you scroll */}
      <section className="center" style={{ paddingBottom: 30 }}>
        <div className="container">
          <h2 className="section-title">What do you need done?</h2>
          <p className="section-sub" style={{ margin: "0 auto 36px" }}>
            Five specialties, one team. Every job priced upfront.
          </p>
          <div className="stack-wrap" style={{ textAlign: "left" }}>
            {SERVICES.map((s, i) => (
              <div key={s.slug} className="stack-panel" style={{ "--i": i }}>
                <div>
                  <span className="icon"><Icon name={SERVICE_ICONS[s.slug]} size={22} /></span>
                  <h3>{s.name}</h3>
                  <p>{s.short}</p>
                  <ul className="stack-bullets">
                    {s.bullets.slice(0, 2).map((b) => (
                      <li key={b}><Icon name="check" size={14} /> {b}</li>
                    ))}
                  </ul>
                  <Link to={`/services/${s.slug}`} className="btn btn-outline">Learn more</Link>
                </div>
                <img src={`/img/page-service-${s.slug}.jpg`} alt={s.name} loading="lazy" />
              </div>
            ))}
          </div>
          <p style={{ marginTop: 34 }}>
            <Link to="/shop" className="btn btn-primary btn-lg">
              <Icon name="cart" size={17} /> Shop AC units
            </Link>
          </p>
        </div>
      </section>

      {/* Why us — asymmetric bento (one cell per advantage) */}
      <section>
        <div className="container">
          <h2 className="section-title">Why homeowners switch to CoolAir</h2>
          <p className="section-sub">Five ways we beat the typical local HVAC outfit.</p>
          <div className="bento">
            <div className="bento-cell bento-big" style={{ "--bento-img": "url('/img/hero.jpg')" }}>
              <Icon name="clock" size={26} />
              <h3>Same-day in most zips</h3>
              <p>Real technicians on real schedules.</p>
              <span className="bento-vs" style={{ color: "rgba(255,255,255,0.55)" }}>vs. 2-5 business days</span>
            </div>
            <div className="bento-cell bento-tint">
              <Icon name="zap" size={22} />
              <h3>Instant quote range</h3>
              <span className="bento-vs">vs. "we'll call you back"</span>
            </div>
            <div className="bento-cell">
              <Icon name="calendar" size={22} />
              <h3>Real-time booking</h3>
              <span className="bento-vs">vs. phone tag</span>
            </div>
            <div className="bento-cell bento-green">
              <Icon name="shield" size={22} />
              <h3>1-yr parts &amp; labor warranty</h3>
              <span className="bento-vs">vs. 30-90 days</span>
            </div>
            <div className="bento-cell">
              <Icon name="card" size={22} />
              <h3>0% APR for 12 months</h3>
              <span className="bento-vs">vs. rarely offered</span>
            </div>
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
      <section className="section-tint">
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
