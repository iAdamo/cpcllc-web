import { ImageResponse } from "next/og";

// Branded social-share card, generated at build/edge (no static asset needed).
// Next wires this into og:image + twitter:image for every page that doesn't
// override it.
export const alt = "Companies Center — find trusted local service providers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAVY = "#162660";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: NAVY,
          color: "#ffffff",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#ffffff",
              color: NAVY,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 800,
            }}
          >
            C
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>
            Companies Center
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5, maxWidth: 900 }}>
            Find trusted local service providers
          </div>
          <div style={{ fontSize: 30, color: "rgba(255,255,255,0.72)", maxWidth: 820 }}>
            Verified plumbers, electricians, cleaners, movers and more near you —
            compare reviews, ratings and locations.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            fontSize: 22,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          <span style={{ color: "#f5b301" }}>●</span>
          companiescenter.com
        </div>
      </div>
    ),
    { ...size },
  );
}
