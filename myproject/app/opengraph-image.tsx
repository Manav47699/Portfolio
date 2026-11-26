import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { site } from "@/content/site";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  const photo = await readFile(path.join(process.cwd(), "public/images/glowboxpic.jpg"));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0a0a0b", color: "white", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 64, padding: "0 80px", width: "100%" }}>
          <div
            style={{
              display: "flex",
              width: 300,
              height: 300,
              borderRadius: 9999,
              border: "8px solid white",
              boxShadow: "0 0 48px 6px rgba(255,255,255,0.22)",
              overflow: "hidden",
            }}
          >
            <img src={src} width={300} height={300} style={{ objectFit: "cover", width: "100%", height: "100%" }} alt="" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ fontSize: 22, letterSpacing: 6, color: "#a1a1aa" }}>COMPUTER ENGINEER</div>
            <div style={{ fontSize: 76, fontWeight: 800, color: "#fcd34d", lineHeight: 1.05, marginTop: 14 }}>Manav Acharya</div>
            <div style={{ fontSize: 30, color: "#e4e4e7", marginTop: 18, lineHeight: 1.35 }}>{site.rotatingLines.join(" · ")}</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
