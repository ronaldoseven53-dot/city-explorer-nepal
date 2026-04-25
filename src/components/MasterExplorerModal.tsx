"use client";

import { useMemo } from "react";
import { useUserPassport } from "@/context/UserPassportContext";

// ── Confetti config ───────────────────────────────────────────────

const COLORS = [
  "#FF3333", "#FFD700", "#3B82F6", "#22C55E",
  "#F97316", "#A855F7", "#EC4899", "#FFFFFF",
  "#DC2626", "#FBBF24",
];
const ANIMATIONS = ["confetti-a", "confetti-b", "confetti-c"] as const;
const COUNT = 60;

interface Piece {
  id: number;
  left: string;
  width: number;
  height: number;
  color: string;
  animation: string;
  duration: string;
  delay: string;
  borderRadius: string;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function generatePieces(): Piece[] {
  const rand = seededRandom(0xdeadbeef);
  return Array.from({ length: COUNT }, (_, i) => ({
    id:           i,
    left:         `${rand() * 100}%`,
    width:        Math.floor(rand() * 8  + 6),   // 6–14 px
    height:       Math.floor(rand() * 6  + 4),   // 4–10 px
    color:        COLORS[Math.floor(rand() * COLORS.length)],
    animation:    ANIMATIONS[Math.floor(rand() * ANIMATIONS.length)],
    duration:     `${(rand() * 2.5 + 2.5).toFixed(2)}s`,
    delay:        `${(rand() * 2).toFixed(2)}s`,
    borderRadius: rand() > 0.4 ? "2px" : "50%",   // mix of squares + circles
  }));
}

// ── Component ─────────────────────────────────────────────────────

export default function MasterExplorerModal() {
  const { showModal, dismissModal, categoryProgress, visitedCount, totalCount } =
    useUserPassport();

  const pieces = useMemo(generatePieces, []);

  if (!showModal) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="master-explorer-title"
      className="fixed inset-0 z-[70] flex items-center justify-center"
      style={{ perspective: "900px" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={dismissModal}
        aria-hidden="true"
      />

      {/* 3-D Confetti — rendered in front of the card */}
      {pieces.map((p) => (
        <div
          key={p.id}
          aria-hidden="true"
          className="absolute top-0 pointer-events-none z-20"
          style={{
            left:          p.left,
            width:         p.width,
            height:        p.height,
            background:    p.color,
            borderRadius:  p.borderRadius,
            transformStyle: "preserve-3d",
            animation:     `${p.animation} ${p.duration} ${p.delay} linear both`,
          }}
        />
      ))}

      {/* Modal card */}
      <div className="
        relative z-10 w-full max-w-md mx-4
        bg-gradient-to-br from-slate-900 via-red-950/60 to-slate-900
        border border-white/15 rounded-3xl shadow-2xl
        overflow-hidden
      ">
        {/* Shimmer top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-red-500 via-yellow-400 to-red-500" />

        <div className="px-7 py-8 text-center">
          {/* Icons */}
          <div className="flex justify-center gap-3 text-4xl mb-4 select-none" aria-hidden="true">
            <span>🏔️</span>
            <span>🏆</span>
            <span>🎊</span>
          </div>

          <h2
            id="master-explorer-title"
            className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
          >
            Master Explorer
          </h2>
          <p className="text-white/60 text-sm mt-1.5">
            You&apos;ve explored all {totalCount} destinations of Nepal!
          </p>

          {/* Progress ring substitute — simple stat pill */}
          <div className="mt-5 inline-flex items-center gap-2 bg-yellow-400/15 border border-yellow-400/30 px-5 py-2 rounded-full">
            <span className="text-yellow-300 font-bold text-xl">{visitedCount}</span>
            <span className="text-yellow-300/60 text-sm font-medium">/ {totalCount} destinations</span>
          </div>

          {/* Category summary */}
          <div className="mt-6 grid grid-cols-2 gap-2 text-left">
            {categoryProgress.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-2.5 bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2.5"
              >
                <span className="text-lg leading-none" aria-hidden="true">{cat.emoji}</span>
                <div className="min-w-0">
                  <p className="text-white/80 text-xs font-semibold truncate leading-snug">
                    {cat.name.split("&")[0].trim()}
                  </p>
                  <p className="text-white/35 text-[10px] mt-0.5 leading-none">
                    {cat.visited}/{cat.total} visited
                  </p>
                </div>
                {cat.visited === cat.total && (
                  <span className="ml-auto text-emerald-400 text-sm flex-shrink-0" aria-label="Complete">✓</span>
                )}
              </div>
            ))}
          </div>

          {/* Quote */}
          <p className="mt-6 text-white/30 text-xs italic leading-relaxed">
            &ldquo;The world is a book, and those who do not travel read only one page.&rdquo;
          </p>

          {/* CTA */}
          <button
            onClick={dismissModal}
            className="
              mt-6 w-full py-3 rounded-xl
              bg-gradient-to-r from-red-600 to-red-500
              hover:from-red-500 hover:to-red-400
              text-white font-bold text-sm
              transition-all shadow-lg shadow-red-900/40
              cursor-pointer
            "
          >
            Claim My Title 🏆
          </button>
        </div>
      </div>
    </div>
  );
}
