import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: {
    manifest: !isSsrBuild,
    rollupOptions: isSsrBuild
      ? undefined
      : {
          output: {
            manualChunks(id) {
              if (!id.includes("node_modules")) return;
              if (/node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/.test(id)) return "framework";
              if (id.includes("lucide-react")) return "icons";
              if (id.includes("@vercel/analytics")) return "analytics";
            },
          },
        },
  },
}));
