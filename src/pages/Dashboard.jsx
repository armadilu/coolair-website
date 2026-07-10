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
      <h2 className="section-title" style={{ fontSize: "1.5rem" }}>Hi {user.name.split(" ")[0]} 👋</h2>
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
      <p style={{ marginTop: 22 }}><Link to="/book" className="btn btn-primary">Book another service</Link></p>
    </>
  );
}

function AdminDash() {
  return (
    <>
      <h2 className="section-title" style={{ fontSize: "1.5rem" }}>Dispatch CRM</h2>
      <div className="stat-row">
        <div className="stat"><div className="num">{MOCK_BOOKINGS.length}</div><div className="lbl">Active bookings</div></div>
        <div className="stat"><div className="num" style={{ color: "var(--red)" }}>{MOCK_BOOKINGS.filter((b) => b.status === "Needs assignment").length}</div><div className="lbl">Awaiting technician</div></div>
        <div className="stat"><div className="num">4.9 ★</div><div className="lbl">Review average this month</div></div>
      </div>
      <h3 style={{ margin: "10px 0 12px", color: "var(--blue-900)" }}>All bookings</h3>
      <BookingsTable rows={MOCK_BOOKINGS} cols={["ID", "Customer", "Service", "Technician", "Date", "Status"]} />
      <p style={{ marginTop: 16, color: "var(--muted)", fontSize: "0.88rem" }}>
        New bookings trigger an alert here; assigning a technician moves the job to their portal.
        Marking a job complete fires the automated review request to the customer.
      </p>
    </>
  );
}

function TechDash({ user }) {
  const jobs = MOCK_BOOKINGS.filter((b) => b.tech === user.name || b.tech === "Terry Tech");
  return (
    <>
      <h2 className="section-title" style={{ fontSize: "1.5rem" }}>Today's jobs</h2>
      <div className="stat-row">
        <div className="stat"><div className="num">{jobs.length}</div><div className="lbl">Assigned jobs</div></div>
        <div className="stat"><div className="num">{jobs.filter((j) => j.status === "In progress").length}</div><div className="lbl">In progress</div></div>
        <div className="stat"><div className="num">📷</div><div className="lbl">Upload completion photos</div></div>
      </div>
      {jobs.map((j) => (
        <div key={j.id} className="card" style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <h3>{j.service} — {j.customer}</h3>
            <span className={`status-chip ${chipClass(j.status)}`}>{j.status}</span>
          </div>
          <p style={{ color: "var(--muted)", margin: "6px 0" }}>📍 {j.address} · 🕑 {j.date} · {j.id}</p>
          <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
            <button className="btn btn-primary btn-sm">Update status</button>
            <button className="btn btn-outline btn-sm">Upload photos</button>
          </div>
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
          {user.role === "customer" && <Link to="/book">Book a service</Link>}
          {user.role === "customer" && <Link to="/shop">Shop units</Link>}
          <Link to="/">Back to site</Link>
          <button onClick={() => { logout(); navigate("/"); }}>Log out</button>
        </nav>
      </aside>
      <main>
        {user.role === "admin" && <AdminDash />}
        {user.role === "technician" && <TechDash user={user} />}
        {user.role === "customer" && <CustomerDash user={user} />}
      </main>
    </div>
  );
}
