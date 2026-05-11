"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Bell, BellRing, CalendarPlus, Calendar } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { FESTIVALS, CATEGORY_CONFIG, type Festival, type FestivalCategory } from "@/data/festivals";

// ── Calendar helpers ──────────────────────────────────────────────────

function toCompact(iso: string) { return iso.replace(/-/g, ""); }

function googleCalUrl(f: Festival) {
  const s = toCompact(f.dateISO);
  const e = toCompact(f.endDateISO ?? f.dateISO);
  const p = new URLSearchParams({
    action:   "TEMPLATE",
    text:     `${f.name} ${f.emoji}`,
    dates:    `${s}/${e}`,
    details:  f.description,
    location: f.location,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

function downloadICS(f: Festival) {
  const s = toCompact(f.dateISO);
  const e = toCompact(f.endDateISO ?? f.dateISO);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//City Explorer Nepal//Cultural Hub//EN",
    "BEGIN:VEVENT",
    `UID:${f.id}@cityexplorernepal`,
    `DTSTART;VALUE=DATE:${s}`,
    `DTEND;VALUE=DATE:${e}`,
    `SUMMARY:${f.name} ${f.emoji}`,
    `DESCRIPTION:${f.description.replace(/[\\;,]/g, "\\$&")}`,
    `LOCATION:${f.location}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const a = Object.assign(document.createElement("a"), {
    href:     URL.createObjectURL(new Blob([ics], { type: "text/calendar" })),
    download: `${f.id}.ics`,
  });
  a.click();
}

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
  isDark:     boolean;
  onRemind:   (e: React.MouseEvent) => void;
}

function FestivalCard({ fest, isFocus, isReminded, isDark, onRemind }: CardProps) {
  const label  = dayLabel(fest.dateISO);
  const urgent = daysUntil(fest.dateISO) <= 7 && daysUntil(fest.dateISO) >= 0;
  const cat    = CATEGORY_CONFIG[fest.category];

  return (
    <motion.div
      className="relative flex-shrink-0 rounded-[24px] overflow-hidden cursor-pointer select-none"
      style={{ width: "100%", height: 320 }}
      animate={{ scale: isFocus ? 1 : 0.94, opacity: isFocus ? 1 : 0.55 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
    >
      <Image src={fest.img} alt={fest.name} fill className="object-cover object-center"
        sizes="(max-width: 640px) 80vw, 33vw" priority={false} />

      {/* Dark gradient */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(to top, rgba(4,8,22,0.97) 0%, rgba(4,8,22,0.55) 50%, rgba(4,8,22,0.12) 100%)",
      }} />

      {/* Accent tint */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(135deg, ${fest.accent}22 0%, transparent 55%)`,
        mixBlendMode: "screen",
      }} />

      {/* Top badges */}
      {isFocus && (
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
          {/* Days-until badge */}
          {label ? (
            <span style={{
              background:   urgent ? `${fest.accent}cc` : "rgba(4,8,22,0.65)",
              backdropFilter: "blur(8px)",
              border:       `1px solid ${urgent ? fest.accent : "rgba(255,255,255,0.18)"}`,
              borderRadius: 9999,
              padding:      "3px 10px",
              color:        "#fff",
              fontSize:     10,
              fontWeight:   700,
            }}>
              {label}
            </span>
          ) : <span />}

          {/* Category badge */}
          <span style={{
            background:   `${cat.color}28`,
            border:       `1px solid ${cat.color}60`,
            borderRadius: 9999,
            padding:      "3px 10px",
            color:        cat.color,
            fontSize:     10,
            fontWeight:   700,
            letterSpacing: "0.07em",
          }}>
            {cat.emoji} {cat.label.toUpperCase()}
          </span>
        </div>
      )}

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        {/* Month pill */}
        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold mb-2"
          style={{
            background: `${fest.accent}25`,
            border:     `1px solid ${fest.accent}50`,
            color:      fest.accent,
          }}>
          {fest.emoji} {fest.month}
        </span>

        <h3 className="text-white font-extrabold text-[18px] tracking-tight leading-tight mb-1">
          {fest.name}
        </h3>

        <p className="text-white/45 text-[10.5px] mb-2">{fest.location}</p>

        <AnimatePresence mode="wait">
          {isFocus && (
            <motion.div key="focus-extras"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
            >
              <p className="text-white/65 text-[11px] leading-relaxed mb-3">
                {fest.description}
              </p>

              {/* Action buttons — stop propagation so card click isn't triggered */}
              <div
                className="flex items-center gap-2 flex-wrap"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Remind Me */}
                <button
                  onClick={onRemind}
                  className="flex items-center gap-1.5 cursor-pointer transition-all duration-150 hover:opacity-80"
                  aria-label={isReminded ? "Reminder set" : "Set reminder"}
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
                  className="flex items-center gap-1.5 cursor-pointer transition-all duration-150 hover:opacity-80"
                  aria-label="Add to Google Calendar"
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
                  className="flex items-center gap-1.5 cursor-pointer transition-all duration-150 hover:opacity-80"
                  aria-label="Add to Apple Calendar"
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
  const [cardW,          setCardW]          = useState(260);

  const trackRef    = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);

  // Hydrate reminders from localStorage
  useEffect(() => { setReminders(loadReminders()); }, []);

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

  // Reset index when filter changes
  useEffect(() => { setCurrent(0); }, [activeCategory]);

  // Safe current index
  const idx = Math.min(current, Math.max(0, filtered.length - 1));

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
      tag: `festival-set-${fest.id}`,
    });

    setReminders((prev) => {
      const next = new Set(prev);
      next.add(fest.id);
      persistReminders(next);
      return next;
    });
  }, []);

  // Measure card width responsively
  const measure = useCallback(() => {
    if (!trackRef.current) return;
    const w = trackRef.current.clientWidth;
    setCardW(Math.round((w - 16 * 2) / 3));
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [measure]);

  const gap    = 12;
  const trackW = trackRef.current?.clientWidth ?? 0;
  const offset = -(idx * (cardW + gap)) + (trackW / 2 - cardW / 2 - cardW - gap);

  const prev = () => setCurrent((c) => Math.max(c - 1, 0));
  const next = () => setCurrent((c) => Math.min(c + 1, filtered.length - 1));

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd   = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -40) next();
    else if (dx > 40) prev();
  };

  // Shared pill base style
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
  };

  const mutedText   = isDark ? "rgba(255,255,255,0.45)" : "#64748b"; // slate-500
  const activeText  = isDark ? "#ffffff"                : "#0f172a"; // slate-900
  const activeBg    = isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.08)";
  const inactiveBg  = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
  const activeBorder = isDark ? "1px solid rgba(255,255,255,0.20)" : "1px solid rgba(0,0,0,0.12)";

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

          {/* Arrows */}
          <div className="flex items-center gap-2 mt-1">
            <motion.button onClick={prev} whileTap={{ scale: 0.88 }} disabled={idx === 0}
              aria-label="Previous festival"
              className="flex items-center justify-center cursor-pointer"
              style={{
                width: 34, height: 34, borderRadius: "50%",
                background: "var(--glass-bg)", border: "1px solid var(--glass-border)",
                opacity: idx === 0 ? 0.3 : 1,
              }}>
              <ChevronLeft size={16} color={isDark ? "white" : "#0f172a"} strokeWidth={2} />
            </motion.button>
            <motion.button onClick={next} whileTap={{ scale: 0.88 }} disabled={idx === filtered.length - 1}
              aria-label="Next festival"
              className="flex items-center justify-center cursor-pointer"
              style={{
                width: 34, height: 34, borderRadius: "50%",
                background: "var(--glass-bg)", border: "1px solid var(--glass-border)",
                opacity: idx === filtered.length - 1 ? 0.3 : 1,
              }}>
              <ChevronRight size={16} color={isDark ? "white" : "#0f172a"} strokeWidth={2} />
            </motion.button>
          </div>
        </div>

        {/* ── Category filter bar ── */}
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide" role="tablist" aria-label="Filter by category">

          {/* All */}
          <button
            role="tab"
            aria-selected={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
            style={{
              ...pillBase,
              background:  activeCategory === "all" ? activeBg  : inactiveBg,
              color:       activeCategory === "all" ? activeText : mutedText,
              border:      activeCategory === "all" ? activeBorder : "1px solid transparent",
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
                color:      activeCategory === key ? color           : mutedText,
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
              {emoji} {label}
            </button>
          ))}

        </div>

        {/* ── Slider track ── */}
        <div ref={trackRef} className="relative overflow-hidden"
          onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}
          style={{ height: 330 }}>

          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-full"
              style={{ color: isDark ? "rgba(255,255,255,0.30)" : "#94a3b8" }}>
              No festivals in this category yet.
            </div>
          ) : (
            <motion.div
              className="absolute flex"
              style={{ gap, top: 0, left: 0, paddingLeft: trackW / 2 - cardW / 2 - cardW - gap }}
              animate={{ x: offset }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
            >
              {filtered.map((fest, i) => (
                <div key={fest.id} style={{ width: cardW, flexShrink: 0 }} onClick={() => setCurrent(i)}>
                  <FestivalCard
                    fest={fest}
                    isFocus={i === idx}
                    isReminded={reminders.has(fest.id)}
                    isDark={isDark}
                    onRemind={(e) => handleRemind(fest, e)}
                  />
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* ── Dot indicators ── */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {filtered.map((fest, i) => (
            <button key={fest.id} onClick={() => setCurrent(i)} aria-label={fest.name}
              className="relative cursor-pointer flex-shrink-0"
              style={{ width: i === idx ? 20 : 6, height: 6, transition: "width 0.25s ease" }}>
              <div className="absolute inset-0 rounded-full"
                style={{ background: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.15)" }} />
              {i === idx && (
                <motion.div layoutId="festival-active-dot" className="absolute inset-0 rounded-full"
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
    </section>
  );
}
