import Navbar from "@/components/Navbar";
import DestinationCard from "@/components/DestinationCard";
import { destinations } from "@/data/destinations";

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
              { value: "5",       label: "Categories"   },
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

        {/* Mountain-silhouette wave into the card section */}
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

      {/* ── Destination Grid ──────────────────────────────────── */}
      <main className="bg-gray-50">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          {/* Section heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              All Destinations
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">
              {destinations.length} handpicked places across Nepal — from high-altitude
              Himalayan villages to ancient heritage cities and misty tea hills.
            </p>
          </div>

          {/* Responsive grid — 1 col → 2 col → 3 col */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <p>© 2025 City Explorer Nepal · Explore the Himalayas 🏔️</p>
      </footer>
    </>
  );
}
