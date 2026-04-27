"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import TransitionLink from "@/components/TransitionLink";
import { Destination, getCategoryLabel } from "@/data/destinations";
import { PriceBadge } from "@/components/SearchableGrid";
import WeatherBadge from "./WeatherBadge";
import { getActivityIcon } from "@/lib/activityIcons";

const categoryStyles: Record<
  Destination["category"],
  { badge: string; btnBg: string; iconChip: string; border: string }
> = {
  mountain:    { badge: "bg-blue-500",    btnBg: "bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-200",    iconChip: "bg-blue-500/15 text-blue-300",    border: "border-white/[0.08]" },
  heritage:    { badge: "bg-amber-500",   btnBg: "bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-200",   iconChip: "bg-amber-500/15 text-amber-300",   border: "border-white/[0.08]" },
  nature:      { badge: "bg-emerald-500", btnBg: "bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-200", iconChip: "bg-emerald-500/15 text-emerald-300", border: "border-white/[0.08]" },
  pilgrimage:  { badge: "bg-purple-500",  btnBg: "bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-200",  iconChip: "bg-purple-500/15 text-purple-300",  border: "border-white/[0.08]" },
  hill:        { badge: "bg-teal-500",    btnBg: "bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 text-teal-200",    iconChip: "bg-teal-500/15 text-teal-300",    border: "border-white/[0.08]" },
  agriculture: { badge: "bg-lime-500",    btnBg: "bg-lime-500/15 hover:bg-lime-500/25 border border-lime-500/30 text-lime-200",    iconChip: "bg-lime-500/15 text-lime-300",    border: "border-white/[0.08]" },
};

const categoryGlow: Record<Destination["category"], string> = {
  mountain:    "rgba(59,130,246,0.25)",
  heritage:    "rgba(245,158,11,0.25)",
  nature:      "rgba(16,185,129,0.25)",
  pilgrimage:  "rgba(168,85,247,0.25)",
  hill:        "rgba(20,184,166,0.25)",
  agriculture: "rgba(132,204,22,0.25)",
};

export default function DestinationCard({ destination }: { destination: Destination }) {
  const [expanded, setExpanded] = useState(false);
  const s = categoryStyles[destination.category];
  const glow = categoryGlow[destination.category];

  const previewActivities = destination.activities.slice(0, 4);
  const extraCount = destination.activities.length - previewActivities.length;
  const regionLabel = destination.region.split(",")[0];

  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        boxShadow: `0 0 0 1px rgba(255,255,255,0.08), 0 24px 48px -12px ${glow}, 0 8px 24px -8px rgba(0,0,0,0.5)`,
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px -4px rgba(0,0,0,0.5)" }}
      className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden flex flex-col group will-change-transform"
    >
      {/* ── Image ─────────────────────────────────────────── */}
      <div className="relative h-52 overflow-hidden flex-shrink-0">
        <Image
          src={destination.placeholderImage}
          alt={`${destination.name} — ${destination.region}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          style={{ viewTransitionName: `hero-${destination.id}` }}
        />

        {/* Radial gradient from bottom */}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at bottom, #00010c 0%, transparent 72%)" }}
        />
        {/* Linear top-to-bottom for strong text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#00010c]/85 via-[#00010c]/20 to-transparent" />

        {/* Region badge — bottom left */}
        <span className={`absolute bottom-3 left-3 ${s.badge} text-white text-xs font-semibold px-3 py-1 rounded-full shadow`}>
          {regionLabel}
        </span>

        {/* Category badge — top right */}
        <span className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white/80 text-xs font-medium px-2.5 py-1 rounded-full border border-white/[0.12]">
          {getCategoryLabel(destination.category)}
        </span>
      </div>

      {/* ── Content ───────────────────────────────────────── */}
      <div className="p-5 flex flex-col flex-1">

        {/* Name + meta + live weather */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h2 className="text-xl font-bold text-white leading-snug tracking-tight">
              {destination.name}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {destination.province} Province
              {destination.elevation && <> · {destination.elevation}</>}
            </p>
            <div className="mt-1.5">
              <PriceBadge price={destination.basePrice} />
            </div>
          </div>
          <WeatherBadge
            lat={destination.coordinates.lat}
            lng={destination.coordinates.lng}
          />
        </div>

        {/* Description snippet */}
        <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 mb-4">
          {destination.description}
        </p>

        {/* Activity icon chips */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          {previewActivities.map((activity, i) => (
            <span
              key={i}
              title={activity}
              className={`text-base px-2.5 py-1 rounded-xl ${s.iconChip} select-none cursor-default`}
            >
              {getActivityIcon(activity)}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="text-xs font-medium text-zinc-500">+{extraCount} more</span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2">
          <button
            onClick={() => setExpanded((v) => !v)}
            className={`flex-1 ${s.btnBg} text-sm font-semibold py-2.5 rounded-3xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer`}
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
            className="border border-white/[0.12] hover:border-blue-400/40 hover:text-blue-400 text-zinc-400 text-sm font-semibold px-3 py-2.5 rounded-3xl transition-all duration-200 flex items-center justify-center cursor-pointer"
          >
            📍
          </button>
          <TransitionLink
            href={`/destinations/${destination.id}`}
            className="flex-1 border border-white/[0.12] hover:border-white/[0.25] text-zinc-400 hover:text-white text-sm font-semibold py-2.5 rounded-3xl transition-all duration-200 flex items-center justify-center gap-1"
          >
            Full Page →
          </TransitionLink>
        </div>

        {/* ── Expanded activity list ─────────────────────── */}
        {expanded && (
          <ul className={`mt-4 pt-4 border-t ${s.border} space-y-2.5`}>
            {destination.activities.map((activity, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                <span className="text-base flex-shrink-0 leading-5">
                  {getActivityIcon(activity)}
                </span>
                <span className="leading-5">{activity}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
