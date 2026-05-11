"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { Plane, Bus, Car, X, Plus, Route } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

// ── Destination palette ────────────────────────────────────────────────

const U = (id: string) => `https://images.unsplash.com/${id}?w=160&q=80&fit=crop`;

const PALETTE = [
  { id: "ktm", name: "Kathmandu",  img: U("photo-1592285896110-8d88b5b3a5d8"), days: 2, color: "#F97316" },
  { id: "pok", name: "Pokhara",    img: U("photo-1546954552-eb2ada4a3654"),     days: 2, color: "#0EA5E9" },
  { id: "chi", name: "Chitwan",    img: U("photo-1544442069-97dded965a9f"),     days: 2, color: "#84CC16" },
  { id: "lum", name: "Lumbini",    img: U("photo-1609168494389-230528e6a9c3"),  days: 1, color: "#A855F7" },
  { id: "bha", name: "Bhaktapur",  img: U("photo-1513614835783-51537729c8ba"), days: 1, color: "#6366F1" },
  { id: "ana", name: "Annapurna", img: U("photo-1551410224-699683e15636"),     days: 3, color: "#22C55E" },
  { id: "mus", name: "Mustang",    img: U("photo-1558618666-fcd25c85cd64"),     days: 3, color: "#F59E0B" },
  { id: "rar", name: "Rara Lake",  img: U("photo-1501854140801-50d01698950b"), days: 2, color: "#14B8A6" },
] as const;

type DestId = typeof PALETTE[number]["id"];

// ── Geographic coordinates (lat, lng) for nearest-neighbor sort ────────

const COORDS: Record<DestId, [number, number]> = {
  ktm: [27.7172, 85.3240],
  pok: [28.2096, 83.9856],
  chi: [27.5291, 84.3542],
  lum: [27.4833, 83.2833],
  bha: [27.6722, 85.4278],
  ana: [28.5167, 83.8667],
  mus: [28.9958, 83.8506],
  rar: [29.5167, 82.0833],
};

function geoDistSq(a: DestId, b: DestId): number {
  const [la, lo] = COORDS[a];
  const [lb, ob] = COORDS[b];
  return (la - lb) ** 2 + (lo - ob) ** 2;
}

function nearestNeighborSort(ids: DestId[]): DestId[] {
  if (ids.length <= 2) return ids;
  const remaining = new Set(ids.slice(1));
  const path: DestId[] = [ids[0]];
  while (remaining.size > 0) {
    const cur = path[path.length - 1];
    let best: DestId = remaining.values().next().value as DestId;
    let bestDist = geoDistSq(cur, best);
    remaining.forEach((id) => {
      const d = geoDistSq(cur, id);
      if (d < bestDist) { bestDist = d; best = id; }
    });
    path.push(best);
    remaining.delete(best);
  }
  return path;
}

// ── Route lookup ───────────────────────────────────────────────────────

type RouteMode = "flight" | "bus" | "drive";

const ROUTES: Record<string, { mode: RouteMode; time: string }> = {
  "ktm-pok": { mode: "flight", time: "25 min" },
  "ktm-chi": { mode: "bus",    time: "5 hr"   },
  "ktm-lum": { mode: "bus",    time: "6 hr"   },
  "ktm-bha": { mode: "drive",  time: "30 min" },
  "ktm-ana": { mode: "flight", time: "35 min" },
  "ktm-mus": { mode: "flight", time: "1 hr"   },
  "ktm-rar": { mode: "flight", time: "45 min" },
  "pok-chi": { mode: "bus",    time: "5 hr"   },
  "pok-ana": { mode: "drive",  time: "4 hr"   },
  "pok-mus": { mode: "drive",  time: "5 hr"   },
  "chi-lum": { mode: "bus",    time: "3 hr"   },
  "bha-pok": { mode: "bus",    time: "6 hr"   },
};

const ROUTE_ICONS: Record<RouteMode, React.ElementType> = {
  flight: Plane,
  bus:    Bus,
  drive:  Car,
};

const ROUTE_COLORS: Record<RouteMode, string> = {
  flight: "#0EA5E9", bus: "#F97316", drive: "#84CC16",
};

const ROUTE_LABELS: Record<RouteMode, string> = {
  flight: "Fly", bus: "Bus", drive: "Drive",
};

function getRoute(a: DestId, b: DestId) {
  return ROUTES[`${a}-${b}`] ?? ROUTES[`${b}-${a}`] ?? { mode: "bus" as RouteMode, time: "varies" };
}

const MAX_STOPS        = 5;
const COST_MIN_PER_DAY = 50;
const COST_MAX_PER_DAY = 80;

// ── Desktop: horizontal route connector ───────────────────────────────

function RouteConnector({ from, to }: { from: DestId; to: DestId }) {
  const route = getRoute(from, to);
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

function StopNode({
  dest, dayStart, onRemove,
}: {
  dest: typeof PALETTE[number]; dayStart: number; onRemove: () => void;
}) {
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

function MobileChecklist({
  dests,
  onRemove,
}: {
  dests: typeof PALETTE[number][];
  onRemove: (id: DestId) => void;
}) {
  return (
    <div className="px-5 py-5">
      <AnimatePresence mode="popLayout">
        {dests.map((dest, i) => {
          const dayStart = dests.slice(0, i).reduce((s, d) => s + d.days, 1);
          const isLast   = i === dests.length - 1;
          const next     = !isLast ? dests[i + 1] : null;
          const route    = next ? getRoute(dest.id, next.id) : null;
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
              {/* ── Stop row ── */}
              <div className="flex gap-3">
                {/* Timeline: numbered circle */}
                <div className="flex flex-col items-center flex-shrink-0" style={{ width: 32 }}>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full text-white font-extrabold text-[11px] flex-shrink-0"
                    style={{ background: dest.color, boxShadow: `0 0 10px ${dest.color}55` }}>
                    {i + 1}
                  </div>
                </div>

                {/* Content: image + name + days + remove */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5" style={{ minHeight: 52 }}>
                    <div className="relative rounded-xl overflow-hidden flex-shrink-0" style={{ width: 44, height: 44 }}>
                      <Image src={dest.img} alt={dest.name} fill className="object-cover" sizes="44px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[14px] leading-tight" style={{ color: "var(--text-primary)" }}>
                        {dest.name}
                      </p>
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

              {/* ── Connector: vertical line + transport badge ── */}
              {!isLast && (
                <div className="flex gap-3">
                  {/* Left: vertical line below circle */}
                  <div className="flex justify-center flex-shrink-0" style={{ width: 32 }}>
                    <div className="w-[2px] rounded-full" style={{ background: `${dest.color}30`, minHeight: 36 }} />
                  </div>
                  {/* Right: transport badge */}
                  <div className="flex items-center gap-2 py-2">
                    {RouteIcon && (
                      <div className="flex items-center justify-center rounded-full flex-shrink-0"
                        style={{ width: 26, height: 26, background: `${col}18`, border: `1px solid ${col}45` }}>
                        <RouteIcon size={12} color={col} strokeWidth={2} />
                      </div>
                    )}
                    <span style={{ fontSize: 12, fontWeight: 700, color: col }}>
                      {route ? `${ROUTE_LABELS[route.mode]} · ${route.time}` : ""}
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

// ── Main section ───────────────────────────────────────────────────────

export default function ItineraryTimeline() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [selected, setSelected]         = useState<DestId[]>([]);
  const [reorderCount, setReorderCount] = useState(0);

  useEffect(() => {
    if (reorderCount === 0) return;
    const t = setTimeout(() => setReorderCount(0), 2500);
    return () => clearTimeout(t);
  }, [reorderCount]);

  const toggle = (id: DestId) => {
    if (selected.includes(id)) { setSelected(prev => prev.filter(x => x !== id)); return; }
    if (selected.length >= MAX_STOPS) return;
    const naive  = [...selected, id];
    const sorted = naive.length >= 2 ? nearestNeighborSort(naive) : naive;
    if (sorted.some((s, i) => s !== naive[i])) setReorderCount(c => c + 1);
    setSelected(sorted);
  };

  const remove = (id: DestId) => setSelected(prev => prev.filter(x => x !== id));

  const selectedDests = selected.map(id => PALETTE.find(p => p.id === id)!);
  const totalDays     = selectedDests.reduce((s, d) => s + d.days, 0);
  const budgetMin     = totalDays * COST_MIN_PER_DAY;
  const budgetMax     = totalDays * COST_MAX_PER_DAY;

  return (
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
            <AnimatePresence>
              {reorderCount > 0 && (
                <motion.div key={reorderCount}
                  initial={{ opacity: 0, scale: 0.75, x: 8 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.85, x: 4 }}
                  transition={{ type: "spring", stiffness: 420, damping: 24 }}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
                  style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.40)" }}>
                  <Route size={10} color="#22C55E" strokeWidth={2.5} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#22C55E" }}>Route Optimized</span>
                </motion.div>
              )}
            </AnimatePresence>

            {totalDays > 0 && (
              <motion.div layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                className="rounded-full px-3 py-1.5 text-[11px] font-bold"
                style={{
                  background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
                  color: "var(--text-primary)", border: "1px solid var(--glass-border)",
                }}>
                {selected.length} stop{selected.length !== 1 ? "s" : ""} · {totalDays}d
              </motion.div>
            )}
          </div>
        </div>

        {/* ── Destination picker ───────────────────────────────────────────
            Mobile:  horizontal scroll ribbon (flex-nowrap + overflow-x-auto)
            Desktop: wrapping pill cloud (sm:flex-wrap + sm:overflow-visible)   */}
        <div className="flex flex-nowrap sm:flex-wrap overflow-x-auto sm:overflow-visible scrollbar-hide gap-2 mb-6 pb-1">
          {PALETTE.map((dest) => {
            const isSelected = selected.includes(dest.id);
            const isDisabled = !isSelected && selected.length >= MAX_STOPS;
            return (
              <motion.button
                key={dest.id}
                onClick={() => !isDisabled && toggle(dest.id)}
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
          {selected.length >= MAX_STOPS && (
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

          {selected.length === 0 ? (
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
              {/* ── Mobile: vertical checklist (hidden on sm+) ── */}
              <div className="sm:hidden">
                <MobileChecklist dests={selectedDests} onRemove={remove} />
              </div>

              {/* ── Desktop: horizontal scroll timeline (hidden on mobile) ── */}
              <div className="hidden sm:block overflow-x-auto scrollbar-hide px-5 py-5">
                <div className="flex items-center" style={{ minWidth: "max-content", gap: 0 }}>
                  <AnimatePresence mode="popLayout">
                    {selectedDests.map((dest, i) => {
                      const dayStart = selectedDests.slice(0, i).reduce((s, d) => s + d.days, 1);
                      return (
                        <div key={dest.id} className="flex items-center">
                          <StopNode dest={dest} dayStart={dayStart} onRemove={() => remove(dest.id)} />
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

        {/* Budget + CTA strip */}
        <AnimatePresence>
          {totalDays > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 rounded-[20px] flex items-center justify-between px-5 py-4 gap-3"
              style={{
                background:           isDark ? "rgba(220,38,38,0.10)" : "rgba(220,38,38,0.08)",
                border:               isDark ? "1px solid rgba(220,38,38,0.22)" : "1px solid rgba(220,38,38,0.30)",
                backdropFilter:       "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            >
              <div className="min-w-0">
                <p className="font-bold text-[13px] leading-tight" style={{ color: "var(--text-primary)" }}>
                  Est. ${budgetMin}–${budgetMax} total
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--text-secondary)" }}>
                  ${COST_MIN_PER_DAY}–${COST_MAX_PER_DAY}/day · {totalDays}d · {selected.length} stops
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 440, damping: 22 }}
                className="cursor-pointer rounded-full px-5 py-2.5 text-[12px] font-bold text-white flex-shrink-0"
                style={{
                  background: "rgba(220,38,38,0.75)",
                  boxShadow:  "0 0 20px rgba(220,38,38,0.40), inset 0 1px 0 rgba(255,255,255,0.18)",
                  minHeight:  44,
                }}
                onClick={() => {
                  const cityNames = selectedDests.map(d => d.name);
                  const prompt = `I have selected these ${cityNames.length} destinations for my Nepal trip: **${cityNames.join(", ")}** (${totalDays} days total).\n\nPlease generate a professional day-by-day itinerary for these locations. For each day include:\n- **Morning / Afternoon / Evening** activities\n- Top landmarks and cultural experiences\n- Local food & restaurant suggestions\n- Practical travel tips\n\nAlso call the buildItinerary tool so the full timeline is displayed.`;
                  document.dispatchEvent(new CustomEvent("open-ai-planner", { detail: { prompt } }));
                }}
              >
                ✨ Plan with AI
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
