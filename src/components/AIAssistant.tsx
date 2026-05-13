"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Timeline, { type ItineraryEvent } from "./Timeline";
import { destinations } from "@/data/destinations";
import { useUserPassport } from "@/context/UserPassportContext";
import { useTripContext } from "@/context/TripContext";
import { Wifi, X, ChevronDown, RotateCcw, CalendarPlus, Calendar } from "lucide-react";
import { type CalendarEvent, googleCalUrl, downloadICS } from "@/lib/calendarUtils";

// ── Chat persistence (sessionStorage — auto-wipes on tab close) ────

const CHAT_KEY = "himalaya_chat_v1";

function loadStoredChat(): UIMessage[] {
  try {
    const raw = sessionStorage.getItem(CHAT_KEY);
    return raw ? (JSON.parse(raw) as UIMessage[]) : [];
  } catch { return []; }
}

function saveChat(msgs: UIMessage[]) {
  try {
    // Strip tool-call parts to keep storage lean
    const textOnly = msgs
      .map(m => ({ ...m, parts: m.parts.filter((p: { type: string }) => p.type === "text") }))
      .filter(m => m.parts.length > 0);
    if (textOnly.length === 0) { sessionStorage.removeItem(CHAT_KEY); return; }
    sessionStorage.setItem(CHAT_KEY, JSON.stringify(textOnly));
  } catch {}
}

// ── Responsive hook ────────────────────────────────────────────────

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

// ── Animation variants ─────────────────────────────────────────────

const mobileVariants = {
  hidden:  { y: "100%" },
  visible: { y: 0,     transition: { type: "spring" as const, stiffness: 340, damping: 34, mass: 1 } },
  exit:    { y: "100%", transition: { duration: 0.26, ease: "easeIn" as const } },
};

const desktopVariants = {
  hidden:  { opacity: 0, scale: 0.92, y: 24 },
  visible: { opacity: 1, scale: 1,   y: 0,  transition: { type: "spring" as const, stiffness: 420, damping: 25, mass: 0.8 } },
  exit:    { opacity: 0, scale: 0.92, y: 24, transition: { duration: 0.2, ease: "easeIn" as const } },
};

const bubbleVariants = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" as const } },
};

// ── Helpers ────────────────────────────────────────────────────────

const QUICK_PROMPTS = [
  "Plan a 7-day Nepal itinerary",
  "Best trekking destinations?",
  "What should I do next?",
  "Show me hidden cultural gems",
];

const NEPAL_CENTER = { lat: 28.3949, lng: 84.124 };

function TypewriterText({ text, speed = 30 }: { text: string; speed?: number }) {
  const [prevText, setPrevText]       = useState(text);
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete]   = useState(false);

  // Reset when the text prop changes (setState-during-render pattern — no effect needed)
  if (text !== prevText) {
    setPrevText(text);
    setDisplayText("");
    setIsComplete(false);
  }

  useEffect(() => {
    let i = displayText.length;
    const timer = setInterval(() => {
      if (i < text.length) { setDisplayText(text.slice(0, i + 1)); i++; }
      else { setIsComplete(true); clearInterval(timer); }
    }, speed);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed]);

  return (
    <span>
      {displayText}
      {!isComplete && <span className="animate-pulse">|</span>}
    </span>
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}

function haversineDistance(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function findDestinationByText(text: string) {
  const normalized = text.toLowerCase();
  return destinations.find((d) =>
    new RegExp(`\\b${escapeRegExp(d.name.toLowerCase())}\\b`, "i").test(normalized)
  );
}

function findNearestUnvisited(visitedIds: Set<string>) {
  const unvisited = destinations.filter((d) => !visitedIds.has(d.id));
  if (unvisited.length === 0) return null;
  if (visitedIds.size === 0)
    return unvisited.reduce((c, d) =>
      haversineDistance(d.coordinates, NEPAL_CENTER) < haversineDistance(c.coordinates, NEPAL_CENTER) ? d : c, unvisited[0]);
  const visited = destinations.filter((d) => visitedIds.has(d.id));
  return unvisited.reduce((c, d) => {
    const distD = Math.min(...visited.map((v) => haversineDistance(d.coordinates, v.coordinates)));
    const distC = Math.min(...visited.map((v) => haversineDistance(c.coordinates, v.coordinates)));
    return distD < distC ? d : c;
  }, unvisited[0]);
}

function dispatchMapFly(destination: (typeof destinations)[number]) {
  if (typeof window === "undefined") return;
  document.dispatchEvent(new CustomEvent("map-fly-to", { detail: { lat: destination.coordinates.lat, lng: destination.coordinates.lng, id: destination.id } }));
}

function dispatchHeroImage(destination: (typeof destinations)[number]) {
  if (typeof window === "undefined") return;
  document.dispatchEvent(new CustomEvent("hero-image-change", { detail: { image: destination.placeholderImage, id: destination.id } }));
}

function shouldSuggestNext(text: string) {
  return /(what should I do next\??|what do I do next\??|what's next\??|what next\??|recommend my next|next experience)/i.test(text);
}

// ── Main component ─────────────────────────────────────────────────

export default function AIAssistant() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [glowingMessageId, setGlowingMessageId] = useState<string | null>(null);
  const [festivalCtx, setFestivalCtx] = useState<CalendarEvent | null>(null);

  // Load persisted messages once on mount (SSR-safe lazy init)
  const [chatInitialMessages] = useState<UIMessage[]>(() =>
    typeof window !== "undefined" ? loadStoredChat() : []
  );
  const bottomRef      = useRef<HTMLDivElement>(null);
  const lastAssistantId = useRef<string | null>(null);
  const autoPromptRef  = useRef<string | null>(null);
  const inputRef       = useRef<HTMLInputElement>(null);
  const isMobile       = useIsMobile();

  const transport = useMemo(
    () => new DefaultChatTransport({
      api: "/api/chat",
      fetch: (url, options) => fetch(url, { ...options, signal: AbortSignal.timeout(30000) }),
      prepareSendMessagesRequest: async ({ messages, body }) => {
        type SimpleMsg = { role: string; content: string };
        const formatted: SimpleMsg[] = messages
          .map((m) => {
            const text = m.parts.filter((p) => p.type === "text").map((p) => p.text).join(" ").trim();
            // Preserve assistant turns that had only tool calls — Gemini requires strict alternation
            const hasToolPart = m.parts.some((p) => (p as { type: string }).type.startsWith("tool-"));
            return { role: m.role, content: text || (hasToolPart ? "[itinerary built]" : "") };
          })
          .filter((m) => m.content.length > 0)
          // Merge any remaining consecutive same-role messages to satisfy the strict turn model
          .reduce<SimpleMsg[]>((acc, m) => {
            const prev = acc[acc.length - 1];
            if (prev?.role === m.role) { prev.content += `\n\n${m.content}`; return acc; }
            return [...acc, { ...m }];
          }, []);
        return { body: { ...body, messages: formatted } };
      },
    }),
    []
  );

  const { visitedIds } = useUserPassport();
  const { selectedCities, totalDays, budgetUSD, travelMonth, toggleCity } = useTripContext();
  const { messages, sendMessage, status, error, setMessages, clearError } = useChat({
    transport,
    messages: chatInitialMessages,
  });

  // Persist messages to sessionStorage whenever they change
  useEffect(() => { saveChat(messages); }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
    clearError();
    setFestivalCtx(null);
    sessionStorage.removeItem(CHAT_KEY);
  }, [setMessages, clearError]);
  const isThinking = status === "streaming" || status === "submitted";

  const appendMockResponse = useCallback(() => {
    setMessages((current) => {
      if (current[current.length - 1]?.role === "assistant") return current;
      return [...current, {
        id: `mock-${Date.now()}`, role: "assistant",
        parts: [{ type: "text", text: "Namaste! I am Himalaya AI. My connection to the peaks is being restored, but I am here to help you explore Nepal." }],
      } as UIMessage];
    });
  }, [setMessages]);

  const handleSend = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isThinking) return;
    setInput("");
    const dest = findDestinationByText(trimmed);
    if (dest) { dispatchMapFly(dest); dispatchHeroImage(dest); }
    try { await Promise.resolve(sendMessage({ text: trimmed })); }
    catch (err) { console.error("[AIAssistant] sendMessage failed:", err); appendMockResponse(); }
  }, [appendMockResponse, isThinking, sendMessage]);

  // Open from "ai-assistant-open" events (existing event with message payload)
  useEffect(() => {
    const handler = (e: Event) => {
      const { message } = (e as CustomEvent<{ message: string }>).detail;
      setIsChatOpen(true);
      void handleSend(message);
    };
    window.addEventListener("ai-assistant-open", handler);
    return () => window.removeEventListener("ai-assistant-open", handler);
  }, [handleSend]);

  // Open from "open-ai-planner" events (HimalayanAICard, AIAssistantSection, BottomNav, FestivalCalendar)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ prompt?: string; festival?: CalendarEvent }>).detail;
      const prompt = detail?.prompt;
      const festival = detail?.festival;
      if (prompt) {
        // Wipe old history so new plan/festival starts clean
        clearChat();
        autoPromptRef.current = prompt;
      }
      if (festival) setFestivalCtx(festival);
      setIsChatOpen(true);
    };
    document.addEventListener("open-ai-planner", handler);
    return () => document.removeEventListener("open-ai-planner", handler);
  }, [clearChat]);

  // Auto-send injected prompt after panel opens
  useEffect(() => {
    if (!isChatOpen || !autoPromptRef.current) return;
    const p = autoPromptRef.current;
    autoPromptRef.current = null;
    const t = setTimeout(() => void handleSend(p), 420);
    return () => clearTimeout(t);
  }, [isChatOpen, handleSend]);

  // Focus input + clear any stale error when panel opens
  useEffect(() => {
    if (!isChatOpen) return;
    clearError();
    setTimeout(() => inputRef.current?.focus(), 300);
  }, [isChatOpen, clearError]);

  // Escape to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsChatOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Tell BottomNav to hide/show on mobile
  useEffect(() => {
    document.dispatchEvent(new CustomEvent("himalaya-chat-state", { detail: { open: isChatOpen } }));
  }, [isChatOpen]);

  // Passport "what next" suggestion — derived value, no state needed
  const lastUserText = useMemo(() => {
    const m = [...messages].reverse().find((m) => m.role === "user");
    if (!m) return "";
    return m.parts.filter((p) => p.type === "text").map((p) => p.text).join(" ").trim();
  }, [messages]);

  const passportSuggestion = useMemo<string | null>(() => {
    if (!shouldSuggestNext(lastUserText)) return null;
    const next = findNearestUnvisited(visitedIds);
    if (next) return `Based on your My Collection progress, the nearest unvisited landmark is ${next.name}. I recommend exploring it next.`;
    return "You have visited every landmark — congratulations! Let me help you choose an epic new route.";
  }, [lastUserText, visitedIds]);

  // Side effects when passport suggestion changes (map fly + hero image)
  useEffect(() => {
    if (!shouldSuggestNext(lastUserText)) return;
    const next = findNearestUnvisited(visitedIds);
    if (next) { dispatchMapFly(next); dispatchHeroImage(next); }
  }, [lastUserText, visitedIds]);

  // Map fly on AI reply
  useEffect(() => {
    const m = [...messages].reverse().find((m) => m.role === "assistant");
    if (!m || m.id === lastAssistantId.current) return;
    lastAssistantId.current = m.id;
    const text = m.parts.filter((p) => p.type === "text").map((p) => p.text).join(" ");
    const dest = findDestinationByText(text);
    if (dest) { dispatchMapFly(dest); dispatchHeroImage(dest); }
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Glow on new AI message
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.role === "assistant" && last.id !== lastAssistantId.current) {
      setGlowingMessageId(last.id);
      const t = setTimeout(() => setGlowingMessageId(null), 2000);
      return () => clearTimeout(t);
    }
  }, [messages]);

  const submit = () => { const t = input.trim(); if (!t || isThinking) return; void handleSend(t); };

  const NOISE_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

  return (
    <AnimatePresence>
      {isChatOpen && (
        <>
          {/* ── Mobile backdrop ── */}
          <motion.div
            key="ai-backdrop"
            className="sm:hidden fixed inset-0 z-40 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setIsChatOpen(false)}
          />

          {/* ── Chat panel ── */}
          <motion.div
            key="ai-panel"
            variants={isMobile ? mobileVariants : desktopVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={[
              // shared
              "fixed flex flex-col overflow-hidden",
              "bg-zinc-950/90 backdrop-blur-2xl",
              "border border-white/[0.10]",
              "shadow-[0_20px_60px_rgba(0,0,0,0.55)]",
              // mobile: true full-screen overlay (covers BottomNav, keyboard area, everything)
              "inset-0 z-[9999] rounded-none",
              // desktop: floating bottom-right window
              "sm:inset-auto sm:z-50 sm:bottom-20 sm:right-6 sm:w-[400px] sm:h-auto sm:max-h-[75vh] sm:rounded-3xl sm:origin-bottom-right",
            ].join(" ")}
          >
            {/* Film grain */}
            <div aria-hidden className="pointer-events-none absolute inset-0 z-10 opacity-[0.032] mix-blend-overlay"
              style={{ backgroundImage: NOISE_BG, backgroundRepeat: "repeat", backgroundSize: "128px 128px" }}
            />

            {/* Mobile drag handle */}
            <div className="sm:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* ── Header ── */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.08] bg-white/[0.03] flex-shrink-0">
              {/* Avatar */}
              <motion.div
                className="w-9 h-9 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center flex-shrink-0"
                animate={isThinking ? {
                  boxShadow: [
                    "0 0 0px rgba(245,158,11,0.8)",
                    "0 0 16px rgba(245,158,11,0.8), 0 0 32px rgba(245,158,11,0.4)",
                    "0 0 0px rgba(245,158,11,0.8)",
                  ],
                } : { boxShadow: "0 0 10px rgba(245,158,11,0.25)" }}
                transition={isThinking
                  ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.4 }
                }
              >
                <span className="text-lg" aria-hidden>🏔️</span>
              </motion.div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white font-semibold text-sm leading-none tracking-tight">
                    Himalaya AI
                  </p>
                  <span className={`inline-flex items-center gap-1 rounded-full border border-amber-500/25 bg-amber-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-200 ${isThinking ? "animate-pulse" : ""}`}>
                    <span className="block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    live
                  </span>
                </div>
                <p className="text-amber-400/70 text-[11px] mt-0.5 font-medium tracking-tight">
                  {isThinking ? "Thinking…" : "Your expert Nepal travel guide"}
                </p>
              </div>

              {/* New Plan button */}
              <button
                onClick={clearChat}
                aria-label="New plan"
                title="Clear chat and start fresh"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-white/40 hover:text-white/80 hover:bg-white/[0.08] transition-all duration-200 cursor-pointer flex-shrink-0 text-[10px] font-semibold tracking-wide"
              >
                <RotateCcw size={11} strokeWidth={2.2} />
                <span className="hidden sm:inline">New</span>
              </button>

              {/* Close — desktop X, mobile chevron-down */}
              <button
                onClick={() => setIsChatOpen(false)}
                aria-label="Close"
                className="flex items-center justify-center w-9 h-9 rounded-full text-white/35 hover:text-white/80 hover:bg-white/[0.08] transition-all duration-200 cursor-pointer flex-shrink-0"
              >
                <span className="sm:hidden"><ChevronDown size={20} strokeWidth={2} /></span>
                <span className="hidden sm:block"><X size={16} strokeWidth={2} /></span>
              </button>
            </div>

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="text-center py-6 space-y-4"
                >
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto relative z-10">
                      <span className="text-3xl" aria-hidden>🏔️</span>
                    </div>
                    <div className="absolute inset-0 rounded-2xl border-2 border-amber-400/40 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-semibold tracking-tight">
                      {selectedCities.length > 0
                        ? `Namaste! I see you're planning ${totalDays} day${totalDays !== 1 ? "s" : ""} in ${selectedCities.map((c) => c.name).join(" & ")}.`
                        : "Namaste, traveler. I am Himalaya AI."
                      }
                    </p>
                    <p className="text-zinc-500 text-xs mt-1 leading-relaxed">
                      {selectedCities.length > 0
                        ? `With your $${budgetUSD.min}–$${budgetUSD.max} budget${travelMonth ? ` in ${travelMonth}` : ""}, I can build the perfect mountain-focused route. Tap a prompt below or ask me anything.`
                        : "Your expert guide through Nepal — ask me about temples, treks, festivals, and hidden mountain routes."
                      }
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    {QUICK_PROMPTS.map((prompt, i) => (
                      <motion.button
                        key={prompt}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 * i, duration: 0.25, ease: "easeOut" }}
                        onClick={() => { setInput(""); void handleSend(prompt); }}
                        className="block w-full text-left text-xs bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.14] text-zinc-400 hover:text-white/80 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer tracking-tight hover:scale-[1.02]"
                      >
                        {prompt}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Message bubbles */}
              {messages.map((m: UIMessage) => {
                const isUser = m.role === "user";
                const segments: React.ReactNode[] = [];

                for (const part of m.parts) {
                  if (part.type === "text" && part.text.trim()) {
                    segments.push(
                      <motion.div
                        key={`${m.id}-text-${segments.length}`}
                        variants={bubbleVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ type: "spring", stiffness: 330, damping: 26, delay: 0.04 * segments.length }}
                        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`
                          max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap tracking-tight
                          ${isUser
                            ? "bg-amber-500/15 border border-amber-500/30 text-white font-bold rounded-br-sm"
                            : `bg-zinc-900/60 backdrop-blur-xl text-zinc-300 font-light rounded-bl-sm ${
                                glowingMessageId === m.id
                                  ? "border-2 border-amber-400 shadow-lg shadow-amber-400/50 animate-pulse"
                                  : ""
                              }`
                          }
                        `}>
                          {isUser ? part.text : <TypewriterText text={part.text} />}
                        </div>
                      </motion.div>
                    );
                  }

                  if (part.type === "tool-buildItinerary" && part.state === "output-available") {
                    const { tripTitle, totalDays: td, events } = part.output as {
                      tripTitle: string; totalDays: number; events: ItineraryEvent[];
                    };
                    segments.push(
                      <Timeline
                        key={`${m.id}-timeline-${segments.length}`}
                        tripTitle={tripTitle}
                        totalDays={td}
                        initialEvents={events}
                        onSaveToTrip={(cityIds) => {
                          const alreadySelected = new Set(selectedCities.map((c) => c.id));
                          cityIds.forEach((id) => { if (!alreadySelected.has(id)) toggleCity(id); });
                          setIsChatOpen(false);
                        }}
                      />
                    );
                  }

                  // Destination image — skeleton while loading, HD photo when ready
                  if (part.type === "tool-generateDestinationImage") {
                    if (part.state !== "output-available") {
                      segments.push(
                        <motion.div
                          key={`${m.id}-img-skel-${segments.length}`}
                          variants={bubbleVariants} initial="hidden" animate="visible"
                          className="flex justify-start"
                        >
                          <div className="max-w-[90%] rounded-2xl overflow-hidden border border-white/10 bg-zinc-900/60 animate-pulse" style={{ minWidth: 220 }}>
                            <div style={{ width: "100%", height: 170, background: "rgba(255,255,255,0.06)" }} />
                            <div style={{ padding: "10px 14px" }}>
                              <div style={{ width: "55%", height: 10, borderRadius: 4, background: "rgba(255,255,255,0.09)", marginBottom: 6 }} />
                              <div style={{ width: "38%", height: 8, borderRadius: 4, background: "rgba(255,255,255,0.05)" }} />
                            </div>
                          </div>
                        </motion.div>
                      );
                    } else {
                      const out = part.output as { destinationName: string; caption: string; imageUrl: string | null; found: boolean };
                      if (out.imageUrl) {
                        segments.push(
                          <motion.div
                            key={`${m.id}-img-${segments.length}`}
                            variants={bubbleVariants} initial="hidden" animate="visible"
                            className="flex justify-start"
                          >
                            <div className="max-w-[90%] rounded-2xl overflow-hidden border border-white/10" style={{ background: "rgba(18,18,22,0.90)" }}>
                              <div className="relative" style={{ height: 200 }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={`${out.imageUrl.split("?")[0]}?w=640&q=85`}
                                  alt={out.destinationName}
                                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                />
                                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)" }} />
                                <div style={{ position: "absolute", bottom: 10, left: 12 }}>
                                  <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, lineHeight: 1.2, margin: 0 }}>{out.destinationName}</p>
                                </div>
                              </div>
                              {out.caption && (
                                <div style={{ padding: "9px 14px" }}>
                                  <p style={{ color: "rgba(255,255,255,0.52)", fontSize: 11, lineHeight: 1.55, margin: 0 }}>{out.caption}</p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      }
                    }
                  }
                }

                if (segments.length === 0) return null;
                return <div key={m.id} className="space-y-2">{segments}</div>;
              })}

              {/* Passport suggestion */}
              {passportSuggestion && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[85%] px-4 py-2.5 rounded-2xl bg-zinc-900/60 backdrop-blur-xl text-zinc-300 font-light text-sm leading-relaxed">
                    <span className="block text-amber-200 text-xs uppercase tracking-[0.3em] mb-2">My Collection sync</span>
                    <p>{passportSuggestion}</p>
                  </div>
                </motion.div>
              )}

              {/* Error */}
              {error && (
                <div className="max-w-[85%] px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-amber-500/80 text-xs tracking-tight space-y-1.5">
                  <div className="flex items-center gap-2 italic">
                    <Wifi className="w-3 h-3 animate-pulse flex-shrink-0" />
                    The mountain winds are heavy — trying to reconnect…
                  </div>
                  {error.message && (
                    <p className="text-amber-400/60 not-italic font-mono break-all leading-relaxed">
                      {error.message}
                    </p>
                  )}
                </div>
              )}

              {/* Festival calendar strip */}
              {festivalCtx && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[85%] rounded-2xl overflow-hidden border border-white/[0.09]"
                    style={{ background: "rgba(20,14,6,0.85)" }}
                  >
                    <div className="px-4 pt-3 pb-3 space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-400/60">
                        Add to Calendar
                      </p>
                      <p className="text-white/85 text-xs font-semibold tracking-tight">
                        {festivalCtx.emoji} {festivalCtx.name}
                      </p>
                      <p className="text-zinc-500 text-[10px]">
                        {new Date(festivalCtx.dateISO).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        {festivalCtx.endDateISO && festivalCtx.endDateISO !== festivalCtx.dateISO && (
                          <> – {new Date(festivalCtx.endDateISO).toLocaleDateString("en-US", { month: "long", day: "numeric" })}</>
                        )}
                      </p>
                      <div className="flex gap-2 pt-0.5">
                        <a
                          href={googleCalUrl(festivalCtx)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
                          style={{
                            background:     "rgba(66,133,244,0.15)",
                            border:         "1px solid rgba(66,133,244,0.35)",
                            borderRadius:   9999,
                            padding:        "5px 12px",
                            color:          "#7ab4f5",
                            fontSize:       11,
                            fontWeight:     600,
                            textDecoration: "none",
                          }}
                        >
                          <CalendarPlus size={11} strokeWidth={2.5} />
                          Google
                        </a>
                        <button
                          onClick={() => downloadICS(festivalCtx)}
                          className="flex items-center gap-1.5 cursor-pointer transition-opacity hover:opacity-80"
                          style={{
                            background:   "rgba(255,255,255,0.08)",
                            border:       "1px solid rgba(255,255,255,0.18)",
                            borderRadius: 9999,
                            padding:      "5px 12px",
                            color:        "rgba(255,255,255,0.75)",
                            fontSize:     11,
                            fontWeight:   600,
                          }}
                        >
                          <Calendar size={11} strokeWidth={2.5} />
                          Apple
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Thinking skeleton */}
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="flex justify-start"
                >
                  <div className="bg-zinc-900/60 backdrop-blur-xl rounded-2xl rounded-bl-sm px-4 py-3 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-4 bg-amber-500/20 rounded" />
                      <div className="w-6 h-4 bg-amber-500/15 rounded" />
                      <div className="w-10 h-4 bg-amber-500/25 rounded" />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* ── Input bar ── */}
            <div className="p-3 border-t border-white/[0.08] bg-white/[0.02] flex gap-2 flex-shrink-0">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
                placeholder="Ask about Nepal travel…"
                disabled={isThinking}
                style={{ fontSize: 16, touchAction: "manipulation" }}
                className={`flex-1 px-4 py-2.5 rounded-xl bg-white/[0.06] border text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/30 disabled:opacity-40 transition-all tracking-tight ${input.trim() ? "border-amber-500/50 shadow-lg shadow-amber-500/20" : "border-white/[0.10]"}`}
              />
              <motion.button
                onClick={submit}
                disabled={isThinking || !input.trim()}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="bg-amber-500 hover:bg-amber-400 disabled:opacity-25 disabled:cursor-not-allowed text-[#09090b] text-sm font-bold px-4 py-2.5 rounded-xl transition-colors duration-150 cursor-pointer shadow-[0_4px_16px_-4px_rgba(245,158,11,0.4)]"
              >
                ↑
              </motion.button>
            </div>

            {/* Safe-area padding on mobile */}
            <div className="sm:hidden h-[env(safe-area-inset-bottom,0px)] flex-shrink-0" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
