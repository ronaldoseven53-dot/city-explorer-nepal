"use client";

import { useState, useMemo } from "react";
import { destinations, Destination } from "@/data/destinations";
import DestinationCard from "./DestinationCard";

type Category = "all" | Destination["category"];

const categoryFilters: { value: Category; label: string; emoji: string; active: string; inactive: string }[] = [
  { value: "all",         label: "All",         emoji: "🗺️", active: "bg-gray-900 text-white border-gray-900",       inactive: "bg-white text-gray-600 border-gray-200 hover:border-gray-400"    },
  { value: "agriculture", label: "Agriculture", emoji: "🌾", active: "bg-lime-600 text-white border-lime-600",        inactive: "bg-white text-lime-700 border-lime-200 hover:border-lime-400"    },
  { value: "mountain",    label: "Mountain",    emoji: "🏔️", active: "bg-blue-600 text-white border-blue-600",        inactive: "bg-white text-blue-700 border-blue-200 hover:border-blue-400"    },
  { value: "heritage",    label: "Heritage",    emoji: "🏛️", active: "bg-amber-600 text-white border-amber-600",      inactive: "bg-white text-amber-700 border-amber-200 hover:border-amber-400"  },
  { value: "nature",      label: "Nature",      emoji: "🌿", active: "bg-green-600 text-white border-green-600",      inactive: "bg-white text-green-700 border-green-200 hover:border-green-400"  },
  { value: "pilgrimage",  label: "Pilgrimage",  emoji: "🛕", active: "bg-purple-600 text-white border-purple-600",    inactive: "bg-white text-purple-700 border-purple-200 hover:border-purple-400"},
  { value: "hill",        label: "Hill",        emoji: "🍃", active: "bg-teal-600 text-white border-teal-600",        inactive: "bg-white text-teal-700 border-teal-200 hover:border-teal-400"    },
];

const MIN_PRICE = 2000;
const MAX_PRICE = 15000;
const USD_RATE  = 133; // 1 USD ≈ 133 NPR

function priceColor(price: number) {
  if (price <= 3500) return "bg-green-50 text-green-700 border-green-200";
  if (price <= 6000) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-red-50 text-red-700 border-red-200";
}

export function PriceBadge({ price }: { price: number }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${priceColor(price)}`}>
      NPR {price.toLocaleString()}
      <span className="opacity-60 font-normal">/ ~${Math.round(price / USD_RATE)}</span>
    </span>
  );
}

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
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          🔍
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search by activity e.g. "Trekking", "Tea", "Photography"…'
          className="w-full pl-11 pr-10 py-3.5 rounded-xl border border-gray-200 bg-white shadow-sm text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none cursor-pointer"
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
      <div className="max-w-xl mx-auto mb-8 bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Daily Budget
          </span>
          <div className="flex items-center gap-2">
            <PriceBadge price={maxBudget} />
            {maxBudget < MAX_PRICE && (
              <button
                onClick={() => setMaxBudget(MAX_PRICE)}
                className="text-xs text-gray-400 hover:text-gray-600 underline cursor-pointer"
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
              background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${budgetPct}%, #e5e7eb ${budgetPct}%, #e5e7eb 100%)`,
            }}
          />
        </div>

        <div className="flex justify-between mt-1.5 text-xs text-gray-400">
          <span>NPR 2,000 / ~$15</span>
          <span>NPR 15,000 / ~$113</span>
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-gray-400 text-center mb-8">
        {filtered.length === destinations.length
          ? `Showing all ${destinations.length} destinations`
          : `${filtered.length} of ${destinations.length} destinations`}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((d) => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">🏔️</p>
          <p className="text-gray-600 font-semibold text-lg">No destinations in this budget</p>
          <p className="text-gray-400 text-sm mt-2">
            Try raising the slider or clearing the search
          </p>
          <button
            onClick={() => { setMaxBudget(MAX_PRICE); setQuery(""); setCategory("all"); }}
            className="mt-4 text-sm text-red-600 hover:text-red-800 underline cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
