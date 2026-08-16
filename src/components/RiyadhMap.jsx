import { useCallback, useEffect, useRef, useState } from "react";
import L from "leaflet";
import Icon from "./Icon";
import { RIYADH, SERVICE_AREAS } from "../data";

// Pannable, zoomable Riyadh coverage map.
//
// Esri's Dark Gray Canvas rather than OpenStreetMap: OSM renders place names in
// the local language, so every label in Riyadh came out Arabic-only. Esri's
// reference layer is bilingual, Arabic with the romanised name under it. Base
// and labels are separate layers so the labels stay above the coverage circles.
//
// Leaflet's default marker icon loads from a bundled PNG path that breaks under
// Vite, so every marker is a divIcon.

const pin = (extra = "") =>
  L.divIcon({ className: "", html: `<span class="map-pin ${extra}"></span>`, iconSize: [16, 16], iconAnchor: [8, 8] });

const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas";

export default function RiyadhMap({ onZone, focus }) {
  const host = useRef(null);
  const map = useRef(null);
  const meMarker = useRef(null);
  const markers = useRef({});
  const [status, setStatus] = useState("");
  const [asked, setAsked] = useState(false);

  const locate = useCallback(
    (quiet = false) => {
      if (!navigator.geolocation) return setStatus("This browser can't share a location.");
      if (!quiet) setStatus("Finding you…");
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const { latitude: lat, longitude: lng } = coords;
          const m = map.current;
          if (!m) return;
          if (meMarker.current) meMarker.current.remove();
          meMarker.current = L.marker([lat, lng], { icon: pin("is-me") }).addTo(m).bindPopup("<strong>You are here</strong>");
          m.flyTo([lat, lng], 12, { duration: 1.1 });

          const near = SERVICE_AREAS.map((a) => ({ a, d: m.distance([lat, lng], [a.lat, a.lng]) / 1000 }))
            .sort((x, y) => x.d - y.d)[0];

          if (near.d <= 12) {
            setStatus(`Closest crew: ${near.a.zone}, about ${near.d.toFixed(1)} km away. ${near.a.response}.`);
            onZone?.(near.a);
          } else {
            setStatus(`You're about ${near.d.toFixed(0)} km from ${near.a.zone}. Call us and we'll see what we can do.`);
          }
        },
        () => setStatus("Location off. Search by district instead, or drag the map."),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    },
    [onZone]
  );

  useEffect(() => {
    if (map.current || !host.current) return;

    const m = L.map(host.current, {
      scrollWheelZoom: false,
      zoomControl: false,
      // Inertia makes the drag carry, which is what "move around smoothly"
      // wants. Keyboard pan is on so arrows work once the map has focus.
      inertia: true,
      inertiaDeceleration: 2200,
      keyboard: true,
      keyboardPanDelta: 120,
    }).setView([RIYADH.lat, RIYADH.lng], RIYADH.zoom);

    // The wheel scrolls the page until you click the map, so the map can never
    // swallow the scroll on the way past it.
    m.on("click", () => m.scrollWheelZoom.enable());
    m.on("mouseout", () => m.scrollWheelZoom.disable());

    L.control.zoom({ position: "bottomright" }).addTo(m);

    L.tileLayer(`${ESRI}/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`, {
      maxZoom: 16,
      attribution: "Esri, HERE, Garmin, &copy; OpenStreetMap contributors",
    }).addTo(m);

    const labels = L.tileLayer(`${ESRI}/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}`, {
      maxZoom: 16,
      pane: "shadowPane",
    }).addTo(m);
    labels.getContainer()?.classList.add("map-labels");

    SERVICE_AREAS.forEach((a) => {
      L.circle([a.lat, a.lng], {
        radius: 4200, color: "#E2643A", weight: 1.4, fillColor: "#E2643A", fillOpacity: 0.12,
      }).addTo(m);

      markers.current[a.zone] = L.marker([a.lat, a.lng], { icon: pin() })
        .addTo(m)
        .bindPopup(`<strong>${a.zone}</strong><span>${a.arabic}<br/>${a.response} · ${a.districts.length} districts</span>`)
        .on("click", () => onZone?.(a));
    });

    map.current = m;
    return () => { m.remove(); map.current = null; };
  }, [onZone]);

  // Ask once on mount. Browsers may refuse a permission prompt with no user
  // gesture behind it, so the button stays as the reliable path.
  useEffect(() => {
    if (asked || !map.current) return;
    setAsked(true);
    if (!navigator.permissions?.query) return locate(true);
    navigator.permissions.query({ name: "geolocation" }).then((p) => {
      if (p.state === "granted") locate(true);
      else if (p.state === "prompt") setStatus("Share your location and we'll show your nearest crew.");
    }).catch(() => {});
  }, [asked, locate]);

  // Another part of the page picked a zone: fly to it and open its popup.
  useEffect(() => {
    if (!focus || !map.current) return;
    map.current.flyTo([focus.lat, focus.lng], 12, { duration: 0.9 });
    markers.current[focus.zone]?.openPopup();
  }, [focus]);

  return (
    <div className="map-shell">
      <div className="riyadh-map" ref={host} />
      <div className="map-tools">
        <button type="button" onClick={() => locate(false)}>
          <Icon name="pin" size={14} /> Locate me
        </button>
        <button type="button" onClick={() => map.current?.flyTo([RIYADH.lat, RIYADH.lng], RIYADH.zoom, { duration: 0.9 })}>
          <Icon name="wind" size={14} /> Whole city
        </button>
      </div>
      <div className="map-note">
        {status ? <strong>{status}</strong> : <>Drag to move around. Click the map first, then scroll to zoom.</>}
      </div>
    </div>
  );
}
