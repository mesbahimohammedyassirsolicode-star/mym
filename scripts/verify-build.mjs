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
