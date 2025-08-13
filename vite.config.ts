import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import mkcert from "vite-plugin-mkcert";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    https: true,
    proxy: {
      "/api": {
        target: "https://codelang.vercel.app",
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: "localhost",
        cookiePathRewrite: "/",
      },
    },
  },
});
