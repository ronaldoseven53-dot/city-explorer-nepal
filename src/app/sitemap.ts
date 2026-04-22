import type { MetadataRoute } from "next";
import { destinations } from "@/data/destinations";

const BASE = "https://city-explorer-nepal.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const destinationUrls = destinations.map((d) => ({
    url: `${BASE}/destinations/${d.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...destinationUrls,
  ];
}
