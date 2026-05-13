"use client";

import { motion, useSpring, useTransform } from "motion/react";
import { usePageScrollProgress, useReducedMotion } from "@/hooks/useScrollAnimation";

/**
 * Crimson → orange → amber gradient bar fixed to the very top of the viewport.
 * Fills as the user scrolls, communicating reading progress cinematically.
 * Hidden when prefers-reduced-motion is set.
 */
export default function ScrollProgressBar() {
  const progress = usePageScrollProgress();
  const reduced  = useReducedMotion();

  // Spring smoothing so the bar doesn't jump on fast scroll flicks
  const smoothed = useSpring(progress, { stiffness: 220, damping: 45 });
  const scaleX   = useTransform(smoothed, [0, 1], [0, 1]);

  if (reduced) return null;

  return (
    <>
      {/* The fill bar */}
      <motion.div
        aria-hidden
        style={{
          position:      "fixed",
          top:           0,
          left:          0,
          right:         0,
          height:        2,
          zIndex:        9999,
          background:    "linear-gradient(to right, #DC2626, #F97316, #F59E0B)",
          transformOrigin: "left center",
          scaleX,
          willChange:    "transform",
        }}
      />

      {/* Glow bloom behind the bar */}
      <motion.div
        aria-hidden
        style={{
          position:      "fixed",
          top:           0,
          left:          0,
          right:         0,
          height:        6,
          zIndex:        9998,
          background:    "linear-gradient(to right, #DC2626aa, #F97316aa, #F59E0Baa)",
          filter:        "blur(4px)",
          transformOrigin: "left center",
          scaleX,
          willChange:    "transform",
          opacity:       0.55,
        }}
      />
    </>
  );
}
