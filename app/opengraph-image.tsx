import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/content/site";
export const alt = "Hassan EL QADI — Finance × Software";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function Image() {
  const font = await readFile(
    join(process.cwd(), "app/fonts/aeonik-regular.ttf"),
  );
  return new ImageResponse(
    <div
      style={{
        background: "#101010",
        color: "#f3f3f3",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "70px",
        fontFamily: "Aeonik",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
        }}
      >
        <span>{site.fullName}</span>
        <span style={{ color: "#9c9c9c" }}>CASABLANCA, MOROCCO</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 92,
          fontSize: 88,
          letterSpacing: -4,
          lineHeight: 1.1,
        }}
      >
        <span>Finance meets code.</span>
        <span style={{ color: "#838383" }}>Ideas become systems.</span>
      </div>
      <div
        style={{
          display: "flex",
          marginTop: "auto",
          paddingTop: 25,
          borderTop: "1px solid #333",
          fontSize: 22,
          color: "#9c9c9c",
        }}
      >
        Quantitative research · Software engineering · elqadi.me
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: "Aeonik", data: font, weight: 400, style: "normal" }],
    },
  );
}
