"use client";

export default function AIPlannerTrigger() {
  return (
    <button
      onClick={() => document.dispatchEvent(new CustomEvent("open-ai-planner"))}
      className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-xl shadow-red-900/40 hover:shadow-red-800/60 transition-all duration-200 active:scale-95 cursor-pointer"
    >
      <span className="text-xl">✨</span>
      Start Planning My Trip
      <span className="text-lg">→</span>
    </button>
  );
}
