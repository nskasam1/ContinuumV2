import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        border: "var(--border)",
        accent: "var(--accent)",
        "accent-dim": "var(--accent-dim)",
        amber: "var(--amber)",
        "amber-bg": "var(--amber-bg)",
        red: "var(--red)",
        "red-bg": "var(--red-bg)",
        "src-epic": "var(--src-epic)",
        "src-rx": "var(--src-rx)",
        "src-cerner": "var(--src-cerner)",
        "src-quest": "var(--src-quest)",
        "src-er": "var(--src-er)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
