"use client";

import Image from "next/image";
import TransitionLink from "@/components/TransitionLink";
import { categoryGroups } from "@/data/destinations";
import { motion } from "motion/react";

// ── Per-category curated highlights ──────────────────────────────
const cardHighlights: Record<string, { icon: string; label: string; badge?: string }[]> = {
  agriculture: [
    { icon: "🍯", label: "Mad Honey Hunting",  badge: "Extreme" },
    { icon: "🧀", label: "Yak Cheese Making",  badge: "Easy"    },
    { icon: "🍵", label: "Tea Estate Tours",   badge: "Easy"    },
    { icon: "🍄", label: "Yarsagumba Harvest", badge: "Hard"    },
  ],
  adventure: [
    { icon: "🪂", label: "Kushma Bungee Jump",  badge: "Extreme"  },
    { icon: "🌊", label: "White Water Rafting", badge: "Hard"     },
    { icon: "🛩",  label: "Pokhara Paragliding", badge: "Hard"     },
    { icon: "⛷️", label: "Kalinchowk Skiing",   badge: "Moderate" },
  ],
  trekking: [
    { icon: "🥾", label: "Annapurna Circuit"       },
    { icon: "🏔️", label: "Thorong La Pass (5,416m)" },
    { icon: "🏕️", label: "Rara Lake Wild Camping"  },
    { icon: "🗺️", label: "Tsum Valley Trek"         },
  ],
  heritage: [
    { icon: "🏛️", label: "UNESCO Durbar Squares" },
    { icon: "🎨", label: "Mithila Folk Art"       },
    { icon: "🏺", label: "Bhaktapur Pottery"      },
    { icon: "🌄", label: "Newari Hill Towns"       },
  ],
  nature: [
    { icon: "🌿", label: "Tea Plantation Walks"   },
    { icon: "🦜", label: "Himalayan Birdwatching"  },
    { icon: "🌅", label: "Nagarkot Sunrise"        },
    { icon: "🦁", label: "Rhino & Tiger Safari"    },
  ],
  pilgrimage: [
    { icon: "🛕", label: "Buddha's Birthplace" },
    { icon: "🕉️", label: "Janaki Mandir"        },
    { icon: "🪷", label: "Maya Devi Temple"     },
    { icon: "🚂", label: "Heritage Steam Train" },
  ],
};

// ── Accent glow colors per category (for hover glow) ─────────────
const glowColor: Record<string, string> = {
  agriculture: "rgba(34,197,94,0.25)",
  adventure:   "rgba(239,68,68,0.25)",
  trekking:    "rgba(148,163,184,0.20)",
  heritage:    "rgba(245,158,11,0.25)",
  nature:      "rgba(16,185,129,0.25)",
  pilgrimage:  "rgba(168,85,247,0.25)",
};

// ── Accent text/border color per category ────────────────────────
const accentClass: Record<string, { text: string; border: string; chip: string; dot: string }> = {
  agriculture: { text: "text-green-400",  border: "border-green-500/30",  chip: "bg-green-500/10 text-green-300 border-green-500/20",  dot: "bg-green-400"  },
  adventure:   { text: "text-red-400",    border: "border-red-500/30",    chip: "bg-red-500/10 text-red-300 border-red-500/20",         dot: "bg-red-400"    },
  trekking:    { text: "text-slate-300",  border: "border-slate-500/30",  chip: "bg-slate-500/10 text-slate-300 border-slate-500/20",   dot: "bg-slate-400"  },
  heritage:    { text: "text-amber-400",  border: "border-amber-500/30",  chip: "bg-amber-500/10 text-amber-300 border-amber-500/20",   dot: "bg-amber-400"  },
  nature:      { text: "text-emerald-400",border: "border-emerald-500/30",chip: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20", dot: "bg-emerald-400"},
  pilgrimage:  { text: "text-purple-400", border: "border-purple-500/30", chip: "bg-purple-500/10 text-purple-300 border-purple-500/20", dot: "bg-purple-400" },
};

const difficultyStyle: Record<string, string> = {
  Extreme:  "bg-rose-500/15 text-rose-300 border-rose-500/30",
  Hard:     "bg-red-500/15 text-red-300 border-red-500/30",
  Moderate: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Easy:     "bg-green-500/15 text-green-300 border-green-500/30",
};

// ── Animation variants ────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function CategoryGrid() {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {categoryGroups.map((group) => {
        const coverImage = group.spots[0].placeholderImage;
        const accent     = accentClass[group.id] ?? accentClass.trekking;
        const highlights = cardHighlights[group.id] ?? [];
        const glow       = glowColor[group.id] ?? "rgba(255,255,255,0.1)";

        return (
          <motion.div key={group.id} variants={cardVariants}>
            <motion.div
              whileHover={{
                scale: 1.02,
                boxShadow: `0 0 0 1px rgba(255,255,255,0.08), 0 24px 48px -12px ${glow}, 0 8px 24px -8px ${glow}`,
              }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px -4px rgba(0,0,0,0.4)" }}
              className="rounded-2xl overflow-hidden will-change-transform"
            >
              <TransitionLink
                href={`/experience/${group.id}`}
                className="flex flex-col bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden group"
              >
                {/* ── Image area ──────────────────────────────── */}
                <div className="relative h-44 flex-shrink-0 overflow-hidden">
                  <Image
                    src={coverImage}
                    alt={group.name}
                    fill
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    style={{ viewTransitionName: `category-cover-${group.id}` }}
                  />
                  {/* deep gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/90 via-[#09090b]/30 to-transparent" />

                  {/* Spots pill */}
                  <div className="absolute top-3 right-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md bg-black/30 text-white/70 border-white/10`}>
                      {group.spots.length} {group.spots.length === 1 ? "Spot" : "Spots"}
                    </span>
                  </div>

                  {/* Emoji + name */}
                  <div className="absolute bottom-3 left-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl drop-shadow-lg">{group.emoji}</span>
                      <h3 className="text-base font-semibold tracking-tight text-white drop-shadow leading-tight">
                        {group.name}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* ── Content area ────────────────────────────── */}
                <div className="flex flex-col flex-1 p-4 gap-4">

                  {/* Description */}
                  <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2">
                    {group.description}
                  </p>

                  {/* ── Highlight chips ───────────────────────── */}
                  <div className="flex flex-col gap-2">
                    <p className={`text-[10px] font-bold uppercase tracking-[0.12em] ${accent.text}`}>
                      Featured Experiences
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {highlights.map((h) => (
                        <span
                          key={h.label}
                          className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${accent.chip}`}
                        >
                          <span className="text-xs">{h.icon}</span>
                          {h.label}
                          {h.badge && (
                            <span className={`ml-0.5 text-[9px] font-bold px-1.5 py-px rounded-full border ${difficultyStyle[h.badge]}`}>
                              {h.badge}
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* ── Footer ────────────────────────────────── */}
                  <div className={`mt-auto pt-3 border-t ${accent.border} flex items-center justify-between`}>
                    {/* Stacked avatars */}
                    <div className="flex">
                      {group.spots.slice(0, 3).map((s, i) => (
                        <div
                          key={s.id}
                          className="relative w-6 h-6 rounded-full overflow-hidden border border-white/10 shadow-sm"
                          style={{ marginLeft: i === 0 ? 0 : -6 }}
                        >
                          <Image src={s.placeholderImage} alt={s.name} fill sizes="24px" className="object-cover" />
                        </div>
                      ))}
                      {group.spots.length > 3 && (
                        <div
                          className="w-6 h-6 rounded-full bg-white/10 border border-white/10 flex items-center justify-center"
                          style={{ marginLeft: -6 }}
                        >
                          <span className="text-[8px] font-bold text-zinc-400">+{group.spots.length - 3}</span>
                        </div>
                      )}
                    </div>

                    <span className={`text-[11px] font-semibold tracking-tight ${accent.text} flex items-center gap-1`}>
                      Explore
                      <span className="opacity-60 group-hover:translate-x-0.5 transition-transform duration-200 inline-block">→</span>
                    </span>
                  </div>
                </div>
              </TransitionLink>
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
