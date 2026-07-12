import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth";
import { supabase } from "../supabaseClient";

// Single login card, tabbed Login/Sign up, one auth for three roles (blueprint §7).
// Staff arrive via the low-visibility "Staff login" link (?staff=1) — same form, same auth.

export default function Login() {
  const [params] = useSearchParams();
  const staff = params.get("staff") === "1";
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const res =
      tab === "login"
        ? await login(form.email, form.password)
        : await signup(form.name, form.email, form.password);
    setBusy(false);
    if (res.error) return setError(res.error);
    navigate("/dashboard");
  };

  return (
    <div className="auth-wrap page-bg" style={{ "--bg-img": "url('/img/bg/bg-login.jpg')" }}>
      <div className="auth-card">
        <h2 style={{ color: "var(--blue-900)", marginBottom: 4 }}>
          {staff ? "Staff access" : "Welcome to CoolAir"}
        </h2>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: 20 }}>
          {staff
            ? "Admins and technicians sign in with their company account."
            : "Track appointments, invoices and your maintenance plan."}
        </p>

        {!staff && (
          <div className="auth-tabs">
            <button className={tab === "login" ? "active" : ""} onClick={() => { setTab("login"); setError(""); }}>Login</button>
            <button className={tab === "signup" ? "active" : ""} onClick={() => { setTab("signup"); setError(""); }}>Sign up</button>
          </div>
        )}

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={submit}>
          {tab === "signup" && !staff && (
            <div className="form-field">
              <label>Full name</label>
              <input value={form.name} onChange={set("name")} placeholder="Jane Doe" />
            </div>
          )}
          <div className="form-field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={set("password")} placeholder="••••••••" />
          </div>
          <button className="btn btn-primary" style={{ width: "100%" }} type="submit" disabled={busy}>
            {busy ? "One sec…" : tab === "login" ? "Log in" : "Create account"}
          </button>
        </form>

        {tab === "login" && (
          <p style={{ textAlign: "center", marginTop: 12, fontSize: "0.85rem" }}>
            <a href="#" onClick={(e) => e.preventDefault()}>Forgot password?</a>
          </p>
        )}

        {!staff && (
          <>
            <div className="divider">or</div>
            <button
              className="social-btn"
              onClick={async () => {
                const { error: e } = await supabase.auth.signInWithOAuth({
                  provider: "google",
                  options: { redirectTo: window.location.origin + "/dashboard" },
                });
                if (e) setError("Google login needs the Google provider enabled in Supabase → Authentication → Providers.");
              }}
            >
              <span style={{ marginRight: 8 }}>🔵</span> Continue with Google
            </button>
          </>
        )}

        <div className="demo-box">
          <strong>Demo accounts</strong> (password <code>demo123</code>):<br />
          customer@demo.com · admin@demo.com · tech@demo.com
        </div>

        {!staff && (
          <p className="staff-link">
            <a href="/login?staff=1">Staff login</a>
          </p>
        )}
      </div>
    </div>
  );
}
