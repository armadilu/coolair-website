import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="page-bg" style={{ "--bg-img": "url('/img/bg/bg-about.jpg')" }}>
      <div className="page-head" style={{ "--ph-img": "url('/img/page-about.jpg')" }}>
        <div className="container">
          <div className="breadcrumb"><Link to="/home">Home</Link> / About</div>
          <h1>About CoolAir Co.</h1>
          <p>A local company running on modern rails — certified people, transparent prices, real technology.</p>
        </div>
      </div>

      <section>
        <div className="container grid grid-2" style={{ alignItems: "start" }}>
          <div>
            <h2 className="section-title" style={{ fontSize: "1.5rem" }}>Our story</h2>
            <p style={{ color: "var(--muted)" }}>
              CoolAir Co. started with a simple frustration: getting an AC fixed meant phone tag,
              vague pricing, and week-long waits. We built the company we wished existed — instant
              online quotes, real-time booking synced to technician availability, and flat-rate
              pricing agreed before any panel comes off.
            </p>
            <p style={{ color: "var(--muted)", marginTop: 12 }}>
              Today our NATE-certified team covers four metro zones, holds a 4.9-star Google rating
              across 1,200+ automatically-collected reviews, and installs everything from budget
              Goodman systems to flagship SEER-26 Carriers.
            </p>
            <ul className="checklist">
              <li>Every technician NATE-certified and background-checked</li>
              <li>EPA 608 certified for refrigerant handling</li>
              <li>BBB A+ rated, fully licensed and insured</li>
              <li>1-year parts & labor warranty on every repair</li>
            </ul>
          </div>
          <div className="grid" style={{ gap: 16 }}>
            <img
              src="/img/about.jpg"
              alt="Technician setting a smart thermostat"
              style={{ borderRadius: "var(--radius)", boxShadow: "var(--shadow-lg)", width: "100%", objectFit: "cover", maxHeight: 280 }}
            />
            <div className="grid grid-2" style={{ gap: 16 }}>
              <div className="stat"><div className="num">1,200+</div><div className="lbl">5-star reviews</div></div>
              <div className="stat"><div className="num">4 zones</div><div className="lbl">Metro coverage</div></div>
              <div className="stat"><div className="num">Same-day</div><div className="lbl">Typical response</div></div>
              <div className="stat"><div className="num">0% APR</div><div className="lbl">12-month financing</div></div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: "rgba(250,251,249,0.9)", backdropFilter: "blur(3px)", paddingBottom: 70 }}>
        <div className="container center">
          <h2 className="section-title">Certifications</h2>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: 18 }}>
            {["NATE Certified", "BBB A+", "EPA 608", "Licensed #TACLA-042077C", "Insured & Bonded"].map((c) => (
              <span key={c} className="zone-pill" style={{ fontWeight: 700, padding: "10px 20px" }}>{c}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
