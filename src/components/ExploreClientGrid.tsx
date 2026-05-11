"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import Image from "next/image";
import type { Spot } from "@/data/destinations";
import TransitionLink from "./TransitionLink";
import DestinationDetailModal from "./DestinationDetailModal";

// ── Difficulty map (adventure category) ─────────────────────────

type Difficulty = "Easy" | "Moderate" | "Hard";

const DIFFICULTY: Record<string, Difficulty> = {
  "Paragliding over the Annapurna range":           "Hard",
  "Annapurna Circuit & Poon Hill trekking":          "Hard",
  "Boating and kayaking on Phewa Lake":              "Easy",
  "Zip-lining across the valley":                    "Easy",
  "White-water rafting on the Seti River":           "Moderate",
  "Sunrise hike to Sarangkot viewpoint":             "Easy",
  "Cave exploration at Gupteswar":                   "Easy",
  "Ultralight aircraft flights":                     "Easy",
  "Trekking the Upper Mustang trail to Lo Manthang": "Hard",
  "Exploring sky caves of Chhoser":                  "Moderate",
  "Jeep safari through canyon landscapes":           "Easy",
  "Attending the Tiji Festival (May)":               "Easy",
  "Visiting ancient Tibetan gompas and monasteries": "Easy",
  "Muktinath Temple pilgrimage":                     "Moderate",
  "Photography in the sculpted canyon badlands":     "Easy",
  "Jeep safari through the national park":           "Easy",
  "Elephant-back safari (observation only)":         "Easy",
  "Canoe ride on the Rapti River":                   "Easy",
  "Jungle walking safari with a naturalist guide":   "Moderate",
  "Tharu cultural village tour and dance show":      "Easy",
  "Birdwatching (over 540 species recorded)":        "Easy",
  "Sunrise river walk along the Rapti":              "Easy",
  "Skiing and snowboarding (December – February)":   "Moderate",
  "Cable car ride to Kalinchowk Bhagwati Temple":   "Easy",
  "Himalayan sunrise viewpoint photography":         "Easy",
  "Snow play and winter trekking":                   "Easy",
  "Pilgrimage to Kalinchowk Bhagwati Shrine":       "Easy",
  "Paragliding (spring and autumn)":                 "Moderate",
  "High-altitude nature walks":                      "Moderate",
  // EBC activities
  "EBC classic trek via Lukla and Namche Bazaar (12–14 days)":              "Hard",
  "Kala Patthar summit hike (5,644 m) for the closest Everest panorama":    "Hard",
  "Tengboche monastery visit and butter-lamp puja ceremony":                 "Easy",
  "Ama Dablam viewpoint hike from Pangboche":                               "Moderate",
  "Gokyo Lakes alternate route with Gokyo Ri summit (5,483 m)":            "Hard",
  "Sherpa cultural homestay and museum in Namche Bazaar":                   "Easy",
  "Photography at the Khumbu Glacier moraine":                              "Moderate",
  "Three Passes trek (Kongma La, Cho La, Renjo La)":                       "Hard",
};

const DIFF_STYLE: Record<Difficulty, React.CSSProperties> = {
  Easy:     { background: "rgba(34,197,94,0.15)",  border: "1px solid rgba(34,197,94,0.35)",  color: "#4ade80" },
  Moderate: { background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.35)", color: "#fbbf24" },
  Hard:     { background: "rgba(239,68,68,0.15)",  border: "1px solid rgba(239,68,68,0.35)",  color: "#f87171" },
};

// ── Spot card ────────────────────────────────────────────────────

function SpotCard({
  spot,
  accent,
  isAdventure,
  onViewDetails,
}: {
  spot:           Spot;
  accent:         string;
  isAdventure:    boolean;
  onViewDetails:  () => void;
}) {
  return (
    <div style={{
      background:           "rgba(12,18,36,0.72)",
      backdropFilter:       "blur(40px)",
      WebkitBackdropFilter: "blur(40px)",
      border:               "1px solid rgba(255,255,255,0.09)",
      borderRadius:         24,
      overflow:             "hidden",
      display:              "flex",
      flexDirection:        "column",
    }}>
      {/* Cover image */}
      <div style={{ position: "relative", height: 200, flexShrink: 0 }}>
        <Image
          src={spot.placeholderImage}
          alt={spot.name}
          fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          className="object-cover"
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(4,8,22,0.90) 0%, rgba(4,8,22,0.30) 50%, transparent 100%)",
        }} />
        {/* Best time pill */}
        <span style={{
          position: "absolute", top: 12, right: 12,
          background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)",
          color: "rgba(255,255,255,0.80)", fontSize: 10, fontWeight: 700,
          padding: "4px 10px", borderRadius: 9999,
          border: "1px solid rgba(255,255,255,0.15)",
        }}>
          🗓 {spot.bestTimeToVisit}
        </span>
        {/* Elevation pill */}
        {spot.elevation && (
          <span style={{
            position: "absolute", top: 12, left: 12,
            background: `${accent}28`, backdropFilter: "blur(8px)",
            color: accent, fontSize: 10, fontWeight: 700,
            padding: "4px 10px", borderRadius: 9999,
            border: `1px solid ${accent}50`,
          }}>
            ⛰ {spot.elevation}
          </span>
        )}
        {/* Name block */}
        <div style={{ position: "absolute", bottom: 14, left: 16, right: 16 }}>
          <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 800, lineHeight: 1.15, marginBottom: 3 }}>
            {spot.name}
          </h3>
          <p style={{ color: "rgba(255,255,255,0.50)", fontSize: 11 }}>📍 {spot.region}</p>
        </div>
      </div>

      {/* Body */}
      <div style={{
        padding: "18px 20px 20px", flex: 1,
        display: "flex", flexDirection: "column", gap: 14,
      }}>
        {/* Highlights */}
        <div>
          <p style={{
            fontSize: 9, fontWeight: 800, textTransform: "uppercase",
            letterSpacing: "0.18em", color: accent, marginBottom: 8,
          }}>
            💡 Why It&apos;s Special
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 5 }}>
            {spot.highlights.slice(0, 3).map((h) => (
              <li key={h} style={{
                display: "flex", gap: 8, alignItems: "flex-start",
                fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.45,
              }}>
                <span style={{ color: accent, flexShrink: 0, marginTop: 1, fontSize: 9 }}>✦</span>
                {h}
              </li>
            ))}
          </ul>
        </div>

        {/* Activities */}
        <div>
          <p style={{
            fontSize: 9, fontWeight: 800, textTransform: "uppercase",
            letterSpacing: "0.18em", color: accent, marginBottom: 8,
          }}>
            🎯 Activities
          </p>
          {isAdventure ? (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
              {spot.activities.map((a) => {
                const level: Difficulty = DIFFICULTY[a] ?? "Moderate";
                return (
                  <li key={a} style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between", gap: 8,
                  }}>
                    <span style={{
                      fontSize: 11, color: "rgba(255,255,255,0.65)",
                      flex: 1, lineHeight: 1.35,
                    }}>{a}</span>
                    <span style={{
                      flexShrink: 0, fontSize: 9, fontWeight: 700,
                      padding: "2px 8px", borderRadius: 9999,
                      ...DIFF_STYLE[level],
                    }}>
                      {level}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {spot.activities.slice(0, 4).map((a) => (
                <span key={a} style={{
                  fontSize: 10, fontWeight: 600,
                  padding: "3px 10px", borderRadius: 9999,
                  background: `${accent}18`, border: `1px solid ${accent}40`, color: accent,
                }}>
                  {a}
                </span>
              ))}
              {spot.activities.length > 4 && (
                <span style={{
                  fontSize: 10, fontWeight: 600,
                  padding: "3px 10px", borderRadius: 9999,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.35)",
                }}>
                  +{spot.activities.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Travel tip */}
        <div style={{
          background: "rgba(245,158,11,0.10)",
          border: "1px solid rgba(245,158,11,0.28)",
          borderRadius: 12, padding: "10px 12px",
        }}>
          <p style={{
            fontSize: 9, fontWeight: 800, textTransform: "uppercase",
            letterSpacing: "0.15em", color: "#fbbf24", marginBottom: 5,
          }}>
            ⚠️ Tip
          </p>
          <p style={{ fontSize: 11, color: "rgba(245,220,130,0.75)", lineHeight: 1.5 }}>
            {spot.travelTips[0]}
          </p>
        </div>

        {/* Footer: price + CTAs */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 10,
          paddingTop: 12,
          borderTop: "1px solid rgba(255,255,255,0.07)",
          marginTop: "auto",
          flexWrap: "wrap",
        }}>
          <div style={{ flexShrink: 0 }}>
            <p style={{
              fontSize: 9, color: "rgba(255,255,255,0.35)",
              textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 2,
            }}>
              Est. daily budget
            </p>
            <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.88)" }}>
              NPR {spot.basePrice.toLocaleString()}{" "}
              <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>
                / ~${Math.round(spot.basePrice / 133)}
              </span>
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            {/* Primary: red gradient View Details → opens immersive modal */}
            <button
              onClick={onViewDetails}
              className="font-bold cursor-pointer transition-opacity hover:opacity-90"
              style={{
                background:  "linear-gradient(135deg, #dc2626 0%, #e11d48 100%)",
                boxShadow:   "0 0 20px rgba(220,38,38,0.40)",
                borderRadius: 12,
                padding:     "8px 16px",
                color:       "#fff",
                fontSize:    12,
                border:      "none",
              }}
            >
              View Details
            </button>

            {/* Secondary: glass link to full guide */}
            <span style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.13)",
              borderRadius: 12,
              display: "inline-block",
            }}>
              <TransitionLink
                href={`/destinations/${spot.id}`}
                className="block font-bold text-white transition-opacity hover:opacity-80"
                style={{ fontSize: 12, padding: "8px 14px" } as React.CSSProperties}
              >
                Full Guide →
              </TransitionLink>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────

export default function ExploreClientGrid({
  spots,
  accent,
  isAdventure,
}: {
  spots:       Spot[];
  accent:      string;
  isAdventure: boolean;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
        gap: 24,
      }}>
        {spots.map((spot, i) => (
          <SpotCard
            key={spot.id}
            spot={spot}
            accent={accent}
            isAdventure={isAdventure}
            onViewDetails={() => setOpenIdx(i)}
          />
        ))}
      </div>

      <AnimatePresence>
        {openIdx !== null && (
          <DestinationDetailModal
            spots={spots}
            activeIdx={openIdx}
            accent={accent}
            onClose={() => setOpenIdx(null)}
            onChange={(idx) => setOpenIdx(idx)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
