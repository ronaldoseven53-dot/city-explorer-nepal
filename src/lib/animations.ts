/**
 * Cinematic animation toolkit — easing curves, shared variants, transition presets.
 * Import from here so the whole app shares one motion vocabulary.
 */

import type { Variants, Transition } from "motion/react";

// ── Easing curves ──────────────────────────────────────────────────────────────
// Named for emotional character, not math.

/** Fast snap-to-rest — button presses, badge reveals */
export const EASE_OUT_EXPO    = [0.16, 1, 0.3, 1] as const;
/** Slow cinematic push/pull — hero parallax, modal enter */
export const EASE_IN_OUT_EXPO = [0.87, 0, 0.13, 1] as const;
/** Balanced — most reveals, card lifts */
export const EASE_CINEMATIC   = [0.25, 0.46, 0.45, 0.94] as const;
/** Apple-style — feels expensive */
export const EASE_APPLE       = [0.42, 0, 0.58, 1] as const;

// ── Transition presets ────────────────────────────────────────────────────────

export const T_FAST: Transition = { duration: 0.18, ease: EASE_OUT_EXPO };
export const T_MED:  Transition = { duration: 0.42, ease: EASE_CINEMATIC };
export const T_SLOW: Transition = { duration: 0.72, ease: EASE_IN_OUT_EXPO };

export const T_SPRING: Transition = {
  type: "spring", stiffness: 260, damping: 28,
};
export const T_SPRING_SNAPPY: Transition = {
  type: "spring", stiffness: 400, damping: 32,
};
export const T_SPRING_BOUNCY: Transition = {
  type: "spring", stiffness: 320, damping: 20,
};

// ── Reveal variants (pair with AnimatedSection / AnimatedItem) ────────────────

export const FADE_UP: Variants = {
  hidden:  { opacity: 0, y: 28, filter: "blur(4px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { ...T_MED } as Transition,
  },
};

export const FADE_IN: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { ...T_MED } as Transition },
};

export const SCALE_UP: Variants = {
  hidden:  { opacity: 0, scale: 0.90 },
  visible: { opacity: 1, scale: 1, transition: { ...T_MED } as Transition },
};

export const SLIDE_LEFT: Variants = {
  hidden:  { opacity: 0, x: 40, filter: "blur(3px)" },
  visible: {
    opacity: 1, x: 0, filter: "blur(0px)",
    transition: { ...T_MED } as Transition,
  },
};

export const SLIDE_RIGHT: Variants = {
  hidden:  { opacity: 0, x: -40, filter: "blur(3px)" },
  visible: {
    opacity: 1, x: 0, filter: "blur(0px)",
    transition: { ...T_MED } as Transition,
  },
};

// ── Stagger containers ────────────────────────────────────────────────────────

/** Standard stagger — for grids and card rows */
export const STAGGER: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.10 } },
};

/** Fast stagger — for lists, nav items */
export const STAGGER_FAST: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

/** Slow stagger — for hero sections, cinematic reveals */
export const STAGGER_SLOW: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.20 } },
};

// ── Hover presets (spread into motion components) ─────────────────────────────

export const HOVER_LIFT = {
  whileHover: { y: -6, scale: 1.025 },
  whileTap:   { scale: 0.97 },
  transition: T_SPRING_SNAPPY,
} as const;

export const HOVER_GLOW_BTN = {
  whileHover: { scale: 1.04, boxShadow: "0 0 36px rgba(220,20,60,0.60)" },
  whileTap:   { scale: 0.96 },
  transition: T_FAST,
} as const;

// ── Page-level transition (use in layout or page wrappers) ────────────────────

export const PAGE_VARIANTS: Variants = {
  initial:  { opacity: 0, y: 14 },
  animate:  {
    opacity: 1, y: 0,
    transition: { duration: 0.42, ease: EASE_CINEMATIC } as Transition,
  },
  exit: {
    opacity: 0, y: -14,
    transition: { duration: 0.28, ease: EASE_IN_OUT_EXPO } as Transition,
  },
};

// ── Floating / ambient animations ────────────────────────────────────────────

/** Slow continuous up-down drift — for orbs, badges, floating UI */
export const FLOAT_ANIM = {
  animate: { y: [0, -10, 0] },
  transition: { duration: 6, ease: "easeInOut", repeat: Infinity },
} as const;

/** Gentle pulse — for glowing rings, live indicators */
export const PULSE_ANIM = {
  animate: { scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] },
  transition: { duration: 2.4, ease: "easeInOut", repeat: Infinity },
} as const;
