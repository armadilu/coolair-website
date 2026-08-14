import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { supabase } from "../supabaseClient";
import ClipText from "../components/ClipText";
import GradualBlur from "../components/GradualBlur";
import Icon from "../components/Icon";
import { MOCK_BOOKINGS, MOCK_INVOICES, SERVICES } from "../data";

// Role-based dashboards behind one auth (blueprint §6-7):
// customer → appointments/invoices, admin → CRM view, technician → job list.
//
// The data logic here is unchanged. What changed is that every section heading
// used to be `color: var(--blue-900)`, a token from the palette before last
// that now resolves to pure black, so "Your appointments" and "Invoices" were
// black text on a black page.

const chipClass = (status) =>
  ({ "In progress": "in-progress", "Needs assignment": "alert", in_progress: "in-progress" }[status] || status);

// Cursor spotlight, written straight to CSS vars.
const spot = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

function Section({ title, count, children }) {
  return (
    <section className="dash-section">
      <header className="dash-section-head">
        <h3>{title}</h3>
        {count !== undefined && <span className="dash-count">{count}</span>}
      </header>
      {children}
    </section>
  );
}

// Wide tables scroll sideways on a laptop. The blur on the trailing edge is
// the only honest signal that there is more table past the fold.
function Scroller({ children }) {
  return (
    <div className="dash-table">
      <div className="table-wrap">{children}</div>
      <GradualBlur position="right" width="56px" strength={2} divCount={5} curve="ease-out" />
    </div>
  );
}

function Stats({ items }) {
  return (
    <div className="stat-row">
      {items.map((s, i) => (
        <div key={s.lbl} className="stat cine-spot dash-rise" style={{ animationDelay: `${i * 70}ms` }} onMouseMove={spot}>
          <div className="num" style={s.tone ? { color: `var(--${s.tone})` } : undefined}>{s.num}</div>
          <div className="lbl">{s.lbl}</div>
        </div>
      ))}
    </div>
  );
}

function CustomerDash({ user }) {
  // Real users: their bookings from Supabase. Demo user: mock data.
  const [dbBookings, setDbBookings] = useState(null);
  useEffect(() => {
    if (!user.supabase) return;
    supabase
      .from("bookings")
      .select("id, service_slug, slot, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setDbBookings(data || []));
  }, [user]);

  const mine = user.supabase
    ? (dbBookings || []).map((b) => ({
        id: `BK-${b.id}`,
        service: SERVICES.find((s) => s.slug === b.service_slug)?.name || b.service_slug,
        date: b.slot || new Date(b.created_at).toLocaleDateString(),
        status: b.status === "requested" ? "Scheduled" : b.status === "completed" ? "Completed" : b.status,
      }))
    : MOCK_BOOKINGS.filter((b) => b.customer === user.name || b.customer === "Casey Customer");

  return (
    <>
      <h2 className="dash-title"><ClipText text={`Hi ${user.name.split(" ")[0]}`} /></h2>
      <p className="dash-sub">Everything booked under your account, and what you have paid so far.</p>

      <Stats
        items={[
          { num: mine.filter((b) => b.status !== "Completed").length, lbl: "Upcoming appointments" },
          { num: "CoolCare", lbl: "Plan · renews Mar 2027" },
          { num: `SAR ${MOCK_INVOICES.reduce((s, i) => s + i.amount, 0)}`, lbl: "Paid this year" },
        ]}
      />

      <Section title="Your appointments" count={mine.length}>
        {mine.length === 0 ? (
          <div className="dash-empty">
            <Icon name="calendar" size={22} />
            <p>Nothing booked yet.</p>
            <Link to="/book" className="btn btn-primary btn-sm">Book a visit</Link>
          </div>
        ) : (
          <Scroller>
            <table className="styled">
              <thead><tr><th>ID</th><th>Service</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {mine.map((b, i) => (
                  <tr key={b.id} className="dash-rise" style={{ animationDelay: `${i * 55}ms` }}>
                    <td className="mono">{b.id}</td>
                    <td>{b.service}</td>
                    <td>{b.date}</td>
                    <td><span className={`status-chip ${chipClass(b.status)}`}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Scroller>
        )}
      </Section>

      <Section title="Invoices" count={MOCK_INVOICES.length}>
        <Scroller>
          <table className="styled">
            <thead><tr><th>Invoice</th><th>Booking</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {MOCK_INVOICES.map((i, n) => (
                <tr key={i.id} className="dash-rise" style={{ animationDelay: `${n * 55}ms` }}>
                  <td className="mono">{i.id}</td>
                  <td className="mono">{i.booking}</td>
                  <td>SAR {i.amount}</td>
                  <td>{i.date}</td>
                  <td><span className="status-chip Paid">{i.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Scroller>
      </Section>

      <Link to="/book" className="btn btn-primary" style={{ marginTop: 8 }}>Book another visit</Link>
    </>
  );
}

const STATUSES = ["requested", "scheduled", "in_progress", "completed", "cancelled"];
const serviceName = (slug) => SERVICES.find((s) => s.slug === slug)?.name || slug;

function AdminDash({ user }) {
  const [rows, setRows] = useState(null);
  const [techs, setTechs] = useState([]);

  const load = async () => {
    const { data } = await supabase
      .from("bookings")
      .select("id, service_slug, customer_name, phone, zip, slot, notes, status, technician_id, created_at")
      .order("created_at", { ascending: false });
    setRows(data || []);
    const { data: t } = await supabase.from("profiles").select("id, name").eq("role", "technician");
    setTechs(t || []);
  };
  useEffect(() => { if (user.supabase) load(); }, [user]);

  const update = async (id, patch) => {
    await supabase.from("bookings").update(patch).eq("id", id);
    load();
  };

  if (!user.supabase) {
    return (
      <>
        <h2 className="dash-title"><ClipText text="Dispatch CRM" /></h2>
        <p className="dash-sub">
          <span className="role-chip">demo data</span> Sign in with a real admin account to manage
          live bookings.
        </p>
        <Section title="Sample bookings" count={MOCK_BOOKINGS.length}>
          <Scroller>
            <table className="styled">
              <thead><tr><th>ID</th><th>Customer</th><th>Service</th><th>Technician</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {MOCK_BOOKINGS.map((b, i) => (
                  <tr key={b.id} className="dash-rise" style={{ animationDelay: `${i * 55}ms` }}>
                    <td className="mono">{b.id}</td>
                    <td>{b.customer}</td>
                    <td>{b.service}</td>
                    <td>{b.tech}</td>
                    <td>{b.date}</td>
                    <td><span className={`status-chip ${chipClass(b.status)}`}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Scroller>
        </Section>
      </>
    );
  }

  const live = rows || [];
  const unassigned = live.filter((b) => !b.technician_id && !["completed", "cancelled"].includes(b.status)).length;

  return (
    <>
      <h2 className="dash-title"><ClipText text="Dispatch CRM" /></h2>
      <p className="dash-sub">Every booking across the four Riyadh crews, live.</p>

      <Stats
        items={[
          { num: live.filter((b) => !["completed", "cancelled"].includes(b.status)).length, lbl: "Active bookings" },
          { num: unassigned, lbl: "Awaiting technician", tone: unassigned ? "red" : undefined },
          { num: live.filter((b) => b.status === "completed").length, lbl: "Completed" },
        ]}
      />

      <Section title="All bookings" count={live.length}>
        {live.length === 0 ? (
          <div className="dash-empty">
            <Icon name="calendar" size={22} />
            <p>No bookings yet. They appear here the moment a customer books.</p>
          </div>
        ) : (
          <Scroller>
            <table className="styled">
              <thead><tr><th>ID</th><th>Customer</th><th>Service</th><th>Slot</th><th>Technician</th><th>Status</th></tr></thead>
              <tbody>
                {live.map((b, i) => (
                  <tr key={b.id} className="dash-rise" style={{ animationDelay: `${i * 45}ms` }}>
                    <td className="mono">BK-{b.id}</td>
                    <td>
                      {b.customer_name}
                      <div className="dash-meta">{b.phone} · {b.zip}</div>
                    </td>
                    <td>{serviceName(b.service_slug)}</td>
                    <td>{b.slot}</td>
                    <td>
                      <select
                        className="dash-select"
                        value={b.technician_id || ""}
                        onChange={(e) =>
                          update(b.id, {
                            technician_id: e.target.value || null,
                            status: e.target.value && b.status === "requested" ? "scheduled" : b.status,
                          })
                        }
                      >
                        <option value="">Unassigned</option>
                        {techs.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </td>
                    <td>
                      <select className="dash-select" value={b.status} onChange={(e) => update(b.id, { status: e.target.value })}>
                        {STATUSES.map((st) => <option key={st} value={st}>{st.replace("_", " ")}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Scroller>
        )}
      </Section>

      {techs.length === 0 && (
        <p className="dash-note">
          No technicians yet: have a technician sign up on the site, then set their role to
          "technician" in Supabase → Table Editor → profiles.
        </p>
      )}
    </>
  );
}

const NEXT_STATUS = { requested: "scheduled", scheduled: "in_progress", in_progress: "completed" };

function JobCard({ job, index, onAdvance }) {
  return (
    <article className="job-card cine-spot dash-rise" style={{ animationDelay: `${index * 65}ms` }} onMouseMove={spot}>
      <div className="job-head">
        <h3>{job.title}</h3>
        <span className={`status-chip ${chipClass(job.status)}`}>{String(job.status).replace("_", " ")}</span>
      </div>
      <p className="dash-meta">{job.meta}</p>
      {job.notes && <p className="job-note">Note: {job.notes}</p>}
      {onAdvance && NEXT_STATUS[job.status] && (
        <button className="btn btn-primary btn-sm" onClick={onAdvance}>
          Mark {NEXT_STATUS[job.status].replace("_", " ")}
        </button>
      )}
    </article>
  );
}

function TechDash({ user }) {
  const [jobs, setJobs] = useState(null);

  const load = async () => {
    const { data } = await supabase
      .from("bookings")
      .select("id, service_slug, customer_name, phone, zip, slot, notes, status, created_at")
      .eq("technician_id", user.id)
      .order("created_at", { ascending: false });
    setJobs(data || []);
  };
  useEffect(() => { if (user.supabase) load(); }, [user]);

  const advance = async (job) => {
    const next = NEXT_STATUS[job.status];
    if (!next) return;
    await supabase.from("bookings").update({ status: next }).eq("id", job.id);
    load();
  };

  if (!user.supabase) {
    const mocks = MOCK_BOOKINGS.filter((b) => b.tech === "Terry Tech");
    return (
      <>
        <h2 className="dash-title"><ClipText text="Today's jobs" /></h2>
        <p className="dash-sub"><span className="role-chip">demo data</span> Sample run sheet.</p>
        <div className="job-grid">
          {mocks.map((j, i) => (
            <JobCard
              key={j.id}
              index={i}
              job={{ title: `${j.service} · ${j.customer}`, status: j.status, meta: `${j.address} · ${j.date} · ${j.id}` }}
            />
          ))}
        </div>
      </>
    );
  }

  const live = jobs || [];
  return (
    <>
      <h2 className="dash-title"><ClipText text="Today's jobs" /></h2>
      <p className="dash-sub">Your run sheet. Advance a job as you finish each stage.</p>

      <Stats
        items={[
          { num: live.filter((j) => !["completed", "cancelled"].includes(j.status)).length, lbl: "Open jobs" },
          { num: live.filter((j) => j.status === "in_progress").length, lbl: "In progress", tone: "amber" },
          { num: live.filter((j) => j.status === "completed").length, lbl: "Completed", tone: "green" },
        ]}
      />

      {live.length === 0 ? (
        <div className="dash-empty">
          <Icon name="wrench" size={22} />
          <p>No jobs assigned yet. Dispatch assigns them from the admin CRM.</p>
        </div>
      ) : (
        <div className="job-grid">
          {live.map((j, i) => (
            <JobCard
              key={j.id}
              index={i}
              job={{
                title: `${serviceName(j.service_slug)} · ${j.customer_name}`,
                status: j.status,
                meta: `${j.phone} · ${j.zip} · ${j.slot} · BK-${j.id}`,
                notes: j.notes,
              }}
              onAdvance={() => advance(j)}
            />
          ))}
        </div>
      )}
    </>
  );
}

const NAV_ICON = { Overview: "award", "Book a visit": "calendar", "Shop units": "cart", "Back to site": "wind" };

export default function Dashboard() {
  const { user, authReady, logout } = useAuth();
  const navigate = useNavigate();

  if (!user && !authReady) {
    return (
      <div className="container" style={{ padding: "60px 20px" }}>
        <div className="card" style={{ maxWidth: 420 }}>
          <p style={{ color: "var(--muted)" }}>Loading your account…</p>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;

  const links = [
    { to: "/dashboard", label: "Overview" },
    ...(user.role === "customer"
      ? [{ to: "/book", label: "Book a visit" }, { to: "/shop", label: "Shop units" }]
      : []),
    { to: "/home", label: "Back to site" },
  ];

  return (
    <div className="dash-shell">
      <div className="container dash-layout">
        <aside className="dash-side">
          <div className="dash-id">
            <span className="dash-avatar">
              {user.name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("")}
            </span>
            <div>
              <div className="who">{user.name}</div>
              <span className="role-chip">{user.role}</span>
            </div>
          </div>
          <nav>
            {links.map((l) => (
              <Link key={l.to + l.label} to={l.to}>
                <Icon name={NAV_ICON[l.label]} size={15} /> {l.label}
              </Link>
            ))}
            <button onClick={() => { logout(); navigate("/"); }}>
              <Icon name="x" size={15} /> Log out
            </button>
          </nav>
        </aside>

        <main className="dash-main">
          {user.role === "admin" && <AdminDash user={user} />}
          {user.role === "technician" && <TechDash user={user} />}
          {user.role === "customer" && <CustomerDash user={user} />}
        </main>
      </div>
    </div>
  );
}
