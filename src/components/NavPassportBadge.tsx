"use client";

import { motion } from "motion/react";
import { useUserPassport } from "@/context/UserPassportContext";
import TransitionLink from "./TransitionLink";

export default function NavPassportBadge() {
  const { visitedCount, isComplete } = useUserPassport();

  return (
    <TransitionLink href="/passport">
      {/* Badge pill — soft glow pulse every 5 s */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        animate={{
          boxShadow: isComplete
            ? undefined
            : [
                "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 0px rgba(255,255,255,0)",
                "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 5px rgba(255,255,255,0.07)",
                "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 0px rgba(255,255,255,0)",
              ],
        }}
        transition={{
          boxShadow: { duration: 0.9, repeat: Infinity, repeatDelay: 5, ease: "easeOut" },
          scale: { type: "spring", stiffness: 400, damping: 25 },
        }}
        className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-full cursor-pointer select-none"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* Icon */}
        <span className="text-sm leading-none" aria-hidden>
          {isComplete ? "🏆" : "🛂"}
        </span>

        {/* Label */}
        <span className="text-xs font-semibold text-zinc-300 tracking-tight">
          My Passport
        </span>

        {/* Notification jewel */}
        {visitedCount > 0 && (
          <span className="relative flex items-center justify-center">
            {/* Outer ping ring — continuous */}
            {!isComplete && (
              <motion.span
                animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut", repeatDelay: 0.4 }}
                className="absolute inset-0 rounded-full"
                style={{ background: "rgba(239,68,68,0.45)" }}
              />
            )}

            {/* Solid jewel circle */}
            <span
              className="relative z-10 flex items-center justify-center rounded-full text-white text-[9px] font-extrabold tracking-tight leading-none"
              style={{
                minWidth: 18,
                height: 18,
                background: isComplete
                  ? "linear-gradient(135deg,#fbbf24,#f59e0b)"
                  : "linear-gradient(135deg,#ef4444,#dc2626)",
                boxShadow: isComplete
                  ? "0 0 8px rgba(251,191,36,0.8), 0 0 16px rgba(251,191,36,0.4)"
                  : "0 0 8px rgba(239,68,68,0.8), 0 0 16px rgba(239,68,68,0.4)",
                padding: "0 4px",
              }}
            >
              {visitedCount}
            </span>
          </span>
        )}
      </motion.div>
    </TransitionLink>
  );
}
