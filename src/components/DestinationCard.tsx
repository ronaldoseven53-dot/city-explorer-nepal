"use client";

import { useState } from "react";
import { Destination, getCategoryLabel } from "@/data/destinations";

function getActivityIcon(activity: string): string {
  const a = activity.toLowerCase();
  if (a.includes("trek") || a.includes("trail"))              return "🥾";
  if (a.includes("hike") || a.includes("ice lake"))           return "🧗";
  if (a.includes("paraglid") || a.includes("ultralight"))     return "🪂";
  if (a.includes("photo"))                                     return "📸";
  if (a.includes("boat") || a.includes("kayak"))              return "🛶";
  if (a.includes("raft") || a.includes("river"))              return "🌊";
  if (a.includes("zip"))                                       return "🎿";
  if (a.includes("temple") || a.includes("stupa"))            return "🛕";
  if (a.includes("monastery") || a.includes("gompa"))         return "⛩️";
  if (a.includes("pilgrimage") || a.includes("meditation"))   return "🧘";
  if (a.includes("cycl") || a.includes("bike"))               return "🚴";
  if (a.includes("tea"))                                       return "🍵";
  if (a.includes("cook") || a.includes("cuisin"))             return "🍽️";
  if (a.includes("bird"))                                      return "🦅";
  if (a.includes("wildlife"))                                  return "🐾";
  if (a.includes("cave"))                                      return "🦇";
  if (a.includes("camp"))                                      return "⛺";
  if (a.includes("festival"))                                  return "🎊";
  if (a.includes("jeep") || a.includes("safari"))             return "🚙";
  if (a.includes("sunrise") || a.includes("viewpoint"))       return "🌄";
  if (a.includes("glacier") || a.includes("lake"))            return "🏞️";
  if (a.includes("market") || a.includes("bazaar"))           return "🛍️";
  if (a.includes("museum") || a.includes("heritage"))         return "🏛️";
  if (a.includes("walk") || a.includes("cultural"))           return "🚶";
  if (a.includes("mountain flight") || a.includes("aircraft"))return "✈️";
  return "✨";
}

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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={destination.placeholderImage}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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

        {/* Name + meta */}
        <h2 className="text-xl font-bold text-gray-900 leading-snug mb-0.5">
          {destination.name}
        </h2>
        <p className="text-xs text-gray-400 mb-3">
          {destination.province} Province
          {destination.elevation && <> · {destination.elevation}</>}
        </p>

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

        {/* Explore Activities button */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className={`mt-auto w-full ${s.btnBg} text-white text-sm font-semibold py-2.5 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer`}
        >
          <span className="text-base">{expanded ? "▲" : "🗺️"}</span>
          {expanded ? "Hide Activities" : "Explore Activities"}
        </button>

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
