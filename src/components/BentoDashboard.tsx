"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import dynamic from "next/dynamic";
import TransitionLink from "./TransitionLink";
import AIPlannerTrigger from "./AIPlannerTrigger";
import { destinations, categoryGroups } from "@/data/destinations";
import { checkSeasonality } from "@/lib/seasonality";

const MapLoader = dynamic(() => import("./MapLoader"), { ssr: false });

// ── Constants ─────────────────────────────────────────────────────────
const NOISE_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1673505413397-0cd0dc4f5854?w=1600&q=85";

const GLASS_STYLE = {
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.10)",
};

const HOVER_SHADOW =
  "inset 0 1px 1px rgba(255,255,255,0.10), 0 0 0 1px rgba(255,255,255,0.30), 0 24px 48px rgba(0,0,0,0.55)";

// ── Animation variants ────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden:  { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: "spring" as const, stiffness: 120, damping: 14 },
  },
};

const hoverTransition = { type: "spring" as const, stiffness: 300, damping: 25 };

// ── Reusable glass card ───────────────────────────────────────────────
function BentoCard({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8, boxShadow: HOVER_SHADOW }}
      transition={hoverTransition}
      onClick={onClick}
      style={GLASS_STYLE}
      className={`rounded-[2rem] overflow-hidden relative ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ── Experience card: image bleeds into glass ──────────────────────────
function ExperienceCard({
  group,
  className = "",
}: {
  group: (typeof categoryGroups)[0];
  className?: string;
}) {
  const cover = group.spots[0]?.placeholderImage ?? "";

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8, boxShadow: HOVER_SHADOW }}
      transition={hoverTransition}
      style={GLASS_STYLE}
      className={`rounded-[2rem] overflow-hidden relative min-h-[280px] flex flex-col cursor-pointer ${className}`}
    >
      {/* Full-bleed image background */}
      {cover && (
        <div className="absolute inset-0">
          <Image src={cover} alt={group.name} fill className="object-cover" />
          {/* Image-to-glass: transparent at top 20%, blurs into dark glass */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, transparent 20%, rgba(5,5,5,0.82) 65%, rgba(5,5,5,0.96) 100%)",
            }}
          />
        </div>
      )}

      {/* Content anchored to bottom */}
      <TransitionLink
        href={`/experience/${group.id}`}
        className="relative flex flex-col justify-end flex-1 p-6"
      >
        <span className="text-2xl mb-2 drop-shadow-lg">{group.emoji}</span>
        <h3 className="text-lg font-bold text-white tracking-tight leading-tight">
          {group.name}
        </h3>
        <p className="text-white/50 text-xs mt-1 line-clamp-2 leading-relaxed">
          {group.description}
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white/60 hover:text-white transition-colors">
          Explore <span className="opacity-60">→</span>
        </span>
      </TransitionLink>
    </motion.div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────
export default function BentoDashboard() {
  const inSeasonCount = useMemo(() => {
    const m = new Date().getMonth();
    return checkSeasonality(destinations, m).length;
  }, []);

  const stats = [
    { value: String(destinations.length), label: "Destinations" },
    { value: String(categoryGroups.length), label: "Categories" },
    { value: "8,848 m", label: "Highest Peak" },
    { value: `${inSeasonCount}`, label: "In Season" },
  ];

  const sesonPct = Math.round((inSeasonCount / destinations.length) * 100);

  return (
    // Full-page wrapper with deep radial background
    <div
      className="relative min-h-screen"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, #0f172a 0%, #050505 70%)",
      }}
    >
      {/* ── Noise texture overlay (cinematic grain) ─────────── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[2] opacity-[0.028] mix-blend-overlay"
        style={{ backgroundImage: NOISE_BG, backgroundRepeat: "repeat", backgroundSize: "128px 128px" }}
      />

      {/* ── Bento grid ──────────────────────────────────────── */}
      <motion.div
        className="relative z-[3] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        {/* ── CELL 1: Hero — full width ──────────────────────── */}
        <BentoCard className="lg:col-span-3 sm:col-span-2 min-h-[320px]">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image src={HERO_IMAGE} alt="Himalayan peaks" fill className="object-cover object-center" priority />
            <div className="absolute inset-0 bg-gradient-to-br from-[#050505]/70 via-[#0f172a]/50 to-transparent" />
          </div>

          <div className="relative z-10 p-8 sm:p-10 flex flex-col sm:flex-row sm:items-end justify-between gap-8 h-full">
            {/* Text block */}
            <div>
              <p className="text-red-400 text-xs font-bold uppercase tracking-[0.2em] mb-3">
                🇳🇵 Himalayan Kingdom
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-3">
                Explore the{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-300">
                  Wonders of Nepal
                </span>
              </h1>
              <p className="text-white/50 text-sm sm:text-base max-w-lg leading-relaxed">
                From the birthplace of Buddha to the roof of the world — discover Nepal&apos;s most breathtaking destinations.
              </p>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              {stats.map((s) => (
                <div
                  key={s.label}
                  style={{ ...GLASS_STYLE, boxShadow: "inset 0 1px 1px rgba(255,255,255,0.12)" }}
                  className="rounded-2xl px-4 py-3 text-center min-w-[80px]"
                >
                  <p className="text-2xl font-extrabold text-white tracking-tight">{s.value}</p>
                  <p className="text-white/40 text-[11px] font-medium mt-0.5 uppercase tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </BentoCard>

        {/* ── CELL 2: Interactive Map — col-span-2 ──────────── */}
        <BentoCard className="lg:col-span-2 min-h-[420px] flex flex-col">
          <div className="p-4 pb-2 flex-shrink-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500 mb-1">Live</p>
            <h2 className="text-base font-bold text-white tracking-tight">Interactive Map</h2>
          </div>
          <div className="flex-1 min-h-0">
            <MapLoader />
          </div>
        </BentoCard>

        {/* ── CELL 3: Season Stats — col-span-1 ─────────────── */}
        <BentoCard className="min-h-[420px] flex flex-col justify-between p-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400 mb-1">Right Now</p>
            <h2 className="text-base font-bold text-white tracking-tight mb-6">Season Pulse</h2>

            {/* Animated stat bars */}
            {[
              { label: "In season", value: inSeasonCount, total: destinations.length, color: "bg-emerald-400" },
              { label: "Total destinations", value: destinations.length, total: destinations.length, color: "bg-blue-400" },
              { label: "Categories", value: categoryGroups.length, total: 10, color: "bg-amber-400" },
            ].map((bar) => (
              <div key={bar.label} className="mb-5">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-400 font-medium">{bar.label}</span>
                  <span className="text-white font-bold">{bar.value}</span>
                </div>
                <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${bar.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(bar.value / bar.total) * 100}%` }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Season ring */}
          <div className="flex flex-col items-center mt-4">
            <svg viewBox="0 0 80 80" className="w-24 h-24">
              <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
              <motion.circle
                cx="40" cy="40" r="32"
                fill="none"
                stroke="#34d399"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 32}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - sesonPct / 100) }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
                style={{ rotate: "-90deg", transformOrigin: "40px 40px" }}
              />
              <text x="40" y="44" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{sesonPct}%</text>
            </svg>
            <p className="text-zinc-500 text-xs mt-2 text-center">destinations in peak season</p>
          </div>
        </BentoCard>

        {/* ── CELLS 4-9: Experience categories ──────────────── */}
        {/* Row 3: Agriculture (1) | Adventure (2) */}
        <ExperienceCard group={categoryGroups[0]} />
        <ExperienceCard group={categoryGroups[1]} className="lg:col-span-2" />

        {/* Row 4: Trekking (2) | Heritage (1) */}
        <ExperienceCard group={categoryGroups[2]} className="lg:col-span-2" />
        <ExperienceCard group={categoryGroups[3]} />

        {/* Row 5: Nature (1) | Pilgrimage (1) | AI Planner (1) */}
        <ExperienceCard group={categoryGroups[4]} />
        <ExperienceCard group={categoryGroups[5]} />

        {/* ── CELL 10: AI Planner CTA ────────────────────────── */}
        <BentoCard className="min-h-[280px] flex flex-col justify-between p-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-400 mb-1">✨ Gemini AI</p>
            <h2 className="text-xl font-extrabold text-white tracking-tight leading-tight mt-1 mb-3">
              Plan your perfect Nepal trip
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Tell our AI your interests, budget, or dates — it builds a personalised itinerary instantly.
            </p>
          </div>
          <div className="mt-6">
            <AIPlannerTrigger />
          </div>
        </BentoCard>

      </motion.div>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="relative z-[3] text-center py-10 text-zinc-600 text-sm border-t border-white/[0.06] mt-4">
        © 2025 City Explorer Nepal · Explore the Himalayas 🏔️
      </footer>
    </div>
  );
}
