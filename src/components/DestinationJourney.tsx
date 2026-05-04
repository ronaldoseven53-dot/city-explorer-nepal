"use client";

import { Bus, Plane, Car, Footprints, Map } from "lucide-react";

type TransportMode = "bus" | "plane" | "car" | "walk";

interface JourneyStep {
  text: string;
  time: string | null;
  mode: TransportMode;
}

const TRANSPORT: Record<TransportMode, { Icon: React.ElementType; bg: string; border: string; color: string }> = {
  bus:   { Icon: Bus,        bg: "bg-blue-50",    border: "border-blue-100",    color: "text-blue-500"    },
  plane: { Icon: Plane,      bg: "bg-violet-50",  border: "border-violet-100",  color: "text-violet-500"  },
  car:   { Icon: Car,        bg: "bg-amber-50",   border: "border-amber-100",   color: "text-amber-500"   },
  walk:  { Icon: Footprints, bg: "bg-emerald-50", border: "border-emerald-100", color: "text-emerald-500" },
};

function detectMode(text: string): TransportMode {
  if (/fly|flight|airport/i.test(text)) return "plane";
  if (/jeep|car|drive|taxi/i.test(text)) return "car";
  if (/walk|hike|trek/i.test(text)) return "walk";
  return "bus";
}

function parseSteps(text: string): JourneyStep[] {
  const mainRoute = text.split(/\. Alternatively/i)[0];
  const rawSteps = mainRoute
    .split(/,?\s+then\s+/i)
    .map((s) => s.trim())
    .filter(Boolean);

  return rawSteps.map((raw) => {
    const timeMatch = raw.match(/\(([^)]*(?:hr|hrs|min|hour|hours|day|days|~)[^)]*)\)/i);
    const time = timeMatch ? timeMatch[1] : null;
    const clean = raw.replace(/\([^)]*\)/g, "").trim().replace(/\.$/, "").trim();
    return { text: clean, time, mode: detectMode(raw) };
  });
}

function EnhancedText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const regex = /\([^)]*(?:hr|hrs|min|hour|hours|day|days|~)[^)]*\)/gi;
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(<span key={key++}>{text.slice(last, m.index)}</span>);
    parts.push(
      <span key={key++} className="text-amber-600 font-semibold">{m[0]}</span>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(<span key={key++}>{text.slice(last)}</span>);
  return <>{parts}</>;
}

export default function DestinationJourney({ text }: { text: string }) {
  const steps = parseSteps(text);
  const alternativeText = text.includes("Alternatively")
    ? text.split(/\. Alternatively,?\s*/i)[1]?.replace(/\.$/, "") ?? null
    : null;

  const scrollToMap = () => {
    document.getElementById("location-map")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className="rounded-3xl p-6"
      style={{
        background: "rgba(255,255,255,0.60)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.20)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.90)",
      }}
    >
      {/* Timeline steps */}
      <div className="flex flex-col">
        {steps.map((step, i) => {
          const t = TRANSPORT[step.mode];
          const isLast = i === steps.length - 1;
          return (
            <div key={i} className="flex gap-4">
              {/* Icon + dashed connector */}
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-xl ${t.bg} border ${t.border} flex items-center justify-center flex-shrink-0`}>
                  <t.Icon className={`w-4 h-4 ${t.color}`} strokeWidth={1.75} />
                </div>
                {!isLast && (
                  <div className="w-px flex-1 my-1.5 border-l-2 border-dashed border-zinc-200" />
                )}
              </div>

              {/* Step text + time badge */}
              <div className="flex-1" style={{ paddingBottom: isLast ? 0 : "1.25rem" }}>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  <EnhancedText text={step.text} />
                </p>
                {step.time && (
                  <span className="inline-block mt-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80">
                    {step.time}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Alternative route */}
      {alternativeText && (
        <div className="mt-4 pt-4 border-t border-white/40">
          <p className="text-xs text-zinc-500 leading-relaxed">
            <span className="font-semibold text-zinc-600">Alternative: </span>
            <EnhancedText text={alternativeText} />
          </p>
        </div>
      )}

      {/* View on Map */}
      <button
        onClick={scrollToMap}
        className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
      >
        <Map className="w-4 h-4" strokeWidth={1.75} />
        View on Map
      </button>
    </div>
  );
}
