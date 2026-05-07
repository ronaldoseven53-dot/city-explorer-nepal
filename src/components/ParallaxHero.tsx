"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

// ── Images ────────────────────────────────────────────────────────────
const SKY_IMAGE =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2400&q=90";
const MID_IMAGE =
  "https://images.unsplash.com/photo-1478432780021-b8d273730d8c?w=2400&q=90";

// ── Foreground SVG mountain silhouette ────────────────────────────────
// Covers the bottom ~55 % of the hero; title (positioned at ~42 % from top)
// sits BEHIND these peaks thanks to z-index ordering.
function MountainSVG() {
  return (
    <svg
      viewBox="0 0 1440 500"
      preserveAspectRatio="xMidYMax slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={{ display: "block", width: "100%", height: "60vh", minHeight: 280 }}
    >
      {/* ── Back ridge — lighter warm stone ── */}
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
        fill="#a07840"
        fillOpacity="0.55"
      />

      {/* ── Main ridge — warm dark sienna ── */}
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
        fill="#7a5530"
        fillOpacity="0.92"
      />

      {/* ── Highlight ridge — lighter warm face catches light ── */}
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
        fill="#8b6040"
        fillOpacity="0.65"
      />

      {/* ── Snow caps on tallest peaks ── */}
      <polygon points="272,228 255,248 272,240 290,244" fill="rgba(255,252,245,0.95)" />
      <polygon points="495,278 478,298 495,288 512,292" fill="rgba(255,252,245,0.90)" />
      <polygon points="788,295 771,315 788,305 805,309" fill="rgba(255,252,245,0.95)" />
      <polygon points="1082,308 1065,328 1082,318 1099,322" fill="rgba(255,252,245,0.88)" />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────
export default function ParallaxHero() {
  const heroRef = useRef<HTMLDivElement>(null);

  // scrollYProgress: 0 when hero top = viewport top, 1 when hero bottom = viewport top
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Layers move DOWN (positive %) as hero scrolls away — slower = farther.
  // Sky  10% apparent scroll speed → offset = 90% when fully scrolled
  const skyY   = useTransform(scrollYProgress, [0, 1], ["0%",  "90%"]);
  // Middle 30% apparent → offset 70%
  const midY   = useTransform(scrollYProgress, [0, 1], ["0%",  "70%"]);
  // Foreground 50% apparent → offset 50%
  const foreY  = useTransform(scrollYProgress, [0, 1], ["0%",  "50%"]);
  // Title drifts slightly (60% apparent speed → 40% offset)
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%",  "40%"]);

  // Title opacity: fade out over first 50% of hero scroll
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div
      ref={heroRef}
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", isolation: "isolate" }}
    >

      {/* ── Layer 1: Sky ── z=0, moves slowest ── */}
      <motion.div
        style={{ y: skyY }}
        className="absolute inset-0 z-0"
        aria-hidden
      >
        {/* Gradient sky base */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #8ab4ce 0%, #b8d0e0 25%, #d4e4f0 45%, #e8d8c0 65%, #d4bc90 80%, #c0a070 100%)",
          }}
        />
        {/* Wide-angle sky photo blended over gradient */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${SKY_IMAGE}')`,
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
            opacity: 0.65,
            mixBlendMode: "luminosity",
          }}
        />
      </motion.div>

      {/* ── Layer 2: Middle mountain range ── z=10, mid speed ── */}
      <motion.div
        style={{ y: midY, position: "absolute", top: "25%", bottom: 0, left: 0, right: 0, zIndex: 10 }}
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
            filter: "saturate(0.75) brightness(0.9)",
          }}
        />
      </motion.div>

      {/* ── Mist layer: atmospheric perspective between mid & fore ── */}
      <div
        aria-hidden
        className="absolute z-20 left-0 right-0 pointer-events-none"
        style={{
          top: "52%",
          height: "12%",
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(235,228,215,0.55) 50%, transparent 100%)",
          filter: "blur(14px)",
        }}
      />

      {/* ── Color grade overlay ── */}
      <div
        aria-hidden
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(200,220,240,0.08) 0%, transparent 40%, rgba(180,140,80,0.12) 100%)",
        }}
      />

      {/* ── Title text ── z=30, BELOW foreground peaks ── */}
      <motion.div
        style={{ y: titleY, opacity: titleOpacity }}
        className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none select-none px-6"
      >
        <p
          className="text-xs font-bold uppercase tracking-[0.22em] mb-4"
          style={{ color: "rgba(160,60,40,0.95)", textShadow: "0 1px 6px rgba(255,255,255,0.6)" }}
        >
          🇳🇵 Himalayan Kingdom
        </p>
        <h1
          className="text-center font-extrabold leading-tight tracking-tight"
          style={{
            fontSize: "clamp(2.6rem, 8vw, 6rem)",
            color: "#fff",
            textShadow:
              "0 2px 4px rgba(0,0,0,0.25), 0 8px 32px rgba(0,0,0,0.18)",
            fontFamily: "var(--font-playfair)",
          }}
        >
          Explore the{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Wonders of Nepal
          </span>
        </h1>
        <p
          className="mt-4 text-center text-base sm:text-lg max-w-md leading-relaxed"
          style={{
            color: "rgba(255,255,255,0.82)",
            textShadow: "0 1px 8px rgba(0,0,0,0.35)",
          }}
        >
          From the birthplace of Buddha to the roof of the world
        </p>
      </motion.div>

      {/* ── Layer 3: Foreground peaks SVG ── z=40, moves fastest ── */}
      <motion.div
        style={{ y: foreY }}
        className="absolute bottom-0 left-0 right-0 z-40"
        aria-hidden
      >
        <MountainSVG />
      </motion.div>

      {/* ── Scroll cue ── */}
      <motion.div
        className="absolute z-50 bottom-7 left-1/2 -translate-x-1/2 pointer-events-none"
        animate={{ y: [0, 9, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="w-6 h-10 rounded-full flex items-start justify-center pt-1.5"
          style={{ border: "1.5px solid rgba(255,255,255,0.55)" }}
        >
          <div className="w-1 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.75)" }} />
        </div>
      </motion.div>

    </div>
  );
}
