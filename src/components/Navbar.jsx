import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { SERVICES } from "../data";
import Icon, { SERVICE_ICONS } from "./Icon";

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const close = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/home" className="logo" onClick={close}>
          <span className="logo-mark">C</span> CoolAir <span>Co.</span>
          <span className="cine-live" style={{ marginLeft: 10 }}><i />Live</span>
        </Link>
        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
        <nav className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/home" end onClick={close}>Home</NavLink>
          <div className="dropdown">
            <button>Services ▾</button>
            <div className="dropdown-menu">
              {SERVICES.map((s) => (
                <Link key={s.slug} to={`/services/${s.slug}`} onClick={close}>
                  <Icon name={SERVICE_ICONS[s.slug]} size={16} style={{ marginRight: 8, color: "var(--accent)" }} />
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
          <NavLink to="/shop" onClick={close}>Shop</NavLink>
          <NavLink to="/financing" onClick={close}>Financing</NavLink>
          <NavLink to="/reviews" onClick={close}>Reviews</NavLink>
          <NavLink to="/service-areas" onClick={close}>Areas</NavLink>
          <NavLink to="/about" onClick={close}>About</NavLink>

          {/* Signed in, the bar used to carry "My Dashboard" AND "Log out" as
              two more top-level items, which pushed it past the width it had
              and wrapped every label. One account menu instead. */}
          {user ? (
            <div className="dropdown user-menu">
              <button>
                <span className="nav-avatar">{initials(user.name)}</span>
                <span className="nav-who">{user.name.split(" ")[0]}</span> ▾
              </button>
              <div className="dropdown-menu">
                <Link to="/dashboard" onClick={close}>
                  <Icon name="award" size={15} style={{ marginRight: 8, color: "var(--accent)" }} />
                  My dashboard
                </Link>
                {user.role === "customer" && (
                  <Link to="/shop" onClick={close}>
                    <Icon name="cart" size={15} style={{ marginRight: 8, color: "var(--accent)" }} />
                    Shop units
                  </Link>
                )}
                <button onClick={() => { logout(); close(); navigate("/"); }}>
                  <Icon name="x" size={15} style={{ marginRight: 8, color: "var(--accent)" }} />
                  Log out
                </button>
              </div>
            </div>
          ) : (
            <NavLink to="/login" onClick={close}>Login</NavLink>
          )}

          <Link to="/book" className="btn btn-primary btn-sm nav-cta" onClick={close}>
            Book now
          </Link>
        </nav>
      </div>
    </header>
  );
}
