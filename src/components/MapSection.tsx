"use client";

import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import {
  destinations,
  getCategoryLabel,
  getTagLabel,
  TAG_COLORS,
  type Destination,
  type DestinationTag,
} from "@/data/destinations";

const CATEGORY_COLORS: Record<string, string> = {
  mountain:    "#2563eb",
  heritage:    "#d97706",
  nature:      "#16a34a",
  pilgrimage:  "#9333ea",
  hill:        "#0d9488",
  agriculture: "#65a30d",
};

type ActiveFilter = string | null;

function pinColor(d: Destination, active: ActiveFilter): string | null {
  if (!active) return CATEGORY_COLORS[d.category] ?? "#6b7280";
  if (active in CATEGORY_COLORS) return d.category === active ? CATEGORY_COLORS[active] : null;
  return d.tags?.includes(active as DestinationTag)
    ? TAG_COLORS[active as DestinationTag]
    : null;
}

function createPin(color: string) {
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

function FlyController({ active }: { active: ActiveFilter }) {
  const map = useMap();
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    const handler = (e: Event) => {
      const { lat, lng, id } = (e as CustomEvent<{ lat: number; lng: number; id: string }>).detail;
      map.flyTo([lat, lng], 11, { animate: true, duration: 1.4 });
      setTimeout(() => markersRef.current.get(id)?.openPopup(), 1500);
    };
    document.addEventListener("map-fly-to", handler);
    return () => document.removeEventListener("map-fly-to", handler);
  }, [map]);

  return (
    <>
      {destinations.map((d) => {
        const color = pinColor(d, active);
        if (!color) return null;
        return (
          <Marker
            key={d.id}
            position={[d.coordinates.lat, d.coordinates.lng]}
            icon={createPin(color)}
            ref={(m) => { if (m) markersRef.current.set(d.id, m); }}
          >
            <Popup>
              <div className="text-sm min-w-[140px]">
                <p className="font-bold text-base mb-0.5">{d.name}</p>
                <p className="text-gray-400 text-xs mb-1">{d.region}</p>
                <p className="text-gray-600">{getCategoryLabel(d.category)}</p>
                {d.tags && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {d.tags.map((t) => (
                      <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full text-white font-medium"
                        style={{ background: TAG_COLORS[t] }}>
                        {getTagLabel(t)}
                      </span>
                    ))}
                  </div>
                )}
                {d.elevation && <p className="text-gray-400 text-xs mt-0.5">⛰ {d.elevation}</p>}
                <a href={`/destinations/${d.id}`}
                  className="block mt-2 text-blue-600 hover:underline text-xs font-medium">
                  View full page →
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

// ── Legend item ───────────────────────────────────────────────────────
function LegendItem({
  color, label, active, onClick,
}: { color: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-xs rounded-full px-2.5 py-1 transition-all duration-200 cursor-pointer select-none"
      style={{
        background: active ? `${color}18` : "rgba(0,0,0,0.04)",
        border: `1px solid ${active ? color : "rgba(0,0,0,0.10)"}`,
        color: active ? color : "#6b7280",
        fontWeight: active ? 600 : 400,
      }}
    >
      <span
        className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ background: color, boxShadow: active ? `0 0 6px ${color}80` : "none" }}
      />
      {label}
    </button>
  );
}

export default function MapSection() {
  const [active, setActive] = useState<ActiveFilter>(null);

  const toggle = (key: string) => setActive((prev) => (prev === key ? null : key));

  const categoryEntries = Object.entries(CATEGORY_COLORS) as [string, string][];
  const tagEntries = Object.entries(TAG_COLORS) as [DestinationTag, string][];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Destinations Map</h2>
        <p className="text-gray-500 text-sm sm:text-base">
          Click a legend item to filter · click again to reset
        </p>
      </div>

      {/* ── Category legend ── */}
      <div className="mb-2">
        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
          By Category
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {categoryEntries.map(([cat, color]) => (
            <LegendItem
              key={cat}
              color={color}
              label={getCategoryLabel(cat as Destination["category"])}
              active={active === cat}
              onClick={() => toggle(cat)}
            />
          ))}
        </div>
      </div>

      {/* ── Tag legend ── */}
      <div className="mb-6">
        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 mt-3">
          Family &amp; Leisure
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {tagEntries.map(([tag, color]) => (
            <LegendItem
              key={tag}
              color={color}
              label={getTagLabel(tag)}
              active={active === tag}
              onClick={() => toggle(tag)}
            />
          ))}
        </div>
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
          <FlyController active={active} />
        </MapContainer>
      </div>
    </section>
  );
}
