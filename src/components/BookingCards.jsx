import Icon from "./Icon";

// Bookings as cards instead of a table.
//
// Six columns of dates, names and a status pill did not fit the width the
// dashboard actually has: rows wrapped onto two lines and the "Needs
// assignment" chip was cut off at the right edge. A card gives each booking
// its own space, keeps the status pill whole, and reflows to one column on a
// phone without a horizontal scrollbar.

const chipClass = (status) =>
  ({ "In progress": "in-progress", "Needs assignment": "alert", in_progress: "in-progress" }[status] || status);

export default function BookingCards({ rows, renderControls }) {
  return (
    <div className="bcards">
      {rows.map((b, i) => (
        <article key={b.id} className="bcard dash-rise" style={{ animationDelay: `${i * 70}ms` }}>
          <header className="bcard-head">
            <span className="bcard-id">{b.id}</span>
            <span className={`status-chip ${chipClass(b.status)}`}>{b.status}</span>
          </header>

          <h4 className="bcard-service">{b.service}</h4>

          <dl className="bcard-meta">
            {b.customer && (
              <div>
                <dt>Customer</dt>
                <dd>{b.customer}</dd>
              </div>
            )}
            <div>
              <dt><Icon name="clock" size={12} /> When</dt>
              <dd>{b.date}</dd>
            </div>
            {b.tech !== undefined && (
              <div>
                <dt><Icon name="wrench" size={12} /> Technician</dt>
                <dd className={b.tech === "Unassigned" ? "is-empty" : ""}>{b.tech}</dd>
              </div>
            )}
            {b.contact && (
              <div>
                <dt><Icon name="pin" size={12} /> Contact</dt>
                <dd>{b.contact}</dd>
              </div>
            )}
          </dl>

          {renderControls && <div className="bcard-controls">{renderControls(b)}</div>}
        </article>
      ))}
    </div>
  );
}
