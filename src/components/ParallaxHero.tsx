"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type Transition } from "motion/react";
import { Sparkles, Headphones, Star, Play } from "lucide-react";

const BTN_TRANSITION: Transition = { type: "tween", duration: 0.18, ease: "easeInOut" };

const PHOTO = "/images/nepal-landscape.jpg";

const AVATAR_SEEDS = [
  { bg: "#8B6F5E", initials: "R" },
  { bg: "#5E7B8B", initials: "M" },
  { bg: "#6B8B5E", initials: "S" },
];

// ─── Title font-size shared between the z=5 NEPAL layer and the z=30 spacer ─
// 30–40 % of viewport width. At 1280 px: 10 vw = 128 px ≈ 8 rem.
// With Playfair metrics, 5 chars at 8 rem ≈ 410 px ≈ 32 % of 1280 px. ✓
const NEPAL_SIZE = "clamp(3rem, 10vw, 9rem)";

export default function ParallaxHero() {
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const skyY     = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const midY     = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const foreY    = useTransform(scrollYProgress, [0, 1], ["0%", "46%"]);
  // NEPAL (z=5) and content (z=30) share the same transform — no drift
  const contentY       = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.38, 0.52], [1, 1, 0]);

  return (
    <div
      ref={heroRef}
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", isolation: "isolate" }}
    >

      {/* ══ Layer 0 — Sky / Peak  z=0 ════════════════════════════════════════ */}
      <motion.div
        style={{ y: skyY, willChange: "transform" }}
        className="absolute inset-0"
        aria-hidden
      >
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${PHOTO}')`,
            backgroundSize: "cover",
            backgroundPosition: "center 6%",
            willChange: "transform",
          }}
          animate={{ scale: [1, 1.055, 1] }}
          transition={{ duration: 36, ease: "easeInOut", repeat: Infinity }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(4,8,18,0.68) 0%, rgba(4,8,18,0.30) 20%, rgba(4,8,18,0.04) 44%, rgba(4,8,18,0.18) 65%, rgba(4,8,18,0.65) 100%)",
          }}
        />
      </motion.div>

      {/* ══ Layer 1 — Monastery / Village  z=10 ═════════════════════════════ */}
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
            filter: "saturate(0.82) brightness(0.74)",
          }}
        />
      </motion.div>

      {/* ══ Layer 2 — Lake / Prayer Flags  z=18 ═════════════════════════════ */}
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

      {/* ══ Mist bands ═══════════════════════════════════════════════════════ */}
      <div aria-hidden className="absolute pointer-events-none" style={{ zIndex: 9,  top: "27%",    left: 0, right: 0, height: "5%", background: "linear-gradient(to bottom, transparent, rgba(180,208,230,0.20) 50%, transparent)", filter: "blur(10px)", mixBlendMode: "screen" }} />
      <div aria-hidden className="absolute pointer-events-none" style={{ zIndex: 14, bottom: "25%", left: 0, right: 0, height: "8%", background: "linear-gradient(to bottom, transparent, rgba(195,215,235,0.50) 50%, transparent)", filter: "blur(20px)", mixBlendMode: "screen" }} />
      <div aria-hidden className="absolute pointer-events-none" style={{ zIndex: 19, top: "52%",    left: 0, right: 0, height: "6%", background: "linear-gradient(to bottom, transparent, rgba(185,210,232,0.34) 50%, transparent)", filter: "blur(14px)", mixBlendMode: "screen" }} />

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* ══ z=5 — "NEPAL" label + title — BEHIND mid mountain layer ════════ */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <motion.div
        style={{
          y: contentY, opacity: contentOpacity,
          position: "absolute", inset: 0, zIndex: 5,
          pointerEvents: "none", userSelect: "none", willChange: "transform, opacity",
        }}
      >
        <div
          style={{
            position: "absolute", top: "10vh", left: 0, right: 0,
            display: "flex", flexDirection: "column", alignItems: "center",
            padding: "0 max(1.5rem, 4vw)",
          }}
        >
          {/* Small brand label */}
          <p
            style={{
              fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.16em",
              textTransform: "uppercase", color: "rgba(240,240,240,0.78)",
              margin: "0 0 0.6rem", textShadow: "0 1px 8px rgba(0,0,0,0.6)",
            }}
          >
            NP HIMALAYAN KINGDOM
          </p>

          {/* Ornamental rule */}
          <div
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              marginBottom: "0.55rem",
            }}
          >
            <div style={{ height: "1px", width: "36px", background: "linear-gradient(to right, transparent, rgba(210,175,90,0.60))" }} />
            <span style={{ color: "rgba(210,175,90,0.75)", fontSize: "0.65rem", lineHeight: 1 }}>✦</span>
            <div style={{ height: "1px", width: "36px", background: "linear-gradient(to left, transparent, rgba(210,175,90,0.60))" }} />
          </div>

          {/* ── NEPAL wrapper — inline-block so mountain % positions hit exact letters ── */}
          <div style={{ position: "relative", display: "inline-block" }}>

            {/* Mountain silhouette above "A" (4th letter ≈ 71 % from left) */}
            <svg
              aria-hidden
              viewBox="0 0 120 80"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: "absolute", bottom: "93%", left: "71%",
                transform: "translateX(-50%)",
                width: "clamp(1.8rem, 3vw, 4rem)", height: "auto", overflow: "visible",
              }}
            >
              <polygon points="18,72 42,28 66,72" fill="white" opacity="0.36" />
              <polygon points="60,0 108,80 12,80" fill="white" opacity="0.88" />
              <polygon points="60,0 70,30 50,30" fill="rgba(240,248,255,0.26)" />
            </svg>

            {/* Smaller mountain above "L" (5th letter ≈ 90 % from left) */}
            <svg
              aria-hidden
              viewBox="0 0 80 56"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: "absolute", bottom: "93%", left: "90%",
                transform: "translateX(-50%)",
                width: "clamp(1.2rem, 2vw, 2.8rem)", height: "auto", overflow: "visible",
              }}
            >
              <polygon points="40,0 80,56 0,56" fill="white" opacity="0.80" />
              <polygon points="40,0 48,24 32,24" fill="rgba(240,248,255,0.20)" />
            </svg>

            <h1
              style={{
                fontFamily: "var(--font-playfair), Georgia, 'Times New Roman', serif",
                fontSize: NEPAL_SIZE,
                fontWeight: 500,
                lineHeight: 1,
                letterSpacing: "-0.025em",
                color: "rgba(232,232,232,0.93)",
                textShadow: "0 4px 48px rgba(0,0,0,0.52)",
                margin: 0,
                userSelect: "none",
                display: "block",
              }}
            >
              NEPAL
            </h1>
          </div>
        </div>
      </motion.div>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* ══ z=30 — Subtitle · Description · CTA buttons ════════════════════ */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <motion.div
        style={{
          y: contentY, opacity: contentOpacity,
          zIndex: 30, willChange: "transform, opacity",
        }}
        className="absolute inset-0 pointer-events-none select-none"
      >
        <div
          style={{
            position: "absolute", top: "10vh", left: 0, right: 0,
            display: "flex", flexDirection: "column", alignItems: "center",
            textAlign: "center", padding: "0 max(1.5rem, 4vw)",
          }}
        >
          {/* Invisible spacer: label (~1rem) + ornamental (~1.2rem) + NEPAL height */}
          <div
            aria-hidden
            style={{ height: `calc(2.2rem + ${NEPAL_SIZE})` }}
          />

          {/* Subtitle */}
          <h2
            style={{
              fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
              fontSize: "clamp(1.15rem, 2.6vw, 2.1rem)",
              fontWeight: 700,
              color: "#F5F5F5",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              textShadow: "0 2px 22px rgba(0,0,0,0.72)",
              marginTop: "0.6rem",
              marginBottom: 0,
              maxWidth: "min(640px, 92vw)",
            }}
          >
            Discover the Roof of the World
          </h2>

          {/* Description */}
          <p
            style={{
              fontSize: "clamp(0.82rem, 1.4vw, 1rem)",
              color: "rgba(225,225,225,0.72)",
              lineHeight: 1.65,
              textShadow: "0 1px 10px rgba(0,0,0,0.55)",
              marginTop: "0.9rem",
              marginBottom: "1.8rem",
              maxWidth: "min(460px, 86vw)",
            }}
          >
            AI-crafted journeys, local experiences, and spiritual adventures.
          </p>

          {/* CTA buttons */}
          <div
            className="pointer-events-auto"
            style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}
          >
            {/* Plan My Journey — crimson */}
            <motion.button
              onClick={() => document.dispatchEvent(new CustomEvent("open-ai-planner"))}
              whileHover={{ scale: 1.04, boxShadow: "0 0 36px rgba(220,20,60,0.62)" }}
              whileTap={{ scale: 0.96 }}
              transition={BTN_TRANSITION}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                background: "linear-gradient(135deg, #FF2D5C 0%, #DC143C 55%, #B00A2A 100%)",
                border: "none", color: "#fff",
                padding: "12px 24px", borderRadius: "9999px",
                fontWeight: 700, fontSize: "0.88rem", cursor: "pointer",
                letterSpacing: "0.01em",
                boxShadow: "0 4px 26px rgba(220,20,60,0.52)",
                willChange: "transform",
              }}
            >
              <Sparkles size={14} strokeWidth={2} />
              Plan My Journey
            </motion.button>

            {/* Talk to Concierge — frosted glass */}
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
                padding: "12px 24px", borderRadius: "9999px",
                fontWeight: 600, fontSize: "0.88rem", cursor: "pointer",
                willChange: "transform",
              }}
            >
              <Headphones size={14} strokeWidth={2} />
              Talk to Concierge
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* ══ Trust bar — bottom-left  z=35 ══════════════════════════════════ */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <motion.div
        style={{
          position: "absolute", bottom: "6.5rem", left: "max(1.5rem, 5vw)",
          zIndex: 35, pointerEvents: "none", userSelect: "none",
        }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.45 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          {/* Avatars */}
          <div style={{ display: "flex" }}>
            {AVATAR_SEEDS.map((a, i) => (
              <div
                key={i}
                style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: a.bg, border: "2px solid rgba(255,255,255,0.32)",
                  marginLeft: i > 0 ? -7 : 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.58rem", fontWeight: 700, color: "#fff",
                }}
              >
                {a.initials}
              </div>
            ))}
          </div>
          <div>
            <div style={{ display: "flex", gap: "2px", marginBottom: "2px" }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={9} fill="#FBBF24" stroke="none" />
              ))}
            </div>
            <p style={{ fontSize: "0.67rem", color: "rgba(255,255,255,0.52)", fontWeight: 500, lineHeight: 1 }}>
              4.9 · 5K reviews
            </p>
          </div>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.20)", flexShrink: 0 }} />
          <p style={{ fontSize: "0.56rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.36)", fontWeight: 700 }}>
            Trusted by Travelers
          </p>
        </div>
      </motion.div>


      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* ══ Watch Nepal — bottom-right  z=40 ═══════════════════════════════ */}
      {/* ════════════════════════════════════════════════════════════════════ */}
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


      {/* ══ Scroll cue  z=50 ═════════════════════════════════════════════════ */}
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
