"use client";

import { motion } from "framer-motion";

export default function AIPlannerTrigger() {
  return (
    <motion.button
      onClick={() => document.dispatchEvent(new CustomEvent("open-ai-planner"))}
      whileHover={{ scale: 1.04, boxShadow: "0 0 48px rgba(220,38,38,0.55), 0 0 80px rgba(220,38,38,0.25)" }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-base px-8 py-4 rounded-3xl shadow-xl shadow-red-900/40 transition-colors duration-200 cursor-pointer"
    >
      <span className="text-xl">✨</span>
      Start Planning My Trip
      <span className="text-lg">→</span>
    </motion.button>
  );
}
