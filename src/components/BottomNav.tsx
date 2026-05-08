"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Home, Compass, Map, Bookmark, User } from "lucide-react";

const NAV_ITEMS = [
  { id: "home",      label: "Home",      Icon: Home     },
  { id: "explore",   label: "Explore",   Icon: Compass  },
  { id: "itinerary", label: "Itinerary", Icon: Map      },
  { id: "saved",     label: "Saved",     Icon: Bookmark },
  { id: "profile",   label: "Profile",   Icon: User     },
] as const;

export default function BottomNav() {
  const [active, setActive] = useState<string>("home");

  const handleTap = (id: string) => {
    setActive(id);
    if (id === "home")    window.scrollTo({ top: 0, behavior: "smooth" });
    if (id === "explore") document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" });
    if (id === "itinerary") document.dispatchEvent(new CustomEvent("open-ai-planner"));
  };

  return (
    <nav
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[900] flex items-center gap-1 px-2 py-2"
      style={{
        background:          "rgba(8,12,28,0.78)",
        backdropFilter:      "blur(28px)",
        WebkitBackdropFilter:"blur(28px)",
        border:              "1px solid rgba(255,255,255,0.11)",
        borderRadius:        9999,
        boxShadow:           "0 8px 40px rgba(0,0,0,0.50), 0 0 0 1px rgba(255,255,255,0.05)",
      }}
    >
      {NAV_ITEMS.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => handleTap(id)}
            className="relative flex flex-col items-center justify-center gap-[3px] cursor-pointer select-none"
            style={{ padding: "6px 14px", borderRadius: 9999, minWidth: 56 }}
          >
            {/* Active glow background */}
            {isActive && (
              <motion.div
                layoutId="nav-active-bg"
                className="absolute inset-0 rounded-full"
                style={{
                  background: "rgba(220,38,38,0.22)",
                  boxShadow:  "0 0 22px rgba(220,38,38,0.50), 0 0 8px rgba(220,38,38,0.30)",
                }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}

            <Icon
              size={20}
              strokeWidth={isActive ? 2.2 : 1.7}
              style={{
                color:       isActive ? "#f87171" : "rgba(255,255,255,0.48)",
                position:    "relative",
                zIndex:      1,
                transition:  "color 0.2s",
                filter:      isActive ? "drop-shadow(0 0 6px rgba(248,113,113,0.70))" : "none",
              }}
            />
            <span
              style={{
                fontSize:   9,
                fontWeight: isActive ? 700 : 500,
                color:      isActive ? "#f87171" : "rgba(255,255,255,0.38)",
                position:   "relative",
                zIndex:     1,
                letterSpacing: "0.03em",
                transition: "color 0.2s",
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
