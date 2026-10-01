import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const [photo, serif] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/portrait/hero.png")),
    readFile(join(process.cwd(), "src/fonts/instrument-serif-latin-400-normal.woff")),
  ]);
  const src = `data:image/png;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#f6f4ef", color: "#181612" }}>
        <div style={{ position: "absolute", right: -80, top: -120, width: 620, height: 620, borderRadius: 9999, background: "#f8dcc8", filter: "blur(60px)", display: "flex" }} />
        <div style={{ position: "absolute", right: 120, top: 180, width: 520, height: 520, borderRadius: 9999, background: "#dcd6fa", filter: "blur(70px)", display: "flex" }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px", width: 760 }}>
          <div style={{ display: "flex", fontSize: 22, color: "#5145cd", letterSpacing: 3, textTransform: "uppercase", fontWeight: 600 }}>
            {profile.role}
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 18, fontFamily: "Instrument Serif", fontSize: 128, lineHeight: 0.92 }}>
            <span>{profile.firstName}</span>
            <span style={{ color: "#5145cd" }}>Karayat</span>
          </div>
          <div style={{ marginTop: 30, fontSize: 28, color: "#57534c", lineHeight: 1.35 }}>{profile.headline}</div>
        </div>
        <img src={src} alt="" height={600} width={200} style={{ position: "absolute", right: 150, bottom: 0, objectFit: "contain" }} />
      </div>
    ),
    { ...size, fonts: [{ name: "Instrument Serif", data: serif, style: "normal", weight: 400 }] },
  );
}
