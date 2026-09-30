import { ImageResponse } from "next/og";
import { GRID_BY_TIER, terrainHeight } from "@/components/three/terrain-math";
import { profile } from "@/content/profile";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const bars = Array.from({ length: 24 }, (_, col) => terrainHeight(col, 6, GRID_BY_TIER.low, 0, 0.85));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#07070b",
          color: "#ededf3",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, color: "#9d92ff", letterSpacing: 2, textTransform: "uppercase" }}>
          {profile.role}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 112, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>{profile.name}</div>
          <div style={{ marginTop: 24, fontSize: 34, color: "#a3a3b5", maxWidth: 900 }}>{profile.headline}</div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 90 }}>
          {bars.map((h, i) => (
            <div
              key={i}
              style={{ width: 30, height: Math.round(h * 90), borderRadius: 4, background: i % 6 === 2 ? "#9d92ff" : "#26214a" }}
            />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
