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
  structured: async () => {
    const parse = (html) => [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
      .map((m) => JSON.parse(m[1]));
    const home = await readFile("dist/index.html", "utf8");
    const homeLd = parse(home);
    check("Organization JSON-LD", homeLd.some((x) => x["@type"] === "Organization" && x["@id"].endsWith("#organization")));
    check("WebSite JSON-LD", homeLd.some((x) => x["@type"] === "WebSite" && x["@id"].endsWith("#website")));
    check("no invented sameAs", homeLd.every((x) => x.sameAs === undefined));
    const services = parse(await readFile("dist/services/index.html", "utf8"));
    const list = services.find((x) => x["@type"] === "ItemList");
    check("Service ItemList", list?.itemListElement?.length === 7);
    check("Service entries typed", list?.itemListElement?.every((x) => x.item?.["@type"] === "Service"));
    const notFound = parse(await readFile("dist/404.html", "utf8"));
    check("404 has no JSON-LD", notFound.length === 0);
    const sitemap = await readFile("dist/sitemap.xml", "utf8");
    for (const url of ["/", "/services", "/projects", "/about", "/contact"]) {
      check(`sitemap includes ${url}`, sitemap.includes(`<loc>https://www.aura-soli.online${url}</loc>`));
    }
    check("sitemap lastmod is ISO", /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/.test(sitemap));
    check("sitemap changefreq", sitemap.includes("<changefreq>weekly</changefreq>"));
    check("sitemap priority", sitemap.includes("<priority>1.0</priority>"));
  },
  assets: async () => {
    const pngSize = (buf) => [buf.readUInt32BE(16), buf.readUInt32BE(20)];
    const required = [
      "public/assets/logo/Aurasoli-logo-352.avif",
      "public/assets/logo/Aurasoli-logo-352.webp",
      "public/assets/logo/Aurasoli-logo-352.png",
      "public/assets/logo/Aurasoli-logo-704.avif",
      "public/assets/logo/Aurasoli-logo-704.webp",
      "public/assets/logo/Aurasoli-logo-704.png",
      "public/favicon-32x32.png",
      "public/apple-touch-icon.png",
      "public/icon-192.png",
      "public/icon-512.png",
      "public/site.webmanifest",
    ];
    for (const file of required) check(`${file} exists`, existsSync(file));
    const og = pngSize(await readFile("public/og-image.png"));
    check("og image is 1200x630", og[0] === 1200 && og[1] === 630, og.join("x"));
    check("favicon is 32", pngSize(await readFile("public/favicon-32x32.png")).join("x") === "32x32");
    check("apple icon is 180", pngSize(await readFile("public/apple-touch-icon.png")).join("x") === "180x180");
    check("logo 352 png", pngSize(await readFile("public/assets/logo/Aurasoli-logo-352.png")).join("x") === "352x102");
    check("logo 704 png", pngSize(await readFile("public/assets/logo/Aurasoli-logo-704.png")).join("x") === "704x203");
    const home = await readFile("dist/index.html", "utf8").catch(() => "");
    check("logo picture", home.includes("Aurasoli-logo-352.avif") && home.includes("Aurasoli-logo-704.webp"));
    check("logo alt", home.includes('alt="Aurasoli logo"'));
    check("header logo high priority", /fetchpriority="high"/i.test(home));
    check("logo dimensions", home.includes('width="704"') && home.includes('height="203"'));
    check("logo preload", home.includes('rel="preload" as="image"') && home.includes("Aurasoli-logo-352.avif"));
    check("apple touch icon link", home.includes('rel="apple-touch-icon"'));
    check("manifest link", home.includes('rel="manifest"'));
    const manifest = JSON.parse(await readFile("public/site.webmanifest", "utf8"));
    check("manifest icons", manifest.icons?.length === 2 && manifest.theme_color === "#0B0C0F");
  },
  motion: async () => {
    const home = await readFile("dist/index.html", "utf8");
    check("no inline hidden content", !/style="[^"]*(opacity\s*:\s*0|visibility\s*:\s*hidden)/i.test(home));
    const cssFiles = (await readdir("dist/assets")).filter((f) => f.endsWith(".css"));
    const css = (await Promise.all(cssFiles.map((f) => readFile(`dist/assets/${f}`, "utf8")))).join("\n");
    check("reveal base styles", css.includes(".reveal"));
    check("reveal armed state", css.includes(".reveal.is-armed"));
    check("reveal visible state", css.includes(".reveal.is-visible"));
    check("reveal rise distance", css.includes("translateY(20px)"));
    check("reduced motion guarded", /prefers-reduced-motion:\s*reduce/.test(css));
    check("hero entrance keyframes", css.includes("@keyframes hero-rise"));
    check(
      "card hover survives reveal",
      css.includes(".service-card.reveal.is-visible:hover") &&
        css.includes(".value-card.reveal.is-visible:hover"),
    );
    const pkg = JSON.parse(await readFile("package.json", "utf8"));
    check("no animation runtime", !("framer-motion" in pkg.dependencies));
    const reveal = await readFile("src/hooks/useInViewOnce.ts", "utf8");
    check("observer disconnects", reveal.includes("disconnect()"));
  },
};

const ui = async () => {
  const cssFiles = (await readdir("dist/assets")).filter((f) => f.endsWith(".css"));
  const css = (await Promise.all(cssFiles.map((f) => readFile(`dist/assets/${f}`, "utf8")))).join("\n");
  check("scrolled navbar style", css.includes(".site-header.is-scrolled"));
  check("menu exit animation", css.includes("mobile-nav-exit"));
  check("scoped view transition", css.includes("::view-transition-old(main-content)"));
  check("route fallback", css.includes(".route-view--enter"));
  check("button hover lift", css.includes(".btn:hover") && css.includes("translateY(-2px)"));
  check("hover-capable guard", /\(hover:\s*hover\)\s*and\s*\(pointer:\s*fine\)/.test(css));
  const button = await readFile("src/components/ui/Button.tsx", "utf8");
  check("buttons request view transitions", button.includes("viewTransition"));
  const layout = await readFile("src/layouts/MainLayout.tsx", "utf8");
  check("layout uses view transitions fallback", layout.includes("startViewTransition"));
  check("layout keeps scroll handling", layout.includes("scrollIntoView"));
};
groups.ui = ui;

const perf = async () => {
  const manifest = JSON.parse(await readFile("dist/.vite/manifest.json", "utf8"));
  const dynamicPages = Object.values(manifest).filter((entry) => entry.isDynamicEntry && /src\/pages\//.test(entry.src));
  check("five dynamic page chunks", dynamicPages.length >= 5, `${dynamicPages.length}`);
  const framework = Object.values(manifest).some((e) => e.file.includes("framework"));
  check("framework chunk", framework);
  const home = await readFile("dist/index.html", "utf8");
  const styles = [...home.matchAll(/<link rel="stylesheet"[^>]+href="\/([^"]+\.css)"/g)].map((m) => m[1]);
  check("initial stylesheet linked", styles.length > 0);
  const css = (await Promise.all(styles.map((f) => readFile(`dist/${f}`, "utf8")))).join("\n");
  for (const selector of [".hero__title", ".hv-laptop", ".service-detail", ".contact-form-card", ".mission-aim", ".project-card"]) {
    check(`initial css has ${selector}`, css.includes(selector));
  }
  check("font preload", /rel="preload"[^>]+as="font"[^>]+inter-latin-wght-normal[^>]+\.woff2/.test(home));
  const services = await readFile("dist/services/index.html", "utf8");
  check("route chunk preload", /rel="modulepreload"[^>]+ServicesPage-[^"]+\.js/.test(services));
  const contact = await readFile("src/services/contactSubmission.ts", "utf8");
  check("emailjs dynamic", contact.includes('import("@emailjs/browser")'));
  check("emailjs not static", !/^import emailjs from/m.test(contact));
};
groups.perf = perf;

const deploy = async () => {
  const config = JSON.parse(await readFile("vercel.json", "utf8"));
  check("clean urls", config.cleanUrls === true);
  check("no trailing slash", config.trailingSlash === false);
  const redirect = config.redirects?.find((r) => r.has?.some((h) => h.type === "host" && h.value === "aura-soli.online"));
  check("apex 301", redirect?.statusCode === 301 && redirect.destination === "https://www.aura-soli.online/:path*");
  check("no spa catch-all", !JSON.stringify(config.rewrites ?? []).includes("index.html"));
  const headerText = JSON.stringify(config.headers ?? []);
  check("immutable assets", headerText.includes("public, max-age=31536000, immutable"));
  for (const name of ["Content-Security-Policy", "Strict-Transport-Security", "X-Content-Type-Options", "Referrer-Policy", "X-Frame-Options", "Permissions-Policy"]) {
    check(`header ${name}`, headerText.includes(name));
  }
  check("csp allows emailjs", headerText.includes("https://api.emailjs.com"));
  check("404 file", existsSync("dist/404.html"));
  check("checklist exists", existsSync("docs/seo-launch-checklist.md"));
};
groups.deploy = deploy;

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
