"use client";

import { useRef, useEffect, useState } from "react";
import {
  useInView,
  useTransform,
  useMotionValue,
  useSpring,
  type MotionValue,
} from "motion/react";

// ── Viewport reveal ────────────────────────────────────────────────────────────
/**
 * Returns { ref, inView } — attach ref to any element; inView becomes true
 * when the element enters the viewport. Fires once by default.
 */
export function useInViewReveal(threshold = 0.14, once = true) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: threshold, once });
  return { ref, inView };
}

// ── Spring-smoothed parallax ───────────────────────────────────────────────────
/**
 * Wraps useTransform with a spring so fast-flick scrolls don't pop the layer.
 * Pass your section's scrollYProgress MotionValue + the output range.
 */
export function useParallax(
  scrollYProgress: MotionValue<number>,
  outputRange: [string, string],
  stiffness = 120,
  damping  = 40,
) {
  const raw    = useTransform(scrollYProgress, [0, 1], outputRange);
  return useSpring(raw, { stiffness, damping });
}

// ── Global page scroll progress (0 → 1) ────────────────────────────────────────
/**
 * A lightweight MotionValue that tracks window.scrollY / maxScroll.
 * Passive listener — no layout thrash.
 */
export function usePageScrollProgress(): MotionValue<number> {
  const progress = useMotionValue(0);

  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.set(max > 0 ? scrolled / max : 0);
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [progress]);

  return progress;
}

// ── Reduced-motion preference ──────────────────────────────────────────────────
/**
 * Reads the user's prefers-reduced-motion media query and reacts to changes.
 * Use this to gate heavy animations.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

// ── 3-D card tilt on hover ─────────────────────────────────────────────────────
/**
 * Returns spring-smoothed rotateX / rotateY values driven by mouse position
 * relative to the element's centre, plus the mouse event handlers.
 *
 * Usage:
 *   const { rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt();
 *   <motion.div style={{ rotateX, rotateY, transformPerspective: 800 }}
 *               onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
 */
export function useTilt(maxDeg = 7) {
  const rX = useMotionValue(0);
  const rY = useMotionValue(0);
  const rotateX = useSpring(rX, { stiffness: 200, damping: 32 });
  const rotateY = useSpring(rY, { stiffness: 200, damping: 32 });

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    rX.set(((e.clientY - cy) / (rect.height / 2)) * -maxDeg);
    rY.set(((e.clientX - cx) / (rect.width  / 2)) *  maxDeg);
  };

  const onMouseLeave = () => { rX.set(0); rY.set(0); };

  return { rotateX, rotateY, onMouseMove, onMouseLeave };
}

// ── Counter animation (number → number) ────────────────────────────────────────
/**
 * Animates from 0 to `target` when `trigger` becomes true.
 * Returns the current integer value as a plain number (for rendering).
 */
export function useCountUp(target: number, trigger: boolean, duration = 1.6) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [trigger, target, duration]);

  return value;
}
