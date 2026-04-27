"use client";

import { useState, useMemo } from "react";
import { destinations, Destination } from "@/data/destinations";
import DestinationCard from "./DestinationCard";
import { motion } from "framer-motion";

type Category = "all" | Destination["category"];

const categoryFilters: { value: Category; label: string; emoji: string; active: string; inactive: string }[] = [
  { value: "all",         label: "All",         emoji: "🗺️", active: "bg-white/15 text-white border-white/30",           inactive: "bg-white/[0.05] text-zinc-400 border-white/[0.10] hover:bg-white/[0.10] hover:text-white"     },
  { value: "agriculture", label: "Agriculture", emoji: "🌾", active: "bg-lime-500/25 text-lime-200 border-lime-500/40",   inactive: "bg-white/[0.05] text-zinc-400 border-white/[0.10] hover:bg-white/[0.10] hover:text-white"     },
  { value: "mountain",    label: "Mountain",    emoji: "🏔️", active: "bg-blue-500/25 text-blue-200 border-blue-500/40",   inactive: "bg-white/[0.05] text-zinc-400 border-white/[0.10] hover:bg-white/[0.10] hover:text-white"     },
  { value: "heritage",    label: "Heritage",    emoji: "🏛️", active: "bg-amber-500/25 text-amber-200 border-amber-500/40",inactive: "bg-white/[0.05] text-zinc-400 border-white/[0.10] hover:bg-white/[0.10] hover:text-white"     },
  { value: "nature",      label: "Nature",      emoji: "🌿", active: "bg-green-500/25 text-green-200 border-green-500/40",inactive: "bg-white/[0.05] text-zinc-400 border-white/[0.10] hover:bg-white/[0.10] hover:text-white"     },
  { value: "pilgrimage",  label: "Pilgrimage",  emoji: "🛕", active: "bg-purple-500/25 text-purple-200 border-purple-500/40", inactive: "bg-white/[0.05] text-zinc-400 border-white/[0.10] hover:bg-white/[0.10] hover:text-white" },
  { value: "hill",        label: "Hill",        emoji: "🍃", active: "bg-teal-500/25 text-teal-200 border-teal-500/40",   inactive: "bg-white/[0.05] text-zinc-400 border-white/[0.10] hover:bg-white/[0.10] hover:text-white"     },
];

const MIN_PRICE = 2000;
const MAX_PRICE = 15000;
const USD_RATE  = 133;

function priceColor(price: number) {
  if (price <= 3500) return "bg-green-500/10 text-green-400 border-green-500/20";
  if (price <= 6000) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  return "bg-red-500/10 text-red-400 border-red-500/20";
}

export function PriceBadge({ price }: { price: number }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${priceColor(price)}`}>
      NPR {price.toLocaleString()}
      <span className="opacity-60 font-normal">/ ~${Math.round(price / USD_RATE)}</span>
    </span>
  );
}

const gridContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const gridItemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function SearchableGrid() {
  const [query,     setQuery]     = useState("");
  const [category,  setCategory]  = useState<Category>("all");
  const [maxBudget, setMaxBudget] = useState(MAX_PRICE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return destinations.filter((d) => {
      const matchesCategory = category === "all" || d.category === category;
      const matchesBudget   = d.basePrice <= maxBudget;
      const matchesQuery =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.activities.some((a) => a.toLowerCase().includes(q)) ||
        d.wildlife.some((w)  => w.toLowerCase().includes(q));
      return matchesCategory && matchesBudget && matchesQuery;
    });
  }, [query, category, maxBudget]);

  const budgetPct = ((maxBudget - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

  return (
    <div>
      {/* Search bar */}
      <div className="relative max-w-xl mx-auto mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search by activity e.g. "Trekking", "Tea", "Photography"…'
          className="w-full pl-11 pr-10 py-3.5 rounded-3xl border border-white/[0.12] bg-white/[0.06] backdrop-blur-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/25 transition"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-lg leading-none cursor-pointer"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {categoryFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setCategory(f.value)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer ${
              category === f.value ? f.active : f.inactive
            }`}
          >
            <span>{f.emoji}</span>
            {f.label}
          </button>
        ))}
      </div>

      {/* Budget slider */}
      <div className="max-w-xl mx-auto mb-8 bg-zinc-900/60 backdrop-blur-xl border border-white/[0.10] rounded-3xl px-6 py-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
            Daily Budget
          </span>
          <div className="flex items-center gap-2">
            <PriceBadge price={maxBudget} />
            {maxBudget < MAX_PRICE && (
              <button
                onClick={() => setMaxBudget(MAX_PRICE)}
                className="text-xs text-zinc-500 hover:text-white underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="relative">
          <input
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={500}
            value={maxBudget}
            onChange={(e) => setMaxBudget(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${budgetPct}%, rgba(255,255,255,0.12) ${budgetPct}%, rgba(255,255,255,0.12) 100%)`,
            }}
          />
        </div>

        <div className="flex justify-between mt-1.5 text-xs text-zinc-600">
          <span>NPR 2,000 / ~$15</span>
          <span>NPR 15,000 / ~$113</span>
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-zinc-600 text-center mb-8">
        {filtered.length === destinations.length
          ? `Showing all ${destinations.length} destinations`
          : `${filtered.length} of ${destinations.length} destinations`}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <motion.div
          key={`${category}-${query}-${maxBudget}`}
          variants={gridContainerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((d) => (
            <motion.div key={d.id} variants={gridItemVariants}>
              <DestinationCard destination={d} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">🏔️</p>
          <p className="text-zinc-300 font-semibold text-lg">No destinations in this budget</p>
          <p className="text-zinc-500 text-sm mt-2">
            Try raising the slider or clearing the search
          </p>
          <button
            onClick={() => { setMaxBudget(MAX_PRICE); setQuery(""); setCategory("all"); }}
            className="mt-4 text-sm text-red-400 hover:text-red-300 underline cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
