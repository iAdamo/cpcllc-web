import { ImageResponse } from "next/og";

// Branded social-share card, generated at build/edge (no static asset needed).
// Next wires this into og:image + twitter:image for every page that doesn't
// override it. Text only in characters the built-in font has: anything else
// (a "●") makes the build try to download a font, which fails offline and
// printed "Failed to load dynamic font" on every build. Shapes are drawn.
export const alt = "Companies Center — find local service providers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAVY = "#162660";
const GOLD = "#DEAE60";

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
            Find local service providers
          </div>
          <div style={{ fontSize: 30, color: "rgba(255,255,255,0.72)", maxWidth: 820 }}>
            Plumbers, electricians, cleaners, movers and more near you. Compare
            reviews, ratings and locations.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 22,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: 6, background: GOLD }} />
          companiescenter.com
        </div>
      </div>
    ),
    { ...size },
  );
}
