"use client";

import { useEffect, useState, useTransition } from "react";
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
    <button
      onClick={toggle}
      disabled={pending}
      title={saved ? "Remove from My Passport" : "Save to My Passport"}
      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors cursor-pointer
        bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 disabled:opacity-50"
    >
      <span>{saved ? "❤️" : "🤍"}</span>
      <span>{saved ? "Saved" : "Save"}</span>
    </button>
  );
}
