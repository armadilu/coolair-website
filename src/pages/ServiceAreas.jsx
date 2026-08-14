import { useState } from "react";
import { Link } from "react-router-dom";
import RiyadhMap from "../components/RiyadhMap";
import ClipText from "../components/ClipText";
import Icon from "../components/Icon";
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

export default function ServiceAreas() {
  const [q, setQ] = useState("");
  const [result, setResult] = useState(null);

  const check = () => {
    const zone = findZone(q);
    setResult(zone ? { ok: true, zone } : { ok: false });
  };

  return (
    <div className="cine page-bg" style={{ "--bg-img": "url('/img/bg/bg-areas.jpg')" }}>
      <div className="page-head" style={{ "--ph-img": "url('/img/page-areas.jpg')" }}>
        <div className="container">
          <div className="breadcrumb"><Link to="/home">Home</Link> / Service Areas</div>
          <h1><ClipText text="Where we work" /></h1>
          <p>
            Four crews across Riyadh. Search your district, your postal code, or the first four
            letters of your National Address short code.
          </p>
        </div>
      </div>

      <section>
        <div className="container">
          <RiyadhMap onZone={(zone) => setResult({ ok: true, zone })} />
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container grid grid-2" style={{ alignItems: "start" }}>
          <div>
            <div className="card" style={{ marginBottom: 22 }}>
              <h3>Are we in your area?</h3>
              <p style={{ color: "var(--muted)", fontSize: ".88rem", marginTop: 6 }}>
                Try “Al Narjis”, “12211”, or “RAOA”.
              </p>
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <input
                  style={{
                    flex: 1, padding: "12px 14px", borderRadius: 10, fontSize: "1rem",
                    background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.14)", color: "#fff",
                  }}
                  placeholder="District, postal code or short address"
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
                      <Link to="/book" className="btn btn-primary btn-sm" style={{ marginTop: 12, display: "inline-block" }}>
                        See available slots
                      </Link>
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

            <div className="card">
              <h3>What we need from you</h3>
              <ul className="checklist" style={{ marginTop: 10 }}>
                <li>Your district name, or a pin dropped on the map above</li>
                <li>Your National Address short code if you have it (4 letters + 4 digits)</li>
                <li>The building number and floor, so the technician isn't circling the block</li>
              </ul>
              <p style={{ color: "var(--muted)", fontSize: ".84rem", marginTop: 12 }}>
                A short code such as <strong style={{ color: "#fff" }}>RAOA2929</strong> resolves to
                one exact building. If you don't know yours, the district plus a map pin is plenty.
              </p>
            </div>
          </div>

          <div>
            {SERVICE_AREAS.map((a) => (
              <div key={a.zone} className="card cine-spot" style={{ marginBottom: 14 }}>
                <h3 style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  {a.zone} <span className="seer-chip">{a.response}</span>
                </h3>
                <p style={{ color: "var(--muted)", fontSize: ".9rem", marginTop: 4 }} dir="rtl">
                  {a.arabic}
                </p>

                <div className="addr-grid">
                  {a.districts.map((d) => (
                    <span key={d} className="addr-chip">
                      <Icon name="pin" size={11} style={{ color: "var(--accent-soft)" }} />
                      <b>{d}</b>
                    </span>
                  ))}
                </div>

                <div className="addr-grid">
                  <span className="addr-chip"><i>Short code</i><b>{a.shortPrefix}····</b></span>
                  {a.postal.map((p) => (
                    <span key={p} className="addr-chip"><i>Postal</i><b>{p}</b></span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
