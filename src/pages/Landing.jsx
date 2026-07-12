import { Link } from "react-router-dom";

// Marketing splash (design 1b) — loads first at "/", CTAs into the homepage at /home.

export default function Landing() {
  return (
    <div className="landing">
      <div className="landing-orb landing-orb1" />
      <div className="landing-orb landing-orb2" />
      <i className="landing-line" style={{ top: 150, right: 80, width: 120, animationDuration: "7s" }} />
      <i className="landing-line" style={{ top: 210, right: 200, width: 90, animationDuration: "9s", animationDelay: "2s" }} />
      <i className="landing-line" style={{ top: 110, right: 280, width: 70, animationDuration: "11s", animationDelay: "4s" }} />

      <div className="landing-inner container">
        <div className="landing-logo">
          <span className="logo-mark">C</span>
          <span className="logo-word">CoolAir Co.</span>
        </div>

        <div className="landing-copy">
          <div className="landing-kicker">Home cooling, reconsidered</div>
          <h1 className="landing-h1">
            Comfort that<br />arrives the<br />same day.
          </h1>
          <p className="landing-lead">
            Instant quotes, real time slots, upfront pricing. The calm way to fix,
            replace, and maintain your AC.
          </p>
          <div className="landing-ctas">
            <Link to="/home" className="btn btn-primary btn-lg">Enter CoolAir&nbsp;&nbsp;→</Link>
            <Link to="/home" className="btn btn-outline btn-lg landing-glassbtn">Get an instant quote</Link>
          </div>
        </div>

        <div className="landing-thermo">
          <div className="landing-thermo-top">
            <span className="landing-thermo-label">Living room</span>
            <span className="landing-pulse" />
          </div>
          <div className="landing-thermo-temp">72°<span>F</span></div>
          <div className="landing-thermo-sub">Cooling to 70° · ETA 18 min</div>
        </div>
      </div>

      <div className="landing-strip">
        <div className="container landing-strip-inner">
          <div className="landing-strip-badges">
            <span>✓ Licensed &amp; insured</span>
            <span>★ 4.9 · 1,200+ reviews</span>
            <span>Same-day in most zips</span>
          </div>
          <Link to="/home" className="landing-strip-enter">Enter →</Link>
        </div>
      </div>
    </div>
  );
}
