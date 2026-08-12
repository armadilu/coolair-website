import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// Scroll-pinned horizontal gallery.
//
// The section is made taller than the viewport by exactly the horizontal
// overflow of the rail; a sticky child holds it in place while vertical scroll
// is mapped straight onto translateX. Panels have fixed widths in CSS, so the
// measurement is correct before any image finishes loading — the usual reason a
// pinned rail computes the wrong distance on first paint.
//
// No GSAP, no ScrollTrigger, no plugin licence: measurement is a ResizeObserver
// and the tween is one transform written inside rAF. Below 900px, and under
// prefers-reduced-motion, pinning is off entirely and the rail becomes an
// ordinary swipeable row — reflow rather than shrink.

const spot = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

export default function HorizontalGallery({ panels }) {
  const outer = useRef(null);
  const track = useRef(null);
  const [distance, setDistance] = useState(0);
  const [pinned, setPinned] = useState(false);

  // Whether pinning applies at all. Re-evaluated on resize and on the user
  // changing their motion preference mid-session.
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
    if (!t || !pinned) {
      setDistance(0);
      return;
    }
    // scrollWidth is the full rail; clientWidth is what fits on screen.
    setDistance(Math.max(0, t.scrollWidth - t.clientWidth));
  }, [pinned]);

  // Layout effect + a second pass on the next frame: the first runs before the
  // browser has settled fonts and flex sizing, the second catches what moved.
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

  // Map vertical scroll onto translateX, written straight to the node.
  useEffect(() => {
    const t = track.current;
    const o = outer.current;
    if (!t || !o) return;

    if (!pinned || distance <= 0) {
      t.style.transform = "";
      return;
    }

    let frame = 0;
    const draw = () => {
      frame = 0;
      const total = o.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const passed = Math.min(Math.max(-o.getBoundingClientRect().top, 0), total);
      t.style.transform = `translate3d(${-(passed / total) * distance}px, 0, 0)`;
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
  }, [pinned, distance]);

  const active = pinned && distance > 0;

  return (
    <section
      ref={outer}
      className={`hgal ${active ? "is-pinned" : ""}`}
      style={active ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <div className="hgal-sticky">
        <div className="hgal-head container">
          <p className="cine-eyebrow">Services</p>
          <h2 className="cine-section-title">
            What we<br />handle
          </h2>
          <p className="hgal-hint" aria-hidden="true">
            {active ? "Keep scrolling →" : "Swipe →"}
          </p>
        </div>

        <div className="hgal-rail" ref={track}>
          {panels.map((p) => (
            <Link key={p.to} to={p.to} className="hgal-panel cine-spot" onMouseMove={spot}>
              <img src={p.img} alt="" loading="lazy" />
              <span className="hgal-index" aria-hidden="true">
                {p.index}
              </span>
              <span className="hgal-body">
                <span className="cine-eyebrow">{p.eyebrow}</span>
                <span className="hgal-title">{p.title}</span>
                <span className="hgal-desc">{p.desc}</span>
                <span className="cine-go">{p.cta} →</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
