import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Latent — warm dark. Warm near-black canvas, cream text, a single
        // gold accent used sparingly for effort/activity/completion.
        ink: {
          DEFAULT: "#0A0A0B", // warm near-black canvas
          raised: "#161617", // cards / raised surfaces
          hi: "#1C1C1E", // hovered / higher surfaces
          line: "#242426", // hairline borders
        },
        paper: {
          DEFAULT: "#F5EFE1", // warm cream — primary text
          dim: "#8A857B", // warm gray — secondary text
          faint: "#5C564B", // faint — tertiary / captions
        },
        gold: {
          DEFAULT: "#F0C22B", // bright mustard — the accent
          deep: "#CE9E17",
          soft: "#F7D874",
          dim: "#574615", // muted mustard for filled heatmap cells
        },
        // Back-compat alias.
        haze: "#8A857B",
      },
      fontFamily: {
        // All-sans system — strong, geometric, Apple/Strava register.
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        // Size-specific tracking (§15): display text tightens as it grows.
        tightest: "-0.045em",
        display: "-0.035em",
        snug: "-0.02em",
      },
      transitionTimingFunction: {
        // Strong custom curves — built-in CSS easings are too weak (Emil K.)
        "out-strong": "cubic-bezier(0.23, 1, 0.32, 1)",
        "in-out-strong": "cubic-bezier(0.77, 0, 0.175, 1)",
      },
      maxWidth: {
        wrap: "1180px",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(240,194,43,0.5)" },
          "70%": { boxShadow: "0 0 0 6px rgba(240,194,43,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(240,194,43,0)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        float: "float 7s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
        "pulse-ring": "pulse-ring 2.4s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
