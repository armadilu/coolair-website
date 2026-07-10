import { useEffect, useState } from "react";
import { REVIEWS } from "../data";

export default function ReviewsCarousel() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % REVIEWS.length), 6000);
    return () => clearInterval(t);
  }, []);

  const r = REVIEWS[i];
  return (
    <div className="carousel">
      <div className="card review-card">
        <div className="stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
        <p className="review-text">“{r.text}”</p>
        <div className="review-meta">{r.name} · Google review · {r.date}</div>
      </div>
      <div className="carousel-nav">
        <button onClick={() => setI((i - 1 + REVIEWS.length) % REVIEWS.length)} aria-label="Previous">‹</button>
        <button onClick={() => setI((i + 1) % REVIEWS.length)} aria-label="Next">›</button>
      </div>
    </div>
  );
}
