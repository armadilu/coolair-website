import Icon from "./Icon";

// Booking progress tracker. Each row draws its own connector, so a stage can be
// inserted without recomputing anything above or below it. Done rows carry a
// check and a solid connector, the live row carries a pulsing marker, pending
// rows stay muted. A count sits above and a status pill below.
//
// Under prefers-reduced-motion the pulse is dropped rather than frozen: a
// stopped "live" marker is indistinguishable from a done one.

export const STAGES = [
  { key: "requested", label: "Booking received", note: "We have your slot and your district." },
  { key: "scheduled", label: "Technician assigned", note: "You get their name before they arrive." },
  { key: "in_progress", label: "On site", note: "Flat rate confirmed before any panel comes off." },
  { key: "completed", label: "Job complete", note: "Invoice issued, warranty starts today." },
];

// Anything the database can hold, mapped onto the four stages above.
const INDEX = {
  requested: 0, Scheduled: 1, scheduled: 1, in_progress: 2, "In progress": 2,
  completed: 3, Completed: 3, cancelled: -1,
};

export default function JobTimeline({ status = "requested", compact = false, reference }) {
  const at = INDEX[status] ?? 0;
  const cancelled = at === -1;
  const done = cancelled ? 0 : at;

  return (
    <div className={`tl ${compact ? "is-compact" : ""}`}>
      <header className="tl-head">
        <span className="tl-count">
          {cancelled ? "Cancelled" : `${done + 1} of ${STAGES.length}`}
        </span>
        {reference && <span className="tl-ref">{reference}</span>}
      </header>

      <ol className="tl-list">
        {STAGES.map((s, i) => {
          const state = cancelled ? "off" : i < at ? "done" : i === at ? "live" : "next";
          return (
            <li key={s.key} className={`tl-row is-${state}`}>
              <span className="tl-marker" aria-hidden="true">
                {state === "done" ? <Icon name="check" size={12} /> : <i />}
              </span>
              {/* Connector belongs to the row, not the list, so the list can
                  grow or shrink without any index maths. */}
              {i < STAGES.length - 1 && <span className="tl-connector" aria-hidden="true" />}
              <div className="tl-body">
                <p className="tl-label">{s.label}</p>
                {!compact && <p className="tl-note">{s.note}</p>}
              </div>
            </li>
          );
        })}
      </ol>

      <footer className="tl-foot">
        <span className={`tl-pill is-${cancelled ? "off" : at >= STAGES.length - 1 ? "done" : "live"}`}>
          {cancelled ? "Cancelled" : at >= STAGES.length - 1 ? "Complete" : STAGES[at].label}
        </span>
      </footer>
    </div>
  );
}
