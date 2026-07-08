/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // BizLink-inspired monochrome + cream palette
        ink: "#1f1f1f", // near-black — primary text, dark surfaces, primary buttons
        cream: "#f6f7ed", // off-white — highlighted panels / hero background
        mist: "#f4f4f4", // light gray — secondary cards
        paper: "#ffffff", // white — sidebar, primary cards
        line: "#e6e6e1", // hairline borders
        muted: "#8a8a82", // secondary / helper text
      },
      fontFamily: {
        sans: [
          "General Sans",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      borderRadius: {
        card: "14px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(31,31,31,0.04), 0 1px 3px rgba(31,31,31,0.06)",
        pop: "0 8px 30px rgba(31,31,31,0.12)",
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
