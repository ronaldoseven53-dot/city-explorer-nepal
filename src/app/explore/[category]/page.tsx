import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { categoryGroups } from "@/data/destinations";
import Navbar from "@/components/Navbar";
import TransitionLink from "@/components/TransitionLink";
import ExploreClientGrid from "@/components/ExploreClientGrid";

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

// ── Hero stat card (server-rendered summary row) ───────────────────

function HeroStatCard({ value, label, accent }: { value: string; label: string; accent: string }) {
  return (
    <div style={{
      background:   `${accent}12`,
      border:       `1px solid ${accent}35`,
      borderRadius: 18,
      padding:      "14px 20px",
      flex:         "1 1 0",
      minWidth:     120,
    }}>
      <p style={{ fontSize: 22, fontWeight: 800, color: accent, lineHeight: 1, marginBottom: 4 }}>{value}</p>
      <p style={{
        fontSize: 10, fontWeight: 700,
        color: "rgba(255,255,255,0.45)",
        textTransform: "uppercase", letterSpacing: "0.14em",
      }}>
        {label}
      </p>
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

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <HeroStatCard value={`${group.spots.length}`} label={`${group.name.split(" ")[0]} Destinations`} accent={accent} />
            <HeroStatCard value={`${totalActs}`}           label="Total Activities"                            accent={accent} />
            <HeroStatCard value={season}                   label="Best Season"                                 accent={accent} />
          </div>
        </div>
      </section>

      {/* ── Destination grid — client component handles modal ──── */}
      <main style={{ background: "#040816", minHeight: "60vh", padding: "40px 0 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px" }}>

          <ExploreClientGrid
            spots={group.spots}
            accent={accent}
            isAdventure={isAdventure}
          />

          <div style={{ marginTop: 48, textAlign: "center" }}>
            <span style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.13)",
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
        background: "rgba(4,8,22,0.97)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "24px 20px", textAlign: "center",
        fontSize: 12, color: "rgba(255,255,255,0.25)",
      }}>
        © 2025 City Explorer Nepal · Explore the Himalayas 🏔️
      </footer>
    </>
  );
}
