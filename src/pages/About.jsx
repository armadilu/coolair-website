import { Link } from "react-router-dom";
import ClipText from "../components/ClipText";
import Icon from "../components/Icon";

// Credentials that mean something in Saudi Arabia. The previous version listed
// NATE, BBB and EPA 608, which are American bodies with no standing here, and a
// Texas contractor licence number. That is the single fastest way for a Riyadh
// customer to decide a site is fake.
const CREDENTIALS = [
  { label: "Commercial Registration", value: "1010XXXXXX", note: "Ministry of Commerce" },
  { label: "Municipality licence", value: "Amanat Al-Riyadh", note: "Renewed annually" },
  { label: "Saudi Council of Engineers", value: "Registered", note: "Supervising engineers" },
  { label: "SASO conformity", value: "All equipment", note: "Saudi Standards" },
  { label: "SEEC efficiency labels", value: "Verified", note: "Energy Efficiency Centre" },
  { label: "ZATCA e-invoicing", value: "Phase 2", note: "Every invoice" },
];

const FACTS = [
  { num: "2019", lbl: "Trading in Riyadh since" },
  { num: "4 crews", lbl: "Across the city" },
  { num: "1,200+", lbl: "Reviews collected" },
  { num: "12 mo", lbl: "0% instalments" },
];

export default function About() {
  return (
    <div className="cine page-bg" style={{ "--bg-img": "url('/img/bg/bg-about.jpg')" }}>
      <div className="page-head" style={{ "--ph-img": "url('/img/page-about.jpg')" }}>
        <div className="container">
          <div className="breadcrumb"><Link to="/home">Home</Link> / About</div>
          <h1><ClipText text="About CoolAir" /></h1>
          <p>An air conditioning contractor in Riyadh. Licensed, priced in the open, booked online.</p>
        </div>
      </div>

      <section>
        <div className="container grid grid-2" style={{ alignItems: "start" }}>
          <div>
            <p className="cine-eyebrow">Who we are</p>
            <h2 className="section-title" style={{ fontSize: "1.6rem", marginTop: 10 }}>
              A contractor, not a call centre
            </h2>
            <p style={{ color: "var(--muted)", marginTop: 12 }}>
              CoolAir has been servicing split and package units across Riyadh since 2019. We run
              four crews out of one workshop in Al Malaz, we employ our technicians directly rather
              than dispatching to subcontractors, and the person who quotes your job is the person
              who does it.
            </p>
            <p style={{ color: "var(--muted)", marginTop: 12 }}>
              The reason the site works the way it does is simple. Getting an AC fixed here usually
              means calling three numbers, waiting for a callback that may not come, and finding out
              the price after the panel is already off. We put the price range online before anyone
              visits, we show the actual slots our crews have open, and we agree a flat rate in
              writing before work starts. If a technician finds something the quote did not cover,
              you approve the change before he continues.
            </p>
            <p style={{ color: "var(--muted)", marginTop: 12 }}>
              Riyadh is hard on equipment. Summer sits above 45°C for weeks, dust loads filters
              faster than the manuals assume, and a unit sized for a European climate will run
              itself to death here. We size on a real load calculation and we service on a schedule
              built around the dust season, not a generic six-month interval.
            </p>

            <ul className="checklist" style={{ marginTop: 18 }}>
              <li>Technicians employed directly, not subcontracted per job</li>
              <li>Flat rate agreed in writing before any panel comes off</li>
              <li>One year on parts and labour for every repair</li>
              <li>Refrigerant recovered and disposed of through a licensed handler</li>
              <li>Arabic and English, on the phone and on site</li>
            </ul>
          </div>

          <div className="grid" style={{ gap: 16 }}>
            <img
              src="/img/about.jpg"
              alt="A CoolAir technician servicing a wall-mounted split unit"
              style={{ borderRadius: "var(--radius)", width: "100%", objectFit: "cover", maxHeight: 300, border: "1px solid var(--line)" }}
            />
            <div className="grid grid-2" style={{ gap: 16 }}>
              {FACTS.map((f) => (
                <div key={f.lbl} className="stat">
                  <div className="num">{f.num}</div>
                  <div className="lbl">{f.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-tint">
        <div className="container">
          <p className="cine-eyebrow">Registration</p>
          <h2 className="section-title" style={{ fontSize: "1.6rem", margin: "10px 0 6px" }}>
            What we are licensed to do
          </h2>
          <p className="section-sub">
            Ask any contractor for these before you let them on the roof. Ours are on the invoice.
          </p>

          <div className="grid grid-3">
            {CREDENTIALS.map((c) => (
              <div key={c.label} className="card cine-spot">
                <p className="cine-eyebrow" style={{ marginBottom: 8 }}>{c.label}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <Icon name="shield-check" size={17} style={{ color: "var(--accent-soft)" }} />
                  <strong style={{ color: "#fff", fontSize: "1.05rem" }}>{c.value}</strong>
                </div>
                <p style={{ color: "var(--muted)", fontSize: ".84rem", marginTop: 8 }}>{c.note}</p>
              </div>
            ))}
          </div>

          <p style={{ color: "var(--muted)", fontSize: ".82rem", marginTop: 22 }}>
            Registration numbers are shown in full on every quote and invoice. VAT is charged at the
            standard rate and itemised separately.
          </p>
        </div>
      </section>
    </div>
  );
}
