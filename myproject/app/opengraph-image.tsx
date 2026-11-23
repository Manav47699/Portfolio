import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { site } from "@/content/site";

export const alt = `${site.name}: ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  const photo = await readFile(path.join(process.cwd(), "public/images/glowboxpic.jpg"));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#050506", color: "white", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 64, padding: "0 80px", width: "100%" }}>
          <div
            style={{
              display: "flex",
              width: 300,
              height: 300,
              borderRadius: 9999,
              border: "8px solid white",
              boxShadow: "0 0 60px 18px rgba(255,255,255,0.55)",
              overflow: "hidden",
            }}
          >
            <img src={src} width={300} height={300} style={{ objectFit: "cover", width: "100%", height: "100%" }} alt="" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ fontSize: 22, letterSpacing: 6, color: "#a1a1aa" }}>COMPUTER ENGINEER · DHARAN, NEPAL</div>
            <div style={{ fontSize: 76, fontWeight: 800, color: "#fcd34d", lineHeight: 1.05, marginTop: 14 }}>Manav Acharya</div>
            <div style={{ fontSize: 30, color: "#e4e4e7", marginTop: 18, lineHeight: 1.35 }}>{site.tagline}</div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12, marginTop: 28 }}>
              {site.awards.map((a) => (
                <div
                  key={a.event}
                  style={{
                    display: "flex",
                    fontSize: 22,
                    padding: "8px 18px",
                    whiteSpace: "nowrap",
                    borderRadius: 9999,
                    border: "2px solid rgba(252,211,77,0.5)",
                    color: "#fef3c7",
                  }}
                >
                  🏆 {a.place} · {a.event}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 16, background: "#16ff5c" }} />
      </div>
    ),
    size,
  );
}
