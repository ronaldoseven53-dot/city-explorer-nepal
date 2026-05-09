"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import Image from "next/image";

// ── Day data ───────────────────────────────────────────────────────────

const U = (id: string) => `https://images.unsplash.com/${id}?w=200&q=85&fit=crop`;

const DAYS = [
  { day: 1,  label: "Kathmandu",    sub: "Arrival",       img: U("photo-1592285896110-8d88b5b3a5d8"), accent: "#F97316" },
  { day: 2,  label: "KTM Temples",  sub: "Heritage Walk", img: U("photo-1513614835783-51537729c8ba"), accent: "#A855F7" },
  { day: 3,  label: "Bhaktapur",    sub: "Durbar Square", img: U("photo-1679578064614-ba0ad375c143"), accent: "#6366F1" },
  { day: 4,  label: "Pokhara",      sub: "Lakeside",      img: U("photo-1546954552-eb2ada4a3654"), accent: "#0EA5E9" },
  { day: 5,  label: "Sarangkot",    sub: "Sunrise Hike",  img: U("photo-1586500036706-41963de24d8b"), accent: "#F59E0B" },
  { day: 6,  label: "Annapurna",    sub: "Foothills",     img: U("photo-1551410224-699683e15636"), accent: "#22C55E" },
  { day: 7,  label: "Manang",       sub: "High Altitude", img: U("photo-1519681393784-d120267933ba"), accent: "#14B8A6" },
  { day: 8,  label: "Chitwan",      sub: "Safari",        img: U("photo-1544442069-97dded965a9f"), accent: "#84CC16" },
  { day: 9,  label: "Lumbini",      sub: "Sacred Garden", img: U("photo-1609168494389-230528e6a9c3"), accent: "#EC4899" },
  { day: 10, label: "Kathmandu",    sub: "Departure",     img: U("photo-1562462181-b228e3cff9ad"), accent: "#EF4444" },
];

// ── Trail connector ────────────────────────────────────────────────────

function TrailLine({ accent, index }: { accent: string; index: number }) {
  const ref = useInView(useRef(null), { once: true, margin: "-40px" });
  return (
    <div
      className="relative flex-1 flex items-center"
      style={{ minWidth: 32, maxWidth: 64, height: 2, alignSelf: "flex-start", marginTop: 36 }}
    >
      {/* Track */}
      <div className="absolute inset-0 rounded-full"
        style={{ background: "rgba(255,255,255,0.08)" }} />
      {/* Glowing fill */}
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: index * 0.07 + 0.3, ease: "easeOut" }}
        style={{
          width: "100%",
          background: `linear-gradient(to right, ${accent}cc, ${accent}44)`,
          boxShadow: `0 0 8px ${accent}88`,
        }}
      />
      {/* Dot pulses along the trail */}
      {[0.2, 0.5, 0.8].map((pos) => (
        <motion.div
          key={pos}
          className="absolute rounded-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: [0, 1, 0] }}
          viewport={{ once: false }}
          transition={{ duration: 2, delay: index * 0.07 + pos * 0.6, repeat: Infinity, repeatDelay: 1.5 }}
          style={{
            width: 4, height: 4,
            left: `${pos * 100}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: accent,
            boxShadow: `0 0 6px ${accent}`,
          }}
        />
      ))}
    </div>
  );
}

// ── Day node ───────────────────────────────────────────────────────────

function DayNode({ day, index }: { day: typeof DAYS[0]; index: number }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-2 flex-shrink-0"
      style={{ width: 72 }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 300, damping: 26, delay: index * 0.07 }}
    >
      {/* Circular image with glow ring */}
      <div className="relative">
        {/* Outer glow */}
        <div
          className="absolute rounded-full"
          style={{
            inset: -3,
            background: `conic-gradient(${day.accent}cc, ${day.accent}22, ${day.accent}cc)`,
            filter: "blur(2px)",
          }}
        />
        {/* Gap ring */}
        <div
          className="relative rounded-full p-[2px] flex-shrink-0"
          style={{ background: "#080c1a", width: 60, height: 60, zIndex: 1 }}
        >
          <div className="w-full h-full rounded-full overflow-hidden relative">
            <Image
              src={day.img}
              alt={day.label}
              fill
              className="object-cover"
              sizes="60px"
            />
          </div>
        </div>

        {/* Day badge */}
        <div
          className="absolute -top-1 -right-1 z-10 rounded-full flex items-center justify-center"
          style={{
            width: 20, height: 20,
            background: day.accent,
            boxShadow: `0 0 10px ${day.accent}99`,
            fontSize: 9,
            fontWeight: 800,
            color: "#fff",
          }}
        >
          {day.day}
        </div>
      </div>

      {/* Labels */}
      <div className="flex flex-col items-center gap-0.5">
        <span
          className="text-[10.5px] font-bold text-center leading-tight"
          style={{ color: "rgba(255,255,255,0.88)" }}
        >
          {day.label}
        </span>
        <span
          className="text-[9px] font-medium text-center leading-tight"
          style={{ color: "rgba(255,255,255,0.38)" }}
        >
          {day.sub}
        </span>
      </div>
    </motion.div>
  );
}

// ── Main section ───────────────────────────────────────────────────────

export default function ItineraryTimeline() {
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
              AI-Crafted Journey
            </p>
            <h2 className="text-[18px] font-extrabold text-white tracking-tight">
              10-Day Nepal Itinerary
            </h2>
          </div>
          <motion.button
            whileHover={{ x: 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="text-[12px] font-bold cursor-pointer flex items-center gap-1 transition-opacity hover:opacity-70"
            style={{ color: "#DC2626" }}
            onClick={() => document.dispatchEvent(new CustomEvent("open-ai-planner"))}
          >
            Customize
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </motion.button>
        </div>

        {/* Scrollable timeline */}
        <div className="overflow-x-auto scrollbar-hide pb-2">
          <div className="flex items-start" style={{ minWidth: "max-content", gap: 0 }}>
            {DAYS.map((day, i) => (
              <div key={day.day} className="flex items-start">
                <DayNode day={day} index={i} />
                {i < DAYS.length - 1 && (
                  <TrailLine accent={day.accent} index={i} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA strip */}
        <motion.div
          className="mt-5 rounded-[20px] flex items-center justify-between px-5 py-4"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          style={{
            background: "rgba(220,38,38,0.10)",
            border: "1px solid rgba(220,38,38,0.22)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          <div>
            <p className="text-white font-bold text-[13px] leading-tight">
              Make it yours
            </p>
            <p className="text-white/45 text-[11px] mt-0.5">
              AI adapts dates, budget &amp; travel style
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 440, damping: 22 }}
            className="cursor-pointer rounded-full px-4 py-2 text-[12px] font-bold text-white"
            style={{
              background: "rgba(220,38,38,0.75)",
              boxShadow: "0 0 20px rgba(220,38,38,0.40), inset 0 1px 0 rgba(255,255,255,0.18)",
            }}
            onClick={() => document.dispatchEvent(new CustomEvent("open-ai-planner"))}
          >
            ✨ Plan with AI
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
}
