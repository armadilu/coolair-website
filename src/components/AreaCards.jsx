import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { SERVICE_AREAS } from "../data";

// Coverage zones as a deck you flick through. The active card sits square on;
// its neighbours fall back in Z, tilt away and dim, so the stack reads as depth
// rather than a row of equal tiles. Arrows, drag, wheel and arrow keys all
// drive the same index, and it wraps in both directions.
//
// This replaces a stacked column of four cards that left half the section
// empty next to it.

const N = SERVICE_AREAS.length;

export default function AreaCards({ onPick, activeZone }) {
  const [index, setIndex] = useState(0);
  const drag = useRef(null);
  const wheelLock = useRef(0);
  const move = useCallback((d) => setIndex((i) => i + d), []);
  const active = ((index % N) + N) % N;

  // Selecting a zone elsewhere (search, map pin) brings its card forward.
  useEffect(() => {
    if (!activeZone) return;
    const i = SERVICE_AREAS.findIndex((a) => a.zone === activeZone);
    if (i >= 0) setIndex((cur) => cur + ((i - (((cur % N) + N) % N) + N + 1) % N) - 1);
  }, [activeZone]);

  const onWheel = (e) => {
    const now = Date.now();
    if (now - wheelLock.current < 320) return;
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : 0;
    if (Math.abs(d) < 12) return;
    wheelLock.current = now;
    move(d > 0 ? 1 : -1);
  };
  const onDown = (e) => { drag.current = { x: e.touches?.[0]?.clientX ?? e.clientX }; };
  const onMove = (e) => {
    if (!drag.current) return;
    const x = e.touches?.[0]?.clientX ?? e.clientX;
    const dx = x - drag.current.x;
    if (Math.abs(dx) > 50) { move(dx < 0 ? 1 : -1); drag.current = { x }; }
  };
  const onUp = () => { drag.current = null; };

  return (
    <div
      className="deck"
      onWheel={onWheel}
      onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); move(1); }
        if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); }
      }}
      tabIndex={0}
      aria-label="Coverage zones"
    >
      <div className="deck-stage">
        {SERVICE_AREAS.map((a, i) => {
          // Signed shortest distance, so the deck wraps instead of unwinding.
          let off = i - active;
          if (off > N / 2) off -= N;
          if (off < -N / 2) off += N;
          const abs = Math.abs(off);
          return (
            <article
              key={a.zone}
              className={`deck-card ${off === 0 ? "is-active" : ""}`}
              style={{
                transform: `translateX(${off * 42}%) translateZ(${-abs * 130}px) rotateY(${off * -22}deg)`,
                opacity: abs > 2 ? 0 : 1 - abs * 0.28,
                zIndex: N - abs,
                pointerEvents: off === 0 ? "auto" : "none",
              }}
              aria-hidden={off !== 0}
            >
              <header>
                <h3>{a.zone}</h3>
                <span className="seer-chip">{a.response}</span>
              </header>
              <p className="deck-arabic" dir="rtl">{a.arabic}</p>

              <p className="deck-cap">Districts covered</p>
              <div className="addr-grid">
                {a.districts.map((d) => (
                  <span key={d} className="addr-chip">
                    <Icon name="pin" size={11} style={{ color: "var(--accent-soft)" }} />
                    <b>{d}</b>
                  </span>
                ))}
              </div>

              <p className="deck-cap">National Address</p>
              <div className="addr-grid">
                <span className="addr-chip"><i>Short code</i><b>{a.shortPrefix}····</b></span>
                {a.postal.map((p) => (
                  <span key={p} className="addr-chip"><i>Postal</i><b>{p}</b></span>
                ))}
              </div>

              <button className="deck-go" onClick={() => onPick?.(a)}>
                Show on map <Icon name="chevron" size={13} />
              </button>
            </article>
          );
        })}
      </div>

      <div className="deck-controls">
        <button onClick={() => move(-1)} aria-label="Previous zone"><Icon name="chevron-left" size={17} /></button>
        <div className="deck-dots">
          {SERVICE_AREAS.map((a, i) => (
            <button
              key={a.zone}
              className={i === active ? "on" : ""}
              onClick={() => move(i - active)}
              aria-label={a.zone}
            />
          ))}
        </div>
        <button onClick={() => move(1)} aria-label="Next zone"><Icon name="chevron-right" size={17} /></button>
      </div>
    </div>
  );
}
