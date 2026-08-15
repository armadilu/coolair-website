import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { SERVICES } from "../data";
import Icon, { SERVICE_ICONS } from "./Icon";

// Home, About and Reviews stay on the bar at every width. Everything else
// lives behind the menu button, which opens a panel down the left-hand side
// rather than covering the page.

const initials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const close = () => setOpen(false);

  // Escape closes it, and the page behind it does not scroll while it is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <header className="navbar">
        <div className="container navbar-inner">
          <Link to="/home" className="logo" onClick={close}>
            <span className="logo-mark">C</span> CoolAir <span>Co.</span>
            <span className="cine-live" style={{ marginLeft: 10 }}><i />Live</span>
          </Link>

          <nav className="nav-primary">
            <NavLink to="/home" end>Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/reviews">Reviews</NavLink>
          </nav>

          <div className="nav-right">
            {user && (
              <div className="dropdown user-menu">
                <button>
                  <span className="nav-avatar">{initials(user.name)}</span>
                  <span className="nav-who">{user.name.split(" ")[0]}</span> ▾
                </button>
                <div className="dropdown-menu">
                  <Link to="/dashboard">
                    <Icon name="award" size={15} style={{ marginRight: 8, color: "var(--accent)" }} />
                    My dashboard
                  </Link>
                  <button onClick={() => { logout(); navigate("/"); }}>
                    <Icon name="x" size={15} style={{ marginRight: 8, color: "var(--accent)" }} />
                    Log out
                  </button>
                </div>
              </div>
            )}

            <Link to="/book" className="btn btn-primary btn-sm nav-cta">Book now</Link>

            <button
              className="nav-menu-btn"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={open}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* Left panel. Rendered always so it can slide rather than pop. */}
      <div className={`nav-scrim ${open ? "is-open" : ""}`} onClick={close} aria-hidden="true" />
      <aside className={`nav-panel ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="nav-panel-head">
          <span className="cine-eyebrow">Menu</span>
          <button onClick={close} aria-label="Close menu"><Icon name="x" size={16} /></button>
        </div>

        <p className="nav-group">Services</p>
        {SERVICES.map((s) => (
          <NavLink key={s.slug} to={`/services/${s.slug}`} onClick={close}>
            <Icon name={SERVICE_ICONS[s.slug]} size={16} />
            {s.name}
          </NavLink>
        ))}

        <p className="nav-group">Browse</p>
        <NavLink to="/shop" onClick={close}><Icon name="cart" size={16} />Shop units</NavLink>
        <NavLink to="/financing" onClick={close}><Icon name="card" size={16} />Financing</NavLink>
        <NavLink to="/service-areas" onClick={close}><Icon name="pin" size={16} />Service areas</NavLink>

        {/* On a narrow screen the bar drops its three links, so the panel carries
            them and the account actions too. */}
        <div className="nav-panel-narrow">
          <p className="nav-group">Company</p>
          <NavLink to="/home" end onClick={close}><Icon name="wind" size={16} />Home</NavLink>
          <NavLink to="/about" onClick={close}><Icon name="award" size={16} />About</NavLink>
          <NavLink to="/reviews" onClick={close}><Icon name="star" size={16} />Reviews</NavLink>
        </div>

        {!user && (
          <>
            <p className="nav-group">Account</p>
            <NavLink to="/login" onClick={close}><Icon name="shield" size={16} />Log in or sign up</NavLink>
          </>
        )}

        <Link to="/book" className="btn btn-primary nav-panel-cta" onClick={close}>Book now</Link>
        <a href="tel:+966112002665" className="nav-panel-phone">
          <Icon name="phone" size={14} /> +966 11 200 2665
        </a>
      </aside>
    </>
  );
}
