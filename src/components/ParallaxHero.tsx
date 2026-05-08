"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type Transition } from "motion/react";
import { Sparkles, ArrowDown } from "lucide-react";

const BTN_TRANSITION: Transition = { type: "tween", duration: 0.18, ease: "easeInOut" };

const PHOTO =
  "https://images.unsplash.com/photo-1525784451128-d1488f52f03e?w=3200&q=95";

export default function ParallaxHero() {
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const skyY         = useTransform(scrollYProgress, [0, 1], ["0%", "90%"]);
  const midY         = useTransform(scrollYProgress, [0, 1], ["0%", "5%"]);
  const titleY       = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.38, 0.52], [1, 1, 0]);

  return (
    <div
      ref={heroRef}
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", isolation: "isolate" }}
    >

      {/* ── Sky layer ── z=0 ─────────────────────────────────────────────── */}
      <motion.div style={{ y: skyY, willChange: "transform" }} className="absolute inset-0" aria-hidden>
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${PHOTO}')`,
            backgroundSize: "cover",
            backgroundPosition: "center 18%",
            willChange: "transform",
          }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 32, ease: "easeInOut", repeat: Infinity }}
        />
        {/* Depth-of-field vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 130% 110% at 50% 48%, transparent 42%, rgba(6,14,24,0.52) 100%)",
          }}
        />
        {/* Top dark + warm ground toning */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(8,16,28,0.32) 0%, rgba(8,16,28,0.18) 18%, transparent 38%, rgba(30,20,8,0.22) 88%, rgba(20,12,4,0.48) 100%)",
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
            filter: "saturate(0.82) brightness(0.78)",
          }}
        />
      </motion.div>

      {/* ── Mist Band 1: Valley floor ── z=15 ── */}
      <div aria-hidden className="absolute pointer-events-none" style={{ zIndex: 15, bottom: "18%", left: 0, right: 0, height: "9%", background: "linear-gradient(to bottom, transparent, rgba(195,215,235,0.62) 50%, transparent)", filter: "blur(22px)", mixBlendMode: "screen" }} />

      {/* ── Mist Band 2: Mid valley ── z=20 ── */}
      <div aria-hidden className="absolute pointer-events-none" style={{ zIndex: 20, top: "46%", left: 0, right: 0, height: "7%", background: "linear-gradient(to bottom, transparent, rgba(188,210,232,0.42) 50%, transparent)", filter: "blur(15px)", mixBlendMode: "screen" }} />

      {/* ── Mist Band 3: High-altitude wisp ── z=25 ── */}
      <div aria-hidden className="absolute pointer-events-none" style={{ zIndex: 25, top: "26%", left: 0, right: 0, height: "5%", background: "linear-gradient(to bottom, transparent, rgba(185,208,230,0.22) 50%, transparent)", filter: "blur(10px)", mixBlendMode: "screen" }} />

      {/* ── Text legibility overlay ── z=28 ── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 28,
          background:
            "linear-gradient(to bottom, rgba(10,18,30,0.30) 0%, rgba(10,18,30,0.42) 35%, rgba(10,18,30,0.08) 62%, transparent 80%)",
        }}
      />

      {/* ── Title layer ── z=30 ──────────────────────────────────────────── */}
      <motion.div
        style={{ y: titleY, opacity: titleOpacity, zIndex: 30, willChange: "transform, opacity" }}
        className="absolute inset-0 pointer-events-none select-none"
      >
        {/* ── Content stack ── centered at ~22% from top ── */}
        <div
          style={{
            position: "absolute",
            top: "22%",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 0,
            width: "max-content",
            maxWidth: "88vw",
          }}
        >
          {/* Small label */}
          <p
            style={{
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.62)",
              textShadow: "0 1px 10px rgba(0,0,0,0.50)",
              marginBottom: "16px",
            }}
          >
            Nepal
          </p>

          {/* Large emotional heading */}
          <h1
            style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontSize: "clamp(2.8rem, 7.5vw, 6.5rem)",
              fontWeight: 700,
              lineHeight: 1.06,
              color: "#ffffff",
              textShadow:
                "0 2px 12px rgba(0,0,0,0.40), 0 8px 48px rgba(0,0,0,0.28)",
              letterSpacing: "-0.01em",
              marginBottom: "24px",
              maxWidth: "min(680px, 88vw)",
            }}
          >
            Discover the<br />Roof of the World
          </h1>

          {/* AI-powered subheading */}
          <p
            style={{
              fontSize: "clamp(0.875rem, 1.7vw, 1rem)",
              lineHeight: 1.68,
              color: "rgba(255,255,255,0.72)",
              textShadow: "0 1px 10px rgba(0,0,0,0.48)",
              maxWidth: "min(30rem, 84vw)",
              marginBottom: "32px",
            }}
          >
            AI-crafted Himalayan adventures,<br />
            local experiences, and spiritual journeys.
          </p>

          {/* CTA Buttons — glassmorphism pills (8px spacing system) */}
          <div
            className="pointer-events-auto"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              justifyContent: "center",
            }}
          >
            {/* Primary — Plan My Journey */}
            <motion.button
              onClick={() =>
                document.dispatchEvent(new CustomEvent("open-ai-planner"))
              }
              whileHover={{
                scale: 1.04,
                background: "rgba(255,255,255,0.18)",
                boxShadow:
                  "0 0 32px rgba(255,255,255,0.16), inset 0 1px 0 rgba(255,255,255,0.35)",
              }}
              whileTap={{ scale: 0.96 }}
              transition={BTN_TRANSITION}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.28)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 24px rgba(0,0,0,0.22)",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "9999px",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
                letterSpacing: "0.025em",
                willChange: "transform",
              }}
            >
              <Sparkles size={14} strokeWidth={2} />
              Plan My Journey
            </motion.button>

            {/* Secondary — Explore Experiences */}
            <motion.button
              onClick={() =>
                document
                  .getElementById("discover")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              whileHover={{
                scale: 1.04,
                background: "rgba(255,255,255,0.10)",
                boxShadow:
                  "0 0 24px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.22)",
              }}
              whileTap={{ scale: 0.96 }}
              transition={BTN_TRANSITION}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.12), 0 2px 12px rgba(0,0,0,0.14)",
                color: "rgba(255,255,255,0.85)",
                padding: "12px 24px",
                borderRadius: "9999px",
                fontWeight: 500,
                fontSize: "0.875rem",
                cursor: "pointer",
                letterSpacing: "0.025em",
                willChange: "transform",
              }}
            >
              Explore Experiences
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ── Scroll cue ── z=50 ──────────────────────────────────────────── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ zIndex: 50 }}
        animate={{ y: [0, 5, 0], opacity: [0.55, 0.88, 0.55] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "5px",
            color: "rgba(255,255,255,0.58)",
          }}
        >
          <ArrowDown size={14} strokeWidth={1.5} />
          <span
            style={{
              fontSize: "0.58rem",
              fontWeight: 600,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
            }}
          >
            scroll
          </span>
        </div>
      </motion.div>

    </div>
  );
}
