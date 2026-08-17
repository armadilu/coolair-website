import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth";
import App from "./App.jsx";
import "leaflet/dist/leaflet.css";
import "./styles.css";
import "./cinematic.css"; // cinematic dark layer — remove this line to revert to Warm Air v2
import "./cinematic-extras.css"; // clip-reveal, pinned gallery, review rails, plan pricing
import "./cinematic-fixes.css"; // loading screen, softer CTAs, translucent auth, Riyadh map
import "./dashboard.css";
import "./interactions.css";
import "./bookingcards.css"; // bookings as cards, not a cramped table
import "./glow-auth.css"; // page-wide cursor glow + auth form motion
import "./showcase.css"; // product coverflow + exploded assembly // dock nav, glow CTA, timeline, sliders, zone deck // navbar fit + the three role dashboards

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
