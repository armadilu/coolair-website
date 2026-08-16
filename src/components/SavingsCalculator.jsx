import { useState } from "react";
import ElasticSlider from "./ElasticSlider";
import Icon from "./Icon";

// Energy savings calculator (blueprint §4) — estimates annual savings from
// upgrading to a higher-SEER unit based on current system age.

const TARGETS = [
  { seer: 15, label: "SEER 15 · Best value" },
  { seer: 17, label: "SEER 17 · Popular pick" },
  { seer: 22, label: "SEER 22 · High efficiency" },
  { seer: 26, label: "SEER 26 · Flagship" },
];

export default function SavingsCalculator() {
  const [age, setAge] = useState(12);
  const [bill, setBill] = useState(800);
  const [targetSeer, setTargetSeer] = useState(17);

  // Older units degrade: assume SEER 13 baseline minus efficiency loss with age.
  const currentSeer = Math.max(8, 13 - age * 0.25);
  const coolingShare = 0.55; // share of summer bill that's cooling
  const monthlySavings = bill * coolingShare * (1 - currentSeer / targetSeer);
  const annual = Math.max(0, Math.round(monthlySavings * 6)); // ~6 cooling months

  return (
    <div className="card calc-card">
      <h3>Energy savings calculator</h3>
      <p style={{ marginBottom: 22, color: "var(--muted)" }}>
        See what a higher-SEER unit could save you every year.
      </p>

      <ElasticSlider
        label="Age of your current AC"
        value={age}
        onChange={setAge}
        startingValue={1}
        maxValue={25}
        stepSize={1}
        leftIcon={<Icon name="zap" size={17} />}
        rightIcon={<Icon name="clock" size={17} />}
        format={(v) => `${Math.round(v)} years old`}
      />

      <ElasticSlider
        label="Average summer electricity bill"
        value={bill}
        onChange={setBill}
        startingValue={300}
        maxValue={2500}
        stepSize={50}
        leftIcon={<Icon name="card" size={17} />}
        rightIcon={<Icon name="zap" size={17} />}
        format={(v) => `SAR ${Math.round(v).toLocaleString()}/mo`}
      />

      <div className="form-field" style={{ marginTop: 10 }}>
        <label>Upgrade to</label>
        <div className="option-row">
          {TARGETS.map((t) => (
            <button
              key={t.seer}
              type="button"
              className={`option-pill ${targetSeer === t.seer ? "selected" : ""}`}
              onClick={() => setTargetSeer(t.seer)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "18px 0 4px" }}>
        <div className="cine-eyebrow">Estimated annual savings</div>
        <div className="calc-result">SAR {annual.toLocaleString()}/yr</div>
        <p style={{ color: "var(--muted)", fontSize: "0.82rem", marginTop: 6 }}>
          Estimate based on typical cooling loads. Get an exact figure with a free on-site assessment.
        </p>
      </div>
    </div>
  );
}
