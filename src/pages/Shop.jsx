import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PRODUCTS } from "../data";
import Icon from "../components/Icon";
import ClipText from "../components/ClipText";
import CtaButton from "../components/CtaButton";

// Product coverflow.
//
// This was a vertical rolodex: small square facets rotating on X, most of them
// dimmed to 28% and tipped away from you. Two things made it read badly. The
// unit you were looking at was the size of a thumbnail, and the product photos
// run from 0.71 to 1.63 aspect, so a cover-fit square cropped half of some
// units away. Here the active card is large and square-on, the neighbours
// recede in Z, and every photo is contained rather than cropped.

const spot = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

const N = PRODUCTS.length;

export default function Shop() {
  // `index` runs past either end; the modulo keeps it looping both ways.
  const [index, setIndex] = useState(0);
  const wheelLock = useRef(0);
  const drag = useRef(null);
  const moved = useRef(false);

  const move = useCallback((d) => setIndex((i) => i + d), []);
  const active = ((index % N) + N) % N;
  const product = PRODUCTS[active];

  // Shortest signed distance, so the flow wraps instead of unwinding.
  const offsetOf = (i) => {
    let o = i - active;
    if (o > N / 2) o -= N;
    if (o < -N / 2) o += N;
    return o;
  };

  const onWheel = (e) => {
    const now = Date.now();
    if (now - wheelLock.current < 300) return;
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(d) < 12) return;
    wheelLock.current = now;
    move(d > 0 ? 1 : -1);
  };

  const onDown = (e) => {
    drag.current = { x: e.touches?.[0]?.clientX ?? e.clientX };
    moved.current = false;
  };
  const onMove = (e) => {
    if (!drag.current) return;
    const x = e.touches?.[0]?.clientX ?? e.clientX;
    const dx = x - drag.current.x;
    if (Math.abs(dx) > 55) {
      move(dx < 0 ? 1 : -1);
      drag.current = { x };
      moved.current = true;
    }
  };
  const onUp = () => { drag.current = null; };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); move(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); }
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
        <div className="container pflow-layout">
          <div
            className="pflow"
            onWheel={onWheel}
            onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
            onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
            tabIndex={0}
            aria-label="AC units"
          >
            <div className="pflow-stage">
              {PRODUCTS.map((p, i) => {
                const o = offsetOf(i);
                const abs = Math.abs(o);
                return (
                  <button
                    key={p.id}
                    type="button"
                    className={`pcard ${o === 0 ? "is-active" : ""}`}
                    style={{
                      transform: `translateX(${o * 52}%) translateZ(${-abs * 190}px) rotateY(${o * -26}deg)`,
                      opacity: abs > 2 ? 0 : 1 - abs * 0.3,
                      zIndex: N - abs,
                      pointerEvents: abs > 2 ? "none" : "auto",
                    }}
                    onClick={() => { if (!moved.current) move(o); }}
                    aria-label={`${p.brand} ${p.model}`}
                    aria-hidden={abs > 2}
                    tabIndex={o === 0 ? 0 : -1}
                  >
                    <span className="pcard-plinth" aria-hidden="true" />
                    <img src={p.image} alt="" loading="lazy" draggable={false} />
                    <span className="pcard-tag">{p.tag}</span>
                    <span className="pcard-foot">
                      <b>{p.brand} {p.model}</b>
                      <i>SEER {p.seer} · {p.tons} ton</i>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pflow-controls">
              <button onClick={() => move(-1)} aria-label="Previous unit">
                <Icon name="chevron-left" size={17} />
              </button>
              <div className="pflow-dots">
                {PRODUCTS.map((p, i) => (
                  <button
                    key={p.id}
                    className={i === active ? "on" : ""}
                    onClick={() => move(offsetOf(i))}
                    aria-label={`${p.brand} ${p.model}`}
                  />
                ))}
              </div>
              <button onClick={() => move(1)} aria-label="Next unit">
                <Icon name="chevron-right" size={17} />
              </button>
            </div>
          </div>

          {/* Detail for whichever unit is facing you. */}
          <aside className="pdetail cine-spot" onMouseMove={spot}>
            <div className="pdetail-swap" key={product.id}>
              <p className="cine-eyebrow">{product.tag}</p>
              <h2 className="pdetail-name">{product.brand}<br />{product.model}</h2>

              <div className="pdetail-specs">
                <div><span>SEER</span><strong>{product.seer}</strong></div>
                <div><span>Capacity</span><strong>{product.tons} ton</strong></div>
                <div><span>In stock</span><strong>{product.stock}</strong></div>
              </div>

              <div className="pdetail-price">SAR {product.price.toLocaleString()}</div>
              <p className="pdetail-finance">
                or about SAR {Math.round(product.price / 48).toLocaleString()}/mo over 48 months
              </p>

              <CtaButton
                to={`/book?product=${encodeURIComponent(`${product.brand} ${product.model}`)}`}
                size="lg"
                style={{ marginTop: 18 }}
              >
                Get it installed
              </CtaButton>
            </div>

            <p className="pdetail-hint">
              Drag the row, scroll, tap a unit, or use the left and right arrow keys. It loops,
              so nothing you skip is more than a few steps away.
            </p>
          </aside>
        </div>

        <div className="container">
          <div className="banner-cta" style={{ marginTop: 54 }}>
            <h2><ClipText text="Not sure which size you need?" /></h2>
            <p>Book a free on-site estimate. We run a proper load calculation, not a guess.</p>
            <CtaButton size="lg">Book a free estimate</CtaButton>
          </div>
        </div>
      </section>
    </div>
  );
}
