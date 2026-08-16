import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { SERVICES } from "../data";
import Icon, { SERVICE_ICONS } from "./Icon";
import NavDock, { DockItem } from "./NavDock";

// Every link on the bar, each with an icon, magnifying under the cursor.
// Services is a dropdown again. No hamburger: below the width where labels stop
// fitting the dock goes icon-only, and the wordmark drops to just the monogram,
// which keeps eight links on one line without scrolling.
//
// The menus open on click and are held in state, not driven by CSS :hover.
// Hover never fires on a touch screen, and an old mobile rule in styles.css
// forced .dropdown-menu to display:flex below 900px, so both menus sat
// permanently open on top of the page.

const initials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

const LINKS = [
  { to: "/shop", label: "Shop", icon: "cart" },
  { to: "/financing", label: "Prices", icon: "card" },
  { to: "/reviews", label: "Reviews", icon: "star" },
  { to: "/service-areas", label: "Areas", icon: "pin" },
  { to: "/about", label: "About", icon: "award" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(null); // "services" | "account" | null
  const bar = useRef(null);

  const close = () => setOpen(null);
  const toggle = (key) => setOpen((cur) => (cur === key ? null : key));

  // Navigating closes whatever is open.
  useEffect(() => setOpen(null), [pathname]);

  // Escape, or a click anywhere outside the bar, closes it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(null);
    const onDown = (e) => { if (!bar.current?.contains(e.target)) setOpen(null); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <header className="navbar">
      <div className="container navbar-inner" ref={bar}>
        <Link to="/home" className="logo">
          <span className="logo-mark">C</span>{" "}
          <span className="logo-word">CoolAir <span>Co.</span></span>
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

              <div className={`dock-item has-menu ${open === "services" ? "is-open" : ""}`}>
                <div className="dropdown">
                  <button
                    className="dock-link"
                    aria-label="Services"
                    aria-expanded={open === "services"}
                    onClick={() => toggle("services")}
                  >
                    <Icon name="snowflake" size={17} />
                    <span>Services</span>
                    <Icon name="chevron" size={13} style={{ transform: "rotate(90deg)", opacity: 0.6 }} />
                  </button>
                  <div className="dropdown-menu">
                    {SERVICES.map((s) => (
                      <Link key={s.slug} to={`/services/${s.slug}`} onClick={close}>
                        <Icon name={SERVICE_ICONS[s.slug]} size={16} style={{ marginRight: 8, color: "var(--accent)" }} />
                        {s.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {LINKS.map((l) => (
                <DockItem key={l.to} mouseX={mouseX}>
                  <NavLink to={l.to} className="dock-link" aria-label={l.label}>
                    <Icon name={l.icon} size={17} />
                    <span>{l.label}</span>
                  </NavLink>
                </DockItem>
              ))}

              <div className={`dock-item has-menu ${open === "account" ? "is-open" : ""}`}>
                {user ? (
                  <div className="dropdown user-menu">
                    <button
                      className="dock-link"
                      aria-label="Account"
                      aria-expanded={open === "account"}
                      onClick={() => toggle("account")}
                    >
                      <span className="nav-avatar">{initials(user.name)}</span>
                      <span>{user.name.split(" ")[0]}</span>
                    </button>
                    <div className="dropdown-menu">
                      <Link to="/dashboard" onClick={close}>
                        <Icon name="award" size={15} style={{ marginRight: 8, color: "var(--accent)" }} />
                        My dashboard
                      </Link>
                      <button onClick={() => { close(); logout(); navigate("/"); }}>
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
