"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Experience {
  title: string;
  subtitle: string;
  tag: string;
  image: string;
  href: string;
}

const EXPERIENCES: Experience[] = [
  {
    title: "Trekking & High Passes",
    subtitle: "Himalayan multi-day routes",
    tag: "Multi-day",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=700&q=85",
    href: "/experience/trekking",
  },
  {
    title: "Paragliding in Pokhara",
    subtitle: "Thermal flights over Phewa Lake",
    tag: "Half-day",
    image: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=700&q=85",
    href: "/experience/adventure",
  },
  {
    title: "Jungle Safari Chitwan",
    subtitle: "Rhinos, tigers & wild elephants",
    tag: "2–3 days",
    image: "https://images.unsplash.com/photo-1544870234-c32b01786468?w=700&q=85",
    href: "/experience/adventure",
  },
  {
    title: "White Water Rafting",
    subtitle: "Grade III–V rapids, Trishuli River",
    tag: "Full-day",
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=700&q=85",
    href: "/experience/adventure",
  },
  {
    title: "Everest Base Camp Trek",
    subtitle: "The world's most iconic trail",
    tag: "14 days",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=700&q=85",
    href: "/experience/trekking",
  },
];

// ── Arrow button (appears on section hover) ───────────────────────

function ArrowBtn({
  dir,
  onClick,
  isDark,
}: {
  dir: "left" | "right";
  onClick: () => void;
  isDark?: boolean;
}) {
  const Icon = dir === "left" ? ChevronLeft : ChevronRight;
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
      aria-label={dir === "left" ? "Scroll left" : "Scroll right"}
      className="flex items-center justify-center cursor-pointer z-10 flex-shrink-0"
      style={{
        width: 38,
        height: 38,
        borderRadius: "50%",
        background: isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.07)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.10)"}`,
        color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.60)",
        boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
      }}
    >
      <Icon size={16} strokeWidth={2.2} />
    </motion.button>
  );
}

// ── Individual experience card ────────────────────────────────────

function ExperienceCard({ exp }: { exp: Experience }) {
  return (
    <a href={exp.href} className="flex-shrink-0 block" style={{ width: "clamp(240px, 70vw, 290px)" }}>
      <motion.div
        whileHover={{ y: -7 }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
        className="relative overflow-hidden"
        style={{
          height: "clamp(340px, 55vw, 400px)",
          borderRadius: 24,
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 8px 28px rgba(0,0,0,0.28)",
          willChange: "transform",
        }}
      >
        {/* ── Background image ── */}
        <div className="absolute inset-0">
          <Image
            src={exp.image}
            alt={exp.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 70vw, 290px"
            style={{ willChange: "transform" }}
          />
        </div>

        {/* ── Full gradient scrim ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.30) 50%, rgba(0,0,0,0.06) 100%)",
          }}
        />

        {/* ── Tag pill (top-left) ── */}
        <div
          className="absolute top-3.5 left-3.5"
          style={{
            background: "rgba(220,20,60,0.80)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderRadius: 9999,
            padding: "3px 10px",
            border: "1px solid rgba(255,255,255,0.18)",
          }}
        >
          <span className="text-white font-semibold text-[0.60rem] tracking-widest uppercase">
            {exp.tag}
          </span>
        </div>

        {/* ── Glassmorphism text panel (bottom) ── */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            padding: "14px 16px 18px",
            background: "rgba(4,8,22,0.52)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(255,255,255,0.09)",
          }}
        >
          {/* Orange accent bar + title */}
          <div className="flex items-start gap-2.5 mb-2">
            <div
              style={{
                width: 3,
                height: 20,
                borderRadius: 2,
                flexShrink: 0,
                marginTop: 2,
                background: "linear-gradient(to bottom, #fb923c, #f97316)",
                boxShadow: "0 0 8px rgba(249,115,22,0.60)",
              }}
            />
            <p
              className="font-bold text-white leading-snug"
              style={{ fontSize: "clamp(0.85rem, 2vw, 0.95rem)" }}
            >
              {exp.title}
            </p>
          </div>

          {/* Subtitle + Explore link */}
          <div className="flex items-center justify-between pl-[19px]">
            <p className="text-white/45 text-[0.68rem] font-medium truncate pr-2">
              {exp.subtitle}
            </p>
            <span
              className="flex items-center gap-1 text-white/70 text-[0.70rem] font-semibold flex-shrink-0"
              style={{ letterSpacing: "0.02em" }}
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
      </motion.div>
    </a>
  );
}

// ── Section ───────────────────────────────────────────────────────

export default function AdventureSection() {
  const scrollRef   = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  // Track whether there is room to scroll in each direction
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(true);

  // Read scroll position when this fires after scrollBy
  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  const scroll = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 310, behavior: "smooth" });
    setTimeout(updateArrows, 380);
  };

  return (
    <section
      style={{
        background: "var(--section-bg)",
        borderTop: "1px solid var(--section-border)",
        paddingTop: "clamp(1.25rem, 4vw, 2rem)",
        paddingBottom: "clamp(1.25rem, 4vw, 2rem)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Header row ── */}
      <div
        className="flex items-center justify-between mb-4"
        style={{ paddingLeft: "max(1rem, 4vw)", paddingRight: "max(1rem, 4vw)" }}
      >
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

      {/* ── Carousel row ── */}
      <div className="flex items-center gap-3" style={{ paddingLeft: "max(1rem, 4vw)", paddingRight: "max(1rem, 4vw)" }}>

        {/* Left arrow */}
        <AnimatePresence>
          {hovered && canLeft && (
            <motion.div
              key="arrow-left"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.18 }}
            >
              <ArrowBtn dir="left" onClick={() => scroll(-1)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll container */}
        <div
          ref={scrollRef}
          onScroll={updateArrows}
          className="flex gap-3 overflow-x-auto flex-1"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {EXPERIENCES.map((exp) => (
            <ExperienceCard key={exp.title} exp={exp} />
          ))}
          {/* Right fade spacer */}
          <div style={{ width: 8, flexShrink: 0 }} />
        </div>

        {/* Right arrow */}
        <AnimatePresence>
          {hovered && canRight && (
            <motion.div
              key="arrow-right"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.18 }}
            >
              <ArrowBtn dir="right" onClick={() => scroll(1)} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
