import { useState } from "react";
import { Link } from "react-router-dom";
import { SERVICE_AREAS } from "../data";

export default function ServiceAreas() {
  const [zip, setZip] = useState("");
  const [result, setResult] = useState(null);

  const check = () => {
    const zone = SERVICE_AREAS.find((a) => a.zips.includes(zip.trim()));
    setResult(zone ? { ok: true, zone } : { ok: false });
  };

  return (
    <div className="page-bg" style={{ "--bg-img": "url('/img/bg/bg-areas.jpg')" }}>
      <div className="page-head" style={{ "--ph-img": "url('/img/page-areas.jpg')" }}>
        <div className="container">
          <div className="breadcrumb"><Link to="/home">Home</Link> / Service Areas</div>
          <h1>Where we work</h1>
          <p>Four zones across the metro — same-day service in most of them.</p>
        </div>
      </div>

      <section>
        <div className="container grid grid-2" style={{ alignItems: "start" }}>
          <div>
            <div className="card" style={{ marginBottom: 22 }}>
              <h3>Check your zip code</h3>
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <input
                  style={{ flex: 1, padding: "12px 14px", border: "1.5px solid var(--line)", borderRadius: 10, fontSize: "1rem" }}
                  placeholder="e.g. 75002"
                  value={zip}
                  maxLength={5}
                  onChange={(e) => { setZip(e.target.value.replace(/\D/g, "")); setResult(null); }}
                  onKeyDown={(e) => e.key === "Enter" && check()}
                />
                <button className="btn btn-primary" onClick={check}>Check</button>
              </div>
              {result && (
                <div className="quote-result" style={{ marginTop: 16 }}>
                  {result.ok ? (
                    <>
                      <span className="urgency normal">✓ You're covered!</span>
                      <p style={{ marginTop: 8 }}>
                        Zip <strong>{zip}</strong> is in our <strong>{result.zone.zone}</strong> zone —
                        typical response: <strong>{result.zone.response.toLowerCase()}</strong>.
                      </p>
                      <Link to="/book" className="btn btn-primary btn-sm" style={{ marginTop: 12, display: "inline-block" }}>
                        Book now →
                      </Link>
                    </>
                  ) : (
                    <>
                      <span className="urgency high">Outside current zones</span>
                      <p style={{ marginTop: 8 }}>
                        We're not in {zip || "that zip"} yet — but call <a href="tel:5550102665">(555) 010-COOL</a>;
                        we take edge-of-zone jobs when the schedule allows.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
            {SERVICE_AREAS.map((a) => (
              <div key={a.zone} className="card" style={{ marginBottom: 14 }}>
                <h3>{a.zone} <span className="seer-chip">{a.response}</span></h3>
                <div style={{ marginTop: 8 }}>
                  {a.zips.map((z) => <span key={z} className="zone-pill">{z}</span>)}
                </div>
              </div>
            ))}
          </div>
          <div className="map-frame" style={{ position: "sticky", top: 90 }}>
            <img src="/img/map-metro.jpg" alt="CoolAir coverage map — 4 zones across the metro" />
            <span className="map-caption">Coverage: 4 zones · 16 zip codes</span>
          </div>
        </div>
      </section>
    </div>
  );
}
