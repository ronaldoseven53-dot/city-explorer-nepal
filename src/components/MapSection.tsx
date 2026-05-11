"use client";

import L from "leaflet";
import { useEffect, useRef, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { motion, AnimatePresence } from "motion/react";
import { destinations, type Destination } from "@/data/destinations";

// ── Category config ───────────────────────────────────────────────────

const CATS: { key: string; label: string; color: string }[] = [
  { key: "mountain",    label: "Trekking",    color: "#3B82F6" },
  { key: "heritage",    label: "Culture",     color: "#F97316" },
  { key: "nature",      label: "Nature",      color: "#22C55E" },
  { key: "pilgrimage",  label: "Pilgrimage",  color: "#A855F7" },
  { key: "hill",        label: "Hillside",    color: "#14B8A6" },
  { key: "agriculture", label: "Agriculture", color: "#84CC16" },
];

const COLOR_MAP = Object.fromEntries(CATS.map((c) => [c.key, c.color]));
const LABEL_MAP = Object.fromEntries(CATS.map((c) => [c.key, c.label]));

const NEPAL_CENTER: [number, number] = [28.3949, 84.124];

// ── CSS ping animation (injected once) ───────────────────────────────

function ensurePingStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById("map-ping-kf")) return;
  const s = document.createElement("style");
  s.id = "map-ping-kf";
  s.textContent = `
    @keyframes mapPing {
      0%   { transform: scale(1);   opacity: 0.60; }
      70%  { transform: scale(2.8); opacity: 0;    }
      100% { transform: scale(2.8); opacity: 0;    }
    }
    .mp-ring { animation: mapPing 2.4s cubic-bezier(0,0,.2,1) infinite; will-change: transform,opacity; }
  `;
  document.head.appendChild(s);
}

// ── Glow marker factory ───────────────────────────────────────────────

function glowIcon(color: string, dim = false) {
  const a = dim ? "0.22" : "1";
  return L.divIcon({
    html: `<div style="position:relative;width:22px;height:22px;opacity:${a}">
      <div class="mp-ring" style="position:absolute;inset:-5px;border-radius:50%;background:${color}"></div>
      <div style="position:absolute;inset:0;border-radius:50%;background:${color};
        border:2.5px solid rgba(255,255,255,0.90);
        box-shadow:0 0 16px ${color},0 0 6px ${color},0 2px 10px rgba(0,0,0,0.55)">
      </div>
    </div>`,
    className: "",
    iconSize:    [22, 22],
    iconAnchor:  [11, 11],
    popupAnchor: [0, -16],
  });
}

// ── Glass style ───────────────────────────────────────────────────────

const GLASS: React.CSSProperties = {
  background:           "rgba(4,8,22,0.75)",
  backdropFilter:       "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border:               "1px solid rgba(255,255,255,0.13)",
};

// ── MapInstanceCapture ────────────────────────────────────────────────

function MapInstanceCapture({ onMap }: { onMap: (m: L.Map) => void }) {
  const map = useMap();
  useEffect(() => { onMap(map); }, [map, onMap]);
  return null;
}

// ── GlowMarkers ───────────────────────────────────────────────────────

interface HoveredPin { dest: Destination; x: number; y: number }

function GlowMarkers({
  active,
  onHover,
  onHoverEnd,
}: {
  active: string | null;
  onHover: (s: HoveredPin) => void;
  onHoverEnd: () => void;
}) {
  const map  = useMap();
  const refs = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    const h = (e: Event) => {
      const { lat, lng, id } = (e as CustomEvent<{ lat: number; lng: number; id: string }>).detail;
      map.flyTo([lat, lng], 11, { animate: true, duration: 1.4 });
      setTimeout(() => refs.current.get(id)?.openPopup(), 1500);
    };
    document.addEventListener("map-fly-to", h);
    return () => document.removeEventListener("map-fly-to", h);
  }, [map]);

  return (
    <>
      {destinations.map((d) => {
        const color = COLOR_MAP[d.category] ?? "#6B7280";
        const dim   = active !== null && d.category !== active;
        return (
          <Marker
            key={d.id}
            position={[d.coordinates.lat, d.coordinates.lng]}
            icon={glowIcon(color, dim)}
            ref={(m) => { if (m) refs.current.set(d.id, m); }}
            eventHandlers={{
              mouseover: (e) => {
                const pt = map.latLngToContainerPoint(e.target.getLatLng());
                onHover({ dest: d, x: pt.x, y: pt.y });
              },
              mouseout: () => onHoverEnd(),
              click:    () => map.flyTo(
                [d.coordinates.lat, d.coordinates.lng], 11,
                { animate: true, duration: 1.2 }
              ),
            }}
          />
        );
      })}
    </>
  );
}

// ── MapSection ────────────────────────────────────────────────────────

export default function MapSection() {

  const [active,     setActive]     = useState<string | null>(null);
  const [hovered,    setHovered]    = useState<HoveredPin | null>(null);
  const [showLegend, setShowLegend] = useState(true);

  const mapRef    = useRef<L.Map | null>(null);
  const handleMap = useCallback((m: L.Map) => { mapRef.current = m; }, []);

  useEffect(() => { ensurePingStyles(); }, []);

  // Listen for programmatic filter trigger
  useEffect(() => {
    const h = (e: Event) => {
      const { key } = (e as CustomEvent<{ key: string }>).detail;
      setActive(key);
      setShowLegend(true);
    };
    document.addEventListener("map-filter", h);
    return () => document.removeEventListener("map-filter", h);
  }, []);

  const toggle = (key: string) => setActive((p) => (p === key ? null : key));

  return (
    <div className="relative w-full" style={{ height: 460 }}>

      {/* ── Leaflet map ── */}
      <MapContainer
        center={NEPAL_CENTER}
        zoom={7}
        className="absolute inset-0 w-full h-full"
        scrollWheelZoom={false}
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />
        <MapInstanceCapture onMap={handleMap} />
        <GlowMarkers
          active={active}
          onHover={setHovered}
          onHoverEnd={() => setHovered(null)}
        />
      </MapContainer>

      {/* ── Bottom: category filter pills ── */}
      <AnimatePresence>
        {showLegend && (
          <motion.div
            key="legend"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[500]
              flex flex-nowrap items-center gap-1.5 scrollbar-hide overflow-x-auto"
            style={{
              background: "rgba(255,255,255,0.90)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(0,0,0,0.10)",
              boxShadow: "0 2px 16px rgba(0,0,0,0.12)",
              borderRadius: 9999,
              padding: "5px 12px",
              maxWidth: "calc(100% - 28px)",
            }}
          >
            <button
              onClick={() => setActive(null)}
              className="text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-all duration-150 flex-shrink-0"
              style={{
                background: active === null ? "rgba(0,0,0,0.10)" : "transparent",
                color:      active === null ? "#111" : "rgba(0,0,0,0.40)",
              }}
            >
              All
            </button>
            {CATS.map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => toggle(key)}
                className="flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-all duration-150 flex-shrink-0"
                style={{
                  background: active === key ? `${color}18` : "transparent",
                  color:      active === key ? color : "rgba(0,0,0,0.40)",
                  border:     active === key ? `1px solid ${color}60` : "1px solid transparent",
                }}
              >
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: color, display: "inline-block", flexShrink: 0,
                  boxShadow: active === key ? `0 0 5px ${color}` : "none",
                }} />
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hover tooltip ── */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="tooltip"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.12 }}
            className="absolute z-[600] pointer-events-none"
            style={{
              left:         hovered.x + 18,
              top:          hovered.y - 20,
              ...GLASS,
              borderRadius: 14,
              padding:      "10px 12px",
              minWidth:     168,
              transform:    "translateY(-50%)",
            }}
          >
            {hovered.dest.placeholderImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`${hovered.dest.placeholderImage.split("?")[0]}?w=240&q=70`}
                alt={hovered.dest.name}
                style={{
                  width: "100%", height: 70, objectFit: "cover",
                  borderRadius: 8, marginBottom: 8, display: "block",
                }}
              />
            )}
            <p className="text-white font-bold text-[12px] leading-tight mb-0.5">
              {hovered.dest.name}
            </p>
            <p className="text-white/45 text-[10px] mb-1.5">{hovered.dest.region}</p>
            <div className="flex items-center gap-1.5">
              <span style={{
                width: 7, height: 7, borderRadius: "50%", display: "inline-block",
                background:  COLOR_MAP[hovered.dest.category],
                boxShadow:   `0 0 7px ${COLOR_MAP[hovered.dest.category]}`,
              }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: COLOR_MAP[hovered.dest.category] }}>
                {LABEL_MAP[hovered.dest.category]}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
}
