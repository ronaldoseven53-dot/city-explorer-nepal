"use client";

import Image from "next/image";
import TransitionLink from "@/components/TransitionLink";
import { categoryGroups } from "@/data/destinations";

const groupAccent: Record<string, string> = {
  agriculture: "from-lime-900/80 via-lime-800/40",
  adventure:   "from-blue-900/80 via-blue-800/40",
  trekking:    "from-slate-900/80 via-slate-700/40",
  heritage:    "from-amber-900/80 via-amber-800/40",
  nature:      "from-green-900/80 via-green-800/40",
  pilgrimage:  "from-purple-900/80 via-purple-800/40",
};

const groupBadge: Record<string, string> = {
  agriculture: "bg-lime-500/20 text-lime-200 border-lime-400/30",
  adventure:   "bg-blue-500/20 text-blue-200 border-blue-400/30",
  trekking:    "bg-slate-500/20 text-slate-200 border-slate-400/30",
  heritage:    "bg-amber-500/20 text-amber-200 border-amber-400/30",
  nature:      "bg-green-500/20 text-green-200 border-green-400/30",
  pilgrimage:  "bg-purple-500/20 text-purple-200 border-purple-400/30",
};

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {categoryGroups.map((group) => {
        const coverImage = group.spots[0].placeholderImage;
        const accent     = groupAccent[group.id] ?? "from-slate-900/80 via-slate-700/40";
        const badge      = groupBadge[group.id]  ?? "bg-white/10 text-white border-white/20";

        return (
          <TransitionLink
            key={group.id}
            href={`/experience/${group.id}`}
            className="relative h-72 rounded-2xl overflow-hidden group block shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            {/* Background image */}
            <Image
              src={coverImage}
              alt={group.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              style={{ viewTransitionName: `category-cover-${group.id}` }}
            />

            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${accent} to-transparent`} />

            {/* Spot count tag — top right */}
            <span className={`absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full border backdrop-blur-sm ${badge}`}>
              {group.spots.length} {group.spots.length === 1 ? "Spot" : "Spots"}
            </span>

            {/* Content — bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-3xl mb-1 drop-shadow">{group.emoji}</p>
              <h3 className="text-xl font-extrabold text-white leading-tight drop-shadow">
                {group.name}
              </h3>
              <p className="text-white/65 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                {group.description}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white/70 group-hover:text-white transition-colors duration-200">
                Explore {group.spots.length} destination{group.spots.length !== 1 ? "s" : ""} →
              </span>
            </div>
          </TransitionLink>
        );
      })}
    </div>
  );
}
