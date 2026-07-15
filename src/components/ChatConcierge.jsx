import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";

// AI chat concierge (blueprint §4) — keyword-triage stand-in for the real AI API.
// Triages common issues and hands off to booking.

const replies = [
  { match: /not cool|warm air|no cold|not cold/i, text: "That's often a refrigerant or capacitor issue. If the outdoor unit hums but the fan doesn't spin, it's very likely the capacitor — a quick same-day fix (~$180–$320). Want to book a diagnostic?" },
  { match: /noise|buzz|rattl|squeal|bang/i, text: "Squealing usually means a belt or motor bearing; banging can be a loose part. I'd avoid running it until it's checked. We have same-day slots — shall I point you to booking?" },
  { match: /leak|water|drip/i, text: "Water around the indoor unit is usually a clogged condensate drain — inexpensive to clear, but it can damage floors if left. A tech can sort it same-day." },
  { match: /price|cost|quote|how much/i, text: "Diagnostics are $89 (waived with repair). Repairs run $120–$650, new systems $2,750–$8,900 installed with 0% financing. Try the instant quote tool on the homepage for a range tailored to you!" },
  { match: /install|replace|new unit|new ac/i, text: "We install high-SEER systems from Carrier, Trane, Lennox, Goodman and Rheem — most in one day, financing from $89/mo. Browse the Shop page or book a free in-home estimate." },
  { match: /maintenance|tune|plan/i, text: "Our CoolCare plan is $14/mo: two seasonal tune-ups, priority scheduling, 15% off repairs, and no emergency fees. It pays for itself with one avoided breakdown." },
  { match: /hour|open|when|time/i, text: "We book online 24/7, run service calls 7am–7pm daily, and keep a 24/7 emergency line: (555) 010-COOL." },
  { match: /area|zip|location|where/i, text: "We cover Central Metro, North Suburbs, and East/West County — check the Service Areas page and enter your zip to confirm coverage." },
];

export default function ChatConcierge() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    { from: "bot", text: "Hi! I'm the CoolAir assistant. Tell me what your AC is doing — e.g. “not cooling” or “making a noise” — and I'll triage it." },
  ]);
  const [input, setInput] = useState("");
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, open]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const hit = replies.find((r) => r.match.test(text));
    const answer = hit
      ? hit.text
      : "I can help with cooling problems, pricing, installs, maintenance plans, hours, and service areas. For anything else, our team picks up at (555) 010-COOL — or book online and add a note.";
    setMsgs((m) => [...m, { from: "user", text }, { from: "bot", text: answer }]);
    setInput("");
  };

  return (
    <>
      {open && (
        <div className="chat-panel">
          <div className="chat-head">
            CoolAir AI Concierge
            <small>Triage in seconds · hands off to a human anytime</small>
          </div>
          <div className="chat-body" ref={bodyRef}>
            {msgs.map((m, i) => (
              <div key={i} className={`msg ${m.from}`}>{m.text}</div>
            ))}
            <Link to="/book" className="btn btn-primary btn-sm" style={{ alignSelf: "flex-start" }}>
              Book now
            </Link>
          </div>
          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Describe the issue…"
            />
            <button onClick={send} aria-label="Send"><Icon name="send" size={16} /></button>
          </div>
        </div>
      )}
      <button className="chat-fab" onClick={() => setOpen(!open)} aria-label="Chat">
        <Icon name={open ? "x" : "chat"} size={24} />
      </button>
    </>
  );
}
