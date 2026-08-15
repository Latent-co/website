import { ImageResponse } from "next/og";

// Favicon: the "L." wordmark mark on the warm near-black canvas.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0b",
          color: "#f5efe1",
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: -1,
        }}
      >
        <span>L</span>
        <span style={{ color: "#f0c22b" }}>.</span>
      </div>
    ),
    { ...size },
  );
}
