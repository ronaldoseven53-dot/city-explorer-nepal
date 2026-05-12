"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";
import type { ReactNode } from "react";

// ── City catalogue ─────────────────────────────────────────────────────

export type TripCityId = "ktm" | "pok" | "chi" | "lum" | "bha" | "ana" | "mus" | "rar";

export interface TripCity {
  id:       TripCityId;
  name:     string;
  days:     number;
  color:    string;
  category: string;
  coords:   [number, number]; // [lng, lat] — Mapbox order
}

export const CITY_DATA: Record<TripCityId, TripCity> = {
  ktm: { id: "ktm", name: "Kathmandu",  days: 2, color: "#F97316", category: "heritage city",          coords: [85.3240, 27.7172] },
  pok: { id: "pok", name: "Pokhara",    days: 2, color: "#0EA5E9", category: "lakeside & adventure",   coords: [83.9856, 28.2096] },
  chi: { id: "chi", name: "Chitwan",    days: 2, color: "#84CC16", category: "wildlife & nature",      coords: [84.3542, 27.5291] },
  lum: { id: "lum", name: "Lumbini",    days: 1, color: "#A855F7", category: "Buddhist pilgrimage",    coords: [83.2833, 27.4833] },
  bha: { id: "bha", name: "Bhaktapur",  days: 1, color: "#6366F1", category: "medieval heritage",      coords: [85.4278, 27.6722] },
  ana: { id: "ana", name: "Annapurna",  days: 3, color: "#22C55E", category: "high-altitude trekking", coords: [83.8667, 28.5167] },
  mus: { id: "mus", name: "Mustang",    days: 3, color: "#F59E0B", category: "high-altitude desert",   coords: [83.8506, 28.9958] },
  rar: { id: "rar", name: "Rara Lake",  days: 2, color: "#14B8A6", category: "remote nature trek",     coords: [82.0833, 29.5167] },
};

export const MAX_STOPS        = 5;
export const COST_MIN_PER_DAY = 50;
export const COST_MAX_PER_DAY = 80;

// ── Route optimisation ─────────────────────────────────────────────────

function distSq(a: TripCity, b: TripCity) {
  return (a.coords[0] - b.coords[0]) ** 2 + (a.coords[1] - b.coords[1]) ** 2;
}

function nearestNeighborSort(ids: TripCityId[]): TripCityId[] {
  if (ids.length <= 2) return ids;
  const remaining = new Set(ids.slice(1));
  const path: TripCityId[] = [ids[0]];
  while (remaining.size > 0) {
    const cur = CITY_DATA[path[path.length - 1]];
    let best: TripCityId = remaining.values().next().value as TripCityId;
    let bestDist = distSq(cur, CITY_DATA[best]);
    remaining.forEach((id) => {
      const d = distSq(cur, CITY_DATA[id]);
      if (d < bestDist) { bestDist = d; best = id; }
    });
    path.push(best);
    remaining.delete(best);
  }
  return path;
}

// ── Context ────────────────────────────────────────────────────────────

interface TripContextValue {
  selectedIds:     TripCityId[];
  selectedCities:  TripCity[];
  totalDays:       number;
  budgetUSD:       { min: number; max: number };
  startDate:       string;       // YYYY-MM
  travelMonth:     string;       // display label e.g. "October 2026"
  travelMonthName: string;       // month only e.g. "October"
  toggleCity:      (id: TripCityId) => void;
  removeCity:      (id: TripCityId) => void;
  setStartDate:    (d: string)    => void;
  clearTrip:       ()             => void;
}

const TripContext = createContext<TripContextValue | null>(null);

export function TripProvider({ children }: { children: ReactNode }) {
  const [selectedIds,  setSelectedIds]  = useState<TripCityId[]>([]);
  const [startDate,    setStartDateRaw] = useState("");

  const selectedCities  = useMemo(() => selectedIds.map((id) => CITY_DATA[id]), [selectedIds]);
  const totalDays       = useMemo(() => selectedCities.reduce((s, c) => s + c.days, 0), [selectedCities]);
  const budgetUSD       = useMemo(
    () => ({ min: totalDays * COST_MIN_PER_DAY, max: totalDays * COST_MAX_PER_DAY }),
    [totalDays],
  );
  const travelMonth     = useMemo(
    () => startDate
      ? new Date(startDate + "-01T00:00:00").toLocaleString("en-US", { month: "long", year: "numeric" })
      : "",
    [startDate],
  );
  const travelMonthName = useMemo(
    () => startDate
      ? new Date(startDate + "-01T00:00:00").toLocaleString("en-US", { month: "long" })
      : new Date().toLocaleString("en-US", { month: "long" }),
    [startDate],
  );

  const toggleCity = useCallback((id: TripCityId) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_STOPS) return prev;
      const naive  = [...prev, id];
      const sorted = naive.length >= 2 ? nearestNeighborSort(naive) : naive;
      return sorted;
    });
  }, []);

  const removeCity = useCallback((id: TripCityId) => {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const setStartDate = useCallback((d: string) => setStartDateRaw(d), []);

  const clearTrip = useCallback(() => {
    setSelectedIds([]);
    setStartDateRaw("");
  }, []);

  return (
    <TripContext.Provider value={{
      selectedIds, selectedCities, totalDays, budgetUSD,
      startDate, travelMonth, travelMonthName,
      toggleCity, removeCity, setStartDate, clearTrip,
    }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTripContext() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTripContext must be used inside <TripProvider>");
  return ctx;
}
