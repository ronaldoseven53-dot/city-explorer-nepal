"use client";

import { useState } from "react";
import { destinations, Destination } from "@/data/destinations";
import DestinationCard from "./DestinationCard";

type FilterCategory = "all" | Destination["category"];

const filters: {
  value: FilterCategory;
  label: string;
  active: string;
  inactive: string;
}[] = [
  {
    value: "all",
    label: "All Destinations",
    active: "bg-gray-900 text-white",
    inactive: "bg-white text-gray-700 border border-gray-200 hover:border-gray-400",
  },
  {
    value: "mountain",
    label: "🏔 Mountain & Trekking",
    active: "bg-blue-600 text-white",
    inactive: "bg-white text-blue-700 border border-blue-200 hover:border-blue-400",
  },
  {
    value: "heritage",
    label: "🏛 Heritage & Culture",
    active: "bg-amber-600 text-white",
    inactive: "bg-white text-amber-700 border border-amber-200 hover:border-amber-400",
  },
  {
    value: "nature",
    label: "🌿 Nature & Scenic",
    active: "bg-green-600 text-white",
    inactive: "bg-white text-green-700 border border-green-200 hover:border-green-400",
  },
  {
    value: "pilgrimage",
    label: "🕌 Pilgrimage",
    active: "bg-purple-600 text-white",
    inactive: "bg-white text-purple-700 border border-purple-200 hover:border-purple-400",
  },
  {
    value: "hill",
    label: "🍃 Hill Station",
    active: "bg-teal-600 text-white",
    inactive: "bg-white text-teal-700 border border-teal-200 hover:border-teal-400",
  },
];

export default function DestinationsSection() {
  const [active, setActive] = useState<FilterCategory>("all");

  const filtered =
    active === "all"
      ? destinations
      : destinations.filter((d) => d.category === active);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-1">Explore Destinations</h2>
        <p className="text-gray-500 text-sm">Filter by type of experience</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActive(f.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
              active === f.value ? f.active : f.inactive
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400 mb-6">
        Showing {filtered.length} of {destinations.length} destinations
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((destination) => (
          <DestinationCard key={destination.id} destination={destination} />
        ))}
      </div>
    </section>
  );
}
