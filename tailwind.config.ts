import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FBF3F8",
        blush: "#F4D6E6",
        rose: "#E8799F",
        mint: "#C7E8D2",
        lav: "#CDB8E6",
      },
      fontFamily: {
        pixel: ['"DungGeunMo"', '"Galmuri11"', "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
