import { Link } from "react-router-dom";
import { PRODUCTS } from "../data";

// Browse-and-quote catalog (blueprint §5) — full Stripe checkout can bolt on later.

export default function Shop() {
  return (
    <>
      <div className="page-head">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> / Shop</div>
          <h1>🛒 Shop AC Units</h1>
          <p>
            Every unit bundles professional installation, haul-away of your old system,
            and 0% APR financing for 12 months.
          </p>
        </div>
      </div>

      <section>
        <div className="container">
          <div className="grid grid-3">
            {PRODUCTS.map((p) => (
              <div key={p.id} className="card hoverable product-card">
                <span className="product-tag">{p.tag}</span>
                <div className="product-img">
                  <img
                    src={p.image}
                    alt={`${p.brand} ${p.model} outdoor unit`}
                    onError={(e) => { e.target.style.display = "none"; e.target.parentNode.textContent = "❄️"; }}
                  />
                </div>
                <h3>{p.brand} {p.model}</h3>
                <div>
                  <span className="seer-chip">SEER {p.seer}</span>{" "}
                  <span className="seer-chip" style={{ background: "var(--blue-100)", color: "var(--blue-700)" }}>
                    {p.tons} ton
                  </span>
                </div>
                <div className="price-line">${p.price.toLocaleString()}</div>
                <p className="finance-line">
                  or ~${Math.round(p.price / 48)}/mo with financing · {p.stock} in stock
                </p>
                <Link
                  to={`/book?product=${encodeURIComponent(`${p.brand} ${p.model}`)}`}
                  className="btn btn-primary"
                  style={{ marginTop: "auto", textAlign: "center" }}
                >
                  Get installed →
                </Link>
              </div>
            ))}
          </div>
          <div className="banner-cta" style={{ marginTop: 44 }}>
            <h2>Not sure which size you need?</h2>
            <p>Book a free in-home estimate — we do a proper load calculation, not a guess.</p>
            <Link to="/book" className="btn btn-lg" style={{ background: "#fff", color: "var(--blue-700)" }}>
              Book free estimate
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
