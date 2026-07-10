import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { SERVICES } from "../data";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const close = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo" onClick={close}>❄️ CoolAir <span>Co.</span></Link>
        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
        <nav className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/" end onClick={close}>Home</NavLink>
          <div className="dropdown">
            <button>Services ▾</button>
            <div className="dropdown-menu">
              {SERVICES.map((s) => (
                <Link key={s.slug} to={`/services/${s.slug}`} onClick={close}>
                  {s.icon} {s.name}
                </Link>
              ))}
            </div>
          </div>
          <NavLink to="/shop" onClick={close}>Shop</NavLink>
          <NavLink to="/financing" onClick={close}>Financing</NavLink>
          <NavLink to="/reviews" onClick={close}>Reviews</NavLink>
          <NavLink to="/service-areas" onClick={close}>Service Areas</NavLink>
          <NavLink to="/about" onClick={close}>About</NavLink>
          {user ? (
            <NavLink to="/dashboard" onClick={close}>My Dashboard</NavLink>
          ) : (
            <NavLink to="/login" onClick={close}>Login</NavLink>
          )}
          {user && (
            <button onClick={() => { logout(); close(); navigate("/"); }}>Log out</button>
          )}
          <Link to="/book" className="btn btn-primary btn-sm nav-cta" onClick={close}>
            Book Now
          </Link>
        </nav>
      </div>
    </header>
  );
}
