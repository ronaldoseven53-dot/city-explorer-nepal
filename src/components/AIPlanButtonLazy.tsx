"use client";

import dynamic from "next/dynamic";

// next/dynamic with ssr:false must live in a Client Component (Next.js 16 rule)
const AIPlanButton = dynamic(() => import("./AIPlanButton"), {
  ssr: false,
  loading: () => (
    <div className="inline-flex h-14 w-56 bg-white/10 rounded-2xl animate-pulse" />
  ),
});

export default function AIPlanButtonLazy(props: {
  name: string;
  category: string;
}) {
  return <AIPlanButton {...props} />;
}
