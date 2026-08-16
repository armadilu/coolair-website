import { useCallback, useEffect, useRef, useState } from "react";
import L from "leaflet";
import Icon from "./Icon";
import { RIYADH, SERVICE_AREAS } from "../data";

// Pannable, zoomable Riyadh coverage map with a locate-me button.
//
// Leaflet directly rather than react-leaflet: this is one map with fixed
// markers, and the imperative API is smaller than the wrapper. Tiles are
// OpenStreetMap, so there is no API key and no billing account. The dark look
// comes from a CSS filter on the tile pane, not a second tile provider.
//
// Leaflet's default marker icon is loaded from a bundled PNG path that breaks
// under Vite, so every marker here is a divIcon — plain CSS, nothing to 404.

const pin = (extra = "") =>
  L.divIcon({ className: "", html: `<span class="map-pin ${extra}"></span>`, iconSize: [16, 16], iconAnchor: [8, 8] });

export default function RiyadhMap({ onZone }) {
  const host = useRef(null);
  const map = useRef(null);
  const meMarker = useRef(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (map.current || !host.current) return;

    const m = L.map(host.current, { scrollWheelZoom: false, zoomControl: true }).setView(
      [RIYADH.lat, RIYADH.lng],
      RIYADH.zoom
    );
    // Wheel scrolls the page by default; the map takes over once clicked, so
    // the map can never swallow the scroll on the way past it.
    m.on("click", () => m.scrollWheelZoom.enable());
    m.on("mouseout", () => m.scrollWheelZoom.disable());

    // Esri's Dark Gray Canvas rather than OpenStreetMap. Two reasons: OSM
    // renders place names in the local language, so every label in Riyadh came
    // out in Arabic, and Esri's reference layer is romanised. It is also dark
    // natively, so the tiles no longer need a CSS invert filter to fit.
    // Base and labels are separate layers, which keeps the labels crisp above
    // the coverage circles instead of buried under them.
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 16, attribution: "Esri, HERE, Garmin, &copy; OpenStreetMap contributors" }
    ).addTo(m);

    const labels = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 16, pane: "shadowPane" }
    ).addTo(m);
    labels.getContainer()?.classList.add("map-labels");

    SERVICE_AREAS.forEach((a) => {
      L.circle([a.lat, a.lng], {
        radius: 4200,
        color: "#E2643A",
        weight: 1,
        fillColor: "#E2643A",
        fillOpacity: 0.10,
      }).addTo(m);

      L.marker([a.lat, a.lng], { icon: pin() })
        .addTo(m)
        .bindPopup(
          `<strong>${a.zone}</strong><span>${a.arabic}<br/>${a.response} · ${a.districts.length} districts</span>`
        )
        .on("click", () => onZone?.(a));
    });

    map.current = m;
    return () => {
      m.remove();
      map.current = null;
    };
  }, [onZone]);

  const locate = useCallback(() => {
    if (!navigator.geolocation) return setStatus("This browser can't share a location.");
    setStatus("Finding you…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords;
        const m = map.current;
        if (!m) return;
        if (meMarker.current) meMarker.current.remove();
        meMarker.current = L.marker([lat, lng], { icon: pin("is-me") }).addTo(m).bindPopup("<strong>You are here</strong>");
        m.setView([lat, lng], 13);

        // Nearest zone by straight-line distance — good enough to tell someone
        // which crew covers them.
        const near = SERVICE_AREAS.map((a) => ({
          a,
          d: m.distance([lat, lng], [a.lat, a.lng]) / 1000,
        })).sort((x, y) => x.d - y.d)[0];

        if (near.d <= 12) {
          setStatus(`Closest crew: ${near.a.zone} (${near.a.response.toLowerCase()}), about ${near.d.toFixed(1)} km away.`);
          onZone?.(near.a);
        } else {
          setStatus(`You're about ${near.d.toFixed(0)} km from ${near.a.zone}. Call us and we'll see what we can do.`);
        }
      },
      () => setStatus("Location permission was declined. Search by district instead."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [onZone]);

  const reset = () => map.current?.setView([RIYADH.lat, RIYADH.lng], RIYADH.zoom);

  return (
    <div className="map-shell">
      <div className="riyadh-map" ref={host} />
      <div className="map-tools">
        <button type="button" onClick={locate}>
          <Icon name="pin" size={14} /> Locate me
        </button>
        <button type="button" onClick={reset}>
          <Icon name="wind" size={14} /> Whole city
        </button>
      </div>
      <div className="map-note">
        {status ? <strong>{status}</strong> : <>Drag to pan. Click the map first, then scroll to zoom.</>}
      </div>
    </div>
  );
}
