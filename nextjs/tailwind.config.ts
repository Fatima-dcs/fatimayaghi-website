import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Outfit", "system-ui", "sans-serif"],
        body: ["Figtree", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [
    // ... other plugins
    require("tailwind-scrollbar")({ nocompatible: true }),
  ],
} satisfies Config;
