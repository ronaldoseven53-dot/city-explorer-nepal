"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { MapPin, Star, Mountain, Waves, Landmark, Zap, ArrowRight } from "lucide-react";
import Image from "next/image";
import TransitionLink from "./TransitionLink";

type Category = "mountain" | "nature" | "heritage" | "adventure" | "pilgrimage";

interface FeaturedDestination {
  name: string;
  province: string;
  rating: number;
  category: Category;
  image: string;
  href: string;
}

const CATEGORY_ICON: Record<Category, React.ReactNode> = {
  mountain:   <Mountain  size={14} strokeWidth={2} />,
  nature:     <Waves     size={14} strokeWidth={2} />,
  heritage:   <Landmark  size={14} strokeWidth={2} />,
  adventure:  <Zap       size={14} strokeWidth={2} />,
  pilgrimage: <Landmark  size={14} strokeWidth={2} />,
};

const FEATURED: FeaturedDestination[] = [
  { name: "Everest Base Camp", province: "Solukhumbu", rating: 4.9, category: "mountain",   image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80", href: "/experience/trekking" },
  { name: "Pokhara",           province: "Gandaki",    rating: 4.8, category: "nature",     image: "https://images.unsplash.com/photo-1562462181-b228e3cff9ad?w=600&q=80", href: "/experience/adventure" },
  { name: "Kathmandu",         province: "Bagmati",    rating: 4.7, category: "heritage",   image: "https://images.unsplash.com/photo-1592285896110-8d88b5b3a5d8?w=600&q=80", href: "/experience/heritage" },
  { name: "Mustang",           province: "Gandaki",    rating: 4.9, category: "adventure",  image: "https://images.unsplash.com/photo-1619463206719-f87a692cdd7a?w=600&q=80", href: "/experience/adventure" },
  { name: "Rara Lake",         province: "Karnali",    rating: 4.8, category: "nature",     image: "https://images.unsplash.com/photo-1544442069-97dded965a9f?w=600&q=80", href: "/experience/trekking" },
];

function DestCard({ dest }: { dest: FeaturedDestination }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className="flex-shrink-0 rounded-[16px] overflow-hidden cursor-pointer"
      style={{
        width: "clamp(128px, 31vw, 168px)",
        background: "var(--glass-bg)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid var(--glass-border)",
        willChange: "transform",
      }}
    >
      <TransitionLink href={dest.href} className="block h-full">
        <div className="relative" style={{ height: "clamp(98px, 24vw, 125px)" }}>
          <Image
            src={dest.image}
            alt={dest.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 38vw, 190px"
          />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 40%, rgba(0,0,0,0.38) 100%)" }}
          />
          <div
            className="absolute top-2.5 left-2.5 flex items-center justify-center rounded-full"
            style={{
              width: 28, height: 28,
              background: "rgba(10,15,28,0.72)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.88)",
            }}
          >
            {CATEGORY_ICON[dest.category]}
          </div>
        </div>

        <div className="px-3 py-3">
          <p className="text-zinc-900 dark:text-white font-bold text-[0.82rem] leading-tight mb-1.5 truncate">
            {dest.name}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-zinc-500 dark:text-white/50 text-[0.68rem]">
              <MapPin size={10} strokeWidth={2.2} />
              <span className="truncate max-w-[80px]">{dest.province}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={10} fill="#FBBF24" stroke="none" />
              <span className="text-[0.70rem] font-bold text-zinc-700 dark:text-white/80">{dest.rating}</span>
            </div>
          </div>
        </div>
      </TransitionLink>
    </motion.div>
  );
}

export default function DestinationsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 220, behavior: "smooth" });
  };

  return (
    <section
      style={{
        background: "var(--section-bg)",
        borderTop: "1px solid var(--section-border)",
        paddingTop: "28px",
        paddingBottom: "32px",
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{ paddingLeft: "max(1rem, 4vw)", paddingRight: "max(1rem, 4vw)", marginBottom: "16px" }}
      >
        <div className="flex items-center gap-2">
          <span style={{
            fontSize: "0.60rem", letterSpacing: "0.28em", textTransform: "uppercase",
            color: "var(--text-secondary)", fontWeight: 700,
          }}>
            🇳🇵 &nbsp;Popular Destinations
          </span>
        </div>

        <motion.button
          onClick={scrollRight}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "tween", duration: 0.15 }}
          className="flex items-center justify-center rounded-full"
          style={{
            width: 34, height: 34,
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            color: "var(--text-primary)",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <ArrowRight size={16} strokeWidth={2} />
        </motion.button>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto"
        style={{
          paddingLeft: "max(1rem, 4vw)",
          paddingRight: "max(1rem, 4vw)",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {FEATURED.map((dest) => (
          <DestCard key={dest.name} dest={dest} />
        ))}
        <div style={{ width: "clamp(0px, 2vw, 8px)", flexShrink: 0 }} />
      </div>
    </section>
  );
}
