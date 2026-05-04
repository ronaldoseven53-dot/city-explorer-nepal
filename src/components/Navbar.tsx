"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import NavPassportBadge from "@/components/NavPassportBadge";
import TransitionLink from "@/components/TransitionLink";

const NAV_LINKS = [
  { label: "Destinations", href: "/#destinations" },
  { label: "Experiences",  href: "/experience/adventure" },
];

// ── Magnetic hover link ───────────────────────────────────────────────
function MagneticLink({ href, label }: { href: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width  / 2)) * 0.18);
    y.set((e.clientY - (rect.top  + rect.height / 2)) * 0.18);
  };

  const onMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <TransitionLink href={href}>
        <motion.span
          style={{ x: springX, y: springY, display: "inline-block" }}
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors duration-300 ease-out cursor-pointer select-none"
        >
          {label}
        </motion.span>
      </TransitionLink>
    </div>
  );
}

// ── Hamburger icon ────────────────────────────────────────────────────
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="w-5 h-4 flex flex-col justify-between cursor-pointer">
      <motion.span
        animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="block h-px w-full bg-zinc-700/80 rounded-full origin-center"
      />
      <motion.span
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.2 }}
        className="block h-px w-full bg-zinc-700/80 rounded-full"
      />
      <motion.span
        animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="block h-px w-full bg-zinc-700/80 rounded-full origin-center"
      />
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 border-b border-black/[0.08]"
      style={{
        background: "rgba(250,247,242,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ──────────────────────────────────────────── */}
          <TransitionLink href="/" className="flex items-center gap-2.5">
            <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <defs>
                <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e8dcc8" />
                  <stop offset="100%" stopColor="#c8b898" />
                </linearGradient>
                <linearGradient id="snowG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#dce8f5" />
                </linearGradient>
              </defs>
              <rect width="36" height="36" rx="8" fill="url(#skyG)" />
              <path d="M0 28 L8 16 L14 22 L20 12 L26 20 L36 28 Z" fill="#b8a888" opacity="0.6" />
              <path d="M6 30 L18 8 L30 30 Z" fill="#a0896a" />
              <path d="M18 8 L13.5 18 L18 16 L22.5 18 Z" fill="url(#snowG)" />
              <path d="M0 30 L6 24 L12 28 L18 22 L24 27 L30 23 L36 28 L36 36 L0 36 Z" fill="#8c7658" />
            </svg>

            <div className="flex items-baseline gap-1 tracking-tight">
              <span className="font-bold text-[17px] text-zinc-800">City Explorer</span>
              <span
                className="font-bold text-[17px] text-amber-400"
                style={{ textShadow: "0 0 18px rgba(251,191,36,0.55), 0 0 40px rgba(251,191,36,0.25)" }}
              >
                Nepal
              </span>
            </div>
          </TransitionLink>

          {/* ── Desktop nav ───────────────────────────────────── */}
          <div className="hidden sm:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <MagneticLink key={l.href} href={l.href} label={l.label} />
            ))}
            <NavPassportBadge />
          </div>

          {/* ── Mobile: passport badge + hamburger ────────────── */}
          <div className="flex sm:hidden items-center gap-3">
            <NavPassportBadge />
            <button
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 rounded-xl bg-black/[0.05] border border-black/[0.10] hover:bg-black/[0.09] transition-colors"
            >
              <HamburgerIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ─────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="sm:hidden overflow-hidden border-t border-black/[0.07]"
            style={{ background: "rgba(250,247,242,0.97)", backdropFilter: "blur(20px)" }}
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.25, ease: "easeOut" }}
                >
                  <a
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-black/[0.05] rounded-xl transition-all duration-300 ease-out"
                  >
                    {l.label}
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
