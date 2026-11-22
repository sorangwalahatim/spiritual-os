/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        canvas: {
          50: "#FAFAF9",
          100: "#F5F5F4",
          200: "#E7E5E4",
          300: "#D6D3D1",
        },
        brand: {
          50: "#FDF8F0",
          100: "#FBF0DF",
          200: "#F6E0BF",
          300: "#F0CA94",
          400: "#E49E4A",
          500: "#D37D1A",
          600: "#B86312",
          700: "#924810",
          800: "#763A14",
          900: "#603013",
        },
        spiritual: {
          indigo: "#1E1B4B",
          gold: "#D4AF37",
          sandalwood: "#C29B38",
          sage: "#4A6B5D",
          ruby: "#881337",
          slate: "#0F172A",
        }
      },
    },
  },
  plugins: [],
};
