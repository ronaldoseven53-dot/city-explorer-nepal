"use client";

import { motion } from "motion/react";
import { Star } from "lucide-react";
import { useUserPassport } from "@/context/UserPassportContext";
import TransitionLink from "./TransitionLink";

export default function NavPassportBadge() {
  const { visitedCount, isComplete } = useUserPassport();

  return (
    <TransitionLink href="/passport">
      <motion.div
        whileHover={{
          scale: 1.04,
          boxShadow: "0 0 0 1px rgba(251,191,36,0.35), 0 0 16px rgba(251,191,36,0.25)",
        }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-full cursor-pointer select-none"
        style={{
          background: "rgba(255,255,255,0.10)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.20)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
        }}
      >
        {/* Star icon with pop-on-tap and hover glow */}
        <motion.span
          whileTap={{ scale: 1.2, rotate: 15 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          className="leading-none"
        >
          <Star
            size={14}
            className={`transition-colors duration-200 ${
              isComplete
                ? "fill-yellow-400 text-yellow-400"
                : visitedCount > 0
                ? "fill-amber-400/60 text-amber-400"
                : "text-zinc-400"
            }`}
          />
        </motion.span>

        {/* Label */}
        <span className="text-xs font-semibold text-zinc-300 tracking-tight">
          My Collection
        </span>

        {/* Amber counter jewel */}
        {visitedCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
            className="relative z-10 flex items-center justify-center rounded-full font-extrabold text-black leading-none"
            style={{
              minWidth: 18,
              height: 18,
              fontSize: 9,
              padding: "0 4px",
              background: isComplete
                ? "linear-gradient(135deg,#fbbf24,#f59e0b)"
                : "linear-gradient(135deg,#fbbf24,#d97706)",
              boxShadow: "0 0 6px rgba(251,191,36,0.7), 0 0 12px rgba(251,191,36,0.35)",
            }}
          >
            {visitedCount}
          </motion.span>
        )}
      </motion.div>
    </TransitionLink>
  );
}
