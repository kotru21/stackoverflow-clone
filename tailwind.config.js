/***** Tailwind v4 compat config for Vite *****/
/**
 * If you prefer Tailwind v4 with @import "tailwindcss" only, you can skip this file.
 * Keeping it for editor tooling and potential v3-style content scanning.
 */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
