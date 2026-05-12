"use client";

import Map, { Source, Layer, Marker, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { useMemo } from "react";
import { useTripContext } from "@/context/TripContext";
import { getRoute, ROUTE_COLORS, ROUTE_LABELS } from "@/data/tripRoutes";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

// ── No-token placeholder ───────────────────────────────────────────────

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

// ── Map ────────────────────────────────────────────────────────────────

export default function TripRouteMap() {
  const { selectedCities } = useTripContext();

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
    <div className="mt-4 rounded-[22px] overflow-hidden" style={{ height: 240 }}>
      <Map
        mapboxAccessToken={TOKEN}
        initialViewState={{ bounds, fitBoundsOptions: { padding: 48 } }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        scrollZoom={false}
        touchZoomRotate={false}
        dragPan
      >
        <NavigationControl position="top-right" />

        {/* Route glow + dashed line */}
        <Source id="route" type="geojson" data={lineGeoJSON}>
          <Layer
            id="route-glow"
            type="line"
            paint={{ "line-color": "#F97316", "line-width": 10, "line-opacity": 0.18, "line-blur": 6 }}
            layout={{ "line-cap": "round", "line-join": "round" }}
          />
          <Layer
            id="route-line"
            type="line"
            paint={{ "line-color": "#F97316", "line-width": 2.5, "line-opacity": 0.85, "line-dasharray": [3, 2] }}
            layout={{ "line-cap": "round", "line-join": "round" }}
          />
        </Source>

        {/* Numbered city markers */}
        {selectedCities.map((city, i) => (
          <Marker key={city.id} longitude={city.coords[0]} latitude={city.coords[1]} anchor="center">
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background:  city.color,
              border:      "2.5px solid rgba(255,255,255,0.22)",
              display:     "flex", alignItems: "center", justifyContent: "center",
              fontSize:    10, fontWeight: 800, color: "#fff",
              boxShadow:   `0 0 10px ${city.color}99`,
              cursor:      "default",
              userSelect:  "none",
            }}>
              {i + 1}
            </div>
          </Marker>
        ))}

        {/* Segment chips: mode + time + cost */}
        {selectedCities.slice(0, -1).map((city, i) => {
          const next  = selectedCities[i + 1];
          const route = getRoute(city.id, next.id);
          const midLng = (city.coords[0] + next.coords[0]) / 2;
          const midLat = (city.coords[1] + next.coords[1]) / 2 + 0.18;
          return (
            <Marker key={`seg-${i}`} longitude={midLng} latitude={midLat} anchor="center">
              <div style={{
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
              }}>
                {ROUTE_LABELS[route.mode]} · {route.time} · {route.cost}
              </div>
            </Marker>
          );
        })}
      </Map>
    </div>
  );
}
