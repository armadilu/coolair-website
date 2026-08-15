import { Link } from "react-router-dom";
import ReviewsMarquee from "../components/ReviewsMarquee";
import ClipText from "../components/ClipText";

export default function Reviews() {
  return (
    <div className="cine page-bg" style={{ "--bg-img": "url('/img/bg/bg-reviews.jpg')" }}>
      <div className="page-head" style={{ "--ph-img": "url('/img/reviews-header.png')" }}>
        <div className="container">
          <div className="breadcrumb"><Link to="/home">Home</Link> / Reviews</div>
          <h1><ClipText text="4.9 on Google" /></h1>
          <p>
            Every review below was requested automatically after a completed job. Nothing
            cherry-picked, nothing stale. Click any card to read it in full.
          </p>
        </div>
      </div>

      <section>
        {/* Rails only. A grid underneath was the same ten reviews twice. */}
        <ReviewsMarquee heading={false} />
      </section>

    </div>
  );
}
