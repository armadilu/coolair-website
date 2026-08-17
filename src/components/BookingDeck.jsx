import { useState } from "react";
import CardSwap, { Card } from "./CardSwap";
import BookingCards from "./BookingCards";
import Icon from "./Icon";

// Bookings as a controllable swap deck, with a list view alongside it.
//
// The deck is the nice one to look at; the list is the one you can actually
// scan when there are twenty jobs on it. Both read the same rows, so nothing
// is hidden behind the toggle. Controls are real buttons rather than a timer
// you have to wait on, and the deck starts paused on the list view so GSAP is
// not animating cards nobody is looking at.

const chipClass = (status) =>
  ({ "In progress": "in-progress", "Needs assignment": "alert", in_progress: "in-progress" }[status] || status);

export default function BookingDeck({ rows, renderControls, emptyLabel = "Nothing here yet." }) {
  const [view, setView] = useState("deck");
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0);
  const step = () => setTick((t) => t + 1);

  if (!rows.length) {
    return (
      <div className="dash-empty">
        <Icon name="calendar" size={22} />
        <p>{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="bdeck">
      <div className="bdeck-bar">
        <div className="bdeck-views" role="tablist">
          <button
            role="tab"
            aria-selected={view === "deck"}
            className={view === "deck" ? "on" : ""}
            onClick={() => setView("deck")}
          >
            <Icon name="cart" size={14} /> Deck
          </button>
          <button
            role="tab"
            aria-selected={view === "list"}
            className={view === "list" ? "on" : ""}
            onClick={() => setView("list")}
          >
            <Icon name="check" size={14} /> List
          </button>
        </div>

        {view === "deck" && (
          <div className="bdeck-controls">
            <button onClick={() => setPaused((p) => !p)} aria-label={paused ? "Resume" : "Pause"}>
              {paused ? <Icon name="chevron-right" size={15} /> : <Icon name="x" size={15} />}
              <span>{paused ? "Play" : "Pause"}</span>
            </button>
            <button onClick={step} aria-label="Next booking">
              <span>Next</span> <Icon name="chevron-right" size={15} />
            </button>
          </div>
        )}
      </div>

      {view === "list" ? (
        <BookingCards rows={rows} renderControls={renderControls} />
      ) : (
        <div className="bdeck-stage-wrap">
          <CardSwap
            advance={tick}
            paused={paused}
            width="min(420px, 100%)"
            height={renderControls ? 330 : 270}
            cardDistance={40}
            verticalDistance={38}
            skewAmount={4}
            delay={5200}
            onCardClick={step}
          >
            {rows.map((b) => (
              <Card key={b.id}>
                <div className="bdeck-card">
                  <header className="bcard-head">
                    <span className="bcard-id">{b.id}</span>
                    <span className={`status-chip ${chipClass(b.status)}`}>{b.status}</span>
                  </header>
                  <h4 className="bcard-service">{b.service}</h4>
                  <dl className="bcard-meta">
                    {b.customer && (
                      <div><dt>Customer</dt><dd>{b.customer}</dd></div>
                    )}
                    <div><dt><Icon name="clock" size={12} /> When</dt><dd>{b.date}</dd></div>
                    {b.tech !== undefined && (
                      <div>
                        <dt><Icon name="wrench" size={12} /> Technician</dt>
                        <dd className={b.tech === "Unassigned" ? "is-empty" : ""}>{b.tech}</dd>
                      </div>
                    )}
                  </dl>
                  {/* Controls stop the click from also advancing the deck. */}
                  {renderControls && (
                    <div className="bcard-controls" onClick={(e) => e.stopPropagation()}>
                      {renderControls(b)}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </CardSwap>
        </div>
      )}
    </div>
  );
}
