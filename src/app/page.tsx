import Navbar from "@/components/Navbar";
import MapLoader from "@/components/MapLoader";
import CategoryGrid from "@/components/CategoryGrid";
import AIPlanner from "@/components/AIPlanner";
import AIPlannerTrigger from "@/components/AIPlannerTrigger";
import SeasonalBanner from "@/components/SeasonalBanner";
import HimalayanCTA from "@/components/HimalayanCTA";
import { destinations, categoryGroups } from "@/data/destinations";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <p className="text-red-400 font-semibold text-sm tracking-widest uppercase mb-5">
            🇳🇵 Himalayan Kingdom
          </p>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            Explore the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-300">
              Wonders of Nepal
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-12 leading-relaxed">
            From the sacred birthplace of the Buddha to the roof of the world —
            discover Nepal&apos;s most breathtaking destinations.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              { value: String(destinations.length), label: "Destinations" },
              { value: String(categoryGroups.length), label: "Categories" },
              { value: "8,848 m", label: "Highest Peak" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4 min-w-[120px]"
              >
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-blue-200 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mountain-silhouette wave */}
        <div className="w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 80"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-16 sm:h-20 fill-gray-50"
          >
            <path d="M0,80 L0,50 L120,20 L240,45 L360,10 L480,35 L600,5 L720,30 L840,0 L960,25 L1080,8 L1200,35 L1320,15 L1440,40 L1440,80 Z" />
          </svg>
        </div>
      </section>

      <div className="bg-gray-50">
        {/* ── Interactive Map ───────────────────────────────────── */}
        <MapLoader />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <hr className="border-gray-200" />
        </div>

        <SeasonalBanner />
      </div>

      {/* ── Himalayas CTA banner ──────────────────────────────────── */}
      <HimalayanCTA />

      <div className="bg-gray-50">
        {/* ── Experience Cards Grid ─────────────────────────────── */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              What do you want to do?
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Choose Your Experience
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
              From cliff-harvested mad honey to world-class bungee jumps — pick an experience type to see curated destinations and activities.
            </p>
          </div>

          <CategoryGrid />
        </main>
      </div>

      {/* ── AI Planner CTA ────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 py-20 px-4">
        {/* Decorative blurred blobs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-red-700/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-800/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl mx-auto text-center">
          <p className="text-red-400 font-semibold text-xs tracking-widest uppercase mb-4">
            ✨ Powered by Gemini AI
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
            Not sure where to go?
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-300">
              Let AI plan your Nepal trip!
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mb-8 leading-relaxed">
            Tell our AI assistant your interests, budget, or travel dates — it will build a personalised itinerary from our {destinations.length} handpicked destinations.
          </p>

          <AIPlannerTrigger />

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-slate-500 text-xs">
            {["Free to use", "Instant itineraries", "17 real destinations", "Streams in real-time"].map((f) => (
              <span key={f} className="flex items-center gap-1.5">
                <span className="text-red-500">✓</span> {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <p>© 2025 City Explorer Nepal · Explore the Himalayas 🏔️</p>
      </footer>

      <AIPlanner />
    </>
  );
}
