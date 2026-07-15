import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { supabase } from "../supabaseClient";
import { MOCK_BOOKINGS, MOCK_INVOICES, SERVICES } from "../data";

// Role-based dashboards behind one auth (blueprint §6-7):
// customer → appointments/invoices, admin → CRM view, technician → job list.

const chipClass = (status) =>
  ({ "In progress": "in-progress", "Needs assignment": "alert" }[status] || status);

function BookingsTable({ rows, cols }) {
  return (
    <div className="table-wrap">
      <table className="styled">
        <thead><tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
        <tbody>
          {rows.map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>
              {cols.includes("Customer") && <td>{b.customer}</td>}
              <td>{b.service}</td>
              {cols.includes("Technician") && <td>{b.tech}</td>}
              <td>{b.date}</td>
              <td><span className={`status-chip ${chipClass(b.status)}`}>{b.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
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
      <h2 className="section-title" style={{ fontSize: "1.5rem" }}>Hi {user.name.split(" ")[0]}</h2>
      <div className="stat-row">
        <div className="stat"><div className="num">{mine.filter((b) => b.status !== "Completed").length}</div><div className="lbl">Upcoming appointments</div></div>
        <div className="stat"><div className="num">CoolCare</div><div className="lbl">Plan · renews Mar 2027</div></div>
        <div className="stat"><div className="num">${MOCK_INVOICES.reduce((s, i) => s + i.amount, 0)}</div><div className="lbl">Paid this year</div></div>
      </div>
      <h3 style={{ margin: "10px 0 12px", color: "var(--blue-900)" }}>Your appointments</h3>
      <BookingsTable rows={mine} cols={["ID", "Service", "Date", "Status"]} />
      <h3 style={{ margin: "26px 0 12px", color: "var(--blue-900)" }}>Invoices</h3>
      <div className="table-wrap">
        <table className="styled">
          <thead><tr><th>Invoice</th><th>Booking</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            {MOCK_INVOICES.map((i) => (
              <tr key={i.id}>
                <td>{i.id}</td><td>{i.booking}</td><td>${i.amount}</td><td>{i.date}</td>
                <td><span className="status-chip Paid">{i.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: 22 }}><Link to="/book" className="btn btn-primary">Book now</Link></p>
    </>
  );
}

const STATUSES = ["requested", "scheduled", "in_progress", "completed", "cancelled"];
const serviceName = (slug) => SERVICES.find((s) => s.slug === slug)?.name || slug;

function AdminDash({ user }) {
  // Real admins (Supabase account with role=admin) manage live bookings;
  // the demo admin account keeps showing mock data.
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
        <h2 className="section-title" style={{ fontSize: "1.5rem" }}>Dispatch CRM <span className="role-chip">demo data</span></h2>
        <BookingsTable rows={MOCK_BOOKINGS} cols={["ID", "Customer", "Service", "Technician", "Date", "Status"]} />
        <p style={{ marginTop: 16, color: "var(--muted)", fontSize: "0.88rem" }}>
          This demo account shows sample data. Sign in with a real admin account to manage live bookings.
        </p>
      </>
    );
  }

  const live = rows || [];
  return (
    <>
      <h2 className="section-title" style={{ fontSize: "1.5rem" }}>Dispatch CRM</h2>
      <div className="stat-row">
        <div className="stat"><div className="num">{live.filter((b) => !["completed", "cancelled"].includes(b.status)).length}</div><div className="lbl">Active bookings</div></div>
        <div className="stat"><div className="num" style={{ color: "var(--red)" }}>{live.filter((b) => !b.technician_id && !["completed", "cancelled"].includes(b.status)).length}</div><div className="lbl">Awaiting technician</div></div>
        <div className="stat"><div className="num">{live.filter((b) => b.status === "completed").length}</div><div className="lbl">Completed</div></div>
      </div>
      <h3 style={{ margin: "10px 0 12px", color: "var(--blue-900)" }}>All bookings</h3>
      {live.length === 0 ? (
        <div className="card"><p style={{ color: "var(--muted)" }}>No bookings yet — they appear here the moment a customer books.</p></div>
      ) : (
        <div className="table-wrap">
          <table className="styled">
            <thead><tr><th>ID</th><th>Customer</th><th>Service</th><th>Slot</th><th>Technician</th><th>Status</th></tr></thead>
            <tbody>
              {live.map((b) => (
                <tr key={b.id}>
                  <td>BK-{b.id}</td>
                  <td>{b.customer_name}<div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{b.phone} · {b.zip}</div></td>
                  <td>{serviceName(b.service_slug)}</td>
                  <td>{b.slot}</td>
                  <td>
                    <select
                      value={b.technician_id || ""}
                      onChange={(e) => update(b.id, { technician_id: e.target.value || null, status: e.target.value && b.status === "requested" ? "scheduled" : b.status })}
                      style={{ padding: "6px 8px", borderRadius: 8, border: "1.5px solid var(--line)", background: "var(--surface-hi)", color: "var(--ink)" }}
                    >
                      <option value="">Unassigned</option>
                      {techs.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </td>
                  <td>
                    <select
                      value={b.status}
                      onChange={(e) => update(b.id, { status: e.target.value })}
                      style={{ padding: "6px 8px", borderRadius: 8, border: "1.5px solid var(--line)", background: "var(--surface-hi)", color: "var(--ink)" }}
                    >
                      {STATUSES.map((st) => <option key={st} value={st}>{st.replace("_", " ")}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {techs.length === 0 && (
        <p style={{ marginTop: 16, color: "var(--muted)", fontSize: "0.88rem" }}>
          No technicians yet: have a technician sign up on the site, then set their role to
          "technician" in Supabase → Table Editor → profiles.
        </p>
      )}
    </>
  );
}

const NEXT_STATUS = { requested: "scheduled", scheduled: "in_progress", in_progress: "completed" };

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
        <h2 className="section-title" style={{ fontSize: "1.5rem" }}>Today's jobs <span className="role-chip">demo data</span></h2>
        {mocks.map((j) => (
          <div key={j.id} className="card" style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <h3>{j.service} — {j.customer}</h3>
              <span className={`status-chip ${chipClass(j.status)}`}>{j.status}</span>
            </div>
            <p style={{ color: "var(--muted)", margin: "6px 0" }}>{j.address} · {j.date} · {j.id}</p>
          </div>
        ))}
      </>
    );
  }

  const live = jobs || [];
  return (
    <>
      <h2 className="section-title" style={{ fontSize: "1.5rem" }}>Today's jobs</h2>
      <div className="stat-row">
        <div className="stat"><div className="num">{live.filter((j) => !["completed", "cancelled"].includes(j.status)).length}</div><div className="lbl">Open jobs</div></div>
        <div className="stat"><div className="num">{live.filter((j) => j.status === "in_progress").length}</div><div className="lbl">In progress</div></div>
        <div className="stat"><div className="num">{live.filter((j) => j.status === "completed").length}</div><div className="lbl">Completed</div></div>
      </div>
      {live.length === 0 && (
        <div className="card"><p style={{ color: "var(--muted)" }}>No jobs assigned yet — dispatch assigns them from the admin CRM.</p></div>
      )}
      {live.map((j) => (
        <div key={j.id} className="card" style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <h3>{serviceName(j.service_slug)} — {j.customer_name}</h3>
            <span className={`status-chip ${chipClass(j.status)}`}>{j.status.replace("_", " ")}</span>
          </div>
          <p style={{ color: "var(--muted)", margin: "6px 0" }}>
            {j.phone} · zip {j.zip} · {j.slot} · BK-{j.id}
          </p>
          {j.notes && <p style={{ color: "var(--muted)", fontSize: "0.88rem" }}>Note: {j.notes}</p>}
          {NEXT_STATUS[j.status] && (
            <button className="btn btn-primary btn-sm" style={{ marginTop: 10 }} onClick={() => advance(j)}>
              Mark {NEXT_STATUS[j.status].replace("_", " ")}
            </button>
          )}
        </div>
      ))}
    </>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="container dash-layout">
      <aside className="dash-side">
        <div className="who">{user.name}</div>
        <span className="role-chip">{user.role}</span>
        <nav>
          <Link to="/dashboard">Overview</Link>
          {user.role === "customer" && <Link to="/book">Book now</Link>}
          {user.role === "customer" && <Link to="/shop">Shop units</Link>}
          <Link to="/home">Back to site</Link>
          <button onClick={() => { logout(); navigate("/"); }}>Log out</button>
        </nav>
      </aside>
      <main>
        {user.role === "admin" && <AdminDash user={user} />}
        {user.role === "technician" && <TechDash user={user} />}
        {user.role === "customer" && <CustomerDash user={user} />}
      </main>
    </div>
  );
}
