"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

// ── Static city config ────────────────────────────────────────────────────

interface CityConfig {
  id: string;
  name: string;
  bestSeason: string;
  currentSeason: string;
  seasonColor: string;
}

const CITIES: CityConfig[] = [
  { id: "kathmandu", name: "Kathmandu",     bestSeason: "Mar – May",  currentSeason: "Spring",       seasonColor: "#22C55E" },
  { id: "pokhara",   name: "Pokhara",       bestSeason: "Oct – Dec",  currentSeason: "Pre-Monsoon",  seasonColor: "#3B82F6" },
  { id: "chitwan",   name: "Chitwan",       bestSeason: "Nov – Mar",  currentSeason: "Pre-Monsoon",  seasonColor: "#F59E0B" },
  { id: "lumbini",   name: "Lumbini",       bestSeason: "Nov – Feb",  currentSeason: "Hot Season",   seasonColor: "#EF4444" },
  { id: "namche",    name: "Namche Bazaar", bestSeason: "Apr – May",  currentSeason: "Spring Trek",  seasonColor: "#8B5CF6" },
];

// ── Weather API shape ─────────────────────────────────────────────────────

type IconType = "sun" | "partly-cloudy" | "hazy" | "snow" | "rain";

interface WeatherData {
  temp:            number;
  condition:       string;
  icon:            IconType;
  visibilityLabel: string;
  visibilityScore: number;
  skyCondition:    string;
}

// ── Slide variants ────────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, y: dir * 18, filter: "blur(4px)" }),
  center: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 340, damping: 28 },
  },
  exit: (dir: number) => ({
    opacity: 0, y: dir * -12, filter: "blur(2px)",
    transition: { duration: 0.16, ease: "easeIn" as const },
  }),
};

// ── Component ─────────────────────────────────────────────────────────────

export default function LiveInsights({ isDark }: { isDark: boolean }) {
  const [cityIdx, setCityIdx] = useState(0);
  const [dir, setDir]         = useState(1);
  const [open, setOpen]       = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
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

  const fetchWeather = useCallback((id: string) => {
    const ctrl = new AbortController();
    setLoading(true);

    fetch(`/api/weather?city=${id}`, { signal: ctrl.signal })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return d;
      })
      .then((d) => { setWeather(d as WeatherData); setLoading(false); })
      .catch((e) => {
        if (e.name !== "AbortError") {
          setWeather({ temp: 24, condition: "Partly Cloudy", icon: "partly-cloudy", visibilityLabel: "Good", visibilityScore: 0.70, skyCondition: "Overcast" });
          setLoading(false);
        }
      });

    return () => ctrl.abort();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    return fetchWeather(city.id);
  }, [city.id, fetchWeather]);

  const pick = (i: number) => {
    if (i === cityIdx) { setOpen(false); return; }
    setDir(i > cityIdx ? 1 : -1);
    setCityIdx(i);
    setOpen(false);
  };

  // Theme tokens
  const textPrimary   = isDark ? "#ffffff"                : "#0a0a14";
  const textSecondary = isDark ? "rgba(255,255,255,0.50)" : "rgba(0,0,0,0.50)";
  const textMuted     = isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.38)";

  const INNER_CARD: React.CSSProperties = {
    background: isDark ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.028)",
    border:     `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.065)"}`,
    borderRadius: 18,
    padding:    "18px 16px 16px",
  };

  // CSS variables forwarded to mobile unified-card stylesheet
  const cssVars = {
    ["--li-unified-bg" as string]:     isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
    ["--li-unified-border" as string]: isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.09)",
    ["--li-divider" as string]:        isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
  } as React.CSSProperties;

  return (
    <div className="relative px-5 pt-6 pb-5 sm:px-7 sm:pt-7 flex flex-col gap-5 h-full">

      {/* ── Header — centred city selector ── */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: textMuted }}>
          Right Now In
        </p>

        <div ref={dropRef} className="relative flex justify-center">
          <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-1.5 cursor-pointer group">
            <span className="text-[26px] font-extrabold tracking-tight leading-none" style={{ color: textPrimary }}>
              {city.name}
            </span>
            <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.22 }}>
              <ChevronDown size={18} style={{ color: textSecondary }} className="mt-1 group-hover:opacity-90 transition-opacity" />
            </motion.span>
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0,  scale: 1    }}
                exit={  { opacity: 0, y: -6, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 420, damping: 28 }}
                style={{
                  position: "absolute", top: "calc(100% + 8px)",
                  left: "50%", transform: "translateX(-50%)",
                  zIndex: 200,
                  background: isDark ? "rgba(8,12,28,0.96)" : "rgba(252,252,255,0.97)",
                  backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.09)"}`,
                  borderRadius: 16, overflow: "hidden", minWidth: 210,
                  boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
                }}
              >
                {CITIES.map((c, i) => (
                  <button key={c.id} onClick={() => pick(i)}
                    className="w-full flex items-center justify-between px-4 py-2.5 transition-colors duration-100"
                    style={{ background: i === cityIdx ? (isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.055)") : "transparent" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = i === cityIdx ? (isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.055)") : "transparent"; }}
                  >
                    <span style={{ fontSize: 13, fontWeight: i === cityIdx ? 700 : 500, color: i === cityIdx ? textPrimary : textSecondary }}>
                      {c.name}
                    </span>
                    <span style={{ fontSize: 11, color: textMuted, marginLeft: 12 }}>
                      {c.bestSeason}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Data columns (animated on city change) ── */}
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={city.id}
          custom={dir}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="li-cards-row"
          style={{ willChange: "transform, opacity", ...cssVars }}
        >

          {/* ── Col 1: Weather — temp + condition, no icon ── */}
          <div className="li-card" style={INNER_CARD}>
            <p className="li-label" style={{ color: "#FB923C" }}>Weather</p>

            {loading ? (
              <div className="flex flex-col items-center gap-2 mt-1">
                <div className="w-8 h-8 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.08)" }} />
                <div className="w-16 h-3 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
              </div>
            ) : (
              <div className="flex flex-col items-center text-center gap-1 mt-1">
                <p className="font-black tracking-tight leading-none li-temp" style={{ color: textPrimary }}>
                  {weather!.temp}
                  <span className="li-deg" style={{ color: textSecondary }}>°C</span>
                </p>
                <p className="li-sub" style={{ color: textSecondary }}>
                  {weather!.condition}
                </p>
              </div>
            )}
          </div>

          {/* ── Col 2: Season — name + window, no pill ── */}
          <div className="li-card" style={INNER_CARD}>
            <p className="li-label" style={{ color: city.seasonColor }}>Season</p>
            <div className="flex flex-col gap-0.5 mt-1">
              <p className="li-season-title font-extrabold tracking-tight leading-none" style={{ color: textPrimary }}>
                {city.currentSeason}
              </p>
              <p className="li-season-window font-bold" style={{ color: city.seasonColor }}>
                {city.bestSeason}
              </p>
              <p className="li-sub mt-0.5" style={{ color: textMuted }}>Best window</p>
            </div>
          </div>

          {/* ── Col 3: Visibility — label + condition, no bar ── */}
          <div className="li-card" style={INNER_CARD}>
            <p className="li-label" style={{ color: "#60A5FA" }}>Visibility</p>

            {loading ? (
              <div className="flex flex-col gap-2 mt-1">
                <div className="w-12 h-4 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.08)" }} />
                <div className="w-16 h-3 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
              </div>
            ) : (
              <div className="flex flex-col gap-0.5 mt-1">
                <p className="li-vis-label font-extrabold tracking-tight leading-none" style={{ color: textPrimary }}>
                  {weather!.visibilityLabel}
                </p>
                <p className="li-sub" style={{ color: textSecondary }}>
                  {weather!.skyCondition}
                </p>
              </div>
            )}
          </div>

        </motion.div>
      </AnimatePresence>

      <style>{`
        /* ── Label: WEATHER / SEASON / VISIBILITY ── */
        .li-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          margin-bottom: 0;
        }

        /* ── Desktop: 3 separate glass cards ── */
        .li-cards-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        /* Desktop type scale */
        .li-temp        { font-size: 42px; }
        .li-deg         { font-size: 20px; font-weight: 600; margin-left: 2px; }
        .li-sub         { font-size: 12px; font-weight: 500; }
        .li-season-title  { font-size: 19px; }
        .li-season-window { font-size: 15px; }
        .li-vis-label   { font-size: 22px; }

        /* ── Mobile: single unified glassmorphism card ── */
        @media (max-width: 639px) {
          .li-cards-row {
            display: flex;
            gap: 0;
            overflow: visible;
            background:           var(--li-unified-bg);
            backdrop-filter:      blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border:               1px solid var(--li-unified-border);
            border-radius:        20px;
          }

          .li-card {
            flex: 1;
            border-radius: 0 !important;
            background:    transparent !important;
            border:        none !important;
            border-right:  1px solid var(--li-divider) !important;
            padding:       14px 8px 14px !important;
            display:       flex;
            flex-direction: column;
            align-items:   center;
            text-align:    center;
          }
          .li-card:last-child { border-right: none !important; }

          /* Mobile type scale — scaled down to fit 3 equal columns */
          .li-temp          { font-size: 26px !important; }
          .li-deg           { font-size: 14px !important; }
          .li-sub           { font-size: 10px !important; }
          .li-season-title  { font-size: 13px !important; }
          .li-season-window { font-size: 12px !important; }
          .li-vis-label     { font-size: 15px !important; }
          .li-label         { font-size: 9px !important; letter-spacing: 0.14em !important; margin-bottom: 6px !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          .li-cards-row { animation: none; }
        }
      `}</style>

    </div>
  );
}
