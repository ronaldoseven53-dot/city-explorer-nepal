"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Timeline, { type ItineraryEvent } from "./Timeline";

const QUICK_PROMPTS = [
  "Plan a 7-day Nepal itinerary",
  "Best trekking destinations?",
  "Where can I see wildlife?",
  "Budget travel tips for Nepal",
];

const panelVariants = {
  hidden:  { opacity: 0, scale: 0.94, y: 12 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: "spring" as const, stiffness: 380, damping: 30 },
  },
  exit: {
    opacity: 0, scale: 0.94, y: 12,
    transition: { duration: 0.18, ease: "easeIn" as const },
  },
};

const bubbleVariants = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" as const } },
};

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (err) => {
      console.error("[AIAssistant] Chat error:", err);
    },
  });
  const isThinking = status === "streaming" || status === "submitted";

  if (typeof window !== "undefined") {
    console.log("[AIAssistant] Status:", status, "Messages count:", messages.length, "Error:", error);
  }

  useEffect(() => {
    const handler = (e: Event) => {
      const { message } = (e as CustomEvent<{ message: string }>).detail;
      setOpen(true);
      sendMessage({ text: message });
    };
    window.addEventListener("ai-assistant-open", handler);
    return () => window.removeEventListener("ai-assistant-open", handler);
  }, [sendMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const submit = () => {
    const text = input.trim();
    if (!text || isThinking) return;
    setInput("");
    sendMessage({ text });
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
          bg-[#09090b]/90 backdrop-blur-xl
          border border-white/[0.10]
          transition-colors duration-200 cursor-pointer
          ${open ? "text-white/50 hover:text-white/80" : "text-white hover:border-white/20"}
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
          {open ? "Close" : "AI Assistant"}
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
            style={{
              boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 32px 64px -16px rgba(0,0,0,0.8), 0 8px 32px -8px rgba(245,158,11,0.08)",
            }}
            className="
              fixed bottom-20 right-6 z-50
              w-[92vw] sm:w-[400px] max-h-[75vh]
              flex flex-col rounded-2xl overflow-hidden
              bg-[#09090b]/85 backdrop-blur-2xl
              border border-white/[0.08]
              origin-bottom-right
            "
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.08] bg-white/[0.03] flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center flex-shrink-0">
                <span className="text-base" aria-hidden>✨</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-none tracking-tight">Nepal AI Assistant</p>
                <p className="text-amber-400/60 text-[11px] mt-0.5 font-medium">Expert Travel Agent · Gemini AI</p>
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
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
                    <span className="text-3xl" aria-hidden>🏔️</span>
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-semibold tracking-tight">Namaste!</p>
                    <p className="text-zinc-500 text-xs mt-1 leading-relaxed">
                      I&apos;m your expert Nepal travel agent.<br />Ask me anything about these destinations.
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
                        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`
                            max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap tracking-tight
                            ${isUser
                              ? "bg-amber-500/15 border border-amber-500/25 text-white rounded-br-sm"
                              : "bg-white/[0.06] border border-white/[0.10] text-zinc-300 rounded-bl-sm"
                            }
                          `}
                        >
                          {part.text}
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

              {/* Typing indicator */}
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/[0.06] border border-white/[0.10] rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-zinc-500 text-[10px] tracking-wide mr-1 font-medium">thinking</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60 animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60 animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60 animate-bounce [animation-delay:300ms]" />
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
                className="
                  flex-1 text-sm px-4 py-2.5 rounded-xl
                  bg-white/[0.06] border border-white/[0.10]
                  text-white placeholder-zinc-600
                  focus:outline-none focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/30
                  disabled:opacity-40 transition-all tracking-tight
                "
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
