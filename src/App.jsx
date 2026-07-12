import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatConcierge from "./components/ChatConcierge";
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

export default function App() {
  const { pathname } = useLocation();
  const isLanding = pathname === "/";
  return (
    <>
      <ScrollToTop />
      {!isLanding && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/services/:slug" element={<ServicePage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/financing" element={<Financing />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/service-areas" element={<ServiceAreas />} />
        <Route path="/about" element={<About />} />
        <Route path="/book" element={<Book />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Home />} />
      </Routes>
      {!isLanding && <Footer />}
      <ChatConcierge />
    </>
  );
}
