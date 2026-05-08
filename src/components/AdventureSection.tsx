"use client";

import { motion } from "motion/react";
import Image from "next/image";
import TransitionLink from "./TransitionLink";

interface Experience {
  title: string;
  subtitle: string;
  image: string;
  href: string;
  tag: string;
}

const EXPERIENCES: Experience[] = [
  {
    title: "Trekking & High Passes",
    subtitle: "Himalayan trails",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=85",
    href: "/experience/trekking",
    tag: "Multi-day",
  },
  {
    title: "Paragliding in Pokhara",
    subtitle: "Aerial views",
    image: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&q=85",
    href: "/experience/adventure",
    tag: "Half-day",
  },
  {
    title: "Jungle Safari Chitwan",
    subtitle: "Wildlife & rhinos",
    image: "https://images.unsplash.com/photo-1544870234-c32b01786468?w=800&q=85",
    href: "/experience/adventure",
    tag: "2–3 days",
  },
  {
    title: "White Water Rafting",
    subtitle: "Grade III–V rapids",
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=85",
    href: "/experience/adventure",
    tag: "Full-day",
  },
];

// Image scale + overlay variants — parent whileHover propagates to children
const cardVariants = {
  rest:  { },
  hover: { },
};

const imgVariants = {
  rest:  { scale: 1,    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  hover: { scale: 1.07, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const overlayVariants = {
  rest:  { opacity: 0, transition: { duration: 0.3 } },
  hover: { opacity: 1, transition: { duration: 0.3 } },
};

const textVariants = {
  rest:  { y: 0, transition: { duration: 0.3 } },
  hover: { y: -4, transition: { duration: 0.3, ease: "easeOut" as const } },
};

function ExperienceCard({ exp }: { exp: Experience }) {
  return (
    <TransitionLink href={exp.href} className="block">
      <motion.div
        variants={cardVariants}
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="relative overflow-hidden cursor-pointer"
        style={{
          borderRadius: 28,
          aspectRatio: "3 / 4",
          border: "1px solid rgba(255,255,255,0.10)",
          willChange: "transform",
        }}
      >
        {/* ── Image (GPU-accelerated scale) ── */}
        <motion.div
          variants={imgVariants}
          className="absolute inset-0"
          style={{ willChange: "transform" }}
        >
          <Image
            src={exp.image}
            alt={exp.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </motion.div>

        {/* ── Static gradient: bottom-to-top ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.38) 40%, rgba(0,0,0,0.05) 75%, transparent 100%)",
          }}
        />

        {/* ── Hover darkening layer ── */}
        <motion.div
          variants={overlayVariants}
          className="absolute inset-0 pointer-events-none"
          style={{ background: "rgba(0,0,0,0.22)" }}
        />

        {/* ── Tag pill (top-left) ── */}
        <div
          className="absolute top-3.5 left-3.5"
          style={{
            background: "rgba(220,20,60,0.82)",
            backdropFilter: "blur(10px)",
            borderRadius: 9999,
            padding: "4px 10px",
            border: "1px solid rgba(255,255,255,0.18)",
          }}
        >
          <span className="text-white font-semibold text-[0.62rem] tracking-wide uppercase">
            {exp.tag}
          </span>
        </div>

        {/* ── Text block (bottom-left) ── */}
        <motion.div
          variants={textVariants}
          className="absolute bottom-0 left-0 right-0 px-4 pb-5"
        >
          <p className="font-bold text-white leading-tight mb-1"
            style={{ fontSize: "clamp(0.88rem, 2.2vw, 1.05rem)", textShadow: "0 1px 6px rgba(0,0,0,0.45)" }}
          >
            {exp.title}
          </p>
          <p className="text-white/55 text-[0.72rem] font-medium mb-3">{exp.subtitle}</p>
          <span
            className="inline-flex items-center gap-1.5 text-white font-semibold text-[0.75rem] tracking-tight"
            style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 9999,
              padding: "5px 12px",
            }}
          >
            Explore
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
              <path d="M1 5h8M6 2l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </motion.div>
      </motion.div>
    </TransitionLink>
  );
}

export default function AdventureSection() {
  return (
    <section
      style={{
        background: "var(--section-bg)",
        borderTop: "1px solid var(--section-border)",
        padding: "clamp(1.5rem, 5vw, 2.75rem) max(1rem, 4vw)",
      }}
    >
      {/* ── Section header ── */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <p style={{
            fontSize: "0.60rem", letterSpacing: "0.28em", textTransform: "uppercase",
            color: "var(--text-secondary)", fontWeight: 700, marginBottom: "6px",
          }}>
            🏔 &nbsp;Nepal Experiences
          </p>
          <h2 style={{
            fontSize: "clamp(1.15rem, 3.5vw, 1.55rem)",
            fontWeight: 800,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}>
            Adventure &amp; Experiences
          </h2>
        </div>

        <a
          href="/experience/adventure"
          className="flex items-center gap-1.5 text-[0.78rem] font-semibold transition-opacity duration-150 hover:opacity-75"
          style={{ color: "#DC143C" }}
        >
          View all
          <svg width="12" height="12" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path d="M1 5h8M6 2l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      {/* ── Card grid ── */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        {EXPERIENCES.map((exp) => (
          <ExperienceCard key={exp.title} exp={exp} />
        ))}
      </div>
    </section>
  );
}
