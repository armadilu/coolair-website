import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { SERVICES } from "../data";
import Icon, { SERVICE_ICONS } from "./Icon";
import NavDock, { DockItem } from "./NavDock";

// Every link on the bar, each with an icon, magnifying under the cursor.
// Services is a dropdown again. No hamburger: below the width where labels stop
// fitting the dock goes icon-only, and the wordmark drops to just the monogram,
// which keeps eight links on one line without scrolling.

const initials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

const LINKS = [
  { to: "/home", label: "Home", icon: "wind", end: true },
  { to: "/shop", label: "Shop", icon: "cart" },
  { to: "/financing", label: "Prices", icon: "card" },
  { to: "/reviews", label: "Reviews", icon: "star" },
  { to: "/service-areas", label: "Areas", icon: "pin" },
  { to: "/about", label: "About", icon: "award" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/home" className="logo">
          <span className="logo-mark">C</span> <span className="logo-word">CoolAir <span>Co.</span></span>
          <span className="cine-live" style={{ marginLeft: 10 }}><i />Live</span>
        </Link>

        <NavDock>
          {(mouseX) => (
            <>
              <DockItem mouseX={mouseX}>
                <NavLink to="/home" end className="dock-link" aria-label="Home">
                  <Icon name="wind" size={17} />
                  <span>Home</span>
                </NavLink>
              </DockItem>

              <div className="dock-item has-menu">
                <div className="dropdown">
                  <button className="dock-link" aria-label="Services">
                    <Icon name="snowflake" size={17} />
                    <span>Services</span>
                    <Icon name="chevron" size={13} style={{ transform: "rotate(90deg)", opacity: 0.6 }} />
                  </button>
                  <div className="dropdown-menu">
                    {SERVICES.map((s) => (
                      <Link key={s.slug} to={`/services/${s.slug}`}>
                        <Icon name={SERVICE_ICONS[s.slug]} size={16} style={{ marginRight: 8, color: "var(--accent)" }} />
                        {s.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {LINKS.slice(1).map((l) => (
                <DockItem key={l.to} mouseX={mouseX}>
                  <NavLink to={l.to} className="dock-link" aria-label={l.label}>
                    <Icon name={l.icon} size={17} />
                    <span>{l.label}</span>
                  </NavLink>
                </DockItem>
              ))}

              <div className="dock-item has-menu">
                {user ? (
                  <div className="dropdown user-menu">
                    <button className="dock-link" aria-label="Account">
                      <span className="nav-avatar">{initials(user.name)}</span>
                      <span>{user.name.split(" ")[0]}</span>
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
                ) : (
                  <NavLink to="/login" className="dock-link" aria-label="Login">
                    <Icon name="shield" size={17} />
                    <span>Login</span>
                  </NavLink>
                )}
              </div>
            </>
          )}
        </NavDock>

        <Link to="/book" className="cta-glow nav-cta">
          <span>Book now</span>
          <i className="cta-arrow">→</i>
        </Link>
      </div>
    </header>
  );
}
