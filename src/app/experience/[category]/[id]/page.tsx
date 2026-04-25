import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { categoryGroups, type Spot } from "@/data/destinations";
import Navbar from "@/components/Navbar";
import TransitionLink from "@/components/TransitionLink";

// ── Static generation ─────────────────────────────────────────────
export function generateStaticParams() {
  return categoryGroups.flatMap((g) =>
    g.spots.map((s) => ({ category: g.id, id: s.id }))
  );
}

export async function generateMetadata(
  { params }: { params: Promise<{ category: string; id: string }> }
): Promise<Metadata> {
  const { category, id } = await params;
  const group = categoryGroups.find((g) => g.id === category);
  const spot = group?.spots.find((s) => s.id === id);
  if (!spot) return {};
  return {
    title: `${spot.name} Experiences — City Explorer Nepal`,
    description: spot.description.slice(0, 155) + "…",
  };
}

// ── Difficulty ────────────────────────────────────────────────────
type Difficulty = "Extreme" | "Hard" | "Moderate" | "Easy";

const difficultyStyle: Record<Difficulty, { badge: string; dot: string }> = {
  Extreme:  { badge: "bg-rose-950 text-rose-200 border-rose-800",   dot: "bg-rose-600"   },
  Hard:     { badge: "bg-red-100  text-red-700  border-red-200",    dot: "bg-red-500"    },
  Moderate: { badge: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-500"  },
  Easy:     { badge: "bg-green-100 text-green-700 border-green-200", dot: "bg-green-500"  },
};

const activityDifficulty: Record<string, Difficulty> = {
  // Lamjung — Mad Honey
  "Mad honey cliff-harvest observation (May–June and Nov–Dec)": "Extreme",
  "Rhododendron forest trekking (March–April bloom)":           "Moderate",
  "Traditional Gurung village homestays in Ghanpokhara":        "Easy",
  "Cultural interaction with Gurung honey-hunting families":    "Easy",
  "Lamjung Himal viewpoint hike":                               "Hard",
  "Photography of Himalayan cliff bee hives":                   "Hard",
  "Trekking to Bhimphedi and surrounding ridges":               "Moderate",
  // Dolpa — Yarsagumba
  "Yarsagumba (caterpillar fungus) harvest observation (May–June)": "Hard",
  "Shey Phoksundo Lake trekking circuit (Lower Dolpa)":             "Hard",
  "Tibetan Buddhist monastery visits at Shey Gompa":                "Moderate",
  "Upper Dolpa restricted-area expedition":                         "Extreme",
  "Snow leopard wildlife tracking with a naturalist guide":         "Hard",
  "Photography in the surreal turquoise lake and red-cliff landscape": "Easy",
  "Cultural immersion with Bon-po Buddhist Dolpo-pa communities":   "Easy",
  // Ilam — Tea Farming
  "Tea estate tours and organic tea tasting":              "Easy",
  "Sunrise trek to Antu Danda viewpoint":                  "Easy",
  "Sandakpur trekking (Kanchenjunga views)":               "Hard",
  "Birdwatching in rhododendron forests":                  "Easy",
  "Mai Pokhari sacred lake visit":                         "Easy",
  "Fikkal weekly market exploration":                      "Easy",
  "Home-stay experiences with local families":             "Easy",
  // Pokhara
  "Paragliding over the Annapurna range":                  "Hard",
  "Annapurna Circuit & Poon Hill trekking":                "Hard",
  "Boating and kayaking on Phewa Lake":                    "Easy",
  "Zip-lining across the valley":                          "Easy",
  "White-water rafting on the Seti River":                 "Moderate",
  "Sunrise hike to Sarangkot viewpoint":                   "Easy",
  "Cave exploration at Gupteswar":                         "Easy",
  "Ultralight aircraft flights":                           "Easy",
  // Mustang
  "Trekking the Upper Mustang trail to Lo Manthang":       "Hard",
  "Exploring sky caves of Chhoser":                        "Moderate",
  "Jeep safari through canyon landscapes":                 "Easy",
  "Attending the Tiji Festival (May)":                     "Easy",
  "Visiting ancient Tibetan gompas and monasteries":       "Easy",
  "Muktinath Temple pilgrimage":                           "Moderate",
  "Photography in the sculpted canyon badlands":           "Easy",
  // Chitwan
  "Jeep safari through the national park":                 "Easy",
  "Elephant-back safari (observation only)":               "Easy",
  "Canoe ride on the Rapti River":                         "Easy",
  "Jungle walking safari with a naturalist guide":         "Moderate",
  "Tharu cultural village tour and dance show":            "Easy",
  "Birdwatching (over 540 species recorded)":              "Easy",
  "Sunrise river walk along the Rapti":                    "Easy",
  // Kalinchowk
  "Skiing and snowboarding (December – February)":         "Moderate",
  "Cable car ride to Kalinchowk Bhagwati Temple":          "Easy",
  "Himalayan sunrise viewpoint photography":               "Easy",
  "Snow play and winter trekking":                         "Easy",
  "Pilgrimage to Kalinchowk Bhagwati Shrine":              "Easy",
  "Paragliding (spring and autumn)":                       "Moderate",
  "High-altitude nature walks":                            "Moderate",
  // Manang
  "Acclimatisation hike to Ice Lake (4,600 m)":            "Hard",
  "Annapurna Circuit trekking":                            "Hard",
  "Braga Gompa monastery visit":                           "Easy",
  "Gangapurna glacier and lake viewpoint walk":            "Moderate",
  "Milarepa Cave meditation retreat":                      "Easy",
  "Photography of high-altitude Himalayan scenery":        "Moderate",
  "Cultural interaction with Manangi and Gurung communities": "Easy",
  // Rara Lake
  "Rara Lake circuit trekking (3–4 days)":                 "Moderate",
  "Boating and kayaking on the lake":                      "Easy",
  "Wildlife safari in Rara National Park":                 "Easy",
  "Night-sky photography (zero light pollution)":          "Easy",
  "Horse riding through alpine meadows":                   "Easy",
  "Birdwatching (200+ species including Himalayan monal)": "Easy",
  "Wild camping on the lakeshore":                         "Moderate",
  // Tsum Valley
  "Tsum Valley cultural trekking (14–17 days)":            "Hard",
  "Gumba Lungdang and Mu Gompa monastery visits":          "Moderate",
  "Village homestays with Tsumba families":                "Easy",
  "Prayer wheel and chorten trails":                       "Easy",
  "High-pass crossings — Ngula Dhojhyang (5,093 m)":       "Extreme",
  "Wildlife trekking in Manaslu Conservation Area":        "Hard",
  "Photography of centuries-old Buddhist art and murals":  "Easy",
  // Dhampus
  "Hike to Australian Camp panorama viewpoint":            "Easy",
  "Sunrise photography of Annapurna and Machhapuchhre":    "Easy",
  "Village walk through traditional Gurung homesteads":    "Easy",
  "Rhododendron forest walk (March – April bloom)":        "Easy",
  "Cycling descent from Dhampus to Phedi":                 "Easy",
  "Cultural evening with traditional Gurung dance":        "Easy",
  "Short trek extension to Pothana and Landruk":           "Moderate",
  // Gosaikunda
  "Gosaikunda lake pilgrimage and trekking (4–5 days from Dhunche)": "Moderate",
  "Janai Purnima festival pilgrimage (August full moon)":            "Moderate",
  "Cross-country trail to Langtang Valley and Helambu":              "Hard",
  "High-altitude sunrise photography at the sacred lakes":           "Moderate",
  "Langtang National Park wildlife tracking":                        "Moderate",
  "Yoga and meditation by the lakeshore":                            "Easy",
  "Crossing the Laurebina Pass (4,610 m)":                           "Hard",
  // Gosaikunda shared
  "Birdwatching in the surrounding forests":               "Easy",
  // Kathmandu
  "Temple & stupa tours (Pashupatinath, Boudhanath)":      "Easy",
  "Durbar Square heritage walks":                          "Easy",
  "Mountain flights over the Himalayas":                   "Easy",
  "Thamel bazaar shopping":                                "Easy",
  "Traditional thangka painting classes":                  "Easy",
  "Cooking classes — authentic Newari cuisine":            "Easy",
  "Day hike to Nagarjuna forest":                          "Easy",
  // Bhaktapur
  "Durbar Square and Nyatapola Temple exploration":        "Easy",
  "Traditional pottery making at Pottery Square":          "Easy",
  "Tasting juju dhau — the famous Bhaktapur king yogurt":  "Easy",
  "Sunrise walk through the old town alleys":              "Easy",
  "Bisket Jatra festival (Nepali New Year, April)":        "Easy",
  "Woodcarving and thangka workshop visits":               "Easy",
  "Siddha Pokhari pond evening walk":                      "Easy",
  // Bandipur
  "Sunrise viewpoint walk to Tundikhel for Himalayan panoramas": "Easy",
  "Exploring the traffic-free Newari bazaar street":       "Easy",
  "Siddha Cave exploration (one of Nepal's largest caves)":"Easy",
  "Village trekking to Ramkot and Gurungche Hill":         "Moderate",
  "Cultural walk through traditional Newari homes":        "Easy",
  "Paragliding with views of Annapurna and Manaslu":       "Moderate",
  // Kanyam
  "Peaceful walks through tea plantation rows":            "Easy",
  "Tinjure Milke Jaljale rhododendron trail":              "Moderate",
  "Photography of morning mist over tea fields":           "Easy",
  "Fresh-brew tea tasting at local estates":               "Easy",
  "Cycling through village trails":                        "Easy",
  "Camping under a clear high-altitude sky":               "Easy",
  // Nagarkot
  "Sunrise Himalayan panorama viewpoint":                  "Easy",
  "Sunrise to Bhaktapur hiking trail (3–4 hours downhill)": "Easy",
  "Cycling down to Bhaktapur or Changu Narayan":           "Easy",
  "Yoga and meditation retreats at hilltop resorts":       "Easy",
  "Village walk to Telkot and Changu Narayan temple":      "Easy",
  "Photography of cloud inversions over the Kathmandu Valley": "Easy",
  // Lumbini
  "Pilgrimage & meditation at Maya Devi Temple":           "Easy",
  "Cycling through the monastic zone":                     "Easy",
  "Visiting international monasteries":                    "Easy",
  "Guided heritage walks":                                 "Easy",
  "Sunrise reflection at Mayadevi Pond":                   "Easy",
  "Attending Buddhist prayer ceremonies":                  "Easy",
  "Museum visits at Lumbini Museum":                       "Easy",
  // Janakpur
  "Pilgrimage to Janaki Mandir temple":                    "Easy",
  "Mithila art workshop and gallery visits":               "Easy",
  "Attending the Ram Vivah Panchami festival (November)":  "Easy",
  "Cycling around the sacred ponds (kunds)":               "Easy",
  "Exploring the old city bazaars":                        "Easy",
  "Train ride on the Janakpur Railway (heritage steam train)": "Easy",
  "Maithili cultural performance visits":                  "Easy",
};

function getDifficulty(activity: string): Difficulty {
  return activityDifficulty[activity] ?? "Moderate";
}

// ── Best Season ───────────────────────────────────────────────────
function getSeasonIcon(activity: string, bestTimeToVisit: string): string {
  const t = (activity + " " + bestTimeToVisit).toLowerCase();
  if (/december|january|february|snow|ski|winter/.test(t))  return "❄️";
  if (/march|april|bloom|rhododendron|spring/.test(t))       return "🌸";
  if (/june|july|august|monsoon/.test(t))                    return "🌧️";
  if (/september|october|november|autumn/.test(t))           return "🍂";
  if (/may/.test(t))                                         return "🌸";
  return "☀️";
}

// ── Theme ─────────────────────────────────────────────────────────
type Theme = {
  gradient: string;
  heroBadge: string;
  accent: string;       // bold accent (buttons, icons)
  accentLight: string;  // light bg
  accentText: string;   // text on light bg
  border: string;
  cardBorder: string;
  tagBg: string; tagText: string;
};

const themes: Record<string, Theme> = {
  agriculture: {
    gradient:    "from-green-950 via-green-900 to-slate-900",
    heroBadge:   "bg-green-500/20 text-green-200 border-green-500/30",
    accent:      "bg-green-600 hover:bg-green-700",
    accentLight: "bg-green-50",
    accentText:  "text-green-700",
    border:      "border-green-100",
    cardBorder:  "border-green-200",
    tagBg:       "bg-green-500/20", tagText: "text-green-200",
  },
  adventure: {
    gradient:    "from-red-950 via-red-900 to-slate-900",
    heroBadge:   "bg-red-500/20 text-red-200 border-red-500/30",
    accent:      "bg-red-600 hover:bg-red-700",
    accentLight: "bg-red-50",
    accentText:  "text-red-700",
    border:      "border-red-100",
    cardBorder:  "border-red-200",
    tagBg:       "bg-red-500/20", tagText: "text-red-200",
  },
  heritage: {
    gradient:    "from-yellow-950 via-amber-900 to-slate-900",
    heroBadge:   "bg-yellow-500/20 text-yellow-200 border-yellow-500/30",
    accent:      "bg-amber-500 hover:bg-amber-600",
    accentLight: "bg-amber-50",
    accentText:  "text-amber-700",
    border:      "border-amber-100",
    cardBorder:  "border-amber-200",
    tagBg:       "bg-yellow-500/20", tagText: "text-yellow-200",
  },
  trekking: {
    gradient:    "from-slate-950 via-slate-800 to-slate-900",
    heroBadge:   "bg-slate-500/20 text-slate-200 border-slate-500/30",
    accent:      "bg-slate-600 hover:bg-slate-700",
    accentLight: "bg-slate-50",
    accentText:  "text-slate-700",
    border:      "border-slate-100",
    cardBorder:  "border-slate-200",
    tagBg:       "bg-slate-500/20", tagText: "text-slate-200",
  },
  nature: {
    gradient:    "from-emerald-950 via-emerald-900 to-slate-900",
    heroBadge:   "bg-emerald-500/20 text-emerald-200 border-emerald-500/30",
    accent:      "bg-emerald-600 hover:bg-emerald-700",
    accentLight: "bg-emerald-50",
    accentText:  "text-emerald-700",
    border:      "border-emerald-100",
    cardBorder:  "border-emerald-200",
    tagBg:       "bg-emerald-500/20", tagText: "text-emerald-200",
  },
  pilgrimage: {
    gradient:    "from-purple-950 via-purple-900 to-slate-900",
    heroBadge:   "bg-purple-500/20 text-purple-200 border-purple-500/30",
    accent:      "bg-purple-600 hover:bg-purple-700",
    accentLight: "bg-purple-50",
    accentText:  "text-purple-700",
    border:      "border-purple-100",
    cardBorder:  "border-purple-200",
    tagBg:       "bg-purple-500/20", tagText: "text-purple-200",
  },
};
const fallbackTheme = themes.trekking;

// ── Agriculture special labels ────────────────────────────────────
const agriLabel: Record<string, string> = {
  lamjung: "🍯 Mad Honey",
  ilam:    "🍵 Tea Farming",
  dolpa:   "🍄 Yarsagumba",
};

// ── Activity Grid Card ────────────────────────────────────────────
function ActivityCard({
  activity, spot, t,
}: {
  activity: string;
  spot: Spot;
  t: Theme;
}) {
  const level = getDifficulty(activity);
  const diff = difficultyStyle[level];
  const season = getSeasonIcon(activity, spot.bestTimeToVisit);

  return (
    <div
      className={`
        group relative flex flex-col bg-white rounded-2xl border ${t.cardBorder}
        shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5
        overflow-hidden
      `}
    >
      {/* Season stripe */}
      <div className={`h-1.5 w-full ${diff.dot}`} />

      <div className="p-5 flex-1 flex flex-col gap-4">
        {/* Season icon + activity name */}
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0 mt-0.5">{season}</span>
          <p className="text-sm font-semibold text-gray-800 leading-snug">{activity}</p>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2 mt-auto">
          {/* Difficulty badge */}
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${diff.badge}`}>
            {level === "Extreme" ? "⚡ Extreme" :
             level === "Hard"    ? "🔥 Hard"    :
             level === "Moderate"? "⚠️ Moderate" :
                                   "✓ Easy"}
          </span>

          {/* Season label */}
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${t.accentLight} ${t.accentText}`}>
            {season === "❄️" ? "Winter"  :
             season === "🌸" ? "Spring"  :
             season === "🌧️" ? "Monsoon" :
             season === "🍂" ? "Autumn"  :
                               "Year-round"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════
export default async function ExperienceDetailPage(
  { params }: { params: Promise<{ category: string; id: string }> }
) {
  const { category, id } = await params;
  const group = categoryGroups.find((g) => g.id === category);
  const spot  = group?.spots.find((s) => s.id === id);
  if (!spot) notFound();

  const t = themes[category] ?? fallbackTheme;
  const label = agriLabel[id];

  // Difficulty breakdown counts for the stats bar
  const counts = spot.activities.reduce<Record<Difficulty, number>>(
    (acc, a) => { acc[getDifficulty(a)]++; return acc; },
    { Extreme: 0, Hard: 0, Moderate: 0, Easy: 0 }
  );

  return (
    <>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className={`pt-16 bg-gradient-to-br ${t.gradient}`}>
        <div className="relative h-64 sm:h-80">
          <Image
            src={spot.placeholderImage}
            alt={spot.name}
            fill
            sizes="100vw"
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Back + breadcrumb */}
          <div className="absolute top-5 left-5 flex items-center gap-2 text-sm">
            <TransitionLink
              href={`/experience/${category}`}
              className="text-white/60 hover:text-white transition-colors"
            >
              ← {group!.name}
            </TransitionLink>
            <span className="text-white/30">/</span>
            <span className="text-white/80 font-medium">{spot.name}</span>
          </div>

          <div className="absolute bottom-6 left-5 right-5">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {label && (
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                  {label}
                </span>
              )}
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border backdrop-blur-sm ${t.heroBadge}`}>
                {group!.name}
              </span>
              {spot.elevation && (
                <span className="bg-black/30 backdrop-blur-sm text-white/80 text-xs px-3 py-1 rounded-full">
                  ⛰ {spot.elevation}
                </span>
              )}
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
              {spot.name}
            </h1>
            <p className="text-white/60 text-sm mt-1">{spot.province} Province · {spot.region}</p>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Best Time</p>
            <p className="font-semibold text-gray-800">📅 {spot.bestTimeToVisit}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Daily Budget</p>
            <p className="font-semibold text-gray-800">
              NPR {spot.basePrice.toLocaleString()}
              <span className="text-gray-400 font-normal text-xs"> (~${Math.round(spot.basePrice / 133)})</span>
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Activities</p>
            <p className="font-semibold text-gray-800">{spot.activities.length} total</p>
          </div>
          {/* Difficulty breakdown */}
          <div className="ml-auto flex items-center gap-2">
            {(["Extreme", "Hard", "Moderate", "Easy"] as Difficulty[]).map((lvl) =>
              counts[lvl] > 0 ? (
                <span
                  key={lvl}
                  className={`text-xs font-bold px-2.5 py-1 rounded-full border ${difficultyStyle[lvl].badge}`}
                >
                  {counts[lvl]}× {lvl}
                </span>
              ) : null
            )}
          </div>
        </div>
      </div>

      {/* ── Main ─────────────────────────────────────────────── */}
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-14">

          {/* About */}
          <section>
            <h2 className={`text-2xl font-bold mb-4 ${t.accentText}`}>About {spot.name}</h2>
            <p className="text-gray-600 text-base leading-relaxed">{spot.description}</p>
          </section>

          {/* ── Activity Grid Cards ──────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Experiences &amp; Activities
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Each card shows difficulty level and best season to visit.
                </p>
              </div>
              {/* Legend */}
              <div className="hidden sm:flex flex-col gap-1.5 text-xs">
                {(["Extreme", "Hard", "Moderate", "Easy"] as Difficulty[]).map((lvl) => (
                  <span key={lvl} className={`flex items-center gap-1.5 font-medium px-2 py-0.5 rounded-full border w-fit ${difficultyStyle[lvl].badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${difficultyStyle[lvl].dot}`} />
                    {lvl}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {spot.activities.map((activity) => (
                <ActivityCard key={activity} activity={activity} spot={spot} t={t} />
              ))}
            </div>
          </section>

          {/* Highlights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-5">Must-See Highlights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {spot.highlights.map((h) => (
                <div
                  key={h}
                  className={`flex items-start gap-3 p-4 rounded-xl border ${t.border} ${t.accentLight}`}
                >
                  <span className={`text-base font-bold flex-shrink-0 ${t.accentText}`}>✦</span>
                  <span className={`text-sm font-medium ${t.accentText}`}>{h}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Getting There + Tips side by side on desktop */}
          <div className="grid sm:grid-cols-2 gap-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Getting There</h2>
              <div className={`flex items-start gap-4 p-5 rounded-2xl border ${t.border} ${t.accentLight}`}>
                <span className="text-2xl flex-shrink-0">🚌</span>
                <p className={`text-sm leading-relaxed ${t.accentText}`}>{spot.gettingThere}</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Travel Tips</h2>
              <ul className="space-y-3">
                {spot.travelTips.map((tip, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-xl border ${t.border} ${t.accentLight}`}
                  >
                    <span className={`text-sm font-bold flex-shrink-0 ${t.accentText}`}>💡</span>
                    <span className={`text-xs leading-relaxed ${t.accentText}`}>{tip}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Other spots in the category */}
          {(() => {
            const others = group!.spots.filter((s) => s.id !== id);
            if (others.length === 0) return null;
            return (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-5">
                  More {group!.name} Experiences
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {others.map((other) => (
                    <TransitionLink
                      key={other.id}
                      href={`/experience/${category}/${other.id}`}
                      className="group rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 bg-white"
                    >
                      <div className="relative h-36 bg-slate-200">
                        <Image
                          src={other.placeholderImage}
                          alt={other.name}
                          fill
                          sizes="(max-width:640px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        {agriLabel[other.id] && (
                          <span className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {agriLabel[other.id]}
                          </span>
                        )}
                        <p className="absolute bottom-2 left-3 text-white font-bold text-sm">{other.name}</p>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-gray-500 truncate">{other.province} Province</p>
                        <p className={`text-xs font-semibold mt-0.5 ${t.accentText}`}>
                          {other.activities.length} experiences →
                        </p>
                      </div>
                    </TransitionLink>
                  ))}
                </div>
              </section>
            );
          })()}

          {/* CTA: full destination guide */}
          <section className="text-center">
            <TransitionLink
              href={`/destinations/${id}`}
              className={`inline-flex items-center gap-2 text-base font-bold px-8 py-4 rounded-2xl text-white ${t.accent} transition-colors shadow-lg`}
            >
              View Full Destination Guide for {spot.name} →
            </TransitionLink>
          </section>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <p>© 2025 City Explorer Nepal · Explore the Himalayas 🏔️</p>
      </footer>
    </>
  );
}
