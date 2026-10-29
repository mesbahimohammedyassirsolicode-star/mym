/**
 * Builds llms-full.txt from the HTML that Astro has already emitted, so the
 * plain-text corpus can never drift from the pages visitors (and crawlers) get.
 *
 * Run after `astro build` — `npm run build` does this automatically.
 * Writes both `dist/llms-full.txt` (what gets deployed) and `public/llms-full.txt`
 * (the committed copy that documents the file).
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const SITE = "https://www.aura-soli.online";

const staticPages = [
  { file: "index.html", title: "Home", path: "/" },
  { file: "services/index.html", title: "Services", path: "/services" },
  { file: "projects/index.html", title: "Projects", path: "/projects" },
];

const trailingPages = [
  { file: "about/index.html", title: "About", path: "/about" },
  { file: "contact/index.html", title: "Contact", path: "/contact" },
];

function caseStudyPages() {
  const dir = join(DIST, "projects");
  if (!existsSync(dir)) {
    return [];
  }

  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      file: join("projects", entry.name, "index.html"),
      path: `/projects/${entry.name}`,
    }))
    .sort((a, b) => a.path.localeCompare(b.path))
    .map((page) => {
      const html = readFileSync(join(DIST, page.file), "utf8");
      const title = stripTags(
        (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) ?? [])[1] ?? page.path,
      );
      return { ...page, title };
    });
}

function decodeEntities(value) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function stripTags(value) {
  return decodeEntities(value.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

const VOID_ELEMENTS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

/**
 * Drops decorative subtrees (aria-hidden layers and the dashboard mockup in the
 * hero) so the plain-text corpus only carries real page copy.
 */
function stripDecorations(html) {
  const tagPattern = /<(\/?)([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
  let output = "";
  let cursor = 0;
  let depth = 0;
  let rootTag = "";
  let match;

  while ((match = tagPattern.exec(html)) !== null) {
    const closing = match[1] === "/";
    const tag = match[2].toLowerCase();
    const attrs = match[3] ?? "";

    if (depth > 0) {
      if (tag === rootTag) {
        depth += closing ? -1 : 1;
        if (depth === 0) {
          cursor = tagPattern.lastIndex;
        }
      }
      continue;
    }

    const isDecorative = /aria-hidden=("|')true\1/i.test(attrs) || /data-hero-visual/i.test(attrs);

    if (!closing && isDecorative && !VOID_ELEMENTS.has(tag) && !match[0].endsWith("/>")) {
      output += html.slice(cursor, match.index);
      rootTag = tag;
      depth = 1;
    }
  }

  return output + html.slice(cursor);
}

function htmlToText(html) {
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  let body = main ? main[1] : html;

  body = stripDecorations(body)
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|svg|noscript)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<nav class="breadcrumb"[\s\S]*?<\/nav>/gi, "")
    .replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, text) => {
      const depth = Math.min(6, Number(level) + 1);
      return `\n\n${"#".repeat(depth)} ${stripTags(text)}\n\n`;
    })
    .replace(/<li[^>]*>/gi, "\n- ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|section|article|header|footer|ul|ol|dl|figure|blockquote)>/gi, "\n\n")
    .replace(/<\/(td|th)>/gi, " | ")
    .replace(/<[^>]+>/g, "");

  return decodeEntities(body)
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .filter((line) => line !== "-")
    .filter((line, index, lines) => !(line === "" && lines[index - 1] === ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\n+|\n+$/g, "");
}

const pages = [...staticPages, ...caseStudyPages(), ...trailingPages];

const sections = pages.map((page) => {
  const html = readFileSync(join(DIST, page.file), "utf8");
  const text = htmlToText(html);
  return `## ${page.title}\nURL: ${SITE}${page.path}\n\n${text}`;
});

const document = [
  "# Aurasoli — full site text",
  "",
  `Plain-text content of every page on ${SITE}, generated from the built HTML.`,
  `Curated index: ${SITE}/llms.txt`,
  "",
  "---",
  "",
  sections.join("\n\n---\n\n"),
  "",
].join("\n");

writeFileSync(join(DIST, "llms-full.txt"), document);
writeFileSync(join("public", "llms-full.txt"), document);

const words = document.split(/\s+/).length;
console.log(
  `[llms-full] wrote dist/llms-full.txt and public/llms-full.txt — ${pages.length} pages, ${words} words`,
);
