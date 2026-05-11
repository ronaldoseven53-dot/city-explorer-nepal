"use client";

import { motion } from "motion/react";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default function HimalayanAICard() {
  const currentMonth = MONTHS[new Date().getMonth()];

  const openWithPrompt = (prompt: string) => {
    document.dispatchEvent(
      new CustomEvent("open-ai-planner", { detail: { prompt } })
    );
  };

  return (
    <div className="flex flex-col h-full gap-5">

      {/* ── Avatar + identity ── */}
      <div className="flex items-center gap-3.5">
        <div className="relative flex-shrink-0">
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            background: "linear-gradient(135deg, #dc2626 0%, #be123c 100%)",
            boxShadow: "0 0 22px rgba(220,38,38,0.50), inset 0 1px 0 rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24,
          }}>
            🏔️
          </div>
          {/* Online dot */}
          <span style={{
            position: "absolute", bottom: 2, right: 2,
            width: 11, height: 11, borderRadius: "50%",
            background: "#22c55e",
            border: "2px solid",
            borderColor: "var(--glass-bg, rgba(8,14,36,0.8))",
            boxShadow: "0 0 7px rgba(34,197,94,0.70)",
          }} />
        </div>
        <div>
          <p className="text-zinc-900 dark:text-white font-extrabold text-base leading-none tracking-tight">
            Himalaya AI
          </p>
          <p className="text-zinc-500 dark:text-white/40 text-[11px] mt-1 font-medium">
            Expert Nepal Guide · Powered by Gemini
          </p>
        </div>
      </div>

      {/* ── Description ── */}
      <p className="text-zinc-500 dark:text-white/50 text-sm leading-relaxed">
        Share your interests, budget, or travel dates and get a
        personalised day-by-day Nepal itinerary in seconds.
      </p>

      {/* ── Action buttons ── */}
      <div className="flex flex-col gap-2.5 mt-auto">

        {/* Primary — Create Itinerary */}
        <motion.button
          onClick={() =>
            openWithPrompt(
              "I'd like to create a personalised day-by-day Nepal itinerary. " +
              "Please ask me about my travel style, key interests (trekking, culture, wildlife, adventure, etc.), " +
              "approximate budget, and how many days I have, then build the plan."
            )
          }
          whileHover={{ scale: 1.02, boxShadow: "0 0 36px rgba(220,38,38,0.55)" }}
          whileTap={{ scale: 0.97 }}
          className="cursor-pointer w-full flex items-center gap-3 font-bold text-sm text-white"
          style={{
            background:   "linear-gradient(135deg, #dc2626 0%, #be123c 100%)",
            boxShadow:    "0 0 22px rgba(220,38,38,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
            borderRadius: 16,
            padding:      "13px 18px",
            border:       "none",
          }}
        >
          <span className="text-lg leading-none">✨</span>
          <span>Create Itinerary</span>
        </motion.button>

        {/* Secondary — Best Time to Visit */}
        <motion.button
          onClick={() =>
            openWithPrompt(
              `It's currently ${currentMonth}. Based on this month, which regions and ` +
              "destinations in Nepal are at their absolute best right now? " +
              "Give me specific destination recommendations with the reasoning for each."
            )
          }
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="cursor-pointer w-full flex items-center gap-3 font-semibold text-sm"
          style={{
            background:          "rgba(255,255,255,0.07)",
            backdropFilter:      "blur(12px)",
            WebkitBackdropFilter:"blur(12px)",
            border:              "1px solid rgba(255,255,255,0.14)",
            borderRadius:        16,
            padding:             "13px 18px",
            color:               "rgba(255,255,255,0.82)",
          }}
        >
          <span className="text-lg leading-none">🗓</span>
          <span>Best Time to Visit</span>
          <span className="ml-auto text-[10px] text-white/30 font-medium">
            {currentMonth}
          </span>
        </motion.button>

      </div>
    </div>
  );
}
