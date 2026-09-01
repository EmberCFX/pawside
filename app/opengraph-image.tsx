import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Pawside Pet Services — care for them, even when you can't be there";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social card, drawn with the brand colors sampled from the logo.
 *
 * Rendered at request time by next/og rather than shipped as a static PNG, so
 * copy changes never require re-exporting artwork. The heart arc is the logo's
 * motif reduced to a single line — the full lockup would be illegible at the
 * scale most social previews render.
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#011C35",
          backgroundImage:
            "radial-gradient(70% 60% at 12% 0%, rgba(54,206,193,0.22), transparent 70%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="66" viewBox="0 0 200 180" fill="none">
            <path
              d="M100 158C100 158 22 108 22 62C22 36 42 18 64 18C80 18 92 26 100 40C108 26 120 18 136 18C158 18 178 36 178 62C178 108 100 158 100 158Z"
              stroke="#36CEC1"
              strokeWidth="9"
              strokeLinecap="round"
            />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 46,
                fontWeight: 600,
                color: "#F4F7FA",
                letterSpacing: "-1.4px",
                lineHeight: 1,
              }}
            >
              pawside
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#36CEC1",
                letterSpacing: "6px",
                marginTop: 8,
              }}
            >
              PET SERVICES
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 600,
              color: "#FFFFFF",
              letterSpacing: "-2.6px",
              lineHeight: 1.04,
              maxWidth: 900,
            }}
          >
            Care for them, even when you can&apos;t be there.
          </div>
          <div style={{ fontSize: 28, color: "rgba(228,236,244,0.72)", marginTop: 28 }}>
            Dog walks · Pet sitting · Drop-in visits · Overnight care
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            color: "rgba(228,236,244,0.6)",
          }}
        >
          <div style={{ width: 40, height: 2, background: "#36CEC1" }} />
          Insured &amp; bonded · Photo updates every visit
        </div>
      </div>
    ),
    size,
  );
}
