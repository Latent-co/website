import { ImageResponse } from "next/og";

// Apple touch icon (home-screen bookmark). Full-bleed opaque background so
// iOS's own corner rounding leaves no transparent slivers.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 112,
          fontWeight: 700,
          letterSpacing: -4,
        }}
      >
        <span>L</span>
        <span style={{ color: "#f0c22b" }}>.</span>
      </div>
    ),
    { ...size },
  );
}
