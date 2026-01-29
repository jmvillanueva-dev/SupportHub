/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./src/presentation/**/*.{js,jsx}"],
  safelist: [
    // Colores de estado de tickets
    "bg-emerald-100",
    "text-emerald-700",
    "border-emerald-200",
    "bg-amber-100",
    "text-amber-700",
    "border-amber-200",
    "bg-slate-100",
    "text-slate-600",
    "text-slate-700",
    "border-slate-200",
    // Colores de prioridad
    "bg-blue-100",
    "text-blue-700",
    "border-blue-200",
    "bg-orange-100",
    "text-orange-700",
    "border-orange-200",
    "bg-red-100",
    "text-red-700",
    "border-red-200",
  ],
  theme: {
    extend: {
      colors: {
        // Colores corporativos TechCorp Inc.
        techcorp: {
          50: "#f0f4f8",
          100: "#d9e2ec",
          200: "#bcccdc",
          300: "#9fb3c8",
          400: "#829ab1",
          500: "#627d98",
          600: "#486581",
          700: "#334e68",
          800: "#243b53",
          900: "#102a43",
        },
        accent: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
      },
      fontFamily: {
        corporate: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
