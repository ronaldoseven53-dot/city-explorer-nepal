"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type Transition } from "motion/react";
import { Sparkles, Headphones, Star, Play } from "lucide-react";

const BTN_TRANSITION: Transition = { type: "tween", duration: 0.18, ease: "easeInOut" };

// The Nepal landscape photo: sky/peak → monastery/village → lake/flags/cliffs
const PHOTO = "/images/nepal-landscape.jpg";

const AVATAR_SEEDS = [
  { bg: "#8B6F5E", initials: "R" },
  { bg: "#5E7B8B", initials: "M" },
  { bg: "#6B8B5E", initials: "S" },
];

// ── SVG mandala-patterned "NEPAL" title ─────────────────────────────────────
function MandalaSVGTitle() {
  return (
    <svg
      viewBox="0 0 1000 210"
      xmlns="http://www.w3.org/2000/svg"
      aria-label='"NEPAL"'
      style={{
        width: "100%",
        maxWidth: "min(940px, 96vw)",
        overflow: "visible",
        display: "block",
        margin: "0 auto",
      }}
    >
      <defs>
        {/* ── Mandala tile (96×96): crimson base / royal-blue geometry / white accents ── */}
        <pattern
          id="mandalaFill"
          x="0"
          y="0"
          width="96"
          height="96"
          patternUnits="userSpaceOnUse"
        >
          {/* Base */}
          <rect width="96" height="96" fill="#8B0A22" />

          {/* Royal-blue large circle */}
          <circle cx="48" cy="48" r="44" fill="#003893" />

          {/* Crimson 8-pointed star */}
          <polygon
            points="48,10 53,34 70,22 58,42 82,47 58,52 70,74 53,62 48,86 43,62 26,74 38,52 14,47 38,42 26,22 43,34"
            fill="#DC143C"
          />

          {/* White 8-petal flower */}
          <ellipse cx="48" cy="35" rx="4.5" ry="10" fill="white" opacity="0.82" />
          <ellipse cx="48" cy="35" rx="4.5" ry="10" fill="white" opacity="0.82"
            transform="rotate(45 48 48)" />
          <ellipse cx="48" cy="35" rx="4.5" ry="10" fill="white" opacity="0.82"
            transform="rotate(90 48 48)" />
          <ellipse cx="48" cy="35" rx="4.5" ry="10" fill="white" opacity="0.82"
            transform="rotate(135 48 48)" />
          <ellipse cx="48" cy="35" rx="4.5" ry="10" fill="white" opacity="0.82"
            transform="rotate(180 48 48)" />
          <ellipse cx="48" cy="35" rx="4.5" ry="10" fill="white" opacity="0.82"
            transform="rotate(225 48 48)" />
          <ellipse cx="48" cy="35" rx="4.5" ry="10" fill="white" opacity="0.82"
            transform="rotate(270 48 48)" />
          <ellipse cx="48" cy="35" rx="4.5" ry="10" fill="white" opacity="0.82"
            transform="rotate(315 48 48)" />

          {/* Royal-blue inner disc */}
          <circle cx="48" cy="48" r="16" fill="#003893" />
          {/* Crimson center */}
          <circle cx="48" cy="48" r="10" fill="#DC143C" />
          {/* White ring */}
          <circle cx="48" cy="48" r="6" fill="none" stroke="white" strokeWidth="1.5" />
          {/* White center dot */}
          <circle cx="48" cy="48" r="3" fill="white" />

          {/* Outer white accent dots — cardinal */}
          <circle cx="48" cy="4"  r="3" fill="white" opacity="0.65" />
          <circle cx="48" cy="92" r="3" fill="white" opacity="0.65" />
          <circle cx="4"  cy="48" r="3" fill="white" opacity="0.65" />
          <circle cx="92" cy="48" r="3" fill="white" opacity="0.65" />
          {/* Diagonal */}
          <circle cx="14" cy="14" r="2.5" fill="white" opacity="0.45" />
          <circle cx="82" cy="14" r="2.5" fill="white" opacity="0.45" />
          <circle cx="14" cy="82" r="2.5" fill="white" opacity="0.45" />
          <circle cx="82" cy="82" r="2.5" fill="white" opacity="0.45" />
        </pattern>

        {/* Warm drop-shadow on letters */}
        <filter id="letterGlow" x="-8%" y="-8%" width="116%" height="116%">
          <feDropShadow dx="0" dy="4" stdDeviation="12" floodColor="#a04010" floodOpacity="0.70" />
        </filter>

        {/* Clip-path so the mandala fill is confined to the letter shapes */}
        <clipPath id="nepalClip">
          <text
            x="500"
            y="182"
            textAnchor="middle"
            fontFamily="'Arial Black','Arial Bold',Impact,'Franklin Gothic Heavy',sans-serif"
            fontSize="186"
            fontWeight="900"
            letterSpacing="-4"
          >
            NEPAL
          </text>
        </clipPath>
      </defs>

      {/* Opening curly quote */}
      <text
        x="14"
        y="185"
        fontFamily="Georgia,'Times New Roman',serif"
        fontStyle="italic"
        fontSize="148"
        fontWeight="700"
        fill="rgba(255,255,255,0.50)"
      >
        &#x201C;
      </text>

      {/* Mandala-filled NEPAL — rendered as a clipped rect so the fill tiles correctly */}
      <g filter="url(#letterGlow)">
        <rect
          x="0"
          y="0"
          width="1000"
          height="210"
          fill="url(#mandalaFill)"
          clipPath="url(#nepalClip)"
        />
      </g>

      {/* Closing curly quote */}
      <text
        x="986"
        y="185"
        textAnchor="end"
        fontFamily="Georgia,'Times New Roman',serif"
        fontStyle="italic"
        fontSize="148"
        fontWeight="700"
        fill="rgba(255,255,255,0.50)"
      >
        &#x201D;
      </text>
    </svg>
  );
}

// ── Main hero ─────────────────────────────────────────────────────────────────
export default function ParallaxHero() {
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Layer 0 — Sky / snow peak   → nearly stationary
  const skyY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  // Layer 1 — Monastery / village → medium speed
  const midY = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  // Layer 2 — Lake / prayer flags → fastest (closest to viewer)
  const foreY = useTransform(scrollYProgress, [0, 1], ["0%", "46%"]);
  // Content
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.38, 0.52], [1, 1, 0]);

  return (
    <div
      ref={heroRef}
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", isolation: "isolate" }}
    >

      {/* ══ Layer 0 — Sky / Peak  z=0 ═══════════════════════════════════════ */}
      <motion.div
        style={{ y: skyY, willChange: "transform" }}
        className="absolute inset-0"
        aria-hidden
      >
        {/* Ken-Burns on the photo */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${PHOTO}')`,
            backgroundSize: "cover",
            backgroundPosition: "center 6%",
          }}
          animate={{ scale: [1, 1.055, 1] }}
          transition={{ duration: 36, ease: "easeInOut", repeat: Infinity }}
        />
        {/* Main gradient: dark top (text legibility) → clear mid → dark bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(6,10,22,0.76) 0%, rgba(6,10,22,0.42) 20%, rgba(6,10,22,0.08) 42%, rgba(6,10,22,0.12) 62%, rgba(6,10,22,0.60) 100%)",
          }}
        />
      </motion.div>

      {/* ══ Layer 1 — Monastery / Village  z=10 ═════════════════════════════ */}
      <motion.div
        style={{
          y: midY,
          position: "absolute",
          top: "30%",
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
            backgroundPosition: "center 52%",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 18%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 18%, black 100%)",
            filter: "saturate(0.82) brightness(0.74)",
          }}
        />
      </motion.div>

      {/* ══ Layer 2 — Lake / Prayer Flags  z=18 ══════════════════════════════ */}
      <motion.div
        style={{
          y: foreY,
          position: "absolute",
          top: "54%",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 18,
          willChange: "transform",
        }}
        aria-hidden
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${PHOTO}')`,
            backgroundSize: "cover",
            backgroundPosition: "center 89%",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 22%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 22%, black 100%)",
            filter: "saturate(0.88) brightness(0.65)",
          }}
        />
        {/* Darken bottom edge */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 55%, rgba(6,10,22,0.52) 100%)",
          }}
        />
      </motion.div>

      {/* ══ Mist / atmosphere bands ══════════════════════════════════════════ */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          zIndex: 14,
          bottom: "24%",
          left: 0,
          right: 0,
          height: "8%",
          background:
            "linear-gradient(to bottom, transparent, rgba(195,215,235,0.52) 50%, transparent)",
          filter: "blur(22px)",
          mixBlendMode: "screen",
        }}
      />
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          zIndex: 19,
          top: "50%",
          left: 0,
          right: 0,
          height: "6%",
          background:
            "linear-gradient(to bottom, transparent, rgba(185,210,232,0.36) 50%, transparent)",
          filter: "blur(14px)",
          mixBlendMode: "screen",
        }}
      />
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          zIndex: 9,
          top: "28%",
          left: 0,
          right: 0,
          height: "5%",
          background:
            "linear-gradient(to bottom, transparent, rgba(180,208,230,0.22) 50%, transparent)",
          filter: "blur(10px)",
          mixBlendMode: "screen",
        }}
      />

      {/* ══ Content  z=30 ════════════════════════════════════════════════════ */}
      <motion.div
        style={{
          y: contentY,
          opacity: contentOpacity,
          zIndex: 30,
          willChange: "transform, opacity",
        }}
        className="absolute inset-0 pointer-events-none select-none"
      >
        <div
          style={{
            position: "absolute",
            top: "7%",
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            paddingLeft: "max(1rem, 4vw)",
            paddingRight: "max(1rem, 4vw)",
          }}
        >
          {/* Country label */}
          <div style={{ marginBottom: "10px" }}>
            <span
              style={{
                fontSize: "0.60rem",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.58)",
                fontWeight: 700,
                textShadow: "0 1px 8px rgba(0,0,0,0.55)",
              }}
            >
              🇳🇵 &nbsp;Himalayan Kingdom
            </span>
          </div>

          {/* Ornamental divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                height: "1px",
                width: "42px",
                background:
                  "linear-gradient(to right, transparent, rgba(210,175,90,0.68))",
              }}
            />
            <span
              style={{
                color: "rgba(210,175,90,0.82)",
                fontSize: "0.7rem",
                lineHeight: 1,
              }}
            >
              ✦
            </span>
            <div
              style={{
                height: "1px",
                width: "42px",
                background:
                  "linear-gradient(to left, transparent, rgba(210,175,90,0.68))",
              }}
            />
          </div>

          {/* ── Mandala NEPAL title with Y-float ── */}
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 5.2, ease: "easeInOut", repeat: Infinity }}
            style={{
              width: "100%",
              maxWidth: "min(900px, 96vw)",
              marginBottom: "22px",
            }}
          >
            <MandalaSVGTitle />
          </motion.div>

          {/* Subheading */}
          <p
            style={{
              fontSize: "clamp(1.0rem, 2.4vw, 1.45rem)",
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.35,
              letterSpacing: "-0.01em",
              textShadow: "0 2px 18px rgba(0,0,0,0.70)",
              marginBottom: "30px",
              maxWidth: "min(520px, 88vw)",
            }}
          >
            From the birthplace of Buddha to the roof of the world
          </p>

          {/* ── CTA buttons ── */}
          <div
            className="pointer-events-auto"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              justifyContent: "center",
              marginBottom: "44px",
            }}
          >
            {/* Primary — crimson glass */}
            <motion.button
              onClick={() =>
                document.dispatchEvent(new CustomEvent("open-ai-planner"))
              }
              whileHover={{
                scale: 1.04,
                boxShadow: "0 0 40px rgba(220,20,60,0.58)",
              }}
              whileTap={{ scale: 0.96 }}
              transition={BTN_TRANSITION}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(220,20,60,0.20)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                border: "1px solid rgba(220,20,60,0.52)",
                boxShadow:
                  "0 0 22px rgba(220,20,60,0.30), inset 0 1px 0 rgba(255,255,255,0.14)",
                color: "#fff",
                padding: "13px 28px",
                borderRadius: "9999px",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
                letterSpacing: "0.01em",
                willChange: "transform",
              }}
            >
              <Sparkles size={15} strokeWidth={2} />
              Plan My Journey
            </motion.button>

            {/* Secondary — white glass */}
            <motion.button
              onClick={() =>
                document
                  .getElementById("discover")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              whileHover={{
                scale: 1.04,
                background: "rgba(255,255,255,0.14)",
              }}
              whileTap={{ scale: 0.96 }}
              transition={BTN_TRANSITION}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
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
              justifyContent: "center",
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
                <div
                  style={{
                    display: "flex",
                    gap: "2px",
                    marginBottom: "2px",
                  }}
                >
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={10} fill="#FBBF24" stroke="none" />
                  ))}
                </div>
                <p
                  style={{
                    fontSize: "0.70rem",
                    color: "rgba(255,255,255,0.58)",
                    fontWeight: 500,
                    lineHeight: 1,
                  }}
                >
                  4.9 · (2.5K reviews)
                </p>
              </div>
            </div>

            <span
              style={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.22)",
                flexShrink: 0,
              }}
            />

            <p
              style={{
                fontSize: "0.58rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.38)",
                fontWeight: 700,
              }}
            >
              Trusted by Travelers
            </p>
          </div>
        </div>
      </motion.div>

      {/* ══ "Watch Nepal" — bottom right  z=40 ══════════════════════════════ */}
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
              background: "rgba(220,20,60,0.32)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(220,20,60,0.52)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Play
              size={13}
              fill="white"
              stroke="none"
              style={{ marginLeft: "2px" }}
            />
          </div>
          <div className="text-left">
            <p
              style={{
                fontSize: "0.76rem",
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.2,
              }}
            >
              Watch Nepal
            </p>
            <p
              style={{
                fontSize: "0.60rem",
                color: "rgba(255,255,255,0.50)",
                lineHeight: 1.2,
              }}
            >
              in 60 Seconds
            </p>
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
