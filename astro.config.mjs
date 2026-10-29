// @ts-check
import { execFileSync } from "node:child_process";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

/**
 * `lastmod` should track when the content actually changed, so it is derived
 * from the most recent commit rather than from every build.
 */
function lastModified() {
  try {
    return execFileSync("git", ["log", "-1", "--format=%cI"], {
      encoding: "utf8",
    }).trim();
  } catch {
    return new Date().toISOString();
  }
}

const lastmod = lastModified();

// Fully static output: every route is pre-rendered to HTML at build time.
export default defineConfig({
  site: "https://www.aura-soli.online",
  output: "static",
  trailingSlash: "never",
  integrations: [
    react(),
    sitemap({
      serialize: (item) => ({ ...item, lastmod }),
    }),
  ],
  build: {
    format: "directory",
  },
});
