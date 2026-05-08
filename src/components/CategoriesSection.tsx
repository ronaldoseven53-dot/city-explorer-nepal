"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import {
  Mountain, Landmark, Leaf, Star, TrendingUp, Wheat,
  PawPrint, Waves, Bike, Camera, Globe, Heart,
  ChevronRight,
} from "lucide-react";
import { categoryGroups } from "@/data/destinations";

// ── Category icon data ─────────────────────────────────────────────────

const MAIN_CATS = [
  { id: "trekking",    label: "Trekking",     color: "#3B82F6", bg: "rgba(59,130,246,0.20)",  Icon: Mountain   },
  { id: "heritage",    label: "Heritage",     color: "#F97316", bg: "rgba(249,115,22,0.20)",  Icon: Landmark   },
  { id: "nature",      label: "Nature",       color: "#22C55E", bg: "rgba(34,197,94,0.20)",   Icon: Leaf       },
  { id: "pilgrimage",  label: "Pilgrimage",   color: "#A855F7", bg: "rgba(168,85,247,0.20)",  Icon: Star       },
  { id: "hillside",    label: "Hillside",     color: "#14B8A6", bg: "rgba(20,184,166,0.20)",  Icon: TrendingUp },
  { id: "agriculture", label: "Agriculture",  color: "#84CC16", bg: "rgba(132,204,22,0.20)",  Icon: Wheat      },
] as const;

const LEISURE_CATS = [
  { id: "wildlife",    label: "Wildlife",     color: "#EF4444", bg: "rgba(239,68,68,0.20)",   Icon: PawPrint  },
  { id: "rafting",     label: "Rafting",      color: "#0EA5E9", bg: "rgba(14,165,233,0.20)",  Icon: Waves     },
  { id: "cycling",     label: "Cycling",      color: "#F59E0B", bg: "rgba(245,158,11,0.20)",  Icon: Bike      },
  { id: "photo",       label: "Photography",  color: "#EC4899", bg: "rgba(236,72,153,0.20)",  Icon: Camera    },
  { id: "cultural",    label: "Cultural",     color: "#6366F1", bg: "rgba(99,102,241,0.20)",  Icon: Globe     },
  { id: "wellness",    label: "Wellness",     color: "#10B981", bg: "rgba(16,185,129,0.20)",  Icon: Heart     },
] as const;

// ── Carousel slides from real category groups ──────────────────────────

const ACCENT: Record<string, string> = {
  agriculture: "#84CC16",
  adventure:   "#EF4444",
  trekking:    "#3B82F6",
  heritage:    "#F97316",
  nature:      "#22C55E",
  pilgrimage:  "#A855F7",
};

const SLIDES = categoryGroups.map((g) => ({
  id:          g.id,
  title:       g.name,
  description: g.description.length > 115 ? g.description.slice(0, 112) + "…" : g.description,
  image:       g.spots[0]?.placeholderImage ?? "",
  accent:      ACCENT[g.id] ?? "#F97316",
}));

// ── Framer Motion variants ─────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ x: dir * 140, opacity: 0, scale: 0.96 }),
  center: {
    x: 0, opacity: 1, scale: 1,
    transition: { type: "spring" as const, stiffness: 280, damping: 28 },
  },
  exit: (dir: number) => ({
    x: dir * -100, opacity: 0, scale: 0.97,
    transition: { duration: 0.22, ease: "easeIn" as const },
  }),
};

// ── Sub-components ─────────────────────────────────────────────────────

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[15px] font-extrabold tracking-tight text-white/90">{label}</span>
      <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.09)" }} />
    </div>
  );
}

function CategoryChip({
  label, color, bg, Icon,
}: {
  label: string; color: string; bg: string;
  Icon: React.ElementType;
}) {
  return (
    <motion.button
      whileHover={{ y: -5, scale: 1.06 }}
      whileTap={{ scale: 0.93 }}
      transition={{ type: "spring", stiffness: 440, damping: 22 }}
      className="flex flex-col items-center gap-2.5 p-3 w-full cursor-pointer"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.09)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderRadius: 18,
      }}
    >
      {/* Glow circle */}
      <div
        className="w-[50px] h-[50px] rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: bg,
          boxShadow: `0 0 20px ${color}55, 0 0 7px ${color}35, inset 0 1px 0 rgba(255,255,255,0.18)`,
        }}
      >
        <Icon size={22} color={color} strokeWidth={1.75} />
      </div>
      <span className="text-[10.5px] font-semibold text-center leading-tight"
        style={{ color: "rgba(255,255,255,0.78)" }}>
        {label}
      </span>
    </motion.button>
  );
}

// ── Main section ───────────────────────────────────────────────────────

export default function CategoriesSection() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir]         = useState(1);

  // Auto-advance every 5 s
  useEffect(() => {
    const t = setInterval(() => {
      setDir(1);
      setCurrent(c => (c + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const goNext = () => {
    setDir(1);
    setCurrent(c => (c + 1) % SLIDES.length);
  };

  const goTo = (i: number) => {
    setDir(i > current ? 1 : -1);
    setCurrent(i);
  };

  const slide = SLIDES[current];

  return (
    <section className="relative w-full py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* ── Categories grid ── */}
        <div>
          <SectionHeader label="Categories" />
          <div className="grid grid-cols-6 gap-2.5 sm:gap-3">
            {MAIN_CATS.map((c) => (
              <CategoryChip key={c.id} label={c.label} color={c.color} bg={c.bg} Icon={c.Icon} />
            ))}
          </div>
        </div>

        {/* ── Family & Leisure grid ── */}
        <div>
          <SectionHeader label="Family & Leisure" />
          <div className="grid grid-cols-6 gap-2.5 sm:gap-3">
            {LEISURE_CATS.map((c) => (
              <CategoryChip key={c.id} label={c.label} color={c.color} bg={c.bg} Icon={c.Icon} />
            ))}
          </div>
        </div>

        {/* ── Featured carousel ── */}
        <div>
          <SectionHeader label="Featured" />

          <div className="relative rounded-[28px] overflow-hidden" style={{ height: 300 }}>

            {/* Slides */}
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={slide.id}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0"
                style={{ willChange: "transform, opacity" }}
              >
                {/* Background image */}
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(4,8,22,0.90) 0%, rgba(4,8,22,0.50) 45%, rgba(4,8,22,0.20) 100%)" }}
                />

                {/* Accent tint */}
                <div className="absolute inset-0 mix-blend-multiply"
                  style={{ background: `linear-gradient(135deg, ${slide.accent}22 0%, transparent 60%)` }}
                />

                {/* Text content */}
                <div className="absolute bottom-0 left-0 p-6 sm:p-8 pr-20">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.35 }}
                  >
                    {/* Accent pill */}
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold mb-2.5"
                      style={{ background: `${slide.accent}28`, border: `1px solid ${slide.accent}55`, color: slide.accent }}>
                      {categoryGroups[current]?.emoji} {slide.id.charAt(0).toUpperCase() + slide.id.slice(1)}
                    </span>

                    <h3 className="text-white font-extrabold text-[22px] sm:text-[26px] tracking-tight leading-tight mb-2">
                      {slide.title}
                    </h3>
                    <p className="text-white/65 text-[12px] sm:text-[13px] leading-relaxed max-w-lg mb-4">
                      {slide.description}
                    </p>
                    <motion.button
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="flex items-center gap-1.5 text-[13px] font-bold cursor-pointer"
                      style={{ color: slide.accent }}
                    >
                      Explore
                      <ChevronRight size={14} strokeWidth={2.5} />
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Next arrow */}
            <button
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center cursor-pointer transition-opacity duration-150 hover:opacity-90"
              style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "rgba(255,255,255,0.14)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.22)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
              }}
              aria-label="Next slide"
            >
              <ChevronRight size={18} color="white" strokeWidth={2} />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Slide ${i + 1}`}
                  className="cursor-pointer transition-all duration-300"
                  style={{
                    width:        i === current ? 20 : 6,
                    height:       6,
                    borderRadius: 9999,
                    background:   i === current ? slide.accent : "rgba(255,255,255,0.35)",
                    boxShadow:    i === current ? `0 0 8px ${slide.accent}80` : "none",
                  }}
                />
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
