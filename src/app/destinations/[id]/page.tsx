import { notFound } from "next/navigation";
import { Suspense } from "react";
import TransitionLink from "@/components/TransitionLink";
import Image from "next/image";
import type { Metadata } from "next";
import { destinations, getCategoryLabel } from "@/data/destinations";
import Navbar from "@/components/Navbar";
import WeatherBadgeServer from "@/components/WeatherBadgeServer";
import ShareButton from "@/components/ShareButton";
import PackingList from "@/components/PackingList";
import FavoriteButton from "@/components/FavoriteButton";
import { getActivityIcon, getWildlifeIcon } from "@/lib/activityIcons";
import SingleDestinationMapLoader from "@/components/SingleDestinationMapLoader";
import VisitTracker from "@/components/VisitTracker";
import AIPlanButton from "@/components/AIPlanButtonLazy";
import { Mountain, Calendar, MapPin } from "lucide-react";

const categoryStyles: Record<
  string,
  { badge: string; lightBg: string; lightText: string; border: string }
> = {
  mountain:   { badge: "bg-blue-600",   lightBg: "bg-blue-50",   lightText: "text-blue-700",   border: "border-blue-100"   },
  heritage:   { badge: "bg-amber-600",  lightBg: "bg-amber-50",  lightText: "text-amber-700",  border: "border-amber-100"  },
  nature:     { badge: "bg-green-600",  lightBg: "bg-green-50",  lightText: "text-green-700",  border: "border-green-100"  },
  pilgrimage: { badge: "bg-purple-600", lightBg: "bg-purple-50", lightText: "text-purple-700", border: "border-purple-100" },
  hill:        { badge: "bg-teal-600",   lightBg: "bg-teal-50",   lightText: "text-teal-700",   border: "border-teal-100"   },
  agriculture: { badge: "bg-lime-600",   lightBg: "bg-lime-50",   lightText: "text-lime-700",   border: "border-lime-100"   },
};

export function generateStaticParams() {
  return destinations.map((d) => ({ id: d.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const d = destinations.find((d) => d.id === id);
  if (!d) return {};
  return {
    title: `${d.name} — City Explorer Nepal`,
    description: d.description.slice(0, 155) + "…",
  };
}

export default async function DestinationPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const d = destinations.find((dest) => dest.id === id);
  if (!d) notFound();

  const s = categoryStyles[d.category];
  const regionLabel = d.region.split(",")[0];

  return (
    <>
      <VisitTracker id={d.id} />
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────── */}
      <div className="pt-16">
        <div className="relative h-72 sm:h-[420px] overflow-hidden bg-gradient-to-br from-slate-400 to-slate-600">
          <Image
            src={d.placeholderImage}
            alt={`${d.name} — ${d.region}`}
            fill
            sizes="100vw"
            className="object-cover"
            priority
            style={{ viewTransitionName: `hero-${d.id}` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Back button */}
          <TransitionLink
            href="/"
            className="absolute top-5 left-5 flex items-center gap-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-full transition-colors"
          >
            ← Back
          </TransitionLink>

          {/* Name + badges */}
          <div className="absolute bottom-6 left-5 right-5">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`${s.badge} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                {getCategoryLabel(d.category)}
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
                {regionLabel}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
              {d.name}
            </h1>
            <p className="text-white/70 text-sm mt-1">{d.province} Province, Nepal</p>
          </div>
        </div>
      </div>

      {/* ── Quick-stats bar ────────────────────────────────── */}
      <div
        className="bg-white/85 backdrop-blur-xl border-b border-black/[0.06] sticky top-16 z-30"
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.95)" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center gap-x-8 gap-y-3">
          {d.elevation && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                <Mountain className="w-4 h-4 text-blue-500" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Elevation</p>
                <p className="text-sm font-semibold text-zinc-800">{d.elevation}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-amber-500" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Best Time</p>
              <p className="text-sm font-semibold text-zinc-800">{d.bestTimeToVisit}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-emerald-500" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Province</p>
              <p className="text-sm font-semibold text-zinc-800">{d.province}</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div>
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Live Weather</p>
              <Suspense fallback={<div className="h-7 w-24 bg-sky-50 rounded-full animate-pulse" />}>
                <WeatherBadgeServer lat={d.coordinates.lat} lng={d.coordinates.lng} />
              </Suspense>
            </div>
            <PackingList
              destination={d.name}
              category={d.category}
              elevation={d.elevation}
              lat={d.coordinates.lat}
              lng={d.coordinates.lng}
            />
            <FavoriteButton destinationId={d.id} />
            <ShareButton name={d.name} />
          </div>
        </div>
      </div>

      {/* ── Main content ───────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-14">

        {/* About */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About {d.name}</h2>
          <p className="text-gray-600 text-base leading-relaxed">{d.description}</p>
        </section>

        {/* AI Planner CTA */}
        <section>
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 px-8 py-10 text-center">
            {/* Decorative glow blobs */}
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-red-700/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-orange-700/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">
                ✨ Powered by Gemini AI
              </p>
              <h3 className="text-white font-extrabold text-2xl sm:text-3xl mb-2">
                Ready to explore {d.name}?
              </h3>
              <p className="text-white/50 text-sm mb-7 max-w-sm mx-auto leading-relaxed">
                Get a personalised 2-day itinerary built around the best {getCategoryLabel(d.category).toLowerCase()} experiences here.
              </p>
              <Suspense fallback={<div className="inline-flex items-center gap-3 h-14 w-56 bg-white/10 rounded-2xl animate-pulse" />}>
                <AIPlanButton name={d.name} category={getCategoryLabel(d.category)} />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Activities + Wildlife — bento grid */}
        <div className="grid sm:grid-cols-2 gap-8">

          {/* Activities */}
          <section>
            <div className="flex items-center gap-2.5 mb-4">
              <h2 className="text-xl font-bold text-zinc-900">Activities</h2>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200/80 uppercase tracking-wide">
                Adventure
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {d.activities.map((activity) => (
                <div
                  key={activity}
                  className="flex items-center gap-2.5 p-3 rounded-2xl border border-white/80 hover:border-white hover:shadow-md transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.65)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.95)",
                  }}
                >
                  <span className="text-xl flex-shrink-0">{getActivityIcon(activity)}</span>
                  <span className="text-xs font-semibold text-zinc-700 leading-tight">{activity}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Wildlife */}
          <section>
            <div className="flex items-center gap-2.5 mb-4">
              <h2 className="text-xl font-bold text-zinc-900">Wildlife</h2>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200/80 uppercase tracking-wide">
                Nature
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {d.wildlife.map((animal) => (
                <div
                  key={animal}
                  className="flex items-center gap-2.5 p-3 rounded-2xl border border-white/80 hover:border-white hover:shadow-md transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.65)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.95)",
                  }}
                >
                  <span className="text-xl flex-shrink-0">{getWildlifeIcon(animal)}</span>
                  <span className="text-xs font-semibold text-zinc-700 leading-tight">{animal}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Highlights */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 mb-5">Must-See Highlights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {d.highlights.map((highlight) => (
              <div
                key={highlight}
                className="relative h-36 rounded-2xl overflow-hidden group"
                style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-110"
                  style={{ backgroundImage: `url('${d.placeholderImage}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-bold text-sm leading-tight drop-shadow-sm">{highlight}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Getting There */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting There</h2>
          <div className={`flex items-start gap-4 p-5 rounded-2xl border ${s.border} ${s.lightBg}`}>
            <span className="text-2xl flex-shrink-0">🚌</span>
            <p className={`text-sm leading-relaxed ${s.lightText}`}>{d.gettingThere}</p>
          </div>
        </section>

        {/* Travel Tips */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Travel Tips</h2>
          <ul className="space-y-3">
            {d.travelTips.map((tip, i) => (
              <li
                key={i}
                className={`flex items-start gap-3 p-4 rounded-xl border ${s.border} ${s.lightBg}`}
              >
                <span className={`text-base font-bold flex-shrink-0 ${s.lightText}`}>💡</span>
                <span className={`text-sm leading-relaxed ${s.lightText}`}>{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Map */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Location</h2>
          <SingleDestinationMapLoader destination={d} />
          <p className="text-xs text-gray-400 mt-2 text-center">
            {d.coordinates.lat.toFixed(4)}° N, {d.coordinates.lng.toFixed(4)}° E
          </p>
        </section>

        {/* Related Destinations */}
        {(() => {
          const related = destinations
            .filter((r) => r.id !== d.id && r.category === d.category)
            .slice(0, 3);
          if (related.length === 0) return null;
          return (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-5">
                More {getCategoryLabel(d.category)} Destinations
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((r) => {
                  const rs = categoryStyles[r.category];
                  return (
                    <TransitionLink
                      key={r.id}
                      href={`/destinations/${r.id}`}
                      className="group rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative h-36 bg-slate-200">
                        <Image
                          src={r.placeholderImage}
                          alt={r.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          style={{ viewTransitionName: `hero-${r.id}` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <span className={`absolute bottom-2 left-2 ${rs.badge} text-white text-xs font-semibold px-2 py-0.5 rounded-full`}>
                          {r.region.split(",")[0]}
                        </span>
                      </div>
                      <div className="p-3 bg-white">
                        <p className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{r.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{r.province} Province{r.elevation && ` · ${r.elevation}`}</p>
                      </div>
                    </TransitionLink>
                  );
                })}
              </div>
            </section>
          );
        })()}
      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm mt-8">
        <p>© 2025 City Explorer Nepal · Explore the Himalayas 🏔️</p>
      </footer>
    </>
  );
}
