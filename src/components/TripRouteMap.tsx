"use client";

import Map, { Source, Layer, Marker, NavigationControl, type MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { useMemo, useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTripContext } from "@/context/TripContext";
import { getRoute, ROUTE_COLORS, ROUTE_LABELS } from "@/data/tripRoutes";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

// Marching-ants dasharray sequence — 16 frames that shift the phase of [3 dash, 2 gap]
// cycling through all positions of one full period (5 units)
const DASH_SEQUENCES: [number, number, number, number][] = Array.from({ length: 16 }, (_, i) => {
  const phase = (i / 16) * 5; // 0 → 5
  const lead  = phase % 3;    // how far into the dash we are
  const tail  = 3 - lead;
  return [tail, 2, lead, 0];
});

// ── No-token placeholder ───────────────────────────────────────────────────────

function MapPlaceholder() {
  return (
    <div
      className="mt-4 rounded-[22px] flex flex-col items-center justify-center gap-2 px-6 text-center"
      style={{ height: 200, background: "rgba(8,10,22,0.55)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <span style={{ fontSize: 28 }}>🗺️</span>
      <p style={{ color: "rgba(255,255,255,0.30)", fontSize: 11, lineHeight: 1.5 }}>
        Route map unavailable<br />
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.18)" }}>
          Add NEXT_PUBLIC_MAPBOX_TOKEN to Vercel environment variables
        </span>
      </p>
    </div>
  );
}

// ── Map ────────────────────────────────────────────────────────────────────────

export default function TripRouteMap() {
  const { selectedCities } = useTripContext();
  const mapRef = useRef<MapRef>(null);

  // ── Marching-ants animation ──────────────────────────────────────────────────
  // Cycles through dasharray frames to make the dashed route line appear to move.
  const dashFrameRef = useRef(0);
  const rafRef       = useRef<number>(0);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapLoaded || selectedCities.length < 2) return;

    let frame = 0;
    let lastTs = 0;
    const FRAME_MS = 80; // ~12 fps for the dash cycle — smooth but not expensive

    const tick = (ts: number) => {
      if (ts - lastTs >= FRAME_MS) {
        frame = (frame + 1) % DASH_SEQUENCES.length;
        dashFrameRef.current = frame;
        try {
          const map = mapRef.current?.getMap();
          if (map?.getLayer("route-line")) {
            map.setPaintProperty("route-line", "line-dasharray", DASH_SEQUENCES[frame]);
          }
        } catch {
          // Map or layer may not be ready — silently skip
        }
        lastTs = ts;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mapLoaded, selectedCities.length]);

  // ── Draw-on animation when route changes ────────────────────────────────────
  // Fades the line layer in from 0 opacity so the route feels like it "appears".
  const [lineOpacity, setLineOpacity] = useState(0.85);
  const routeKey = selectedCities.map((c) => c.id).join("-");

  useEffect(() => {
    setLineOpacity(0);
    const id = setTimeout(() => setLineOpacity(0.85), 80);
    return () => clearTimeout(id);
  }, [routeKey]);

  // ── GeoJSON ──────────────────────────────────────────────────────────────────
  const lineGeoJSON = useMemo(() => ({
    type: "FeatureCollection" as const,
    features: [{
      type:       "Feature"    as const,
      properties: {},
      geometry: {
        type:        "LineString" as const,
        coordinates: selectedCities.map((c) => c.coords),
      },
    }],
  }), [selectedCities]);

  if (selectedCities.length < 2) return null;
  if (!TOKEN)                     return <MapPlaceholder />;

  const lngs   = selectedCities.map((c) => c.coords[0]);
  const lats   = selectedCities.map((c) => c.coords[1]);
  const bounds: [[number, number], [number, number]] = [
    [Math.min(...lngs) - 0.8, Math.min(...lats) - 0.6],
    [Math.max(...lngs) + 0.8, Math.max(...lats) + 0.6],
  ];

  return (
    <div
      className="mt-4 rounded-[22px] overflow-hidden"
      style={{ height: 240 }}
    >
      <Map
        ref={mapRef}
        mapboxAccessToken={TOKEN}
        initialViewState={{ bounds, fitBoundsOptions: { padding: 48 } }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        scrollZoom={false}
        touchZoomRotate={false}
        dragPan
        onLoad={() => setMapLoaded(true)}
      >
        <NavigationControl position="top-right" />

        {/* Route glow + marching-dashes line */}
        <Source id="route" type="geojson" data={lineGeoJSON}>
          <Layer
            id="route-glow"
            type="line"
            paint={{
              "line-color":   "#F97316",
              "line-width":   10,
              "line-opacity": lineOpacity * 0.20,
              "line-blur":    6,
            }}
            layout={{ "line-cap": "round", "line-join": "round" }}
          />
          <Layer
            id="route-line"
            type="line"
            paint={{
              "line-color":      "#F97316",
              "line-width":      2.5,
              "line-opacity":    lineOpacity,
              // Initial static dasharray — overridden by marching-ants RAF loop
              "line-dasharray":  [3, 2],
            }}
            layout={{ "line-cap": "butt", "line-join": "round" }}
          />
        </Source>

        {/* Numbered city markers — pop in with spring */}
        {selectedCities.map((city, i) => (
          <Marker key={city.id} longitude={city.coords[0]} latitude={city.coords[1]} anchor="center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 360, damping: 22, delay: i * 0.08 }}
              style={{
                width: 28, height: 28, borderRadius: "50%",
                background:  city.color,
                border:      "2.5px solid rgba(255,255,255,0.22)",
                display:     "flex", alignItems: "center", justifyContent: "center",
                fontSize:    10, fontWeight: 800, color: "#fff",
                boxShadow:   `0 0 10px ${city.color}99`,
                cursor:      "default",
                userSelect:  "none",
              }}
            >
              {i + 1}
            </motion.div>
          </Marker>
        ))}

        {/* Segment chips: mode + time + cost — slide up when they appear */}
        <AnimatePresence>
          {selectedCities.slice(0, -1).map((city, i) => {
            const next   = selectedCities[i + 1];
            const route  = getRoute(city.id, next.id);
            const midLng = (city.coords[0] + next.coords[0]) / 2;
            const midLat = (city.coords[1] + next.coords[1]) / 2 + 0.18;
            return (
              <Marker key={`seg-${city.id}-${next.id}`} longitude={midLng} latitude={midLat} anchor="center">
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.88 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{    opacity: 0, y: 4, scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 300, damping: 26, delay: 0.3 + i * 0.10 }}
                  style={{
                    background:    "rgba(6,8,20,0.90)",
                    border:        `1px solid ${ROUTE_COLORS[route.mode]}55`,
                    borderRadius:  9999,
                    padding:       "3px 8px",
                    fontSize:      9,
                    fontWeight:    700,
                    color:         ROUTE_COLORS[route.mode],
                    whiteSpace:    "nowrap",
                    backdropFilter:"blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    pointerEvents: "none",
                    userSelect:    "none",
                  }}
                >
                  {ROUTE_LABELS[route.mode]} · {route.time} · {route.cost}
                </motion.div>
              </Marker>
            );
          })}
        </AnimatePresence>
      </Map>
    </div>
  );
}
