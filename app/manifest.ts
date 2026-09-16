import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GLOps Labs",
    short_name: "GLOps",
    description: "Webs profesionales listas en días a precio cerrado.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#F97316",
    icons: [
      { src: "/brand/glops/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/glops/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/brand/glops/apple-touch-icon.png", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  };
}
