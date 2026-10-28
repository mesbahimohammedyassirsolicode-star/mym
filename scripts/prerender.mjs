import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  NOT_FOUND_ROUTE,
  PUBLIC_ROUTES,
  render,
} from "../.ssr/entry-server.js";

// Keep in sync with the production fallback in src/config/site.ts.
const SITE_URL = "https://www.aura-soli.online";

const root = fileURLToPath(new URL("..", import.meta.url));
const distDir = join(root, "dist");
const template = await readFile(join(distDir, "index.html"), "utf8");
const marker = '<div id="root"></div>';

if (!template.includes(marker)) {
  throw new Error(`Prerender marker not found in dist/index.html: ${marker}`);
}

const outputs = [
  ...PUBLIC_ROUTES.map((url) => ({
    url,
    file: join(
      distDir,
      url === "/" ? "index.html" : `${url.replace(/^\/+/, "")}/index.html`,
    ),
  })),
  { url: NOT_FOUND_ROUTE, file: join(distDir, "404.html") },
];

for (const { url, file } of outputs) {
  const { appHtml } = await render(url);
  const html = template.replace(
    marker,
    () => `<div id="root">${appHtml}</div>`,
  );
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html, "utf8");
  console.log(`Prerendered ${url} -> ${file}`);
}

const buildDate = new Date().toISOString().slice(0, 10);
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...PUBLIC_ROUTES.map(
    (url) =>
      `  <url>\n    <loc>${SITE_URL}${url}</loc>\n    <lastmod>${buildDate}</lastmod>\n  </url>`,
  ),
  "</urlset>",
  "",
].join("\n");
await writeFile(join(distDir, "sitemap.xml"), sitemap, "utf8");
console.log(`Wrote dist/sitemap.xml with ${PUBLIC_ROUTES.length} URLs`);

await copyFile(
  join(root, "public", "robots.txt"),
  join(distDir, "robots.txt"),
);
console.log("Copied public/robots.txt -> dist/robots.txt");
