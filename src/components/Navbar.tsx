"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Star, Menu, X } from "lucide-react";
import NavPassportBadge from "@/components/NavPassportBadge";
import TransitionLink from "@/components/TransitionLink";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_LINKS = [
  { label: "Destinations", href: "/#discover" },
  { label: "Experiences",  href: "/experience/adventure" },
];

const GLASS_DARK = {
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.11)",
} as const;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: "rgba(10,15,28,0.88)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        <div className="flex items-center justify-between gap-3 h-[60px]">

          {/* ── Logo ── */}
          <TransitionLink href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div
              className="flex items-center justify-center rounded-[10px]"
              style={{ width: 40, height: 40, ...GLASS_DARK }}
            >
              <svg width="22" height="18" viewBox="0 0 22 18" fill="none" aria-hidden>
                <path d="M1 17 L7 5 L12 11 L16 5 L21 17 Z" fill="rgba(255,255,255,0.85)" />
                <path d="M12 5 L14.2 10 L12 8.6 L9.8 10 Z" fill="white" />
              </svg>
            </div>
            <div className="leading-tight">
              <p className="font-bold text-[15px] text-white tracking-tight">City Explorer</p>
              <p className="text-[10px] text-white/45 font-medium">Himalayan Kingdom</p>
            </div>
          </TransitionLink>

          {/* ── Nepal pill — center ── */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "tween", duration: 0.15 }}
            style={{
              background: "#DC143C",
              borderRadius: "9999px",
              border: "none",
              padding: "9px 18px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.875rem",
              cursor: "pointer",
              boxShadow: "0 4px 18px rgba(220,20,60,0.45)",
              letterSpacing: "0.01em",
            }}
          >
            <MapPin size={14} strokeWidth={2.5} />
            Nepal
          </motion.button>

          {/* ── Right: My Collection + passport + hamburger ── */}
          <div className="flex items-center gap-2">
            {/* My Collection — desktop only */}
            <button
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-white/72 text-[0.8rem] font-medium"
              style={GLASS_DARK}
            >
              <Star size={13} strokeWidth={2} />
              My Collection
              <span
                className="flex items-center justify-center text-white font-bold"
                style={{
                  background: "#DC143C",
                  borderRadius: "9999px",
                  width: 16,
                  height: 16,
                  fontSize: "0.58rem",
                }}
              >
                1
              </span>
            </button>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Passport badge */}
            <NavPassportBadge />

            {/* Hamburger */}
            <button
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center justify-center rounded-[10px] text-white/80 hover:text-white transition-colors"
              style={{ width: 40, height: 40, ...GLASS_DARK, cursor: "pointer" }}
            >
              {menuOpen ? <X size={18} strokeWidth={2} /> : <Menu size={18} strokeWidth={2} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.26, ease: "easeOut" }}
            className="overflow-hidden"
            style={{
              background: "rgba(10,15,28,0.96)",
              backdropFilter: "blur(24px)",
              borderTop: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.22 }}
                >
                  <a
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-white/70 hover:text-white hover:bg-white/[0.06] rounded-xl transition-all"
                  >
                    {l.label}
                  </a>
                </motion.div>
              ))}
              {/* My Collection on mobile */}
              <div className="mt-2 px-4 py-3 flex items-center gap-2 text-white/70 text-sm">
                <Star size={14} strokeWidth={2} />
                My Collection
                <span className="flex items-center justify-center text-white font-bold text-[0.58rem] rounded-full" style={{ background: "#DC143C", width: 16, height: 16 }}>1</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
