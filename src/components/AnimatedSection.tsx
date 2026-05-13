"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import type { Variants } from "motion/react";
import { FADE_UP, STAGGER } from "@/lib/animations";

// ── AnimatedSection ────────────────────────────────────────────────────────────
/**
 * Stagger container — wraps a block of content and reveals children with a
 * staggered entrance when the section scrolls into view.
 *
 * Children should use <AnimatedItem> (or have their own `variants` prop) to
 * participate in the stagger cascade.
 */
interface SectionProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  threshold?: number;
  /** Override the container stagger variants */
  variants?: Variants;
}

export default function AnimatedSection({
  children,
  className = "",
  stagger = 0.08,
  delay   = 0.05,
  threshold = 0.12,
  variants,
}: SectionProps) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: threshold, once: true });

  const containerVariants: Variants = variants ?? {
    hidden:  {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── AnimatedItem ───────────────────────────────────────────────────────────────
/**
 * A direct child of AnimatedSection. Inherits the parent's stagger timing
 * automatically — no extra configuration required.
 *
 * Usage:
 *   <AnimatedSection>
 *     <AnimatedItem><CardA /></AnimatedItem>
 *     <AnimatedItem><CardB /></AnimatedItem>
 *   </AnimatedSection>
 */
interface ItemProps {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
}

export function AnimatedItem({ children, className = "", variants }: ItemProps) {
  return (
    <motion.div variants={variants ?? FADE_UP} className={className}>
      {children}
    </motion.div>
  );
}

// ── SimpleReveal ───────────────────────────────────────────────────────────────
/**
 * Lightweight single-element reveal — no stagger context needed.
 * Use for isolated headings, CTA blocks, etc.
 */
interface RevealProps {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  threshold?: number;
  delay?: number;
}

export function SimpleReveal({
  children,
  className = "",
  variants,
  threshold = 0.12,
  delay     = 0,
}: RevealProps) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: threshold, once: true });

  const v: Variants = variants ?? FADE_UP;

  return (
    <motion.div
      ref={ref}
      variants={v}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={delay ? { delay } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Re-exports for convenience ─────────────────────────────────────────────────
export { FADE_UP, STAGGER };
