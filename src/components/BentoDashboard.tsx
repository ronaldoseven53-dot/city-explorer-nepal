"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import dynamic from "next/dynamic";
import AIPlannerTrigger from "./AIPlannerTrigger";
import JourneyInsights from "./JourneyInsights";
import { destinations, categoryGroups } from "@/data/destinations";
import { checkSeasonality } from "@/lib/seasonality";
import { useTheme } from "@/context/ThemeContext";

const MapLoader = dynamic(() => import("./MapLoader"), { ssr: false });

// ── Constants ─────────────────────────────────────────────────────────
const NOISE_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const HERO_IMAGE = "/images/nepal-hero.jpg";
const TEMPLE_IMAGE = "https://images.unsplash.com/photo-1592285896110-8d88b5b3a5d8?w=2400&q=90";

// Uses CSS variables — auto-adapts to theme
const GLASS_STYLE = {
  background: "var(--glass-bg)",
  backdropFilter: "blur(40px)",
  WebkitBackdropFilter: "blur(40px)",
  border: "1px solid var(--glass-border)",
  boxShadow: "var(--glass-shadow)",
};

// ── Animation variants ────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden:  { opacity: 0, scale: 0.96, y: 16 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 20 },
  },
};

const hoverTransition = { type: "spring" as const, stiffness: 480, damping: 28 };

// ── Reusable glass card ───────────────────────────────────────────────
function BentoCard({
  children,
  className = "",
  onClick,
  hoverShadow,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverShadow: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -6, boxShadow: hoverShadow }}
      transition={hoverTransition}
      onClick={onClick}
      style={{ ...GLASS_STYLE, willChange: "transform" }}
      className={`rounded-[24px] overflow-hidden relative ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────
export default function BentoDashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Theme-conditional hover shadow (Framer can't interpolate CSS variables)
  const HOVER_SHADOW = isDark
    ? "inset 0 1px 0 rgba(255,255,255,0.10), 0 0 0 1px rgba(255,255,255,0.12), 0 20px 50px rgba(0,0,0,0.50), 0 0 40px rgba(220,38,38,0.10)"
    : "inset 1px 1px 0 rgba(255,255,255,1), 0 0 0 1px rgba(0,0,0,0.10), 0 20px 50px rgba(0,0,0,0.13)";

  const inSeasonCount = useMemo(() => {
    const m = new Date().getMonth();
    return checkSeasonality(destinations, m).length;
  }, []);

  const [heroImage, setHeroImage] = useState(HERO_IMAGE);

  useEffect(() => {
    let resetTimer: number | null = null;
    const handler = (e: Event) => {
      const image = (e as CustomEvent<{ image: string }>).detail.image;
      if (!image) return;
      setHeroImage(image);
      if (resetTimer !== null) window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => setHeroImage(HERO_IMAGE), 18000);
    };
    window.addEventListener("hero-image-change", handler);
    return () => {
      window.removeEventListener("hero-image-change", handler);
      if (resetTimer !== null) window.clearTimeout(resetTimer);
    };
  }, []);

  const stats = [
    { value: String(destinations.length), label: "Destinations" },
    { value: String(categoryGroups.length), label: "Categories" },
    { value: "8,848 m", label: "Highest Peak" },
    { value: `${inSeasonCount}`, label: "In Season" },
  ];

  const { scrollY, scrollYProgress } = useScroll();
  const himalayanOpacity = useTransform(scrollYProgress, [0, 0.25, 0.55], [1, 1, 0]);
  const templeOpacity    = useTransform(scrollYProgress, [0, 0.25, 0.55], [0, 0, 1]);
  const backgroundY      = useTransform(scrollY, [0, 4000], [0, -180]);

  const bgLayerStyle = {
    position: "absolute" as const,
    inset: "-25%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "blur(3px) saturate(0.22) brightness(1.65) contrast(0.82)",
    willChange: "transform, opacity",
  };

  return (
    <div id="discover" className="relative min-h-screen">

      {/* ── Layer 1a: Himalayas ── */}
      <div className="fixed inset-0 z-[-2] overflow-hidden pointer-events-none">
        <motion.div style={{ ...bgLayerStyle, opacity: himalayanOpacity, y: backgroundY, backgroundImage: `url('${heroImage}')` }} />
      </div>

      {/* ── Layer 1b: Temple ── */}
      <div className="fixed inset-0 z-[-2] overflow-hidden pointer-events-none">
        <motion.div style={{ ...bgLayerStyle, opacity: templeOpacity, y: backgroundY, backgroundImage: `url('${TEMPLE_IMAGE}')` }} />
      </div>

      {/* ── Layer 2: Color grade overlay — CSS var ── */}
      <div className="fixed inset-0 z-[-1] pointer-events-none"
        style={{ background: "var(--page-overlay)" }}
      />

      {/* ── Layer 3: Vignette — CSS var ── */}
      <div aria-hidden className="fixed inset-0 z-[-1] pointer-events-none"
        style={{ background: "var(--page-vignette)" }}
      />

      {/* ── Layer 4: Film grain ── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[2] opacity-[0.030] mix-blend-overlay"
        style={{ backgroundImage: NOISE_BG, backgroundRepeat: "repeat", backgroundSize: "128px 128px" }}
      />

      {/* ── Aurora 1 ── */}
      <motion.div aria-hidden className="fixed pointer-events-none z-[1]"
        style={{ top: "-15%", right: "-10%", width: "45vw", height: "45vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(220,20,60,0.18) 0%, rgba(180,20,40,0.10) 45%, transparent 70%)",
          filter: "blur(70px)" }}
        animate={{ scale: [1,1.18,0.92,1.10,1], opacity: [0.45,0.75,0.30,0.80,0.45], x: ["0%","4%","-2%","2%","0%"], y: ["0%","3%","-4%","1%","0%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Aurora 2 ── */}
      <motion.div aria-hidden className="fixed pointer-events-none z-[1]"
        style={{ bottom: "-10%", left: "-8%", width: "38vw", height: "38vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,56,147,0.14) 0%, rgba(0,40,120,0.08) 50%, transparent 70%)",
          filter: "blur(80px)" }}
        animate={{ scale: [1,1.25,0.88,1.15,1], opacity: [0.30,0.55,0.18,0.48,0.30] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />

      {/* ── Bento grid ── */}
      <motion.div
        className="relative z-[3] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        {/* ── CELL 1: Hero ── */}
        <BentoCard className="lg:col-span-3 sm:col-span-2 min-h-[320px]" hoverShadow={HOVER_SHADOW}>
          <div className="absolute inset-0">
            <Image src={heroImage} alt="Himalayan peaks" fill className="object-cover object-center" priority />
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/15 to-transparent" />
          </div>
          <div className="relative z-10 p-8 sm:p-10 flex flex-col sm:flex-row sm:items-end justify-between gap-8 h-full">
            <div>
              <p className="text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">
                🇳🇵 Himalayan Kingdom
              </p>
              <p className="text-zinc-600 dark:text-white/60 text-sm sm:text-base max-w-md leading-relaxed">
                Discover Nepal&apos;s most breathtaking destinations — from sacred pilgrimage sites to remote Himalayan trails.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              {stats.map((s) => (
                <div
                  key={s.label}
                  style={{ ...GLASS_STYLE }}
                  className="rounded-2xl px-4 py-3 text-center min-w-[80px]"
                >
                  <p className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">{s.value}</p>
                  <p className="text-zinc-500 dark:text-white/45 text-[11px] font-medium mt-0.5 uppercase tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </BentoCard>

        {/* ── CELL 2: Journey Insights ── */}
        <BentoCard className="lg:col-span-3 sm:col-span-2 p-6 sm:p-8" hoverShadow={HOVER_SHADOW}>
          <JourneyInsights isDark={isDark} />
        </BentoCard>

        {/* ── CELL 3: Interactive Map ── */}
        <BentoCard className="lg:col-span-2 min-h-[420px] flex flex-col" hoverShadow={HOVER_SHADOW}>
          <div className="p-4 pb-2 flex-shrink-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 dark:text-white/40 mb-1">Live</p>
            <h2 className="text-base font-bold text-zinc-900 dark:text-white tracking-tight">Interactive Map</h2>
          </div>
          <div className="flex-1 min-h-0">
            <MapLoader />
          </div>
        </BentoCard>

        {/* ── CELL 3: AI Planner CTA ── */}
        <BentoCard className="min-h-[280px] flex flex-col justify-between p-8" hoverShadow={HOVER_SHADOW}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-600 dark:text-red-400 mb-1">✨ Gemini AI</p>
            <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight mt-1 mb-3">
              Plan your perfect Nepal trip
            </h2>
            <p className="text-zinc-500 dark:text-white/50 text-sm leading-relaxed">
              Tell our AI your interests, budget, or dates — it builds a personalised itinerary instantly.
            </p>
          </div>
          <div className="mt-6">
            <AIPlannerTrigger />
          </div>
        </BentoCard>

      </motion.div>

      {/* ── Footer ── */}
      <footer className="relative z-[3] text-center py-10 text-zinc-400 dark:text-white/30 text-sm border-t border-black/[0.08] dark:border-white/[0.07] mt-4">
        © 2025 City Explorer Nepal · Explore the Himalayas 🏔️
      </footer>
    </div>
  );
}
