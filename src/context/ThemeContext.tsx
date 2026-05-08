"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggleTheme: () => {},
  mounted: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let stored: Theme | null = null;
    try { stored = localStorage.getItem("theme") as Theme | null; } catch {}
    const initial: Theme = stored === "light" ? "light" : "dark";
    setTheme(initial);
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      // Add transition class, apply theme, remove class after animation
      document.documentElement.classList.add("switching-theme");
      document.documentElement.classList.toggle("dark", next === "dark");
      try { localStorage.setItem("theme", next); } catch {}
      setTimeout(() => document.documentElement.classList.remove("switching-theme"), 350);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
