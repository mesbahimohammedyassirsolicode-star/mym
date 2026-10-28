import { mkdir, readFile, writeFile } from "node:fs/promises";
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
const headBlock = /<!--seo-head-start-->[\s\S]*?<!--seo-head-end-->/;

if (!template.includes(marker)) {
  throw new Error(`Prerender marker not found in dist/index.html: ${marker}`);
}

if (!headBlock.test(template)) {
  throw new Error("SEO head markers not found in dist/index.html");
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
  const { appHtml, head } = await render(url);
  const html = template
    .replace(marker, () => `<div id="root">${appHtml}</div>`)
    .replace(
      headBlock,
      () => `<!--seo-head-start-->${head}<!--seo-head-end-->`,
    );
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html, "utf8");
  console.log(`Prerendered ${url} -> ${file}`);
}

const SITEMAP_META = {
  "/": { changefreq: "weekly", priority: "1.0" },
  "/services": { changefreq: "monthly", priority: "0.8" },
  "/projects": { changefreq: "monthly", priority: "0.8" },
  "/about": { changefreq: "monthly", priority: "0.6" },
  "/contact": { changefreq: "monthly", priority: "0.6" },
};

const buildDate = new Date().toISOString().slice(0, 10);
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...PUBLIC_ROUTES.map((url) => {
    const meta = SITEMAP_META[url];
    if (!meta) {
      throw new Error(`Missing sitemap metadata for ${url}`);
    }
    return `  <url>\n    <loc>${SITE_URL}${url}</loc>\n    <lastmod>${buildDate}</lastmod>\n    <changefreq>${meta.changefreq}</changefreq>\n    <priority>${meta.priority}</priority>\n  </url>`;
  }),
  "</urlset>",
  "",
].join("\n");
await writeFile(join(distDir, "sitemap.xml"), sitemap, "utf8");
console.log(`Wrote dist/sitemap.xml with ${PUBLIC_ROUTES.length} URLs`);

const robots = await readFile(join(root, "public", "robots.txt"), "utf8");
await writeFile(join(distDir, "robots.txt"), robots, "utf8");
console.log("Wrote dist/robots.txt from public/robots.txt");
