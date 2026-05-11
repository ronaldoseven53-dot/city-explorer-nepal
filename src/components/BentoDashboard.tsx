"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import HimalayanAICard from "./HimalayanAICard";
import LiveInsights from "./LiveInsights";
import FeaturedAdventureCard from "./FeaturedAdventureCard";
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



        {/* ── CELL 1: Featured Adventure ── */}
        <FeaturedAdventureCard />

        {/* ── CELL 2: Interactive Map ── */}
        <BentoCard className="lg:col-span-2 h-[460px] p-0 overflow-hidden" hoverShadow={HOVER_SHADOW}>
          <MapLoader />
        </BentoCard>

        {/* ── CELL 4: Himalaya AI ── */}
        <BentoCard className="min-h-[300px] flex flex-col p-8" hoverShadow={HOVER_SHADOW}>
          <HimalayanAICard />
        </BentoCard>

        {/* ── CELL 5: Live Insights ── */}
        <BentoCard className="lg:col-span-3 sm:col-span-2" hoverShadow={HOVER_SHADOW}>
          <LiveInsights isDark={isDark} />
        </BentoCard>

      </motion.div>

      {/* ── Footer ── */}
      <footer className="relative z-[3] text-center py-10 text-zinc-400 dark:text-white/30 text-sm border-t border-black/[0.08] dark:border-white/[0.07] mt-4">
        © 2025 City Explorer Nepal · Explore the Himalayas 🏔️
      </footer>
    </div>
  );
}
