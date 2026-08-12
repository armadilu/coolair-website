import { Link } from "react-router-dom";
import ReviewsMarquee from "../components/ReviewsMarquee";
import ClipText from "../components/ClipText";

export default function Reviews() {
  return (
    <div className="cine page-bg" style={{ "--bg-img": "url('/img/bg/bg-reviews.jpg')" }}>
      <div className="page-head" style={{ "--ph-img": "url('/img/page-reviews.jpg')" }}>
        <div className="container">
          <div className="breadcrumb"><Link to="/home">Home</Link> / Reviews</div>
          <h1><ClipText text="4.9 on Google" /></h1>
          <p>
            Every review below was requested automatically after a completed job —
            nothing cherry-picked, nothing stale. Click any card to read it in full.
          </p>
        </div>
      </div>

      <section>
        {/* Rails only. A grid underneath was the same ten reviews twice. */}
        <ReviewsMarquee heading={false} />
      </section>

      <section>
        <div className="container">
          <div className="banner-cta">
            <h2>Join them</h2>
            <p>Same-day slots are open — see for yourself why the rating holds.</p>
            <Link to="/book" className="btn btn-lg" style={{ background: "#fff", color: "#111" }}>
              Book now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
