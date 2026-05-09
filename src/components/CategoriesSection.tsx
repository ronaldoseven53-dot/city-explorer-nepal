"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { categoryGroups } from "@/data/destinations";

// Maps category group IDs → MapSection filter keys
const SLIDE_TO_MAP_KEY: Record<string, string> = {
  trekking:    "mountain",
  adventure:   "mountain",
  heritage:    "heritage",
  nature:      "nature",
  pilgrimage:  "pilgrimage",
  agriculture: "agriculture",
};

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

// ── Main section ───────────────────────────────────────────────────────

export default function CategoriesSection() {
  const [current, setCurrent]           = useState(0);
  const [dir, setDir]                   = useState(1);
  const [arrowsVisible, setArrowsVisible] = useState(false);
  const [rippleKey, setRippleKey]       = useState(0);
  const touchStartX                     = useRef<number>(0);

  // Auto-advance every 5 s
  useEffect(() => {
    const t = setInterval(() => {
      setDir(1);
      setCurrent(c => (c + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const goNext = () => { setDir(1);  setCurrent(c => (c + 1) % SLIDES.length); };
  const goPrev = () => { setDir(-1); setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length); };
  const goTo   = (i: number) => { setDir(i > current ? 1 : -1); setCurrent(i); };

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd   = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -50) goNext();
    else if (dx > 50) goPrev();
  };

  const slide = SLIDES[current];

  const handleExplore = () => {
    const mapKey = SLIDE_TO_MAP_KEY[slide.id];
    setRippleKey(k => k + 1);
    if (mapKey) {
      document.dispatchEvent(new CustomEvent("map-filter", { detail: { key: mapKey } }));
    }
    setTimeout(() => {
      document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" });
    }, 220);
  };

  return (
    <section className="relative w-full py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-0.5"
              style={{ color: "rgba(255,255,255,0.38)" }}>
              Explore by Theme
            </p>
            <h2 className="text-[18px] font-extrabold text-white tracking-tight">
              Featured Destinations
            </h2>
          </div>
        </div>

        {/* Featured carousel */}
        <div
          className="relative rounded-[28px] overflow-hidden"
          style={{ height: 300 }}
          onMouseEnter={() => setArrowsVisible(true)}
          onMouseLeave={() => setArrowsVisible(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
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
                    onClick={handleExplore}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="relative flex items-center gap-1.5 text-[13px] font-bold cursor-pointer overflow-hidden rounded-sm"
                    style={{ color: slide.accent }}
                  >
                    {/* Click ripple */}
                    <AnimatePresence>
                      {rippleKey > 0 && (
                        <motion.span
                          key={rippleKey}
                          className="absolute inset-0 rounded-sm pointer-events-none"
                          initial={{ opacity: 0.5, scale: 0.4 }}
                          animate={{ opacity: 0, scale: 3 }}
                          exit={{}}
                          transition={{ duration: 0.45, ease: "easeOut" }}
                          style={{ background: slide.accent, transformOrigin: "center" }}
                        />
                      )}
                    </AnimatePresence>
                    Explore
                    <ChevronRight size={14} strokeWidth={2.5} />
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Back arrow */}
          <motion.button
            onClick={goPrev}
            animate={{ opacity: arrowsVisible ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center cursor-pointer"
            style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "rgba(10,14,28,0.55)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.22)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.40)",
            }}
            aria-label="Previous slide"
          >
            <ChevronLeft size={18} color="white" strokeWidth={2} />
          </motion.button>

          {/* Next arrow */}
          <motion.button
            onClick={goNext}
            animate={{ opacity: arrowsVisible ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center cursor-pointer"
            style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "rgba(10,14,28,0.55)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.22)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.40)",
            }}
            aria-label="Next slide"
          >
            <ChevronRight size={18} color="white" strokeWidth={2} />
          </motion.button>

          {/* Dot indicators */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                className="relative cursor-pointer flex-shrink-0"
                style={{
                  width:  i === current ? 20 : 6,
                  height: 6,
                  transition: "width 0.25s ease",
                }}
              >
                <div className="absolute inset-0 rounded-full"
                  style={{ background: "rgba(255,255,255,0.28)" }} />
                {i === current && (
                  <motion.div
                    layoutId="carousel-active-dot"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: slide.accent,
                      boxShadow: `0 0 10px ${slide.accent}90`,
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
