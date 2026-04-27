"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Timeline, { type ItineraryEvent } from "./Timeline";
import { destinations } from "@/data/destinations";
import { useUserPassport } from "@/context/UserPassportContext";
import { Wifi } from "lucide-react";

const QUICK_PROMPTS = [
  "Plan a 7-day Nepal itinerary",
  "Best trekking destinations?",
  "What should I do next?",
  "Show me hidden cultural gems",
];

const panelVariants = {
  hidden:  { opacity: 0, scale: 0.92, y: 16 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: "spring" as const, stiffness: 420, damping: 25, mass: 0.8 },
  },
  exit: {
    opacity: 0, scale: 0.92, y: 16,
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};

const bubbleVariants = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" as const } },
};

const NEPAL_CENTER = { lat: 28.3949, lng: 84.124 };

function TypewriterText({ text, speed = 30 }: { text: string; speed?: number }) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayText("");
    setIsComplete(false);
    
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
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
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const x = sinLat * sinLat + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function findDestinationByText(text: string) {
  const normalized = text.toLowerCase();
  return destinations.find((destination) => {
    const name = destination.name.toLowerCase();
    return new RegExp(`\\b${escapeRegExp(name)}\\b`, "i").test(normalized);
  });
}

function findNearestUnvisited(visitedIds: Set<string>) {
  const unvisited = destinations.filter((destination) => !visitedIds.has(destination.id));
  if (unvisited.length === 0) return null;

  if (visitedIds.size === 0) {
    return unvisited.reduce((closest, destination) => {
      return haversineDistance(destination.coordinates, NEPAL_CENTER) < haversineDistance(closest.coordinates, NEPAL_CENTER)
        ? destination
        : closest;
    }, unvisited[0]);
  }

  const visitedDestinations = destinations.filter((destination) => visitedIds.has(destination.id));
  return unvisited.reduce((closest, destination) => {
    const distanceToVisited = Math.min(
      ...visitedDestinations.map((visited) => haversineDistance(destination.coordinates, visited.coordinates))
    );
    const currentDistanceToVisited = Math.min(
      ...visitedDestinations.map((visited) => haversineDistance(closest.coordinates, visited.coordinates))
    );
    return distanceToVisited < currentDistanceToVisited ? destination : closest;
  }, unvisited[0]);
}

function dispatchMapFly(destination: (typeof destinations)[number]) {
  if (typeof window === "undefined") return;
  document.dispatchEvent(new CustomEvent("map-fly-to", {
    detail: {
      lat: destination.coordinates.lat,
      lng: destination.coordinates.lng,
      id: destination.id,
    },
  }));
}

function dispatchHeroImage(destination: (typeof destinations)[number]) {
  if (typeof window === "undefined") return;
  document.dispatchEvent(new CustomEvent("hero-image-change", {
    detail: {
      image: destination.placeholderImage,
      id: destination.id,
    },
  }));
}

function shouldSuggestNext(text: string) {
  return /(what should I do next\??|what do I do next\??|what's next\??|what next\??|recommend my next|next experience)/i.test(text);
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [passportSuggestion, setPassportSuggestion] = useState<string | null>(null);
  const [glowingMessageId, setGlowingMessageId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastAssistantId = useRef<string | null>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: async ({ messages, body }) => ({
          body: {
            ...body,
            messages: messages
              .map((message) => {
                const content = message.parts
                  .filter((part) => part.type === "text")
                  .map((part) => part.text)
                  .join(" ")
                  .trim();

                return {
                  role: message.role,
                  content,
                };
              })
              .filter((message) => message.content.length > 0),
          },
        }),
      }),
    [],
  );

  const { visitedIds } = useUserPassport();
  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport,
    onError: (err) => {
      console.error("[AIAssistant] Chat error:", err);
    },
  });
  const isThinking = status === "streaming" || status === "submitted";

  const appendMockResponse = useCallback(() => {
    setMessages((current) => {
      const lastMessage = current[current.length - 1];
      if (lastMessage?.role === "assistant") return current;

      return [
        ...current,
        {
          id: `mock-${Date.now()}`,
          role: "assistant",
          parts: [
            {
              type: "text",
              text: "Namaste! I am your Himalayan Concierge. My connection to the peaks is being restored, but I am here to help you explore Nepal.",
            },
          ],
        } as UIMessage,
      ];
    });
  }, [setMessages]);

  const handleSend = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isThinking) return;

      console.log("Agent Ready", { action: "send", text: trimmed });
      setInput("");

      const destination = findDestinationByText(trimmed);
      if (destination) {
        dispatchMapFly(destination);
        dispatchHeroImage(destination);
      }

      try {
        await Promise.resolve(sendMessage({ text: trimmed }));
      } catch (err) {
        console.error("[AIAssistant] sendMessage failed:", err);
        appendMockResponse();
      }
    },
    [appendMockResponse, isThinking, sendMessage],
  );

  const lastUserText = useMemo(() => {
    const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");
    if (!lastUserMessage) return "";
    return lastUserMessage.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join(" ")
      .trim();
  }, [messages]);

  useEffect(() => {
    const handler = (e: Event) => {
      const { message } = (e as CustomEvent<{ message: string }>).detail;
      console.log("Agent Ready", { event: "ai-assistant-open", message });
      setOpen(true);
      void handleSend(message);
    };
    window.addEventListener("ai-assistant-open", handler);
    return () => window.removeEventListener("ai-assistant-open", handler);
  }, [handleSend]);

  useEffect(() => {
    if (shouldSuggestNext(lastUserText)) {
      const nextDestination = findNearestUnvisited(visitedIds);
      if (nextDestination) {
        setPassportSuggestion(
          `Based on your My Collection progress, the nearest unvisited landmark is ${nextDestination.name}. I recommend exploring it next — it fits beautifully with your journey.`
        );
        dispatchMapFly(nextDestination);
        dispatchHeroImage(nextDestination);
      } else {
        setPassportSuggestion(
          "You have visited every landmark in My Collection — congratulations! Let me help you choose an epic new route next."
        );
      }
    } else {
      setPassportSuggestion(null);
    }
  }, [lastUserText, visitedIds]);

  useEffect(() => {
    const assistantMessage = [...messages].reverse().find((message) => message.role === "assistant");
    if (!assistantMessage || assistantMessage.id === lastAssistantId.current) return;
    lastAssistantId.current = assistantMessage.id;

    const combinedText = assistantMessage.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join(" ");

    const destination = findDestinationByText(combinedText);
    if (destination) {
      dispatchMapFly(destination);
      dispatchHeroImage(destination);
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Trigger success glow for new AI messages
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "assistant" && lastMessage.id !== lastAssistantId.current) {
      setGlowingMessageId(lastMessage.id);
      const timer = setTimeout(() => setGlowingMessageId(null), 2000); // Glow for 2 seconds
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const submit = () => {
    const text = input.trim();
    if (!text || isThinking) return;
    void handleSend(text);
  };

  return (
    <>
      {/* ── Floating trigger button ─────────────────────────────── */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI Assistant" : "Open AI Assistant"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.15 }}
        style={{
          boxShadow: open
            ? "0 0 0 1px rgba(255,255,255,0.08), 0 8px 32px -8px rgba(0,0,0,0.6)"
            : "0 0 0 1px rgba(255,255,255,0.08), 0 8px 32px -8px rgba(245,158,11,0.25), 0 4px 16px -4px rgba(0,0,0,0.5)",
        }}
        className={`
          fixed bottom-6 right-6 z-50
          flex items-center gap-2.5 px-4 py-3 rounded-full
          bg-zinc-950/80 backdrop-blur-2xl
          border border-white/[0.12]
          transition-colors duration-200 cursor-pointer
          ${open ? "text-white/70 hover:text-white" : "text-white hover:border-white/20"}
        `}
      >
        <motion.span
          animate={{ rotate: open ? 90 : 0, opacity: open ? 0.55 : 1 }}
          transition={{ duration: 0.2 }}
          className="text-xl"
          aria-hidden
        >
          {open ? "✕" : "✨"}
        </motion.span>
        <span className="text-sm font-semibold hidden sm:inline select-none tracking-tight">
          {open ? "Close" : "Himalayan Concierge"}
        </span>
      </motion.button>

      {/* ── Chat panel ─────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="ai-panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="
              fixed bottom-20 right-6 z-50
              w-[92vw] sm:w-[400px] max-h-[75vh]
              flex flex-col rounded-3xl overflow-hidden
              origin-bottom-right
              bg-zinc-950/80 backdrop-blur-2xl
              border border-white/[0.10]
              shadow-[0_20px_50px_rgba(0,0,0,0.45)]
            "
          >
            {/* Noise texture overlay */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 rounded-2xl opacity-[0.035] mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundRepeat: "repeat",
                backgroundSize: "128px 128px",
              }}
            />

            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.08] bg-white/[0.03] flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center flex-shrink-0">
                <span className="text-base animate-spin" style={{ animationDuration: '10s' }} aria-hidden>✨</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white font-semibold text-sm leading-none tracking-tight">Himalayan Concierge</p>
                  <span className={`inline-flex items-center gap-1 rounded-full border border-amber-500/25 bg-amber-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-200 ${isThinking ? 'animate-pulse' : ''}`}>
                    <span className="block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    live
                  </span>
                </div>
                <p className="text-amber-400/70 text-[11px] mt-0.5 font-medium tracking-tight">Your sophisticated cultural guide through Nepal.</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-white/25 hover:text-white/60 text-sm leading-none transition-colors cursor-pointer flex-shrink-0 p-1.5 rounded-lg hover:bg-white/[0.06]"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
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
                  <p className="text-white/80 text-sm font-semibold tracking-tight">Namaste, traveler. I am your Himalayan Concierge.</p>
                  <p className="text-zinc-500 text-xs mt-1 leading-relaxed">
                    I&apos;m your sophisticated cultural guide through Nepal — ask me about temples, treks, traditions, and hidden mountain routes.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    {QUICK_PROMPTS.map((prompt, i) => (
                      <motion.button
                        key={prompt}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 * i, duration: 0.25, ease: "easeOut" }}
                        onClick={() => { setInput(""); sendMessage({ text: prompt }); }}
                        className="
                          block w-full text-left text-xs
                          bg-white/[0.04] hover:bg-white/[0.08]
                          border border-white/[0.08] hover:border-white/[0.14]
                          text-zinc-400 hover:text-white/80
                          px-4 py-2.5 rounded-xl
                          transition-all duration-200 cursor-pointer tracking-tight
                          hover:scale-105 hover:brightness-110
                        "
                      >
                        {prompt}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

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
                        <div
                          className={`
                            max-w-[85%] px-4 py-2.5 rounded-2xl text-sm font-bold leading-relaxed whitespace-pre-wrap tracking-tight
                            ${isUser
                              ? "bg-amber-500/15 border border-amber-500/30 text-white rounded-br-sm"
                              : `bg-zinc-900/60 backdrop-blur-xl text-zinc-300 font-light font-geist-sans tracking-wide rounded-bl-sm ${
                                  glowingMessageId === m.id ? 'border-2 border-amber-400 shadow-lg shadow-amber-400/50 animate-pulse' : ''
                                }`
                            }
                          `}
                        >
                          {isUser ? part.text : <TypewriterText text={part.text} />}
                        </div>
                      </motion.div>
                    );
                  }

                  if (
                    part.type === "tool-buildItinerary" &&
                    part.state === "output-available"
                  ) {
                    const { tripTitle, totalDays, events } = part.output as {
                      tripTitle: string;
                      totalDays: number;
                      events: ItineraryEvent[];
                    };
                    segments.push(
                      <Timeline
                        key={`${m.id}-timeline-${segments.length}`}
                        tripTitle={tripTitle}
                        totalDays={totalDays}
                        initialEvents={events}
                      />
                    );
                  }
                }

                if (segments.length === 0) return null;
                return <div key={m.id} className="space-y-2">{segments}</div>;
              })}

              {passportSuggestion && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="flex justify-start"
                >
                  <div className="max-w-[85%] px-4 py-2.5 rounded-2xl bg-zinc-900/60 backdrop-blur-xl text-zinc-300 font-light font-geist-sans tracking-wide text-sm leading-relaxed">
                    <span className="block text-amber-200 text-xs uppercase tracking-[0.3em] mb-2">My Collection sync</span>
                    <p>{passportSuggestion}</p>
                  </div>
                </motion.div>
              )}

              {error && (
                <div className="max-w-[85%] px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-amber-500/80 italic font-serif text-xs tracking-tight flex items-center gap-2">
                  <Wifi className="w-3 h-3 animate-pulse" />
                  The mountain winds are heavy—trying to reconnect...
                </div>
              )}

              {/* Skeleton loader */}
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="flex justify-start"
                >
                  <div className="bg-zinc-900/60 backdrop-blur-xl rounded-2xl rounded-bl-sm px-4 py-3 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-4 bg-amber-500/20 rounded animate-pulse" />
                      <div className="w-6 h-4 bg-amber-500/15 rounded animate-pulse" />
                      <div className="w-10 h-4 bg-amber-500/25 rounded animate-pulse" />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div className="p-3 border-t border-white/[0.08] bg-white/[0.02] flex gap-2 flex-shrink-0">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
                placeholder="Ask about Nepal travel…"
                disabled={isThinking}
                className={`
                  flex-1 text-sm px-4 py-2.5 rounded-xl
                  bg-white/[0.06] border
                  text-white placeholder-zinc-600
                  focus:outline-none focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/30
                  disabled:opacity-40 transition-all tracking-tight
                  ${input.trim() ? 'border-amber-500/50 shadow-lg shadow-amber-500/20' : 'border-white/[0.10]'}
                `}
              />
              <motion.button
                onClick={submit}
                disabled={isThinking || !input.trim()}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="
                  bg-amber-500 hover:bg-amber-400 disabled:opacity-25 disabled:cursor-not-allowed
                  text-[#09090b] text-sm font-bold
                  px-4 py-2.5 rounded-xl
                  transition-colors duration-150 cursor-pointer
                  shadow-[0_4px_16px_-4px_rgba(245,158,11,0.4)]
                "
              >
                ↑
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
