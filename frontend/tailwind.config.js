/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },

  daisyui: {
    themes: [
      {
        favvid: {
          primary: "#3b82f6",      // blue-500
          secondary: "#6366f1",    // indigo-500
          accent: "#22c55e",
          neutral: "#1f2937",      // gray-800
          "base-100": "#111827",   // gray-900
          "base-200": "#0f172a",   // slate-900
          "base-300": "#020617",   // slate-950
          "base-content": "#e5e7eb",
        },
      },
    ],
  },

  plugins: [require("daisyui")],
}
