import { Link } from "react-router-dom";
import SavingsCalculator from "../components/SavingsCalculator";
import PricingPlans from "../components/PricingPlans";
import ClipText from "../components/ClipText";
import Icon from "../components/Icon";

const OPTIONS = [
  {
    name: "0% for 12 months",
    desc: "No profit rate if paid in full within 12 months. Approval in about five minutes, soft check to prequalify.",
    best: "Repairs and mid-range systems",
  },
  {
    name: "Fixed 7.9% over 60 months",
    desc: "Low fixed monthly payments spread over five years, from about SAR 375/mo on a typical installed system.",
    best: "Full system replacements",
  },
  {
    name: "CoolCare bundle",
    desc: "Roll a maintenance plan into your monthly payment and take 15% off the installation price.",
    best: "New installs, plus peace of mind",
  },
];

export default function Financing() {
  return (
    <div className="cine page-bg" style={{ "--bg-img": "url('/img/bg/bg-financing.jpg')" }}>
      <div className="page-head" style={{ "--ph-img": "url('/img/financing-header.jpg')" }}>
        <div className="container">
          <div className="breadcrumb"><Link to="/home">Home</Link> / Financing</div>
          <h1><ClipText text="Financing & pricing" /></h1>
          <p>A new AC is a big purchase. We make the cost predictable and the payments manageable.</p>
        </div>
      </div>

      {/* Plan tiers, on the glow stage so the section stops reading as a white slab. */}
      <section className="cine-glow">
        <div className="container">
          <PricingPlans />
        </div>
      </section>

      <section>
        <div className="container">
          <p className="cine-eyebrow">Payment options</p>
          <h2 className="cine-section-title" style={{ margin: "10px 0 30px" }}>
            <ClipText text="Spread the cost" />
          </h2>
          <div className="grid grid-3">
            {OPTIONS.map((p) => (
              <div key={p.name} className="card hoverable">
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
                <p style={{ marginTop: 12, fontSize: "0.85rem", display: "flex", gap: 8, alignItems: "center" }}>
                  <Icon name="check-circle" size={15} style={{ color: "var(--accent-soft)" }} />
                  <span><strong style={{ color: "var(--accent-soft)" }}>Best for:</strong> {p.best}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tint center">
        <div className="container">
          <h2 className="section-title"><ClipText text="What would an upgrade save you?" /></h2>
          <p className="section-sub">Run your numbers before you spend a riyal.</p>
          <SavingsCalculator />
          <p style={{ marginTop: 24 }}>
            <Link to="/book" className="btn btn-primary btn-lg">Get prequalified with a free estimate</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
