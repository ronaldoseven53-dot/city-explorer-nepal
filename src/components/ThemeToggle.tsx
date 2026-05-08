"use client";

import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();
  const isDark = !mounted || theme === "dark";

  return (
    <motion.button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "tween", duration: 0.12 }}
      style={{
        width: 40,
        height: 40,
        borderRadius: "10px",
        background: isDark
          ? "rgba(99, 102, 241, 0.18)"
          : "rgba(251, 191, 36, 0.22)",
        border: `1px solid ${isDark ? "rgba(99,102,241,0.32)" : "rgba(251,191,36,0.45)"}`,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow pulse on switch */}
      <motion.div
        key={theme}
        initial={{ scale: 0, opacity: 0.6 }}
        animate={{ scale: 2.5, opacity: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "10px",
          background: isDark
            ? "rgba(99,102,241,0.50)"
            : "rgba(251,191,36,0.50)",
          pointerEvents: "none",
        }}
      />

      {/* Icon swap with rotation */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? "moon" : "sun"}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ type: "spring", stiffness: 520, damping: 26, mass: 0.6 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {isDark ? (
            <Moon
              size={16}
              strokeWidth={2}
              color="rgba(165,180,252,0.90)"
              style={{ filter: "drop-shadow(0 0 4px rgba(99,102,241,0.70))" }}
            />
          ) : (
            <Sun
              size={16}
              strokeWidth={2}
              color="rgba(245,158,11,0.95)"
              style={{ filter: "drop-shadow(0 0 5px rgba(251,191,36,0.80))" }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
