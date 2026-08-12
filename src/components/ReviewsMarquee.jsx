import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import GradualBlur from "./GradualBlur";
import { REVIEWS } from "../data";

// Two rails of review cards drifting in opposite directions, faded at both
// edges with a mask (a mask works over any background — a gradient overlay
// would have to be colour-matched to whatever sits behind it) and paused on
// hover. Each rail renders its cards twice so a -50% translate loops with no
// visible seam; the duplicate is aria-hidden so screen readers hear each
// review once.
//
// Under prefers-reduced-motion the rails become a plain grid. A frozen
// marquee is half a component; a list is a whole one.

const AVATAR_TINTS = ["#C4502E", "#E2643A", "#F0A03F", "#8A5A3A", "#B5643C"];

const initials = (name) =>
  name
    .replace(/[^\p{L} ]/gu, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

const tintFor = (name) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_TINTS[h % AVATAR_TINTS.length];
};

function Stars({ n }) {
  return (
    <div className="rev-stars" aria-label={`${n} out of 5`}>
      {Array.from({ length: n }).map((_, i) => (
        <Icon key={i} name="star" size={12} />
      ))}
    </div>
  );
}

function Avatar({ name, size = 38 }) {
  return (
    <span
      className="rev-avatar"
      style={{ background: tintFor(name), width: size, height: size, fontSize: size * 0.36 }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}

function Card({ review, onOpen }) {
  return (
    <button type="button" className="rev-card cine-spot" onClick={() => onOpen(review)}>
      <Stars n={review.rating} />
      <p className="rev-text">{review.text}</p>
      <span className="rev-foot">
        <Avatar name={review.name} />
        <span>
          <strong>{review.name}</strong>
          <em>
            {review.service} · {review.area}
          </em>
        </span>
      </span>
    </button>
  );
}

function ReviewModal({ review, onClose }) {
  const panel = useRef(null);

  useEffect(() => {
    if (!review) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [review, onClose]);

  if (!review) return null;

  return (
    <div className="rev-scrim" onClick={onClose} role="presentation">
      <div
        className="rev-modal"
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`Review by ${review.name}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="rev-close" onClick={onClose} aria-label="Close review">
          <Icon name="x" size={16} />
        </button>

        <div className="rev-modal-head">
          <Avatar name={review.name} size={54} />
          <div>
            <h3>{review.name}</h3>
            <p>
              {review.service} · {review.area} · {review.date}
            </p>
            <Stars n={review.rating} />
          </div>
        </div>

        <div className="rev-modal-body">
          <div className="rev-modal-scroll">
            <p className="rev-quote">“{review.text}”</p>
            <p className="rev-note">
              Verified after a completed job. CoolAir requests a review automatically once the
              technician closes the ticket — we don't choose who gets asked.
            </p>
          </div>
          <GradualBlur position="bottom" height="72px" strength={2} divCount={6} curve="ease-out" exponential />
        </div>

        <div className="rev-modal-foot">
          <span>Google review · {review.date}</span>
          <a href="/book" className="btn btn-primary">
            Book the same service
          </a>
        </div>
      </div>
    </div>
  );
}

function Rail({ items, reverse, onOpen, speed }) {
  return (
    <div className="rev-rail">
      <div className="rev-track" style={{ animationDuration: `${speed}s`, animationDirection: reverse ? "reverse" : "normal" }}>
        {[0, 1].map((copy) => (
          <div className="rev-set" key={copy} aria-hidden={copy === 1 || undefined}>
            {items.map((r) => (
              <Card key={`${copy}-${r.name}-${r.date}`} review={r} onOpen={onOpen} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReviewsMarquee({ heading = true, grid = false }) {
  const [open, setOpen] = useState(null);
  const half = Math.ceil(REVIEWS.length / 2);
  const rowA = REVIEWS.slice(0, half);
  const rowB = REVIEWS.slice(half);

  return (
    <div className="rev-marquee">
      {heading && (
        <div className="container">
          <p className="cine-eyebrow">Reviews</p>
          <h2 className="cine-section-title" style={{ margin: "10px 0 6px" }}>
            4.9 average
          </h2>
          <p style={{ color: "var(--muted)", marginBottom: 28 }}>
            1,200+ Google reviews across Riyadh. Tap any card to read the whole thing.
          </p>
        </div>
      )}

      <Rail items={rowA} onOpen={setOpen} speed={52} />
      <Rail items={rowB} onOpen={setOpen} speed={64} reverse />

      {/* Reduced motion gets the same reviews as a static, readable grid.
          `grid` forces that grid on for everyone — the Reviews page keeps its
          hoverable cards under the rails. */}
      <div className={`rev-static container ${grid ? "is-shown" : ""}`}>
        {REVIEWS.map((r) => (
          <Card key={`static-${r.name}-${r.date}`} review={r} onOpen={setOpen} />
        ))}
      </div>

      <ReviewModal review={open} onClose={() => setOpen(null)} />
    </div>
  );
}
