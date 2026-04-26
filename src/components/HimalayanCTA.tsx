import Image from "next/image";
import TransitionLink from "@/components/TransitionLink";

// ── Figma-matched button tokens ───────────────────────────────────
// Extracted from Figma screenshot:
//   Primary  — #1BC47D fill, white text, 6px radius, 10/18px padding, semibold 14px
//   Ghost    — transparent, white text, 1px white/50 border, same shape

export function PrimaryButton({
  href,
  children,
  className = "",
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 " +
    "px-[18px] py-[10px] rounded-md " +
    "bg-[#1BC47D] hover:bg-[#17ad6e] active:bg-[#14996200] " +
    "text-white text-sm font-semibold leading-none " +
    "transition-colors duration-150 select-none " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1BC47D]/60 " +
    className;

  if (href) {
    return (
      <TransitionLink href={href} className={base}>
        {children}
      </TransitionLink>
    );
  }
  return (
    <button type="button" className={base}>
      {children}
    </button>
  );
}

export function GhostButton({
  href,
  children,
  className = "",
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 " +
    "px-[18px] py-[10px] rounded-md " +
    "bg-transparent hover:bg-white/10 active:bg-white/15 " +
    "text-white text-sm font-semibold leading-none " +
    "border border-white/50 hover:border-white/80 " +
    "transition-colors duration-150 select-none " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 " +
    className;

  if (href) {
    return (
      <TransitionLink href={href} className={base}>
        {children}
      </TransitionLink>
    );
  }
  return (
    <button type="button" className={base}>
      {children}
    </button>
  );
}

// ── Full hero section with verified Himalayas background ──────────
// Photo: climber at Everest Base Camp, dramatic snow-covered peaks
// Unsplash: photo-1673505413397-0cd0dc4f5854  (verified 200)
// Fallback: Gokyo Lake panorama photo-1580213220691-2079ed260455

const HIMALAYAS_BG =
  "https://images.unsplash.com/photo-1673505413397-0cd0dc4f5854?w=1600&q=85";

export default function HimalayanCTA() {
  return (
    <section className="relative overflow-hidden min-h-[420px] flex items-center">
      {/* Background image */}
      <Image
        src={HIMALAYAS_BG}
        alt="Dramatic Himalayan peaks at Everest Base Camp"
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/30" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="text-[#1BC47D] text-xs font-bold uppercase tracking-[0.2em] mb-4">
          🏔️ Roof of the World
        </p>

        <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
          Plan Your Nepal
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#1BC47D] to-emerald-300">
            Adventure Today
          </span>
        </h2>

        <p className="text-white/70 text-base sm:text-lg mb-8 leading-relaxed max-w-md mx-auto">
          From cliff-harvested mad honey to the world&apos;s highest bungee jump —
          let our AI build your perfect Nepal itinerary.
        </p>

        {/* Figma-matched button pair */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <PrimaryButton href="/#ai-planner">
            Start Planning
          </PrimaryButton>
          <GhostButton href="/experience/adventure">
            View Adventures
          </GhostButton>
        </div>
      </div>
    </section>
  );
}
