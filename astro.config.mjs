// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// Fully static output: every route is pre-rendered to HTML at build time.
export default defineConfig({
  site: "https://www.aura-soli.online",
  output: "static",
  trailingSlash: "never",
  integrations: [react(), sitemap()],
  build: {
    format: "directory",
  },
});
