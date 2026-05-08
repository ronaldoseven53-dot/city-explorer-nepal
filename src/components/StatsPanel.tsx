"use client";

import { useMemo } from "react";
import { MapPin, Layers, Mountain, CalendarDays } from "lucide-react";
import { destinations, categoryGroups } from "@/data/destinations";
import { checkSeasonality } from "@/lib/seasonality";

export default function StatsPanel() {
  const inSeasonCount = useMemo(() => {
    return checkSeasonality(destinations, new Date().getMonth()).length;
  }, []);

  const stats = [
    { icon: MapPin,        value: String(destinations.length),    label: "Destinations",  color: "#FF4D6A" },
    { icon: Layers,        value: String(categoryGroups.length),  label: "Categories",    color: "#60A5FA" },
    { icon: Mountain,      value: "8,848 m",                      label: "Highest Peak",  color: "#34D399" },
    { icon: CalendarDays,  value: String(inSeasonCount),          label: "In Season",     color: "#FBBF24" },
  ];

  return (
    <section
      style={{
        background: "rgba(8,12,24,0.97)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "0 max(1rem, 4vw)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "0",
        }}
      >
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              style={{
                background: "rgba(8,12,24,0.97)",
                padding: "20px 16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Subtle glow behind icon */}
              <div style={{
                position: "absolute",
                top: 0, left: "50%",
                transform: "translateX(-50%)",
                width: "60px", height: "40px",
                background: `radial-gradient(ellipse, ${s.color}22 0%, transparent 70%)`,
                pointerEvents: "none",
              }} />

              <div style={{
                width: 32, height: 32,
                borderRadius: "10px",
                background: `${s.color}18`,
                border: `1px solid ${s.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Icon size={15} strokeWidth={1.8} color={s.color} />
              </div>

              <p style={{
                fontSize: "clamp(1.1rem, 3.5vw, 1.55rem)",
                fontWeight: 800,
                color: "#FFFFFF",
                lineHeight: 1,
                letterSpacing: "-0.02em",
                textAlign: "center",
              }}>
                {s.value}
              </p>

              <p style={{
                fontSize: "clamp(0.58rem, 1.3vw, 0.70rem)",
                color: "rgba(255,255,255,0.42)",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textAlign: "center",
                lineHeight: 1,
              }}>
                {s.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
