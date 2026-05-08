"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

// ── Types & data ───────────────────────────────────────────────────────

type IconType = "sun" | "partly-cloudy" | "hazy" | "snow";

interface CityData {
  id: string;
  name: string;
  temp: number;
  condition: string;
  icon: IconType;
  iconGlow: string;
  bestSeason: string;
  currentSeason: string;
  seasonColor: string;
  visibility: string;
  skyCondition: string;
  visibilityScore: number;
}

const CITIES: CityData[] = [
  {
    id: "kathmandu",
    name: "Kathmandu",
    temp: 23,
    condition: "Partly Cloudy",
    icon: "partly-cloudy",
    iconGlow: "drop-shadow(0 6px 16px rgba(100,160,240,0.40))",
    bestSeason: "Mar – May",
    currentSeason: "Spring",
    seasonColor: "#22C55E",
    visibility: "Excellent",
    skyCondition: "Clear Skies",
    visibilityScore: 0.88,
  },
  {
    id: "pokhara",
    name: "Pokhara",
    temp: 26,
    condition: "Mostly Sunny",
    icon: "sun",
    iconGlow: "drop-shadow(0 6px 18px rgba(255,165,0,0.48))",
    bestSeason: "Oct – Dec",
    currentSeason: "Pre-Monsoon",
    seasonColor: "#3B82F6",
    visibility: "Good",
    skyCondition: "Lakeside View",
    visibilityScore: 0.70,
  },
  {
    id: "chitwan",
    name: "Chitwan",
    temp: 31,
    condition: "Hazy & Warm",
    icon: "hazy",
    iconGlow: "drop-shadow(0 6px 14px rgba(255,160,80,0.38))",
    bestSeason: "Nov – Mar",
    currentSeason: "Pre-Monsoon",
    seasonColor: "#F59E0B",
    visibility: "Moderate",
    skyCondition: "Low Haze",
    visibilityScore: 0.46,
  },
  {
    id: "lumbini",
    name: "Lumbini",
    temp: 33,
    condition: "Clear & Hot",
    icon: "sun",
    iconGlow: "drop-shadow(0 6px 18px rgba(255,140,0,0.50))",
    bestSeason: "Nov – Feb",
    currentSeason: "Hot Season",
    seasonColor: "#EF4444",
    visibility: "Good",
    skyCondition: "Open Sky",
    visibilityScore: 0.72,
  },
  {
    id: "namche",
    name: "Namche Bazaar",
    temp: 8,
    condition: "Mountain Snow",
    icon: "snow",
    iconGlow: "drop-shadow(0 6px 16px rgba(100,160,230,0.55))",
    bestSeason: "Apr – May",
    currentSeason: "Spring Trek",
    seasonColor: "#8B5CF6",
    visibility: "Crystal Clear",
    skyCondition: "Summit Views",
    visibilityScore: 1.0,
  },
];

// ── SVG Weather Icons ──────────────────────────────────────────────────

function SunIcon() {
  return (
    <svg width="58" height="58" viewBox="0 0 58 58" fill="none">
      <defs>
        <radialGradient id="li-sg-core" cx="42%" cy="30%" r="58%">
          <stop offset="0%" stopColor="#FFF9C4" />
          <stop offset="35%" stopColor="#FFD600" />
          <stop offset="100%" stopColor="#FF8C00" />
        </radialGradient>
        <radialGradient id="li-sg-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD600" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#FF6B00" stopOpacity="0" />
        </radialGradient>
        <filter id="li-sg-blur"><feGaussianBlur stdDeviation="3.5" /></filter>
      </defs>
      <circle cx="29" cy="29" r="25" fill="url(#li-sg-halo)" filter="url(#li-sg-blur)" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * 45 * Math.PI) / 180;
        return (
          <line key={i}
            x1={29 + Math.cos(a) * 17} y1={29 + Math.sin(a) * 17}
            x2={29 + Math.cos(a) * 25} y2={29 + Math.sin(a) * 25}
            stroke="#FFB300" strokeWidth="2.6" strokeLinecap="round"
          />
        );
      })}
      <circle cx="29" cy="29" r="13.5" fill="url(#li-sg-core)" />
      <ellipse cx="24" cy="23" rx="4.5" ry="2.8" fill="rgba(255,255,255,0.52)" />
    </svg>
  );
}

function PartlyCloudyIcon() {
  return (
    <svg width="62" height="58" viewBox="0 0 62 58" fill="none">
      <defs>
        <radialGradient id="li-pc-sun" cx="42%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#FFF9C4" />
          <stop offset="40%" stopColor="#FFD600" />
          <stop offset="100%" stopColor="#FFA500" />
        </radialGradient>
        <linearGradient id="li-pc-cloud" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#C8DCEE" />
        </linearGradient>
        <filter id="li-pc-shadow">
          <feDropShadow dx="0" dy="2.5" stdDeviation="3.5" floodColor="#7AAACE" floodOpacity="0.45" />
        </filter>
      </defs>
      <circle cx="20" cy="23" r="12" fill="url(#li-pc-sun)" opacity="0.95" />
      {[315, 0, 45].map((deg, i) => {
        const a = (deg * Math.PI) / 180;
        return (
          <line key={i}
            x1={20 + Math.cos(a) * 14} y1={23 + Math.sin(a) * 14}
            x2={20 + Math.cos(a) * 20} y2={23 + Math.sin(a) * 20}
            stroke="#FFB300" strokeWidth="2.2" strokeLinecap="round"
          />
        );
      })}
      <ellipse cx="16" cy="17.5" rx="3.5" ry="2.2" fill="rgba(255,255,255,0.55)" />
      <g filter="url(#li-pc-shadow)">
        <circle cx="22" cy="42" r="9.5" fill="url(#li-pc-cloud)" />
        <circle cx="34" cy="39" r="11" fill="url(#li-pc-cloud)" />
        <circle cx="46" cy="42" r="8.5" fill="url(#li-pc-cloud)" />
        <rect x="12.5" y="41.5" width="42" height="9.5" fill="url(#li-pc-cloud)" />
      </g>
      <ellipse cx="34" cy="32" rx="9.5" ry="3" fill="rgba(255,255,255,0.58)" />
    </svg>
  );
}

function HazyIcon() {
  return (
    <svg width="58" height="58" viewBox="0 0 58 58" fill="none">
      <defs>
        <radialGradient id="li-hz-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF0B0" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#FFB347" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#FF8C00" stopOpacity="0.15" />
        </radialGradient>
        <filter id="li-hz-blur"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>
      <circle cx="29" cy="22" r="17" fill="url(#li-hz-sun)" filter="url(#li-hz-blur)" />
      <circle cx="29" cy="22" r="10" fill="#FFD060" opacity="0.55" />
      {[34, 41, 48, 54].map((y, i) => (
        <rect key={i} x={7 + i * 2} y={y - 1.5} width={44 - i * 4} height="3.5" rx="1.75"
          fill={`rgba(190,210,230,${0.55 - i * 0.09})`}
        />
      ))}
    </svg>
  );
}

function SnowIcon() {
  return (
    <svg width="62" height="62" viewBox="0 0 62 62" fill="none">
      <defs>
        <linearGradient id="li-sn-cloud" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#AABDD8" />
          <stop offset="100%" stopColor="#7898BC" />
        </linearGradient>
        <filter id="li-sn-shadow">
          <feDropShadow dx="0" dy="2.5" stdDeviation="3.5" floodColor="#4466AA" floodOpacity="0.40" />
        </filter>
      </defs>
      <g filter="url(#li-sn-shadow)">
        <circle cx="18" cy="35" r="9.5" fill="url(#li-sn-cloud)" />
        <circle cx="29" cy="31" r="11.5" fill="url(#li-sn-cloud)" />
        <circle cx="42" cy="35" r="9" fill="url(#li-sn-cloud)" />
        <rect x="8.5" y="34.5" width="45" height="10" fill="url(#li-sn-cloud)" />
      </g>
      {[[16, 51], [29, 57], [42, 51], [22, 58], [36, 58]].map(([cx, cy], i) => (
        <g key={i} opacity={i > 2 ? 0.60 : 0.92}>
          <line x1={cx} y1={cy - 5.5} x2={cx} y2={cy + 5.5} stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <line x1={cx - 5.5} y1={cy} x2={cx + 5.5} y2={cy} stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <line x1={cx - 3.5} y1={cy - 3.5} x2={cx + 3.5} y2={cy + 3.5} stroke="white" strokeWidth="1.1" strokeLinecap="round" />
          <line x1={cx + 3.5} y1={cy - 3.5} x2={cx - 3.5} y2={cy + 3.5} stroke="white" strokeWidth="1.1" strokeLinecap="round" />
          <circle cx={cx} cy={cy} r="1.8" fill="white" />
        </g>
      ))}
    </svg>
  );
}

function WeatherIcon({ type }: { type: IconType }) {
  if (type === "sun")           return <SunIcon />;
  if (type === "partly-cloudy") return <PartlyCloudyIcon />;
  if (type === "hazy")          return <HazyIcon />;
  if (type === "snow")          return <SnowIcon />;
  return <SunIcon />;
}

// ── Transition variants ────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    y: dir * 20,
    filter: "blur(4px)",
  }),
  center: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 340, damping: 28 },
  },
  exit: (dir: number) => ({
    opacity: 0,
    y: dir * -14,
    filter: "blur(2px)",
    transition: { duration: 0.16, ease: "easeIn" as const },
  }),
};

// ── Component ──────────────────────────────────────────────────────────

export default function LiveInsights({ isDark }: { isDark: boolean }) {
  const [cityIdx, setCityIdx] = useState(0);
  const [dir, setDir]         = useState(1);
  const [open, setOpen]       = useState(false);
  const dropRef               = useRef<HTMLDivElement>(null);

  const city = CITIES[cityIdx];

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const pick = (i: number) => {
    if (i === cityIdx) { setOpen(false); return; }
    setDir(i > cityIdx ? 1 : -1);
    setCityIdx(i);
    setOpen(false);
  };

  const textPrimary   = isDark ? "#ffffff"              : "#0a0a14";
  const textSecondary = isDark ? "rgba(255,255,255,0.50)" : "rgba(0,0,0,0.50)";
  const textMuted     = isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.38)";
  const trackBg       = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)";

  const INNER_CARD: React.CSSProperties = {
    background: isDark ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.028)",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.065)"}`,
    borderRadius: 18,
    padding: "18px 16px 16px",
  };

  return (
    <div className="relative p-5 sm:p-7 flex flex-col gap-5 h-full">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3">

        {/* City selector */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-1"
            style={{ color: textMuted }}>
            Right Now In
          </p>
          <div ref={dropRef} className="relative">

            <button onClick={() => setOpen(v => !v)}
              className="flex items-center gap-1.5 cursor-pointer group"
            >
              <span className="text-[26px] font-extrabold tracking-tight leading-none"
                style={{ color: textPrimary }}>
                {city.name}
              </span>
              <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.22 }}>
                <ChevronDown size={18} style={{ color: textSecondary }}
                  className="mt-1 group-hover:opacity-90 transition-opacity" />
              </motion.span>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0,  scale: 1    }}
                  exit={  { opacity: 0, y: -6, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 420, damping: 28 }}
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: 0,
                    zIndex: 200,
                    background: isDark ? "rgba(8,12,28,0.96)" : "rgba(252,252,255,0.97)",
                    backdropFilter: "blur(28px)",
                    WebkitBackdropFilter: "blur(28px)",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.09)"}`,
                    borderRadius: 16,
                    overflow: "hidden",
                    minWidth: 210,
                    boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
                  }}
                >
                  {CITIES.map((c, i) => (
                    <button key={c.id} onClick={() => pick(i)}
                      className="w-full flex items-center justify-between px-4 py-2.5 transition-colors duration-100"
                      style={{
                        background: i === cityIdx
                          ? isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.055)"
                          : "transparent",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background =
                          isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background =
                          i === cityIdx
                            ? isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.055)"
                            : "transparent";
                      }}
                    >
                      <span style={{
                        fontSize: 13,
                        fontWeight: i === cityIdx ? 700 : 500,
                        color: i === cityIdx ? textPrimary : textSecondary,
                      }}>{c.name}</span>
                      <span style={{ fontSize: 11, color: textMuted, marginLeft: 12 }}>
                        {c.temp}°C
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Live badge */}
        <div className="flex items-center gap-1.5 flex-shrink-0 mt-1.5"
          style={{
            background: "rgba(34,197,94,0.10)",
            border: "1px solid rgba(34,197,94,0.28)",
            borderRadius: 9999,
            padding: "5px 12px",
          }}
        >
          <div className="relative w-2 h-2 flex-shrink-0">
            <motion.span className="absolute inset-0 rounded-full bg-green-400"
              animate={{ scale: [1, 2.4, 1], opacity: [0.55, 0, 0.55] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
            />
            <span className="absolute inset-0 rounded-full bg-green-400"
              style={{ boxShadow: "0 0 7px rgba(34,197,94,0.90)" }} />
          </div>
          <span style={{ color: "#4ADE80", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em" }}>
            Live
          </span>
        </div>
      </div>

      {/* ── Three info cards ── */}
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={city.id}
          custom={dir}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          style={{ willChange: "transform, opacity" }}
        >

          {/* Card 1 — Weather */}
          <div style={INNER_CARD}>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3.5"
              style={{ color: "#FB923C" }}>
              ☁ Weather
            </p>
            <div className="flex items-end justify-between gap-2">
              <div>
                <p className="text-[40px] font-black tracking-tight leading-none"
                  style={{ color: textPrimary }}>
                  {city.temp}
                  <span className="text-xl font-semibold ml-0.5" style={{ color: textSecondary }}>°C</span>
                </p>
                <p className="mt-2 text-[12px] font-medium" style={{ color: textSecondary }}>
                  {city.condition}
                </p>
              </div>

              {/* Floating icon */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                className="flex-shrink-0 -mb-1"
                style={{ filter: city.iconGlow, willChange: "transform" }}
              >
                <WeatherIcon type={city.icon} />
              </motion.div>
            </div>
          </div>

          {/* Card 2 — Season */}
          <div style={INNER_CARD}>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3.5"
              style={{ color: city.seasonColor }}>
              🌿 Season
            </p>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                style={{
                  background: `${city.seasonColor}1C`,
                  border: `1px solid ${city.seasonColor}45`,
                  color: city.seasonColor,
                }}>
                {city.currentSeason}
              </span>
            </div>
            <p className="text-[19px] font-extrabold tracking-tight leading-none"
              style={{ color: textPrimary }}>
              {city.bestSeason}
            </p>
            <p className="text-[11px] mt-1.5" style={{ color: textMuted }}>
              Best travel window
            </p>
          </div>

          {/* Card 3 — Visibility */}
          <div style={INNER_CARD}>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3.5"
              style={{ color: "#60A5FA" }}>
              👁 Visibility
            </p>
            <p className="text-[22px] font-extrabold tracking-tight leading-none"
              style={{ color: textPrimary }}>
              {city.visibility}
            </p>
            <p className="text-[12px] mt-1.5 font-medium" style={{ color: textSecondary }}>
              {city.skyCondition}
            </p>
            {/* Score bar */}
            <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ background: trackBg }}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #3B82F6 0%, #60A5FA 60%, #93C5FD 100%)",
                  transformOrigin: "left",
                  willChange: "transform",
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: city.visibilityScore }}
                transition={{ type: "spring", stiffness: 200, damping: 26, delay: 0.08 }}
              />
            </div>
          </div>

        </motion.div>
      </AnimatePresence>

    </div>
  );
}
