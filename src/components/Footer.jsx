import { Link } from "react-router-dom";
import { SERVICES } from "../data";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <h4><span className="logo-mark" style={{ width: 24, height: 24, borderRadius: 8, fontSize: 11, marginRight: 8 }}>C</span>CoolAir Co.</h4>
            <p>Modern HVAC service — same-day repair, transparent pricing, and AI-assisted diagnostics.</p>
            <p style={{ marginTop: 12 }}>24/7 Emergency line:</p>
            <p className="emergency">(555) 010-COOL</p>
            <div className="cert-row">
              <span className="cert">NATE Certified</span>
              <span className="cert">BBB A+</span>
              <span className="cert">EPA 608</span>
              <span className="cert">Licensed & Insured</span>
            </div>
          </div>
          <div>
            <h4>Services</h4>
            {SERVICES.map((s) => (
              <Link key={s.slug} to={`/services/${s.slug}`}>{s.name}</Link>
            ))}
          </div>
          <div>
            <h4>Company</h4>
            <Link to="/about">About us</Link>
            <Link to="/reviews">Reviews</Link>
            <Link to="/service-areas">Service areas</Link>
            <Link to="/financing">Financing</Link>
            <Link to="/shop">Shop AC units</Link>
          </div>
          <div>
            <h4>Get started</h4>
            <Link to="/book">Book a service</Link>
            <Link to="/login">Customer login</Link>
            <Link to="/login?staff=1">Staff login</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 CoolAir Co. — License #TACLA-042077C. All rights reserved.</span>
          <span>Licensed • Insured • Background-checked technicians</span>
        </div>
      </div>
    </footer>
  );
}
