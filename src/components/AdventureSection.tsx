"use client";

import { motion } from "motion/react";
import Image from "next/image";

interface Category {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
  /** Tailwind responsive col-span classes */
  colClass: string;
  /** Image sizes hint for next/image */
  sizes: string;
}

const CATEGORIES: Category[] = [
  {
    id: "agriculture",
    title: "Agriculture & Local Product",
    description: "Terraced farms, tea gardens & spice trails",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=900&q=85",
    href: "/experience/agriculture",
    colClass: "col-span-1 md:col-span-2",
    sizes: "(max-width: 768px) 50vw, 33vw",
  },
  {
    id: "adventure",
    title: "Adventure and Thrills",
    description: "Paragliding, bungee, rafting & extreme sports",
    image: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=1200&q=85",
    href: "/experience/adventure",
    colClass: "col-span-1 md:col-span-4",
    sizes: "(max-width: 768px) 50vw, 67vw",
  },
  {
    id: "trekking",
    title: "Trekking and High Passes",
    description: "Himalayan trails from Everest to Annapurna",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=85",
    href: "/experience/trekking",
    colClass: "col-span-1 md:col-span-4",
    sizes: "(max-width: 768px) 50vw, 67vw",
  },
  {
    id: "heritage",
    title: "Heritage and Culture",
    description: "Ancient stupas, temples & UNESCO world sites",
    image: "https://images.unsplash.com/photo-1592285896110-8d88b5b3a5d8?w=900&q=85",
    href: "/experience/heritage",
    colClass: "col-span-1 md:col-span-2",
    sizes: "(max-width: 768px) 50vw, 33vw",
  },
  {
    id: "nature",
    title: "Nature and Science",
    description: "Glaciers, rare species & pristine wilderness",
    image: "https://images.unsplash.com/photo-1544442069-97dded965a9f?w=900&q=85",
    href: "/experience/nature",
    colClass: "col-span-1 md:col-span-3",
    sizes: "(max-width: 768px) 50vw, 50vw",
  },
  {
    id: "pilgrimage",
    title: "Pilgrimage",
    description: "Sacred sites, monasteries & spiritual journeys",
    image: "https://images.unsplash.com/photo-1609168494389-230528e6a9c3?w=900&q=85",
    href: "/experience/pilgrimage",
    colClass: "col-span-1 md:col-span-3",
    sizes: "(max-width: 768px) 50vw, 50vw",
  },
];

// ── Card ─────────────────────────────────────────────────────────

function CategoryCard({ cat }: { cat: Category }) {
  return (
    <motion.a
      href={cat.href}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 360, damping: 26, mass: 0.9 }}
      className={`group relative overflow-hidden block ${cat.colClass}`}
      style={{
        borderRadius: 22,
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 6px 28px rgba(0,0,0,0.26)",
        willChange: "transform",
        cursor: "pointer",
        textDecoration: "none",
      }}
    >
      {/* ── Background image — scales on CSS hover (GPU layer) ── */}
      <div
        className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.07]"
        style={{ willChange: "transform" }}
      >
        <Image
          src={cat.image}
          alt={cat.title}
          fill
          className="object-cover"
          sizes={cat.sizes}
        />
      </div>

      {/* ── Static gradient scrim ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.28) 52%, rgba(0,0,0,0.04) 100%)",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* ── Hover: additional darkening layer ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "rgba(0,0,0,0.18)" }}
      />

      {/* ── Glassmorphism footer ── */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          padding: "12px 14px 15px",
          background: "rgba(4,8,22,0.54)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderTop: "1px solid rgba(255,255,255,0.09)",
        }}
      >
        {/* Orange accent bar + title */}
        <div className="flex items-start gap-2.5 mb-1.5">
          <div
            aria-hidden
            style={{
              width: 3,
              height: 18,
              borderRadius: 2,
              flexShrink: 0,
              marginTop: 2,
              background: "linear-gradient(to bottom, #fb923c, #f97316)",
              boxShadow: "0 0 9px rgba(249,115,22,0.65)",
            }}
          />
          <p
            className="font-bold text-white leading-snug"
            style={{ fontSize: "clamp(0.78rem, 1.6vw, 0.92rem)" }}
          >
            {cat.title}
          </p>
        </div>

        {/* Description + Explore link */}
        <div className="flex items-center justify-between" style={{ paddingLeft: 15 }}>
          <p className="text-white/42 text-[0.64rem] font-medium truncate pr-2 leading-none">
            {cat.description}
          </p>
          <span
            className="flex items-center gap-1 text-white/65 group-hover:text-white/90 transition-colors duration-200 flex-shrink-0"
            style={{ fontSize: "0.68rem", fontWeight: 600 }}
          >
            Explore
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
              <path
                d="M1 5h8M6 2l3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </motion.a>
  );
}

// ── Section ───────────────────────────────────────────────────────

export default function AdventureSection() {
  return (
    <section
      style={{
        background: "var(--section-bg)",
        borderTop: "1px solid var(--section-border)",
        padding: "clamp(1.25rem, 4vw, 2.25rem) max(1rem, 4vw)",
      }}
    >
      {/* ── Header ── */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <p
            style={{
              fontSize: "0.60rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            🏔 &nbsp;Nepal Experiences
          </p>
          <h2
            style={{
              fontSize: "clamp(1.05rem, 3vw, 1.45rem)",
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Explore Experiences
          </h2>
        </div>

        <a
          href="/experience/adventure"
          className="flex items-center gap-1.5 font-semibold text-[0.75rem] transition-opacity duration-150 hover:opacity-70"
          style={{ color: "#DC143C" }}
        >
          View all
          <svg width="11" height="11" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path
              d="M1 5h8M6 2l3 3-3 3"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>

      {/* ── Bento grid ── */}
      {/*
        Mobile  (default):  2-col, all cards equal (col-span-1)
        Desktop (md+):      6-col bento —
          Row 1: Agriculture (2) + Adventure (4)
          Row 2: Trekking (4) + Heritage (2)
          Row 3: Nature (3) + Pilgrimage (3)
      */}
      <div
        className="grid grid-cols-2 md:grid-cols-6 gap-3"
        style={{
          gridAutoRows: "clamp(185px, 20vw, 248px)",
        }}
      >
        {CATEGORIES.map((cat) => (
          <CategoryCard key={cat.id} cat={cat} />
        ))}
      </div>
    </section>
  );
}
