import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// macOS-dock magnification for the navbar. Each item measures its own distance
// from the pointer and springs toward `magnification`, so the whole row swells
// around the cursor instead of one item popping.
//
// Adapted from the reference component: our items are labelled links, not
// icon-only buttons, so the magnified value drives a scale and a lift rather
// than a width, which keeps the row from reflowing and shoving its neighbours
// around as you sweep across it.

export function DockItem({ mouseX, children, distance = 150, magnification = 1.22, className = "" }) {
  const ref = useRef(null);

  const fromCentre = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r || x === Infinity) return distance + 1;
    return x - (r.x + r.width / 2);
  });

  const target = useTransform(fromCentre, [-distance, 0, distance], [1, magnification, 1], { clamp: true });
  const scale = useSpring(target, { mass: 0.1, stiffness: 170, damping: 14 });
  const lift = useTransform(scale, [1, magnification], [0, -4]);

  return (
    <motion.div ref={ref} style={{ scale, y: lift }} className={`dock-item ${className}`}>
      {children}
    </motion.div>
  );
}

export default function NavDock({ children, className = "" }) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      className={`nav-dock ${className}`}
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {typeof children === "function" ? children(mouseX) : children}
    </div>
  );
}
