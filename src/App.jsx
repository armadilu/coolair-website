import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatConcierge from "./components/ChatConcierge";
import Loader from "./components/Loader";
import { useAuth } from "./auth";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import ServicePage from "./pages/ServicePage";
import Shop from "./pages/Shop";
import Financing from "./pages/Financing";
import Reviews from "./pages/Reviews";
import ServiceAreas from "./pages/ServiceAreas";
import About from "./pages/About";
import Book from "./pages/Book";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

// Booking writes a row against a user id, so there has to be a user. Anyone
// arriving signed out is sent to login with the destination attached, and
// dropped back here the moment they are in.
function RequireAuth({ children }) {
  const { user, authReady } = useAuth();
  const loc = useLocation();

  // Restoring a Supabase session is async. Redirecting before it resolves
  // bounces a signed-in customer to the login page for no reason.
  if (!user && !authReady) return <div style={{ minHeight: "70vh" }} />;
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(loc.pathname + loc.search)}`} replace />;
  return children;
}

export default function App() {
  const { pathname } = useLocation();
  const chrome = pathname !== "/landing";

  // The intro plays on every full load of the site. It does not replay on
  // internal navigation, because the app never remounts for that — so this
  // costs you the intro when you actually arrive, and nothing after.
  const [booting, setBooting] = useState(() => {
    if (typeof window === "undefined") return false;
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const finishBoot = useCallback(() => setBooting(false), []);

  return (
    <>
      {booting && <Loader onDone={finishBoot} />}
      <ScrollToTop />
      {chrome && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/services/:slug" element={<ServicePage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/financing" element={<Financing />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/service-areas" element={<ServiceAreas />} />
        <Route path="/about" element={<About />} />
        <Route path="/book" element={<RequireAuth><Book /></RequireAuth>} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Home />} />
      </Routes>
      {chrome && <Footer />}
      <ChatConcierge />
    </>
  );
}
