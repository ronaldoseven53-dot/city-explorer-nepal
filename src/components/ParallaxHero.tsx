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
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 130% 110% at 50% 48%, transparent 42%, rgba(6,14,24,0.48) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(8,16,28,0.18) 0%, transparent 30%, rgba(50,35,12,0.22) 88%, rgba(30,20,8,0.38) 100%)",
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

      {/* ── Title layer ── z=30 ──────────────────────────────────────────── */}
      <motion.div
        style={{ y: titleY, opacity: titleOpacity, zIndex: 30, willChange: "transform, opacity" }}
        className="absolute inset-0 pointer-events-none select-none"
      >
        {/* Tagline — top-left */}
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

        {/* Centered title + subtitle + buttons column */}
        <div
          style={{
            position: "absolute",
            top: "17%",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.25rem",
            width: "max-content",
            maxWidth: "95vw",
          }}
        >

          {/* ── "NEPAL" floating with elegant quotes ── */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(0.15rem, 0.7vw, 0.55rem)",
            }}
          >
            {/* Opening guillemet */}
            <span
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(1.8rem, 4.5vw, 3.8rem)",
                color: "rgba(255,255,255,0.90)",
                lineHeight: 0.85,
                fontStyle: "italic",
                textShadow:
                  "0 2px 24px rgba(220,20,60,0.60), 0 0 48px rgba(0,56,147,0.38)",
                userSelect: "none",
              }}
            >
              &ldquo;
            </span>

            {/* ── SVG NEPAL — mandala clipping-mask pattern fill ── */}
            <svg
              viewBox="0 0 750 135"
              style={{
                width: "clamp(190px, 52vw, 590px)",
                height: "auto",
                overflow: "visible",
                display: "block",
              }}
              role="img"
              aria-label="NEPAL"
            >
              <defs>
                {/*
                  90×90 mandala tile:
                  - Deep royal-blue base (#002b7a)
                  - 8-pointed white star
                  - Crimson center disc (#DC143C)
                  - White inner ring + centre dot
                  - Crimson cardinal diamonds
                  - White corner accent dots
                */}
                <pattern
                  id="nepalMandala"
                  x="0"
                  y="0"
                  width="90"
                  height="90"
                  patternUnits="userSpaceOnUse"
                >
                  <rect width="90" height="90" fill="#002b7a" />

                  {/* 8-pointed star */}
                  <polygon
                    points="45,7 51,30 68,19 59,39 78,45 59,51 68,71 51,60 45,83 39,60 22,71 31,51 12,45 31,39 22,19 39,30"
                    fill="rgba(255,255,255,0.84)"
                  />

                  {/* Crimson centre disc */}
                  <circle cx="45" cy="45" r="20" fill="#DC143C" />

                  {/* White inner ring */}
                  <circle
                    cx="45"
                    cy="45"
                    r="13"
                    fill="none"
                    stroke="rgba(255,255,255,0.88)"
                    strokeWidth="2"
                  />

                  {/* White centre dot */}
                  <circle cx="45" cy="45" r="5.5" fill="white" />

                  {/* Cardinal crimson diamonds */}
                  <polygon points="45,0 49,4 45,8 41,4" fill="#DC143C" />
                  <polygon points="90,45 86,49 82,45 86,41" fill="#DC143C" />
                  <polygon points="45,90 49,86 45,82 41,86" fill="#DC143C" />
                  <polygon points="0,45 4,49 8,45 4,41" fill="#DC143C" />

                  {/* Corner accent dots */}
                  <circle cx="9"  cy="9"  r="3" fill="rgba(255,255,255,0.50)" />
                  <circle cx="81" cy="9"  r="3" fill="rgba(255,255,255,0.50)" />
                  <circle cx="9"  cy="81" r="3" fill="rgba(255,255,255,0.50)" />
                  <circle cx="81" cy="81" r="3" fill="rgba(255,255,255,0.50)" />
                </pattern>

                <filter id="nepalShadow" x="-8%" y="-25%" width="116%" height="150%">
                  <feDropShadow
                    dx="0"
                    dy="6"
                    stdDeviation="14"
                    floodColor="rgba(0,0,0,0.55)"
                    floodOpacity="1"
                  />
                </filter>
              </defs>

              {/* Patterned fill */}
              <text
                x="375"
                y="118"
                textAnchor="middle"
                fontFamily="'Arial Black', Impact, 'Franklin Gothic Heavy', sans-serif"
                fontSize="124"
                fontWeight="900"
                fill="url(#nepalMandala)"
                filter="url(#nepalShadow)"
                style={{ letterSpacing: "8px" }}
              >
                NEPAL
              </text>

              {/* Crisp white outline */}
              <text
                x="375"
                y="118"
                textAnchor="middle"
                fontFamily="'Arial Black', Impact, 'Franklin Gothic Heavy', sans-serif"
                fontSize="124"
                fontWeight="900"
                fill="none"
                stroke="rgba(255,255,255,0.30)"
                strokeWidth="1.5"
                style={{ letterSpacing: "8px" }}
              >
                NEPAL
              </text>
            </svg>

            {/* Closing guillemet */}
            <span
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(1.8rem, 4.5vw, 3.8rem)",
                color: "rgba(255,255,255,0.90)",
                lineHeight: 0.85,
                fontStyle: "italic",
                textShadow:
                  "0 2px 24px rgba(220,20,60,0.60), 0 0 48px rgba(0,56,147,0.38)",
                userSelect: "none",
              }}
            >
              &rdquo;
            </span>
          </motion.div>

          {/* Subtitle — sharp black */}
          <p
            style={{
              textAlign: "center",
              fontSize: "clamp(0.875rem, 1.7vw, 1rem)",
              lineHeight: 1.7,
              letterSpacing: "0.04em",
              fontWeight: 600,
              color: "#000000",
              textShadow:
                "0 0 20px rgba(255,255,255,0.98), 0 0 10px rgba(255,255,255,0.90), 0 1px 2px rgba(255,255,255,0.85)",
              maxWidth: "min(28rem, 88vw)",
            }}
          >
            From the birthplace of Buddha to the roof of the world
          </p>

          {/* CTA Buttons */}
          <div
            className="pointer-events-auto"
            style={{
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
                boxShadow:
                  "0 0 32px rgba(0,56,147,0.55), 0 0 12px rgba(220,20,60,0.28), inset 0 1px 0 rgba(255,255,255,0.28)",
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
                boxShadow:
                  "0 0 32px rgba(0,56,147,0.50), 0 4px 20px rgba(0,56,147,0.30), inset 0 1px 0 rgba(255,255,255,0.28)",
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
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.18), 0 1px 12px rgba(0,56,147,0.25)",
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
