import { Link } from "react-router-dom";

// Booking CTA: slides in blurred, tracks a glow to the cursor, grows an
// underline and shifts its arrow on hover. The glow is written to CSS vars on
// the node rather than held in state, so sweeping across it does not re-render.

const track = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--gx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--gy", `${e.clientY - r.top}px`);
};

export default function CtaButton({ to = "/book", children = "Book now", className = "", size, ...rest }) {
  return (
    <Link
      to={to}
      onMouseMove={track}
      className={`cta-glow ${size === "lg" ? "is-lg" : ""} ${className}`}
      {...rest}
    >
      <span>{children}</span>
      <i className="cta-arrow" aria-hidden="true">→</i>
    </Link>
  );
}
