import { useEffect, useRef } from "react";

// A copper glow that follows the cursor across the whole page, not just inside
// cards. It blends with `screen`, so it lights whatever is underneath —
// background photos included — rather than sitting on top as a flat disc.
//
// Position is eased toward the pointer inside rAF and written to CSS vars on
// the node, so this never re-renders React and never triggers layout.
// Pointer-only: a touch screen has no hover, and reduced-motion opts out.

export default function CursorGlow() {
  const el = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || still) return;

    const node = el.current;
    if (!node) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let frame = 0;
    let awake = false;

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!awake) {
        awake = true;
        node.style.opacity = "1";
      }
    };
    const onLeave = () => {
      awake = false;
      node.style.opacity = "0";
    };

    const draw = () => {
      // Trailing slightly behind the cursor reads as light, not as a sticker.
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      node.style.setProperty("--cx", `${x}px`);
      node.style.setProperty("--cy", `${y}px`);
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div className="cursor-glow" ref={el} aria-hidden="true" />;
}
