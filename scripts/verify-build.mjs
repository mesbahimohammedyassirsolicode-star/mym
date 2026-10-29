import { readFileSync, existsSync } from "node:fs";

const pages = {
  "dist/index.html": ["Make Your", "Digital Solutions Built to", "Ready to Make Your"],
  "dist/services/index.html": ["Digital Solutions Built Around", "Web Development", "Discuss this service"],
  "dist/projects/index.html": ["Ideas Into", "Project gallery", "filter-button"],
  "dist/about/index.html": ["Technology With a", "Our Mission", "Continuous Improvement"],
  "dist/contact/index.html": ["Let's Talk About", "Full Name", "Make the First Reply Count"],
  "dist/404.html": ["Page not found", "Return home"],
  "dist/projects/iti-info/index.html": ["Project facts", "Overview", "What is verified"],
};

let failures = 0;
for (const [file, needles] of Object.entries(pages)) {
  if (!existsSync(file)) {
    console.log("MISSING FILE", file);
    failures += 1;
    continue;
  }
  const html = readFileSync(file, "utf8");
  const h1Count = (html.match(/<h1[\s>]/g) || []).length;
  const hasCanonical = /<link rel="canonical" href="https:\/\/www\.aura-soli\.online[^"]*"/.test(html);
  const hasOgImage = /<meta property="og:image" content="https:\/\/www\.aura-soli\.online\/og-image\.png"/.test(html);
  const hasJsonLd = html.includes('"@type":"ProfessionalService"');
  const hasDesc = /<meta name="description" content="[^"]{100,200}"/.test(html);
  const missing = needles.filter((needle) => !html.includes(needle));

  console.log(
    file.padEnd(44),
    `h1=${h1Count}`,
    `canonical=${hasCanonical}`,
    `og=${hasOgImage}`,
    `jsonld=${hasJsonLd}`,
    `desc=${hasDesc}`,
    missing.length ? `MISSING_TEXT=${JSON.stringify(missing)}` : "text=ok",
  );

  if (h1Count !== 1 || !hasCanonical || !hasOgImage || !hasJsonLd || !hasDesc || missing.length) {
    failures += 1;
  }
}

const sitemap = readFileSync("dist/sitemap-index.xml", "utf8");
const sitemapPages = readFileSync("dist/sitemap-0.xml", "utf8");
console.log("\nsitemap-index:", sitemap.trim());
console.log("sitemap urls:", (sitemapPages.match(/<loc>/g) || []).length);
console.log("robots:", readFileSync("dist/robots.txt", "utf8").trim().split("\n").pop());
console.log("og image in dist:", existsSync("dist/og-image.png"));

for (const page of Object.keys(pages)) {
  const html = readFileSync(page, "utf8");
  if (/<div id="root"><\/div>/.test(html)) {
    console.log("EMPTY ROOT DIV in", page);
    failures += 1;
  }
}

const contactHtml = readFileSync("dist/contact/index.html", "utf8");
console.log("contact island hydrated:", /astro-island/.test(contactHtml));
console.log("no-JS framework on home:", /react|astro-island/i.test(readFileSync("dist/index.html", "utf8")));

console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
