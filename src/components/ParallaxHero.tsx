"use client";

import { motion, type Transition } from "motion/react";
import { Sparkles, ChevronRight } from "lucide-react";

// ── Button micro-interaction only — no scroll/parallax/floating animations ──
const BTN_TRANSITION: Transition = { type: "tween", duration: 0.18, ease: "easeInOut" };

const PHOTO = "/images/nepal-landscape.jpg";

const TITLE_SIZE = "clamp(2.6rem, 8vw, 6rem)";

const STATS = [
  { value: "8",    label: "UNESCO Sites"          },
  { value: "14",   label: "Peaks Above 8000m"     },
  { value: "100+", label: "Cultural Experiences"  },
];

export default function ParallaxHero() {
  return (
    <div
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{ height: "100svh" }}
    >

      {/* ── Single HD background layer ─────────────────────────────────────── */}
      {/* background-attachment:fixed = CSS-only stable scroll anchor (no JS). */}
      {/* Falls back gracefully on iOS where fixed-attachment is unsupported.  */}
      <div
        aria-hidden
        className="absolute inset-0 optimize-contrast"
        style={{
          backgroundImage:      `url('${PHOTO}')`,
          backgroundSize:       "cover",
          backgroundPosition:   "center",
          backgroundAttachment: "fixed",
        }}
      />

      {/* ── Dark linear gradient overlay (single layer, no JS) ───────────────── */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.08) 48%, rgba(0,0,0,0.48) 100%)",
        }}
      />

      {/* ── Content — single z-index, centred ─────────────────────────────── */}
      <div
        className="relative flex flex-col items-center text-center px-6"
        style={{ zIndex: 10, maxWidth: 720, width: "100%" }}
      >
        {/* Flag label */}
        <p
          style={{
            fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.16em",
            textTransform: "uppercase", color: "rgba(240,240,240,0.78)",
            margin: "0 0 0.55rem", textShadow: "0 1px 8px rgba(0,0,0,0.6)",
          }}
        >
          🇳🇵 Himalayan Kingdom
        </p>

        {/* Headline line 1 */}
        <h1
          style={{
            fontFamily:    "var(--font-playfair), Georgia, serif",
            fontSize:      TITLE_SIZE,
            lineHeight:    1.08,
            fontWeight:    500,
            letterSpacing: "-0.025em",
            color:         "rgba(232,232,232,0.95)",
            textShadow:    "0 4px 48px rgba(0,0,0,0.52)",
            margin:        "0 0 0.05em",
          }}
        >
          Explore Nepal
        </h1>

        {/* Headline line 2 — amber → crimson → violet gradient */}
        <h1
          style={{
            fontFamily:    "var(--font-playfair), Georgia, serif",
            fontSize:      TITLE_SIZE,
            lineHeight:    1.08,
            fontWeight:    500,
            letterSpacing: "-0.025em",
            background:    "linear-gradient(135deg, #f59e0b 0%, #dc2626 50%, #c026d3 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor:  "transparent",
            backgroundClip:       "text",
            filter:        "drop-shadow(0 2px 8px rgba(220,100,40,0.4))",
            margin:        "0 0 1rem",
          }}
        >
          Beyond the Tourist Map
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize:     "clamp(0.82rem, 1.4vw, 1rem)",
            color:        "rgba(225,225,225,0.72)",
            lineHeight:   1.65,
            textShadow:   "0 1px 10px rgba(0,0,0,0.55)",
            marginBottom: "1.8rem",
            maxWidth:     "min(480px, 86vw)",
          }}
        >
          AI-powered journeys through mountains, culture, festivals, and hidden Himalayan experiences.
        </p>

        {/* CTA buttons */}
        <div
          style={{
            display: "flex", flexWrap: "wrap", gap: "12px",
            justifyContent: "center", marginBottom: "1.8rem",
          }}
        >
          <motion.button
            onClick={() => document.dispatchEvent(new CustomEvent("open-ai-planner"))}
            whileHover={{ scale: 1.04, boxShadow: "0 0 36px rgba(220,20,60,0.62)" }}
            whileTap={{ scale: 0.96 }}
            transition={BTN_TRANSITION}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "linear-gradient(135deg, #FF2D5C 0%, #DC143C 55%, #B00A2A 100%)",
              border: "none", color: "#fff",
              padding: "11px 22px", borderRadius: "9999px",
              fontWeight: 700, fontSize: "1rem", cursor: "pointer",
              letterSpacing: "0.01em",
              boxShadow: "0 4px 26px rgba(220,20,60,0.52)",
            }}
          >
            <Sparkles size={15} strokeWidth={2} />
            Build AI Trip
          </motion.button>

          <motion.button
            onClick={() => document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" })}
            whileHover={{ scale: 1.04, background: "rgba(255,255,255,0.16)" }}
            whileTap={{ scale: 0.96 }}
            transition={BTN_TRANSITION}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "rgba(255,255,255,0.10)",
              backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.20)",
              color: "rgba(255,255,255,0.90)",
              padding: "11px 22px", borderRadius: "9999px",
              fontWeight: 600, fontSize: "1rem", cursor: "pointer",
            }}
          >
            Start Exploring
            <ChevronRight size={15} strokeWidth={2} />
          </motion.button>
        </div>

        {/* Stat chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
          {STATS.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "rgba(6,8,20,0.55)",
                backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "9999px", padding: "6px 14px",
                display: "flex", alignItems: "center", gap: "6px",
              }}
            >
              <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "#f59e0b" }}>
                {stat.value}
              </span>
              <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.60)", whiteSpace: "nowrap" }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Scroll cue ────────────────────────────────────────────────────── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ zIndex: 20 }}
        animate={{ y: [0, 5, 0], opacity: [0.50, 0.82, 0.50] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
          style={{ border: "1.5px solid rgba(255,255,255,0.35)" }}
        >
          <motion.div
            className="w-[3px] h-1.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.65)" }}
            animate={{ opacity: [0.9, 0.25, 0.9] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

    </div>
  );
}
