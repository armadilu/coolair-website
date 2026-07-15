import { Link } from "react-router-dom";
import { REVIEWS } from "../data";

export default function Reviews() {
  return (
    <div className="page-bg" style={{ "--bg-img": "url('/img/bg/bg-reviews.jpg')" }}>
      <div className="page-head" style={{ "--ph-img": "url('/img/page-reviews.jpg')" }}>
        <div className="container">
          <div className="breadcrumb"><Link to="/home">Home</Link> / Reviews</div>
          <h1>4.9 on Google — 1,200+ reviews</h1>
          <p>
            Every review below was requested automatically after a completed job —
            nothing cherry-picked, nothing stale.
          </p>
        </div>
      </div>

      <section>
        <div className="container">
          <div className="grid grid-2">
            {REVIEWS.map((r) => (
              <div key={r.name + r.date} className="card hoverable">
                <div className="stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                <p style={{ color: "var(--ink)", fontStyle: "italic" }}>“{r.text}”</p>
                <p className="review-meta" style={{ marginTop: 12 }}>{r.name} · Google · {r.date}</p>
              </div>
            ))}
          </div>
          <div className="banner-cta" style={{ marginTop: 44 }}>
            <h2>Join them</h2>
            <p>Same-day slots are open — see for yourself why the rating holds.</p>
            <Link to="/book" className="btn btn-lg" style={{ background: "#fff", color: "var(--blue-700)" }}>
              Book now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
