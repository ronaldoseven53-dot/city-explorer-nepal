"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Destination, getCategoryLabel } from "@/data/destinations";
import WeatherBadge from "./WeatherBadge";
import { getActivityIcon } from "@/lib/activityIcons";

const categoryStyles: Record<
  Destination["category"],
  { badge: string; btnBg: string; iconChip: string; border: string }
> = {
  mountain:   { badge: "bg-blue-600",   btnBg: "bg-blue-600 hover:bg-blue-700",   iconChip: "bg-blue-50 text-blue-800",   border: "border-blue-100"  },
  heritage:   { badge: "bg-amber-600",  btnBg: "bg-amber-600 hover:bg-amber-700",  iconChip: "bg-amber-50 text-amber-800",  border: "border-amber-100" },
  nature:     { badge: "bg-green-600",  btnBg: "bg-green-600 hover:bg-green-700",  iconChip: "bg-green-50 text-green-800",  border: "border-green-100" },
  pilgrimage: { badge: "bg-purple-600", btnBg: "bg-purple-600 hover:bg-purple-700",iconChip: "bg-purple-50 text-purple-800",border: "border-purple-100"},
  hill:       { badge: "bg-teal-600",   btnBg: "bg-teal-600 hover:bg-teal-700",   iconChip: "bg-teal-50 text-teal-800",   border: "border-teal-100"  },
};

export default function DestinationCard({ destination }: { destination: Destination }) {
  const [expanded, setExpanded] = useState(false);
  const s = categoryStyles[destination.category];

  const previewActivities = destination.activities.slice(0, 4);
  const extraCount = destination.activities.length - previewActivities.length;

  // Shorten long region strings for the badge
  const regionLabel = destination.region.split(",")[0];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group">

      {/* ── Image ─────────────────────────────────────────── */}
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-slate-300 to-slate-500 flex-shrink-0">
        <Image
          src={destination.placeholderImage}
          alt={`${destination.name} — ${destination.region}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Dark gradient so text is readable over any image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

        {/* Region badge — bottom left */}
        <span
          className={`absolute bottom-3 left-3 ${s.badge} text-white text-xs font-semibold px-3 py-1 rounded-full shadow`}
        >
          {regionLabel}
        </span>

        {/* Category badge — top right */}
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full shadow">
          {getCategoryLabel(destination.category)}
        </span>
      </div>

      {/* ── Content ───────────────────────────────────────── */}
      <div className="p-5 flex flex-col flex-1">

        {/* Name + meta + live weather */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-snug">
              {destination.name}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {destination.province} Province
              {destination.elevation && <> · {destination.elevation}</>}
            </p>
          </div>
          <WeatherBadge
            lat={destination.coordinates.lat}
            lng={destination.coordinates.lng}
          />
        </div>

        {/* Description snippet */}
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
          {destination.description}
        </p>

        {/* Activity icon chips */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          {previewActivities.map((activity, i) => (
            <span
              key={i}
              title={activity}
              className={`text-base px-2.5 py-1 rounded-lg ${s.iconChip} select-none cursor-default`}
            >
              {getActivityIcon(activity)}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="text-xs font-medium text-gray-400">+{extraCount} more</span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2">
          <button
            onClick={() => setExpanded((v) => !v)}
            className={`flex-1 ${s.btnBg} text-white text-sm font-semibold py-2.5 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer`}
          >
            <span className="text-base">{expanded ? "▲" : "🗺️"}</span>
            {expanded ? "Hide" : "Activities"}
          </button>
          <button
            onClick={() => document.dispatchEvent(
              new CustomEvent("map-fly-to", {
                detail: { lat: destination.coordinates.lat, lng: destination.coordinates.lng, id: destination.id },
              })
            )}
            title="Fly to on map"
            className="border border-gray-200 hover:border-blue-400 hover:text-blue-600 text-gray-500 text-sm font-semibold px-3 py-2.5 rounded-xl transition-colors duration-200 flex items-center justify-center cursor-pointer"
          >
            📍
          </button>
          <Link
            href={`/destinations/${destination.id}`}
            className="flex-1 border border-gray-200 hover:border-gray-400 text-gray-600 hover:text-gray-900 text-sm font-semibold py-2.5 rounded-xl transition-colors duration-200 flex items-center justify-center gap-1"
          >
            Full Page →
          </Link>
        </div>

        {/* ── Expanded activity list ─────────────────────── */}
        {expanded && (
          <ul className={`mt-4 pt-4 border-t ${s.border} space-y-2.5`}>
            {destination.activities.map((activity, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                <span className="text-base flex-shrink-0 leading-5">
                  {getActivityIcon(activity)}
                </span>
                <span className="leading-5">{activity}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
