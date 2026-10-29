/**
 * Post-build checks for machine readability: prerendered copy, semantics,
 * JSON-LD, robots/llms files, sitemap metadata and the favicon set.
 * Run after `npm run build` — `npm run verify` does this automatically.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const AI_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

const failures = [];

function check(label, condition, detail = "") {
  if (condition) {
    console.log(`  ok   ${label}`);
    return;
  }
  failures.push(`${label}${detail ? ` — ${detail}` : ""}`);
  console.log(`  FAIL ${label}${detail ? ` — ${detail}` : ""}`);
}

function decode(value) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ");
}

function visibleText(html) {
  return decode(html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " "))
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function jsonLdBlocks(html) {
  const blocks = [];
  const pattern =
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = pattern.exec(html)) !== null) {
    blocks.push(match[1]);
  }
  return blocks;
}

const pages = [
  { file: "index.html", label: "/", inner: false },
  { file: "services/index.html", label: "/services", inner: true },
  { file: "projects/index.html", label: "/projects", inner: true },
  { file: "about/index.html", label: "/about", inner: true },
  { file: "contact/index.html", label: "/contact", inner: true },
  { file: join("projects", "iti-info", "index.html"), label: "/projects/iti-info", inner: true },
  { file: "404.html", label: "/404", inner: false, noindex: true },
];

console.log("\nHTML content and semantics");
const homeH1s = [];
for (const page of pages) {
  const path = join(DIST, page.file);
  check(`${page.label} exists`, existsSync(path));
  if (!existsSync(path)) {
    continue;
  }

  const html = readFileSync(path, "utf8");
  const text = visibleText(html);
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) =>
    decode(match[1].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim(),
  );
  if (page.label === "/") {
    homeH1s.push(...h1s);
  }

  check(`${page.label} lang="en"`, /<html[^>]*lang="en"/i.test(html));
  check(`${page.label} exactly one h1`, h1s.length === 1, `found ${h1s.length}`);
  check(`${page.label} h1 has text`, (h1s[0] ?? "").length > 3);
  check(
    `${page.label} landmarks`,
    /<header[\s>]/i.test(html) &&
      /<nav[\s>]/i.test(html) &&
      /<main[\s>]/i.test(html) &&
      /<footer[\s>]/i.test(html),
  );
  check(`${page.label} <address>`, /<address[\s>]/i.test(html));
  check(`${page.label} no empty root div`, !/<div id="root">\s*<\/div>/i.test(html));
  // The 404 page is intentionally short; content pages must carry real copy.
  const minCopy = page.noindex ? 400 : 800;
  check(
    `${page.label} body copy > ${minCopy} chars`,
    text.length > minCopy,
    `${text.length} chars`,
  );

  const images = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
  const missingAlt = images.filter((tag) => !/\balt="/i.test(tag));
  check(`${page.label} every img has alt`, missingAlt.length === 0, `${missingAlt.length} missing`);

  const blocks = jsonLdBlocks(html);
  check(`${page.label} exactly one JSON-LD graph`, blocks.length === 1, `${blocks.length} blocks`);

  const parsed = blocks.map((block) => {
    try {
      return JSON.parse(block);
    } catch (error) {
      failures.push(`${page.label} JSON-LD parse error: ${error.message}`);
      return null;
    }
  });
  const graph = parsed[0]?.["@graph"] ?? [];
  const types = graph.map((node) => node["@type"]);

  check(`${page.label} JSON-LD context`, parsed[0]?.["@context"] === "https://schema.org");
  check(`${page.label} ProfessionalService`, types.includes("ProfessionalService"));
  check(`${page.label} WebSite`, types.includes("WebSite"));
  check(
    `${page.label} 7 Service entries`,
    types.filter((type) => type === "Service").length === 7,
    `${types.filter((type) => type === "Service").length}`,
  );
  check(
    `${page.label} breadcrumb ${page.inner ? "present" : "absent"}`,
    page.inner ? types.includes("BreadcrumbList") : !types.includes("BreadcrumbList"),
  );
  if (page.inner) {
    check(
      `${page.label} visible breadcrumb`,
      /<nav class="breadcrumb"[^>]*aria-label="Breadcrumb"/i.test(html),
    );
  }

  const organization = graph.find((node) => node["@type"] === "ProfessionalService");
  check(
    `${page.label} organization contactPoint`,
    Boolean(organization?.contactPoint?.url),
  );

  const faq = graph.find((node) => node["@type"] === "FAQPage");
  if (page.label === "/") {
    check("/ FAQPage present", Boolean(faq));
    const questions = faq?.mainEntity ?? [];
    check("/ FAQ has 8 questions", questions.length === 8, `${questions.length}`);
    const missing = questions.filter((entry) => {
      const question = decode(entry.name);
      const answer = decode(entry.acceptedAnswer.text);
      return !text.includes(question) || !text.includes(answer);
    });
    check("/ FAQ answers visible in HTML", missing.length === 0, `${missing.length} hidden`);
  } else {
    check(`${page.label} no FAQPage`, !faq);
  }

  if (page.noindex) {
    check(`${page.label} noindex`, /<meta name="robots" content="noindex/i.test(html));
  } else {
    check(
      `${page.label} indexable robots meta`,
      /content="index, follow, max-snippet:-1/i.test(html),
    );
  }
}

console.log("\nMachine files");
for (const file of [
  "robots.txt",
  "llms.txt",
  "llms-full.txt",
  "sitemap-index.xml",
  "sitemap-0.xml",
  "favicon-16.png",
  "favicon-32.png",
  "apple-touch-icon.png",
  "og-image.png",
]) {
  check(`dist/${file} exists`, existsSync(join(DIST, file)));
}

const robots = readFileSync(join(DIST, "robots.txt"), "utf8");
for (const agent of AI_AGENTS) {
  check(`robots allows ${agent}`, robots.includes(`User-agent: ${agent}`));
}
check(
  "robots sitemap line",
  robots.includes("Sitemap: https://www.aura-soli.online/sitemap-index.xml"),
);

const llms = readFileSync(join(DIST, "llms.txt"), "utf8");
check("llms.txt h1", llms.startsWith("# Aurasoli"));
check("llms.txt blockquote summary", /^> Aurasoli is a digital solutions partner/m.test(llms));
for (const path of ["/services", "/projects", "/about", "/contact"]) {
  check(`llms.txt links ${path}`, llms.includes(`https://www.aura-soli.online${path}`));
}

const llmsFull = readFileSync(join(DIST, "llms-full.txt"), "utf8");
check("llms-full.txt > 6000 chars", llmsFull.length > 6000, `${llmsFull.length}`);
check("llms-full.txt uses page urls", llmsFull.includes("https://www.aura-soli.online/services"));
for (const heading of homeH1s) {
  check("llms-full.txt contains the home h1", llmsFull.includes(heading));
}
check(
  "llms-full.txt contains services copy",
  llmsFull.includes("Fast, responsive websites and web applications"),
);

const sitemap = readFileSync(join(DIST, "sitemap-0.xml"), "utf8");
const urlCount = (sitemap.match(/<url>/g) ?? []).length;
const lastmodCount = (sitemap.match(/<lastmod>/g) ?? []).length;
check("sitemap has 9 urls", urlCount === 9, `${urlCount}`);
check("sitemap lastmod on every url", lastmodCount === urlCount, `${lastmodCount}/${urlCount}`);

console.log("");
if (failures.length > 0) {
  console.log(`${failures.length} AI-readability check(s) failed:`);
  for (const failure of failures) {
    console.log(`  - ${failure}`);
  }
  process.exit(1);
}

console.log("ALL AI-READABILITY CHECKS PASSED");
