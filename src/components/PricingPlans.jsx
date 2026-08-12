import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";

// Three-tier plan row: two ghost cards flanking one filled, lifted, scaled
// "most popular" card, with a monthly/annual toggle above it. Structure follows
// the reference pricing layout; the palette is CoolAir's — copper on cinema
// black rather than the reference's teal on near-white, because a light section
// dropped into this site would read as a different website.
//
// Prices are the real CoolCare figures from data.js, in SAR.

const PLANS = [
  {
    name: "Pay as you go",
    monthly: 0,
    unit: "no plan",
    features: ["Same-day booking, most districts", "Flat rate agreed before work starts", "1-year parts & labour on repairs"],
    cta: "Book a visit",
    to: "/book",
  },
  {
    name: "CoolCare",
    monthly: 55,
    unit: "per month",
    featured: true,
    badge: "Most popular",
    features: [
      "2 precision tune-ups a year",
      "Priority same-day scheduling",
      "15% off every repair",
      "No overtime or emergency fees",
    ],
    cta: "Start CoolCare",
    to: "/book?service=maintenance",
  },
  {
    name: "CoolCare Villa",
    monthly: 149,
    unit: "per month",
    features: ["Up to 6 split units covered", "4 tune-ups a year + duct inspection", "20% off repairs, free IAQ reading"],
    cta: "Talk to us",
    to: "/book?service=maintenance",
  },
];

const ANNUAL_DISCOUNT = 0.2;

export default function PricingPlans() {
  const [annual, setAnnual] = useState(false);
  const price = (p) => Math.round(p.monthly * (annual ? 1 - ANNUAL_DISCOUNT : 1));

  return (
    <div className="pricing">
      <div className="pricing-head">
        <span className="pricing-pill">
          <Icon name="zap" size={13} /> Plans
        </span>
        <h2 className="cine-section-title">Cover it before it breaks</h2>
        <p className="pricing-sub">
          Every plan includes the same technicians and the same warranty. Pick how often you want
          them to show up before you need them.
        </p>

        <div className="pricing-toggle">
          <span className={!annual ? "is-on" : ""}>Monthly</span>
          <button
            type="button"
            role="switch"
            aria-checked={annual}
            aria-label="Bill annually"
            className={`pricing-switch ${annual ? "is-on" : ""}`}
            onClick={() => setAnnual((v) => !v)}
          >
            <i />
          </button>
          <span className={annual ? "is-on" : ""}>Annually</span>
          <em className="pricing-save">−20%</em>
        </div>
      </div>

      <div className="pricing-grid">
        {PLANS.map((p) => (
          <div key={p.name} className={`pricing-card ${p.featured ? "is-featured" : ""}`}>
            {p.badge && <span className="pricing-badge">{p.badge}</span>}
            <h3>{p.name}</h3>
            <div className="pricing-amount">
              <span className="pricing-cur">SAR</span>
              <strong>{price(p)}</strong>
              <span className="pricing-unit">/{p.unit === "no plan" ? "mo" : "mo"}</span>
            </div>
            <p className="pricing-note">
              {p.monthly === 0
                ? "Only pay when you call us out."
                : annual
                  ? `Billed SAR ${price(p) * 12} once a year.`
                  : "Billed monthly, cancel any time."}
            </p>

            <ul className="pricing-features">
              {p.features.map((f) => (
                <li key={f}>
                  <Icon name="check-circle" size={17} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Link to={p.to} className={`btn ${p.featured ? "pricing-cta-solid" : "pricing-cta-ghost"}`}>
              {p.cta}
            </Link>
          </div>
        ))}
      </div>

      <p className="pricing-guarantee">
        <Icon name="shield-check" size={15} /> 30 days to change your mind. Cancel any time, no
        notice period and no exit fee.
      </p>
    </div>
  );
}
