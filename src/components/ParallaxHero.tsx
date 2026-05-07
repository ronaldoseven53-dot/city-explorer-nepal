"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

// ── Images ────────────────────────────────────────────────────────────
const SKY_IMAGE =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2400&q=90";
const MID_IMAGE =
  "https://images.unsplash.com/photo-1478432780021-b8d273730d8c?w=2400&q=90";

// ── Alpenglow sky gradient ─────────────────────────────────────────────
const ALPENGLOW =
  "linear-gradient(to bottom, #2d1b4e 0%, #6b2d6b 10%, #c4527a 22%, #e8825a 35%, #f2b07a 50%, #f5d5a8 65%, #e8e4d8 80%, #c8dce8 92%, #b8ccd8 100%)";

// ── Foreground SVG mountain silhouette ────────────────────────────────
// Upgraded with SVG gradient fills for premium look.
// Title "Wonders of Nepal" (z=5) is behind the mid layer (z=10);
// "Explore the" (z=30) stays in front of everything.
function MountainSVG() {
  return (
    <svg
      viewBox="0 0 1440 500"
      preserveAspectRatio="xMidYMax slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={{ display: "block", width: "100%", height: "60vh", minHeight: 280 }}
    >
      <defs>
        <linearGradient id="ridgeDistant" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#7090b8" stopOpacity="0.6" />
          <stop offset="60%"  stopColor="#5a7296" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#3d5578" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="ridgeMain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#6a4828" stopOpacity="0.9" />
          <stop offset="40%"  stopColor="#7a5530" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#3d2810" stopOpacity="1.0" />
        </linearGradient>
        <linearGradient id="ridgeHighlight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#c89060" stopOpacity="0.7" />
          <stop offset="50%"  stopColor="#9a6840" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#7a5030" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="snowCap" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="1.0" />
          <stop offset="70%"  stopColor="#e8f0f8" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#c8d8e8" stopOpacity="0.80" />
        </linearGradient>
      </defs>

      {/* ── Back ridge — cool blue-grey atmospheric haze ── */}
      <path
        d="M0,500 L0,340
           Q60,310 120,285 Q160,268 200,245
           Q230,228 265,200 L305,162
           Q335,132 365,150 Q400,170 435,200
           Q465,222 500,238 Q535,250 565,220
           L610,178 Q635,148 660,162
           Q690,180 725,215 Q755,238 795,250
           Q830,258 860,235 L905,195
           Q930,168 960,182 Q995,198 1030,228
           Q1060,250 1100,262 Q1135,270 1165,248
           L1205,208 Q1230,182 1255,196
           Q1285,214 1315,242 Q1345,262 1385,252
           L1440,245 L1440,500 Z"
        fill="url(#ridgeDistant)"
      />

      {/* ── Main ridge — warm rock face ── */}
      <path
        d="M0,500 L0,395
           Q45,375 90,358 Q130,342 168,320
           Q200,302 230,272 L272,228
           Q305,192 335,210 Q368,228 400,262
           Q428,288 462,305 L495,278
           Q518,248 545,260 Q580,278 615,312
           Q645,332 685,345 Q718,352 748,332
           L788,295 Q815,265 845,278
           Q878,295 912,325 Q938,345 972,358
           Q1005,368 1042,348 L1082,308
           Q1108,278 1135,292 Q1162,308 1192,335
           Q1218,355 1252,362 Q1285,368 1318,350
           Q1348,334 1378,345 L1440,352
           L1440,500 Z"
        fill="url(#ridgeMain)"
      />

      {/* ── Highlight ridge — lit rock face ── */}
      <path
        d="M0,500 L0,430
           Q55,418 108,408 Q148,400 185,390
           Q215,382 240,368 L280,348
           Q305,332 330,342 Q358,355 385,375
           Q410,392 445,400 L478,388
           Q500,375 525,382 Q552,392 582,410
           Q608,425 640,432 Q668,437 695,425
           L728,408 Q752,392 778,400
           Q808,412 838,430 Q862,445 895,450
           Q925,455 958,442 L992,425
           Q1015,412 1040,420 Q1068,432 1098,448
           Q1122,460 1152,462 Q1180,464 1208,450
           Q1232,438 1258,448 L1300,455
           Q1330,460 1360,455 Q1395,448 1420,452 L1440,454
           L1440,500 Z"
        fill="url(#ridgeHighlight)"
      />

      {/* ── Snow caps on tallest peaks ── */}
      <polygon points="272,228 252,252 272,242 294,246" fill="url(#snowCap)" />
      <polygon points="495,278 475,302 495,290 515,294" fill="url(#snowCap)" />
      <polygon points="788,295 768,319 788,307 808,311" fill="url(#snowCap)" />
      <polygon points="1082,308 1062,332 1082,320 1102,324" fill="url(#snowCap)" />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────
export default function ParallaxHero() {
  const heroRef = useRef<HTMLDivElement>(null);

  // scrollYProgress: 0 = hero at viewport top, 1 = hero fully scrolled out
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Sky barely moves (10% net upward speed) — feels very far away
  const skyY = useTransform(scrollYProgress, [0, 1], ["0%", "90%"]);

  // Mid layer rises FAST (96.25vh net) — swallows "Wonders" text at p≈0.16
  const midY = useTransform(scrollYProgress, [0, 1], ["0%", "5%"]);

  // "Wonders" layer locked to same rate as titleY → zero positional drift
  const wondersY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);

  // Foreground SVG — fast upward
  const foreY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // Title — same rate as wondersY keeps "Explore the" / "Wonders" aligned
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);

  // Fade out title layer after mid-scroll
  const titleOpacity = useTransform(scrollYProgress, [0, 0.35, 0.5], [1, 1, 0]);

  return (
    <div
      ref={heroRef}
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", isolation: "isolate" }}
    >

      {/* ── Layer 1: Sky ── z=0, nearly stationary ── */}
      <motion.div
        style={{ y: skyY }}
        className="absolute inset-0"
        aria-hidden
      >
        <div className="absolute inset-0" style={{ background: ALPENGLOW }} />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${SKY_IMAGE}')`,
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
            opacity: 0.55,
            mixBlendMode: "luminosity",
          }}
        />
      </motion.div>

      {/* ── Layer 2: "Wonders of Nepal" text ── z=5, BEHIND mid mountains ── */}
      {/* Locked to same y-transform as titleY → zero drift from "Explore the" */}
      <motion.div
        style={{ y: wondersY, zIndex: 5 }}
        className="absolute inset-0 pointer-events-none select-none"
        aria-hidden
      >
        <div
          style={{
            paddingTop: "22vh",
            paddingLeft: "max(1.5rem, 8vw)",
            paddingRight: "max(1.5rem, 8vw)",
          }}
        >
          {/* Invisible spacer: matches height of flag label p */}
          <div style={{ height: "calc(0.75rem * 2.5)", visibility: "hidden" }} />
          {/* Invisible spacer: matches "Explore the" h1 line height */}
          <div
            style={{
              height: "calc(clamp(2.6rem, 8vw, 6rem) * 1.1)",
              visibility: "hidden",
            }}
          />
          {/* Visible "Wonders of Nepal" — covered by mid mountains at p≈0.16 */}
          <h1
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(2.6rem, 8vw, 6rem)",
              lineHeight: 1.1,
              margin: 0,
              background:
                "linear-gradient(135deg, #f59e0b 0%, #dc2626 50%, #c026d3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 2px 8px rgba(220,100,40,0.4))",
            }}
          >
            Wonders of Nepal
          </h1>
        </div>
      </motion.div>

      {/* ── Layer 3: Mid mountain range ── z=10, rises fast → covers Wonders ── */}
      <motion.div
        style={{
          y: midY,
          position: "absolute",
          top: "25%",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
        aria-hidden
      >
        <div
          className="absolute left-0 right-0"
          style={{
            top: 0,
            bottom: 0,
            backgroundImage: `url('${MID_IMAGE}')`,
            backgroundSize: "cover",
            backgroundPosition: "center 60%",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 22%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 22%, black 100%)",
            filter: "saturate(0.8) brightness(0.88)",
          }}
        />
      </motion.div>

      {/* ── Mist Band 1: Valley floor ── z=15, heaviest blur ── */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          zIndex: 15,
          bottom: "20%",
          left: 0,
          right: 0,
          height: "8%",
          background:
            "linear-gradient(to bottom, transparent, rgba(220,215,205,0.65) 50%, transparent)",
          filter: "blur(20px)",
          mixBlendMode: "screen",
        }}
      />

      {/* ── Mist Band 2: Mid valley ── z=20 ── */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          zIndex: 20,
          top: "48%",
          left: 0,
          right: 0,
          height: "7%",
          background:
            "linear-gradient(to bottom, transparent, rgba(210,225,238,0.45) 50%, transparent)",
          filter: "blur(14px)",
          mixBlendMode: "screen",
        }}
      />

      {/* ── Mist Band 3: High altitude wisp ── z=25 ── */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          zIndex: 25,
          top: "28%",
          left: 0,
          right: 0,
          height: "5%",
          background:
            "linear-gradient(to bottom, transparent, rgba(200,220,240,0.28) 50%, transparent)",
          filter: "blur(10px)",
          mixBlendMode: "screen",
        }}
      />

      {/* ── Color grade overlay ── z=26 ── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 26,
          background:
            "linear-gradient(to bottom, rgba(45,27,78,0.08) 0%, transparent 35%, rgba(180,140,80,0.10) 100%)",
        }}
      />

      {/* ── Title layer ── z=30, ABOVE all mountain layers ── */}
      {/* "Explore the" stays visible; invisible spacer reserves Wonders line height */}
      <motion.div
        style={{ y: titleY, opacity: titleOpacity, zIndex: 30 }}
        className="absolute inset-0 pointer-events-none select-none"
      >
        <div
          style={{
            paddingTop: "22vh",
            paddingLeft: "max(1.5rem, 8vw)",
            paddingRight: "max(1.5rem, 8vw)",
          }}
        >
          {/* Flag label */}
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              marginBottom: "0.75rem",
              color: "rgba(255,255,255,0.90)",
              textShadow: "0 1px 6px rgba(80,20,80,0.5)",
            }}
          >
            🇳🇵 Himalayan Kingdom
          </p>

          {/* Line 1: "Explore the" — fully visible */}
          <h1
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(2.6rem, 8vw, 6rem)",
              lineHeight: 1.1,
              fontWeight: 800,
              color: "#fff",
              textShadow:
                "0 2px 4px rgba(0,0,0,0.30), 0 8px 32px rgba(0,0,0,0.22)",
              margin: 0,
            }}
          >
            Explore the
          </h1>

          {/* Invisible spacer — matches "Wonders of Nepal" line in z=5 layer */}
          <div
            aria-hidden
            style={{
              height: "calc(clamp(2.6rem, 8vw, 6rem) * 1.1)",
              visibility: "hidden",
            }}
          />

          {/* Subtitle */}
          <p
            style={{
              marginTop: "0.75rem",
              fontSize: "clamp(0.95rem, 2vw, 1.125rem)",
              maxWidth: "28rem",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.82)",
              textShadow: "0 1px 8px rgba(0,0,0,0.35)",
            }}
          >
            From the birthplace of Buddha to the roof of the world
          </p>

          {/* CTA Buttons */}
          <div
            className="pointer-events-auto"
            style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1.5rem" }}
          >
            {/* AI Trip Planner — frosted glass, red glow */}
            <button
              onClick={() =>
                document.dispatchEvent(new CustomEvent("open-ai-planner"))
              }
              style={{
                background: "rgba(220,38,38,0.18)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(220,38,38,0.45)",
                boxShadow:
                  "0 0 24px rgba(220,38,38,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                color: "#fff",
                padding: "0.6rem 1.35rem",
                borderRadius: "9999px",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                letterSpacing: "0.02em",
              }}
            >
              ✨ AI Trip Planner
            </button>

            {/* Himalayan Concierge — dark frosted glass */}
            <button
              onClick={() =>
                document
                  .getElementById("discover")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                background: "rgba(10,10,20,0.45)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.20)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
                color: "#fff",
                padding: "0.6rem 1.35rem",
                borderRadius: "9999px",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                letterSpacing: "0.02em",
              }}
            >
              🏔 Himalayan Concierge
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Layer 4: Foreground SVG peaks ── z=40, moves fastest ── */}
      <motion.div
        style={{ y: foreY, zIndex: 40 }}
        className="absolute bottom-0 left-0 right-0"
        aria-hidden
      >
        <MountainSVG />
      </motion.div>

      {/* ── Scroll cue ── z=50 ── */}
      <motion.div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ zIndex: 50 }}
        animate={{ y: [0, 9, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="w-6 h-10 rounded-full flex items-start justify-center pt-1.5"
          style={{ border: "1.5px solid rgba(255,255,255,0.55)" }}
        >
          <div
            className="w-1 h-2.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.75)" }}
          />
        </div>
      </motion.div>

    </div>
  );
}
