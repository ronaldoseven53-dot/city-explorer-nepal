"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { categoryGroups, destinations } from "@/data/destinations";

// ── Types ─────────────────────────────────────────────────────────

export interface CategoryProgress {
  id: string;
  name: string;
  emoji: string;
  visited: number;
  total: number;
}

interface UserPassportContextValue {
  visitedIds: Set<string>;
  markVisited: (id: string) => void;
  categoryProgress: CategoryProgress[];
  visitedCount: number;
  totalCount: number;
  isComplete: boolean;
  showModal: boolean;
  dismissModal: () => void;
}

// ── Context ───────────────────────────────────────────────────────

const UserPassportContext = createContext<UserPassportContextValue | null>(null);

const VISITED_KEY    = "passport_visited";
const MODAL_SEEN_KEY = "passport_modal_seen";

// ── Provider ──────────────────────────────────────────────────────

export function UserPassportProvider({ children }: { children: ReactNode }) {
  const [visitedIds, setVisitedIds] = useState<Set<string>>(new Set());
  const [showModal, setShowModal]   = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(VISITED_KEY);
      if (raw) setVisitedIds(new Set(JSON.parse(raw) as string[]));
    } catch {
      // localStorage unavailable (SSR, private mode)
    }
  }, []);

  const markVisited = useCallback((id: string) => {
    setVisitedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      try {
        localStorage.setItem(VISITED_KEY, JSON.stringify([...next]));
        if (
          next.size === destinations.length &&
          !localStorage.getItem(MODAL_SEEN_KEY)
        ) {
          localStorage.setItem(MODAL_SEEN_KEY, "true");
          setShowModal(true);
        }
      } catch {}
      return next;
    });
  }, []);

  const categoryProgress = useMemo<CategoryProgress[]>(
    () =>
      categoryGroups.map((g) => ({
        id:      g.id,
        name:    g.name,
        emoji:   g.emoji,
        visited: g.spots.filter((s) => visitedIds.has(s.id)).length,
        total:   g.spots.length,
      })),
    [visitedIds]
  );

  const visitedCount = visitedIds.size;
  const totalCount   = destinations.length;
  const isComplete   = visitedCount >= totalCount;

  const dismissModal = useCallback(() => setShowModal(false), []);

  return (
    <UserPassportContext.Provider
      value={{
        visitedIds,
        markVisited,
        categoryProgress,
        visitedCount,
        totalCount,
        isComplete,
        showModal,
        dismissModal,
      }}
    >
      {children}
    </UserPassportContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────

export function useUserPassport() {
  const ctx = useContext(UserPassportContext);
  if (!ctx) throw new Error("useUserPassport must be used within UserPassportProvider");
  return ctx;
}
