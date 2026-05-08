"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type Transition } from "motion/react";
import { Sparkles, Headphones, Star, Play } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const BTN_TRANSITION: Transition = { type: "tween", duration: 0.18, ease: "easeInOut" };

// Day: existing composite with golden sky
const PHOTO_DAY  = "/images/nepal-landscape.jpg";
// Night: same photo, dark-treated via CSS filters + deep blue overlay
const PHOTO_NIGHT = "/images/nepal-landscape.jpg";

const AVATAR_SEEDS = [
  { bg: "#8B6F5E", initials: "R" },
  { bg: "#5E7B8B", initials: "M" },
  { bg: "#6B8B5E", initials: "S" },
];

export default function ParallaxHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const skyY           = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const midY           = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const foreY          = useTransform(scrollYProgress, [0, 1], ["0%", "46%"]);
  const contentY       = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.38, 0.52], [1, 1, 0]);

  const FADE: Transition = { duration: 1.0, ease: "easeInOut" };

  return (
    <div
      ref={heroRef}
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", isolation: "isolate" }}
    >

      {/* ══ Layer 0 — Sky / Peak  z=0 ════════════════════════════════════════ */}
      <motion.div style={{ y: skyY, willChange: "transform" }} className="absolute inset-0" aria-hidden>

        {/* ── Day sky layer ── */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: isDark ? 0 : 1 }}
          transition={FADE}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('${PHOTO_DAY}')`,
              backgroundSize: "cover",
              backgroundPosition: "center 15%",
              filter: "saturate(1.10) brightness(0.88)",
              willChange: "transform",
            }}
            animate={{ scale: [1, 1.055, 1] }}
            transition={{ duration: 36, ease: "easeInOut", repeat: Infinity }}
          />
          {/* Day: warm sunrise gradient overlay */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, rgba(20,10,4,0.55) 0%, rgba(30,14,4,0.28) 20%, rgba(10,4,0,0.08) 45%, rgba(10,4,0,0.20) 65%, rgba(4,8,20,0.65) 100%)",
          }} />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to right, rgba(20,8,4,0.40) 0%, rgba(20,8,4,0.18) 45%, transparent 70%)",
          }} />
        </motion.div>

        {/* ── Night sky layer ── */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: isDark ? 1 : 0 }}
          transition={FADE}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('${PHOTO_NIGHT}')`,
              backgroundSize: "cover",
              backgroundPosition: "center 15%",
              filter: "saturate(0.18) brightness(0.28) hue-rotate(195deg)",
              willChange: "transform",
            }}
            animate={{ scale: [1, 1.055, 1] }}
            transition={{ duration: 36, ease: "easeInOut", repeat: Infinity }}
          />
          {/* Night: deep space-blue wash */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, rgba(2,4,22,0.92) 0%, rgba(5,10,35,0.72) 20%, rgba(4,8,28,0.45) 45%, rgba(4,8,28,0.55) 65%, rgba(2,4,18,0.90) 100%)",
          }} />
          {/* Moon glow — upper right */}
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 78% 8%, rgba(180,210,255,0.18) 0%, rgba(120,160,240,0.08) 22%, transparent 48%)",
          }} />
          {/* Left tint */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to right, rgba(2,4,22,0.50) 0%, rgba(2,4,22,0.22) 45%, transparent 70%)",
          }} />
          {/* Star field — SVG tiled */}
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Ccircle cx='25'  cy='18'  r='0.9' fill='white' opacity='0.75'/%3E%3Ccircle cx='80'  cy='9'   r='0.7' fill='white' opacity='0.55'/%3E%3Ccircle cx='145' cy='25'  r='1.1' fill='white' opacity='0.65'/%3E%3Ccircle cx='210' cy='8'   r='0.8' fill='white' opacity='0.80'/%3E%3Ccircle cx='270' cy='30'  r='0.6' fill='white' opacity='0.50'/%3E%3Ccircle cx='55'  cy='55'  r='0.7' fill='white' opacity='0.45'/%3E%3Ccircle cx='130' cy='62'  r='0.9' fill='white' opacity='0.60'/%3E%3Ccircle cx='195' cy='48'  r='0.6' fill='white' opacity='0.55'/%3E%3Ccircle cx='255' cy='70'  r='1.0' fill='white' opacity='0.70'/%3E%3Ccircle cx='40'  cy='95'  r='0.8' fill='white' opacity='0.50'/%3E%3Ccircle cx='110' cy='88'  r='0.7' fill='white' opacity='0.65'/%3E%3Ccircle cx='175' cy='100' r='0.9' fill='white' opacity='0.45'/%3E%3Ccircle cx='235' cy='90'  r='0.6' fill='white' opacity='0.60'/%3E%3Ccircle cx='290' cy='110' r='0.8' fill='white' opacity='0.55'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "300px 200px",
            opacity: 0.70,
            mixBlendMode: "screen",
          }} />
        </motion.div>

      </motion.div>

      {/* ══ Layer 1 — Monastery / Village  z=10 ═════════════════════════════ */}
      <motion.div
        style={{ y: midY, position: "absolute", top: "28%", bottom: 0, left: 0, right: 0, zIndex: 10, willChange: "transform" }}
        aria-hidden
      >
        {/* Day mid */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: isDark ? 0 : 1 }}
          transition={FADE}
          style={{
            backgroundImage: `url('${PHOTO_DAY}')`,
            backgroundSize: "cover",
            backgroundPosition: "center 52%",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 100%)",
            filter: "saturate(0.82) brightness(0.72)",
          }}
        />
        {/* Night mid */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: isDark ? 1 : 0 }}
          transition={FADE}
          style={{
            backgroundImage: `url('${PHOTO_NIGHT}')`,
            backgroundSize: "cover",
            backgroundPosition: "center 52%",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 100%)",
            filter: "saturate(0.12) brightness(0.22) hue-rotate(195deg)",
          }}
        />
        {/* Night blue tint for mid layer */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: isDark ? 1 : 0 }}
          transition={FADE}
          style={{
            background: "rgba(4, 8, 32, 0.62)",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 100%)",
          }}
        />
      </motion.div>

      {/* ══ Layer 2 — Lake / Prayer Flags  z=18 ═════════════════════════════ */}
      <motion.div
        style={{ y: foreY, position: "absolute", top: "55%", bottom: 0, left: 0, right: 0, zIndex: 18, willChange: "transform" }}
        aria-hidden
      >
        {/* Day fore */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: isDark ? 0 : 1 }}
          transition={FADE}
          style={{
            backgroundImage: `url('${PHOTO_DAY}')`,
            backgroundSize: "cover",
            backgroundPosition: "center 89%",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 22%, black 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 22%, black 100%)",
            filter: "saturate(0.82) brightness(0.60)",
          }}
        />
        {/* Night fore */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: isDark ? 1 : 0 }}
          transition={FADE}
          style={{
            backgroundImage: `url('${PHOTO_NIGHT}')`,
            backgroundSize: "cover",
            backgroundPosition: "center 89%",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 22%, black 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 22%, black 100%)",
            filter: "saturate(0.10) brightness(0.18) hue-rotate(195deg)",
          }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 55%, rgba(4,8,20,0.62) 100%)" }} />
      </motion.div>

      {/* ══ Mist bands ═══════════════════════════════════════════════════════ */}
      <div aria-hidden className="absolute pointer-events-none" style={{ zIndex: 9,  top: "27%",    left: 0, right: 0, height: "5%", background: "linear-gradient(to bottom, transparent, rgba(180,208,230,0.18) 50%, transparent)", filter: "blur(10px)", mixBlendMode: "screen" }} />
      <div aria-hidden className="absolute pointer-events-none" style={{ zIndex: 14, bottom: "25%", left: 0, right: 0, height: "8%", background: "linear-gradient(to bottom, transparent, rgba(195,215,235,0.42) 50%, transparent)", filter: "blur(20px)", mixBlendMode: "screen" }} />
      <div aria-hidden className="absolute pointer-events-none" style={{ zIndex: 19, top: "52%",    left: 0, right: 0, height: "6%", background: "linear-gradient(to bottom, transparent, rgba(185,210,232,0.28) 50%, transparent)", filter: "blur(14px)", mixBlendMode: "screen" }} />

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* ══ Content  z=30 ═══════════════════════════════════════════════════ */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity, zIndex: 30, willChange: "transform, opacity" }}
        className="absolute inset-0 pointer-events-none select-none"
      >
        <div style={{ position: "absolute", top: "8vh", left: "max(1.5rem, 5vw)", width: "min(86vw, 620px)" }}>

          {/* ── Brand label ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.62)", textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}>
              🇳🇵 &nbsp;Himalayan Kingdom
            </span>
          </div>

          {/* ── Giant NEPAL ── */}
          <h1
            style={{
              fontFamily: "'Arial Black', 'Arial Bold', Impact, 'Franklin Gothic Heavy', sans-serif",
              fontSize: "clamp(4.5rem, 24vw, 12rem)",
              fontWeight: 900,
              lineHeight: 0.88,
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
              textShadow: "0 2px 48px rgba(0,0,0,0.50), 0 0 120px rgba(220,20,60,0.12)",
              margin: "0 0 0.6rem",
              userSelect: "none",
              display: "block",
            }}
          >
            NEPAL
          </h1>

          {/* ── Main heading ── */}
          <h2
            style={{
              fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
              fontSize: "clamp(1.45rem, 4vw, 2.6rem)",
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
              textShadow: "0 2px 24px rgba(0,0,0,0.70)",
              marginBottom: "1rem",
              maxWidth: "min(520px, 90%)",
            }}
          >
            Discover the Roof<br />of the World
          </h2>

          {/* ── Subtitle ── */}
          <p
            style={{
              fontSize: "clamp(0.82rem, 1.5vw, 1rem)",
              color: "rgba(220,220,228,0.72)",
              lineHeight: 1.65,
              textShadow: "0 1px 10px rgba(0,0,0,0.60)",
              marginBottom: "2rem",
              maxWidth: "min(420px, 88%)",
            }}
          >
            From sacred mountains to ancient cultures — explore Nepal like never before with AI-powered journeys.
          </p>

          {/* ── CTA buttons ── */}
          <div
            className="pointer-events-auto"
            style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-start" }}
          >
            <motion.button
              onClick={() => document.dispatchEvent(new CustomEvent("open-ai-planner"))}
              whileHover={{ scale: 1.03, boxShadow: "0 0 48px rgba(220,20,60,0.70), 0 8px 32px rgba(220,20,60,0.45)" }}
              whileTap={{ scale: 0.97 }}
              transition={BTN_TRANSITION}
              style={{
                display: "flex", alignItems: "center", gap: "9px",
                background: "linear-gradient(135deg, #FF1744 0%, #DC143C 50%, #B71C1C 100%)",
                border: "none", color: "#fff",
                padding: "14px 32px", borderRadius: "9999px",
                fontWeight: 700, fontSize: "clamp(0.88rem, 1.6vw, 1rem)",
                cursor: "pointer", letterSpacing: "0.01em",
                boxShadow: "0 4px 32px rgba(220,20,60,0.55), 0 1px 0 rgba(255,255,255,0.12) inset",
                willChange: "transform",
                minWidth: "clamp(190px, 36vw, 240px)",
              }}
            >
              <Sparkles size={16} strokeWidth={2} />
              Plan My Journey
            </motion.button>

            <motion.button
              onClick={() => document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" })}
              whileHover={{ scale: 1.03, background: "rgba(255,255,255,0.14)" }}
              whileTap={{ scale: 0.97 }}
              transition={BTN_TRANSITION}
              style={{
                display: "flex", alignItems: "center", gap: "9px",
                background: "rgba(255,255,255,0.09)",
                backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "rgba(255,255,255,0.88)",
                padding: "12px 28px", borderRadius: "9999px",
                fontWeight: 600, fontSize: "clamp(0.82rem, 1.5vw, 0.95rem)",
                cursor: "pointer", willChange: "transform",
                minWidth: "clamp(190px, 36vw, 240px)",
              }}
            >
              <Headphones size={16} strokeWidth={2} />
              Talk to Concierge
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ══ Trust bar  z=35 ══════════════════════════════════════════════════ */}
      <motion.div
        style={{ position: "absolute", bottom: "6.5rem", left: "max(1.5rem, 5vw)", zIndex: 35, pointerEvents: "none", userSelect: "none" }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.45 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          <div style={{ display: "flex" }}>
            {AVATAR_SEEDS.map((a, i) => (
              <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: a.bg, border: "2px solid rgba(255,255,255,0.30)", marginLeft: i > 0 ? -7 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.58rem", fontWeight: 700, color: "#fff" }}>
                {a.initials}
              </div>
            ))}
          </div>
          <div>
            <div style={{ display: "flex", gap: "2px", marginBottom: "2px" }}>
              {[1,2,3,4,5].map(s => <Star key={s} size={9} fill="#FBBF24" stroke="none" />)}
            </div>
            <p style={{ fontSize: "0.67rem", color: "rgba(255,255,255,0.50)", fontWeight: 500, lineHeight: 1 }}>4.9 · 5K reviews</p>
          </div>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.20)", flexShrink: 0 }} />
          <p style={{ fontSize: "0.55rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", fontWeight: 700 }}>Trusted by Travelers</p>
        </div>
      </motion.div>

      {/* ══ AI Trip Planner badge  z=40 ══════════════════════════════════════ */}
      <motion.div
        className="pointer-events-auto"
        style={{ position: "absolute", bottom: "2rem", left: "max(1.5rem, 5vw)", zIndex: 40 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.45 }}
      >
        <motion.button
          onClick={() => document.dispatchEvent(new CustomEvent("open-ai-planner"))}
          whileHover={{ scale: 1.07, boxShadow: "0 0 28px rgba(220,20,60,0.65)" }}
          whileTap={{ scale: 0.95 }}
          transition={BTN_TRANSITION}
          style={{
            display: "flex", alignItems: "center", gap: "7px",
            background: "#DC143C", border: "none", color: "#fff",
            padding: "9px 16px", borderRadius: "9999px",
            fontWeight: 700, fontSize: "0.77rem", cursor: "pointer",
            boxShadow: "0 4px 18px rgba(220,20,60,0.52)",
            letterSpacing: "0.01em", willChange: "transform",
          }}
        >
          <Sparkles size={13} strokeWidth={2.2} />
          AI Trip Planner
        </motion.button>
      </motion.div>

      {/* ══ Watch Nepal  z=40 ════════════════════════════════════════════════ */}
      <motion.div
        className="pointer-events-auto"
        style={{ position: "absolute", bottom: "6.5rem", right: "max(1.5rem, 5vw)", zIndex: 40 }}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.55, duration: 0.45 }}
      >
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          transition={BTN_TRANSITION}
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            background: "rgba(0,0,0,0.52)",
            backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.11)",
            borderRadius: "9999px", padding: "10px 14px 10px 10px",
            color: "rgba(255,255,255,0.90)", cursor: "pointer",
          }}
        >
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.11)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Play size={13} fill="white" stroke="none" style={{ marginLeft: "2px" }} />
          </div>
          <div className="text-left">
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>Watch Nepal</p>
            <p style={{ fontSize: "0.59rem", color: "rgba(255,255,255,0.42)", lineHeight: 1.2 }}>(60 Seconds)</p>
          </div>
        </motion.button>
      </motion.div>

      {/* ══ Himalayan Concierge  z=40 ════════════════════════════════════════ */}
      <motion.div
        className="pointer-events-auto"
        style={{ position: "absolute", bottom: "2rem", right: "max(1.5rem, 5vw)", zIndex: 40 }}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.65, duration: 0.45 }}
      >
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 26px rgba(180,140,60,0.42)" }}
          whileTap={{ scale: 0.96 }}
          transition={BTN_TRANSITION}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: "rgba(10,10,14,0.82)",
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(200,160,60,0.30)",
            color: "#fff", padding: "11px 18px", borderRadius: "9999px",
            fontWeight: 700, fontSize: "0.83rem", cursor: "pointer",
            boxShadow: "0 4px 18px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.06)",
            letterSpacing: "0.01em", willChange: "transform",
          }}
        >
          <Sparkles size={13} strokeWidth={2} color="#D4A840" />
          Himalayan Concierge
        </motion.button>
      </motion.div>

      {/* ══ Scroll cue  z=50 ═════════════════════════════════════════════════ */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ zIndex: 50 }}
        animate={{ y: [0, 5, 0], opacity: [0.45, 0.80, 0.45] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5" style={{ border: "1.5px solid rgba(255,255,255,0.32)" }}>
          <motion.div className="w-[3px] h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.62)" }} animate={{ opacity: [0.9, 0.2, 0.9] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} />
        </div>
      </motion.div>

    </div>
  );
}
