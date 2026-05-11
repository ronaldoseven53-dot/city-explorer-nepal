"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

// ── Response formatter ────────────────────────────────────────────

function getLineEmoji(line: string): string {
  const l = line.toLowerCase();
  if (/trek|hike|walk|trail/.test(l))           return "🥾";
  if (/flight|fly|airport/.test(l))             return "✈️";
  if (/bus|drive|road|jeep/.test(l))            return "🚌";
  if (/temple|stupa|shrine|mandir/.test(l))     return "🛕";
  if (/lake|river|pond/.test(l))                return "🏞️";
  if (/wildlife|rhino|tiger|elephant/.test(l))  return "🐘";
  if (/food|eat|restaurant|cuisine/.test(l))    return "🍜";
  if (/hotel|lodge|stay|accomm/.test(l))        return "🏨";
  if (/view|sunrise|sunset|panorama/.test(l))   return "🌄";
  if (/museum|heritage|culture/.test(l))        return "🏛️";
  if (/market|shop|bazar/.test(l))              return "🛍️";
  if (/meditation|yoga|spiritual/.test(l))      return "🧘";
  if (/camera|photo|photograph/.test(l))        return "📸";
  return "📍";
}

function renderInline(text: string): React.ReactNode[] {
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

        if (/^day\s+\d+/i.test(trimmed)) {
          return (
            <div key={i} className="flex items-center gap-2 mt-4 mb-1">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-600/80 flex items-center justify-center text-white font-bold text-xs">
                {trimmed.match(/\d+/)?.[0]}
              </span>
              <span className="font-bold text-white text-base">
                {trimmed.replace(/^day\s+\d+[:\s—–-]*/i, "")}
              </span>
            </div>
          );
        }

        if (/^#{1,3}\s/.test(trimmed)) {
          return (
            <p key={i} className="font-bold text-white/90 text-base mt-3">
              {renderInline(trimmed.replace(/^#{1,3}\s/, ""))}
            </p>
          );
        }

        if (/^[-•*]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed)) {
          const content = trimmed.replace(/^[-•*\d.]\s*/, "");
          return (
            <div key={i} className="flex items-start gap-2 pl-1">
              <span className="flex-shrink-0 text-base leading-5">{getLineEmoji(content)}</span>
              <span className="text-white/80">{renderInline(content)}</span>
            </div>
          );
        }

        return <p key={i} className="text-white/80">{renderInline(trimmed)}</p>;
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────

const SUGGESTIONS = [
  "Plan a 7-day Nepal trip for first-timers",
  "Best trekking for beginners in Nepal",
  "Top wildlife experiences in Chitwan",
  "Hidden gems off the beaten path",
];

export default function AIPlanner() {
  const [open, setOpen]   = useState(false);
  const [input, setInput] = useState("");
  const bottomRef         = useRef<HTMLDivElement>(null);
  const inputRef          = useRef<HTMLInputElement>(null);
  const autoPromptRef     = useRef<string | null>(null);

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Open via custom event — reads optional { prompt } payload
  useEffect(() => {
    const handler = (e: Event) => {
      const prompt = (e as CustomEvent<{ prompt?: string }>).detail?.prompt;
      if (prompt) autoPromptRef.current = prompt;
      setOpen(true);
    };
    document.addEventListener("open-ai-planner", handler);
    return () => document.removeEventListener("open-ai-planner", handler);
  }, []);

  // Auto-send injected prompt after panel opens
  useEffect(() => {
    if (!open || !autoPromptRef.current) return;
    const p = autoPromptRef.current;
    autoPromptRef.current = null;
    const t = setTimeout(() => sendMessage({ text: p }), 380);
    return () => clearTimeout(t);
  }, [open, sendMessage]);

  // Focus input on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  // Escape key to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const submit = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    sendMessage({ text });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="planner-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[60] bg-black/55 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />

          {/* ── Modal ── */}
          <motion.div
            key="planner-modal"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 420, damping: 28, mass: 0.8 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-[440px] max-h-[82vh] flex flex-col rounded-3xl overflow-hidden pointer-events-auto"
              style={{
                background:          "rgba(8,14,36,0.82)",
                backdropFilter:      "blur(28px)",
                WebkitBackdropFilter:"blur(28px)",
                border:              "1px solid rgba(255,255,255,0.10)",
                boxShadow:           "0 32px 80px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.07)",
              }}
            >
              {/* ── Header ── */}
              <div
                className="flex items-center justify-between px-5 py-4 flex-shrink-0"
                style={{
                  background:   "rgba(220,38,38,0.10)",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar with pulsing glow while streaming */}
                  <motion.div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #dc2626, #be123c)" }}
                    animate={isLoading ? {
                      boxShadow: [
                        "0 0 0px rgba(220,38,38,0.9), 0 0 8px rgba(220,38,38,0.5)",
                        "0 0 14px rgba(220,38,38,0.9), 0 0 32px rgba(220,38,38,0.45)",
                        "0 0 0px rgba(220,38,38,0.9), 0 0 8px rgba(220,38,38,0.5)",
                      ],
                    } : {
                      boxShadow: "0 0 14px rgba(220,38,38,0.40)",
                    }}
                    transition={isLoading
                      ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
                      : { duration: 0.4 }
                    }
                  >
                    🏔️
                  </motion.div>

                  <div>
                    <p className="text-white font-bold text-sm leading-none tracking-tight">
                      Himalaya AI
                    </p>
                    <p className="text-white/40 text-[11px] mt-0.5 font-medium">
                      {isLoading ? "Thinking…" : "Expert Nepal Guide · Powered by Gemini"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {messages.length > 0 && (
                    <button
                      onClick={() => setMessages([])}
                      className="text-[11px] text-white/35 hover:text-white/70 bg-white/[0.05] hover:bg-white/[0.10] px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="flex items-center justify-center w-8 h-8 rounded-full text-white/35 hover:text-white hover:bg-white/[0.10] transition-all duration-200 cursor-pointer"
                  >
                    <X size={16} strokeWidth={2} />
                  </button>
                </div>
              </div>

              {/* ── Messages ── */}
              <div
                className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0"
                style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent" }}
              >
                {/* Empty state — suggestions */}
                {messages.length === 0 && (
                  <div className="py-2">
                    <p className="text-white/30 text-[10px] text-center mb-3 uppercase tracking-[0.25em] font-semibold">
                      Suggestions
                    </p>
                    <div className="flex flex-col gap-2">
                      {SUGGESTIONS.map((s, i) => (
                        <motion.button
                          key={s}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06, duration: 0.22 }}
                          onClick={() => sendMessage({ text: s })}
                          whileHover={{ y: -2, boxShadow: "0 0 18px rgba(220,38,38,0.22)" }}
                          whileTap={{ scale: 0.98 }}
                          className="text-left text-xs text-white/65 hover:text-white/90 cursor-pointer transition-colors duration-150"
                          style={{
                            background:   "rgba(255,255,255,0.05)",
                            border:       "1px solid rgba(255,255,255,0.09)",
                            borderRadius: "14px",
                            padding:      "11px 16px",
                          }}
                        >
                          {s}
                        </motion.button>
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
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {m.role === "assistant" && (
                        <motion.div
                          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm mt-0.5"
                          style={{ background: "linear-gradient(135deg, #dc2626, #be123c)" }}
                          animate={isLoading ? {
                            boxShadow: [
                              "0 0 0px rgba(220,38,38,0.9)",
                              "0 0 10px rgba(220,38,38,0.8), 0 0 22px rgba(220,38,38,0.4)",
                              "0 0 0px rgba(220,38,38,0.9)",
                            ],
                          } : { boxShadow: "0 0 8px rgba(220,38,38,0.35)" }}
                          transition={isLoading
                            ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
                            : { duration: 0.4 }
                          }
                        >
                          🏔️
                        </motion.div>
                      )}
                      <div
                        className={`max-w-[88%] px-4 py-3 rounded-2xl text-sm backdrop-blur-sm ${
                          m.role === "user" ? "rounded-br-sm" : "rounded-bl-sm"
                        }`}
                        style={
                          m.role === "user"
                            ? { background: "rgba(220,38,38,0.75)", border: "1px solid rgba(220,38,38,0.35)", color: "#fff" }
                            : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }
                        }
                      >
                        {m.role === "user"
                          ? <p className="text-white">{text}</p>
                          : <FormattedMessage text={text} />
                        }
                      </div>
                    </motion.div>
                  );
                })}

                {/* Thinking indicator */}
                {isLoading && (
                  <div className="flex gap-2.5 justify-start">
                    <motion.div
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm"
                      style={{ background: "linear-gradient(135deg, #dc2626, #be123c)" }}
                      animate={{
                        boxShadow: [
                          "0 0 0px rgba(220,38,38,0.9)",
                          "0 0 12px rgba(220,38,38,0.9), 0 0 28px rgba(220,38,38,0.45)",
                          "0 0 0px rgba(220,38,38,0.9)",
                        ],
                      }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      🏔️
                    </motion.div>
                    <div
                      className="rounded-2xl rounded-bl-sm px-5 py-3.5"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
                    >
                      <div className="flex gap-1.5 items-center">
                        <span className="text-white/40 text-xs mr-1">Thinking</span>
                        {[0, 150, 300].map((delay) => (
                          <span
                            key={delay}
                            style={{ animationDelay: `${delay}ms` }}
                            className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* ── Input area ── */}
              <div
                className="px-4 pb-4 pt-3 flex-shrink-0"
                style={{ borderTop: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.25)" }}
              >
                <div className="flex gap-2 items-end">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
                    placeholder="Ask about Nepal travel…"
                    disabled={isLoading}
                    className="flex-1 text-white placeholder-white/25 text-sm outline-none disabled:opacity-40 transition-all duration-200"
                    style={{
                      background:   "rgba(255,255,255,0.06)",
                      border:       "1px solid rgba(255,255,255,0.14)",
                      borderRadius: "16px",
                      padding:      "11px 16px",
                      boxShadow:    "inset 0 2px 6px rgba(0,0,0,0.25)",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(220,38,38,0.55)"; }}
                    onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; }}
                  />
                  <motion.button
                    onClick={submit}
                    disabled={isLoading || !input.trim()}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{
                      background: "linear-gradient(135deg, #dc2626, #be123c)",
                      boxShadow:  "0 0 18px rgba(220,38,38,0.50), 0 4px 12px rgba(0,0,0,0.35)",
                    }}
                  >
                    <span className="text-white font-bold text-base leading-none">↑</span>
                  </motion.button>
                </div>
                <p className="text-white/18 text-[10px] text-center mt-2 tracking-wide">
                  Enter to send · Grounded in Nepal destinations
                </p>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
