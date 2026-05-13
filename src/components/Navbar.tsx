"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin, Star, Menu, X, Moon, Sun,
  User, Settings, HelpCircle, ChevronRight, Compass,
} from "lucide-react";
import TransitionLink from "@/components/TransitionLink";
import { useTheme } from "@/context/ThemeContext";

const drawerVariants = {
  open:   { x: 0,      transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
  closed: { x: "100%", transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
};

const NAV_LINKS = [
  { label: "Destinations", href: "/#discover",          icon: Compass },
  { label: "Experiences",  href: "/experience/adventure", icon: MapPin  },
];

const SECONDARY_LINKS = [
  { icon: User,        label: "Profile",  href: "#" },
  { icon: Settings,    label: "Settings", href: "#" },
  { icon: HelpCircle,  label: "Support",  href: "#" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const glassBg     = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.05)";
  const glassBorder = isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.09)";

  // Close drawer on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* ── Sticky top bar ─────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-30"
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
            <TransitionLink href="/" className="flex items-center flex-shrink-0">
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

            {/* ── Hamburger (only right-side element) ── */}
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
      </nav>

      {/* ── Drawer + backdrop ──────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24 }}
              className="fixed inset-0 z-40"
              style={{ background: "rgba(0,0,0,0.48)", backdropFilter: "blur(2px)" }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer panel */}
            <motion.aside
              key="drawer-panel"
              variants={drawerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 bottom-0 z-50 flex flex-col w-[300px] sm:w-[340px]"
              style={{
                background: isDark ? "rgba(7,11,28,0.94)" : "rgba(250,251,255,0.96)",
                backdropFilter: "blur(32px)",
                WebkitBackdropFilter: "blur(32px)",
                borderLeft: `1px solid ${glassBorder}`,
                boxShadow: "-24px 0 80px rgba(0,0,0,0.35)",
              }}
            >
              {/* ── Drawer header ── */}
              <div
                className="flex items-center justify-between px-5 pt-5 pb-4 flex-shrink-0"
                style={{ borderBottom: `1px solid ${glassBorder}` }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex items-center justify-center rounded-[10px]"
                    style={{
                      width: 36, height: 36,
                      background: glassBg,
                      border: `1px solid ${glassBorder}`,
                    }}
                  >
                    <svg width="20" height="16" viewBox="0 0 22 18" fill="none" aria-hidden>
                      <path d="M1 17 L7 5 L12 11 L16 5 L21 17 Z" fill="var(--fill-primary)" opacity="0.85" />
                      <path d="M12 5 L14.2 10 L12 8.6 L9.8 10 Z" fill="var(--fill-primary)" />
                    </svg>
                  </div>
                  <div className="leading-tight">
                    <p className="font-bold text-[14px] text-zinc-900 dark:text-white tracking-tight">City Explorer</p>
                    <p className="text-[10px] text-zinc-500 dark:text-white/40 font-medium">Himalayan Kingdom</p>
                  </div>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="flex items-center justify-center w-8 h-8 rounded-full text-zinc-500 dark:text-white/40 hover:text-zinc-900 dark:hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-all duration-200 cursor-pointer"
                >
                  <X size={16} strokeWidth={2} />
                </button>
              </div>

              {/* ── Drawer body (scrollable) ── */}
              <div className="flex-1 overflow-y-auto px-4 py-5 space-y-7"
                style={{ scrollbarWidth: "none" }}
              >

                {/* ── Navigation ── */}
                <section>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 dark:text-white/28 mb-2.5 px-1">
                    Navigation
                  </p>
                  <div className="space-y-0.5">
                    {NAV_LINKS.map((l, i) => {
                      const Icon = l.icon;
                      return (
                        <motion.div
                          key={l.href}
                          initial={{ opacity: 0, x: 18 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.08 + i * 0.07, duration: 0.26, ease: "easeOut" }}
                        >
                          <a
                            href={l.href}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center justify-between px-3.5 py-3 rounded-xl group transition-all duration-180
                              text-zinc-700 dark:text-white/75 hover:text-zinc-900 dark:hover:text-white
                              hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                          >
                            <div className="flex items-center gap-3">
                              <Icon size={16} strokeWidth={1.8} className="text-zinc-400 dark:text-white/35 group-hover:text-zinc-600 dark:group-hover:text-white/65 transition-colors" />
                              <span className="text-sm font-semibold tracking-tight">{l.label}</span>
                            </div>
                            <ChevronRight size={14} strokeWidth={2} className="text-zinc-300 dark:text-white/20 group-hover:text-zinc-500 dark:group-hover:text-white/45 transition-colors" />
                          </a>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>

                {/* ── Appearance ── */}
                <section>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 dark:text-white/28 mb-2.5 px-1">
                    Appearance
                  </p>
                  <motion.div
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.24, duration: 0.26, ease: "easeOut" }}
                    className="flex gap-2 p-1 rounded-[14px]"
                    style={{
                      background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                      border: `1px solid ${glassBorder}`,
                    }}
                  >
                    {[
                      { id: "dark",  icon: Moon, label: "Dark",  glow: "rgba(99,102,241,0.45)" },
                      { id: "light", icon: Sun,  label: "Light", glow: "rgba(251,191,36,0.55)" },
                    ].map(({ id, icon: Icon, label, glow }) => {
                      const active = theme === id;
                      return (
                        <button
                          key={id}
                          onClick={() => { if (!active) toggleTheme(); }}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-sm font-semibold transition-all duration-200 cursor-pointer"
                          style={
                            active
                              ? {
                                  background: isDark ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.90)",
                                  color: isDark ? "#fff" : "#1a1a1a",
                                  boxShadow: `0 0 14px ${glow}, 0 2px 8px rgba(0,0,0,0.18)`,
                                }
                              : { color: isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.38)" }
                          }
                        >
                          <Icon size={14} strokeWidth={2} />
                          {label}
                        </button>
                      );
                    })}
                  </motion.div>
                </section>

                {/* ── My Collection ── */}
                <section>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 dark:text-white/28 mb-2.5 px-1">
                    My Collection
                  </p>
                  <motion.div
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.32, duration: 0.26, ease: "easeOut" }}
                  >
                    <a
                      href="#"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between px-3.5 py-3 rounded-xl group transition-all duration-180
                        text-zinc-700 dark:text-white/75 hover:text-zinc-900 dark:hover:text-white
                        hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                    >
                      <div className="flex items-center gap-3">
                        <Star
                          size={16}
                          strokeWidth={1.8}
                          className="text-zinc-400 dark:text-white/35 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors"
                          style={{ filter: "drop-shadow(0 0 4px rgba(245,158,11,0))" }}
                        />
                        <span className="text-sm font-semibold tracking-tight">My Collection</span>
                      </div>
                      <span
                        className="flex items-center justify-center text-white font-bold text-[0.6rem] rounded-full flex-shrink-0"
                        style={{
                          width: 20, height: 20,
                          background: isDark ? "#DC143C" : "#F59E0B",
                          boxShadow: isDark
                            ? "0 0 10px rgba(220,20,60,0.60)"
                            : "0 0 10px rgba(245,158,11,0.65)",
                        }}
                      >
                        3
                      </span>
                    </a>
                  </motion.div>
                </section>

                {/* ── Account ── */}
                <section>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 dark:text-white/28 mb-2.5 px-1">
                    Account
                  </p>
                  <div className="space-y-0.5">
                    {SECONDARY_LINKS.map((l, i) => {
                      const Icon = l.icon;
                      return (
                        <motion.div
                          key={l.label}
                          initial={{ opacity: 0, x: 18 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.40 + i * 0.07, duration: 0.26, ease: "easeOut" }}
                        >
                          <a
                            href={l.href}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center justify-between px-3.5 py-3 rounded-xl group transition-all duration-180
                              text-zinc-700 dark:text-white/75 hover:text-zinc-900 dark:hover:text-white
                              hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                          >
                            <div className="flex items-center gap-3">
                              <Icon size={16} strokeWidth={1.8} className="text-zinc-400 dark:text-white/35 group-hover:text-zinc-600 dark:group-hover:text-white/65 transition-colors" />
                              <span className="text-sm font-semibold tracking-tight">{l.label}</span>
                            </div>
                            <ChevronRight size={14} strokeWidth={2} className="text-zinc-300 dark:text-white/20 group-hover:text-zinc-500 dark:group-hover:text-white/45 transition-colors" />
                          </a>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>

              </div>

              {/* ── Drawer footer ── */}
              <div
                className="px-5 py-4 flex-shrink-0"
                style={{ borderTop: `1px solid ${glassBorder}` }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="flex items-center justify-center rounded-full flex-shrink-0"
                    style={{
                      width: 28, height: 28,
                      background: "#DC143C",
                      boxShadow: "0 0 12px rgba(220,20,60,0.50)",
                    }}
                  >
                    <MapPin size={13} strokeWidth={2.5} color="#fff" />
                  </span>
                  <div className="leading-tight">
                    <p className="text-[12px] font-bold text-zinc-800 dark:text-white/80 tracking-tight">Nepal</p>
                    <p className="text-[10px] text-zinc-400 dark:text-white/30">Currently exploring</p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
