import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PRODUCTS } from "../data";
import Icon from "../components/Icon";
import ClipText from "../components/ClipText";
import CtaButton from "../components/CtaButton";

// Cursor spotlight, written straight to CSS vars (no re-render).
const spot = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

const N = PRODUCTS.length;
const STEP = 360 / N; // one facet per unit

export default function Shop() {
  // `index` is allowed to run past either end — the modulo keeps the wheel
  // looping in both directions, so a unit you scroll past is always reachable again.
  const [index, setIndex] = useState(0);
  const wheelLock = useRef(0);
  const drag = useRef(null);

  const move = useCallback((delta) => setIndex((i) => i + delta), []);
  const active = ((index % N) + N) % N;
  const product = PRODUCTS[active];

  // Wheel / trackpad, throttled so one gesture advances one facet
  const onWheel = (e) => {
    const now = Date.now();
    if (now - wheelLock.current < 320) return;
    if (Math.abs(e.deltaY) < 12) return;
    wheelLock.current = now;
    move(e.deltaY > 0 ? 1 : -1);
  };

  // Drag / swipe
  const onDown = (e) => { drag.current = { y: e.touches?.[0]?.clientY ?? e.clientY }; };
  const onMove = (e) => {
    if (!drag.current) return;
    const y = e.touches?.[0]?.clientY ?? e.clientY;
    const dy = y - drag.current.y;
    if (Math.abs(dy) > 46) {
      move(dy < 0 ? 1 : -1);
      drag.current = { y };
    }
  };
  const onUp = () => { drag.current = null; };

  // Arrow keys
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
      if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move]);

  return (
    <div className="cine page-bg" style={{ "--bg-img": "url('/img/bg/bg-shop.jpg')" }}>
      <div className="page-head" style={{ "--ph-img": "url('/img/shop-units.jpg')" }}>
        <div className="container">
          <div className="breadcrumb"><Link to="/home">Home</Link> / Shop</div>
          <h1><ClipText text="Shop AC units" /></h1>
          <p>
            Every unit includes installation, removal of the old system and 0% instalments
            over 12 months.
          </p>
        </div>
      </div>

      <section>
        <div className="container">
          <div className="rolo-layout">
            {/* ── The wheel ── */}
            <div
              className="rolo-stage"
              onWheel={onWheel}
              onMouseDown={onDown}
              onMouseMove={onMove}
              onMouseUp={onUp}
              onMouseLeave={onUp}
              onTouchStart={onDown}
              onTouchMove={onMove}
              onTouchEnd={onUp}
              tabIndex={0}
              aria-label="AC units carousel"
            >
              <div className="rolo" style={{ transform: `rotateX(${index * STEP}deg)` }}>
                {PRODUCTS.map((p, i) => (
                  <div
                    key={p.id}
                    className={`rolo-face ${i === active ? "is-active" : ""}`}
                    style={{ transform: `rotateX(${-i * STEP}deg) translateZ(var(--rolo-z))` }}
                  >
                    <img src={p.image} alt={`${p.brand} ${p.model}`} />
                    <span className="rolo-tag">{p.tag}</span>
                  </div>
                ))}
              </div>

              <div className="rolo-hint">
                <button onClick={() => move(-1)} aria-label="Previous unit">
                  <Icon name="chevron" size={15} style={{ transform: "rotate(-90deg)" }} />
                </button>
                <span>{active + 1} / {N}</span>
                <button onClick={() => move(1)} aria-label="Next unit">
                  <Icon name="chevron" size={15} style={{ transform: "rotate(90deg)" }} />
                </button>
              </div>
            </div>

            {/* ── Detail for whichever unit is facing you ── */}
            <div className="rolo-detail cine-spot" onMouseMove={spot} key={product.id}>
              <p className="cine-eyebrow">{product.tag}</p>
              <h2 className="rolo-name">{product.brand}<br />{product.model}</h2>

              <div className="rolo-specs">
                <div><span>SEER</span><strong>{product.seer}</strong></div>
                <div><span>Capacity</span><strong>{product.tons} ton</strong></div>
                <div><span>In stock</span><strong>{product.stock}</strong></div>
              </div>

              <div className="rolo-price">SAR {product.price.toLocaleString()}</div>
              <p className="rolo-finance">
                or about SAR {Math.round(product.price / 48).toLocaleString()}/mo over 48 months
              </p>

              <Link
                to={`/book?product=${encodeURIComponent(`${product.brand} ${product.model}`)}`}
                className="btn btn-primary btn-lg"
                style={{ marginTop: 18 }}
              >
                Get it installed
              </Link>
              <p style={{ color: "var(--muted)", fontSize: ".82rem", marginTop: 14 }}>
                Scroll, drag or use the arrow keys. The wheel loops, so a unit you skip is
                always one turn away.
              </p>
            </div>
          </div>

          <div className="banner-cta" style={{ marginTop: 54 }}>
            <h2><ClipText text="Not sure which size you need?" /></h2>
            <p>Book a free on-site estimate. We run a proper load calculation, not a guess.</p>
            <Link to="/book" className="btn btn-lg" style={{ background: "#fff", color: "#111" }}>
              Book a free estimate
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
