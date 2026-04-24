import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "City Explorer Nepal",
    short_name: "Nepal Explorer",
    description: "Explore Nepal's most breathtaking destinations — mountains, heritage, wildlife and more.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#b91c1c",
    orientation: "portrait-primary",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
    screenshots: [
      { src: "/icons/screenshot-wide.png", sizes: "1280x720", type: "image/png", form_factor: "wide" },
    ],
  };
}
