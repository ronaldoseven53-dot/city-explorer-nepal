import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { categoryGroups } from "@/data/destinations";
import Navbar from "@/components/Navbar";
import DestinationCard from "@/components/DestinationCard";
import TransitionLink from "@/components/TransitionLink";

export function generateStaticParams() {
  return categoryGroups.map((g) => ({ id: g.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const group = categoryGroups.find((g) => g.id === id);
  if (!group) return {};
  return {
    title: `${group.name} — City Explorer Nepal`,
    description: group.description,
  };
}

export default async function CategoryPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const group = categoryGroups.find((g) => g.id === id);
  if (!group) notFound();

  const coverImage = group.spots[0].placeholderImage;

  return (
    <>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="pt-16">
        <div className="relative h-64 sm:h-80 overflow-hidden bg-slate-700">
          <Image
            src={coverImage}
            alt={group.name}
            fill
            sizes="100vw"
            className="object-cover"
            priority
            style={{ viewTransitionName: `category-cover-${group.id}` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Back button */}
          <TransitionLink
            href="/"
            className="absolute top-5 left-5 flex items-center gap-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-full transition-colors"
          >
            ← All Categories
          </TransitionLink>

          {/* Title block */}
          <div className="absolute bottom-6 left-5 right-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl drop-shadow">{group.emoji}</span>
              <span className="bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                {group.spots.length} {group.spots.length === 1 ? "Destination" : "Destinations"}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              {group.name}
            </h1>
            <p className="text-white/65 text-sm mt-2 max-w-2xl leading-relaxed line-clamp-2">
              {group.description}
            </p>
          </div>
        </div>
      </div>

      {/* ── Spots grid ───────────────────────────────────────── */}
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {group.spots.map((spot) => (
              <DestinationCard key={spot.id} destination={spot} />
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <p>© 2025 City Explorer Nepal · Explore the Himalayas 🏔️</p>
      </footer>
    </>
  );
}
