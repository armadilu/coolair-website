import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";

// Scroll-pinned horizontal gallery.
//
// The section is taller than the viewport, a sticky child holds it in place,
// and vertical scroll is mapped onto translateX. Panels have fixed widths in
// CSS so the measurement is right before any image loads — the usual reason a
// pinned rail computes the wrong distance on first paint.
//
// RATIO is why it doesn't feel like wading: the rail travels its full width
// over only RATIO of that in vertical scroll, so one wheel notch moves it
// noticeably. At 1:1 it read as "stuck". Arrows and drag are there too, so the
// rail is never dependent on the wheel alone.
//
// No GSAP: measurement is a ResizeObserver, the tween is one transform written
// inside rAF. Below 900px, and under prefers-reduced-motion, pinning is off
// entirely and the rail is an ordinary swipeable row.

const RATIO = 0.55;

const spot = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

export default function HorizontalGallery({ panels }) {
  const outer = useRef(null);
  const track = useRef(null);
  const bar = useRef(null);
  const drag = useRef(null);
  const moved = useRef(false);
  const [distance, setDistance] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 900px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPinned(wide.matches && !still.matches);
    sync();
    wide.addEventListener("change", sync);
    still.addEventListener("change", sync);
    return () => {
      wide.removeEventListener("change", sync);
      still.removeEventListener("change", sync);
    };
  }, []);

  const measure = useCallback(() => {
    const t = track.current;
    if (!t || !pinned) return setDistance(0);
    setDistance(Math.max(0, t.scrollWidth - t.clientWidth));
  }, [pinned]);

  useLayoutEffect(() => {
    measure();
    const id = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(id);
  }, [measure, panels.length]);

  useEffect(() => {
    if (!track.current) return;
    const ro = new ResizeObserver(measure);
    ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const active = pinned && distance > 0;
  const pinLength = active ? Math.round(distance * RATIO) : 0;

  useEffect(() => {
    const t = track.current;
    const o = outer.current;
    if (!t || !o) return;

    if (!active) {
      t.style.transform = "";
      return;
    }

    let frame = 0;
    const draw = () => {
      frame = 0;
      const total = o.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const p = Math.min(Math.max(-o.getBoundingClientRect().top, 0), total) / total;
      t.style.transform = `translate3d(${-p * distance}px, 0, 0)`;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      t.style.transform = "";
    };
  }, [active, distance]);

  // Our own tween instead of scrollBy({behavior:"smooth"}): a programmatic
  // smooth scroll *upward* lands one pixel from where it started on this page,
  // while downward works — so the back arrow silently did nothing. rAF is
  // deterministic in both directions.
  const tween = useRef(null);
  const glideBy = useCallback((delta) => {
    if (tween.current) cancelAnimationFrame(tween.current);
    const from = window.scrollY;
    const t0 = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const frame = (now) => {
      const p = Math.min(1, (now - t0) / 420);
      window.scrollTo({ top: from + delta * ease(p), behavior: "instant" });
      tween.current = p < 1 ? requestAnimationFrame(frame) : null;
    };
    tween.current = requestAnimationFrame(frame);
  }, []);

  useEffect(() => () => tween.current && cancelAnimationFrame(tween.current), []);

  // One panel's worth of horizontal travel, converted to page scroll.
  const step = useCallback(
    (dir) => {
      const t = track.current;
      if (!t) return;
      const first = t.querySelector(".hgal-panel");
      const w = first ? first.offsetWidth + 18 : 320;
      if (active) glideBy(dir * w * RATIO);
      else t.scrollBy({ left: dir * w, behavior: "smooth" });
    },
    [active, glideBy]
  );

  // Grab the rail and pull it. Converted to page scroll when pinned, so the
  // pin position and the rail position can never disagree.
  const onDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    drag.current = { x: e.touches?.[0]?.clientX ?? e.clientX, y: window.scrollY };
    moved.current = false;
  };
  const onMove = (e) => {
    if (!drag.current || !active) return;
    const x = e.touches?.[0]?.clientX ?? e.clientX;
    const dx = x - drag.current.x;
    if (Math.abs(dx) > 5) moved.current = true;
    window.scrollTo({ top: drag.current.y - dx * RATIO, behavior: "instant" });
  };
  const onUp = () => {
    drag.current = null;
  };
  // A drag that ended on a panel must not also open it.
  const onClickCapture = (e) => {
    if (moved.current) {
      e.preventDefault();
      e.stopPropagation();
      moved.current = false;
    }
  };

  return (
    <section
      ref={outer}
      className={`hgal ${active ? "is-pinned" : ""}`}
      style={active ? { height: `calc(100vh + ${pinLength}px)` } : undefined}
    >
      <div className="hgal-sticky">
        <div className="hgal-head container">
          <p className="cine-eyebrow">Services</p>
          <h2 className="cine-section-title">
            What we<br />handle
          </h2>

          <div className="hgal-nav">
            <button type="button" onClick={() => step(-1)} aria-label="Previous service">
              <Icon name="chevron-left" size={18} />
            </button>
            <button type="button" onClick={() => step(1)} aria-label="Next service">
              <Icon name="chevron-right" size={18} />
            </button>
            <span className="hgal-hint">{active ? "Scroll, drag or use the arrows" : "Swipe"}</span>
          </div>
        </div>

        <div
          className="hgal-rail"
          ref={track}
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onUp}
          onMouseLeave={onUp}
          onTouchStart={onDown}
          onTouchMove={onMove}
          onTouchEnd={onUp}
          onClickCapture={onClickCapture}
        >
          {panels.map((p) => (
            <Link key={p.to} to={p.to} className="hgal-panel cine-spot" onMouseMove={spot} draggable={false}>
              <img src={p.img} alt="" loading="lazy" draggable={false} />
              <span className="hgal-index" aria-hidden="true">{p.index}</span>
              <span className="hgal-body">
                <span className="cine-eyebrow">{p.eyebrow}</span>
                <span className="hgal-title">{p.title}</span>
                <span className="hgal-desc">{p.desc}</span>
                <span className="cine-go">{p.cta} →</span>
              </span>
            </Link>
          ))}
        </div>

        {active && (
          <div className="hgal-progress container" aria-hidden="true">
            <i ref={bar} />
          </div>
        )}
      </div>
    </section>
  );
}
