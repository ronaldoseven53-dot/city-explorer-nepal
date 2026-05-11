"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Map, ExternalLink } from "lucide-react";
import type { Spot } from "@/data/destinations";
import TransitionLink from "./TransitionLink";

// ── Per-spot stat overrides ───────────────────────────────────────

type Diff = "Easy" | "Moderate" | "Hard";

const SPOT_STATS: Record<string, { distance: string; duration: string; difficulty: Diff; bestTime: string }> = {
  "everest-base-camp": { distance: "130 km",  duration: "12–14 days", difficulty: "Hard",     bestTime: "Oct – Dec" },
  "pokhara":           { distance: "200 km",  duration: "2–7 days",   difficulty: "Easy",     bestTime: "Oct – Apr" },
  "mustang":           { distance: "180 km",  duration: "8–14 days",  difficulty: "Hard",     bestTime: "Mar – Nov" },
  "chitwan":           { distance: "147 km",  duration: "2–5 days",   difficulty: "Easy",     bestTime: "Oct – Mar" },
  "kalinchowk":        { distance: "132 km",  duration: "1–2 days",   difficulty: "Moderate", bestTime: "Dec – Feb" },
};

const DIFF: Record<Diff, { color: string; bg: string; border: string }> = {
  Easy:     { color: "#4ade80", bg: "rgba(34,197,94,0.15)",  border: "rgba(34,197,94,0.35)"  },
  Moderate: { color: "#fbbf24", bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.35)" },
  Hard:     { color: "#f87171", bg: "rgba(239,68,68,0.15)",  border: "rgba(239,68,68,0.35)"  },
};

// High-res hero images per spot (taller composition, used in modal only)
const HERO_IMAGES: Record<string, string> = {
  "everest-base-camp":
    // Trekker + prayer flags + Himalayan peak — matches the reference image
    "https://images.unsplash.com/photo-1570641963303-92ce4845ed4c?w=1400&q=90",
};

// ── Stat card ─────────────────────────────────────────────────────

function GlassStat({ label, value, diff }: { label: string; value: string; diff?: Diff }) {
  const style = diff ? DIFF[diff] : null;
  return (
    <div style={{
      background:          style ? style.bg  : "rgba(255,255,255,0.07)",
      backdropFilter:      "blur(22px)",
      WebkitBackdropFilter:"blur(22px)",
      border:              `1px solid ${style ? style.border : "rgba(255,255,255,0.14)"}`,
      borderRadius:        16,
      padding:             "11px 8px",
      textAlign:           "center",
      flex:                "1 1 0",
      minWidth:            0,
    }}>
      <p style={{
        fontSize:     13,
        fontWeight:   800,
        color:        style ? style.color : "rgba(255,255,255,0.92)",
        lineHeight:   1.1,
        marginBottom: 5,
      }}>
        {value}
      </p>
      <p style={{
        fontSize:      8.5,
        color:         "rgba(255,255,255,0.40)",
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        fontWeight:    700,
      }}>
        {label}
      </p>
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────

interface Props {
  spots:     Spot[];
  activeIdx: number;
  accent:    string;
  onClose:   () => void;
  onChange:  (idx: number) => void;
}

export default function DestinationDetailModal({
  spots, activeIdx, accent, onClose, onChange,
}: Props) {
  const spot      = spots[activeIdx];
  const stats     = SPOT_STATS[spot.id] ?? null;
  const heroSrc   = HERO_IMAGES[spot.id] ?? spot.placeholderImage.replace("w=800", "w=1400");

  const touchStart = useRef({ x: 0, y: 0 });

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Keyboard: Esc closes, ← / → navigate
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft")  onChange(Math.max(0, activeIdx - 1));
      if (e.key === "ArrowRight") onChange(Math.min(spots.length - 1, activeIdx + 1));
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, onChange, activeIdx, spots.length]);

  const prev = useCallback(() => {
    if (activeIdx > 0) onChange(activeIdx - 1);
  }, [activeIdx, onChange]);

  const next = useCallback(() => {
    if (activeIdx < spots.length - 1) onChange(activeIdx + 1);
  }, [activeIdx, spots.length, onChange]);

  // Swipe: down → dismiss  |  left/right → navigate
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (dy > 90 && Math.abs(dy) > Math.abs(dx)) { onClose(); return; }
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next(); else prev();
    }
  };

  const glassBtn: React.CSSProperties = {
    background:          "rgba(4,8,22,0.62)",
    backdropFilter:      "blur(14px)",
    WebkitBackdropFilter:"blur(14px)",
    border:              "1px solid rgba(255,255,255,0.22)",
    boxShadow:           "0 2px 16px rgba(0,0,0,0.40)",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[9999] flex flex-col overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Background image — cross-fades per spot ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={spot.id + "-bg"}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.38 }}
        >
          <Image
            src={heroSrc}
            alt={spot.name}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          {/* Sky-clear top → strong dark reading area at bottom */}
          <div className="absolute inset-0" style={{
            background:
              "linear-gradient(to bottom, rgba(4,8,22,0.48) 0%, rgba(4,8,22,0.10) 28%, rgba(4,8,22,0.22) 50%, rgba(4,8,22,0.92) 68%, rgba(4,8,22,0.99) 100%)",
          }} />
          {/* Accent tint */}
          <div className="absolute inset-0" style={{
            background:   `linear-gradient(135deg, ${accent}20 0%, transparent 50%)`,
            mixBlendMode: "screen",
          }} />
        </motion.div>
      </AnimatePresence>

      {/* ── Top bar: counter + close ── */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-safe pt-4">
        <div style={{
          ...glassBtn,
          borderRadius: 9999,
          padding:      "5px 14px",
          color:        "rgba(255,255,255,0.72)",
          fontSize:     11,
          fontWeight:   700,
        }}>
          {activeIdx + 1} / {spots.length}
        </div>

        <button
          onClick={onClose}
          aria-label="Close"
          className="flex items-center justify-center cursor-pointer"
          style={{ ...glassBtn, width: 44, height: 44, borderRadius: "50%" }}
        >
          <X size={20} color="white" strokeWidth={2.2} />
        </button>
      </div>

      {/* ── Desktop nav arrows — hidden on mobile ── */}
      {activeIdx > 0 && (
        <button
          onClick={prev}
          aria-label="Previous destination"
          className="hidden sm:flex absolute left-5 top-1/2 -translate-y-1/2 z-20 items-center justify-center cursor-pointer"
          style={{ ...glassBtn, width: 50, height: 50, borderRadius: "50%" }}
        >
          <ChevronLeft size={22} color="white" strokeWidth={2} />
        </button>
      )}
      {activeIdx < spots.length - 1 && (
        <button
          onClick={next}
          aria-label="Next destination"
          className="hidden sm:flex absolute right-5 top-1/2 -translate-y-1/2 z-20 items-center justify-center cursor-pointer"
          style={{ ...glassBtn, width: 50, height: 50, borderRadius: "50%" }}
        >
          <ChevronRight size={22} color="white" strokeWidth={2} />
        </button>
      )}

      {/* ── Content panel (slides up per spot) ── */}
      <div className="relative z-10 mt-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={spot.id + "-content"}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            style={{ padding: "0 20px 24px" }}
          >
            {/* Category badge + region */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
              <span style={{
                background:    `${accent}28`,
                border:        `1px solid ${accent}65`,
                borderRadius:  9999,
                padding:       "3px 12px",
                color:         accent,
                fontSize:      10,
                fontWeight:    700,
                letterSpacing: "0.10em",
              }}>
                🧗 ADVENTURE
              </span>
              <span style={{ color: "rgba(255,255,255,0.48)", fontSize: 11 }}>
                📍 {spot.region}
              </span>
            </div>

            {/* Destination name */}
            <h2 style={{
              color:         "#fff",
              fontWeight:    900,
              fontSize:      "clamp(1.9rem, 6vw, 2.8rem)",
              letterSpacing: "-0.026em",
              lineHeight:    1.05,
              marginBottom:  spot.elevation ? 4 : 16,
            }}>
              {spot.name}
            </h2>

            {/* Elevation */}
            {spot.elevation && (
              <p style={{ color: accent, fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
                ⛰ {spot.elevation}
              </p>
            )}

            {/* Glassmorphism stat row */}
            {stats && (
              <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
                <GlassStat label="Distance"   value={stats.distance} />
                <GlassStat label="Duration"   value={stats.duration} />
                <GlassStat label="Difficulty" value={stats.difficulty} diff={stats.difficulty} />
                <GlassStat label="Best Time"  value={stats.bestTime} />
              </div>
            )}

            {/* 2 top highlights */}
            <div style={{ marginBottom: 20 }}>
              {spot.highlights.slice(0, 2).map((h) => (
                <div key={h} style={{
                  display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6,
                }}>
                  <span style={{ color: accent, fontSize: 9, flexShrink: 0, marginTop: 3 }}>✦</span>
                  <span style={{ color: "rgba(255,255,255,0.70)", fontSize: 13, lineHeight: 1.5 }}>{h}</span>
                </div>
              ))}
            </div>

            {/* CTA row */}
            <div style={{ display: "flex", gap: 10 }}>
              {/* Primary: brand red gradient */}
              <TransitionLink
                href={`/destinations/${spot.id}`}
                className="flex items-center justify-center gap-2 font-bold cursor-pointer transition-opacity hover:opacity-90"
                style={{
                  flex:       1,
                  background: "linear-gradient(135deg, #dc2626 0%, #e11d48 100%)",
                  boxShadow:  "0 0 30px rgba(220,38,38,0.45), inset 0 1px 0 rgba(255,255,255,0.14)",
                  borderRadius: 14,
                  padding:    "14px 20px",
                  color:      "#fff",
                  fontSize:   14,
                } as React.CSSProperties}
              >
                View Full Guide
                <ExternalLink size={14} strokeWidth={2.5} />
              </TransitionLink>

              {/* Secondary: glass "Plan Trip" */}
              <button
                onClick={() =>
                  document.dispatchEvent(new CustomEvent("open-ai-planner"))
                }
                className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80 flex-shrink-0"
                style={{
                  background:          "rgba(255,255,255,0.09)",
                  backdropFilter:      "blur(16px)",
                  WebkitBackdropFilter:"blur(16px)",
                  border:              "1px solid rgba(255,255,255,0.20)",
                  borderRadius:        14,
                  padding:             "14px 18px",
                  color:               "#fff",
                  fontSize:            13,
                  fontWeight:          700,
                }}
              >
                <Map size={14} strokeWidth={2} />
                Plan Trip
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dot indicator strip */}
        <div className="flex items-center justify-center gap-2 pb-safe pb-4 -mt-1">
          {spots.map((_, i) => (
            <button
              key={i}
              onClick={() => onChange(i)}
              aria-label={`Go to destination ${i + 1}`}
              className="cursor-pointer flex-shrink-0 transition-all"
              style={{
                width:      i === activeIdx ? 22 : 6,
                height:     6,
                borderRadius: 9999,
                background: i === activeIdx ? accent : "rgba(255,255,255,0.28)",
                boxShadow:  i === activeIdx ? `0 0 8px ${accent}90` : "none",
                transition: "width 0.25s ease",
              }}
            />
          ))}
        </div>
      </div>

      {/* Mobile swipe hint — fades out after appearing once */}
      <motion.p
        className="sm:hidden absolute bottom-[calc(env(safe-area-inset-bottom,0px)+82px)] inset-x-0 text-center pointer-events-none z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.55, 0.55, 0] }}
        transition={{ delay: 1.0, duration: 2.4, times: [0, 0.15, 0.75, 1] }}
        style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, fontWeight: 600, letterSpacing: "0.07em" }}
      >
        ↕ swipe down to close · ↔ swipe to navigate
      </motion.p>
    </motion.div>
  );
}
