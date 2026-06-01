import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0d2238",
        stone: "#e7eff8",
        brass: "#4c80bb",
        ember: "#a44d36",
        moss: "#2f5f93",
        cloud: "#eff5fb",
        line: "#c4d2e1",
      },
      boxShadow: {
        panel: "0 14px 34px rgba(13, 34, 56, 0.10)",
      },
      fontFamily: {
        display: ['"Iowan Old Style"', '"Palatino Linotype"', "serif"],
        body: ['"Avenir Next"', '"Segoe UI"', "sans-serif"],
      },
      backgroundImage: {
        halo:
          "linear-gradient(180deg, rgba(239, 245, 251, 0.98) 0%, rgba(231, 239, 248, 0.92) 46%, rgba(248, 251, 255, 1) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
