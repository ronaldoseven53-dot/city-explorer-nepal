"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { Heart, ArrowRight, MapPin } from "lucide-react";
import TransitionLink from "./TransitionLink";

// Participates in the parent BentoDashboard stagger
const variants = {
  hidden:  { opacity: 0, scale: 0.96, y: 16 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 20 },
  },
};

// EBC trekker + prayer flags panoramic hero
const EBC_HERO = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=90";

const STATS: { label: string; value: string; accent?: boolean }[] = [
  { label: "Distance",   value: "130 km"     },
  { label: "Duration",   value: "12–14 Days" },
  { label: "Difficulty", value: "Hard", accent: true },
  { label: "Best Time",  value: "Oct – Dec"  },
];

export default function FeaturedAdventureCard() {
  const [saved, setSaved] = useState(false);

  return (
    // Spans full grid width; participates in parent stagger via variants
    <motion.div
      variants={variants}
      className="lg:col-span-3 sm:col-span-2 relative rounded-[24px] overflow-hidden"
      style={{ height: "clamp(300px, 38vw, 320px)" }}
    >
      {/* ── Background image ── */}
      <Image
        src={EBC_HERO}
        alt="Everest Base Camp trek"
        fill
        priority={false}
        className="object-cover object-center"
        sizes="(max-width:1280px) 100vw, 1280px"
      />

      {/*
        Desktop: left-to-right dark → transparent so trekker shows on right.
        Mobile: bottom-to-top dark → transparent so stats/title don't overlap
        the mountain composition above.
      */}
      <div className="absolute inset-0 hidden sm:block" style={{
        background:
          "linear-gradient(105deg, rgba(4,8,22,0.97) 0%, rgba(4,8,22,0.88) 28%, rgba(4,8,22,0.55) 50%, rgba(4,8,22,0.08) 70%, transparent 85%)",
      }} />
      <div className="absolute inset-0 sm:hidden" style={{
        background:
          "linear-gradient(to top, rgba(4,8,22,0.99) 0%, rgba(4,8,22,0.88) 38%, rgba(4,8,22,0.45) 62%, transparent 90%)",
      }} />

      {/* ── Heart / save toggle (top-right, 44 px hit target) ── */}
      <motion.button
        onClick={() => setSaved((v) => !v)}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.88 }}
        aria-label={saved ? "Remove from favourites" : "Save to favourites"}
        className="absolute top-4 right-4 z-10 flex items-center justify-center cursor-pointer"
        style={{
          width:               44,
          height:              44,
          borderRadius:        "50%",
          background:          saved ? "rgba(239,68,68,0.28)" : "rgba(255,255,255,0.10)",
          backdropFilter:      "blur(12px)",
          WebkitBackdropFilter:"blur(12px)",
          border:              saved
            ? "1px solid rgba(239,68,68,0.55)"
            : "1px solid rgba(255,255,255,0.22)",
          transition:          "background 0.2s ease, border-color 0.2s ease",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={saved ? "filled" : "outline"}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1,   opacity: 1 }}
            exit={{    scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ display: "flex" }}
          >
            <Heart
              size={18}
              fill={saved ? "#ef4444" : "none"}
              color={saved ? "#ef4444" : "rgba(255,255,255,0.80)"}
              strokeWidth={2}
            />
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {/* ── Saved confirmation badge ── */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="absolute top-4 right-[62px] z-10 flex items-center gap-1.5"
            style={{
              background:          "rgba(239,68,68,0.22)",
              backdropFilter:      "blur(10px)",
              WebkitBackdropFilter:"blur(10px)",
              border:              "1px solid rgba(239,68,68,0.40)",
              borderRadius:        9999,
              padding:             "5px 12px",
              color:               "#f87171",
              fontSize:            11,
              fontWeight:          700,
              whiteSpace:          "nowrap",
            }}
          >
            ♥ Saved
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Content zone ── */}
      <div className="absolute inset-0 flex flex-col justify-end sm:justify-center p-6 sm:p-8 lg:p-10">
        <div className="sm:max-w-[54%]">

          {/* Category chip */}
          <span style={{
            display:       "inline-flex",
            alignItems:    "center",
            gap:           5,
            background:    "rgba(239,68,68,0.20)",
            border:        "1px solid rgba(239,68,68,0.45)",
            borderRadius:  9999,
            padding:       "3px 12px",
            color:         "#f87171",
            fontSize:      9.5,
            fontWeight:    700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom:  12,
          }}>
            🧗 Featured Adventure
          </span>

          {/* Title */}
          <h2 style={{
            color:         "#fff",
            fontWeight:    900,
            fontSize:      "clamp(1.55rem, 3.5vw, 2.2rem)",
            letterSpacing: "-0.026em",
            lineHeight:    1.08,
            marginBottom:  6,
          }}>
            Everest Base Camp
          </h2>

          {/* Location */}
          <p className="flex items-center gap-1.5" style={{
            color: "rgba(255,255,255,0.50)", fontSize: 12, fontWeight: 500, marginBottom: 18,
          }}>
            <MapPin size={11} strokeWidth={2} />
            Solukhumbu · 5,364 m
          </p>

          {/* Glassmorphism stat chips — 2-col on mobile, 4-col on sm+ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
            {STATS.map(({ label, value, accent }) => (
              <div
                key={label}
                style={{
                  background:          accent
                    ? "rgba(239,68,68,0.14)"
                    : "rgba(255,255,255,0.08)",
                  backdropFilter:      "blur(10px)",
                  WebkitBackdropFilter:"blur(10px)",
                  border:              accent
                    ? "1px solid rgba(239,68,68,0.38)"
                    : "1px solid rgba(255,255,255,0.15)",
                  borderRadius:        12,
                  padding:             "9px 12px",
                }}
              >
                <p style={{
                  color:        accent ? "#f87171" : "rgba(255,255,255,0.92)",
                  fontSize:     14,
                  fontWeight:   800,
                  lineHeight:   1.1,
                  marginBottom: 3,
                }}>
                  {value}
                </p>
                <p style={{
                  color:         "rgba(255,255,255,0.42)",
                  fontSize:      8.5,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  fontWeight:    700,
                }}>
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* View Details — red → orange gradient CTA */}
          <TransitionLink
            href="/explore/adventure"
            className="inline-flex items-center gap-2 font-bold cursor-pointer transition-opacity hover:opacity-90"
            style={{
              background:  "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
              boxShadow:   "0 0 28px rgba(220,38,38,0.45), 0 0 60px rgba(234,88,12,0.12), inset 0 1px 0 rgba(255,255,255,0.14)",
              borderRadius: 14,
              padding:     "11px 22px",
              color:       "#fff",
              fontSize:    14,
            } as React.CSSProperties}
          >
            View Details
            <ArrowRight size={15} strokeWidth={2.5} />
          </TransitionLink>

        </div>
      </div>
    </motion.div>
  );
}
