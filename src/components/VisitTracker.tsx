"use client";

import { useEffect } from "react";
import { useUserPassport } from "@/context/UserPassportContext";

export default function VisitTracker({ id }: { id: string }) {
  const { markVisited } = useUserPassport();
  useEffect(() => {
    markVisited(id);
  }, [id, markVisited]);
  return null;
}
