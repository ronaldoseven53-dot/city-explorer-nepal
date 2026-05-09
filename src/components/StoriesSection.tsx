"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// ── Story data ─────────────────────────────────────────────────────────

const U = (id: string, w = 400) =>
  `https://images.unsplash.com/${id}?w=${w}&q=85&fit=crop`;

const STORIES = [
  { id: "everest",   name: "Everest",    sub: "Base Camp",     ring: ["#3B82F6","#06B6D4"], img: U("photo-1464822759023-fed622ff2c3b"),   full: U("photo-1464822759023-fed622ff2c3b",1200),   caption: "The roof of the world at 5,364 m" },
  { id: "ktm",       name: "Kathmandu",  sub: "Valley",        ring: ["#F97316","#EF4444"], img: U("photo-1592285896110-8d88b5b3a5d8"),   full: U("photo-1592285896110-8d88b5b3a5d8",1200),   caption: "Ancient temples and 1,400 years of living heritage" },
  { id: "pokhara",   name: "Pokhara",    sub: "Lakeside",      ring: ["#22C55E","#0EA5E9"], img: U("photo-1546954552-eb2ada4a3654"),       full: U("photo-1546954552-eb2ada4a3654",1200),       caption: "Annapurna reflected in the still waters of Phewa" },
  { id: "chitwan",   name: "Chitwan",    sub: "Safari",        ring: ["#84CC16","#22C55E"], img: U("photo-1544442069-97dded965a9f"),       full: U("photo-1544442069-97dded965a9f",1200),       caption: "One-horned rhinos and Bengal tigers in the jungle" },
  { id: "lumbini",   name: "Lumbini",    sub: "Sacred Garden", ring: ["#A855F7","#EC4899"], img: U("photo-1609168494389-230528e6a9c3"),   full: U("photo-1609168494389-230528e6a9c3",1200),   caption: "Birthplace of Gautama Buddha — UNESCO World Heritage" },
  { id: "mustang",   name: "Mustang",    sub: "Desert",        ring: ["#F59E0B","#F97316"], img: U("photo-1558618666-fcd25c85cd64"),       full: U("photo-1558618666-fcd25c85cd64",1200),       caption: "The hidden Himalayan kingdom above the clouds" },
  { id: "nagarkot",  name: "Nagarkot",   sub: "Sunrise",       ring: ["#EF4444","#F59E0B"], img: U("photo-1519681393784-d120267933ba"),   full: U("photo-1519681393784-d120267933ba",1200),   caption: "Golden Himalayan sunrise over eight mountain peaks" },
  { id: "bhaktapur", name: "Bhaktapur",  sub: "Durbar",        ring: ["#6366F1","#A855F7"], img: U("photo-1513614835783-51537729c8ba"),   full: U("photo-1513614835783-51537729c8ba",1200),   caption: "Medieval Newari architecture frozen in time" },
  { id: "raralake",  name: "Rara Lake",  sub: "Remote",        ring: ["#0EA5E9","#3B82F6"], img: U("photo-1501854140801-50d01698950b"),   full: U("photo-1501854140801-50d01698950b",1200),   caption: "Nepal's largest lake deep in untouched wilderness" },
  { id: "annapurna", name: "Annapurna",  sub: "Circuit",       ring: ["#14B8A6","#22C55E"], img: U("photo-1551410224-699683e15636"),       full: U("photo-1551410224-699683e15636",1200),       caption: "The world's most diverse multi-day trekking route" },
];

// ── Story circle ───────────────────────────────────────────────────────

function StoryCircle({
  story,
  index,
  onClick,
}: {
  story: typeof STORIES[0];
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 340, damping: 24, delay: index * 0.05 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
      className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer"
      style={{ width: 76 }}
    >
      {/* Gradient ring */}
      <div
        className="rounded-full p-[2.5px] flex-shrink-0"
        style={{
          background: `linear-gradient(135deg, ${story.ring[0]}, ${story.ring[1]}, ${story.ring[0]})`,
          width: 68, height: 68,
          boxShadow: `0 0 18px ${story.ring[0]}55`,
        }}
      >
        {/* Inner gap ring */}
        <div className="rounded-full p-[2px] w-full h-full"
          style={{ background: "#080c1a" }}>
          <div className="w-full h-full rounded-full overflow-hidden relative">
            <Image src={story.img} alt={story.name} fill
              className="object-cover" sizes="68px" />
          </div>
        </div>
      </div>
      <span className="text-[10.5px] font-semibold text-center leading-tight"
        style={{ color: "rgba(255,255,255,0.80)" }}>
        {story.name}
      </span>
    </motion.button>
  );
}

// ── Cinematic story viewer ─────────────────────────────────────────────

function StoryViewer({
  startIndex,
  onClose,
}: {
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const story = STORIES[idx];

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Keyboard nav
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIdx(i => (i < STORIES.length - 1 ? i + 1 : i));
      if (e.key === "ArrowLeft")  setIdx(i => (i > 0 ? i - 1 : i));
      if (e.key === "Escape")     onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const next = () => {
    if (idx < STORIES.length - 1) setIdx(i => i + 1);
    else onClose();
  };
  const prev = () => {
    if (idx > 0) setIdx(i => i - 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
    >
      {/* Background image */}
      <AnimatePresence mode="wait">
        <motion.div key={story.id} className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Image src={story.full} alt={story.name} fill
            className="object-cover" sizes="100vw" priority />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 35%, transparent 55%, rgba(0,0,0,0.80) 100%)" }} />
        </motion.div>
      </AnimatePresence>

      {/* Progress bars */}
      <div className="absolute top-4 left-4 right-4 z-10 flex gap-1">
        {STORIES.map((_, i) => (
          <div key={i} className="flex-1 h-[3px] rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.28)" }}>
            {i < idx && (
              <div className="h-full w-full bg-white rounded-full" />
            )}
            {i === idx && (
              <motion.div
                key={`prog-${idx}`}
                className="h-full bg-white rounded-full origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 5, ease: "linear" }}
                onAnimationComplete={next}
              />
            )}
          </div>
        ))}
      </div>

      {/* Tap zones */}
      <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={prev} />
      <div className="absolute inset-y-0 right-0 w-2/3 z-10" onClick={next} />

      {/* Close — z-20 sits above tap zones */}
      <button onClick={onClose}
        className="absolute top-12 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full cursor-pointer"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.18)" }}>
        <X size={18} color="white" />
      </button>

      {/* Chevron hints */}
      {idx > 0 && (
        <ChevronLeft size={28} color="rgba(255,255,255,0.60)"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none" />
      )}
      {idx < STORIES.length - 1 && (
        <ChevronRight size={28} color="rgba(255,255,255,0.60)"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none" />
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={`content-${idx}`}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-12 left-6 right-6 z-10"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1"
            style={{ color: story.ring[0] }}>
            {story.sub}
          </p>
          <h3 className="text-white font-extrabold text-3xl tracking-tight leading-tight mb-2">
            {story.name}
          </h3>
          <p className="text-white/70 text-sm leading-relaxed">{story.caption}</p>
          <p className="text-white/35 text-xs mt-2">{idx + 1} / {STORIES.length}</p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main section ───────────────────────────────────────────────────────

export default function StoriesSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="relative w-full py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-0.5"
              style={{ color: "var(--text-tertiary)" }}>
              Nepal Through the Lens
            </p>
            <h2 className="text-[18px] font-extrabold tracking-tight"
              style={{ color: "var(--text-primary)" }}>
              Destination Stories
            </h2>
          </div>
          <button
            onClick={() => setOpen(0)}
            className="text-[12px] font-bold cursor-pointer flex items-center gap-1 transition-opacity hover:opacity-70"
            style={{ color: "#DC2626" }}
          >
            View All
            <ChevronRight size={13} strokeWidth={2.5} />
          </button>
        </div>

        {/* Horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {STORIES.map((s, i) => (
            <StoryCircle key={s.id} story={s} index={i} onClick={() => setOpen(i)} />
          ))}
        </div>
      </div>

      {/* Cinematic viewer */}
      <AnimatePresence>
        {open !== null && (
          <StoryViewer startIndex={open} onClose={() => setOpen(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
