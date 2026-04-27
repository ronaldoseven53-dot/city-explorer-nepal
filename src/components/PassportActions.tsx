"use client";

import { useTransition } from "react";
import { motion } from "motion/react";
import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Props { userId: string; destinationId: string; saved: boolean; }

export default function PassportActions({ userId, destinationId, saved }: Props) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const toggle = () => startTransition(async () => {
    const supabase = createClient();
    if (saved) {
      await supabase.from("favorites").delete()
        .eq("user_id", userId).eq("destination_id", destinationId);
    } else {
      await supabase.from("favorites").insert({ user_id: userId, destination_id: destinationId });
    }
    router.refresh();
  });

  return (
    <motion.button
      onClick={toggle}
      disabled={pending}
      whileTap={{ scale: 1.25, rotate: 12 }}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 500, damping: 15 }}
      title={saved ? "Remove from My Collection" : "Save to My Collection"}
      className="absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-opacity disabled:opacity-50 cursor-pointer"
      style={{
        background: saved ? "rgba(251,191,36,0.25)" : "rgba(255,255,255,0.15)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: saved ? "1px solid rgba(251,191,36,0.40)" : "1px solid rgba(255,255,255,0.25)",
        boxShadow: saved ? "0 0 8px rgba(251,191,36,0.5)" : undefined,
      }}
    >
      <Star
        size={15}
        className={saved ? "fill-amber-400 text-amber-400" : "text-white/70"}
      />
    </motion.button>
  );
}
