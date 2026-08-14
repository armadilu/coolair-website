import { useEffect, useState } from "react";

// First-visit loading screen: the hyper-speed character streaks left across a
// black stage, then the whole thing lifts away as a circular spotlight mask
// opening onto the homepage underneath.
//
// It runs once per browser session, not once per page view — sitting through
// the same intro on every navigation is a tax, not a brand moment. Anyone who
// asked for reduced motion skips it entirely.

const HOLD = 2600; // streaking
const REVEAL = 1400; // spotlight opening

export default function Loader({ onDone }) {
  const [phase, setPhase] = useState("run");

  useEffect(() => {
    const a = setTimeout(() => setPhase("reveal"), HOLD);
    const b = setTimeout(() => onDone?.(), HOLD + REVEAL);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [onDone]);

  return (
    <div className={`cl-screen ${phase === "reveal" ? "is-revealing" : ""}`} role="status" aria-label="Loading CoolAir">
      <div className="cl-fazers" aria-hidden="true">
        <span /><span /><span /><span />
      </div>

      <div className="cl-stage" aria-hidden="true">
        <div className="cl-loader">
          <span>
            <span /><span /><span /><span />
          </span>
          <div className="cl-base">
            <span />
            <div className="cl-face" />
          </div>
        </div>
      </div>

      <div className="cl-copy">
        <div className="cl-mark">
          <span className="cl-logo">C</span>
          <span>CoolAir Co.</span>
        </div>
        <h1>Cooling Riyadh</h1>
        <p>Same-day technicians · Instant pricing</p>
        <div className="cl-bar"><i /></div>
      </div>
    </div>
  );
}
