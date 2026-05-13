"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type Transition } from "motion/react";
import { Sparkles, ChevronRight, Play } from "lucide-react";
import AtmosphericFog from "@/components/AtmosphericFog";
import { useReducedMotion } from "@/hooks/useScrollAnimation";

const BTN_TRANSITION: Transition = { type: "tween", duration: 0.18, ease: "easeInOut" };

const PHOTO = "/images/nepal-landscape.jpg";

const ALPENGLOW = `linear-gradient(
  to bottom,
  #2d1b4e 0%,
  #6b2d6b 10%,
  #c4527a 22%,
  #e8825a 35%,
  #f2b07a 50%,
  #f5d5a8 65%,
  #e8e4d8 80%,
  #c8dce8 92%,
  #b8ccd8 100%
)`;

// Shared font-size between z=5 "Beyond" layer and z=30 invisible spacer
const TITLE_SIZE = "clamp(2.6rem, 8vw, 6rem)";

const STATS = [
  { value: "8",    label: "UNESCO Sites"           },
  { value: "14",   label: "Peaks Above 8000m"      },
  { value: "100+", label: "Cultural Experiences"   },
];

export default function ParallaxHero() {
  const heroRef = useRef<HTMLDivElement>(null);

  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Sky: nearly stationary — alpenglow stays painted behind everything
  const skyY    = useTransform(scrollYProgress, [0, 1], ["0%", "90%"]);
  // Mid mountains: rises fast → opaque edge sweeps UP and covers "Beyond" text at p≈0.16
  const midY    = useTransform(scrollYProgress, [0, 1], ["0%", "5%"]);
  // Foreground lake layer
  const foreY   = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  // Title layers: identical transform → zero drift between z=5 and z=30
  const titleY  = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.35, 0.5], [1, 1, 0]);

  return (
    <div
      ref={heroRef}
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", isolation: "isolate" }}
    >

      {/* ══ z=0 — Alpenglow sky ═══════════════════════════════════════════════ */}
      <motion.div
        style={{ y: skyY, willChange: "transform" }}
        className="absolute inset-0"
        aria-hidden
      >
        <div className="absolute inset-0" style={{ background: ALPENGLOW }} />
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${PHOTO}')`,
            backgroundSize: "cover",
            backgroundPosition: "center 6%",
            mixBlendMode: "luminosity",
            opacity: 0.55,
            willChange: "transform",
          }}
          animate={{ scale: [1, 1.055, 1] }}
          transition={{ duration: 36, ease: "easeInOut", repeat: Infinity }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(4,8,18,0.55) 0%, transparent 30%, transparent 60%, rgba(4,8,18,0.50) 100%)",
          }}
        />

        {/* ── Ambient light orbs — warm alpenglow pools ── */}
        {!reduced && (
          <>
            {/* Primary warm orb — sunrise-pink, top-left quadrant */}
            <motion.div
              aria-hidden
              style={{
                position: "absolute",
                top: "8%", left: "18%",
                width: "38vw", height: "38vw",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(200,90,80,0.28) 0%, transparent 70%)",
                filter: "blur(60px)",
                mixBlendMode: "screen",
                willChange: "transform, opacity",
              }}
              animate={{
                x:       [0, 18, -8, 12, 0],
                y:       [0, -14, 8, -6, 0],
                opacity: [0.75, 1, 0.6, 0.9, 0.75],
              }}
              transition={{ duration: 28, ease: "easeInOut", repeat: Infinity }}
            />
            {/* Secondary orb — violet zenith, right side */}
            <motion.div
              aria-hidden
              style={{
                position: "absolute",
                top: "2%", right: "12%",
                width: "28vw", height: "28vw",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(120,60,160,0.22) 0%, transparent 70%)",
                filter: "blur(50px)",
                mixBlendMode: "screen",
                willChange: "transform, opacity",
              }}
              animate={{
                x:       [0, -20, 10, -6, 0],
                y:       [0, 10, -12, 4, 0],
                opacity: [0.55, 0.85, 0.45, 0.70, 0.55],
              }}
              transition={{ duration: 36, ease: "easeInOut", repeat: Infinity, delay: 4 }}
            />
          </>
        )}
      </motion.div>

      {/* ══ z=8 — Atmospheric fog (sits between sky and mountains) ══════════ */}
      <AtmosphericFog
        style={{ zIndex: 8 }}
        maxLayers={3}
        opacityScale={0.75}
      />

      {/* ══ z=10 — Mid mountain photo (rises fast, covers "Beyond" at p≈0.16) ═ */}
      <motion.div
        style={{
          y: midY,
          position: "absolute", top: "28%", bottom: 0, left: 0, right: 0,
          zIndex: 10, willChange: "transform",
        }}
        aria-hidden
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${PHOTO}')`,
            backgroundSize: "cover",
            backgroundPosition: "center 52%",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 100%)",
            filter: "saturate(0.88) brightness(0.80)",
          }}
        />
      </motion.div>

      {/* ══ z=18 — Lake / Prayer Flags ════════════════════════════════════════ */}
      <motion.div
        style={{
          y: foreY,
          position: "absolute", top: "55%", bottom: 0, left: 0, right: 0,
          zIndex: 18, willChange: "transform",
        }}
        aria-hidden
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${PHOTO}')`,
            backgroundSize: "cover",
            backgroundPosition: "center 89%",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 22%, black 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 22%, black 100%)",
            filter: "saturate(0.88) brightness(0.65)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, transparent 55%, rgba(4,8,18,0.55) 100%)" }}
        />
      </motion.div>

      {/* ══ Mist bands ════════════════════════════════════════════════════════ */}
      <div aria-hidden className="absolute pointer-events-none" style={{ zIndex: 15, bottom: "20%", left: 0, right: 0, height: "8%", background: "linear-gradient(to bottom, transparent, rgba(220,215,205,0.65) 50%, transparent)", filter: "blur(20px)", mixBlendMode: "screen" }} />
      <div aria-hidden className="absolute pointer-events-none" style={{ zIndex: 20, top: "48%",    left: 0, right: 0, height: "7%", background: "linear-gradient(to bottom, transparent, rgba(210,225,238,0.45) 50%, transparent)", filter: "blur(14px)", mixBlendMode: "screen" }} />
      <div aria-hidden className="absolute pointer-events-none" style={{ zIndex: 25, top: "28%",    left: 0, right: 0, height: "5%", background: "linear-gradient(to bottom, transparent, rgba(200,220,240,0.28) 50%, transparent)", filter: "blur(10px)", mixBlendMode: "screen" }} />

      {/* ══ z=26 — Colour-grade vignette ══════════════════════════════════════ */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 26,
          background: "linear-gradient(to bottom, rgba(45,27,78,0.12) 0%, transparent 40%, transparent 70%, rgba(4,8,18,0.40) 100%)",
        }}
      />

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ══ z=5 — "Beyond the Tourist Map" — BEHIND mid mountain layer ══════ */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <motion.div
        style={{
          y: titleY,
          position: "absolute", inset: 0, zIndex: 5,
          pointerEvents: "none", userSelect: "none", willChange: "transform",
        }}
      >
        <div style={{ paddingTop: "22vh", paddingLeft: "max(1.5rem, 8vw)", paddingRight: "max(1.5rem, 8vw)" }}>
          {/* Spacer — matches flag label + margin in z=30 */}
          <div aria-hidden style={{ height: "calc(0.75rem * 2.5)", visibility: "hidden" }} />
          {/* Spacer — matches "Explore Nepal" h1 line in z=30 */}
          <div aria-hidden style={{ height: `calc(${TITLE_SIZE} * 1.1)`, visibility: "hidden" }} />
          {/* VISIBLE — mountains sweep over this at p≈0.16 */}
          <h1
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: TITLE_SIZE,
              lineHeight: 1.1,
              fontWeight: 500,
              letterSpacing: "-0.025em",
              background: "linear-gradient(135deg, #f59e0b 0%, #dc2626 50%, #c026d3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 2px 8px rgba(220,100,40,0.4))",
              margin: 0,
            }}
          >
            Beyond the Tourist Map
          </h1>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ══ z=30 — "Explore Nepal" + subtitle + stats + CTAs ════════════════ */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <motion.div
        style={{
          y: titleY,
          opacity: titleOpacity,
          zIndex: 30,
          willChange: "transform, opacity",
        }}
        className="absolute inset-0 pointer-events-none select-none"
      >
        <div style={{ paddingTop: "22vh", paddingLeft: "max(1.5rem, 8vw)", paddingRight: "max(1.5rem, 8vw)" }}>

          {/* Flag label */}
          <p
            style={{
              fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.16em",
              textTransform: "uppercase", color: "rgba(240,240,240,0.78)",
              margin: "0 0 0.5rem", textShadow: "0 1px 8px rgba(0,0,0,0.6)",
            }}
          >
            🇳🇵 Himalayan Kingdom
          </p>

          {/* "Explore Nepal" — above the mountains */}
          <h1
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: TITLE_SIZE,
              lineHeight: 1.1,
              fontWeight: 500,
              letterSpacing: "-0.025em",
              color: "rgba(232,232,232,0.95)",
              textShadow: "0 4px 48px rgba(0,0,0,0.52)",
              margin: 0,
            }}
          >
            Explore Nepal
          </h1>

          {/* Invisible spacer — reserves the exact space "Beyond the Tourist Map" occupies in z=5 */}
          <div aria-hidden style={{ height: `calc(${TITLE_SIZE} * 1.1)`, visibility: "hidden" }} />

          {/* Subtitle */}
          <p
            style={{
              fontSize: "clamp(0.82rem, 1.4vw, 1rem)",
              color: "rgba(225,225,225,0.72)",
              lineHeight: 1.65,
              textShadow: "0 1px 10px rgba(0,0,0,0.55)",
              marginTop: "0.8rem",
              marginBottom: "1.6rem",
              maxWidth: "min(480px, 86vw)",
            }}
          >
            AI-powered journeys through mountains, culture, festivals, and hidden Himalayan experiences.
          </p>

          {/* CTAs */}
          <div
            className="pointer-events-auto"
            style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "1.6rem" }}
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
                fontWeight: 700, fontSize: "0.88rem", cursor: "pointer",
                letterSpacing: "0.01em",
                boxShadow: "0 4px 26px rgba(220,20,60,0.52)",
                willChange: "transform",
              }}
            >
              <Sparkles size={14} strokeWidth={2} />
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
                fontWeight: 600, fontSize: "0.88rem", cursor: "pointer",
                willChange: "transform",
              }}
            >
              Start Exploring
              <ChevronRight size={14} strokeWidth={2} />
            </motion.button>
          </div>

          {/* Floating stats */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {STATS.map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "rgba(6,8,20,0.55)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "9999px",
                  padding: "6px 14px",
                  display: "flex", alignItems: "center", gap: "6px",
                }}
              >
                <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "#f59e0b" }}>{stat.value}</span>
                <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.60)", whiteSpace: "nowrap" }}>{stat.label}</span>
              </div>
            ))}
          </div>

        </div>
      </motion.div>

      {/* ══ Watch Nepal — bottom-right  z=40 ══════════════════════════════════ */}
      <motion.div
        className="pointer-events-auto"
        style={{ position: "absolute", bottom: "6.5rem", right: "max(1.5rem, 5vw)", zIndex: 40 }}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.55, duration: 0.45 }}
      >
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          transition={BTN_TRANSITION}
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            background: "rgba(0,0,0,0.52)",
            backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "9999px", padding: "10px 14px 10px 10px",
            color: "rgba(255,255,255,0.90)", cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >
            <Play size={13} fill="white" stroke="none" style={{ marginLeft: "2px" }} />
          </div>
          <div className="text-left">
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>Watch Nepal</p>
            <p style={{ fontSize: "0.59rem", color: "rgba(255,255,255,0.44)", lineHeight: 1.2 }}>(60 Seconds)</p>
          </div>
        </motion.button>
      </motion.div>

      {/* ══ Scroll cue  z=50 ══════════════════════════════════════════════════ */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ zIndex: 50 }}
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
