"use client";

import { useState } from "react";
import { CITY_DATA, type TripCityId } from "@/context/TripContext";

export type ItineraryEvent = {
  id:          string;
  day:         number;
  title:       string;
  location:    string;
  description: string;
  duration:    string;
  type:        "travel" | "activity" | "accommodation" | "meal";
};

// Clean colored-dot tags — no emoji icons
const TYPE_META: Record<
  ItineraryEvent["type"],
  { dot: string; bg: string; border: string; text: string; label: string }
> = {
  travel:        { dot: "#60a5fa", bg: "rgba(59,130,246,0.12)",  border: "rgba(96,165,250,0.30)",  text: "#93c5fd", label: "Travel"  },
  activity:      { dot: "#34d399", bg: "rgba(16,185,129,0.12)",  border: "rgba(52,211,153,0.30)",  text: "#6ee7b7", label: "Activity" },
  accommodation: { dot: "#c084fc", bg: "rgba(139,92,246,0.12)",  border: "rgba(192,132,252,0.30)", text: "#d8b4fe", label: "Stay"     },
  meal:          { dot: "#fbbf24", bg: "rgba(245,158,11,0.12)",  border: "rgba(251,191,36,0.30)",  text: "#fcd34d", label: "Meal"     },
};

// Match itinerary locations to TripContext city IDs (case-insensitive substring)
function matchCities(events: ItineraryEvent[]): TripCityId[] {
  const locs = new Set(events.map((e) => e.location.toLowerCase()));
  const matched: TripCityId[] = [];
  for (const [id, city] of Object.entries(CITY_DATA)) {
    const name = city.name.toLowerCase();
    if ([...locs].some((loc) => loc.includes(name) || name.includes(loc))) {
      if (matched.length < 5) matched.push(id as TripCityId);
    }
  }
  return matched;
}

// ── Single event row ──────────────────────────────────────────────────────
function EventCard({ event }: { event: ItineraryEvent }) {
  const meta = TYPE_META[event.type];

  return (
    <div className="flex gap-3 p-3 rounded-xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.09] hover:border-white/20 transition-all duration-200">
      {/* Day badge */}
      <div className="flex-shrink-0 flex flex-col items-center justify-center w-9 h-9 rounded-lg bg-white/[0.08] border border-white/10">
        <span className="text-[9px] text-white/35 font-medium leading-none uppercase tracking-wide">Day</span>
        <span className="text-sm font-bold text-white/80 leading-none">{event.day}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <span className="text-sm font-semibold text-white/90 leading-snug">{event.title}</span>
          {/* Clean dot + text tag — no emoji icon */}
          <span
            className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ background: meta.bg, border: `1px solid ${meta.border}`, color: meta.text }}
          >
            <span
              aria-hidden
              style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: meta.dot, flexShrink: 0 }}
            />
            {meta.label}
          </span>
        </div>
        <p className="text-xs text-white/45 mt-0.5 truncate">
          📍 {event.location} · ⏱ {event.duration}
        </p>
        <p className="text-xs text-white/55 mt-1 leading-relaxed line-clamp-2">
          {event.description}
        </p>
      </div>
    </div>
  );
}

// ── Main timeline card ────────────────────────────────────────────────────
export default function Timeline({
  tripTitle,
  totalDays,
  initialEvents,
  onSaveToTrip,
}: {
  tripTitle:     string;
  totalDays:     number;
  initialEvents: ItineraryEvent[];
  onSaveToTrip?: (cityIds: TripCityId[]) => void;
}) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!onSaveToTrip || saved) return;
    const ids = matchCities(initialEvents);
    onSaveToTrip(ids);
    setSaved(true);
  };

  return (
    <div className="mt-2 rounded-xl overflow-hidden border border-white/10 bg-white/[0.03] w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.04]">
        <div>
          <p className="text-white/90 font-bold text-sm leading-none">{tripTitle}</p>
          <p className="text-white/35 text-xs mt-1">
            {totalDays}-day itinerary · {initialEvents.length} events
          </p>
        </div>
        <span style={{ fontSize: 18 }} aria-hidden>🗺️</span>
      </div>

      {/* Static event list — vertically stacked, no drag handles */}
      <div className="p-3 space-y-2 max-h-[420px] overflow-y-auto">
        {initialEvents.map((ev) => (
          <EventCard key={ev.id} event={ev} />
        ))}
      </div>

      {/* Save to Trip footer */}
      <div className="px-4 py-3 border-t border-white/10 bg-white/[0.02]">
        <button
          onClick={handleSave}
          disabled={saved}
          className="w-full py-2.5 rounded-xl text-[13px] font-bold cursor-pointer transition-all duration-200"
          style={{
            background: saved ? "rgba(34,197,94,0.15)" : "rgba(220,38,38,0.20)",
            border:     saved ? "1px solid rgba(34,197,94,0.35)" : "1px solid rgba(220,38,38,0.40)",
            color:      saved ? "#4ade80" : "#fca5a5",
          }}
        >
          {saved ? "Saved to Trip Builder" : "Save to Trip"}
        </button>
      </div>
    </div>
  );
}
