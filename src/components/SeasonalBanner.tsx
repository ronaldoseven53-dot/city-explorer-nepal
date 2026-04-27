"use client";

import { useMemo } from "react";
import Image from "next/image";
import TransitionLink from "@/components/TransitionLink";
import { destinations } from "@/data/destinations";
import { checkSeasonality } from "@/lib/seasonality";
import { motion } from "motion/react";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const SEASON_ICON: Record<number, string> = {
  0: "❄️", 1: "❄️", 2: "🌸", 3: "🌸", 4: "🌿", 5: "🌿",
  6: "🌧️", 7: "🌧️", 8: "🍂", 9: "🍂", 10: "🍂", 11: "❄️",
};

const cardVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, type: "spring" as const, stiffness: 100, damping: 20 },
  }),
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
      className="bg-[#09090b] border-y border-white/[0.08]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[29px]">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-1">
              {SEASON_ICON[month]} Seasonal Recommendation
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              Best destinations to visit in{" "}
              <span className="text-emerald-400">{MONTH_NAMES[month]}</span>
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              {inSeason.length} of {destinations.length} destinations are in peak season right now
            </p>
          </div>

          {/* Progress pill */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center bg-emerald-500/10 border border-emerald-500/25 rounded-3xl px-4 py-2 min-w-[72px]">
            <span className="text-2xl font-extrabold text-emerald-400 leading-none">
              {inSeason.length}
            </span>
            <span className="text-[10px] text-emerald-500 font-medium mt-0.5 leading-none">
              in season
            </span>
          </div>
        </div>

        {/* Scrollable card row */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory">
          {inSeason.map((d, i) => (
            <motion.div
              key={d.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{ scale: 1.03, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), 0 0 0 1px rgba(255,255,255,0.08), 0 16px 40px -8px rgba(0,0,0,0.6)" }}
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 0 0 1px rgba(255,255,255,0.06)" }}
              transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
              className="flex-shrink-0 w-44 sm:w-52 snap-start"
            >
              <TransitionLink
                href={`/destinations/${d.id}`}
                className="group block bg-zinc-900/40 backdrop-blur-xl border border-white/[0.10] rounded-3xl overflow-hidden"
              >
                <div className="relative h-28">
                  <Image
                    src={d.placeholderImage}
                    alt={d.name}
                    fill
                    sizes="(max-width:640px) 176px, 208px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Radial + linear gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{ background: "radial-gradient(ellipse at bottom, #00010c 0%, transparent 75%)" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00010c]/70 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2.5 text-white text-xs font-semibold leading-tight drop-shadow">
                    {d.name}
                  </span>
                </div>
                <div className="px-4 py-3">
                  <p className="text-[11px] text-emerald-400 font-semibold truncate">
                    {d.bestTimeToVisit.split("(")[0].trim()}
                  </p>
                  <p className="text-[10px] text-zinc-500 capitalize mt-0.5">{d.category}</p>
                </div>
              </TransitionLink>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
