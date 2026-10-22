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
        background: "var(--background)",
        foreground: "var(--foreground)",
        india: {
          saffron: "#FF9933",
          white: "#FFFFFF",
          green: "#138808",
          blue: "#000080",
          navy: "#0A1128",
          charcoal: "#1C1C1E",
        },
      },
    },
  },
  plugins: [],
};
export default config;
