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
        'blue-1': '#007CBF',
        'blue-2': "#CCE5F2",
        'blue-3': '#E6F2F9',
        'light-green': '#459C93',
        'light-red': '#E14B4B',
        'light-white': "#FFFFFF",
        'deep-black': '#17303E',
        'gray-1': '#6B818C',
        'gray-2': "#E0E7EB",
      },
      fontFamily: {
        "Inter": ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
