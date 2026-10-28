import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";

const failures = [];
function check(name, condition, detail = "") {
  if (condition) {
    console.log(`PASS ${name}`);
  } else {
    failures.push(`${name}${detail ? `: ${detail}` : ""}`);
    console.error(`FAIL ${name}${detail ? `: ${detail}` : ""}`);
  }
}

const groups = {
  prerender: async () => {
    const routes = [
      ["dist/index.html", "Make Your"],
      ["dist/services/index.html", "Digital Solutions Built Around"],
      ["dist/projects/index.html", "Ideas Into"],
      ["dist/about/index.html", "Technology With a"],
      ["dist/contact/index.html", "Talk About"],
      ["dist/404.html", "Page not found"],
    ];
    for (const [file, phrase] of routes) {
      check(`${file} exists`, existsSync(file));
      if (!existsSync(file)) continue;
      const html = await readFile(file, "utf8");
      check(`${file} is prerendered`, /<div id="root">\s*<[a-zA-Z]/.test(html));
      check(`${file} has one h1`, (html.match(/<h1\b/g) ?? []).length === 1);
      check(`${file} has body copy`, html.includes(phrase));
    }
    const sitemap = await readFile("dist/sitemap.xml", "utf8").catch(() => "");
    check("sitemap has five URLs", (sitemap.match(/<loc>/g) ?? []).length === 5);
    check("sitemap has lastmod", /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/.test(sitemap));
    const robots = await readFile("dist/robots.txt", "utf8").catch(() => "");
    check("robots points to sitemap", robots.includes("https://www.aura-soli.online/sitemap.xml"));
  },
  seo: async () => {
    const decode = (s) => s.replaceAll("&amp;", "&").replaceAll("&#x27;", "'").replaceAll("&quot;", '"');
    const pages = [
      ["dist/index.html", "https://www.aura-soli.online/"],
      ["dist/services/index.html", "https://www.aura-soli.online/services"],
      ["dist/projects/index.html", "https://www.aura-soli.online/projects"],
      ["dist/about/index.html", "https://www.aura-soli.online/about"],
      ["dist/contact/index.html", "https://www.aura-soli.online/contact"],
    ];
    for (const [file, canonical] of pages) {
      const html = await readFile(file, "utf8");
      const title = decode((html.match(/<title>([\s\S]*?)<\/title>/) ?? [])[1] ?? "");
      const description = decode((html.match(/<meta name="description" content="([^"]*)"/) ?? [])[1] ?? "");
      check(`${file} title length`, title.length >= 50 && title.length <= 60, `${title.length}`);
      check(`${file} description length`, description.length >= 140 && description.length <= 160, `${description.length}`);
      check(`${file} canonical`, html.includes(`rel="canonical" href="${canonical}"`));
      check(`${file} og:url`, html.includes(`property="og:url" content="${canonical}"`));
      check(`${file} og image size`, html.includes('property="og:image:width" content="1200"') && html.includes('property="og:image:height" content="630"'));
      check(`${file} twitter card`, html.includes('name="twitter:card" content="summary_large_image"'));
      check(`${file} is indexable`, !html.includes("noindex"));
    }
    const notFound = await readFile("dist/404.html", "utf8");
    check("404 noindex", notFound.includes('name="robots" content="noindex, nofollow"'));
    check("404 has no canonical", !notFound.includes('rel="canonical"'));
    const { render } = await import(new URL("../.ssr/entry-server.js", import.meta.url));
    const trailing = await render("/services/");
    check("trailing slash canonical", trailing.head.includes('rel="canonical" href="https://www.aura-soli.online/services"'));
    const missing = await render("/nope");
    check("unknown path noindex", missing.head.includes('name="robots" content="noindex, nofollow"'));
  },
};

const requested = process.argv.slice(2);
const active = requested.length ? requested : Object.keys(groups);
for (const name of active) {
  if (!groups[name]) throw new Error(`Unknown check group: ${name}`);
  await groups[name]();
}
if (failures.length) {
  console.error(`\n${failures.length} check(s) failed.`);
  process.exit(1);
}
console.log("\nAll selected checks passed.");
