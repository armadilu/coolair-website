import { Link } from "react-router-dom";
import SavingsCalculator from "../components/SavingsCalculator";

const PLANS = [
  { name: "0% APR / 12 months", desc: "No interest if paid in full within 12 months. Approval in ~5 minutes, soft credit check to prequalify.", best: "Repairs & mid-range systems" },
  { name: "Fixed 7.9% / 60 months", desc: "Low fixed monthly payments spread over 5 years — from $89/mo on a typical installed system.", best: "Full system replacements" },
  { name: "CoolCare bundle", desc: "Roll a maintenance plan into your monthly payment and get 15% off the install price.", best: "New installs + peace of mind" },
];

export default function Financing() {
  return (
    <div className="page-bg" style={{ "--bg-img": "url('/img/bg/bg-financing.jpg')" }}>
      <div className="page-head" style={{ "--ph-img": "url('/img/page-financing.jpg')" }}>
        <div className="container">
          <div className="breadcrumb"><Link to="/home">Home</Link> / Financing</div>
          <h1>Financing & Pricing</h1>
          <p>A new AC is a big purchase — we make the cost predictable and the payments manageable.</p>
        </div>
      </div>

      <section>
        <div className="container">
          <div className="grid grid-3">
            {PLANS.map((p) => (
              <div key={p.name} className="card hoverable">
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
                <p style={{ marginTop: 12, fontSize: "0.85rem" }}>
                  <strong style={{ color: "var(--blue-700)" }}>Best for:</strong> {p.best}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#fff" }} className="center">
        <div className="container">
          <h2 className="section-title">What would an upgrade save you?</h2>
          <p className="section-sub">Run your numbers before you spend a dollar.</p>
          <SavingsCalculator />
          <p style={{ marginTop: 24 }}>
            <Link to="/book" className="btn btn-primary btn-lg">Get prequalified with a free estimate</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
