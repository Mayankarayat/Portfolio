import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  // The graded hero still, embedded at build time.
  const photo = await readFile(join(process.cwd(), "src/assets/story/bike.jpg"));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#07070b" }}>
        <img src={src} alt="" width={1200} height={675} style={{ position: "absolute", top: -22, left: 0, objectFit: "cover" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: "linear-gradient(90deg, rgba(7,7,11,0.96) 0%, rgba(7,7,11,0.75) 42%, rgba(7,7,11,0) 75%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 72, color: "#ededf3" }}>
          <div style={{ display: "flex", fontSize: 22, color: "#b8b0ff", letterSpacing: 2, textTransform: "uppercase" }}>
            {profile.role}
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 20, fontSize: 104, fontWeight: 700, letterSpacing: -4, lineHeight: 0.95 }}>
            <span>{profile.firstName}</span>
            <span style={{ color: "rgba(237,237,243,0.6)" }}>Karayat</span>
          </div>
          <div style={{ marginTop: 28, fontSize: 28, color: "#c9c9d6", maxWidth: 560 }}>{profile.headline}</div>
        </div>
      </div>
    ),
    size,
  );
}
