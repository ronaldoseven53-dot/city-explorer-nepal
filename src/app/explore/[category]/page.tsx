import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { categoryGroups, type Spot } from "@/data/destinations";
import Navbar from "@/components/Navbar";
import TransitionLink from "@/components/TransitionLink";

// ── Static params ──────────────────────────────────────────────────

export function generateStaticParams() {
  return categoryGroups.map((g) => ({ category: g.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ category: string }> }
): Promise<Metadata> {
  const { category } = await params;
  const group = categoryGroups.find((g) => g.id === category);
  if (!group) return {};
  return {
    title:       `${group.name} — Explore Nepal`,
    description: group.description,
  };
}

// ── Accent palette ─────────────────────────────────────────────────

const ACCENT: Record<string, string> = {
  agriculture: "#84CC16",
  adventure:   "#EF4444",
  trekking:    "#3B82F6",
  heritage:    "#F97316",
  nature:      "#22C55E",
  pilgrimage:  "#A855F7",
};

// ── Difficulty map (adventure category) ───────────────────────────

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
};

const DIFF_STYLE: Record<Difficulty, React.CSSProperties> = {
  Easy:     { background: "rgba(34,197,94,0.15)",  border: "1px solid rgba(34,197,94,0.35)",  color: "#4ade80" },
  Moderate: { background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.35)", color: "#fbbf24" },
  Hard:     { background: "rgba(239,68,68,0.15)",  border: "1px solid rgba(239,68,68,0.35)",  color: "#f87171" },
};

// ── Stat card ──────────────────────────────────────────────────────

function StatCard({ value, label, accent }: { value: string; label: string; accent: string }) {
  return (
    <div style={{
      background: `${accent}12`,
      border:     `1px solid ${accent}35`,
      borderRadius: 18,
      padding: "14px 20px",
      flex: "1 1 0",
      minWidth: 120,
    }}>
      <p style={{ fontSize: 22, fontWeight: 800, color: accent, lineHeight: 1, marginBottom: 4 }}>{value}</p>
      <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.14em" }}>{label}</p>
    </div>
  );
}

// ── Destination card ───────────────────────────────────────────────

function SpotCard({ spot, accent, isAdventure }: { spot: Spot; accent: string; isAdventure: boolean }) {
  return (
    <div style={{
      background:   "rgba(12,18,36,0.72)",
      backdropFilter: "blur(40px)",
      WebkitBackdropFilter: "blur(40px)",
      border:       "1px solid rgba(255,255,255,0.09)",
      borderRadius: 24,
      overflow:     "hidden",
      display:      "flex",
      flexDirection: "column",
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
      <div style={{ padding: "18px 20px 20px", flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Highlights */}
        <div>
          <p style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em", color: accent, marginBottom: 8 }}>
            💡 Why It&apos;s Special
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 5 }}>
            {spot.highlights.slice(0, 3).map((h) => (
              <li key={h} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.45 }}>
                <span style={{ color: accent, flexShrink: 0, marginTop: 1, fontSize: 9 }}>✦</span>
                {h}
              </li>
            ))}
          </ul>
        </div>

        {/* Activities — with difficulty if adventure */}
        <div>
          <p style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em", color: accent, marginBottom: 8 }}>
            🎯 Activities
          </p>
          {isAdventure ? (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
              {spot.activities.map((a) => {
                const level: Difficulty = DIFFICULTY[a] ?? "Moderate";
                return (
                  <li key={a} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", flex: 1, lineHeight: 1.35 }}>{a}</span>
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
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
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
          background: "rgba(245,158,11,0.10)", border: "1px solid rgba(245,158,11,0.28)",
          borderRadius: 12, padding: "10px 12px",
        }}>
          <p style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "#fbbf24", marginBottom: 5 }}>
            ⚠️ Tip
          </p>
          <p style={{ fontSize: 11, color: "rgba(245,220,130,0.75)", lineHeight: 1.5 }}>{spot.travelTips[0]}</p>
        </div>

        {/* Footer */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.07)",
          marginTop: "auto",
        }}>
          <div>
            <p style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 2 }}>
              Est. daily budget
            </p>
            <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.88)" }}>
              NPR {spot.basePrice.toLocaleString()}{" "}
              <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>
                / ~${Math.round(spot.basePrice / 133)}
              </span>
            </p>
          </div>
          {/* Styled wrapper around TransitionLink (which doesn't accept style prop) */}
          <span style={{
            background: accent, borderRadius: 12, display: "inline-block",
            boxShadow: `0 0 18px ${accent}55`,
          }}>
            <TransitionLink
              href={`/destinations/${spot.id}`}
              className="block font-bold text-white transition-opacity hover:opacity-80"
              style={{ fontSize: 12, padding: "8px 16px" } as React.CSSProperties}
            >
              Full Guide →
            </TransitionLink>
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────

export default async function ExploreCategoryPage(
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;
  const group = categoryGroups.find((g) => g.id === category);
  if (!group) notFound();

  const accent      = ACCENT[group.id] ?? "#F97316";
  const isAdventure = group.id === "adventure";
  const totalActs   = group.spots.reduce((s, sp) => s + sp.activities.length, 0);

  // "Best season" — derived from first spot or category defaults
  const seasonMap: Record<string, string> = {
    adventure:   "Year-round",
    trekking:    "Oct – May",
    heritage:    "Oct – Apr",
    nature:      "Oct – May",
    pilgrimage:  "Oct – Mar",
    agriculture: "May – Dec",
  };
  const season = seasonMap[group.id] ?? "Oct – May";

  return (
    <>
      <Navbar />

      {/* ── Sticky "Back" bar ─────────────────────────────────── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 200,
        background: "rgba(4,8,22,0.88)", backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "10px 20px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <TransitionLink
          href="/"
          className="flex items-center gap-1.5 font-semibold transition-opacity hover:opacity-80"
          style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}
        >
          ← Back to Categories
        </TransitionLink>
        <span style={{ color: "rgba(255,255,255,0.20)" }}>·</span>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.50)" }}>
          {group.emoji} {group.name}
        </span>
        {/* Dynamic destination count — the stat that updates per category */}
        <span style={{
          marginLeft: "auto",
          fontSize: 11, fontWeight: 700,
          padding: "3px 12px", borderRadius: 9999,
          background: `${accent}20`, border: `1px solid ${accent}45`, color: accent,
        }}>
          {group.spots.length} {group.name.split(" ")[0]} Destination{group.spots.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section style={{
        position: "relative", overflow: "hidden",
        background: "#040816",
        paddingTop: 64, paddingBottom: 0,
      }}>
        {/* Hero background: first spot image, darkened */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Image
            src={group.spots[0].placeholderImage}
            alt={group.name}
            fill
            sizes="100vw"
            className="object-cover"
            priority
            style={{ filter: "saturate(0.7) brightness(0.38)" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(135deg, ${accent}1a 0%, transparent 55%, rgba(4,8,22,0.92) 100%)`,
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, transparent 30%, rgba(4,8,22,0.98) 100%)",
          }} />
        </div>

        <div style={{
          position: "relative", zIndex: 1,
          maxWidth: 900, margin: "0 auto",
          padding: "40px 24px 48px",
          textAlign: "center",
        }}>
          <p style={{ fontSize: 52, lineHeight: 1, marginBottom: 12 }}>{group.emoji}</p>
          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 900,
            color: "#fff", lineHeight: 1.1, letterSpacing: "-0.025em",
            marginBottom: 14,
            textShadow: "0 2px 30px rgba(0,0,0,0.55)",
          }}>
            {group.name}
          </h1>
          <p style={{
            fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
            color: "rgba(255,255,255,0.62)", lineHeight: 1.7,
            maxWidth: 580, margin: "0 auto 28px",
          }}>
            {group.description}
          </p>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <StatCard value={`${group.spots.length}`}  label={`${group.name.split(" ")[0]} Destinations`} accent={accent} />
            <StatCard value={`${totalActs}`}            label="Total Activities"                            accent={accent} />
            <StatCard value={season}                    label="Best Season"                                 accent={accent} />
          </div>
        </div>
      </section>

      {/* ── Destination grid — no auto-scroll, no auto-advance ─── */}
      <main style={{
        background: "#040816",
        minHeight: "60vh",
        padding: "40px 0 80px",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px" }}>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
            gap: 24,
          }}>
            {group.spots.map((spot) => (
              <SpotCard
                key={spot.id}
                spot={spot}
                accent={accent}
                isAdventure={isAdventure}
              />
            ))}
          </div>

          {/* Bottom back link */}
          <div style={{ marginTop: 48, textAlign: "center" }}>
            <span style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.13)",
              borderRadius: 9999,
            }}>
              <TransitionLink
                href="/"
                className="flex items-center gap-2 font-semibold transition-opacity hover:opacity-70"
                style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", padding: "10px 20px" }}
              >
                ← Back to All Categories
              </TransitionLink>
            </span>
          </div>

        </div>
      </main>

      <footer style={{
        background: "rgba(4,8,22,0.97)", borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "24px 20px", textAlign: "center",
        fontSize: 12, color: "rgba(255,255,255,0.25)",
      }}>
        © 2025 City Explorer Nepal · Explore the Himalayas 🏔️
      </footer>
    </>
  );
}
