import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SERVICES } from "../data";
import { supabase } from "../supabaseClient";
import { useAuth } from "../auth";
import Icon from "../components/Icon";

// Booking / contact page (blueprint §3 "Contact / Book now") — smart-scheduling mock
// with real time slots instead of "we'll call you back".

const SLOTS = ["Today 2–4 PM", "Today 4–6 PM", "Tomorrow 8–10 AM", "Tomorrow 10–12 PM", "Tomorrow 1–3 PM"];

export default function Book() {
  const [params] = useSearchParams();
  const product = params.get("product");
  const [form, setForm] = useState({
    name: "", phone: "", zip: "", service: product ? "installation" : "", slot: "", notes: product ? `Interested in: ${product}` : "",
  });
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const ready = form.name && form.phone && form.zip && form.service && form.slot;

  const confirm = async () => {
    // Persist to Supabase when a real (non-demo) user is logged in;
    // guests still get the confirmation screen (guest checkout allowed, blueprint §6).
    if (user?.supabase) {
      await supabase.from("bookings").insert({
        user_id: user.id,
        service_slug: form.service,
        customer_name: form.name,
        phone: form.phone,
        zip: form.zip,
        slot: form.slot,
        notes: form.notes,
      });
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section>
        <div className="container" style={{ maxWidth: 560 }}>
          <div className="card center" style={{ padding: 44 }}>
            <span style={{ display: "inline-grid", placeItems: "center", width: 64, height: 64, borderRadius: "50%", background: "var(--green-tint)", color: "var(--green)" }}>
              <Icon name="check" size={34} />
            </span>
            <h2 style={{ color: "var(--blue-900)", margin: "12px 0" }}>You're booked, {form.name.split(" ")[0]}!</h2>
            <p style={{ color: "var(--muted)" }}>
              <strong>{SERVICES.find((s) => s.slug === form.service)?.name}</strong> · {form.slot}.
              We've texted a confirmation to {form.phone}. A dispatcher assigns your technician
              shortly and you'll get their name and photo before arrival.
            </p>
            <div style={{ marginTop: 22, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/login" className="btn btn-primary">Create account to track it</Link>
              <Link to="/home" className="btn btn-outline">Back home</Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="page-bg" style={{ "--bg-img": "url('/img/bg/bg-book.jpg')" }}>
      <div className="page-head" style={{ "--ph-img": "url('/img/page-book.jpg')" }}>
        <div className="container">
          <div className="breadcrumb"><Link to="/home">Home</Link> / Book</div>
          <h1>Book your service</h1>
          <p>Pick a real time slot — no callbacks, no waiting by the phone.</p>
        </div>
      </div>

      <section>
        <div className="container grid grid-2" style={{ alignItems: "start" }}>
          <div className="card">
            <div className="form-field">
              <label>Your name</label>
              <input value={form.name} onChange={set("name")} placeholder="Jane Doe" />
            </div>
            <div className="form-field">
              <label>Phone</label>
              <input value={form.phone} onChange={set("phone")} placeholder="(555) 123-4567" />
            </div>
            <div className="form-field">
              <label>Zip code</label>
              <input value={form.zip} onChange={set("zip")} maxLength={5} placeholder="75002" />
            </div>
            <div className="form-field">
              <label>Service needed</label>
              <select value={form.service} onChange={set("service")}>
                <option value="">Select a service…</option>
                {SERVICES.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Pick a time slot</label>
              <div className="option-row">
                {SLOTS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`option-pill ${form.slot === s ? "selected" : ""}`}
                    onClick={() => setForm({ ...form, slot: s })}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-field">
              <label>Notes (optional)</label>
              <textarea rows={3} value={form.notes} onChange={set("notes")} placeholder="Anything the technician should know?" />
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: "100%" }} disabled={!ready} onClick={confirm}>
              Confirm booking →
            </button>
          </div>

          <div>
            <div className="card" style={{ marginBottom: 18 }}>
              <h3>Prefer to talk?</h3>
              <p style={{ margin: "8px 0" }}>Our dispatch line is open 7am–7pm, emergencies 24/7.</p>
              <p className="emergency" style={{ color: "var(--blue-700)" }}>(555) 010-COOL</p>
            </div>
            <div className="card">
              <h3>What happens next</h3>
              <ul className="checklist">
                <li>Instant text confirmation with your slot</li>
                <li>Technician name + photo before arrival</li>
                <li>Flat-rate price confirmed before work starts</li>
                <li>Pay on completion — card, financing, or check</li>
              </ul>
              <p className="staff-link" style={{ textAlign: "left" }}>
                <Link to="/login?staff=1">Staff login</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
