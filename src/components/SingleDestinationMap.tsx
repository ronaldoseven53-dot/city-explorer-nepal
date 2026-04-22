"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Destination, getCategoryLabel } from "@/data/destinations";

const categoryColors: Record<string, string> = {
  mountain:   "#2563eb",
  heritage:   "#d97706",
  nature:     "#16a34a",
  pilgrimage: "#9333ea",
  hill:       "#0d9488",
};

const categoryZoom: Record<string, number> = {
  mountain:   10,
  heritage:   13,
  nature:     12,
  pilgrimage: 13,
  hill:       12,
};

export default function SingleDestinationMap({ destination }: { destination: Destination }) {
  const color  = categoryColors[destination.category] ?? "#6b7280";
  const zoom   = categoryZoom[destination.category]   ?? 11;
  const center: [number, number] = [destination.coordinates.lat, destination.coordinates.lng];

  const pin = L.divIcon({
    html: `<div style="
      width:22px;height:22px;
      background:${color};
      border:4px solid white;
      border-radius:50%;
      box-shadow:0 3px 10px rgba(0,0,0,0.4);
    "></div>`,
    className:   "",
    iconSize:    [22, 22],
    iconAnchor:  [11, 11],
    popupAnchor: [0, -16],
  });

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-72 sm:h-96">
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center} icon={pin}>
          <Popup>
            <div className="text-sm">
              <p className="font-bold">{destination.name}</p>
              <p className="text-gray-500 text-xs">{getCategoryLabel(destination.category)}</p>
              {destination.elevation && (
                <p className="text-gray-400 text-xs mt-0.5">⛰ {destination.elevation}</p>
              )}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
