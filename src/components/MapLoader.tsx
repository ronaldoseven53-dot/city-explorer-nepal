"use client";

import dynamic from "next/dynamic";

const MapSection = dynamic(() => import("@/components/MapSection"), {
  ssr: false,
  loading: () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="h-[420px] sm:h-[500px] rounded-2xl bg-gray-100 animate-pulse" />
    </div>
  ),
});

export default function MapLoader() {
  return <MapSection />;
}
