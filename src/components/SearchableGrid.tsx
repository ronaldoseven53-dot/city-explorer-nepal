"use client";

import { useState, useMemo } from "react";
import { destinations, Destination } from "@/data/destinations";
import DestinationCard from "./DestinationCard";

type Category = "all" | Destination["category"];

const categoryFilters: { value: Category; label: string; emoji: string; active: string; inactive: string }[] = [
  { value: "all",        label: "All",        emoji: "🗺️", active: "bg-gray-900 text-white border-gray-900",       inactive: "bg-white text-gray-600 border-gray-200 hover:border-gray-400"    },
  { value: "mountain",   label: "Mountain",   emoji: "🏔️", active: "bg-blue-600 text-white border-blue-600",        inactive: "bg-white text-blue-700 border-blue-200 hover:border-blue-400"    },
  { value: "heritage",   label: "Heritage",   emoji: "🏛️", active: "bg-amber-600 text-white border-amber-600",      inactive: "bg-white text-amber-700 border-amber-200 hover:border-amber-400"  },
  { value: "nature",     label: "Nature",     emoji: "🌿", active: "bg-green-600 text-white border-green-600",      inactive: "bg-white text-green-700 border-green-200 hover:border-green-400"  },
  { value: "pilgrimage", label: "Pilgrimage", emoji: "🛕", active: "bg-purple-600 text-white border-purple-600",    inactive: "bg-white text-purple-700 border-purple-200 hover:border-purple-400"},
  { value: "hill",       label: "Hill",       emoji: "🍃", active: "bg-teal-600 text-white border-teal-600",        inactive: "bg-white text-teal-700 border-teal-200 hover:border-teal-400"    },
];

export default function SearchableGrid() {
  const [query,    setQuery]    = useState("");
  const [category, setCategory] = useState<Category>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return destinations.filter((d) => {
      const matchesCategory = category === "all" || d.category === category;
      const matchesQuery =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.activities.some((a) => a.toLowerCase().includes(q)) ||
        d.wildlife.some((w) => w.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

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
          <p className="text-gray-600 font-semibold text-lg">No destinations found</p>
          <p className="text-gray-400 text-sm mt-2">
            Try clearing the search or selecting a different category
          </p>
        </div>
      )}
    </div>
  );
}
