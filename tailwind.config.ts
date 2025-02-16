import gluestackPlugin from "@gluestack-ui/nativewind-utils/tailwind-plugin";
import { colors } from "./constants/Color";

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: [
    "app/**/*.{tsx,jsx,ts,js}",
    "components/**/*.{tsx,jsx,ts,js}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  important: "html",

  theme: {
    screens: {
      base: "0",
      xs: "400px",
      sm: "480px",
      md: "768px",
      lg: "992px",
      xl: "1280px",
    },
    extend: {
      colors: colors,
      fontFamily: {
        heading: undefined,
        body: undefined,
        mono: undefined,
        roboto: ["Roboto", "sans-serif"],
      },
      fontWeight: {
        extrablack: "950",
      },
      fontSize: {
        "2xs": "10px",
      },
      boxShadow: {
        "hard-1": "-2px 2px 8px 0px rgba(38, 38, 38, 0.20)",
        "hard-2": "0px 3px 10px 0px rgba(38, 38, 38, 0.20)",
        "hard-3": "2px 2px 8px 0px rgba(38, 38, 38, 0.20)",
        "hard-4": "0px -3px 10px 0px rgba(38, 38, 38, 0.20)",
        "hard-5": "0px 2px 10px 0px rgba(38, 38, 38, 0.10)",
        "soft-1": "0px 0px 10px rgba(38, 38, 38, 0.1)",
        "soft-2": "0px 0px 20px rgba(38, 38, 38, 0.2)",
        "soft-3": "0px 0px 30px rgba(38, 38, 38, 0.1)",
        "soft-4": "0px 0px 40px rgba(38, 38, 38, 0.1)",
        top: "0 -10px 15px -3px rgba(0, 0, 0, 0.1), 0 -4px 6px -2px rgba(0, 0, 0, 0.05)",
        "top-right":
          "10px -10px 15px -3px rgba(0, 0, 0, 0.1), 4px -4px 6px -2px rgba(0, 0, 0, 0.05)",
        right:
          "10px 0 15px -3px rgba(0, 0, 0, 0.1), 4px 0 6px -2px rgba(0, 0, 0, 0.05)",
        "bottom-right":
          "10px 10px 15px -3px rgba(0, 0, 0, 0.1), 4px 4px 6px -2px rgba(0, 0, 0, 0.5)",
        bottom:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "bottom-left":
          "-10px 10px 15px -3px rgba(0, 0, 0, 0.1), -4px 4px 6px -2px rgba(0, 0, 0, 0.05)",
        left: "-10px 0 15px -3px rgba(0, 0, 0, 0.1), -4px 0 6px -2px rgba(0, 0, 0, 0.05)",
        "top-left":
          "-10px -10px 15px -3px rgba(0, 0, 0, 0.1), -4px -4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
    },
  },

  plugins: [gluestackPlugin],
};
