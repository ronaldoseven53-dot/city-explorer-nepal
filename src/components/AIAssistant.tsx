"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import { useRef, useEffect, useState } from "react";
import Timeline, { type ItineraryEvent } from "./Timeline";


const QUICK_PROMPTS = [
  "Plan a 7-day Nepal itinerary",
  "Best trekking destinations?",
  "Where can I see wildlife?",
  "Budget travel tips for Nepal",
];

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const isThinking = status === "streaming" || status === "submitted";

  // Listen for programmatic open+send from other pages/components
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
      {/* ── Floating button ────────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI Assistant" : "Open AI Assistant"}
        className={`
          fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full
          shadow-2xl border backdrop-blur-xl transition-all duration-300 cursor-pointer
          ${open
            ? "bg-slate-900/90 border-white/20 text-white/50 hover:text-white/80"
            : "bg-slate-900/85 border-white/15 text-white hover:bg-slate-800/90 hover:border-white/30 hover:shadow-red-900/20"
          }
        `}
      >
        <span
          className={`text-xl transition-all duration-300 ${open ? "rotate-90 opacity-60" : "rotate-0 opacity-100"}`}
          aria-hidden
        >
          {open ? "✕" : "✨"}
        </span>
        <span className="text-sm font-semibold hidden sm:inline select-none">
          {open ? "Close" : "AI Assistant"}
        </span>
      </button>

      {/* ── Chat panel ─────────────────────────────────────────── */}
      <div
        className={`
          fixed bottom-20 right-6 z-50
          w-[92vw] sm:w-[400px] max-h-[75vh]
          flex flex-col rounded-2xl overflow-hidden
          bg-slate-950/80 backdrop-blur-2xl
          border border-white/10 shadow-2xl
          transition-all duration-300 origin-bottom-right
          ${open
            ? "opacity-100 scale-100 pointer-events-auto translate-y-0"
            : "opacity-0 scale-95 pointer-events-none translate-y-2"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-white/[0.04] flex-shrink-0">
          <span className="text-2xl" aria-hidden>✨</span>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm leading-none">Nepal AI Assistant</p>
            <p className="text-white/35 text-xs mt-0.5">Expert Travel Agent · Gemini AI</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="text-white/30 hover:text-white/70 text-base leading-none transition-colors cursor-pointer flex-shrink-0 p-1"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
          {messages.length === 0 && (
            <div className="text-center py-6 space-y-4">
              <p className="text-4xl" aria-hidden>🏔️</p>
              <div>
                <p className="text-white/75 text-sm font-semibold">Namaste!</p>
                <p className="text-white/40 text-xs mt-1 leading-relaxed">
                  I&apos;m your expert Nepal travel agent.<br />Ask me anything about these destinations.
                </p>
              </div>
              <div className="space-y-2">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => { setInput(""); sendMessage({ text: prompt }); }}
                    className="
                      block w-full text-left text-xs
                      bg-white/[0.06] hover:bg-white/[0.12]
                      border border-white/10 hover:border-white/20
                      text-white/60 hover:text-white/85
                      px-4 py-2.5 rounded-xl
                      transition-all duration-200 cursor-pointer
                    "
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m: UIMessage) => {
            const isUser = m.role === "user";

            // Collect all renderable segments: text bubbles + timeline widgets
            const segments: React.ReactNode[] = [];

            for (const part of m.parts) {
              if (part.type === "text" && part.text.trim()) {
                segments.push(
                  <div
                    key={`${m.id}-text-${segments.length}`}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`
                        max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                        ${isUser
                          ? "bg-red-600/65 backdrop-blur-sm border border-red-500/20 text-white rounded-br-sm shadow-lg"
                          : "bg-white/[0.08] backdrop-blur-sm border border-white/12 text-white/85 rounded-bl-sm"
                        }
                      `}
                    >
                      {part.text}
                    </div>
                  </div>
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
            <div className="flex justify-start">
              <div className="bg-white/[0.08] backdrop-blur-sm border border-white/12 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-white/30 text-[10px] tracking-wide mr-1 font-medium">thinking</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="p-3 border-t border-white/10 bg-white/[0.03] flex gap-2 flex-shrink-0">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
            placeholder="Ask about Nepal travel…"
            disabled={isThinking}
            className="
              flex-1 text-sm px-4 py-2.5 rounded-xl
              bg-white/[0.08] border border-white/12
              text-white placeholder-white/25
              focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-white/25
              disabled:opacity-40 transition-all
            "
          />
          <button
            onClick={submit}
            disabled={isThinking || !input.trim()}
            className="
              bg-red-600/70 hover:bg-red-600/90 disabled:opacity-25
              backdrop-blur-sm border border-red-500/20
              text-white text-sm font-semibold
              px-4 py-2.5 rounded-xl
              transition-all cursor-pointer
            "
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
