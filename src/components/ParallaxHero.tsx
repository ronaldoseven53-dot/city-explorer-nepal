"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type Transition } from "motion/react";

const BTN_TRANSITION: Transition = { type: "tween", duration: 0.15, ease: "easeInOut" };
import { Sparkles, Compass } from "lucide-react";

// ── Photo: same image, cropped at two positions for depth layers ──────
const PHOTO =
  "https://images.unsplash.com/photo-1525784451128-d1488f52f03e?w=3200&q=95";

// ── Component ─────────────────────────────────────────────────────────
export default function ParallaxHero() {
  const heroRef = useRef<HTMLDivElement>(null);

  // scrollYProgress: 0 = hero at viewport top, 1 = hero fully scrolled out
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Sky layer — barely moves (10 vh net upward), feels far away
  const skyY = useTransform(scrollYProgress, [0, 1], ["0%", "90%"]);

  // Mid layer — rises fast (96 vh net), covers "Wonders" at p ≈ 0.20
  const midY = useTransform(scrollYProgress, [0, 1], ["0%", "5%"]);

  // "Wonders" and title locked to the same rate → zero positional drift
  const wondersY     = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const titleY       = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.38, 0.52], [1, 1, 0]);

  return (
    <div
      ref={heroRef}
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", isolation: "isolate" }}
    >

      {/* ── Sky layer ── z=0, nearly stationary ─────────────────────────── */}
      <motion.div style={{ y: skyY, willChange: "transform" }} className="absolute inset-0" aria-hidden>

        {/* Full-bleed photo — 3 K quality, slow Ken Burns zoom */}
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

        {/* Cinematic depth-of-field vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 130% 110% at 50% 48%, transparent 42%, rgba(6,14,24,0.48) 100%)",
          }}
        />

        {/* Subtle top-darkness + warm ground toning */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(8,16,28,0.18) 0%, transparent 30%, rgba(50,35,12,0.22) 88%, rgba(30,20,8,0.38) 100%)",
          }}
        />
      </motion.div>

      {/* ── "Wonders of Nepal" ── z=5, behind mid mountain photo ─────────── */}
      {/* Same y-transform as title layer → zero drift at all scroll positions */}
      <motion.div
        style={{ y: wondersY, zIndex: 5, willChange: "transform" }}
        className="absolute inset-0 pointer-events-none select-none"
        aria-hidden
      >
        {/* Absolutely positioned below "Explore the" — same flex geometry */}
        <h1
          style={{
            position: "absolute",
            top: "calc(24% + clamp(2.6rem, 8vw, 6rem) * 1.1)",
            left: "50%",
            transform: "translateX(-50%)",
            width: "max-content",
            maxWidth: "90vw",
            textAlign: "center",
            fontFamily: "var(--font-playfair)",
            fontStyle: "italic",
            fontSize: "clamp(2.6rem, 8vw, 6rem)",
            lineHeight: 1.1,
            fontWeight: 700,
            margin: 0,
            background:
              "linear-gradient(135deg, #f0c060 0%, #e07040 50%, #b83820 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 3px 18px rgba(190,90,20,0.55))",
          }}
        >
          Wonders of Nepal
        </h1>
      </motion.div>

      {/* ── Mid mountain layer ── z=10, rises fast, covers Wonders ──────── */}
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
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          zIndex: 15,
          bottom: "18%",
          left: 0,
          right: 0,
          height: "9%",
          background:
            "linear-gradient(to bottom, transparent, rgba(195,215,235,0.62) 50%, transparent)",
          filter: "blur(22px)",
          mixBlendMode: "screen",
        }}
      />

      {/* ── Mist Band 2: Mid valley ── z=20 ── */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          zIndex: 20,
          top: "46%",
          left: 0,
          right: 0,
          height: "7%",
          background:
            "linear-gradient(to bottom, transparent, rgba(188,210,232,0.42) 50%, transparent)",
          filter: "blur(15px)",
          mixBlendMode: "screen",
        }}
      />

      {/* ── Mist Band 3: High-altitude wisp ── z=25 ── */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          zIndex: 25,
          top: "26%",
          left: 0,
          right: 0,
          height: "5%",
          background:
            "linear-gradient(to bottom, transparent, rgba(185,208,230,0.22) 50%, transparent)",
          filter: "blur(10px)",
          mixBlendMode: "screen",
        }}
      />

      {/* ── Title layer ── z=30 ─────────────────────────────────────────── */}
      <motion.div
        style={{ y: titleY, opacity: titleOpacity, zIndex: 30, willChange: "transform, opacity" }}
        className="absolute inset-0 pointer-events-none select-none"
      >
        {/* Tagline — top-left, small caps, charcoal */}
        <p
          style={{
            position: "absolute",
            top: "1.8rem",
            left: "2.5rem",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(28,34,42,0.88)",
            textShadow:
              "0 0 18px rgba(210,225,240,1.0), 0 1px 4px rgba(210,225,240,0.9)",
          }}
        >
          🇳🇵 &nbsp;Himalayan Kingdom
        </p>

        {/* "Explore the" — premium Playfair italic, white, centered */}
        <h1
          style={{
            position: "absolute",
            top: "24%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "max-content",
            maxWidth: "90vw",
            textAlign: "center",
            fontFamily: "var(--font-playfair)",
            fontStyle: "italic",
            fontSize: "clamp(2.6rem, 8vw, 6rem)",
            lineHeight: 1.1,
            fontWeight: 700,
            color: "#ffffff",
            textShadow:
              "0 2px 6px rgba(0,0,0,0.28), 0 10px 48px rgba(0,0,0,0.22)",
            margin: 0,
            whiteSpace: "nowrap",
          }}
        >
          Explore the
        </h1>

        {/* Subtitle — crimson with white halo for legibility on photo */}
        <p
          style={{
            position: "absolute",
            top: "calc(24% + clamp(2.6rem, 8vw, 6rem) * 1.1 * 2 + 1.1rem)",
            left: "50%",
            transform: "translateX(-50%)",
            width: "max-content",
            maxWidth: "min(28rem, 88vw)",
            textAlign: "center",
            fontSize: "clamp(0.875rem, 1.7vw, 1rem)",
            lineHeight: 1.7,
            letterSpacing: "0.08em",
            fontWeight: 700,
            color: "#DC143C",
            textShadow:
              "0 0 24px rgba(255,255,255,0.95), 0 0 8px rgba(255,255,255,0.90), 0 0 32px rgba(220,20,60,0.30)",
          }}
        >
          From the birthplace of Buddha to the roof of the world
        </p>

        {/* CTA Buttons — centered, frosted glass */}
        <div
          className="pointer-events-auto"
          style={{
            position: "absolute",
            top: "calc(24% + clamp(2.6rem, 8vw, 6rem) * 1.1 * 2 + 5rem)",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            justifyContent: "center",
            whiteSpace: "nowrap",
          }}
        >
          {/* AI Trip Planner */}
          <motion.button
            onClick={() =>
              document.dispatchEvent(new CustomEvent("open-ai-planner"))
            }
            whileHover={{
              scale: 1.04,
              boxShadow: "0 0 32px rgba(0,56,147,0.55), 0 0 12px rgba(220,20,60,0.28), inset 0 1px 0 rgba(255,255,255,0.28)",
            }}
            whileTap={{ scale: 0.96 }}
            transition={BTN_TRANSITION}
            className="btn-flag"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: "0.42rem",
              background: "#DC143C",
              border: "1px solid rgba(0,56,147,0.40)",
              boxShadow:
                "0 0 20px rgba(220,20,60,0.30), inset 0 1px 0 rgba(255,255,255,0.22)",
              color: "#fff",
              padding: "0.62rem 1.4rem",
              borderRadius: "9999px",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
              letterSpacing: "0.03em",
              willChange: "transform",
            }}
          >
            <Sparkles size={13} strokeWidth={2.2} />
            AI Trip Planner
          </motion.button>

          {/* Himalayan Concierge */}
          <motion.button
            onClick={() =>
              document
                .getElementById("discover")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            whileHover={{
              scale: 1.04,
              boxShadow: "0 0 32px rgba(0,56,147,0.50), 0 4px 20px rgba(0,56,147,0.30), inset 0 1px 0 rgba(255,255,255,0.28)",
            }}
            whileTap={{ scale: 0.96 }}
            transition={BTN_TRANSITION}
            className="btn-flag"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: "0.42rem",
              background: "#003893",
              border: "1px solid rgba(255,255,255,0.24)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), 0 1px 12px rgba(0,56,147,0.25)",
              color: "#ffffff",
              padding: "0.62rem 1.4rem",
              borderRadius: "9999px",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
              letterSpacing: "0.03em",
              willChange: "transform",
            }}
          >
            <Compass size={13} strokeWidth={2.2} />
            Himalayan Concierge
          </motion.button>
        </div>
      </motion.div>

      {/* ── Scroll cue ── z=50 ──────────────────────────────────────────── */}
      <motion.div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ zIndex: 50 }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="w-5 h-9 rounded-full flex items-start justify-center pt-1.5"
          style={{ border: "1.5px solid rgba(255,255,255,0.42)" }}
        >
          <motion.div
            className="w-[3px] h-2 rounded-full"
            style={{ background: "rgba(255,255,255,0.68)" }}
            animate={{ opacity: [0.9, 0.3, 0.9] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

    </div>
  );
}
