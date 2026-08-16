import { useState } from "react";
import RiyadhMap from "../components/RiyadhMap";
import AreaCards from "../components/AreaCards";
import ClipText from "../components/ClipText";
import CtaButton from "../components/CtaButton";
import Icon from "../components/Icon";
import { Link } from "react-router-dom";
import { SERVICE_AREAS } from "../data";

// Saudi addresses are district + National Address, not a US-style zip, so the
// checker takes whatever the customer actually knows: the district name, the
// 5-digit postal code, or the first four letters of their short address.
const findZone = (q) => {
  const s = q.trim().toLowerCase();
  if (!s) return null;
  return (
    SERVICE_AREAS.find((a) => a.postal.includes(s)) ||
    SERVICE_AREAS.find((a) => a.districts.some((d) => d.toLowerCase().includes(s))) ||
    SERVICE_AREAS.find((a) => a.zone.toLowerCase().includes(s)) ||
    SERVICE_AREAS.find((a) => a.shortPrefix.toLowerCase() === s.slice(0, 4)) ||
    null
  );
};

const ADDRESS_PARTS = [
  {
    term: "District",
    example: "Al Narjis",
    icon: "pin",
    what: "The neighbourhood, and the one thing everybody knows. On its own it is enough for us to tell you which crew covers you and how fast they can get there.",
  },
  {
    term: "Postal code",
    example: "13322",
    icon: "card",
    what: "Five digits from Saudi Post. It narrows the district down to a delivery area. Useful, but it does not point at a building.",
  },
  {
    term: "Short code",
    example: "RAOA2929",
    icon: "zap",
    what: "Four letters and four digits from the Saudi National Address. Unlike a postal code this resolves to one exact building, so a technician arrives at your door rather than your street. You will find it on any recent utility bill or in the Absher app.",
  },
];

export default function ServiceAreas() {
  const [q, setQ] = useState("");
  const [result, setResult] = useState(null);
  const [focus, setFocus] = useState(null);

  const pick = (zone) => { setResult({ ok: true, zone }); setFocus(zone); };
  const check = () => {
    const zone = findZone(q);
    if (zone) pick(zone);
    else setResult({ ok: false });
  };

  return (
    <div className="cine page-bg" style={{ "--bg-img": "url('/img/bg/bg-areas.jpg')" }}>
      <div className="page-head" style={{ "--ph-img": "url('/img/areas-header.jpg')", "--ph-pos": "center 30%" }}>
        <div className="container">
          <div className="breadcrumb"><Link to="/home">Home</Link> / Service Areas</div>
          <h1><ClipText text="Where we work" /></h1>
          <p>
            Four crews across Riyadh. Search your district, your postal code, or the first four
            letters of your National Address short code.
          </p>
        </div>
      </div>

      {/* Map and search side by side: the search column used to sit alone next
          to a much taller column of zone cards and left half the page empty. */}
      <section>
        <div className="container areas-top">
          <RiyadhMap onZone={pick} focus={focus} />

          <div className="areas-search">
            <div className="card">
              <h3>Are we in your area?</h3>
              <p style={{ color: "var(--muted)", fontSize: ".88rem", marginTop: 6 }}>
                Try “Al Narjis”, “12211”, or “RAOA”.
              </p>
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <input
                  className="areas-input"
                  placeholder="District, postal code or short code"
                  value={q}
                  onChange={(e) => { setQ(e.target.value); setResult(null); }}
                  onKeyDown={(e) => e.key === "Enter" && check()}
                />
                <button className="btn btn-primary" onClick={check}>Check</button>
              </div>

              {result && (
                <div className="quote-result" style={{ marginTop: 16 }}>
                  {result.ok ? (
                    <>
                      <span className="urgency normal">You're covered</span>
                      <p style={{ marginTop: 8 }}>
                        That's our <strong>{result.zone.zone}</strong> crew. Typical response:{" "}
                        <strong>{result.zone.response.toLowerCase()}</strong>.
                      </p>
                      <CtaButton className="is-sm" style={{ marginTop: 12 }}>See available slots</CtaButton>
                    </>
                  ) : (
                    <>
                      <span className="urgency high">Outside current zones</span>
                      <p style={{ marginTop: 8 }}>
                        We haven't reached that district yet. Call{" "}
                        <a href="tel:+966112002665">+966 11 200 2665</a>; we take edge-of-zone jobs
                        when the schedule allows.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Zones as a deck you flick through, instead of a tall stacked column. */}
      <section>
        <div className="container">
          <p className="cine-eyebrow">Coverage</p>
          <h2 className="cine-section-title" style={{ margin: "10px 0 6px" }}>
            <ClipText text="Four zones" />
          </h2>
          <p style={{ color: "var(--muted)", marginBottom: 10 }}>
            Drag the deck, use the arrows, or press a dot. Any card can jump the map to its zone.
          </p>
          <AreaCards onPick={setFocus} activeZone={result?.ok ? result.zone.zone : null} />
        </div>
      </section>

      {/* What the codes actually mean, which was never explained anywhere. */}
      <section className="section-tint">
        <div className="container">
          <p className="cine-eyebrow">How addresses work here</p>
          <h2 className="cine-section-title" style={{ margin: "10px 0 8px" }}>
            <ClipText text="District, postal, short code" />
          </h2>
          <p className="section-sub">
            Saudi Arabia does not use zip codes the way the US does. An address here has three
            parts, and they do different jobs.
          </p>

          <div className="grid grid-3">
            {ADDRESS_PARTS.map((p) => (
              <div key={p.term} className="card cine-spot addr-explain">
                <span className="addr-explain-icon"><Icon name={p.icon} size={18} /></span>
                <h3>{p.term}</h3>
                <code>{p.example}</code>
                <p>{p.what}</p>
              </div>
            ))}
          </div>

          <p style={{ color: "var(--muted)", fontSize: ".85rem", marginTop: 20 }}>
            You only need the district to book. The short code just saves the technician a phone
            call when he reaches your street.
          </p>
        </div>
      </section>
    </div>
  );
}
