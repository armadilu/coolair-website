import { useState } from "react";
import { Link } from "react-router-dom";

// AI diagnostic / instant quote widget (blueprint §2) — 3 questions → price range + urgency.
// The scoring is a simple heuristic stand-in for the AI diagnostic API (blueprint §9).

const QUESTIONS = [
  {
    key: "issue",
    label: "What's going on with your AC?",
    options: [
      { v: "no-cool", label: "Not cooling at all", cost: [180, 650], urgent: true },
      { v: "weak", label: "Blowing weak / warm air", cost: [120, 480], urgent: false },
      { v: "noise", label: "Strange noise or smell", cost: [90, 400], urgent: true },
      { v: "replace", label: "Want a new unit / quote", cost: [2750, 8900], urgent: false },
      { v: "tuneup", label: "Just a tune-up", cost: [89, 189], urgent: false },
    ],
  },
  {
    key: "age",
    label: "How old is the unit?",
    options: [
      { v: "0-5", label: "0–5 years", mult: 1 },
      { v: "6-10", label: "6–10 years", mult: 1.15 },
      { v: "11-15", label: "11–15 years", mult: 1.3 },
      { v: "16+", label: "16+ years", mult: 1.45 },
      { v: "idk", label: "Not sure", mult: 1.2 },
    ],
  },
  {
    key: "size",
    label: "Roughly how big is your home?",
    options: [
      { v: "s", label: "Under 1,500 sq ft", mult: 1 },
      { v: "m", label: "1,500–2,500 sq ft", mult: 1.1 },
      { v: "l", label: "2,500–4,000 sq ft", mult: 1.25 },
      { v: "xl", label: "4,000+ sq ft", mult: 1.4 },
    ],
  },
];

export default function QuoteWidget() {
  const [answers, setAnswers] = useState({});
  const step = QUESTIONS.findIndex((q) => !answers[q.key]);
  const done = step === -1;

  let result = null;
  if (done) {
    const issue = QUESTIONS[0].options.find((o) => o.v === answers.issue);
    const mult =
      QUESTIONS[1].options.find((o) => o.v === answers.age).mult *
      QUESTIONS[2].options.find((o) => o.v === answers.size).mult;
    result = {
      low: Math.round((issue.cost[0] * mult) / 10) * 10,
      high: Math.round((issue.cost[1] * mult) / 10) * 10,
      urgent: issue.urgent,
    };
  }

  return (
    <div className="quote-widget">
      <h3>⚡ Instant AI Quote</h3>
      <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
        Answer 3 quick questions — get a real price range, not a callback.
      </p>
      <div className="progress-dots">
        {QUESTIONS.map((q, i) => (
          <i key={q.key} className={answers[q.key] || done ? "on" : i === step ? "on" : ""} />
        ))}
      </div>

      {!done ? (
        <div className="quote-step">
          <label>{QUESTIONS[step].label}</label>
          <div className="option-row">
            {QUESTIONS[step].options.map((o) => (
              <button
                key={o.v}
                className="option-pill"
                onClick={() => setAnswers({ ...answers, [QUESTIONS[step].key]: o.v })}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="quote-result">
          <span className={`urgency ${result.urgent ? "high" : "normal"}`}>
            {result.urgent ? "⚠ Priority — book today" : "✓ Routine — flexible timing"}
          </span>
          <div className="price">
            ${result.low.toLocaleString()} – ${result.high.toLocaleString()}
          </div>
          <p style={{ color: "var(--muted)", fontSize: "0.88rem", margin: "6px 0 16px" }}>
            Estimated range for your answers. Final flat-rate price confirmed on-site before any work.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link to="/book" className="btn btn-primary">Book this service</Link>
            <button className="btn btn-outline" onClick={() => setAnswers({})}>Start over</button>
          </div>
        </div>
      )}
    </div>
  );
}
