"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Star, Menu, X } from "lucide-react";
import NavPassportBadge from "@/components/NavPassportBadge";
import TransitionLink from "@/components/TransitionLink";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";

const NAV_LINKS = [
  { label: "Destinations", href: "/#discover" },
  { label: "Experiences",  href: "/experience/adventure" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Glassmorphism tokens — match user's spec exactly
  const glassBg     = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.05)";
  const glassBorder = isDark ? "rgba(255,255,255,0.20)" : "rgba(0,0,0,0.10)";

  // Badge: Crimson in dark, glowing Amber in light
  const badgeBg   = isDark ? "#DC143C"                         : "#F59E0B";
  const badgeGlow = isDark ? "rgba(220,20,60,0.55)"            : "rgba(245,158,11,0.60)";
  const starGlow  = isDark ? "drop-shadow(0 0 5px rgba(251,191,36,0.55))" : "drop-shadow(0 0 5px rgba(245,158,11,0.65))";

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: "var(--nav-bg)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: `1px solid ${glassBorder}`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-5">
        <div className="flex items-center justify-between gap-3 h-[60px]">

          {/* ── Logo ── */}
          <TransitionLink href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div
              className="flex items-center justify-center rounded-[10px]"
              style={{
                width: 40, height: 40,
                background: glassBg,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: `1px solid ${glassBorder}`,
              }}
            >
              <svg width="22" height="18" viewBox="0 0 22 18" fill="none" aria-hidden>
                <path d="M1 17 L7 5 L12 11 L16 5 L21 17 Z" fill="var(--fill-primary)" opacity="0.85" />
                <path d="M12 5 L14.2 10 L12 8.6 L9.8 10 Z" fill="var(--fill-primary)" />
              </svg>
            </div>
            <div className="leading-tight">
              <p className="font-bold text-[15px] text-[#1a1a1a] dark:text-white tracking-tight">City Explorer</p>
              <p className="text-[10px] text-[#1a1a1a]/50 dark:text-white/45 font-medium">Himalayan Kingdom</p>
            </div>
          </TransitionLink>

          {/* ── Nepal pill ── */}
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

          {/* ── Right cluster ── */}
          <div className="flex items-center gap-2">

            {/* ── My Collection ── */}
            <motion.button
              initial="rest"
              whileHover="hover"
              animate="rest"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-zinc-600 dark:text-white/80 text-[0.8rem] font-medium"
              style={{
                background: glassBg,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: `1px solid ${glassBorder}`,
                cursor: "pointer",
              }}
            >
              <Star
                size={13}
                strokeWidth={2}
                style={{ filter: starGlow }}
                className="text-zinc-600 dark:text-white/80"
              />
              My Collection
              {/* Notification badge — pulses on parent hover */}
              <motion.span
                className="flex items-center justify-center text-white font-bold relative"
                variants={{
                  rest: {
                    scale: 1,
                    boxShadow: `0 0 7px ${badgeGlow}`,
                  },
                  hover: {
                    scale: [1, 1.22, 0.92, 1.12, 1],
                    boxShadow: [
                      `0 0 7px ${badgeGlow}`,
                      `0 0 18px ${badgeGlow}`,
                      `0 0 6px ${badgeGlow}`,
                      `0 0 14px ${badgeGlow}`,
                      `0 0 7px ${badgeGlow}`,
                    ],
                    transition: { duration: 0.55, ease: "easeInOut" },
                  },
                }}
                style={{
                  background: badgeBg,
                  borderRadius: "9999px",
                  width: 18, height: 18,
                  fontSize: "0.58rem",
                  flexShrink: 0,
                }}
              >
                1
              </motion.span>
            </motion.button>

            {/* ── Theme toggle ── */}
            <ThemeToggle />

            {/* ── Passport badge ── */}
            <NavPassportBadge />

            {/* ── Hamburger ── */}
            <motion.button
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              className="flex items-center justify-center rounded-[10px] text-zinc-700 dark:text-white/85 hover:text-zinc-900 dark:hover:text-white"
              style={{
                width: 40, height: 40, cursor: "pointer",
                background: glassBg,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: `1px solid ${glassBorder}`,
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={menuOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0,   scale: 1   }}
                  exit={  { opacity: 0, rotate:  30, scale: 0.7 }}
                  transition={{ type: "spring", stiffness: 520, damping: 24, mass: 0.55 }}
                >
                  {menuOpen ? <X size={18} strokeWidth={2} /> : <Menu size={18} strokeWidth={2} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
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
              background: "var(--nav-drawer-bg)",
              backdropFilter: "blur(24px)",
              borderTop: `1px solid ${glassBorder}`,
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
                    className="block px-4 py-3 text-sm font-medium text-zinc-600 dark:text-white/70 hover:text-zinc-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-xl transition-all"
                  >
                    {l.label}
                  </a>
                </motion.div>
              ))}
              <div className="mt-2 px-4 py-3 flex items-center gap-2 text-zinc-600 dark:text-white/70 text-sm">
                <Star size={14} strokeWidth={2} style={{ filter: starGlow }} />
                My Collection
                <motion.span
                  className="flex items-center justify-center text-white font-bold text-[0.58rem] rounded-full"
                  style={{
                    background: badgeBg,
                    width: 18, height: 18,
                    boxShadow: `0 0 7px ${badgeGlow}`,
                  }}
                  animate={{
                    boxShadow: [`0 0 7px ${badgeGlow}`, `0 0 14px ${badgeGlow}`, `0 0 7px ${badgeGlow}`],
                  }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  1
                </motion.span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
