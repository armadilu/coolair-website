import { useMemo } from "react";

// Multi-layer backdrop-filter blur that fades out along one edge.
// A single CSS gradient can't do this — each layer blurs a little harder and is
// masked to a narrow band, so stacking them reads as a continuous falloff.
// Port of the reference component, minus the Tailwind/TS dependencies.

const PRESETS = {
  subtle: { height: "4rem", strength: 1, opacity: 0.8, divCount: 3 },
  intense: { height: "10rem", strength: 4, divCount: 8, exponential: true },
  smooth: { height: "8rem", curve: "bezier", divCount: 10 },
  sharp: { height: "5rem", curve: "linear", divCount: 4 },
};

const CURVES = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  "ease-in": (p) => p * p,
  "ease-out": (p) => 1 - Math.pow(1 - p, 2),
  "ease-in-out": (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
};

const DIRECTIONS = { top: "to top", bottom: "to bottom", left: "to left", right: "to right" };

export default function GradualBlur({
  position = "bottom",
  strength = 2,
  height = "6rem",
  width,
  divCount = 5,
  exponential = false,
  zIndex = 10,
  opacity = 1,
  curve = "linear",
  preset,
  className = "",
  style,
  children,
}) {
  const cfg = { position, strength, height, width, divCount, exponential, zIndex, opacity, curve, ...(preset ? PRESETS[preset] : {}) };

  const layers = useMemo(() => {
    const out = [];
    const increment = 100 / cfg.divCount;
    const curveFn = CURVES[cfg.curve] || CURVES.linear;
    const direction = DIRECTIONS[cfg.position] || "to bottom";

    for (let i = 1; i <= cfg.divCount; i++) {
      const progress = curveFn(i / cfg.divCount);
      const blur = cfg.exponential
        ? Math.pow(2, progress * 4) * 0.0625 * cfg.strength
        : 0.0625 * (progress * cfg.divCount + 1) * cfg.strength;

      const p1 = Math.round((increment * i - increment) * 10) / 10;
      const p2 = Math.round(increment * i * 10) / 10;
      const p3 = Math.round((increment * i + increment) * 10) / 10;
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

      let stops = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) stops += `, black ${p3}%`;
      if (p4 <= 100) stops += `, transparent ${p4}%`;

      const mask = `linear-gradient(${direction}, ${stops})`;
      out.push(
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            maskImage: mask,
            WebkitMaskImage: mask,
            backdropFilter: `blur(${blur.toFixed(3)}rem)`,
            WebkitBackdropFilter: `blur(${blur.toFixed(3)}rem)`,
            opacity: cfg.opacity,
          }}
        />
      );
    }
    return out;
  }, [cfg.divCount, cfg.curve, cfg.position, cfg.exponential, cfg.strength, cfg.opacity]);

  const vertical = cfg.position === "top" || cfg.position === "bottom";
  const box = {
    position: "absolute",
    pointerEvents: "none",
    zIndex: cfg.zIndex,
    [cfg.position]: 0,
    ...(vertical
      ? { height: cfg.height, width: cfg.width || "100%", left: 0, right: 0 }
      : { width: cfg.width || cfg.height, height: "100%", top: 0, bottom: 0 }),
    ...style,
  };

  return (
    <div className={`gradual-blur ${className}`} style={box} aria-hidden="true">
      <div style={{ position: "relative", width: "100%", height: "100%" }}>{layers}</div>
      {children}
    </div>
  );
}
