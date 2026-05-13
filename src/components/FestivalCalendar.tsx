"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Bell, BellRing, CalendarPlus, Calendar, Sparkles } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { FESTIVALS, CATEGORY_CONFIG, type Festival, type FestivalCategory } from "@/data/festivals";
import { googleCalUrl, downloadICS } from "@/lib/calendarUtils";

// ── Date helpers ──────────────────────────────────────────────────────

function daysUntil(iso: string): number {
  const t = new Date(iso); t.setHours(0, 0, 0, 0);
  const n = new Date();    n.setHours(0, 0, 0, 0);
  return Math.ceil((t.getTime() - n.getTime()) / 86_400_000);
}

function dayLabel(iso: string): string | null {
  const d = daysUntil(iso);
  if (d < 0)   return null;
  if (d === 0) return "Today!";
  if (d === 1) return "Tomorrow";
  if (d <= 7)  return "This week";
  if (d <= 30) return `${d}d away`;
  return null;
}

// ── Reminder helpers ──────────────────────────────────────────────────

const REMINDER_KEY = "cn-festival-reminders-v1";

function loadReminders(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(REMINDER_KEY) ?? "[]") as string[]); }
  catch { return new Set(); }
}

function persistReminders(s: Set<string>) {
  localStorage.setItem(REMINDER_KEY, JSON.stringify([...s]));
}

// ── Festival card ─────────────────────────────────────────────────────

interface CardProps {
  fest:       Festival;
  isFocus:    boolean;
  isReminded: boolean;
  onRemind:   (e: React.MouseEvent) => void;
  onAskAI:    (e: React.MouseEvent) => void;
}

function FestivalCard({ fest, isFocus, isReminded, onRemind, onAskAI }: CardProps) {
  const label  = dayLabel(fest.dateISO);
  const urgent = daysUntil(fest.dateISO) <= 7 && daysUntil(fest.dateISO) >= 0;
  const cat    = CATEGORY_CONFIG[fest.category];

  return (
    <motion.div
      className="relative rounded-[24px] overflow-hidden w-full"
      style={{ height: 480 }}
      animate={{ scale: isFocus ? 1 : 0.93, opacity: isFocus ? 1 : 0.50 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
    >
      {/* Background image */}
      <Image
        src={fest.img}
        alt={fest.name}
        fill
        className="object-cover object-center"
        sizes="(max-width: 640px) 90vw, 360px"
        priority={false}
      />

      {/* Deep gradient — strong enough to read white text at 70% card height */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(to top, rgba(4,8,22,1) 0%, rgba(4,8,22,0.88) 42%, rgba(4,8,22,0.55) 68%, rgba(4,8,22,0.14) 88%, transparent 100%)",
      }} />

      {/* Accent tint */}
      <div className="absolute inset-0" style={{
        background:   `linear-gradient(135deg, ${fest.accent}28 0%, transparent 55%)`,
        mixBlendMode: "screen",
      }} />

      {/* ── Top badges row ───────────────────────────────────────────── */}
      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
        {label ? (
          <span style={{
            background:          urgent ? `${fest.accent}cc` : "rgba(4,8,22,0.65)",
            backdropFilter:      "blur(8px)",
            WebkitBackdropFilter:"blur(8px)",
            border:              `1px solid ${urgent ? fest.accent : "rgba(255,255,255,0.18)"}`,
            borderRadius:        9999,
            padding:             "3px 10px",
            color:               "#fff",
            fontSize:            10,
            fontWeight:          700,
          }}>
            {label}
          </span>
        ) : <span />}

        {/* Category badge — always visible, clear separation from content below */}
        <span style={{
          background:    `${cat.color}28`,
          border:        `1px solid ${cat.color}65`,
          borderRadius:  9999,
          padding:       "3px 10px",
          color:         cat.color,
          fontSize:      10,
          fontWeight:    700,
          letterSpacing: "0.07em",
        }}>
          {cat.emoji} {cat.label.toUpperCase()}
        </span>
      </div>

      {/* ── Content zone: story (scrollable) + buttons (pinned) ──────── */}
      <div
        className="absolute bottom-0 left-0 right-0 flex flex-col"
        style={{ maxHeight: "76%" }}
      >
        {/* Scrollable area: month pill, name, location, story */}
        <div
          className="flex-1 overflow-y-auto px-5 pt-4 pb-1"
          style={{ minHeight: 0, WebkitOverflowScrolling: "touch" }}
        >
          {/* Month + emoji pill */}
          <span style={{
            display:      "inline-flex",
            alignItems:   "center",
            gap:          4,
            borderRadius: 9999,
            padding:      "2px 10px",
            marginBottom: 8,
            background:   `${fest.accent}25`,
            border:       `1px solid ${fest.accent}50`,
            color:        fest.accent,
            fontSize:     10,
            fontWeight:   700,
          }}>
            {fest.emoji} {fest.month}
          </span>

          {/* Festival name */}
          <h3 style={{
            color:         "#fff",
            fontWeight:    800,
            fontSize:      20,
            letterSpacing: "-0.02em",
            lineHeight:    1.2,
            marginBottom:  6,
          }}>
            {fest.name}
          </h3>

          {/* Location — icon gives visual separation from the category badge above */}
          <p style={{
            color:        "rgba(255,255,255,0.50)",
            fontSize:     11,
            marginBottom: 14,
            display:      "flex",
            alignItems:   "center",
            gap:          4,
          }}>
            <span style={{ fontSize: 11 }}>📍</span>
            {fest.location}
          </p>

          {/* Divider */}
          <div style={{
            borderTop:    "1px solid rgba(255,255,255,0.10)",
            marginBottom: 10,
          }} />

          {/* "Why we celebrate" label */}
          <p style={{
            color:         "rgba(255,255,255,0.38)",
            fontSize:      9,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            marginBottom:  6,
            fontWeight:    700,
          }}>
            Why we celebrate
          </p>

          {/* Deep story paragraph */}
          <p style={{
            color:      "rgba(255,255,255,0.72)",
            fontSize:   12,
            lineHeight: 1.65,
            paddingBottom: 4,
          }}>
            {fest.story}
          </p>
        </div>

        {/* ── Pinned bottom action row ──────────────────────────────── */}
        <div
          className="flex items-center gap-2 flex-wrap flex-shrink-0"
          style={{
            padding:   "10px 20px 14px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Remind Me */}
          <button
            onClick={onRemind}
            aria-label={isReminded ? "Reminder set" : "Set reminder"}
            className="flex items-center gap-1.5 cursor-pointer transition-all duration-150 hover:opacity-80"
            style={{
              background:   isReminded ? `${fest.accent}38` : "rgba(255,255,255,0.10)",
              border:       isReminded ? `1px solid ${fest.accent}70` : "1px solid rgba(255,255,255,0.22)",
              borderRadius: 9999,
              padding:      "5px 12px",
              color:        isReminded ? fest.accent : "rgba(255,255,255,0.80)",
              fontSize:     11,
              fontWeight:   600,
            }}
          >
            {isReminded
              ? <BellRing size={11} strokeWidth={2.5} />
              : <Bell     size={11} strokeWidth={2.5} />}
            {isReminded ? "Reminded" : "Remind Me"}
          </button>

          {/* Google Calendar */}
          <button
            onClick={() => window.open(googleCalUrl(fest), "_blank", "noopener")}
            aria-label="Add to Google Calendar"
            className="flex items-center gap-1.5 cursor-pointer transition-all duration-150 hover:opacity-80"
            style={{
              background:   "rgba(255,255,255,0.10)",
              border:       "1px solid rgba(255,255,255,0.22)",
              borderRadius: 9999,
              padding:      "5px 12px",
              color:        "rgba(255,255,255,0.80)",
              fontSize:     11,
              fontWeight:   600,
            }}
          >
            <CalendarPlus size={11} strokeWidth={2.5} />
            Google
          </button>

          {/* Apple / iCal */}
          <button
            onClick={() => downloadICS(fest)}
            aria-label="Add to Apple Calendar"
            className="flex items-center gap-1.5 cursor-pointer transition-all duration-150 hover:opacity-80"
            style={{
              background:   "rgba(255,255,255,0.10)",
              border:       "1px solid rgba(255,255,255,0.22)",
              borderRadius: 9999,
              padding:      "5px 12px",
              color:        "rgba(255,255,255,0.80)",
              fontSize:     11,
              fontWeight:   600,
            }}
          >
            <Calendar size={11} strokeWidth={2.5} />
            Apple
          </button>

          {/* Ask AI */}
          <button
            onClick={onAskAI}
            aria-label="Ask AI about this festival"
            className="flex items-center gap-1.5 cursor-pointer transition-all duration-150 hover:opacity-80 ml-auto"
            style={{
              background:   `${fest.accent}22`,
              border:       `1px solid ${fest.accent}55`,
              borderRadius: 9999,
              padding:      "5px 12px",
              color:        fest.accent,
              fontSize:     11,
              fontWeight:   600,
            }}
          >
            <Sparkles size={11} strokeWidth={2.5} />
            Ask AI
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────

export default function FestivalCalendar() {
  const { theme } = useTheme();
  const isDark    = theme === "dark";

  const [activeCategory, setActiveCategory] = useState<FestivalCategory | "all">("all");
  const [current,        setCurrent]        = useState(0);
  const [reminders,      setReminders]      = useState<Set<string>>(new Set());
  const [prevCategory,   setPrevCategory]   = useState(activeCategory);

  // Reset card index when filter changes (setState-during-render — no effect needed)
  if (activeCategory !== prevCategory) {
    setPrevCategory(activeCategory);
    setCurrent(0);
  }

  const scrollRef = useRef<HTMLDivElement>(null);

  // Hydrate reminders from localStorage
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReminders(loadReminders());
  }, []);

  // On mount: fire browser notification for reminded festivals ≤ 2 days away
  useEffect(() => {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    const ids = loadReminders();
    FESTIVALS.forEach((f) => {
      if (!ids.has(f.id)) return;
      const d = daysUntil(f.dateISO);
      if (d >= 0 && d <= 2) {
        new Notification(`🗓 Coming up: ${f.name} ${f.emoji}`, {
          body: d === 0 ? "Today!" : d === 1 ? "Tomorrow!" : "In 2 days!",
          tag:  `upcoming-${f.id}`,
        });
      }
    });
  }, []);

  // Filtered festival list
  const filtered = useMemo(
    () => activeCategory === "all" ? FESTIVALS : FESTIVALS.filter((f) => f.category === activeCategory),
    [activeCategory],
  );

  // Safe current index
  const idx = Math.min(current, Math.max(0, filtered.length - 1));

  // Reset scroll position when filter changes (setCurrent(0) is handled by setState-during-render above)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [activeCategory]);

  // Scroll programmatically to card i
  const scrollToCard = useCallback((i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement | undefined;
    if (!child) return;
    el.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
  }, []);

  // Remind Me handler
  const handleRemind = useCallback(async (fest: Festival, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!("Notification" in window)) {
      alert("This browser does not support notifications."); return;
    }
    if (Notification.permission === "denied") {
      alert("Notifications are blocked. Please enable them in your browser settings."); return;
    }
    const perm = Notification.permission === "granted"
      ? "granted"
      : await Notification.requestPermission();
    if (perm !== "granted") return;

    const d = daysUntil(fest.dateISO);
    new Notification(`🔔 Reminder set: ${fest.name} ${fest.emoji}`, {
      body: d <= 0 ? `${fest.location} — happening now!`
           : d === 1 ? `${fest.location} — tomorrow!`
           : `${fest.location} — in ${d} day${d !== 1 ? "s" : ""}`,
      tag:  `festival-set-${fest.id}`,
    });

    setReminders((prev) => {
      const next = new Set(prev);
      next.add(fest.id);
      persistReminders(next);
      return next;
    });
  }, []);

  const prev = () => {
    const i = Math.max(idx - 1, 0);
    setCurrent(i);
    scrollToCard(i);
  };
  const next = () => {
    const i = Math.min(idx + 1, filtered.length - 1);
    setCurrent(i);
    scrollToCard(i);
  };
  const goTo = (i: number) => {
    setCurrent(i);
    scrollToCard(i);
  };

  // After a native swipe, read scroll position to sync the active index + dots
  const handleTouchEnd = () => {
    const el = scrollRef.current;
    if (!el || !el.children.length) return;
    const firstChild = el.children[0] as HTMLElement;
    const cardW = firstChild.offsetWidth + 12; // card width + gap
    const i = Math.round(el.scrollLeft / cardW);
    setCurrent(Math.max(0, Math.min(i, filtered.length - 1)));
  };

  // ── Pill style helpers ─────────────────────────────────────────────
  const mutedText    = isDark ? "rgba(255,255,255,0.45)" : "#64748b";
  const activeText   = isDark ? "#ffffff"                : "#0f172a";
  const activeBg     = isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.08)";
  const inactiveBg   = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
  const activeBorder = isDark ? "1px solid rgba(255,255,255,0.20)" : "1px solid rgba(0,0,0,0.12)";

  const pillBase: React.CSSProperties = {
    borderRadius:  9999,
    padding:       "5px 14px",
    fontSize:      11,
    fontWeight:    600,
    cursor:        "pointer",
    whiteSpace:    "nowrap",
    flexShrink:    0,
    border:        "1px solid transparent",
    transition:    "all 0.15s ease",
    display:       "flex",
    alignItems:    "center",
    gap:           5,
    letterSpacing: "0.02em",
  };

  const allCats = Object.entries(CATEGORY_CONFIG) as [FestivalCategory, typeof CATEGORY_CONFIG[FestivalCategory]][];

  return (
    <section className="relative w-full py-8 sm:py-10 overflow-hidden">

      {/* Bottom scrim */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{ height: "45%", background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.40))" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ zIndex: 1 }}>

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-0.5"
              style={{ color: "var(--text-tertiary)" }}>
              Plan Around Culture
            </p>
            <h2 className="text-[18px] font-extrabold tracking-tight"
              style={{ color: "var(--text-primary)" }}>
              Cultural Hub
            </h2>
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center gap-2 mt-1">
            <motion.button
              onClick={prev}
              whileTap={{ scale: 0.88 }}
              disabled={idx === 0}
              aria-label="Previous festival"
              className="flex items-center justify-center cursor-pointer"
              style={{
                width:      34,
                height:     34,
                borderRadius: "50%",
                background: "var(--glass-bg)",
                border:     "1px solid var(--glass-border)",
                opacity:    idx === 0 ? 0.30 : 1,
              }}
            >
              <ChevronLeft size={16} color={isDark ? "white" : "#0f172a"} strokeWidth={2} />
            </motion.button>
            <motion.button
              onClick={next}
              whileTap={{ scale: 0.88 }}
              disabled={idx === filtered.length - 1}
              aria-label="Next festival"
              className="flex items-center justify-center cursor-pointer"
              style={{
                width:      34,
                height:     34,
                borderRadius: "50%",
                background: "var(--glass-bg)",
                border:     "1px solid var(--glass-border)",
                opacity:    idx === filtered.length - 1 ? 0.30 : 1,
              }}
            >
              <ChevronRight size={16} color={isDark ? "white" : "#0f172a"} strokeWidth={2} />
            </motion.button>
          </div>
        </div>

        {/* ── Category filter bar ── */}
        <div
          className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide"
          role="tablist"
          aria-label="Filter by category"
        >
          <button
            role="tab"
            aria-selected={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
            style={{
              ...pillBase,
              background: activeCategory === "all" ? activeBg  : inactiveBg,
              color:      activeCategory === "all" ? activeText : mutedText,
              border:     activeCategory === "all" ? activeBorder : "1px solid transparent",
            }}
          >
            All
          </button>

          {allCats.map(([key, { label, color, emoji }]) => (
            <button
              key={key}
              role="tab"
              aria-selected={activeCategory === key}
              onClick={() => setActiveCategory(key)}
              style={{
                ...pillBase,
                background: activeCategory === key ? `${color}18` : inactiveBg,
                color:      activeCategory === key ? color         : mutedText,
                border:     activeCategory === key ? `1px solid ${color}55` : "1px solid transparent",
              }}
            >
              <span style={{
                display:      "inline-block",
                width:        7,
                height:       7,
                borderRadius: "50%",
                background:   color,
                flexShrink:   0,
                boxShadow:    activeCategory === key ? `0 0 5px ${color}` : "none",
              }} />
              {label}
            </button>
          ))}
        </div>

        {/* ── Snap-scroll carousel ── */}
        {filtered.length === 0 ? (
          <div
            className="flex items-center justify-center rounded-[24px]"
            style={{ height: 200, color: isDark ? "rgba(255,255,255,0.30)" : "#94a3b8" }}
          >
            No festivals in this category yet.
          </div>
        ) : (
          /*
            Bleed the scroll container to the section edges so the peek is
            visible against the raw page background (not the padded container).
            Negative margin cancels the parent's px-4 / sm:px-6 padding;
            paddingLeft mirrors it so the first card stays aligned.
          */
          <div
            ref={scrollRef}
            onTouchEnd={handleTouchEnd}
            className="scrollbar-hide"
            style={{
              display:              "flex",
              overflowX:            "auto",
              scrollSnapType:       "x mandatory",
              WebkitOverflowScrolling: "touch",
              gap:                  12,
              /* bleed to viewport edges */
              marginLeft:  "calc(0px - var(--page-px, 16px))",
              marginRight: "calc(0px - var(--page-px, 16px))",
              paddingLeft: "var(--page-px, 16px)",
              paddingRight:"var(--page-px, 16px)",
              paddingBottom: 4,
            }}
          >
            {filtered.map((fest, i) => (
              <div
                key={fest.id}
                style={{
                  flexShrink:      0,
                  /* 85% of viewport shows ~15% peek; capped at 360px on large screens */
                  width:           "min(360px, calc(100% - 40px))",
                  scrollSnapAlign: "start",
                }}
                onClick={() => { if (i !== idx) goTo(i); }}
              >
                <FestivalCard
                  fest={fest}
                  isFocus={i === idx}
                  isReminded={reminders.has(fest.id)}
                  onRemind={(e) => handleRemind(fest, e)}
                  onAskAI={(e) => {
                    e.stopPropagation();
                    document.dispatchEvent(new CustomEvent("open-ai-planner", {
                      detail: {
                        prompt: `You are a Nepali cultural expert and storyteller. First, tell me the ancient legend or myth behind ${fest.name} ${fest.emoji} — the gods, heroes, or historical event at its origin. Then describe what actually happens during the celebration and where in Nepal to experience it best. It falls on ${new Date(fest.dateISO).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.`,
                        festival: {
                          name:        fest.name,
                          emoji:       fest.emoji,
                          dateISO:     fest.dateISO,
                          endDateISO:  fest.endDateISO,
                          description: fest.description,
                          location:    fest.location,
                        },
                      },
                    }));
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* ── Dot indicators ── */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {filtered.map((fest, i) => (
            <button
              key={fest.id}
              onClick={() => goTo(i)}
              aria-label={fest.name}
              className="relative cursor-pointer flex-shrink-0"
              style={{ width: i === idx ? 20 : 6, height: 6, transition: "width 0.25s ease" }}
            >
              <div className="absolute inset-0 rounded-full"
                style={{ background: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.15)" }} />
              {i === idx && (
                <motion.div
                  layoutId="festival-active-dot"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: filtered[idx].accent,
                    boxShadow:  `0 0 8px ${filtered[idx].accent}90`,
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

      </div>

      {/*
        CSS variable for the bleed calculation — matches the Tailwind px-4/sm:px-6/lg:px-8
        padding values used by the max-w-7xl container.
      */}
      <style>{`
        @media (max-width: 639px)  { :root { --page-px: 16px; } }
        @media (min-width: 640px)  { :root { --page-px: 24px; } }
        @media (min-width: 1024px) { :root { --page-px: 32px; } }
      `}</style>
    </section>
  );
}
