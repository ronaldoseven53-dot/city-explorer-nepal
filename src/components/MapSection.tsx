"use client";

import L from "leaflet";
import { useEffect, useRef, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { motion, AnimatePresence } from "motion/react";
import { Settings, Plus, Minus, LocateFixed, Search, X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
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

// ── Search filter (client-side over destination names) ────────────────

function useSearch(query: string) {
  if (!query.trim()) return null;
  const q = query.toLowerCase();
  return destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.region.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q)
  );
}

// ── MapSection ────────────────────────────────────────────────────────

export default function MapSection() {
  const { theme }  = useTheme();
  const isDark     = theme === "dark";

  const [active,     setActive]     = useState<string | null>(null);
  const [hovered,    setHovered]    = useState<HoveredPin | null>(null);
  const [showLegend, setShowLegend] = useState(true);
  const [searchVal,  setSearchVal]  = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const mapRef    = useRef<L.Map | null>(null);
  const handleMap = useCallback((m: L.Map) => { mapRef.current = m; }, []);

  const results = useSearch(searchVal);

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

  const flyToResult = (d: Destination) => {
    mapRef.current?.flyTo([d.coordinates.lat, d.coordinates.lng], 11, { animate: true, duration: 1.2 });
    setSearchVal("");
    setShowSearch(false);
  };

  // Tile URL switches between dark (Carto dark) and light (Carto light) on theme change
  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="relative w-full" style={{ height: 460, background: "#080c1a" }}>

      {/* ── Leaflet map ── */}
      <MapContainer
        center={NEPAL_CENTER}
        zoom={7}
        className="absolute inset-0 w-full h-full"
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl={false}
        style={{ background: "#080c1a" }}
      >
        <TileLayer
          key={tileUrl}
          url={tileUrl}
          attribution="&copy; CARTO &copy; OpenStreetMap"
          subdomains="abcd"
          maxZoom={19}
        />
        <MapInstanceCapture onMap={handleMap} />
        <GlowMarkers
          active={active}
          onHover={setHovered}
          onHoverEnd={() => setHovered(null)}
        />
      </MapContainer>

      {/* ── Top-left: title ── */}
      <div
        className="absolute top-3.5 left-3.5 z-[500] pointer-events-none select-none"
        style={{ ...GLASS, borderRadius: 14, padding: "9px 14px" }}
      >
        <p className="text-white font-extrabold text-[13px] tracking-tight leading-none mb-0.5">
          Explore Nepal Map
        </p>
        <p className="text-white/40 text-[10px] font-medium tracking-wide">
          Interactive &amp; Filterable
        </p>
      </div>

      {/* ── Top-center: search bar ── */}
      <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-[500]"
        style={{ width: "min(320px, calc(100% - 240px))" }}>
        <div style={{ ...GLASS, borderRadius: 9999, padding: "7px 14px" }}
          className="flex items-center gap-2">
          <Search size={13} strokeWidth={2.5} color="rgba(255,255,255,0.50)" className="flex-shrink-0" />
          <input
            type="text"
            placeholder="Search destinations…"
            value={searchVal}
            onChange={(e) => { setSearchVal(e.target.value); setShowSearch(true); }}
            onFocus={() => setShowSearch(true)}
            className="flex-1 bg-transparent border-0 outline-none text-white placeholder-white/35 text-[12px] font-medium"
            style={{ minWidth: 0 }}
          />
          <AnimatePresence>
            {searchVal && (
              <motion.button
                onClick={() => { setSearchVal(""); setShowSearch(false); }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className="flex-shrink-0 cursor-pointer"
              >
                <X size={12} color="rgba(255,255,255,0.40)" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Search results dropdown */}
        <AnimatePresence>
          {showSearch && results && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-1.5 overflow-hidden"
              style={{ ...GLASS, borderRadius: 14, maxHeight: 200, overflowY: "auto" }}
            >
              {results.slice(0, 6).map((d) => (
                <button
                  key={d.id}
                  onClick={() => flyToResult(d)}
                  className="w-full text-left px-4 py-2.5 cursor-pointer transition-colors hover:bg-white/[0.07] flex items-center gap-2.5"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <span style={{
                    width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
                    background: COLOR_MAP[d.category] ?? "#6B7280",
                    boxShadow: `0 0 6px ${COLOR_MAP[d.category] ?? "#6B7280"}`,
                  }} />
                  <div>
                    <p className="text-white text-[12px] font-semibold leading-tight">{d.name}</p>
                    <p className="text-white/40 text-[10px]">{d.region}</p>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Top-right: filter toggle ── */}
      <button
        onClick={() => setShowLegend((v) => !v)}
        className="absolute top-3.5 right-3.5 z-[500] flex items-center gap-1.5 cursor-pointer
          transition-opacity duration-150 hover:opacity-80"
        style={{ ...GLASS, borderRadius: 9999, padding: "7px 13px" }}
      >
        <Settings size={12} strokeWidth={2} color="rgba(255,255,255,0.65)" />
        <span className="text-white/65 text-[11px] font-semibold">Filter</span>
      </button>

      {/* ── Left: zoom controls ── */}
      <div
        className="absolute left-3.5 top-1/2 -translate-y-1/2 z-[500] flex flex-col gap-1"
        style={{ ...GLASS, borderRadius: 14, padding: 5 }}
      >
        {([
          { Icon: Plus,        tip: "Zoom in",    fn: () => mapRef.current?.zoomIn()  },
          { Icon: LocateFixed, tip: "Reset view", fn: () => mapRef.current?.flyTo(NEPAL_CENTER, 7, { duration: 1.2 }) },
          { Icon: Minus,       tip: "Zoom out",   fn: () => mapRef.current?.zoomOut() },
        ] as const).map(({ Icon, tip, fn }) => (
          <button
            key={tip}
            onClick={fn}
            aria-label={tip}
            title={tip}
            className="flex items-center justify-center w-8 h-8 rounded-[10px] cursor-pointer
              text-white/55 hover:text-white hover:bg-white/[0.10] transition-all duration-150"
          >
            <Icon size={14} strokeWidth={2} />
          </button>
        ))}
      </div>

      {/* ── Bottom: category legend ── */}
      <AnimatePresence>
        {showLegend && (
          <motion.div
            key="legend"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-[500]
              flex flex-nowrap items-center gap-5 scrollbar-hide overflow-x-auto"
            style={{ ...GLASS, borderRadius: 9999, padding: "7px 16px", maxWidth: "calc(100% - 28px)" }}
          >
            <button
              onClick={() => setActive(null)}
              className="text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer
                transition-all duration-150 flex-shrink-0"
              style={{
                background: active === null ? "rgba(255,255,255,0.16)" : "transparent",
                color:      active === null ? "#fff" : "rgba(255,255,255,0.38)",
              }}
            >
              All
            </button>
            {CATS.map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => toggle(key)}
                className="flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1
                  rounded-full cursor-pointer transition-all duration-150 flex-shrink-0"
                style={{
                  background: active === key ? `${color}20` : "transparent",
                  color:      active === key ? color : "rgba(255,255,255,0.38)",
                  border:     active === key ? `1px solid ${color}50` : "1px solid transparent",
                }}
              >
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: color, display: "inline-block", flexShrink: 0,
                  boxShadow: active === key ? `0 0 6px ${color}` : "none",
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

      {/* Attribution */}
      <p className="absolute bottom-1 right-2 z-[400] text-[8px] text-white/18
        pointer-events-none select-none">
        © CARTO © OpenStreetMap contributors
      </p>
    </div>
  );
}
