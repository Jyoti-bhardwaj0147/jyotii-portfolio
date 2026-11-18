import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { ink: "#0B0D12", paper: "#F7F4EC", amber: "#E8B84B", mint: "#6FE3C4" }, fontFamily: { display: ["var(--font-space-grotesk)"], sans: ["var(--font-inter)"] } } },
  plugins: [],
};

export default config;