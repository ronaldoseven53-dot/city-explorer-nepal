"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Maximize2, ChevronRight, Volume2, VolumeX } from "lucide-react";

const VIDEO_ID = "APiIPm6P-EA";

/* Minimal YT stubs — avoids pulling in @types/youtube just for one component */
type YTPlayer = {
  playVideo(): void;
  pauseVideo(): void;
  mute(): void;
  unMute(): void;
  destroy(): void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w = () => window as Record<string, any>;

export default function VideoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const playerRef  = useRef<YTPlayer | null>(null);
  const [apiReady, setApiReady] = useState(false);
  const [muted,    setMuted]    = useState(true);

  const isInView = useInView(sectionRef, { amount: 0.3 });

  // ── Load YouTube IFrame API (once per page) ───────────────────────
  useEffect(() => {
    if (w().YT?.Player) { setApiReady(true); return; }

    const prev = w().onYouTubeIframeAPIReady;
    w().onYouTubeIframeAPIReady = () => { setApiReady(true); prev?.(); };

    if (!document.getElementById("yt-iframe-api")) {
      const tag = document.createElement("script");
      tag.id  = "yt-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
  }, []);

  // ── Instantiate player once API is ready ─────────────────────────
  useEffect(() => {
    if (!apiReady || playerRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    playerRef.current = new (w().YT.Player as new (...a: unknown[]) => YTPlayer)("yt-player-inner", {
      videoId: VIDEO_ID,
      playerVars: {
        autoplay:       1,
        mute:           1,
        loop:           1,
        playlist:       VIDEO_ID,   // required for loop
        controls:       0,
        modestbranding: 1,
        rel:            0,
        playsinline:    1,          // iOS inline play
        iv_load_policy: 3,          // no annotations
        disablekb:      1,
        fs:             0,          // hide YT's own fullscreen btn
        origin:         window.location.origin,
      },
      events: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onReady: (e: any) => { e.target.mute(); e.target.playVideo(); },
      },
    }) as YTPlayer;

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [apiReady]);

  // ── Pause/resume as section enters/leaves viewport ────────────────
  useEffect(() => {
    const p = playerRef.current;
    if (!p) return;
    if (isInView) p.playVideo();
    else p.pauseVideo();
  }, [isInView]);

  // ── Custom fullscreen: unmute audio for the full experience ───────
  const handleFullscreen = useCallback(() => {
    if (!wrapperRef.current) return;
    if (!document.fullscreenElement) {
      wrapperRef.current.requestFullscreen().then(() => {
        playerRef.current?.unMute();
        setMuted(false);
      }).catch(() => {});
    } else {
      document.exitFullscreen().then(() => {
        playerRef.current?.mute();
        setMuted(true);
      }).catch(() => {});
    }
  }, []);

  // Re-mute if user exits fullscreen via Esc
  useEffect(() => {
    const onFSChange = () => {
      if (!document.fullscreenElement) {
        playerRef.current?.mute();
        setMuted(true);
      }
    };
    document.addEventListener("fullscreenchange", onFSChange);
    return () => document.removeEventListener("fullscreenchange", onFSChange);
  }, []);

  const scrollToFeatured = () =>
    document.getElementById("featured-destinations")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section ref={sectionRef} className="relative w-full py-8 sm:py-10 overflow-hidden">

      {/* Bottom scrim */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{ height: "40%", background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.40))" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ zIndex: 1 }}>

        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-0.5"
              style={{ color: "var(--text-tertiary)" }}>
              Nepal in Motion
            </p>
            <h2 className="text-[18px] font-extrabold tracking-tight"
              style={{ color: "var(--text-primary)" }}>
              Watch Nepal in 60 Sec
            </h2>
          </div>
          {/* Audio status indicator */}
          <span className="flex items-center gap-1.5 text-[11px] font-semibold select-none"
            style={{ color: "var(--text-tertiary)" }}>
            {muted
              ? <VolumeX size={13} strokeWidth={2} />
              : <Volume2 size={13} strokeWidth={2} />}
            {muted ? "Muted" : "Audio On"}
          </span>
        </div>

        {/* ── Video wrapper — 16:9 desktop / 9:16 mobile ───────────── */}
        <div ref={wrapperRef} className="yt-video-wrapper relative overflow-hidden rounded-[24px]">

          {/* YouTube replaces this div with an iframe */}
          <div id="yt-player-inner" />

          {/* Cinematic gradient overlays */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2,
            background: "linear-gradient(to right, rgba(4,8,22,0.72) 0%, rgba(4,8,22,0.22) 55%, transparent 100%)" }} />
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2,
            background: "linear-gradient(to top, rgba(4,8,22,0.55) 0%, transparent 45%)" }} />

          {/* ── Glassmorphism overlay (left panel) ───────────────── */}
          {/* Outer div handles absolute centering; motion.div handles slide-in */}
          <div className="absolute z-10"
            style={{ left: "max(16px, 4%)", top: "50%", transform: "translateY(-50%)", maxWidth: "min(300px, 44%)" }}>
            <motion.div
              initial={{ opacity: 0, x: -22 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -22 }}
              transition={{ type: "spring", stiffness: 240, damping: 28, delay: 0.2 }}
            >
              <div style={{
                background:           "rgba(4,8,22,0.52)",
                backdropFilter:       "blur(22px)",
                WebkitBackdropFilter: "blur(22px)",
                border:               "1px solid rgba(255,255,255,0.14)",
                borderRadius:         20,
                padding:              "20px 22px",
              }}>
                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold mb-3"
                  style={{ background: "rgba(220,38,38,0.18)", border: "1px solid rgba(220,38,38,0.40)", color: "#f87171" }}>
                  🇳🇵 Cinematic Nepal
                </span>

                <h3 style={{
                  color: "#fff", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em",
                  fontSize: "clamp(0.92rem, 2vw, 1.22rem)", marginBottom: 10,
                }}>
                  Discover the Heart<br />of the Himalayas
                </h3>

                <p style={{ color: "rgba(255,255,255,0.58)", fontSize: 11.5, lineHeight: 1.6, marginBottom: 18 }}>
                  Ancient temples, sky-high peaks, and culture unchanged for 1,400 years — in 60 seconds.
                </p>

                <motion.button
                  onClick={scrollToFeatured}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.94 }}
                  className="flex items-center gap-1.5 cursor-pointer rounded-full"
                  style={{
                    background:  "rgba(220,38,38,0.20)",
                    border:      "1px solid rgba(220,38,38,0.45)",
                    boxShadow:   "0 0 18px rgba(220,38,38,0.22)",
                    color:       "#fff",
                    fontSize:    12,
                    fontWeight:  700,
                    padding:     "8px 16px",
                  }}
                >
                  Learn More
                  <ChevronRight size={12} strokeWidth={2.5} />
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* ── Full Screen button ───────────────────────────────── */}
          <motion.button
            onClick={handleFullscreen}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            className="absolute bottom-4 right-4 z-10 flex items-center gap-2 cursor-pointer"
            style={{
              background:           "rgba(4,8,22,0.60)",
              backdropFilter:       "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border:               "1px solid rgba(255,255,255,0.20)",
              borderRadius:         9999,
              padding:              "8px 14px",
              color:                "#fff",
              fontSize:             12,
              fontWeight:           700,
            }}
          >
            <Maximize2 size={13} strokeWidth={2} />
            Full Screen
          </motion.button>

        </div>
      </div>

      {/*
        Scoped CSS:
        - Desktop 16:9, iframe fills wrapper via absolute inset
        - Mobile 9:16 (portrait Reel/Short), iframe is scaled up to fill
          height and clipped on the sides (fills by height, crops width)
        - Fullscreen: remove aspect-ratio + reset iframe positioning
      */}
      <style>{`
        .yt-video-wrapper {
          aspect-ratio: 16 / 9;
        }
        .yt-video-wrapper #yt-player-inner {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          border: 0;
        }

        @media (max-width: 639px) {
          .yt-video-wrapper {
            aspect-ratio: 9 / 16;
          }
          /* Scale 16:9 iframe to fill the 9:16 container by height,
             then center it — crops left/right like a Reel/Short */
          .yt-video-wrapper #yt-player-inner {
            width:  316%;
            height: 100%;
            left:  -108%;
            top:    0;
          }
        }

        .yt-video-wrapper:fullscreen,
        .yt-video-wrapper:-webkit-full-screen {
          aspect-ratio: auto;
          border-radius: 0 !important;
        }
        .yt-video-wrapper:fullscreen #yt-player-inner,
        .yt-video-wrapper:-webkit-full-screen #yt-player-inner {
          width:  100% !important;
          height: 100% !important;
          left:   0 !important;
          top:    0 !important;
        }
      `}</style>
    </section>
  );
}
