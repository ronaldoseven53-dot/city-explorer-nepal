"use client";

interface Props {
  name: string;
  category: string;
}

export default function AIPlanButton({ name, category }: Props) {
  const handleClick = () => {
    window.dispatchEvent(
      new CustomEvent("ai-assistant-open", {
        detail: {
          message: `Plan a 2-day trip to ${name} focusing on ${category} activities.`,
        },
      })
    );
  };

  return (
    <button
      onClick={handleClick}
      className="
        group inline-flex items-center gap-3
        bg-gradient-to-r from-red-600 to-orange-500
        hover:from-red-500 hover:to-orange-400
        text-white font-bold text-base
        px-8 py-4 rounded-2xl
        shadow-[0_0_30px_rgba(239,68,68,0.35)]
        hover:shadow-[0_0_50px_rgba(239,68,68,0.55)]
        transition-all duration-300 cursor-pointer
        border border-white/10
      "
    >
      <span className="text-xl transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">
        ✨
      </span>
      Let AI Plan My Visit
      <span className="text-white/60 group-hover:text-white/90 transition-colors text-sm font-normal">
        →
      </span>
    </button>
  );
}
