"use client";

import { motion } from "motion/react";

export default function AIAssistantSection() {
  const openPlanner = () =>
    document.dispatchEvent(new CustomEvent("open-ai-planner"));

  return (
    <section
      style={{
        background: "var(--section-bg)",
        borderTop: "1px solid var(--section-border)",
        padding: "clamp(1.25rem, 4vw, 2.5rem) max(1rem, 4vw)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "var(--ai-card-bg)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid var(--ai-card-border)",
          borderRadius: "20px",
          padding: "clamp(1rem, 3vw, 1.75rem)",
          display: "flex",
          alignItems: "center",
          gap: "clamp(1rem, 3vw, 1.75rem)",
          flexWrap: "wrap",
        }}
      >
        {/* Animated AI orb — unchanged in both modes */}
        <div style={{ flexShrink: 0, position: "relative" }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{
              width: "clamp(52px, 14vw, 72px)",
              height: "clamp(52px, 14vw, 72px)",
              borderRadius: "50%",
              background: "conic-gradient(from 0deg, #DC2626, #7C3AED, #2563EB, #059669, #D97706, #DC2626)",
              padding: "3px",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: "rgba(10,14,28,1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "clamp(1.2rem, 4vw, 1.7rem)",
              }}
            >
              ✨
            </div>
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.45], opacity: [0.45, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            style={{ position: "absolute", inset: "-6px", borderRadius: "50%", border: "2px solid rgba(124,58,237,0.6)", pointerEvents: "none" }}
          />
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: "160px" }}>
          <p style={{ fontSize: "clamp(0.95rem, 2.8vw, 1.15rem)", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2, marginBottom: "0.3rem" }}>
            Hi, I&apos;m Himalaya AI ✨
          </p>
          <p style={{ fontSize: "clamp(0.72rem, 1.8vw, 0.82rem)", color: "var(--text-secondary)", lineHeight: 1.4 }}>
            Your personal Nepal travel guide — itineraries, best seasons, hidden gems.
          </p>
        </div>

        {/* Buttons — crimson stays identical in both modes */}
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", flexShrink: 0 }}>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={openPlanner}
            style={{
              background: "rgba(220,38,38,0.18)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(220,38,38,0.4)",
              boxShadow: "0 0 18px rgba(220,38,38,0.25)",
              color: "#DC2626",
              padding: "0.55rem 1.1rem",
              borderRadius: "9999px",
              fontWeight: 700,
              fontSize: "clamp(0.72rem, 1.8vw, 0.82rem)",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            📋 Create Itinerary
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={openPlanner}
            style={{
              background: "var(--glass-bg)",
              backdropFilter: "blur(12px)",
              border: "1px solid var(--glass-border)",
              color: "var(--text-primary)",
              padding: "0.55rem 1.1rem",
              borderRadius: "9999px",
              fontWeight: 600,
              fontSize: "clamp(0.72rem, 1.8vw, 0.82rem)",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            🗓 Best Time to Visit
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
