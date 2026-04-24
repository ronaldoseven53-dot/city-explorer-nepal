"use client";

import L from "leaflet";
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { destinations, getCategoryLabel } from "@/data/destinations";

const categoryColors: Record<string, string> = {
  mountain:   "#2563eb",
  heritage:   "#d97706",
  nature:     "#16a34a",
  pilgrimage: "#9333ea",
  hill:       "#0d9488",
};

function createPin(category: string) {
  const color = categoryColors[category] ?? "#6b7280";
  return L.divIcon({
    html: `<div style="
      width:18px;height:18px;
      background:${color};
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 2px 8px rgba(0,0,0,0.35);
    "></div>`,
    className: "",
    iconSize:   [18, 18],
    iconAnchor: [9,  9],
    popupAnchor:[0, -14],
  });
}

const NEPAL_CENTER: [number, number] = [28.3949, 84.124];

// Listens for "map-fly-to" custom events and animates the map
function FlyController() {
  const map = useMap();
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    const handler = (e: Event) => {
      const { lat, lng, id } = (e as CustomEvent<{ lat: number; lng: number; id: string }>).detail;
      map.flyTo([lat, lng], 11, { animate: true, duration: 1.4 });
      // Open the popup after the fly animation settles
      setTimeout(() => {
        const marker = markersRef.current.get(id);
        marker?.openPopup();
      }, 1500);
    };
    document.addEventListener("map-fly-to", handler);
    return () => document.removeEventListener("map-fly-to", handler);
  }, [map]);

  return (
    <>
      {destinations.map((d) => (
        <Marker
          key={d.id}
          position={[d.coordinates.lat, d.coordinates.lng]}
          icon={createPin(d.category)}
          ref={(marker) => {
            if (marker) markersRef.current.set(d.id, marker);
          }}
        >
          <Popup>
            <div className="text-sm min-w-[140px]">
              <p className="font-bold text-base mb-0.5">{d.name}</p>
              <p className="text-gray-400 text-xs mb-1">{d.region}</p>
              <p className="text-gray-600">{getCategoryLabel(d.category)}</p>
              {d.elevation && <p className="text-gray-400 text-xs mt-0.5">⛰ {d.elevation}</p>}
              <a
                href={`/destinations/${d.id}`}
                className="block mt-2 text-blue-600 hover:underline text-xs font-medium"
              >
                View full page →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

export default function MapSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Destinations Map</h2>
        <p className="text-gray-500 text-sm sm:text-base">
          Click any card below to fly the map to that destination
        </p>
      </div>

      {/* Colour legend */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {Object.entries(categoryColors).map(([cat, color]) => (
          <span key={cat} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span style={{ background: color }} className="inline-block w-3 h-3 rounded-full border-2 border-white shadow" />
            {getCategoryLabel(cat as Parameters<typeof getCategoryLabel>[0])}
          </span>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 h-[420px] sm:h-[500px]">
        <MapContainer
          center={NEPAL_CENTER}
          zoom={7}
          className="h-full w-full"
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FlyController />
        </MapContainer>
      </div>
    </section>
  );
}
