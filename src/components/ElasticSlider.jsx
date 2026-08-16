import { useRef, useState } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from "framer-motion";

// Physics slider: drag past either end and the track stretches, squashes and
// springs back, and the end icon kicks. Adapted from the reference component,
// with our own icons and no Tailwind.

const MAX_OVERFLOW = 40;

const decay = (value, max) => {
  if (max === 0) return 0;
  const sigmoid = 2 * (1 / (1 + Math.exp(-(value / max))) - 0.5);
  return sigmoid * max;
};

export default function ElasticSlider({
  value,
  onChange,
  startingValue = 0,
  maxValue = 100,
  stepSize = 1,
  isStepped = true,
  leftIcon,
  rightIcon,
  format = (v) => Math.round(v),
  label,
}) {
  const track = useRef(null);
  const [region, setRegion] = useState("middle");
  const clientX = useMotionValue(0);
  const overflow = useMotionValue(0);
  const scale = useMotionValue(1);

  useMotionValueEvent(clientX, "change", (latest) => {
    const el = track.current;
    if (!el) return;
    const { left, right } = el.getBoundingClientRect();
    if (latest < left) {
      setRegion("left");
      overflow.jump(decay(left - latest, MAX_OVERFLOW));
    } else if (latest > right) {
      setRegion("right");
      overflow.jump(decay(latest - right, MAX_OVERFLOW));
    } else {
      setRegion("middle");
      overflow.jump(0);
    }
  });

  const setFromPointer = (e) => {
    const el = track.current;
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    let next = startingValue + ((e.clientX - left) / width) * (maxValue - startingValue);
    if (isStepped) next = Math.round(next / stepSize) * stepSize;
    next = Math.min(Math.max(next, startingValue), maxValue);
    onChange?.(next);
    clientX.jump(e.clientX);
  };

  const onMove = (e) => {
    if (e.buttons > 0) setFromPointer(e);
  };
  const onDown = (e) => {
    setFromPointer(e);
    e.currentTarget.setPointerCapture(e.pointerId);
    animate(scale, 1.08, { duration: 0.2, ease: "easeOut" });
  };
  const onUp = () => {
    setRegion("middle");
    animate(overflow, 0, { type: "spring", bounce: 0.5, stiffness: 200, damping: 20 });
    animate(scale, 1, { duration: 0.3, ease: "easeOut" });
  };

  const pct = ((value - startingValue) / (maxValue - startingValue)) * 100;

  const scaleX = useTransform(() => {
    const w = track.current?.getBoundingClientRect().width;
    return w ? 1 + overflow.get() / w : 1;
  });
  const scaleY = useTransform(overflow, [0, MAX_OVERFLOW], [1, 0.86]);
  const origin = useTransform(() => (region === "left" ? "right" : "left"));
  const leftX = useTransform(() => (region === "left" ? -overflow.get() / scale.get() : 0));
  const rightX = useTransform(() => (region === "right" ? overflow.get() / scale.get() : 0));

  return (
    <div className="eslider">
      {label && <p className="eslider-label">{label}</p>}
      <motion.div style={{ scale }} className="eslider-row">
        <motion.span
          className="eslider-icon"
          style={{ x: leftX }}
          animate={{ scale: region === "left" ? [1, 1.28, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          {leftIcon}
        </motion.span>

        <div
          ref={track}
          className="eslider-track"
          onPointerMove={onMove}
          onPointerDown={onDown}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          role="slider"
          tabIndex={0}
          aria-valuemin={startingValue}
          aria-valuemax={maxValue}
          aria-valuenow={value}
          aria-label={label}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") onChange?.(Math.max(startingValue, value - stepSize));
            if (e.key === "ArrowRight") onChange?.(Math.min(maxValue, value + stepSize));
          }}
        >
          <motion.div className="eslider-rail" style={{ scaleX, scaleY, transformOrigin: origin }}>
            <div className="eslider-fill" style={{ width: `${pct}%` }} />
          </motion.div>
        </div>

        <motion.span
          className="eslider-icon"
          style={{ x: rightX }}
          animate={{ scale: region === "right" ? [1, 1.28, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          {rightIcon}
        </motion.span>
      </motion.div>
      <motion.div className="eslider-value" style={{ opacity: useTransform(scale, [1, 1.08], [0.7, 1]) }}>
        {format(value)}
      </motion.div>
    </div>
  );
}
