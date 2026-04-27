"use client";

import { motion } from "motion/react";
import { useUserPassport } from "@/context/UserPassportContext";
import TransitionLink from "./TransitionLink";

export default function NavPassportBadge() {
  const { visitedCount, totalCount, isComplete } = useUserPassport();

  return (
    <TransitionLink href="/passport">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-full cursor-pointer select-none"
        style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* Icon */}
        <span className="text-sm" aria-hidden>{isComplete ? "🏆" : "🛂"}</span>

        {/* Label */}
        <span className="text-xs font-semibold text-zinc-300 tracking-tight">
          My Passport
        </span>

        {/* Notification bubble with pulse */}
        {visitedCount > 0 && (
          <span className="relative flex items-center">
            {/* Ping ring */}
            {!isComplete && (
              <motion.span
                animate={{ scale: [1, 1.7], opacity: [0.5, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-red-500/40"
              />
            )}
            <span
              className={`
                relative z-10 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none
                ${isComplete
                  ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
                }
              `}
            >
              {visitedCount}/{totalCount}
            </span>
          </span>
        )}
      </motion.div>
    </TransitionLink>
  );
}
