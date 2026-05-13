"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Maximize2, Volume2, VolumeX } from "lucide-react";

const VIDEO_ID = "APiIPm6P-EA";

const MARQUEE_TEXT =
  "Discover the Heart of the Himalayas — Ancient temples, sky-high peaks, and culture unchanged for 1,400 years.";

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
  const [apiReady,      setApiReady]      = useState(() => typeof window !== "undefined" && !!w().YT?.Player);
  const [muted,         setMuted]         = useState(true);
  const [marqueePaused, setMarqueePaused] = useState(false);

  const isInView = useInView(sectionRef, { amount: 0.3 });

  // ── Load YouTube IFrame API (once per page) ────────────────────────────
  useEffect(() => {
    if (w().YT?.Player) return;

    const prev = w().onYouTubeIframeAPIReady;
    w().onYouTubeIframeAPIReady = () => { setApiReady(true); prev?.(); };

    if (!document.getElementById("yt-iframe-api")) {
      const tag = document.createElement("script");
      tag.id  = "yt-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
  }, []);

  // ── Instantiate player once API is ready ──────────────────────────────
  useEffect(() => {
    if (!apiReady || playerRef.current) return;

    playerRef.current = new (w().YT.Player as new (...a: unknown[]) => YTPlayer)("yt-player-inner", {
      videoId: VIDEO_ID,
      playerVars: {
        autoplay:       1,
        mute:           1,
        loop:           1,
        playlist:       VIDEO_ID,
        controls:       0,
        modestbranding: 1,
        showinfo:       0,   // deprecated but harmless
        rel:            0,
        playsinline:    1,
        iv_load_policy: 3,
        disablekb:      1,
        fs:             0,
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

  // ── Pause / resume on viewport ─────────────────────────────────────────
  useEffect(() => {
    const p = playerRef.current;
    if (!p) return;
    if (isInView) p.playVideo();
    else p.pauseVideo();
  }, [isInView]);

  // ── Mute toggle ────────────────────────────────────────────────────────
  const toggleMute = useCallback(() => {
    if (!playerRef.current) return;
    if (muted) { playerRef.current.unMute(); setMuted(false); }
    else        { playerRef.current.mute();  setMuted(true);  }
  }, [muted]);

  // ── Fullscreen ─────────────────────────────────────────────────────────
  const handleFullscreen = useCallback(() => {
    const el  = wrapperRef.current as (HTMLDivElement & { webkitRequestFullscreen?(): Promise<void> }) | null;
    const doc = document as Document & { webkitFullscreenElement?: Element; webkitExitFullscreen?(): Promise<void> };
    if (!el) return;

    const isFs = doc.fullscreenElement || doc.webkitFullscreenElement;
    if (!isFs) {
      (el.requestFullscreen?.() ?? el.webkitRequestFullscreen?.())
        ?.then(() => { playerRef.current?.unMute(); setMuted(false); })
        .catch(() => {});
    } else {
      (doc.exitFullscreen?.() ?? doc.webkitExitFullscreen?.())
        ?.then(() => { playerRef.current?.mute(); setMuted(true); })
        .catch(() => {});
    }
  }, []);

  // Re-mute on Esc / system back
  useEffect(() => {
    const doc = document as Document & { webkitFullscreenElement?: Element };
    const onFSChange = () => {
      if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
        playerRef.current?.mute();
        setMuted(true);
      }
    };
    document.addEventListener("fullscreenchange", onFSChange);
    document.addEventListener("webkitfullscreenchange", onFSChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFSChange);
      document.removeEventListener("webkitfullscreenchange", onFSChange);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full py-8 sm:py-10 overflow-hidden">

      {/* Bottom scrim */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{ height: "40%", background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.40))" }} />

      {/* ── Section header + video ────────────────────────────────────────── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ zIndex: 1 }}>

        {/* Header row */}
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

          {/* Mute toggle */}
          <button
            onClick={toggleMute}
            aria-label={muted ? "Unmute video" : "Mute video"}
            className="flex items-center gap-1.5 text-[11px] font-semibold cursor-pointer transition-opacity hover:opacity-70"
            style={{
              color: "var(--text-tertiary)", background: "none", border: "none",
              padding: "8px 4px", minHeight: 44, minWidth: 44,
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {muted ? <VolumeX size={13} strokeWidth={2} /> : <Volume2 size={13} strokeWidth={2} />}
            {muted ? "Muted" : "Audio On"}
          </button>
        </div>

        {/* ── Video wrapper — 16:9 desktop / 9:16 mobile ──────────────── */}
        <div ref={wrapperRef} className="yt-video-wrapper relative overflow-hidden rounded-[24px]">

          {/* YouTube replaces this div with an iframe.
              The scale pushes any lingering title-bar overlay outside the
              overflow:hidden boundary without distorting the aspect ratio. */}
          <div id="yt-player-inner" className="yt-player-scaled" />

          {/* Cinematic gradient overlays */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2,
            background: "linear-gradient(to right, rgba(4,8,22,0.55) 0%, rgba(4,8,22,0.12) 55%, transparent 100%)" }} />
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2,
            background: "linear-gradient(to top, rgba(4,8,22,0.55) 0%, transparent 45%)" }} />

          {/* Fullscreen button */}
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

      {/* ── Marquee bar — full width, flush below video ────────────────── */}
      <div
        className="marquee-container"
        style={{
          width:                "100%",
          marginTop:            12,
          background:           "rgba(0,0,0,0.70)",
          backdropFilter:       "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderTop:            "1px solid rgba(255,255,255,0.07)",
          borderBottom:         "1px solid rgba(255,255,255,0.07)",
          padding:              "11px 0",
          overflow:             "hidden",
          cursor:               "default",
          userSelect:           "none",
        }}
        onMouseEnter={() => setMarqueePaused(true)}
        onMouseLeave={() => setMarqueePaused(false)}
        onTouchStart={() => setMarqueePaused(true)}
        onTouchEnd={() => setMarqueePaused(false)}
      >
        {/* 4 copies — animation translates by -25% (= width of 1 copy) for seamless loop */}
        <div
          className="marquee-track"
          style={{ animationPlayState: marqueePaused ? "paused" : "running" }}
        >
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i} className="marquee-segment">
              {MARQUEE_TEXT}
              <span className="marquee-dot" aria-hidden>·</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        /* ── Video wrapper aspect ratios ── */
        .yt-video-wrapper {
          aspect-ratio: 16 / 9;
        }
        .yt-video-wrapper .yt-player-scaled,
        .yt-video-wrapper .yt-player-scaled iframe {
          position: absolute;
          inset: 0;
          width:  100%;
          height: 100%;
          pointer-events: none;
          border: 0;
          /* Scale up slightly: pushes any YT title overlay outside overflow:hidden
             while keeping visible content centred. 1.06 = ~6% crop on each edge. */
          transform: scale(1.06);
          transform-origin: center center;
        }

        @media (max-width: 639px) {
          .yt-video-wrapper {
            aspect-ratio: 9 / 16;
          }
          .yt-video-wrapper .yt-player-scaled,
          .yt-video-wrapper .yt-player-scaled iframe {
            width:  316%;
            height: 100%;
            left:  -108%;
            top:    0;
            transform: scale(1.06);
          }
        }

        .yt-video-wrapper:fullscreen,
        .yt-video-wrapper:-webkit-full-screen {
          aspect-ratio: auto;
          border-radius: 0 !important;
        }
        .yt-video-wrapper:fullscreen .yt-player-scaled,
        .yt-video-wrapper:fullscreen .yt-player-scaled iframe,
        .yt-video-wrapper:-webkit-full-screen .yt-player-scaled,
        .yt-video-wrapper:-webkit-full-screen .yt-player-scaled iframe {
          width:     100% !important;
          height:    100% !important;
          left:      0 !important;
          top:       0 !important;
          transform: none !important;
        }

        /* ── Marquee ── */
        @keyframes marquee-scroll {
          from { transform: translateX(0);     }
          to   { transform: translateX(-25%);  }
        }

        .marquee-track {
          display:       inline-flex;
          align-items:   center;
          white-space:   nowrap;
          animation:     marquee-scroll 25s linear infinite;
          will-change:   transform;
        }

        .marquee-segment {
          display:      inline-flex;
          align-items:  center;
          font-family:  var(--font-geist-sans), "Inter", ui-sans-serif, system-ui, sans-serif;
          font-size:    13px;
          font-weight:  600;
          letter-spacing: 0.01em;
          color:        rgba(255, 255, 255, 0.88);
          padding-right: 0;
        }

        .marquee-dot {
          margin: 0 32px;
          opacity: 0.35;
          font-size: 18px;
          line-height: 1;
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
          /* On reduced motion: show text statically, centered */
          .marquee-container {
            display: flex;
            justify-content: center;
          }
          .marquee-track {
            white-space: normal;
            text-align: center;
          }
          .marquee-segment:not(:first-child) {
            display: none;
          }
        }
      `}</style>

    </section>
  );
}
