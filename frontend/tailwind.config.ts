import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#faf5ff",
          500: "#8b5cf6",
          900: "#3b0764",
        },
      },
    },
  },
  plugins: [],
};

export default config;
