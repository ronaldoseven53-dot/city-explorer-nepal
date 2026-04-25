"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { destinations } from "@/data/destinations";
import { checkSeasonality } from "@/lib/seasonality";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const SEASON_ICON: Record<number, string> = {
  0: "❄️", 1: "❄️", 2: "🌸", 3: "🌸", 4: "🌿", 5: "🌿",
  6: "🌧️", 7: "🌧️", 8: "🍂", 9: "🍂", 10: "🍂", 11: "❄️",
};

export default function SeasonalBanner() {
  const { month, inSeason } = useMemo(() => {
    const m = new Date().getMonth();
    return { month: m, inSeason: checkSeasonality(destinations, m) };
  }, []);

  if (inSeason.length === 0) return null;

  return (
    <section
      aria-label="Seasonal recommendations"
      className="bg-emerald-50 border-y border-emerald-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-widest mb-1">
              {SEASON_ICON[month]} Seasonal Recommendation
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              Best destinations to visit in{" "}
              <span className="text-emerald-700">{MONTH_NAMES[month]}</span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {inSeason.length} of {destinations.length} destinations are in peak season right now
            </p>
          </div>

          {/* Progress pill */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center bg-emerald-100 border border-emerald-200 rounded-2xl px-4 py-2 min-w-[72px]">
            <span className="text-2xl font-extrabold text-emerald-700 leading-none">
              {inSeason.length}
            </span>
            <span className="text-[10px] text-emerald-600 font-medium mt-0.5 leading-none">
              in season
            </span>
          </div>
        </div>

        {/* Scrollable card row */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory">
          {inSeason.map((d) => (
            <Link
              key={d.id}
              href={`/destinations/${d.id}`}
              className="
                group flex-shrink-0 w-44 sm:w-52 snap-start
                bg-white rounded-2xl border border-gray-100
                shadow-sm hover:shadow-md hover:-translate-y-0.5
                transition-all duration-200 overflow-hidden
              "
            >
              <div className="relative h-28 bg-gray-200">
                <Image
                  src={d.placeholderImage}
                  alt={d.name}
                  fill
                  sizes="(max-width:640px) 176px, 208px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-2 left-2.5 text-white text-xs font-semibold leading-tight drop-shadow">
                  {d.name}
                </span>
              </div>
              <div className="px-3 py-2.5">
                <p className="text-[11px] text-emerald-700 font-semibold truncate">
                  {d.bestTimeToVisit.split("(")[0].trim()}
                </p>
                <p className="text-[10px] text-gray-400 capitalize mt-0.5">{d.category}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
