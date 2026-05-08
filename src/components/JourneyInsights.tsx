"use client";

import { useState } from "react";
import { motion } from "motion/react";

// ── Data ─────────────────────────────────────────────────────────────

const BARS = [
  {
    label: "Destinations",
    value: 19,
    total: 50,
    pct: 38,
    color: "#DC2626",
    glow: "rgba(220,38,38,0.70)",
    track: "rgba(220,38,38,0.10)",
  },
  {
    label: "Categories Explored",
    value: 6,
    total: 12,
    pct: 50,
    color: "#2563EB",
    glow: "rgba(37,99,235,0.70)",
    track: "rgba(37,99,235,0.10)",
  },
  {
    label: "In Season Destinations",
    value: 11,
    total: 30,
    pct: 37,
    color: "#10B981",
    glow: "rgba(16,185,129,0.70)",
    track: "rgba(16,185,129,0.10)",
  },
];

const SEASONS = ["This Season", "Last 5 Seasons", "All Time"];

const RADIAL_PCT   = 58;
const RADIUS       = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ≈ 226.2

// ── Component ─────────────────────────────────────────────────────────

export default function JourneyInsights({ isDark }: { isDark: boolean }) {
  const [season, setSeason] = useState("This Season");

  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 w-full">

      {/* ── Left: header + progress bars ── */}
      <div className="flex-1 min-w-0">

        {/* Title row */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.20em] mb-1"
              style={{ color: isDark ? "rgba(255,255,255,0.32)" : "rgba(0,0,0,0.38)" }}>
              Live Stats
            </p>
            <h2 className="text-base font-extrabold tracking-tight"
              style={{ color: isDark ? "#fff" : "#111827", letterSpacing: "-0.02em" }}>
              Journey Insights
            </h2>
          </div>

          {/* Season selector */}
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="text-[11px] font-semibold cursor-pointer outline-none"
            style={{
              background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.13)" : "rgba(0,0,0,0.10)"}`,
              borderRadius: 9999,
              padding: "5px 12px",
              color: isDark ? "rgba(255,255,255,0.70)" : "rgba(0,0,0,0.60)",
              backdropFilter: "blur(8px)",
              WebkitAppearance: "none",
            }}
          >
            {SEASONS.map((s) => (
              <option key={s} value={s}
                style={{ background: isDark ? "#0f172a" : "#fff", color: isDark ? "#fff" : "#111" }}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Progress bars */}
        <div className="space-y-4">
          {BARS.map((bar, i) => (
            <div key={bar.label}>
              {/* Label row */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-semibold"
                  style={{ color: isDark ? "rgba(255,255,255,0.62)" : "rgba(0,0,0,0.58)" }}>
                  {bar.label}
                </span>
                <motion.span
                  className="text-[12px] font-bold tabular-nums"
                  style={{ color: bar.color }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.12 }}
                >
                  {bar.value}
                  <span style={{ color: isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.30)", fontWeight: 500 }}>
                    /{bar.total}
                  </span>
                </motion.span>
              </div>

              {/* Track + fill (no overflow:hidden — lets glow bloom) */}
              <div
                className="relative"
                style={{
                  height: 8,
                  borderRadius: 9999,
                  background: bar.track,
                }}
              >
                {/* Neon glow bloom (blurred copy behind fill) */}
                <motion.div
                  className="absolute inset-y-0 left-0"
                  style={{
                    borderRadius: 9999,
                    background: bar.color,
                    filter: "blur(6px)",
                    opacity: 0.55,
                    transformOrigin: "left",
                    willChange: "transform",
                  }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: bar.pct / 100 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 52, damping: 14, delay: 0.18 + i * 0.10 }}
                />
                {/* Actual bar */}
                <motion.div
                  className="absolute inset-y-0 left-0"
                  style={{
                    borderRadius: 9999,
                    background: `linear-gradient(to right, ${bar.color}cc, ${bar.color})`,
                    transformOrigin: "left",
                    willChange: "transform",
                  }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: bar.pct / 100 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 52, damping: 14, delay: 0.18 + i * 0.10 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: radial chart ── */}
      <div className="flex flex-col items-center justify-center flex-shrink-0 self-center sm:self-auto">
        <div className="relative">
          <svg
            viewBox="0 0 88 88"
            width={110}
            height={110}
            style={{ overflow: "visible" }}
          >
            {/* Outer glow ring (blurred duplicate) */}
            <motion.circle
              cx="44" cy="44" r={RADIUS}
              fill="none"
              stroke="rgba(220,38,38,0.30)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              whileInView={{ strokeDashoffset: CIRCUMFERENCE * (1 - RADIAL_PCT / 100) }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
              transform="rotate(-90 44 44)"
              style={{ filter: "blur(5px)", willChange: "stroke-dashoffset" }}
            />

            {/* Track */}
            <circle
              cx="44" cy="44" r={RADIUS}
              fill="none"
              stroke={isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}
              strokeWidth="7"
            />

            {/* Gradient defs */}
            <defs>
              <linearGradient id="jiRadialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#DC2626" />
                <stop offset="50%"  stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
            </defs>

            {/* Progress arc */}
            <motion.circle
              cx="44" cy="44" r={RADIUS}
              fill="none"
              stroke="url(#jiRadialGrad)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              whileInView={{ strokeDashoffset: CIRCUMFERENCE * (1 - RADIAL_PCT / 100) }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
              transform="rotate(-90 44 44)"
              style={{ willChange: "stroke-dashoffset" }}
            />

            {/* Centre text */}
            <text
              x="44" y="40"
              textAnchor="middle"
              fill={isDark ? "#ffffff" : "#111827"}
              fontSize="16"
              fontWeight="800"
              fontFamily="system-ui, sans-serif"
            >
              {RADIAL_PCT}%
            </text>
            <text
              x="44" y="54"
              textAnchor="middle"
              fill={isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.40)"}
              fontSize="7"
              fontWeight="500"
              fontFamily="system-ui, sans-serif"
            >
              peak season
            </text>
          </svg>
        </div>

        <p className="text-[10px] font-medium text-center mt-1 max-w-[90px] leading-tight"
          style={{ color: isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.42)" }}>
          destinations in peak season
        </p>
      </div>
    </div>
  );
}
