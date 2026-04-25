import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { categoryGroups, type Spot } from "@/data/destinations";
import Navbar from "@/components/Navbar";
import TransitionLink from "@/components/TransitionLink";

// ── Static generation ─────────────────────────────────────────────
export function generateStaticParams() {
  return categoryGroups.map((g) => ({ category: g.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ category: string }> }
): Promise<Metadata> {
  const { category } = await params;
  const group = categoryGroups.find((g) => g.id === category);
  if (!group) return {};
  return {
    title: `${group.name} Experiences — City Explorer Nepal`,
    description: group.description,
  };
}

// ── Theme tokens ──────────────────────────────────────────────────
type Theme = {
  gradient: string; dotBg: string; dotRing: string;
  tagBg: string; tagText: string; lineBg: string;
  sectionBg: string; iconBg: string; border: string; headText: string;
};

const theme: Record<string, Theme> = {
  agriculture: {
    gradient: "from-lime-950 via-lime-900 to-slate-900",
    dotBg: "bg-lime-500",    dotRing: "ring-lime-300/40",
    tagBg: "bg-lime-500/20", tagText: "text-lime-200",
    lineBg: "bg-lime-700/40", sectionBg: "bg-lime-50",
    iconBg: "bg-lime-100 text-lime-700", border: "border-lime-100",
    headText: "text-lime-700",
  },
  adventure: {
    gradient: "from-blue-950 via-blue-900 to-slate-900",
    dotBg: "bg-blue-500",    dotRing: "ring-blue-300/40",
    tagBg: "bg-blue-500/20", tagText: "text-blue-200",
    lineBg: "bg-blue-700/40", sectionBg: "bg-blue-50",
    iconBg: "bg-blue-100 text-blue-700", border: "border-blue-100",
    headText: "text-blue-700",
  },
  trekking: {
    gradient: "from-slate-950 via-slate-800 to-slate-900",
    dotBg: "bg-slate-400",    dotRing: "ring-slate-300/40",
    tagBg: "bg-slate-500/20", tagText: "text-slate-200",
    lineBg: "bg-slate-600/40", sectionBg: "bg-slate-50",
    iconBg: "bg-slate-100 text-slate-700", border: "border-slate-100",
    headText: "text-slate-700",
  },
  heritage: {
    gradient: "from-amber-950 via-amber-900 to-slate-900",
    dotBg: "bg-amber-500",    dotRing: "ring-amber-300/40",
    tagBg: "bg-amber-500/20", tagText: "text-amber-200",
    lineBg: "bg-amber-700/40", sectionBg: "bg-amber-50",
    iconBg: "bg-amber-100 text-amber-700", border: "border-amber-100",
    headText: "text-amber-700",
  },
  nature: {
    gradient: "from-green-950 via-green-900 to-slate-900",
    dotBg: "bg-green-500",    dotRing: "ring-green-300/40",
    tagBg: "bg-green-500/20", tagText: "text-green-200",
    lineBg: "bg-green-700/40", sectionBg: "bg-green-50",
    iconBg: "bg-green-100 text-green-700", border: "border-green-100",
    headText: "text-green-700",
  },
  pilgrimage: {
    gradient: "from-purple-950 via-purple-900 to-slate-900",
    dotBg: "bg-purple-500",    dotRing: "ring-purple-300/40",
    tagBg: "bg-purple-500/20", tagText: "text-purple-200",
    lineBg: "bg-purple-700/40", sectionBg: "bg-purple-50",
    iconBg: "bg-purple-100 text-purple-700", border: "border-purple-100",
    headText: "text-purple-700",
  },
};
const fallbackTheme = theme.trekking;

// ── Agriculture special metadata ──────────────────────────────────
const agriMeta: Record<string, {
  badge?: { label: string; color: string };
  featured?: boolean;
  warning?: string;
}> = {
  lamjung: {
    featured: true,
    badge: { label: "⚠️ Cliff Harvest", color: "bg-red-600 text-white" },
    warning: "Harvested by Gurung hunters dangling on ropes over 100 m cliffs. Psychoactive — consume tiny amounts only.",
  },
  dolpa: {
    badge: { label: "🔒 Restricted Area", color: "bg-orange-500 text-white" },
  },
  ilam: {
    badge: { label: "🌿 Organic Estates", color: "bg-lime-600 text-white" },
  },
};

// ── Adventure difficulty map ──────────────────────────────────────
type Difficulty = "Easy" | "Moderate" | "Hard";

const difficultyMap: Record<string, Difficulty> = {
  // Pokhara
  "Paragliding over the Annapurna range":          "Hard",
  "Annapurna Circuit & Poon Hill trekking":         "Hard",
  "Boating and kayaking on Phewa Lake":             "Easy",
  "Zip-lining across the valley":                   "Easy",
  "White-water rafting on the Seti River":          "Moderate",
  "Sunrise hike to Sarangkot viewpoint":            "Easy",
  "Cave exploration at Gupteswar":                  "Easy",
  "Ultralight aircraft flights":                    "Easy",
  // Mustang
  "Trekking the Upper Mustang trail to Lo Manthang": "Hard",
  "Exploring sky caves of Chhoser":                  "Moderate",
  "Jeep safari through canyon landscapes":           "Easy",
  "Attending the Tiji Festival (May)":               "Easy",
  "Visiting ancient Tibetan gompas and monasteries": "Easy",
  "Muktinath Temple pilgrimage":                     "Moderate",
  "Photography in the sculpted canyon badlands":     "Easy",
  // Chitwan
  "Jeep safari through the national park":           "Easy",
  "Elephant-back safari (observation only)":         "Easy",
  "Canoe ride on the Rapti River":                   "Easy",
  "Jungle walking safari with a naturalist guide":   "Moderate",
  "Tharu cultural village tour and dance show":      "Easy",
  "Birdwatching (over 540 species recorded)":        "Easy",
  "Sunrise river walk along the Rapti":              "Easy",
  // Kalinchowk
  "Skiing and snowboarding (December – February)":   "Moderate",
  "Cable car ride to Kalinchowk Bhagwati Temple":   "Easy",
  "Himalayan sunrise viewpoint photography":         "Easy",
  "Snow play and winter trekking":                   "Easy",
  "Pilgrimage to Kalinchowk Bhagwati Shrine":       "Easy",
  "Paragliding (spring and autumn)":                 "Moderate",
  "High-altitude nature walks":                      "Moderate",
};

const difficultyStyle: Record<Difficulty, string> = {
  Easy:     "bg-green-100 text-green-700 border-green-200",
  Moderate: "bg-amber-100 text-amber-700 border-amber-200",
  Hard:     "bg-red-100   text-red-700   border-red-200",
};

// ═══════════════════════════════════════════════════════════════════
// LAYOUTS
// ═══════════════════════════════════════════════════════════════════

// ── 1. Agriculture Feature Grid ───────────────────────────────────
function AgricultureFeatureGrid({ spots, category }: { spots: Spot[]; category: string }) {
  const featured = spots.find((s) => s.id === "lamjung") ?? spots[0];
  const secondary = spots.filter((s) => s.id !== featured.id);
  const featMeta = agriMeta[featured.id] ?? {};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

      {/* ── Featured card (2 cols) ── */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-lime-100 overflow-hidden flex flex-col">
        {/* Image with badges */}
        <div className="relative h-72 sm:h-80 flex-shrink-0">
          <Image
            src={featured.placeholderImage}
            alt={featured.name}
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          {/* Badges row */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="bg-lime-400/20 backdrop-blur-sm text-lime-200 text-xs font-bold px-3 py-1 rounded-full border border-lime-400/30 uppercase tracking-wide">
              ⭐ Featured
            </span>
            {featMeta.badge && (
              <span className={`${featMeta.badge.color} text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                {featMeta.badge.label}
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-5 right-5">
            <h2 className="text-3xl font-extrabold text-white drop-shadow-lg">{featured.name}</h2>
            <p className="text-white/70 text-xs mt-0.5">
              📍 {featured.province} Province · {featured.region}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 flex-1 space-y-5">

          {/* Warning box for cliff harvest */}
          {featMeta.warning && (
            <div className="flex gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
              <span className="text-red-500 text-xl flex-shrink-0">⚠️</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-red-700 mb-0.5">Cliff Harvest Warning</p>
                <p className="text-sm text-red-700 leading-relaxed">{featMeta.warning}</p>
              </div>
            </div>
          )}

          {/* 💡 Why special */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-lime-700 mb-3">💡 Why It&apos;s Special</p>
            <ul className="space-y-2">
              {featured.highlights.slice(0, 4).map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-lime-100 text-lime-700 flex-shrink-0 flex items-center justify-center text-xs font-bold">✦</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>

          {/* Activities */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-lime-700 mb-3">🎯 Key Experiences</p>
            <div className="flex flex-wrap gap-2">
              {featured.activities.slice(0, 5).map((a) => (
                <span key={a} className="text-xs font-medium px-3 py-1.5 rounded-full border border-lime-100 bg-lime-50 text-lime-700">{a}</span>
              ))}
            </div>
          </div>

          {/* ⚠️ Reality checks */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-3">⚠️ Reality Checks</p>
            <ul className="space-y-2">
              {featured.travelTips.slice(0, 3).map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-amber-800">
                  <span className="mt-0.5 text-amber-500 flex-shrink-0">•</span>{t}
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Est. daily budget</p>
              <p className="text-sm font-bold text-gray-800">
                NPR {featured.basePrice.toLocaleString()}
                <span className="text-gray-400 font-normal"> / ~${Math.round(featured.basePrice / 133)}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <TransitionLink
                href={`/experience/${category}/${featured.id}`}
                className="inline-flex items-center gap-1.5 text-sm font-bold px-5 py-2.5 rounded-xl bg-lime-100 text-lime-700 hover:bg-lime-200 transition-colors border border-lime-200"
              >
                Activities →
              </TransitionLink>
              <TransitionLink
                href={`/destinations/${featured.id}`}
                className="inline-flex items-center gap-1.5 text-sm font-bold px-5 py-2.5 rounded-xl bg-lime-600 text-white hover:bg-lime-700 transition-colors"
              >
                Full Guide →
              </TransitionLink>
            </div>
          </div>
        </div>
      </div>

      {/* ── Secondary cards (1 col, stacked) ── */}
      <div className="flex flex-col gap-5">
        {secondary.map((spot) => {
          const meta = agriMeta[spot.id] ?? {};
          return (
            <div key={spot.id} className="bg-white rounded-2xl shadow-sm border border-lime-100 overflow-hidden flex flex-col flex-1">
              <div className="relative h-44 flex-shrink-0">
                <Image src={spot.placeholderImage} alt={spot.name} fill sizes="33vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                {meta.badge && (
                  <span className={`absolute top-3 left-3 ${meta.badge.color} text-xs font-bold px-2.5 py-1 rounded-full shadow`}>
                    {meta.badge.label}
                  </span>
                )}
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-lg font-bold text-white">{spot.name}</h3>
                  <p className="text-white/60 text-xs">📍 {spot.province} Province</p>
                </div>
              </div>

              <div className="p-4 flex-1 space-y-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-lime-700 mb-2">💡 Why It&apos;s Special</p>
                  <ul className="space-y-1.5">
                    {spot.highlights.slice(0, 2).map((h) => (
                      <li key={h} className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-lime-500 mt-0.5 flex-shrink-0">✦</span>{h}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                  <p className="text-xs font-bold text-amber-700 mb-1.5">⚠️ Reality Check</p>
                  <p className="text-xs text-amber-800">{spot.travelTips[0]}</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-500">
                    NPR {spot.basePrice.toLocaleString()} <span className="font-normal text-gray-400">/ day</span>
                  </p>
                  <TransitionLink
                    href={`/destinations/${spot.id}`}
                    className="text-xs font-bold text-lime-700 hover:text-lime-900 transition-colors"
                  >
                    Full Guide →
                  </TransitionLink>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── 2. Adventure Grid (with difficulty badges) ────────────────────
function AdventureGrid({ spots }: { spots: Spot[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {spots.map((spot) => (
        <div key={spot.id} className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden flex flex-col">
          {/* Image */}
          <div className="relative h-52 flex-shrink-0">
            <Image src={spot.placeholderImage} alt={spot.name} fill sizes="(max-width:640px) 100vw, 50vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <span className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
              🗓 {spot.bestTimeToVisit}
            </span>
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-xl font-extrabold text-white">{spot.name}</h3>
              <p className="text-white/65 text-xs mt-0.5">📍 {spot.province} Province</p>
            </div>
          </div>

          <div className="p-5 flex-1 space-y-4">
            {/* 📍 Location snippet */}
            <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{spot.description.slice(0, 130)}…</p>

            {/* 💡 Why it's special */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-700 mb-2">💡 Why It&apos;s Special</p>
              <ul className="space-y-1.5">
                {spot.highlights.slice(0, 2).map((h) => (
                  <li key={h} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="text-blue-500 mt-0.5 flex-shrink-0">✦</span>{h}
                  </li>
                ))}
              </ul>
            </div>

            {/* 🎯 Activities with difficulty badges */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-700 mb-3">🎯 Activities &amp; Difficulty</p>
              <ul className="space-y-2">
                {spot.activities.map((activity) => {
                  const level: Difficulty = difficultyMap[activity] ?? "Moderate";
                  return (
                    <li key={activity} className="flex items-center justify-between gap-3">
                      <span className="text-xs text-gray-700 leading-snug flex-1">{activity}</span>
                      <span className={`flex-shrink-0 text-xs font-bold px-2.5 py-0.5 rounded-full border ${difficultyStyle[level]}`}>
                        {level}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* ⚠️ Reality checks */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2">⚠️ Reality Checks</p>
              <ul className="space-y-1.5">
                {spot.travelTips.slice(0, 2).map((t) => (
                  <li key={t} className="flex items-start gap-2 text-xs text-amber-800">
                    <span className="mt-0.5 text-amber-500 flex-shrink-0">•</span>{t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-1">
              <p className="text-sm font-bold text-gray-800">
                NPR {spot.basePrice.toLocaleString()}
                <span className="text-gray-400 font-normal text-xs"> / ~${Math.round(spot.basePrice / 133)}</span>
              </p>
              <TransitionLink
                href={`/destinations/${spot.id}`}
                className="text-sm font-bold px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Full Guide →
              </TransitionLink>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 3. Timeline (default for other categories) ────────────────────
function TimelineCard({
  spot, index, t, isLast,
}: {
  spot: Spot; index: number; t: Theme; isLast: boolean;
}) {
  return (
    <div className="relative flex gap-6">
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-10 h-10 rounded-full ${t.dotBg} ring-4 ${t.dotRing} flex items-center justify-center z-10 shadow-md`}>
          <span className="text-white font-bold text-sm">{index + 1}</span>
        </div>
        {!isLast && <div className={`w-0.5 flex-1 mt-2 ${t.lineBg} min-h-8`} />}
      </div>

      <div className={`flex-1 mb-12 bg-white rounded-2xl shadow-sm border ${t.border} overflow-hidden`}>
        <div className="relative h-52 sm:h-64">
          <Image src={spot.placeholderImage} alt={spot.name} fill sizes="(max-width:640px) 100vw, 800px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <span className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">🗓 {spot.bestTimeToVisit}</span>
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-extrabold text-white">{spot.name}</h2>
            {spot.elevation && <p className="text-white/70 text-xs mt-0.5">⛰ {spot.elevation}</p>}
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          <div>
            <p className={`text-xs font-bold uppercase tracking-widest ${t.headText} mb-1`}>📍 Location</p>
            <p className="text-gray-700 text-sm font-medium">{spot.province} Province · {spot.region}</p>
            <p className="text-gray-400 text-xs mt-0.5">{spot.description.slice(0, 140)}…</p>
          </div>

          <div>
            <p className={`text-xs font-bold uppercase tracking-widest ${t.headText} mb-3`}>💡 Why It&apos;s Special</p>
            <ul className="space-y-2">
              {spot.highlights.slice(0, 3).map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <span className={`mt-0.5 w-5 h-5 rounded-full ${t.iconBg} flex-shrink-0 flex items-center justify-center text-xs font-bold`}>✦</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={`text-xs font-bold uppercase tracking-widest ${t.headText} mb-3`}>🎯 Experiences &amp; Activities</p>
            <div className="flex flex-wrap gap-2">
              {spot.activities.slice(0, 5).map((a) => (
                <span key={a} className={`text-xs font-medium px-3 py-1.5 rounded-full border ${t.border} ${t.sectionBg} ${t.headText}`}>{a}</span>
              ))}
              {spot.activities.length > 5 && (
                <span className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-100 bg-gray-50 text-gray-400">+{spot.activities.length - 5} more</span>
              )}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-3">⚠️ Reality Checks</p>
            <ul className="space-y-2">
              {spot.travelTips.slice(0, 3).map((tip) => (
                <li key={tip} className="flex items-start gap-2.5 text-sm text-amber-800">
                  <span className="mt-0.5 text-amber-500 flex-shrink-0">•</span>{tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Est. daily budget</p>
              <p className="text-sm font-bold text-gray-800">
                NPR {spot.basePrice.toLocaleString()}
                <span className="text-gray-400 font-normal"> / ~${Math.round(spot.basePrice / 133)}</span>
              </p>
            </div>
            <TransitionLink
              href={`/destinations/${spot.id}`}
              className={`inline-flex items-center gap-1.5 text-sm font-bold px-5 py-2.5 rounded-xl ${t.dotBg} text-white hover:opacity-90 transition-opacity`}
            >
              Full Guide →
            </TransitionLink>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════
export default async function ExperiencePage(
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;
  const group = categoryGroups.find((g) => g.id === category);
  if (!group) notFound();

  const t = theme[group.id] ?? fallbackTheme;

  return (
    <>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className={`pt-16 bg-gradient-to-br ${t.gradient}`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <TransitionLink
            href="/"
            className="inline-flex items-center gap-1.5 text-white/50 hover:text-white/80 text-sm mb-8 transition-colors"
          >
            ← Back to Categories
          </TransitionLink>
          <p className="text-6xl mb-4 drop-shadow-lg">{group.emoji}</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">{group.name}</h1>
          <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto">{group.description}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className={`${t.tagBg} ${t.tagText} text-sm font-semibold px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-sm`}>
              {group.spots.length} destination{group.spots.length !== 1 ? "s" : ""}
            </span>
            <span className={`${t.tagBg} ${t.tagText} text-sm font-semibold px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-sm`}>
              {group.spots.reduce((s, sp) => s + sp.activities.length, 0)} unique activities
            </span>
          </div>
        </div>
        <div className="w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12 fill-gray-50">
            <path d="M0,60 L0,35 L180,10 L360,40 L540,8 L720,32 L900,5 L1080,28 L1260,12 L1440,30 L1440,60 Z" />
          </svg>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────── */}
      <main className="bg-gray-50 min-h-screen">
        <div className={`max-w-${group.id === "agriculture" || group.id === "adventure" ? "6xl" : "2xl"} mx-auto px-4 sm:px-6 py-12`}>
          {group.id === "agriculture" && (
            <AgricultureFeatureGrid spots={group.spots} category={group.id} />
          )}
          {group.id === "adventure" && (
            <AdventureGrid spots={group.spots} />
          )}
          {group.id !== "agriculture" && group.id !== "adventure" && (
            <div>
              {group.spots.map((spot, i) => (
                <TimelineCard key={spot.id} spot={spot} index={i} t={t} isLast={i === group.spots.length - 1} />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <p>© 2025 City Explorer Nepal · Explore the Himalayas 🏔️</p>
      </footer>
    </>
  );
}
