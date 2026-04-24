"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import { useRef, useEffect, useState } from "react";

function getMessageText(msg: UIMessage): string {
  for (const part of msg.parts) {
    if (part.type === "text") return part.text;
  }
  return "";
}

export default function TravelChat() {
  const [open, setOpen]   = useState(false);
  const [input, setInput] = useState("");
  const bottomRef         = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const submit = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    sendMessage({ text });
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open Nepal Travel Assistant"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-semibold px-4 py-3 rounded-full shadow-lg transition-all duration-200 cursor-pointer"
      >
        <span className="text-lg">{open ? "✕" : "🗺️"}</span>
        <span className="text-sm hidden sm:inline">{open ? "Close" : "Travel Assistant"}</span>
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-[90vw] sm:w-[380px] max-h-[70vh] flex flex-col rounded-2xl shadow-2xl border border-gray-200 bg-white overflow-hidden">

          {/* Header */}
          <div className="bg-red-700 px-4 py-3 flex items-center gap-2 flex-shrink-0">
            <span className="text-xl">🏔️</span>
            <div>
              <p className="text-white font-bold text-sm leading-none">Nepal Travel Assistant</p>
              <p className="text-red-200 text-xs mt-0.5">Powered by Gemini AI</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 min-h-0">
            {messages.length === 0 && (
              <div className="text-center py-6">
                <p className="text-3xl mb-2">🇳🇵</p>
                <p className="text-gray-600 text-sm font-medium">Namaste! Ask me to plan your Nepal trip.</p>
                <div className="mt-4 space-y-2">
                  {[
                    "Plan a 7-day Nepal itinerary",
                    "Best places for trekking?",
                    "Where to see wildlife in Nepal?",
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => { setInput(""); sendMessage({ text: s }); }}
                      className="block w-full text-left text-xs bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-600 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m: UIMessage) => {
              const text = getMessageText(m);
              if (!text) return null;
              return (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-red-700 text-white rounded-br-sm"
                        : "bg-white border border-gray-200 text-gray-700 rounded-bl-sm shadow-sm"
                    }`}
                  >
                    {text}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 bg-white flex gap-2 flex-shrink-0">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about Nepal travel…"
              disabled={isLoading}
              className="flex-1 text-sm px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent disabled:opacity-50"
            />
            <button
              onClick={submit}
              disabled={isLoading || !input.trim()}
              className="bg-red-700 hover:bg-red-800 disabled:opacity-40 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
