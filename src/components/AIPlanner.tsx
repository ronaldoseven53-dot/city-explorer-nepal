"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import { useState, useRef, useEffect } from "react";

// ── Response formatter ────────────────────────────────────────────

function getLineEmoji(line: string): string {
  const l = line.toLowerCase();
  if (/trek|hike|walk|trail/.test(l))    return "🥾";
  if (/flight|fly|airport/.test(l))      return "✈️";
  if (/bus|drive|road|jeep/.test(l))     return "🚌";
  if (/temple|stupa|shrine|mandir/.test(l)) return "🛕";
  if (/lake|river|pond/.test(l))         return "🏞️";
  if (/wildlife|rhino|tiger|elephant/.test(l)) return "🐘";
  if (/food|eat|restaurant|cuisine/.test(l))   return "🍜";
  if (/hotel|lodge|stay|accomm/.test(l)) return "🏨";
  if (/view|sunrise|sunset|panorama/.test(l))  return "🌄";
  if (/museum|heritage|culture/.test(l)) return "🏛️";
  if (/market|shop|bazar/.test(l))       return "🛍️";
  if (/meditation|yoga|spiritual/.test(l)) return "🧘";
  if (/camera|photo|photograph/.test(l)) return "📸";
  return "📍";
}

function renderInline(text: string): React.ReactNode[] {
  // Handle **bold** markers
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  );
}

function FormattedMessage({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1" />;

        // Day heading: "Day 1", "Day 1:", "Day 1 —"
        if (/^day\s+\d+/i.test(trimmed)) {
          return (
            <div key={i} className="flex items-center gap-2 mt-4 mb-1">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-500/80 flex items-center justify-center text-white font-bold text-xs">
                {trimmed.match(/\d+/)?.[0]}
              </span>
              <span className="font-bold text-white text-base">{trimmed.replace(/^day\s+\d+[:\s—–-]*/i, "")}</span>
            </div>
          );
        }

        // Markdown headings: ##, ###
        if (/^#{1,3}\s/.test(trimmed)) {
          const heading = trimmed.replace(/^#{1,3}\s/, "");
          return (
            <p key={i} className="font-bold text-white/90 text-base mt-3">
              {renderInline(heading)}
            </p>
          );
        }

        // Bullet / list item
        if (/^[-•*]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed)) {
          const content = trimmed.replace(/^[-•*\d.]\s*/, "");
          return (
            <div key={i} className="flex items-start gap-2 pl-1">
              <span className="flex-shrink-0 text-base leading-5">{getLineEmoji(content)}</span>
              <span className="text-white/80">{renderInline(content)}</span>
            </div>
          );
        }

        // Plain paragraph
        return (
          <p key={i} className="text-white/80">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────

export default function AIPlanner() {
  const [open, setOpen]   = useState(false);
  const [input, setInput] = useState("");
  const bottomRef         = useRef<HTMLDivElement>(null);
  const inputRef          = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const submit = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    sendMessage({ text });
  };

  const clearChat = () => setMessages([]);

  const SUGGESTIONS = [
    "Plan a 7-day Nepal trip for first-timers",
    "Best trekking destinations for beginners",
    "Top wildlife experiences in Nepal",
    "Hidden gems off the beaten path",
  ];

  return (
    <>
      {/* ── Floating trigger button ─────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open AI Trip Planner"
        className="fixed bottom-6 left-6 z-50 group flex items-center gap-2.5 px-5 py-3 rounded-full shadow-2xl cursor-pointer transition-all duration-300
          bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-600 hover:to-rose-500
          text-white font-semibold text-sm border border-white/20"
      >
        <span className="text-lg transition-transform duration-300 group-hover:rotate-12">
          {open ? "✕" : "✨"}
        </span>
        <span className="hidden sm:inline">{open ? "Close Planner" : "AI Trip Planner"}</span>
      </button>

      {/* ── Chat panel ──────────────────────────────────────── */}
      {open && (
        <div className="fixed bottom-20 left-6 z-50 w-[92vw] sm:w-[420px] max-h-[78vh] flex flex-col rounded-3xl overflow-hidden
          shadow-[0_25px_60px_rgba(0,0,0,0.5)]
          border border-white/15
          bg-gradient-to-b from-slate-900/95 to-slate-800/95
          backdrop-blur-xl">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0
            bg-gradient-to-r from-red-900/50 to-slate-900/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center shadow-lg">
                <span className="text-lg">🏔️</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-none">AI Trip Planner</p>
                <p className="text-white/40 text-xs mt-0.5">Powered by Gemini · Nepal destinations only</p>
              </div>
            </div>
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="text-xs text-white/40 hover:text-white/80 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full transition-all cursor-pointer"
              >
                Clear chat
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0
            scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">

            {/* Empty state */}
            {messages.length === 0 && (
              <div className="py-4">
                <p className="text-white/50 text-xs text-center mb-4 uppercase tracking-wider">Suggestions</p>
                <div className="grid grid-cols-1 gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => { sendMessage({ text: s }); }}
                      className="text-left text-xs text-white/70 hover:text-white bg-white/5 hover:bg-white/10
                        border border-white/10 hover:border-white/20
                        px-4 py-3 rounded-2xl transition-all duration-200 cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message bubbles */}
            {messages.map((m: UIMessage) => {
              const text = m.parts
                .filter((p) => p.type === "text")
                .map((p) => (p as { type: "text"; text: string }).text)
                .join("");
              if (!text) return null;

              return (
                <div key={m.id} className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center text-sm mt-0.5">
                      🏔️
                    </div>
                  )}

                  <div className={`max-w-[88%] px-4 py-3 rounded-2xl backdrop-blur-sm ${
                    m.role === "user"
                      ? "bg-red-700/80 border border-red-500/30 rounded-br-sm text-white text-sm"
                      : "bg-white/8 border border-white/10 rounded-bl-sm"
                  }`}>
                    {m.role === "user"
                      ? <p className="text-sm text-white">{text}</p>
                      : <FormattedMessage text={text} />
                    }
                  </div>
                </div>
              );
            })}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center text-sm">
                  🏔️
                </div>
                <div className="bg-white/8 border border-white/10 rounded-2xl rounded-bl-sm px-5 py-3.5">
                  <div className="flex gap-1.5 items-center">
                    <span className="text-white/50 text-xs mr-1">Thinking</span>
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        style={{ animationDelay: `${delay}ms` }}
                        className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="px-4 pb-4 pt-3 border-t border-white/10 flex-shrink-0 bg-slate-900/50 backdrop-blur-sm">
            <div className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
                  placeholder="Plan my Nepal trip…"
                  disabled={isLoading}
                  className="w-full bg-white/8 border border-white/15 hover:border-white/25 focus:border-red-500/60
                    text-white placeholder-white/30 text-sm
                    px-4 py-3 rounded-2xl outline-none transition-all duration-200
                    disabled:opacity-40"
                />
              </div>
              <button
                onClick={submit}
                disabled={isLoading || !input.trim()}
                className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center cursor-pointer
                  bg-gradient-to-br from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600
                  disabled:opacity-30 disabled:cursor-not-allowed
                  shadow-lg transition-all duration-200 active:scale-95"
              >
                <span className="text-white text-base">↑</span>
              </button>
            </div>
            <p className="text-white/20 text-[10px] text-center mt-2">
              Enter to send · Responses grounded in 17 Nepal destinations
            </p>
          </div>
        </div>
      )}
    </>
  );
}
