import { useEffect, useRef, useState } from "react";

// Exploded-view assembly of a split AC unit, for the auth page.
//
// The reference brief drives this from scroll, but the auth page is one
// viewport with a form in it and never scrolls, so the mechanic is bound to
// time and pointer instead: the layers fly in from their scattered positions
// and lock together on load, then pull apart again on hover or focus, with
// each part labelled. Same idea, same payoff, no scrollbar required.
//
// Every part is drawn in CSS, so there is no image to load and nothing to
// crop. Under reduced motion the parts are simply drawn assembled.

const PARTS = [
  { key: "chassis", label: "Chassis", x: -180, y: 120, z: -260, r: -24, out: { x: 0, y: 92, z: -120 } },
  { key: "coil", label: "Condenser coil", x: 220, y: -140, z: -180, r: 30, out: { x: 0, y: 46, z: -60 } },
  { key: "fan", label: "Inverter fan", x: -240, y: -170, z: 160, r: -34, out: { x: 0, y: 0, z: 0 } },
  { key: "filter", label: "HEPA filter", x: 260, y: 150, z: 220, r: 26, out: { x: 0, y: -46, z: 60 } },
  { key: "grille", label: "Front grille", x: -60, y: -240, z: 300, r: 16, out: { x: 0, y: -92, z: 120 } },
];

export default function ExplodedUnit() {
  const [phase, setPhase] = useState("scattered"); // scattered → locked
  const [apart, setApart] = useState(false);
  const host = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("locked");
      return;
    }
    const t = setTimeout(() => setPhase("locked"), 120);
    return () => clearTimeout(t);
  }, []);

  // Parallax: the stack tilts a little toward the pointer, written to CSS vars.
  const tilt = (e) => {
    const el = host.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--tx", `${((e.clientX - r.left) / r.width - 0.5) * 16}deg`);
    el.style.setProperty("--ty", `${((e.clientY - r.top) / r.height - 0.5) * -12}deg`);
  };
  const rest = () => {
    host.current?.style.setProperty("--tx", "0deg");
    host.current?.style.setProperty("--ty", "0deg");
  };

  return (
    <div
      className={`xu ${phase === "locked" ? "is-locked" : ""} ${apart ? "is-apart" : ""}`}
      ref={host}
      onMouseMove={tilt}
      onMouseLeave={() => { rest(); setApart(false); }}
      onMouseEnter={() => setApart(true)}
      onFocus={() => setApart(true)}
      onBlur={() => setApart(false)}
      aria-hidden="true"
    >
      <div className="xu-stack">
        {PARTS.map((p, i) => (
          <div
            key={p.key}
            className={`xu-part xu-${p.key}`}
            style={{
              "--sx": `${p.x}px`, "--sy": `${p.y}px`, "--sz": `${p.z}px`, "--sr": `${p.r}deg`,
              "--ox": `${p.out.x}px`, "--oy": `${p.out.y}px`, "--oz": `${p.out.z}px`,
              transitionDelay: `${i * 90}ms`,
            }}
          >
            <span className="xu-face" />
            <span className="xu-label">{p.label}</span>
          </div>
        ))}
      </div>

      <div className="xu-caption">
        <span className="cine-live"><i />Assembled</span>
        <p>Five parts. One system. We service every one of them.</p>
      </div>
    </div>
  );
}
