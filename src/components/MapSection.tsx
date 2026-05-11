"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Settings, Plus, Minus, LocateFixed, X } from "lucide-react";
import { setOptions as gmSetOptions, importLibrary as gmImport } from "@googlemaps/js-api-loader";
import { useTheme } from "@/context/ThemeContext";
import { destinations, type Destination } from "@/data/destinations";

// ── Category config ───────────────────────────────────────────────────

const CATS = [
  { key: "mountain",    label: "Trekking",    color: "#3B82F6" },
  { key: "heritage",    label: "Culture",     color: "#F97316" },
  { key: "nature",      label: "Nature",      color: "#22C55E" },
  { key: "pilgrimage",  label: "Pilgrimage",  color: "#A855F7" },
  { key: "hill",        label: "Hillside",    color: "#14B8A6" },
  { key: "agriculture", label: "Agriculture", color: "#84CC16" },
] as const;

const COLOR_MAP = Object.fromEntries(CATS.map((c) => [c.key, c.color]));
const LABEL_MAP = Object.fromEntries(CATS.map((c) => [c.key, c.label]));

const NEPAL_CENTER = { lat: 28.3949, lng: 84.124 };
const NEPAL_SW     = { lat: 26.3, lng: 80.0 };
const NEPAL_NE     = { lat: 30.5, lng: 88.2 };

// ── Silver style (light mode) ─────────────────────────────────────────
// Google Maps Styling Wizard "Silver" preset
const SILVER_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry",                                                     stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.text.fill",                                             stylers: [{ color: "#616161" }] },
  { elementType: "labels.text.stroke",                                           stylers: [{ color: "#f5f5f5" }] },
  { featureType: "administrative.land_parcel", elementType: "labels.text.fill",  stylers: [{ color: "#bdbdbd" }] },
  { featureType: "poi",          elementType: "geometry",          stylers: [{ color: "#eeeeee" }] },
  { featureType: "poi",          elementType: "labels.text.fill",  stylers: [{ color: "#757575" }] },
  { featureType: "poi.park",     elementType: "geometry",          stylers: [{ color: "#e5e5e5" }] },
  { featureType: "poi.park",     elementType: "labels.text.fill",  stylers: [{ color: "#9e9e9e" }] },
  { featureType: "road",         elementType: "geometry",          stylers: [{ color: "#ffffff" }] },
  { featureType: "road.arterial",elementType: "labels.text.fill",  stylers: [{ color: "#757575" }] },
  { featureType: "road.highway", elementType: "geometry",          stylers: [{ color: "#dadada" }] },
  { featureType: "road.highway", elementType: "labels.text.fill",  stylers: [{ color: "#616161" }] },
  { featureType: "road.local",   elementType: "labels.text.fill",  stylers: [{ color: "#9e9e9e" }] },
  { featureType: "transit.line", elementType: "geometry",          stylers: [{ color: "#e5e5e5" }] },
  { featureType: "transit.station", elementType: "geometry",       stylers: [{ color: "#eeeeee" }] },
  { featureType: "water",        elementType: "geometry",          stylers: [{ color: "#c9c9c9" }] },
  { featureType: "water",        elementType: "labels.text.fill",  stylers: [{ color: "#9e9e9e" }] },
];

// ── Aubergine/Night style (dark mode) — landmass brightness +10% ──────
// Base: Google "Night" theme. Landscape/geometry boosted ~10% brightness
// for improved readability on high-DPI screens per the user request.
const DARK_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry",                                                      stylers: [{ color: "#203055" }] }, // was #1d2c4d +10%
  { elementType: "labels.text.fill",                                              stylers: [{ color: "#8ec3b9" }] },
  { elementType: "labels.text.stroke",                                            stylers: [{ color: "#1a3646" }] },
  { featureType: "administrative.country",   elementType: "geometry.stroke",      stylers: [{ color: "#4b6878" }] },
  { featureType: "administrative.land_parcel", elementType: "labels.text.fill",   stylers: [{ color: "#64779e" }] },
  { featureType: "administrative.province",  elementType: "geometry.stroke",      stylers: [{ color: "#4b6878" }] },
  { featureType: "landscape.man_made",       elementType: "geometry.stroke",      stylers: [{ color: "#334e87" }] },
  { featureType: "landscape.natural",        elementType: "geometry",             stylers: [{ color: "#024461" }] }, // was #023e58 +10%
  { featureType: "poi",         elementType: "geometry",           stylers: [{ color: "#2d4475" }] }, // was #283d6a +10%
  { featureType: "poi",         elementType: "labels.text.fill",   stylers: [{ color: "#6f9ba5" }] },
  { featureType: "poi",         elementType: "labels.text.stroke", stylers: [{ color: "#1d2c4d" }] },
  { featureType: "poi.park",    elementType: "geometry.fill",      stylers: [{ color: "#024461" }] },
  { featureType: "poi.park",    elementType: "labels.text.fill",   stylers: [{ color: "#3C7680" }] },
  { featureType: "road",        elementType: "geometry",           stylers: [{ color: "#304a7d" }] },
  { featureType: "road",        elementType: "labels.text.fill",   stylers: [{ color: "#98a5be" }] },
  { featureType: "road",        elementType: "labels.text.stroke", stylers: [{ color: "#1d2c4d" }] },
  { featureType: "road.highway",elementType: "geometry",           stylers: [{ color: "#2c6675" }] },
  { featureType: "road.highway",elementType: "geometry.stroke",    stylers: [{ color: "#255763" }] },
  { featureType: "road.highway",elementType: "labels.text.fill",   stylers: [{ color: "#b0d5ce" }] },
  { featureType: "road.highway",elementType: "labels.text.stroke", stylers: [{ color: "#023747" }] },
  { featureType: "transit",     elementType: "labels.text.fill",   stylers: [{ color: "#98a5be" }] },
  { featureType: "transit",     elementType: "labels.text.stroke", stylers: [{ color: "#1d2c4d" }] },
  { featureType: "transit.line",    elementType: "geometry.fill",  stylers: [{ color: "#283d6a" }] },
  { featureType: "transit.station", elementType: "geometry",       stylers: [{ color: "#3a4762" }] },
  { featureType: "water",       elementType: "geometry",           stylers: [{ color: "#0e1626" }] },
  { featureType: "water",       elementType: "labels.text.fill",   stylers: [{ color: "#4e6d70" }] },
];

// POI labels hidden — appended when zoom < 14
const POI_HIDDEN: google.maps.MapTypeStyle = {
  featureType: "poi",
  elementType: "labels",
  stylers: [{ visibility: "off" }],
};

function getMapStyles(isDark: boolean, showPoi: boolean): google.maps.MapTypeStyle[] {
  const base = isDark ? DARK_STYLE : SILVER_STYLE;
  return showPoi ? base : [...base, POI_HIDDEN];
}

// ── Smooth FlyTo — zoom-out → pan → zoom-in "curve" ──────────────────

function smoothFlyTo(
  map: google.maps.Map,
  position: google.maps.LatLngLiteral,
  targetZoom = 11
) {
  const fromZoom  = map.getZoom() ?? 7;
  const curveDip  = Math.max(6, Math.min(fromZoom, targetZoom) - 1);
  map.setZoom(curveDip);
  setTimeout(() => {
    map.panTo(position);
    setTimeout(() => map.setZoom(targetZoom), 450);
  }, 280);
}

// ── Glow SVG data-URL icon ────────────────────────────────────────────

function glowSvgUrl(color: string): string {
  // SVG with Gaussian blur "glow" behind the dot, white border
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36">
    <defs>
      <filter id="g" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <circle cx="18" cy="18" r="8" fill="${color}" stroke="white" stroke-width="2.8" filter="url(%23g)"/>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// ── Autocomplete dropdown glassmorphism styles (injected once) ────────

function injectPacStyles() {
  if (document.getElementById("pac-glass-css")) return;
  const s = document.createElement("style");
  s.id = "pac-glass-css";
  s.textContent = `
    .pac-container {
      background: rgba(4,8,22,0.90) !important;
      backdrop-filter: blur(22px) !important;
      border: 1px solid rgba(255,255,255,0.12) !important;
      border-radius: 14px !important;
      box-shadow: 0 8px 32px rgba(0,0,0,0.45) !important;
      margin-top: 6px !important;
      overflow: hidden;
      font-family: inherit !important;
    }
    .pac-item {
      padding: 9px 14px !important;
      border-top: 1px solid rgba(255,255,255,0.06) !important;
      cursor: pointer;
      color: rgba(255,255,255,0.72) !important;
      font-size: 12px !important;
      line-height: 1.4 !important;
      transition: background 0.12s;
    }
    .pac-item:first-child { border-top: none !important; }
    .pac-item:hover, .pac-item-selected {
      background: rgba(255,255,255,0.07) !important;
    }
    .pac-item-query {
      color: rgba(255,255,255,0.92) !important;
      font-weight: 600 !important;
      font-size: 12px !important;
    }
    .pac-icon { display: none !important; }
    .pac-matched { color: #f97316 !important; font-weight: 700; }
    .pac-logo::after { display: none !important; }
  `;
  document.head.appendChild(s);
}

// ── Glass style constant ──────────────────────────────────────────────

const GLASS: React.CSSProperties = {
  background:           "rgba(4,8,22,0.75)",
  backdropFilter:       "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border:               "1px solid rgba(255,255,255,0.13)",
};

// ── MapSection ────────────────────────────────────────────────────────

interface HoveredPin { dest: Destination; x: number; y: number }

export default function MapSection() {
  const { theme } = useTheme();
  const isDark    = theme === "dark";
  const isDarkRef = useRef(isDark);

  const containerRef  = useRef<HTMLDivElement>(null);
  const mapRef        = useRef<google.maps.Map | null>(null);
  const markersRef    = useRef<Map<string, google.maps.Marker>>(new Map());
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [active,      setActive]      = useState<string | null>(null);
  const [hovered,     setHovered]     = useState<HoveredPin | null>(null);
  const [showLegend,  setShowLegend]  = useState(true);
  const [showPoi,     setShowPoi]     = useState(false);
  const [apiLoaded,   setApiLoaded]   = useState(false);
  const [apiError,    setApiError]    = useState<string | null>(null);
  const [searchVal,   setSearchVal]   = useState("");
  const [searching,   setSearching]   = useState(false);

  // Keep isDark ref current for closures inside map event listeners
  useEffect(() => { isDarkRef.current = isDark; }, [isDark]);

  // ── Load Google Maps JS API ───────────────────────────────────────
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === "your_google_maps_api_key_here") {
      setApiError("no-key");
      return;
    }
    // New @googlemaps/js-api-loader v2 functional API (key/v, not apiKey/version)
    gmSetOptions({ key: apiKey, v: "weekly" });
    Promise.all([gmImport("maps"), gmImport("places")]).then(() => {
      injectPacStyles();
      setApiLoaded(true);
    }).catch((err: unknown) => {
      console.error("[MapSection] Google Maps failed to load:", err);
      setApiError("load-failed");
    });
  }, []);

  // ── Create map + markers + autocomplete once API is ready ─────────
  useEffect(() => {
    if (!apiLoaded || !containerRef.current || mapRef.current) return;

    const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapOptions: Record<string, any> = {
      center:             NEPAL_CENTER,
      zoom:               7,
      mapTypeId:          "roadmap",   // explicit — prevents blank grey/black during load
      backgroundColor:    "#e8e8e8",   // light grey placeholder while tiles load
      zoomControl:        false,
      streetViewControl:  false,
      fullscreenControl:  false,
      mapTypeControl:     false,
      rotateControl:      !!mapId,
      gestureHandling:    "cooperative",
      clickableIcons:     true,
    };

    if (mapId) {
      // Vector mode — enables 3D buildings, 45° tilt, right-click rotate
      Object.assign(mapOptions, {
        mapId,
        tilt:                   0,
        heading:                0,
        tiltInteractionEnabled: true,
        renderingType:          "VECTOR",
      });
    } else {
      // Raster mode — JSON styles, instant dark/light switching
      mapOptions.styles = getMapStyles(isDark, false);
    }

    const map = new google.maps.Map(containerRef.current, mapOptions);
    mapRef.current = map;

    // Inertia is built into Google Maps gestureHandling — enabled by default.
    // POI label visibility: hide at zoom < 14, show at zoom ≥ 14
    map.addListener("zoom_changed", () => {
      const z    = map.getZoom() ?? 7;
      const show = z >= 14;
      setShowPoi(show);
      if (!mapId) {
        map.setOptions({ styles: getMapStyles(isDarkRef.current, show) });
      }
    });

    // ── Glow markers ─────────────────────────────────────────────────
    destinations.forEach((dest) => {
      const color  = COLOR_MAP[dest.category] ?? "#6B7280";
      const marker = new google.maps.Marker({
        map,
        position:  { lat: dest.coordinates.lat, lng: dest.coordinates.lng },
        title:     dest.name,
        icon: {
          url:        glowSvgUrl(color),
          scaledSize: new google.maps.Size(36, 36),
          anchor:     new google.maps.Point(18, 18),
        },
        optimized: false, // required for SVG data-URL icons
      });

      // Hover tooltip — derive pixel position from the DOM event
      marker.addListener("mouseover", (e: google.maps.MapMouseEvent) => {
        const dom  = e.domEvent as MouseEvent;
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        setHovered({ dest, x: dom.clientX - rect.left, y: dom.clientY - rect.top });
      });
      marker.addListener("mouseout",  () => setHovered(null));

      // Click: smart FlyTo with zoom-out → pan → zoom-in curve
      marker.addListener("click", () => {
        setHovered(null);
        smoothFlyTo(map, { lat: dest.coordinates.lat, lng: dest.coordinates.lng }, 11);
      });

      markersRef.current.set(dest.id, marker);
    });

    // ── Places Autocomplete ───────────────────────────────────────────
    if (searchInputRef.current) {
      const bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(NEPAL_SW.lat, NEPAL_SW.lng),
        new google.maps.LatLng(NEPAL_NE.lat, NEPAL_NE.lng)
      );
      const ac = new google.maps.places.Autocomplete(searchInputRef.current, {
        bounds,
        strictBounds:           false,
        componentRestrictions:  { country: "np" },
        fields:                 ["geometry", "name", "formatted_address"],
      });

      ac.addListener("place_changed", () => {
        const place = ac.getPlace();
        setSearchVal(place.name ?? "");
        setSearching(false);
        if (place.geometry?.location) {
          smoothFlyTo(
            map,
            { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() },
            13
          );
        }
      });
    }

    return () => {
      // Remove all markers on unmount
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current.clear();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiLoaded]);

  // ── Dynamic style update when theme changes (raster mode only) ────
  useEffect(() => {
    const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;
    if (!mapRef.current || mapId) return;
    mapRef.current.setOptions({ styles: getMapStyles(isDark, showPoi) });
  }, [isDark, showPoi]);

  // ── Category filter: hide/show markers via setMap ────────────────
  // setMap(null) fully removes the marker from the map (no ghosting).
  // setOpacity was kept before but left faint 0.2 "stuck" pins on click.
  useEffect(() => {
    markersRef.current.forEach((marker, destId) => {
      const dest = destinations.find((d) => d.id === destId);
      if (!dest) return;
      const hide = active !== null && dest.category !== active;
      marker.setMap(hide ? null : mapRef.current);
    });
  }, [active]);

  // ── Custom event bus listeners ────────────────────────────────────
  useEffect(() => {
    const onFilter = (e: Event) => {
      const { key } = (e as CustomEvent<{ key: string }>).detail;
      setActive(key);
      setShowLegend(true);
    };
    const onFlyTo  = (e: Event) => {
      const { lat, lng } = (e as CustomEvent<{ lat: number; lng: number; id: string }>).detail;
      if (mapRef.current) smoothFlyTo(mapRef.current, { lat, lng }, 11);
    };
    document.addEventListener("map-filter", onFilter);
    document.addEventListener("map-fly-to", onFlyTo);
    return () => {
      document.removeEventListener("map-filter", onFilter);
      document.removeEventListener("map-fly-to", onFlyTo);
    };
  }, []);

  const toggle    = (key: string) => setActive((p) => (p === key ? null : key));
  const resetView = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.setZoom(7);
    mapRef.current.panTo(NEPAL_CENTER);
  }, []);

  const clearSearch = () => {
    setSearchVal("");
    setSearching(false);
    if (searchInputRef.current) searchInputRef.current.value = "";
  };

  // ── Render ────────────────────────────────────────────────────────
  return (
    // height is explicit — NOT h-full. CSS cannot inherit min-height from a
    // parent that only sets min-h-[460px]; that would resolve to height:0.
    <div className="relative w-full" style={{ height: 460, background: "#0b1020" }}>

      {/* ── Google Maps container — fills parent explicitly ── */}
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />

      {/* ── Loading shimmer ── */}
      {!apiLoaded && !apiError && (
        <div className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: "linear-gradient(135deg, #0e1a32 0%, #152244 50%, #0e1a32 100%)" }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white/30 text-[12px] font-medium tracking-wide animate-pulse">
              Loading Google Maps…
            </p>
          </div>
        </div>
      )}

      {/* ── Error fallback — billing / API not enabled / key missing ── */}
      {apiError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-3 px-6"
          style={{ background: "rgba(4,8,22,0.96)" }}>
          <p className="text-2xl">🗺️</p>
          <p className="text-white font-bold text-[14px]">Map unavailable</p>
          {apiError === "no-key" ? (
            <p className="text-white/45 text-[11px] text-center max-w-[280px]">
              Add <code className="text-orange-400">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to{" "}
              <code className="text-orange-400">.env.local</code> and restart the dev server.
            </p>
          ) : (
            <ul className="text-white/45 text-[11px] text-left space-y-1.5 max-w-[300px]">
              <li>① Enable <strong className="text-white/70">Maps JavaScript API</strong> in Google Cloud Console</li>
              <li>② Enable <strong className="text-white/70">Places API</strong> in Google Cloud Console</li>
              <li>③ Link a <strong className="text-white/70">billing account</strong> to the project (required by Google)</li>
              <li>④ Under API key restrictions, allow <strong className="text-white/70">localhost:3000</strong></li>
            </ul>
          )}
          <p className="text-white/20 text-[10px]">Check the browser console for the exact error</p>
        </div>
      )}

      {/* ── Top-left: title pill ── */}
      <div
        className="absolute top-3.5 left-3.5 z-[500] pointer-events-none select-none"
        style={{ ...GLASS, borderRadius: 14, padding: "9px 14px" }}
      >
        <p className="text-white font-extrabold text-[13px] tracking-tight leading-none mb-0.5">
          Explore Nepal Map
        </p>
        <p className="text-white/40 text-[10px] font-medium tracking-wide">
          Google Maps · Interactive
        </p>
      </div>

      {/* ── Top-center: Autocomplete search bar ── */}
      <div
        className="absolute top-3.5 left-1/2 -translate-x-1/2 z-[500] w-full"
        style={{ maxWidth: "min(360px, calc(100% - 320px))" }}
      >
        <div
          className="flex items-center gap-2"
          style={{
            ...GLASS,
            borderRadius: 9999,
            padding: "7px 14px",
          }}
        >
          <Search size={13} strokeWidth={2.5} color="rgba(255,255,255,0.50)" className="flex-shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search Nepal places…"
            value={searchVal}
            onChange={(e) => { setSearchVal(e.target.value); setSearching(true); }}
            className="flex-1 bg-transparent border-0 outline-none text-white placeholder-white/35 text-[12px] font-medium"
            style={{ minWidth: 0 }}
          />
          <AnimatePresence>
            {(searchVal || searching) && (
              <motion.button
                onClick={clearSearch}
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

      {/* ── Left: custom zoom controls ── */}
      <div
        className="absolute left-3.5 top-1/2 -translate-y-1/2 z-[500] flex flex-col gap-1"
        style={{ ...GLASS, borderRadius: 14, padding: 5 }}
      >
        {([
          { Icon: Plus,        tip: "Zoom in",    fn: () => mapRef.current?.setZoom((mapRef.current.getZoom() ?? 7) + 1) },
          { Icon: LocateFixed, tip: "Reset view", fn: resetView },
          { Icon: Minus,       tip: "Zoom out",   fn: () => mapRef.current?.setZoom((mapRef.current.getZoom() ?? 7) - 1) },
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

      {/* ── Bottom legend / category filter ── */}
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
            style={{
              ...GLASS,
              borderRadius: 9999,
              padding: "7px 16px",
              maxWidth: "calc(100% - 28px)",
            }}
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

      {/* ── POI zoom hint ── */}
      <AnimatePresence>
        {!showPoi && apiLoaded && (
          <motion.div
            key="poi-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-14 left-1/2 -translate-x-1/2 z-[500]
              pointer-events-none select-none"
            style={{ ...GLASS, borderRadius: 9999, padding: "5px 12px" }}
          >
            <p className="text-white/40 text-[10px] font-medium whitespace-nowrap">
              Zoom in to zoom 14+ to reveal cafés, hotels &amp; landmarks
            </p>
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
              minWidth:     172,
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
              <span style={{
                fontSize: 10, fontWeight: 700,
                color: COLOR_MAP[hovered.dest.category],
              }}>
                {LABEL_MAP[hovered.dest.category]}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attribution */}
      <p className="absolute bottom-1 right-2 z-[400] text-[8px] text-white/20
        pointer-events-none select-none">
        © Google Maps · © OpenStreetMap contributors
      </p>
    </div>
  );
}
