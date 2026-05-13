"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useScrollAnimation";

// ── Layer definitions ──────────────────────────────────────────────────────────
// Each layer drifts horizontally at a different speed/direction, creating a
// sense of layered, three-dimensional depth. All positions are in % of the
// parent height so this component works at any scale.

const FOG_LAYERS = [
  {
    // Valley floor — densest, slowest
    top: "68%", height: "14%",
    blur: 26, opacity: 0.50, duration: 26,
    color: "rgba(195,215,230,0.65)",
    driftX: 20, driftY: 0,
  },
  {
    // Mid-valley — medium density
    top: "48%", height: "9%",
    blur: 18, opacity: 0.34, duration: 34,
    color: "rgba(180,205,228,0.52)",
    driftX: -28, driftY: -2,
  },
  {
    // High-altitude wisp — faint, faster
    top: "30%", height: "6%",
    blur: 13, opacity: 0.22, duration: 44,
    color: "rgba(205,220,240,0.40)",
    driftX: 14, driftY: 0,
  },
  {
    // Zenith cloud streaks — barely visible, fastest
    top: "16%", height: "5%",
    blur: 9, opacity: 0.15, duration: 58,
    color: "rgba(215,225,245,0.32)",
    driftX: -10, driftY: 0,
  },
] as const;

interface Props {
  className?: string;
  style?: React.CSSProperties;
  /** Only render layers at or below this index (0=all, 2=bottom 3 layers) */
  maxLayers?: number;
  /** Scale opacity down globally — useful for subtle hero overlays */
  opacityScale?: number;
}

/**
 * Autonomous atmospheric fog — drifts continuously without user input.
 * Position this as `position:absolute; inset:0; pointer-events:none; overflow:hidden`
 * inside any layered stack.
 *
 * With `mixBlendMode:"screen"` the white fog brightens the image underneath,
 * matching real mountain mist behaviour.
 */
export default function AtmosphericFog({
  className      = "",
  style,
  maxLayers      = 4,
  opacityScale   = 1,
}: Props) {
  const reduced = useReducedMotion();

  const layers = FOG_LAYERS.slice(0, maxLayers);

  return (
    <div
      aria-hidden
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={style}
    >
      {layers.map((layer, i) => {
        // Reduced-motion: render static at reduced opacity, no animation
        if (reduced) {
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: layer.top, left: 0, right: 0,
                height: layer.height,
                filter: `blur(${layer.blur}px)`,
                mixBlendMode: "screen",
                background: `linear-gradient(to bottom, transparent, ${layer.color} 50%, transparent)`,
                opacity: layer.opacity * opacityScale * 0.5,
              }}
            />
          );
        }

        return (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              top: layer.top,
              // Extend 12% beyond edges so horizontal drift never reveals a gap
              left: "-12%", right: "-12%",
              height: layer.height,
              filter: `blur(${layer.blur}px)`,
              mixBlendMode: "screen",
              background: `linear-gradient(to bottom, transparent, ${layer.color} 50%, transparent)`,
              willChange: "transform, opacity",
            }}
            animate={{
              // Horizontal drift + subtle vertical bob + opacity breathing
              x: [0, layer.driftX, 0, layer.driftX * -0.4, 0],
              y: [0, layer.driftY, 0, layer.driftY * -0.6, 0],
              opacity: [
                layer.opacity * opacityScale,
                layer.opacity * opacityScale * 1.35,
                layer.opacity * opacityScale * 0.75,
                layer.opacity * opacityScale * 1.15,
                layer.opacity * opacityScale,
              ],
            }}
            transition={{
              duration: layer.duration,
              ease:     "easeInOut",
              repeat:   Infinity,
              repeatType: "loop",
              // Offset each layer so they don't all pulse at the same time
              delay: i * (layer.duration / 4),
            }}
          />
        );
      })}
    </div>
  );
}
