"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { Plane, Bus, Car, X, Plus } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useTripContext, MAX_STOPS, COST_MIN_PER_DAY, COST_MAX_PER_DAY, type TripCityId } from "@/context/TripContext";
import { getRoute, ROUTE_COLORS, type RouteMode } from "@/data/tripRoutes";

// ── Lazy-load the Mapbox map (avoids SSR crash) ────────────────────────

const TripRouteMap = dynamic(() => import("./TripRouteMap"), { ssr: false });

// ── Images palette (display-only — state lives in TripContext) ─────────

const U = (id: string) => `https://images.unsplash.com/${id}?w=160&q=80&fit=crop`;

const PALETTE = [
  { id: "ktm" as TripCityId, name: "Kathmandu",  img: U("photo-1592285896110-8d88b5b3a5d8"), days: 2, color: "#F97316" },
  { id: "pok" as TripCityId, name: "Pokhara",    img: U("photo-1546954552-eb2ada4a3654"),     days: 2, color: "#0EA5E9" },
  { id: "chi" as TripCityId, name: "Chitwan",    img: U("photo-1544442069-97dded965a9f"),     days: 2, color: "#84CC16" },
  { id: "lum" as TripCityId, name: "Lumbini",    img: U("photo-1609168494389-230528e6a9c3"),  days: 1, color: "#A855F7" },
  { id: "bha" as TripCityId, name: "Bhaktapur",  img: U("photo-1513614835783-51537729c8ba"), days: 1, color: "#6366F1" },
  { id: "ana" as TripCityId, name: "Annapurna",  img: U("photo-1551410224-699683e15636"),     days: 3, color: "#22C55E" },
  { id: "mus" as TripCityId, name: "Mustang",    img: U("photo-1558618666-fcd25c85cd64"),     days: 3, color: "#F59E0B" },
  { id: "rar" as TripCityId, name: "Rara Lake",  img: U("photo-1501854140801-50d01698950b"), days: 2, color: "#14B8A6" },
];

// Lucide icons kept here (React component refs — not serialisable)
const ROUTE_ICONS: Record<RouteMode, React.ElementType> = {
  flight: Plane,
  bus:    Bus,
  drive:  Car,
};

const ROUTE_TEXT_LABELS: Record<RouteMode, string> = {
  flight: "Fly", bus: "Bus", drive: "Drive",
};

function getRouteDisplay(a: TripCityId, b: TripCityId) {
  return getRoute(a, b);
}

// ── Desktop: horizontal route connector ───────────────────────────────

function RouteConnector({ from, to }: { from: TripCityId; to: TripCityId }) {
  const route = getRouteDisplay(from, to);
  const Icon  = ROUTE_ICONS[route.mode];
  const col   = ROUTE_COLORS[route.mode];

  return (
    <div className="flex flex-col items-center justify-center flex-shrink-0"
      style={{ width: 64, marginTop: -4 }}>
      <div className="w-full flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex-1 h-[1.5px] rounded-full"
            style={{ background: `${col}55` }} />
        ))}
      </div>
      <div className="flex items-center gap-1 rounded-full px-2 py-0.5 mt-1"
        style={{ background: `${col}18`, border: `1px solid ${col}40` }}>
        <Icon size={9} color={col} strokeWidth={2} />
        <span style={{ fontSize: 8, fontWeight: 700, color: col, lineHeight: 1 }}>{route.time}</span>
      </div>
    </div>
  );
}

// ── Desktop: horizontal stop node ─────────────────────────────────────

type PaletteEntry = typeof PALETTE[number];

function StopNode({ dest, dayStart, onRemove }: { dest: PaletteEntry; dayStart: number; onRemove: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={{ type: "spring", stiffness: 340, damping: 24 }}
      className="flex flex-col items-center gap-2 flex-shrink-0"
      style={{ width: 72 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative">
        <div className="absolute rounded-full"
          style={{ inset: -2, background: `conic-gradient(${dest.color}cc, ${dest.color}22, ${dest.color}cc)`, filter: "blur(1.5px)" }} />
        <div className="relative rounded-full p-[2px]"
          style={{ background: "#080c1a", width: 60, height: 60, zIndex: 1 }}>
          <div className="w-full h-full rounded-full overflow-hidden relative">
            <Image src={dest.img} alt={dest.name} fill className="object-cover" sizes="60px" />
          </div>
        </div>
        <div className="absolute -top-1 -right-1 z-10 rounded-full flex items-center justify-center"
          style={{ width: 18, height: 18, background: dest.color, boxShadow: `0 0 8px ${dest.color}99`, fontSize: 8, fontWeight: 800, color: "#fff" }}>
          {dest.days}d
        </div>
        <AnimatePresence>
          {hovered && (
            <motion.button
              onClick={onRemove}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 z-20 flex items-center justify-center rounded-full cursor-pointer"
              style={{ background: "rgba(0,0,0,0.62)", backdropFilter: "blur(4px)" }}
            >
              <X size={16} color="white" strokeWidth={2.5} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[10px] font-bold text-center leading-tight" style={{ color: "var(--text-primary)" }}>
          {dest.name}
        </span>
        <span className="text-[9px] font-medium text-center" style={{ color: "var(--text-tertiary)" }}>
          Day {dayStart}–{dayStart + dest.days - 1}
        </span>
      </div>
    </motion.div>
  );
}

// ── Mobile: vertical checklist ─────────────────────────────────────────

function MobileChecklist({ dests, onRemove }: { dests: PaletteEntry[]; onRemove: (id: TripCityId) => void }) {
  return (
    <div className="px-5 py-5">
      <AnimatePresence mode="popLayout">
        {dests.map((dest, i) => {
          const dayStart  = dests.slice(0, i).reduce((s, d) => s + d.days, 1);
          const isLast    = i === dests.length - 1;
          const next      = !isLast ? dests[i + 1] : null;
          const route     = next ? getRouteDisplay(dest.id, next.id) : null;
          const RouteIcon = route ? ROUTE_ICONS[route.mode] : null;
          const col       = route ? ROUTE_COLORS[route.mode] : "#888";

          return (
            <motion.div
              key={dest.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: "spring", stiffness: 340, damping: 24 }}
            >
              <div className="flex gap-3">
                <div className="flex flex-col items-center flex-shrink-0" style={{ width: 32 }}>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full text-white font-extrabold text-[11px] flex-shrink-0"
                    style={{ background: dest.color, boxShadow: `0 0 10px ${dest.color}55` }}>
                    {i + 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5" style={{ minHeight: 52 }}>
                    <div className="relative rounded-xl overflow-hidden flex-shrink-0" style={{ width: 44, height: 44 }}>
                      <Image src={dest.img} alt={dest.name} fill className="object-cover" sizes="44px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[14px] leading-tight" style={{ color: "var(--text-primary)" }}>{dest.name}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                        {dest.days} day{dest.days !== 1 ? "s" : ""} · Day {dayStart}–{dayStart + dest.days - 1}
                      </p>
                    </div>
                    <button
                      onClick={() => onRemove(dest.id)}
                      aria-label={`Remove ${dest.name}`}
                      className="flex items-center justify-center rounded-full cursor-pointer flex-shrink-0"
                      style={{ width: 32, height: 32, background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.25)" }}
                    >
                      <X size={13} color="#EF4444" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
              {!isLast && (
                <div className="flex gap-3">
                  <div className="flex justify-center flex-shrink-0" style={{ width: 32 }}>
                    <div className="w-[2px] rounded-full" style={{ background: `${dest.color}30`, minHeight: 36 }} />
                  </div>
                  <div className="flex items-center gap-2 py-2">
                    {RouteIcon && (
                      <div className="flex items-center justify-center rounded-full flex-shrink-0"
                        style={{ width: 26, height: 26, background: `${col}18`, border: `1px solid ${col}45` }}>
                        <RouteIcon size={12} color={col} strokeWidth={2} />
                      </div>
                    )}
                    <span style={{ fontSize: 12, fontWeight: 700, color: col }}>
                      {route ? `${ROUTE_TEXT_LABELS[route.mode]} · ${route.time} · ${route.cost}` : ""}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// ── Packing list line renderer (dark-mode aware) ───────────────────────

function formatPackingLine(line: string, isDark: boolean): React.ReactNode {
  if (!line.trim()) return null;
  if (/^\*\*.+\*\*$/.test(line.trim())) {
    return (
      <p style={{
        fontWeight: 700, fontSize: 10, textTransform: "uppercase",
        letterSpacing: "0.14em", marginTop: 14, marginBottom: 4,
        color: isDark ? "rgba(255,255,255,0.45)" : "#64748b",
      }}>
        {line.trim().replace(/\*\*/g, "")}
      </p>
    );
  }
  if (/^💡/.test(line.trim())) {
    return (
      <li style={{
        display: "flex", alignItems: "flex-start", gap: 6,
        fontSize: 11, lineHeight: 1.55, padding: "6px 10px", marginTop: 4,
        borderRadius: 10, listStyle: "none",
        background: isDark ? "rgba(245,158,11,0.10)" : "rgba(245,158,11,0.12)",
        border:     isDark ? "1px solid rgba(245,158,11,0.25)" : "1px solid rgba(245,158,11,0.35)",
        color:      isDark ? "#FCD34D" : "#92400E",
      }}>
        <span style={{ flexShrink: 0 }}>{line.trim()}</span>
      </li>
    );
  }
  if (/^[-•*]\s/.test(line.trim())) {
    return (
      <li style={{ display: "flex", alignItems: "flex-start", gap: 6, listStyle: "none",
        fontSize: 12, lineHeight: 1.5, padding: "2px 0",
        color: isDark ? "rgba(255,255,255,0.72)" : "#374151" }}>
        <span style={{ color: "#22C55E", flexShrink: 0, marginTop: 1 }}>✓</span>
        <span>{line.trim().replace(/^[-•*]\s/, "")}</span>
      </li>
    );
  }
  return <p style={{ fontSize: 11, color: isDark ? "rgba(255,255,255,0.45)" : "#6B7280" }}>{line}</p>;
}

// ── Main section ───────────────────────────────────────────────────────

export default function ItineraryTimeline() {
  const { theme } = useTheme();
  const isDark    = theme === "dark";

  // ── Trip state from global context ──────────────────────────────────
  const {
    selectedIds, selectedCities, totalDays, budgetUSD,
    startDate, travelMonth, travelMonthName,
    toggleCity, removeCity, setStartDate,
  } = useTripContext();

  // ── Local UI state ───────────────────────────────────────────────────
  const [packOpen,    setPackOpen]    = useState(false);
  const [packText,    setPackText]    = useState("");
  const [packLoading, setPackLoading] = useState(false);
  const packAbortRef = useRef<AbortController | null>(null);

  // Palette entries for currently selected IDs (images + display colours)
  const selectedDests = selectedIds.map((id) => PALETTE.find((p) => p.id === id)!);
  const budgetMin     = budgetUSD.min;
  const budgetMax     = budgetUSD.max;

  // ── Packing list generator ───────────────────────────────────────────
  const generatePacking = async () => {
    packAbortRef.current?.abort();
    packAbortRef.current = new AbortController();
    setPackOpen(true);
    setPackLoading(true);
    setPackText("");

    const tripContext = {
      cities:     selectedCities.map((c) => c.name),
      month:      travelMonthName,
      totalDays,
      categories: [...new Set(selectedCities.map((c) => c.category))],
    };

    try {
      const res = await fetch("/api/generate-packing-list", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(tripContext),
        signal:  packAbortRef.current.signal,
      });
      setPackLoading(false);
      const reader  = res.body!.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setPackText((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setPackLoading(false);
        setPackText("Sorry, couldn't generate the packing list. Please try again.");
      }
    }
  };

  return (
    <>
    <section className="relative w-full py-8 sm:py-10 overflow-hidden">

      <div aria-hidden className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{ height: "45%", background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.40))" }} />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8" style={{ zIndex: 1 }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-0.5"
              style={{ color: "var(--text-tertiary)" }}>
              Build Your Journey
            </p>
            <h2 className="text-[18px] font-extrabold tracking-tight"
              style={{ color: "var(--text-primary)" }}>
              Custom Trip Builder
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {totalDays > 0 && (
              <motion.div layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                className="rounded-full px-3 py-1.5 text-[11px] font-bold"
                style={{
                  background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
                  color: "var(--text-primary)", border: "1px solid var(--glass-border)",
                }}>
                {selectedIds.length} stop{selectedIds.length !== 1 ? "s" : ""} · {totalDays}d
              </motion.div>
            )}
          </div>
        </div>

        {/* ── Destination picker ── */}
        <div className="flex flex-nowrap sm:flex-wrap overflow-x-auto sm:overflow-visible scrollbar-hide gap-2 mb-6 pb-1">
          {PALETTE.map((dest) => {
            const isSelected = selectedIds.includes(dest.id);
            const isDisabled = !isSelected && selectedIds.length >= MAX_STOPS;
            return (
              <motion.button
                key={dest.id}
                onClick={() => !isDisabled && toggleCity(dest.id)}
                whileTap={!isDisabled ? { scale: 0.93 } : {}}
                transition={{ type: "spring", stiffness: 420, damping: 22 }}
                className="flex items-center gap-2 rounded-full flex-shrink-0"
                style={{
                  padding:    "8px 14px",
                  minHeight:  40,
                  background: isSelected ? `${dest.color}20` : isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                  border:     isSelected ? `1.5px solid ${dest.color}70` : "1.5px solid var(--glass-border)",
                  opacity:    isDisabled ? 0.35 : 1,
                  cursor:     isDisabled ? "not-allowed" : "pointer",
                }}
              >
                <div className="relative rounded-full overflow-hidden flex-shrink-0" style={{ width: 22, height: 22 }}>
                  <Image src={dest.img} alt={dest.name} fill className="object-cover" sizes="22px" />
                </div>
                <span className="text-[12px] font-semibold whitespace-nowrap"
                  style={{ color: isSelected ? dest.color : "var(--text-secondary)" }}>
                  {dest.name}
                </span>
                {isSelected
                  ? <X size={11} color={dest.color} strokeWidth={2.5} />
                  : <Plus size={11} color="var(--text-tertiary)" strokeWidth={2.5} />}
              </motion.button>
            );
          })}
          {selectedIds.length >= MAX_STOPS && (
            <span className="text-[10px] font-semibold self-center flex-shrink-0"
              style={{ color: "var(--text-tertiary)" }}>
              Max {MAX_STOPS} stops
            </span>
          )}
        </div>

        {/* ── Route display card ── */}
        <div className="rounded-[22px] overflow-hidden"
          style={{
            background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
            border: "1px solid var(--glass-border)",
            minHeight: 140,
          }}>

          {selectedIds.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center gap-2 py-10">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1"
                style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                <Plus size={18} color="var(--text-tertiary)" strokeWidth={2} />
              </div>
              <p className="text-[13px] font-semibold" style={{ color: "var(--text-secondary)" }}>
                Select destinations above to build your route
              </p>
              <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                Up to {MAX_STOPS} stops · shortest path auto-calculated
              </p>
            </motion.div>
          ) : (
            <>
              <div className="sm:hidden">
                <MobileChecklist dests={selectedDests} onRemove={removeCity} />
              </div>
              <div className="hidden sm:block overflow-x-auto scrollbar-hide px-5 py-5">
                <div className="flex items-center" style={{ minWidth: "max-content", gap: 0 }}>
                  <AnimatePresence mode="popLayout">
                    {selectedDests.map((dest, i) => {
                      const dayStart = selectedDests.slice(0, i).reduce((s, d) => s + d.days, 1);
                      return (
                        <div key={dest.id} className="flex items-center">
                          <StopNode dest={dest} dayStart={dayStart} onRemove={() => removeCity(dest.id)} />
                          {i < selectedDests.length - 1 && (
                            <RouteConnector from={dest.id} to={selectedDests[i + 1].id} />
                          )}
                        </div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Mapbox route map (appears when 2+ cities selected) ── */}
        <TripRouteMap />

        {/* ── Planning Bar (iOS-style glassmorphism card) ── */}
        <AnimatePresence>
          {totalDays > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3 }}
              className="mt-4 rounded-[24px] overflow-hidden"
              style={{
                background:           "rgba(255,255,255,0.10)",
                backdropFilter:       "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border:               "1px solid rgba(255,255,255,0.20)",
              }}
            >
              {/* Top half: Est. total + Travel Month */}
              <div className="px-5 pt-5 pb-4 flex flex-col gap-4">
                {/* Budget summary */}
                <div>
                  <p className="font-bold leading-tight"
                    style={{ fontSize: 18, color: "var(--text-primary)" }}>
                    Est. ${budgetMin}–${budgetMax} total
                  </p>
                  <p className="text-[12px] mt-1"
                    style={{ color: isDark ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.40)" }}>
                    ${COST_MIN_PER_DAY}–${COST_MAX_PER_DAY}/day · {totalDays}d · {selectedIds.length} stop{selectedIds.length !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Travel month — native iOS picker look */}
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] mb-1.5"
                    style={{ color: isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.38)" }}>
                    Travel Month
                  </p>
                  <input
                    type="month"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    aria-label="Select travel month"
                    style={{
                      background:   isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                      border:       `1px solid ${isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.12)"}`,
                      borderRadius: 12,
                      padding:      "9px 14px",
                      fontSize:     16,
                      fontWeight:   500,
                      color:        "var(--text-primary)",
                      colorScheme:  isDark ? "dark" : "light",
                      outline:      "none",
                      cursor:       "pointer",
                      width:        "100%",
                    } as React.CSSProperties}
                  />
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.08)", margin: "0 20px" }} />

              {/* Bottom half: two full-width stacked buttons */}
              <div className="px-5 pt-4 pb-5 flex flex-col gap-2.5">
                {/* Plan with AI — solid red */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 440, damping: 22 }}
                  className="w-full cursor-pointer rounded-[14px] text-[14px] font-bold text-white"
                  style={{
                    background: "#DC2626",
                    boxShadow:  "0 4px 20px rgba(220,38,38,0.35)",
                    minHeight:  48,
                    border:     "none",
                  }}
                  onClick={() => {
                    const names  = selectedCities.map((c) => c.name);
                    const budget = `$${budgetMin}–$${budgetMax}`;
                    const when   = travelMonth ? ` in ${travelMonth}` : "";
                    const prompt = `I'm planning ${totalDays} days in Nepal: **${names.join(" → ")}**${when}. My estimated budget is ${budget}.\n\nPlease build a day-by-day itinerary for this trip. For each day include morning / afternoon / evening activities, top landmarks, local food, and practical tips. Call the buildItinerary tool.`;
                    document.dispatchEvent(new CustomEvent("open-ai-planner", { detail: { prompt } }));
                  }}
                >
                  Plan with AI
                </motion.button>

                {/* Smart Packing List — ghost green */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 440, damping: 22 }}
                  onClick={generatePacking}
                  className="w-full cursor-pointer rounded-[14px] text-[14px] font-bold"
                  style={{
                    background: "transparent",
                    border:     "1px solid rgba(34,197,94,0.55)",
                    color:      "#22C55E",
                    minHeight:  48,
                  }}
                >
                  Smart Packing List
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>

    {/* ── Packing List Modal ── */}
    {packOpen && (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="w-full max-w-md flex flex-col overflow-hidden"
          style={{
            maxHeight:    "85vh",
            borderRadius: 28,
            background:   isDark ? "#0e1018" : "#ffffff",
            border:       isDark ? "1px solid rgba(255,255,255,0.09)" : "1px solid rgba(0,0,0,0.08)",
            boxShadow:    "0 24px 60px rgba(0,0,0,0.45)",
          }}
        >
          <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
            style={{ borderBottom: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #f1f5f9" }}>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🎒</span>
              <div>
                <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Smart Packing List</p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                  {selectedCities.map((c) => c.name).join(" → ")}
                  {travelMonth ? ` · ${travelMonth}` : ""}
                </p>
              </div>
            </div>
            <button
              onClick={() => { packAbortRef.current?.abort(); setPackOpen(false); setPackText(""); }}
              aria-label="Close packing list"
              className="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-colors"
              style={{ background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)", color: "var(--text-tertiary)", fontSize: 16 }}
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
            {packLoading && (
              <div className="flex items-center gap-2 text-sm py-4" style={{ color: "var(--text-tertiary)" }}>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-bounce [animation-delay:0ms]"   />
                <span className="w-2 h-2 rounded-full bg-green-400 animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-green-400 animate-bounce [animation-delay:300ms]" />
                <span className="ml-1 text-xs">Building your personalised list…</span>
              </div>
            )}
            {packText && (
              <ul className="space-y-0.5 pb-2">
                {packText.split("\n").map((line, i) => (
                  <span key={i}>{formatPackingLine(line, isDark)}</span>
                ))}
              </ul>
            )}
          </div>
          <div className="flex items-center justify-between px-5 py-3 flex-shrink-0"
            style={{ borderTop: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #f1f5f9" }}>
            <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
              Tailored to your route, season &amp; culture
            </p>
            <button onClick={generatePacking} className="text-xs font-semibold cursor-pointer transition-colors" style={{ color: "#16a34a" }}>
              Regenerate ↺
            </button>
          </div>
        </motion.div>
      </div>
    )}
    </>
  );
}
