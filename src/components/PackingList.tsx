"use client";

import { useState, useRef } from "react";
import { motion } from "motion/react";

interface Props {
  destination: string;
  category: string;
  elevation?: string;
  lat: number;
  lng: number;
}

function formatLine(line: string): React.ReactNode {
  if (!line.trim()) return null;
  // Bold headings like **Clothing**
  if (/^\*\*.+\*\*$/.test(line.trim())) {
    return <p className="font-bold text-gray-900 mt-4 mb-1 text-sm">{line.trim().replace(/\*\*/g, "")}</p>;
  }
  // Bullet points
  if (/^[-•*]\s/.test(line.trim())) {
    return (
      <li className="flex items-start gap-2 text-sm text-gray-600 py-0.5">
        <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
        <span>{line.trim().replace(/^[-•*]\s/, "")}</span>
      </li>
    );
  }
  return <p className="text-sm text-gray-600">{line}</p>;
}

export default function PackingList({ destination, category, elevation, lat, lng }: Props) {
  const [open, setOpen]       = useState(false);
  const [text, setText]       = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef              = useRef<AbortController | null>(null);

  const generate = async () => {
    setOpen(true);
    setLoading(true);
    setText("");

    // Fetch current weather first
    let weather = "";
    try {
      const wr = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
      const wd = await wr.json();
      if (wd.temp) weather = `${wd.temp}°C, ${wd.description}`;
    } catch { /* weather optional */ }

    abortRef.current = new AbortController();
    const res = await fetch("/api/packing-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destination, category, elevation, weather }),
      signal: abortRef.current.signal,
    });

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    setLoading(false);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      setText((prev) => prev + decoder.decode(value, { stream: true }));
    }
  };

  const close = () => {
    abortRef.current?.abort();
    setOpen(false);
    setText("");
  };

  return (
    <>
      <motion.button
        onClick={generate}
        animate={{
          boxShadow: [
            "0 0 0 0px rgba(34,197,94,0.45), 0 2px 8px rgba(0,0,0,0.06)",
            "0 0 0 7px rgba(34,197,94,0), 0 2px 8px rgba(0,0,0,0.06)",
          ],
        }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl cursor-pointer transition-colors hover:bg-white"
        style={{
          background: "rgba(255,255,255,0.85)",
          border: "1.5px solid rgba(34,197,94,0.45)",
          color: "#16a34a",
        }}
      >
        <span>🎒</span> Smart Packing List
      </motion.button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-green-50">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎒</span>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Smart Packing List</p>
                  <p className="text-xs text-gray-500">{destination} · AI generated</p>
                </div>
              </div>
              <button onClick={close} className="text-gray-400 hover:text-gray-700 text-xl leading-none cursor-pointer">✕</button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {loading && (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  <span className="ml-1">Building your list…</span>
                </div>
              )}

              {text && (
                <ul className="space-y-0.5">
                  {text.split("\n").map((line, i) => (
                    <span key={i}>{formatLine(line)}</span>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 flex justify-between items-center">
              <p className="text-xs text-gray-400">Personalised using live weather + destination type</p>
              <button
                onClick={generate}
                className="text-xs text-green-600 hover:text-green-800 font-medium cursor-pointer"
              >
                Regenerate ↺
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
