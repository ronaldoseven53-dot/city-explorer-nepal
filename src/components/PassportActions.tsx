"use client";

import { useTransition } from "react";
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
    <button
      onClick={toggle}
      disabled={pending}
      title={saved ? "Remove from Passport" : "Save to Passport"}
      className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow text-lg transition-transform hover:scale-110 disabled:opacity-50 cursor-pointer"
    >
      {saved ? "❤️" : "🤍"}
    </button>
  );
}
