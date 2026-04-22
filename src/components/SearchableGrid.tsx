"use client";

import { useState, useMemo } from "react";
import { destinations } from "@/data/destinations";
import DestinationCard from "./DestinationCard";

export default function SearchableGrid() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return destinations;
    return destinations.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.activities.some((a) => a.toLowerCase().includes(q)) ||
        d.wildlife.some((w) => w.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div>
      {/* Search bar */}
      <div className="relative max-w-xl mx-auto mb-4">
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

      {/* Result count */}
      <p className="text-xs text-gray-400 text-center mb-8">
        {filtered.length === destinations.length
          ? `Showing all ${destinations.length} destinations`
          : `${filtered.length} of ${destinations.length} destinations match "${query}"`}
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
          <p className="text-gray-600 font-semibold text-lg">
            No destinations match &ldquo;{query}&rdquo;
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Try &ldquo;Trekking&rdquo;, &ldquo;Tea&rdquo;, &ldquo;Temple&rdquo;, &ldquo;Snow leopard&rdquo;, or a city name
          </p>
        </div>
      )}
    </div>
  );
}
