import { useState } from "react";

// Energy savings calculator (blueprint §4) — estimates annual savings from
// upgrading to a higher-SEER unit based on current system age.

export default function SavingsCalculator() {
  const [age, setAge] = useState(12);
  const [bill, setBill] = useState(220);
  const [targetSeer, setTargetSeer] = useState(17);

  // Older units degrade: assume SEER 13 baseline minus efficiency loss with age.
  const currentSeer = Math.max(8, 13 - age * 0.25);
  const coolingShare = 0.55; // share of summer bill that's cooling
  const monthlySavings = bill * coolingShare * (1 - currentSeer / targetSeer);
  const annual = Math.max(0, Math.round(monthlySavings * 6)); // ~6 cooling months

  return (
    <div className="card" style={{ maxWidth: 560, margin: "0 auto" }}>
      <h3>Energy Savings Calculator</h3>
      <p style={{ marginBottom: 18 }}>See what a higher-SEER unit could save you every year.</p>
      <div className="form-field">
        <label>Age of your current AC: <strong>{age} years</strong></label>
        <input type="range" min="1" max="25" value={age} onChange={(e) => setAge(+e.target.value)} />
      </div>
      <div className="form-field">
        <label>Average summer electric bill: <strong>${bill}/mo</strong></label>
        <input type="range" min="80" max="600" step="10" value={bill} onChange={(e) => setBill(+e.target.value)} />
      </div>
      <div className="form-field">
        <label>Upgrade to</label>
        <select value={targetSeer} onChange={(e) => setTargetSeer(+e.target.value)}>
          <option value={15}>SEER 15 — Best value</option>
          <option value={17}>SEER 17 — Popular pick</option>
          <option value={22}>SEER 22 — High efficiency</option>
          <option value={26}>SEER 26 — Flagship</option>
        </select>
      </div>
      <div style={{ textAlign: "center", padding: "10px 0 4px" }}>
        <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Estimated annual savings</div>
        <div className="calc-result">${annual.toLocaleString()}/yr</div>
        <p style={{ color: "var(--muted)", fontSize: "0.82rem", marginTop: 6 }}>
          Estimate based on typical cooling loads — get an exact figure with a free in-home assessment.
        </p>
      </div>
    </div>
  );
}
