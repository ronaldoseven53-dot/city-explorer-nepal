"use client";

import { useEffect, useState, useTransition } from "react";
import { motion } from "motion/react";
import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function FavoriteButton({ destinationId }: { destinationId: string }) {
  const [saved, setSaved]   = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [pending, start]    = useTransition();
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);
      supabase.from("favorites").select("id")
        .eq("user_id", user.id).eq("destination_id", destinationId).maybeSingle()
        .then(({ data }) => setSaved(!!data));
    });
  }, [destinationId]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => {
    if (!userId) { router.push("/auth/login"); return; }
    start(async () => {
      const supabase = createClient();
      if (saved) {
        await supabase.from("favorites").delete()
          .eq("user_id", userId).eq("destination_id", destinationId);
        setSaved(false);
      } else {
        await supabase.from("favorites").insert({ user_id: userId, destination_id: destinationId });
        setSaved(true);
      }
    });
  };

  return (
    <motion.button
      onClick={toggle}
      disabled={pending}
      whileTap={{ scale: 1.2, rotate: 10 }}
      whileHover={{
        boxShadow: saved
          ? "0 0 12px rgba(251,191,36,0.6)"
          : "0 0 10px rgba(255,255,255,0.15)",
      }}
      transition={{ type: "spring", stiffness: 500, damping: 15 }}
      title={saved ? "Remove from My Collection" : "Add to My Collection"}
      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer disabled:opacity-50"
      style={{
        background: saved ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.08)",
        border: saved ? "1px solid rgba(251,191,36,0.35)" : "1px solid rgba(255,255,255,0.15)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <Star
        size={13}
        className={`transition-colors duration-200 ${
          saved ? "fill-amber-400 text-amber-400" : "text-zinc-400"
        }`}
      />
      <span className={saved ? "text-amber-300" : "text-zinc-400"}>
        {saved ? "Saved" : "Save"}
      </span>
    </motion.button>
  );
}
