"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ── Festival data ──────────────────────────────────────────────────────

const U = (id: string) => `https://images.unsplash.com/${id}?w=600&q=85&fit=crop`;

const FESTIVALS = [
  {
    id: "shivaratri",
    name: "Maha Shivaratri",
    month: "Feb / Mar",
    location: "Pashupatinath, Kathmandu",
    description: "The night of Shiva — bonfires, sadhus, and the sacred Bagmati river aglow.",
    accent: "#A855F7",
    emoji: "🔱",
    img: U("photo-1518548419970-58e3b4079ab2"),
  },
  {
    id: "holi",
    name: "Holi",
    month: "March",
    location: "Nationwide",
    description: "Nepal's wildest colour festival — powder, music, and spring celebration.",
    accent: "#EC4899",
    emoji: "🎨",
    img: U("photo-1520637836862-4d197d17c93a"),
  },
  {
    id: "bisket",
    name: "Bisket Jatra",
    month: "April",
    location: "Bhaktapur",
    description: "New Year chariot procession — the massive pole toppling marks the year's start.",
    accent: "#F97316",
    emoji: "🎡",
    img: U("photo-1513614835783-51537729c8ba"),
  },
  {
    id: "buddha",
    name: "Buddha Purnima",
    month: "May",
    location: "Lumbini & Boudhanath",
    description: "Full-moon birthday of the Enlightened One — pilgrims, butter lamps, and sutras.",
    accent: "#F59E0B",
    emoji: "☸️",
    img: U("photo-1609168494389-230528e6a9c3"),
  },
  {
    id: "teej",
    name: "Teej",
    month: "Aug / Sep",
    location: "Pashupatinath & Temples",
    description: "Women's festival of fasting, red sarees, and devotional dancing for marital bliss.",
    accent: "#EF4444",
    emoji: "💃",
    img: U("photo-1592285896110-8d88b5b3a5d8"),
  },
  {
    id: "indra",
    name: "Indra Jatra",
    month: "September",
    location: "Kathmandu Durbar Square",
    description: "Living Goddess Kumari's chariot parade — masked dances and eight days of revelry.",
    accent: "#0EA5E9",
    emoji: "🏮",
    img: U("photo-1546954552-eb2ada4a3654"),
  },
  {
    id: "dashain",
    name: "Dashain",
    month: "October",
    location: "Nationwide",
    description: "Nepal's greatest festival — 15 days of family, tikka blessings, and kite flying.",
    accent: "#22C55E",
    emoji: "🪁",
    img: U("photo-1544442069-97dded965a9f"),
  },
  {
    id: "tihar",
    name: "Tihar",
    month: "Oct / Nov",
    location: "Nationwide",
    description: "Festival of Lights — oil lamps, rangoli, and the veneration of crows, dogs, and cows.",
    accent: "#F59E0B",
    emoji: "🪔",
    img: U("photo-1558618666-fcd25c85cd64"),
  },
];

// ── Festival card ──────────────────────────────────────────────────────

function FestivalCard({ fest, isFocus }: { fest: typeof FESTIVALS[0]; isFocus: boolean }) {
  return (
    <motion.div
      className="relative flex-shrink-0 rounded-[24px] overflow-hidden cursor-pointer select-none"
      style={{ width: "100%", height: 280 }}
      animate={{ scale: isFocus ? 1 : 0.94, opacity: isFocus ? 1 : 0.55 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
    >
      {/* Image */}
      <Image
        src={fest.img}
        alt={fest.name}
        fill
        className="object-cover object-center"
        sizes="(max-width: 640px) 80vw, 33vw"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(4,8,22,0.95) 0%, rgba(4,8,22,0.55) 45%, rgba(4,8,22,0.15) 100%)",
        }}
      />

      {/* Accent tint */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${fest.accent}20 0%, transparent 55%)`,
          mixBlendMode: "screen",
        }}
      />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        {/* Pill */}
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold mb-2"
          style={{
            background: `${fest.accent}25`,
            border: `1px solid ${fest.accent}50`,
            color: fest.accent,
          }}
        >
          {fest.emoji} {fest.month}
        </span>

        <h3 className="text-white font-extrabold text-[18px] tracking-tight leading-tight mb-1">
          {fest.name}
        </h3>

        <p className="text-white/45 text-[10.5px] mb-2">{fest.location}</p>

        <AnimatePresence mode="wait">
          {isFocus && (
            <motion.p
              key="desc"
              className="text-white/65 text-[11px] leading-relaxed"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              {fest.description}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Main section ───────────────────────────────────────────────────────

export default function FestivalCalendar() {
  const [current, setCurrent] = useState(0);
  const [cardW, setCardW]     = useState(260);
  const trackRef              = useRef<HTMLDivElement>(null);
  const touchStartX           = useRef<number>(0);

  // Measure card width responsively
  const measure = useCallback(() => {
    if (!trackRef.current) return;
    const w = trackRef.current.clientWidth;
    // 3 cards visible, ~4% gap each side = show 3 full cards
    setCardW(Math.round((w - 16 * 2) / 3));
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [measure]);

  const gap = 12;
  const offset = -(current * (cardW + gap)) + (trackRef.current ? (trackRef.current.clientWidth - cardW) / 2 - cardW - gap : 0);

  const prev = () => setCurrent(c => Math.max(c - 1, 0));
  const next = () => setCurrent(c => Math.min(c + 1, FESTIVALS.length - 1));

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd   = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -40) next();
    else if (dx > 40) prev();
  };

  return (
    <section className="relative w-full py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.22em] mb-0.5"
              style={{ color: "rgba(255,255,255,0.38)" }}
            >
              Plan Around Culture
            </p>
            <h2 className="text-[18px] font-extrabold text-white tracking-tight">
              Festival Calendar
            </h2>
          </div>
          {/* Arrows */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={prev}
              whileTap={{ scale: 0.88 }}
              disabled={current === 0}
              className="flex items-center justify-center cursor-pointer transition-all duration-150"
              style={{
                width: 34, height: 34, borderRadius: "50%",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                opacity: current === 0 ? 0.3 : 1,
              }}
              aria-label="Previous festival"
            >
              <ChevronLeft size={16} color="white" strokeWidth={2} />
            </motion.button>
            <motion.button
              onClick={next}
              whileTap={{ scale: 0.88 }}
              disabled={current === FESTIVALS.length - 1}
              className="flex items-center justify-center cursor-pointer transition-all duration-150"
              style={{
                width: 34, height: 34, borderRadius: "50%",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                opacity: current === FESTIVALS.length - 1 ? 0.3 : 1,
              }}
              aria-label="Next festival"
            >
              <ChevronRight size={16} color="white" strokeWidth={2} />
            </motion.button>
          </div>
        </div>

        {/* Slider track */}
        <div
          ref={trackRef}
          className="relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ height: 290 }}
        >
          <motion.div
            className="absolute flex"
            style={{ gap, top: 0, left: 0, paddingLeft: (trackRef.current?.clientWidth ?? 0) / 2 - cardW / 2 - cardW - gap }}
            animate={{ x: offset }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          >
            {FESTIVALS.map((fest, i) => (
              <div
                key={fest.id}
                style={{ width: cardW, flexShrink: 0 }}
                onClick={() => setCurrent(i)}
              >
                <FestivalCard fest={fest} isFocus={i === current} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {FESTIVALS.map((fest, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Festival ${i + 1}`}
              className="relative cursor-pointer flex-shrink-0 transition-all duration-250"
              style={{
                width:  i === current ? 20 : 6,
                height: 6,
                transition: "width 0.25s ease",
              }}
            >
              <div className="absolute inset-0 rounded-full"
                style={{ background: "rgba(255,255,255,0.18)" }} />
              {i === current && (
                <motion.div
                  layoutId="festival-active-dot"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: FESTIVALS[current].accent,
                    boxShadow: `0 0 8px ${FESTIVALS[current].accent}90`,
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
