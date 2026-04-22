"use client";

import dynamic from "next/dynamic";
import type { Destination } from "@/data/destinations";

const SingleDestinationMap = dynamic(
  () => import("@/components/SingleDestinationMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-72 sm:h-96 rounded-2xl bg-gray-100 animate-pulse" />
    ),
  }
);

export default function SingleDestinationMapLoader({
  destination,
}: {
  destination: Destination;
}) {
  return <SingleDestinationMap destination={destination} />;
}
