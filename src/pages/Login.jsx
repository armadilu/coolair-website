import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth";
import { supabase } from "../supabaseClient";
import Icon from "../components/Icon";

// Single login card, tabbed Login/Sign up, one auth for three roles (blueprint §7).
// Staff arrive via the low-visibility "Staff login" link (?staff=1) — same form, same auth.
//
// The animation lives in the form itself: the tab pill slides between the two
// modes, and the fields scatter and reassemble around it, each on its own
// delay. Keying the form on the tab is what makes that replay on every switch.

export default function Login() {
  const [params] = useSearchParams();
  const staff = params.get("staff") === "1";
  // Where to land after signing in. Booking sends people here with ?next=/book
  // so they finish what they started instead of arriving on the dashboard.
  const next = params.get("next");
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
    navigate(next || "/dashboard", { replace: true });
  };

  // Fields are numbered so each one can carry its own scatter delay.
  let step = 0;

  return (
    <div className="auth-wrap page-bg">
      <div className="auth-card">
        <h2 style={{ marginBottom: 4 }}>{staff ? "Staff access" : "Welcome to CoolAir"}</h2>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: 20 }}>
          {staff
            ? "Admins and technicians sign in with their company account."
            : next
              ? "Sign in to book. Your appointment is saved to your account so you can track it."
              : "Track appointments, invoices and your maintenance plan."}
        </p>

        {!staff && (
          <div className={`auth-tabs ${tab === "signup" ? "is-signup" : ""}`}>
            {/* One pill that slides, rather than two that swap colour. */}
            <span className="auth-tab-ink" aria-hidden="true" />
            <button className={tab === "login" ? "active" : ""} onClick={() => { setTab("login"); setError(""); }}>
              Login
            </button>
            <button className={tab === "signup" ? "active" : ""} onClick={() => { setTab("signup"); setError(""); }}>
              Sign up
            </button>
          </div>
        )}

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={submit} className="auth-form" key={tab}>
          {tab === "signup" && !staff && (
            <div className="form-field auth-pop" style={{ "--i": step++ }}>
              <label>Full name</label>
              <span className="auth-input">
                <Icon name="award" size={15} />
                <input value={form.name} onChange={set("name")} placeholder="Jane Doe" />
              </span>
            </div>
          )}
          <div className="form-field auth-pop" style={{ "--i": step++ }}>
            <label>Email</label>
            <span className="auth-input">
              <Icon name="send" size={15} />
              <input type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" />
            </span>
          </div>
          <div className="form-field auth-pop" style={{ "--i": step++ }}>
            <label>Password</label>
            <span className="auth-input">
              <Icon name="shield" size={15} />
              <input type="password" value={form.password} onChange={set("password")} placeholder="••••••••" />
            </span>
          </div>

          <button className={`auth-submit auth-pop ${busy ? "is-busy" : ""}`} style={{ "--i": step++ }} type="submit" disabled={busy}>
            <span>{busy ? "One sec…" : tab === "login" ? "Log in" : "Create account"}</span>
            <i className="cta-arrow" aria-hidden="true">→</i>
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
              <span style={{ marginRight: 8, fontWeight: 800 }}>G</span> Continue with Google
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
