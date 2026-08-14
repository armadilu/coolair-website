import { useEffect, useState } from "react";

// Loading screen: the hyper-speed character streaks left across a black stage,
// then the whole thing lifts away as a circular spotlight mask opening onto the
// homepage underneath.
//
// It plays on every full load of the site, but not on internal navigation,
// because the app does not remount for that. Click or press a key to cut
// straight to the reveal. Anyone who asked for reduced motion never sees it.

const HOLD = 2600; // streaking
const REVEAL = 1400; // spotlight opening

export default function Loader({ onDone }) {
  const [phase, setPhase] = useState("run");

  // Hold, then reveal. Skipping shortens the hold; the reveal always runs, so
  // the spotlight opens rather than the screen vanishing.
  useEffect(() => {
    if (phase !== "run") return;
    const t = setTimeout(() => setPhase("reveal"), HOLD);
    const skip = () => setPhase("reveal");
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    return () => {
      clearTimeout(t);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "reveal") return;
    const t = setTimeout(() => onDone?.(), REVEAL);
    return () => clearTimeout(t);
  }, [phase, onDone]);

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
