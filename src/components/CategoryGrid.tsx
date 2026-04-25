"use client";

import Image from "next/image";
import TransitionLink from "@/components/TransitionLink";
import { categoryGroups } from "@/data/destinations";

// ── Per-category curated highlights ──────────────────────────────
const cardHighlights: Record<string, { icon: string; label: string; badge?: string }[]> = {
  agriculture: [
    { icon: "🍯", label: "Mad Honey Hunting",   badge: "Extreme" },
    { icon: "🧀", label: "Yak Cheese Making",   badge: "Easy"    },
    { icon: "🍵", label: "Tea Estate Tours",    badge: "Easy"    },
    { icon: "🍄", label: "Yarsagumba Harvest",  badge: "Hard"    },
  ],
  adventure: [
    { icon: "🪂", label: "Kushma Bungee Jump",       badge: "Extreme" },
    { icon: "🌊", label: "White Water Rafting",       badge: "Hard"    },
    { icon: "🛩",  label: "Pokhara Paragliding",      badge: "Hard"    },
    { icon: "⛷️", label: "Kalinchowk Skiing",         badge: "Moderate"},
  ],
  trekking: [
    { icon: "🥾", label: "Annapurna Circuit" },
    { icon: "🏔️", label: "Thorong La Pass (5,416 m)" },
    { icon: "🏕️", label: "Rara Lake Wild Camping"    },
    { icon: "🗺️", label: "Tsum Valley Trek"           },
  ],
  heritage: [
    { icon: "🏛️", label: "UNESCO Durbar Squares" },
    { icon: "🎨", label: "Mithila Folk Art"       },
    { icon: "🏺", label: "Bhaktapur Pottery"      },
    { icon: "🌄", label: "Newari Hill Towns"       },
  ],
  nature: [
    { icon: "🌿", label: "Tea Plantation Walks"  },
    { icon: "🦜", label: "Himalayan Birdwatching" },
    { icon: "🌅", label: "Nagarkot Sunrise"       },
    { icon: "🦁", label: "Rhino & Tiger Safari"   },
  ],
  pilgrimage: [
    { icon: "🛕", label: "Buddha's Birthplace"  },
    { icon: "🕉️", label: "Janaki Mandir"         },
    { icon: "🪷", label: "Maya Devi Temple"      },
    { icon: "🚂", label: "Heritage Steam Train"  },
  ],
};

// ── Per-category accent theme ─────────────────────────────────────
const cardTheme: Record<string, {
  gradient: string;
  imageTint: string;
  accent: string;
  accentLight: string;
  accentText: string;
  badgeBg: string;
  border: string;
  chipBg: string;
  chipText: string;
}> = {
  agriculture: {
    gradient:    "from-green-600 to-emerald-700",
    imageTint:   "from-green-900/70 via-green-800/30",
    accent:      "bg-green-600",
    accentLight: "bg-green-50",
    accentText:  "text-green-700",
    badgeBg:     "bg-green-500/20 text-green-200 border-green-400/30",
    border:      "border-green-200",
    chipBg:      "bg-green-50 border-green-200",
    chipText:    "text-green-700",
  },
  adventure: {
    gradient:    "from-red-600 to-orange-700",
    imageTint:   "from-red-900/70 via-red-800/30",
    accent:      "bg-red-600",
    accentLight: "bg-red-50",
    accentText:  "text-red-700",
    badgeBg:     "bg-red-500/20 text-red-200 border-red-400/30",
    border:      "border-red-200",
    chipBg:      "bg-red-50 border-red-200",
    chipText:    "text-red-700",
  },
  trekking: {
    gradient:    "from-slate-600 to-slate-800",
    imageTint:   "from-slate-900/70 via-slate-700/30",
    accent:      "bg-slate-700",
    accentLight: "bg-slate-50",
    accentText:  "text-slate-700",
    badgeBg:     "bg-slate-500/20 text-slate-200 border-slate-400/30",
    border:      "border-slate-200",
    chipBg:      "bg-slate-50 border-slate-200",
    chipText:    "text-slate-700",
  },
  heritage: {
    gradient:    "from-amber-500 to-yellow-700",
    imageTint:   "from-amber-900/70 via-amber-800/30",
    accent:      "bg-amber-600",
    accentLight: "bg-amber-50",
    accentText:  "text-amber-700",
    badgeBg:     "bg-amber-500/20 text-amber-200 border-amber-400/30",
    border:      "border-amber-200",
    chipBg:      "bg-amber-50 border-amber-200",
    chipText:    "text-amber-700",
  },
  nature: {
    gradient:    "from-emerald-600 to-teal-700",
    imageTint:   "from-emerald-900/70 via-emerald-800/30",
    accent:      "bg-emerald-600",
    accentLight: "bg-emerald-50",
    accentText:  "text-emerald-700",
    badgeBg:     "bg-emerald-500/20 text-emerald-200 border-emerald-400/30",
    border:      "border-emerald-200",
    chipBg:      "bg-emerald-50 border-emerald-200",
    chipText:    "text-emerald-700",
  },
  pilgrimage: {
    gradient:    "from-purple-600 to-violet-700",
    imageTint:   "from-purple-900/70 via-purple-800/30",
    accent:      "bg-purple-600",
    accentLight: "bg-purple-50",
    accentText:  "text-purple-700",
    badgeBg:     "bg-purple-500/20 text-purple-200 border-purple-400/30",
    border:      "border-purple-200",
    chipBg:      "bg-purple-50 border-purple-200",
    chipText:    "text-purple-700",
  },
};

const difficultyStyle: Record<string, string> = {
  Extreme:  "bg-rose-950 text-rose-200 border-rose-800",
  Hard:     "bg-red-100  text-red-700  border-red-200",
  Moderate: "bg-amber-100 text-amber-700 border-amber-200",
  Easy:     "bg-green-100 text-green-700 border-green-200",
};

const fallbackTheme = cardTheme.trekking;

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categoryGroups.map((group) => {
        const coverImage = group.spots[0].placeholderImage;
        const theme      = cardTheme[group.id] ?? fallbackTheme;
        const highlights = cardHighlights[group.id] ?? [];

        return (
          <TransitionLink
            key={group.id}
            href={`/experience/${group.id}`}
            className={`
              group flex flex-col rounded-2xl overflow-hidden
              bg-white border ${theme.border}
              shadow-sm hover:shadow-xl
              transition-all duration-300 hover:-translate-y-1
            `}
          >
            {/* ── Image area ──────────────────────────────── */}
            <div className="relative h-48 flex-shrink-0 overflow-hidden">
              <Image
                src={coverImage}
                alt={group.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                style={{ viewTransitionName: `category-cover-${group.id}` }}
              />
              {/* tinted gradient */}
              <div className={`absolute inset-0 bg-gradient-to-t ${theme.imageTint} to-transparent`} />

              {/* Spot count badge — top right */}
              <span className={`
                absolute top-3 right-3
                text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm
                ${theme.badgeBg}
              `}>
                {group.spots.length} {group.spots.length === 1 ? "Spot" : "Spots"}
              </span>

              {/* Emoji + name over image */}
              <div className="absolute bottom-3 left-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl drop-shadow-lg">{group.emoji}</span>
                  <h3 className="text-lg font-extrabold text-white drop-shadow leading-tight">
                    {group.name}
                  </h3>
                </div>
              </div>
            </div>

            {/* ── Content area ────────────────────────────── */}
            <div className="flex flex-col flex-1 p-4 gap-4">

              {/* Short description */}
              <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                {group.description}
              </p>

              {/* ── Highlight activity chips ──────────────── */}
              <div className="flex flex-col gap-2">
                <p className={`text-[10px] font-bold uppercase tracking-widest ${theme.accentText}`}>
                  Featured Experiences
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {highlights.map((h) => (
                    <span
                      key={h.label}
                      className={`
                        inline-flex items-center gap-1 text-xs font-medium
                        px-2.5 py-1 rounded-full border
                        ${theme.chipBg} ${theme.chipText}
                      `}
                    >
                      <span>{h.icon}</span>
                      {h.label}
                      {h.badge && (
                        <span className={`
                          ml-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full border
                          ${difficultyStyle[h.badge] ?? "bg-gray-100 text-gray-600 border-gray-200"}
                        `}>
                          {h.badge}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* ── Footer ────────────────────────────────── */}
              <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex gap-1">
                  {group.spots.slice(0, 3).map((s) => (
                    <div
                      key={s.id}
                      className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-white shadow-sm -ml-1 first:ml-0"
                    >
                      <Image
                        src={s.placeholderImage}
                        alt={s.name}
                        fill
                        sizes="28px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {group.spots.length > 3 && (
                    <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white shadow-sm -ml-1 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-gray-500">+{group.spots.length - 3}</span>
                    </div>
                  )}
                </div>

                <span className={`
                  text-xs font-bold px-3 py-1.5 rounded-full
                  ${theme.accentLight} ${theme.accentText}
                  group-hover:${theme.accent} group-hover:text-white
                  transition-colors duration-200
                `}>
                  Explore →
                </span>
              </div>
            </div>
          </TransitionLink>
        );
      })}
    </div>
  );
}
