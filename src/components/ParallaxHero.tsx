"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type Transition } from "motion/react";
import { Sparkles, Headphones, Star, Play } from "lucide-react";

const BTN_TRANSITION: Transition = { type: "tween", duration: 0.18, ease: "easeInOut" };

const PHOTO = "/images/nepal-landscape.jpg";

// Colored circle avatars — no external avatar service needed
const AVATAR_SEEDS = [
  { bg: "#8B6F5E", initials: "R" },
  { bg: "#5E7B8B", initials: "M" },
  { bg: "#6B8B5E", initials: "S" },
];

export default function ParallaxHero() {
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const skyY         = useTransform(scrollYProgress, [0, 1], ["0%", "90%"]);
  const midY         = useTransform(scrollYProgress, [0, 1], ["0%", "5%"]);
  const contentY     = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.40, 0.55], [1, 1, 0]);

  return (
    <div
      ref={heroRef}
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", isolation: "isolate" }}
    >

      {/* ── Sky layer ── z=0 ─────────────────────────────────────────────── */}
      <motion.div style={{ y: skyY, willChange: "transform" }} className="absolute inset-0" aria-hidden>
        {/* Ken Burns photo */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${PHOTO}')`,
            backgroundSize: "cover",
            backgroundPosition: "center 28%",
            willChange: "transform",
          }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 32, ease: "easeInOut", repeat: Infinity }}
        />
        {/* Graduated dark overlay: strong top for text, fades mid, dark at bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(8,13,26,0.78) 0%, rgba(8,13,26,0.55) 22%, rgba(8,13,26,0.22) 48%, rgba(8,13,26,0.38) 75%, rgba(8,13,26,0.72) 100%)",
          }}
        />
        {/* Subtle left-to-right darkening for left-aligned text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(8,13,26,0.32) 0%, transparent 55%)",
          }}
        />
      </motion.div>

      {/* ── Mid mountain layer ── z=10 ───────────────────────────────────── */}
      <motion.div
        style={{
          y: midY,
          position: "absolute",
          top: "25%",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          willChange: "transform",
        }}
        aria-hidden
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${PHOTO}')`,
            backgroundSize: "cover",
            backgroundPosition: "center 74%",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 22%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 22%, black 100%)",
            filter: "saturate(0.78) brightness(0.72)",
          }}
        />
      </motion.div>

      {/* ── Mist bands ── z=15/20/25 ─────────────────────────────────────── */}
      <div aria-hidden className="absolute pointer-events-none" style={{ zIndex: 15, bottom: "18%", left: 0, right: 0, height: "9%", background: "linear-gradient(to bottom, transparent, rgba(195,215,235,0.58) 50%, transparent)", filter: "blur(22px)", mixBlendMode: "screen" }} />
      <div aria-hidden className="absolute pointer-events-none" style={{ zIndex: 20, top: "46%", left: 0, right: 0, height: "7%", background: "linear-gradient(to bottom, transparent, rgba(188,210,232,0.38) 50%, transparent)", filter: "blur(15px)", mixBlendMode: "screen" }} />
      <div aria-hidden className="absolute pointer-events-none" style={{ zIndex: 25, top: "26%", left: 0, right: 0, height: "5%", background: "linear-gradient(to bottom, transparent, rgba(185,208,230,0.20) 50%, transparent)", filter: "blur(10px)", mixBlendMode: "screen" }} />

      {/* ── Content layer ── z=30 ────────────────────────────────────────── */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity, zIndex: 30, willChange: "transform, opacity" }}
        className="absolute inset-0 pointer-events-none select-none"
      >
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "max(1.5rem, 6vw)",
            right: "max(1.5rem, 6vw)",
            maxWidth: "640px",
          }}
        >
          {/* ── Small label ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "14px",
            }}
          >
            <span style={{ fontSize: "0.62rem", letterSpacing: "0.30em", textTransform: "uppercase", color: "rgba(255,255,255,0.60)", fontWeight: 700, textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
              🇳🇵 &nbsp;Himalayan Kingdom
            </span>
          </div>

          {/* ── Ornamental divider ── */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}
          >
            <div style={{ height: "1px", width: "36px", background: "linear-gradient(to right, transparent, rgba(210,175,90,0.65))" }} />
            <span style={{ color: "rgba(210,175,90,0.80)", fontSize: "0.7rem", lineHeight: 1 }}>✦</span>
            <div style={{ height: "1px", width: "36px", background: "linear-gradient(to left, transparent, rgba(210,175,90,0.65))" }} />
          </div>

          {/* ── "NEPAL" — mountain photo bleeds through the letters ── */}
          <h1
            aria-label="NEPAL"
            style={{
              backgroundImage: `url('${PHOTO}')`,
              backgroundSize: "220% auto",
              backgroundPosition: "55% 22%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              fontSize: "clamp(4.8rem, 26vw, 11rem)",
              fontWeight: 900,
              letterSpacing: "-0.025em",
              lineHeight: 0.88,
              fontFamily: "'Arial Black', 'Arial Bold', Impact, 'Franklin Gothic Heavy', sans-serif",
              filter: "drop-shadow(0 3px 20px rgba(160,110,40,0.42))",
              marginBottom: "20px",
              userSelect: "none",
              display: "block",
            }}
          >
            NEPAL
          </h1>

          {/* ── Main heading ── */}
          <h2
            style={{
              fontSize: "clamp(1.6rem, 4.2vw, 2.8rem)",
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.12,
              letterSpacing: "-0.015em",
              textShadow: "0 2px 16px rgba(0,0,0,0.55)",
              marginBottom: "14px",
              maxWidth: "min(500px, 80vw)",
            }}
          >
            Discover the Roof<br />of the World
          </h2>

          {/* ── Subheading ── */}
          <p
            style={{
              fontSize: "clamp(0.875rem, 1.8vw, 1rem)",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.65,
              textShadow: "0 1px 10px rgba(0,0,0,0.55)",
              marginBottom: "28px",
              maxWidth: "min(380px, 84vw)",
            }}
          >
            AI-crafted journeys, local experiences,<br />
            and spiritual adventures.
          </p>

          {/* ── CTA Buttons ── */}
          <div
            className="pointer-events-auto"
            style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "40px" }}
          >
            {/* Primary */}
            <motion.button
              onClick={() =>
                document.dispatchEvent(new CustomEvent("open-ai-planner"))
              }
              whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(255,40,100,0.60)" }}
              whileTap={{ scale: 0.96 }}
              transition={BTN_TRANSITION}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "linear-gradient(135deg, #FF3B7D 0%, #E8103C 55%, #C0102E 100%)",
                border: "none",
                color: "#fff",
                padding: "13px 28px",
                borderRadius: "9999px",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
                letterSpacing: "0.01em",
                boxShadow: "0 4px 28px rgba(230,30,80,0.55)",
                willChange: "transform",
              }}
            >
              <Sparkles size={15} strokeWidth={2} />
              Plan My Journey
            </motion.button>

            {/* Secondary */}
            <motion.button
              onClick={() =>
                document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" })
              }
              whileHover={{ scale: 1.04, background: "rgba(255,255,255,0.14)" }}
              whileTap={{ scale: 0.96 }}
              transition={BTN_TRANSITION}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "rgba(255,255,255,0.88)",
                padding: "13px 28px",
                borderRadius: "9999px",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                willChange: "transform",
              }}
            >
              <Headphones size={15} strokeWidth={2} />
              Talk to Concierge
            </motion.button>
          </div>

          {/* ── Trust bar ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            {/* Avatar stack + rating */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ display: "flex" }}>
                {AVATAR_SEEDS.map((a, i) => (
                  <div
                    key={i}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: a.bg,
                      border: "2px solid rgba(255,255,255,0.35)",
                      marginLeft: i > 0 ? -8 : 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    {a.initials}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display: "flex", gap: "2px", marginBottom: "2px" }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={10} fill="#FBBF24" stroke="none" />
                  ))}
                </div>
                <p style={{ fontSize: "0.70rem", color: "rgba(255,255,255,0.58)", fontWeight: 500, lineHeight: 1 }}>
                  4.9 · (2.5K reviews)
                </p>
              </div>
            </div>

            {/* Separator dot */}
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.22)", flexShrink: 0 }} />

            {/* Label */}
            <p style={{ fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", fontWeight: 700 }}>
              Trusted by Travelers
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── "Watch Nepal" — bottom right ── z=40 ── */}
      <motion.div
        className="pointer-events-auto"
        style={{
          position: "absolute",
          bottom: "5rem",
          right: "max(1.5rem, 5vw)",
          zIndex: 40,
        }}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          transition={BTN_TRANSITION}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: "9999px",
            padding: "10px 14px 10px 10px",
            color: "rgba(255,255,255,0.90)",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.13)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Play size={13} fill="white" stroke="none" style={{ marginLeft: "2px" }} />
          </div>
          <div className="text-left">
            <p style={{ fontSize: "0.76rem", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>Watch Nepal</p>
            <p style={{ fontSize: "0.60rem", color: "rgba(255,255,255,0.50)", lineHeight: 1.2 }}>in 60 Seconds</p>
          </div>
        </motion.button>
      </motion.div>

      {/* ── Scroll cue ── z=50 ──────────────────────────────────────────── */}
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
