import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F1015',
        foreground: '#14151A',
        'defeat-red': '#930000',
        'death-red': '#B02836',
        'victory-blue': '#013F94',
      },
    },
  },
  plugins: [],
} satisfies Config;
