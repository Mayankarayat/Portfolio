import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} — Portfolio`,
    short_name: profile.name,
    description: profile.headline,
    start_url: "/",
    display: "standalone",
    background_color: "#f6f4ef",
    theme_color: "#f6f4ef",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
