"use client";

import { useUserPassport } from "@/context/UserPassportContext";
import TransitionLink from "./TransitionLink";

export default function NavPassportBadge() {
  const { visitedCount, totalCount, isComplete } = useUserPassport();

  return (
    <TransitionLink
      href="/passport"
      className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-red-700 bg-gray-100 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors"
    >
      <span aria-hidden>{isComplete ? "🏆" : "🛂"}</span>
      My Passport
      {visitedCount > 0 && (
        <span className={`
          text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none
          ${isComplete
            ? "bg-yellow-400 text-yellow-900"
            : "bg-red-100 text-red-600"
          }
        `}>
          {visitedCount}/{totalCount}
        </span>
      )}
    </TransitionLink>
  );
}
