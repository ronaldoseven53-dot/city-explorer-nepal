"use client";

import { useUserPassport } from "@/context/UserPassportContext";
import TransitionLink from "./TransitionLink";

export default function NavPassportBadge() {
  const { visitedCount, totalCount, isComplete } = useUserPassport();

  return (
    <TransitionLink
      href="/passport"
      className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.10] hover:border-white/[0.20] px-3 py-1.5 rounded-full transition-all duration-200"
    >
      <span aria-hidden>{isComplete ? "🏆" : "🛂"}</span>
      My Passport
      {visitedCount > 0 && (
        <span className={`
          text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none
          ${isComplete
            ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30"
            : "bg-red-500/20 text-red-400 border border-red-500/30"
          }
        `}>
          {visitedCount}/{totalCount}
        </span>
      )}
    </TransitionLink>
  );
}
