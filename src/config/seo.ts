import { SITE_NAME, SITE_URL } from "./site";

export interface PageSeo {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  image?: string;
}

export type HeadTag =
  | { kind: "title"; text: string }
  | { kind: "meta"; attrs: Record<string, string> }
  | { kind: "link"; attrs: Record<string, string> }
  | { kind: "script"; attrs: Record<string, string>; text: string };

const OG_IMAGE_ALT = "Aurasoli logo on a dark background";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

const NOT_FOUND_SEO: PageSeo = {
  title: "Page Not Found | Aurasoli",
  description:
    "The page you requested does not exist or may have moved. Return to Aurasoli to explore our digital solutions, services, and recent work.",
  path: "/404",
  noindex: true,
};

const PAGE_SEO: Record<string, PageSeo> = {
  "/": {
    title: "Aurasoli | Digital Solutions, Web Development & Automation",
    description:
      "Aurasoli builds digital solutions that help businesses develop their ideas, automate operations, and grow their modern online presence with confidence.",
    path: "/",
  },
  "/services": {
    title: "Web Development, Automation & Digital Solutions | Aurasoli",
    description:
      "Aurasoli offers seven digital services, including web development, SaaS platforms, mobile apps, automation, SEO, and brand identity for growing businesses.",
    path: "/services",
  },
  "/projects": {
    title: "Digital Solutions & Web Development Projects | Aurasoli",
    description:
      "Aurasoli project examples show how digital products come together: operations systems, SaaS platforms, mobile apps, and automation concepts.",
    path: "/projects",
  },
  "/about": {
    title: "About Aurasoli | Digital Solutions Partner for Business",
    description:
      "Learn about Aurasoli's mission, approach, and values as a digital solutions partner helping businesses build useful products and stronger operations.",
    path: "/about",
  },
  "/contact": {
    title: "Contact Aurasoli | Start Your Digital Solutions Project",
    description:
      "Tell Aurasoli about your project. Share your goals, requirements, and timeline for web development, automation, SEO, or digital growth work.",
    path: "/contact",
  },
};

export function getPageSeo(pathname: string): PageSeo {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  return PAGE_SEO[normalized] ?? NOT_FOUND_SEO;
}

function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

export function buildHeadTags(seo: PageSeo): HeadTag[] {
  const url = absoluteUrl(seo.path);
  const image = seo.image ?? DEFAULT_OG_IMAGE;

  const tags: HeadTag[] = [
    { kind: "title", text: seo.title },
    { kind: "meta", attrs: { name: "description", content: seo.description } },
  ];

  if (seo.noindex) {
    tags.push({
      kind: "meta",
      attrs: { name: "robots", content: "noindex, nofollow" },
    });
  } else {
    tags.push({ kind: "link", attrs: { rel: "canonical", href: url } });
  }

  tags.push(
    { kind: "meta", attrs: { property: "og:type", content: "website" } },
    { kind: "meta", attrs: { property: "og:site_name", content: SITE_NAME } },
    { kind: "meta", attrs: { property: "og:title", content: seo.title } },
    {
      kind: "meta",
      attrs: { property: "og:description", content: seo.description },
    },
    { kind: "meta", attrs: { property: "og:url", content: url } },
    { kind: "meta", attrs: { property: "og:image", content: image } },
    {
      kind: "meta",
      attrs: { property: "og:image:type", content: "image/png" },
    },
    {
      kind: "meta",
      attrs: { property: "og:image:width", content: "1200" },
    },
    {
      kind: "meta",
      attrs: { property: "og:image:height", content: "630" },
    },
    {
      kind: "meta",
      attrs: { property: "og:image:alt", content: OG_IMAGE_ALT },
    },
    {
      kind: "meta",
      attrs: { name: "twitter:card", content: "summary_large_image" },
    },
    { kind: "meta", attrs: { name: "twitter:title", content: seo.title } },
    {
      kind: "meta",
      attrs: { name: "twitter:description", content: seo.description },
    },
    { kind: "meta", attrs: { name: "twitter:image", content: image } },
  );

  return tags;
}

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
};

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"]/g,
    (character) => HTML_ESCAPES[character] ?? character,
  );
}

function serializeAttributes(attrs: Record<string, string>): string {
  return Object.entries(attrs)
    .map(([name, value]) => `${name}="${escapeHtml(value)}"`)
    .join(" ");
}

export function renderHead(seo: PageSeo): string {
  const markup = buildHeadTags(seo).map((tag): string => {
    switch (tag.kind) {
      case "title":
        return `<title>${escapeHtml(tag.text)}</title>`;
      case "meta":
        return `<meta ${serializeAttributes(tag.attrs)} />`;
      case "link":
        return `<link ${serializeAttributes(tag.attrs)} />`;
      case "script":
        // Keep JSON-LD text from closing the surrounding script element.
        return `<script ${serializeAttributes(tag.attrs)}>${tag.text.replaceAll("<", "\\u003c")}</script>`;
    }
  });

  // The leading and trailing whitespace keeps the block aligned with the
  // `<head>` markers in index.html.
  return `\n    ${markup.join("\n    ")}\n    `;
}

function metaSelector(attrs: Record<string, string>): string | null {
  if (attrs.property) {
    return `meta[property="${attrs.property}"]`;
  }
  if (attrs.name) {
    return `meta[name="${attrs.name}"]`;
  }
  return null;
}

export function applyHead(seo: PageSeo): void {
  if (typeof document === "undefined") {
    return;
  }

  const head = document.head;
  const managed = new Set<Element>();

  // Structured data is regenerated on every update, so clear the old nodes
  // before adding the current page's tags.
  for (const element of head.querySelectorAll("script[data-seo-jsonld]")) {
    element.remove();
  }

  for (const tag of buildHeadTags(seo)) {
    if (tag.kind === "title") {
      document.title = tag.text;
      continue;
    }

    if (tag.kind === "meta") {
      const selector = metaSelector(tag.attrs);
      if (!selector) continue;

      let element = head.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        head.appendChild(element);
      }

      for (const [name, value] of Object.entries(tag.attrs)) {
        element.setAttribute(name, value);
      }
      managed.add(element);
      continue;
    }

    if (tag.kind === "link") {
      const rel = tag.attrs.rel;
      if (!rel) continue;

      const selector = `link[rel="${rel}"]`;
      let element = head.querySelector(selector);
      if (!element) {
        element = document.createElement("link");
        head.appendChild(element);
      }

      for (const [name, value] of Object.entries(tag.attrs)) {
        element.setAttribute(name, value);
      }
      managed.add(element);
      continue;
    }

    const script = document.createElement("script");
    for (const [name, value] of Object.entries(tag.attrs)) {
      script.setAttribute(name, value);
    }
    script.textContent = tag.text;
    head.appendChild(script);
  }

  // Drop canonical and robots directives this page does not use, so client
  // navigation never leaves a stale value behind.
  for (const element of head.querySelectorAll(
    'meta[name="robots"], link[rel="canonical"]',
  )) {
    if (!managed.has(element)) {
      element.remove();
    }
  }
}
