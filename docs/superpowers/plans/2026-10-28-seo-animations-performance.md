# Aurasoli SEO, Motion, and Performance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prerender every Aurasoli route with complete per-page metadata, add subtle premium motion, and improve loading and deployment behavior without changing visible copy, branding, logo artwork, or colors.

**Architecture:** The client and a new SSR entry share one set of page routes. A Node prerender step renders each public route to real HTML and generates the head from a shared `PageSeo` module; the browser hydrates that HTML and a tiny effect keeps the head correct on client-side navigation. Motion is CSS-only with a single `Reveal` component that arms below-fold content only after hydration. The server keeps a static route table while the browser uses a lazy twin with the same paths, because React Router's static router does not preserve lazy-resolved components.

**Tech Stack:** React 19.1, React Router DOM 7.18, Vite 6, TypeScript 5.8, CSS, Node 20.19+/22.12+, `sharp` (dev-only), Vercel.

**Spec:** `docs/superpowers/specs/2026-10-28-seo-animations-performance-design.md`

## Global Constraints

- Do not change visible copy, brand name, logo artwork, or colors. New metadata and alt text are allowed.
- Keep React 19, React Router 7, Vite 6, and Vercel.
- Production origin is `https://www.aura-soli.online` (canonical host is `www`).
- Prerendered HTML must contain all body copy, headings, and links and must be readable without JavaScript.
- Animate only `transform` and `opacity`; protect CLS.
- Prerendered HTML must not contain `opacity: 0`, `visibility: hidden`, `display: none`, or an arming class on any content element. Static CSS may define `.reveal.is-armed`; that class is added only after hydration and only to elements below the viewport.
- Respect `prefers-reduced-motion: reduce`.
- Reveal motion: 20 px rise, 600 ms ease-out, 60 ms stagger capped at 240 ms, one-shot.
- Hover motion: 200 ms. Navbar: 200 ms. Hero entrance: 500–700 ms with 80–120 ms stagger. Route cross-fade: outgoing 120 ms, incoming 200 ms.
- Titles: 50–60 characters. Descriptions: 140–160 characters. The 404 page is exempt because it is `noindex`.
- One `<h1>` per route; headings stay in logical order.
- No fabricated `sameAs`, postal address, phone number, rating, or social profile.
- No new runtime animation dependency. Keep every dependency currently in use.
- Use `npm.cmd` on Windows (the `npm.ps1` shim is blocked by execution policy).
- Work in the eight small commits below and run the verification group named in each task.

## Spec Deviations

These replace the corresponding statements in the spec. They were chosen after checking the installed libraries.

1. **No `react-helmet-async`.** Upstream 3.x documents that React 19 renders metadata natively and its SSR context is not populated. Instead, `src/config/seo.ts` builds a shared list of head tags. The server serializes it into `dist/*.html`; `Seo` applies the same list with a DOM effect after hydration and on route changes. `Seo` takes only `pathname`; title, description, image, `noindex`, and JSON-LD are derived from `PAGE_SEO`, so there is one source of truth per route.
2. **Two route tables instead of one lazy table.** `src/app/routes.tsx` stays static and is used by `entry-server.tsx`; `src/app/clientRoutes.tsx` is the browser twin with React Router `lazy` loaders. This was verified against the installed 7.18.4 build: `createStaticHandler` resolves lazy modules into its internal manifest and renders them, but `createStaticRouter(routes, context)` rebuilds a manifest from the original static route objects, so the resolved component is lost and `StaticRouterProvider` emits an empty tree. Keeping the server table static avoids that bug while still splitting page JavaScript in the browser. Page CSS stays eager.
3. **Page CSS is imported eagerly.** Route-level JS splitting would otherwise move page CSS into async chunks and leave prerendered HTML unstyled until JavaScript loads. All page CSS moves to `src/styles/pages.css` in Task 7.
4. **Footer year uses `suppressHydrationWarning`.** It stays `new Date().getFullYear()` and the warning is limited to that text node.
5. **Eight commits instead of the spec's seven.** The approved spec listed seven work areas. Prerendering is kept separate from metadata so a failure in head generation cannot be mistaken for an SSR regression, and so the first commit already produces readable HTML.

## Review Focus

1. **Direct load and reload of `/services`, `/projects`, `/about`, `/contact`, and an unknown path with JavaScript disabled.** A reasonable user expects real content or the styled 404, never an empty root or a missing file.
2. **Trailing slash, query string, and unknown path.** `/services/`, `/services?utm=x`, and `/nope` should get the right canonical or `noindex` behavior, not duplicated or stale head tags.
3. **Reduced motion, missing `IntersectionObserver`, or a very fast scroll.** Content must always remain visible; a reveal must never leave an item permanently at opacity 0.
4. **Hydration with browser-dependent initial state** (reduced motion, count-up numbers, current year). A reasonable user expects no React hydration error and no visibly reset content.
5. **Contact submission behind the production CSP.** The form must still lazy-load EmailJS from the allowed origin; a blocked chunk would silently break delivery even though the UI reports a failure.

## File Map

```text
src/app/routes.tsx                     static route table for SSR
src/app/clientRoutes.tsx               lazy route table for the browser (Task 7)
src/app/App.tsx                        RouterProvider shell that accepts a router instance
src/app/router.tsx                     deleted (module-level browser router)
src/main.tsx                           createBrowserRouter, preload wait, hydrate/create guard
src/entry-server.tsx                   static render + generated head + public route list
src/config/site.ts                     SITE_URL with production fallback
src/config/seo.ts                      page metadata, head-tag builders, JSON-LD, DOM applier
src/components/seo/Seo.tsx             metadata effect for client navigation
src/hooks/usePageMeta.ts               deleted
src/hooks/useInViewOnce.ts             SSR-safe one-shot viewport observer
src/components/motion/Reveal.tsx       visible-by-default reveal wrapper
src/components/ui/BrandLogo.tsx        AVIF/WebP/PNG <picture> logo
src/layouts/MainLayout.tsx             Seo, route wrapper, fallback transition
src/components/navigation/Navbar.tsx   scroll state, menu exit state
src/components/navigation/MobileNavigation.tsx  close animation without losing focus trap
src/components/ui/Button.tsx           view transitions on internal links
src/styles/motion.css                  reveal, hero, navbar, menu, route animations
src/styles/pages.css                   eager import of the five page stylesheets
scripts/prerender.mjs                  writes route HTML, sitemap, robots, preloads
scripts/generate-assets.mjs            sharp output for logo variants, OG image, icons
scripts/verify-build.mjs               grouped production-output checks
index.html                             static fallback head, icons, preloads, head markers
vercel.json                            redirect, clean URLs, cache, security headers
docs/seo-launch-checklist.md           Search Console launch checklist
```

---

### Task 1: Prerender Every Route

**Files:**
- Create: `src/app/routes.tsx`, `src/entry-server.tsx`, `scripts/prerender.mjs`, `scripts/verify-build.mjs`
- Modify: `src/app/App.tsx`, `src/main.tsx`, `src/hooks/useCountUp.ts`, `src/components/layout/Footer.tsx`, `package.json`, `.gitignore`
- Delete: `src/app/router.tsx`
- Test: `scripts/verify-build.mjs` (`prerender` group)

**Interfaces:**
- Consumes: existing page components and `MainLayout`.
- Produces:
  - `export const routes: RouteObject[]` from `src/app/routes.tsx`.
  - `export const PUBLIC_ROUTES: readonly ["/", "/services", "/projects", "/about", "/contact"]`.
  - `export const NOT_FOUND_ROUTE = "/404"`.
  - `export async function render(url: string): Promise<{ appHtml: string; head: string }>`.
  - `App` accepts `{ router: ComponentProps<typeof RouterProvider>["router"] }`.
  - `node scripts/verify-build.mjs <group>` exits `1` on failed checks and prints `PASS <name>` / `FAIL <name>: <detail>`.

- [ ] **Step 1: Write the failing `prerender` checks**

Create `scripts/verify-build.mjs` with a small grouped harness:

```js
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
```

- [ ] **Step 2: Run the checks to confirm they fail**

Run: `npm.cmd run build` then `node scripts/verify-build.mjs prerender`

Expected: FAIL with `dist/services/index.html exists` and the other route files missing. Do not continue until the failure is observed.

- [ ] **Step 3: Create the server route table and router shell**

`src/app/routes.tsx` exports `routes: RouteObject[]` with `MainLayout` as the parent and static page imports for now:

```tsx
export const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/services", element: <ServicesPage /> },
      { path: "/projects", element: <ProjectsPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];
```

`src/app/App.tsx` becomes:

```tsx
import type { ComponentProps } from "react";
import { RouterProvider } from "react-router-dom";

type AppProps = { router: ComponentProps<typeof RouterProvider>["router"] };

export default function App({ router }: AppProps) {
  return <RouterProvider router={router} />;
}
```

`src/main.tsx` creates `createBrowserRouter(routes)` and renders `App`; delete `src/app/router.tsx`.

- [ ] **Step 4: Create the SSR entry**

`src/entry-server.tsx`:

```tsx
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router-dom";
import { routes } from "./app/routes";
import { SITE_URL } from "./config/site";

export const PUBLIC_ROUTES = ["/", "/services", "/projects", "/about", "/contact"] as const;
export const NOT_FOUND_ROUTE = "/404";

export async function render(url: string) {
  const normalized = url !== "/" ? url.replace(/\/+$/, "") : "/";
  const handler = createStaticHandler(routes);
  const context = await handler.query(new Request(new URL(normalized, SITE_URL)));
  if (context instanceof Response) {
    throw new Error(`Static handler returned ${context.status} for ${normalized}`);
  }
  const router = createStaticRouter(routes, context);
  const appHtml = renderToString(
    <StrictMode>
      <StaticRouterProvider router={router} context={context} hydrate={false} />
    </StrictMode>,
  );
  return { appHtml, head: "" };
}
```

- [ ] **Step 5: Create the prerender script and build chain**

`scripts/prerender.mjs` must use `fileURLToPath(new URL("..", import.meta.url))` for the project root, import `../.ssr/entry-server.js`, read `dist/index.html` once as the template, require the exact marker `<div id="root"></div>`, and write:

| URL | Output |
|---|---|
| `/` | `dist/index.html` |
| `/services` | `dist/services/index.html` |
| `/projects` | `dist/projects/index.html` |
| `/about` | `dist/about/index.html` |
| `/contact` | `dist/contact/index.html` |
| `/404` | `dist/404.html` |

For each file replace the marker with `<div id="root">${appHtml}</div>` and `mkdir` the parent first. Then write `dist/sitemap.xml` with the five public URLs and UTC build date (`new Date().toISOString().slice(0, 10)`) as `lastmod`, and copy `public/robots.txt` to `dist/robots.txt`.

`package.json` scripts become:

```json
"build": "tsc -b && vite build && vite build --ssr src/entry-server.tsx --outDir .ssr && node scripts/prerender.mjs",
"verify": "node scripts/verify-build.mjs"
```

Add `.ssr` to `.gitignore`.

- [ ] **Step 6: Make initial client state deterministic**

In `src/hooks/useCountUp.ts`, initialize state to `0` unconditionally (`useState(0)`). The existing effect already sets the target immediately when reduced motion is requested.

In `src/components/layout/Footer.tsx`, add `suppressHydrationWarning` to the copyright `<p>` so a year change after build cannot become a hydration error.

- [ ] **Step 7: Hydrate server markup instead of replacing it**

In `src/main.tsx`:

```tsx
const app = (
  <StrictMode>
    <>
      <App router={router} />
      <Analytics />
    </>
  </StrictMode>
);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
```

- [ ] **Step 8: Verify lint, build, and raw HTML**

Run: `npm.cmd run lint && npm.cmd run build && node scripts/verify-build.mjs prerender`

Expected: lint clean; build succeeds; every check prints PASS.

Then run `npm.cmd run preview -- --port 4173` in a second terminal and fetch each route:

```powershell
@("/", "/services", "/projects", "/about", "/contact") | ForEach-Object {
  $r = Invoke-WebRequest "http://localhost:4173$_"
  "$_ $($r.StatusCode) $($r.Content -match 'Make Your|Digital Solutions Built|Ideas Into|Technology With|Talk About')"
}
```

Expected: 200 for all five routes and `True` for the copy match. Open `/` in Chrome with DevTools Console and confirm no hydration mismatch warning. Vite preview serves an SPA fallback for unknown paths, so verify the custom 404 from `dist/404.html` directly rather than through preview.

- [ ] **Step 9: Commit**

```bash
git add src scripts package.json .gitignore
git commit -m "feat(seo): prerender all routes with React Router static rendering"
```

---

### Task 2: Per-Page Head, Canonical URLs, and Social Metadata

**Files:**
- Create: `src/config/seo.ts`, `src/components/seo/Seo.tsx`
- Modify: `src/config/site.ts`, `src/layouts/MainLayout.tsx`, `src/entry-server.tsx`, `scripts/prerender.mjs`, `index.html`, `src/pages/Home/HomePage.tsx`, `src/pages/Services/ServicesPage.tsx`, `src/pages/Projects/ProjectsPage.tsx`, `src/pages/About/AboutPage.tsx`, `src/pages/Contact/ContactPage.tsx`, `src/pages/NotFound/NotFoundPage.tsx`, `scripts/verify-build.mjs`
- Delete: `src/hooks/usePageMeta.ts`
- Test: `scripts/verify-build.mjs` (`seo` group)

**Interfaces:**
- Consumes: `SITE_URL`, route files.
- Produces:
  - `interface PageSeo { title: string; description: string; path: string; noindex?: boolean; image?: string }`.
  - `export function getPageSeo(pathname: string): PageSeo` (trims duplicate trailing slashes; unknown paths return the 404 entry).
  - `type HeadTag = { kind: "title"; text: string } | { kind: "meta"; attrs: Record<string,string> } | { kind: "link"; attrs: Record<string,string> } | { kind: "script"; attrs: Record<string,string>; text: string }`.
  - `export function buildHeadTags(seo: PageSeo): HeadTag[]`.
  - `export function renderHead(seo: PageSeo): string`.
  - `export function applyHead(seo: PageSeo): void`.
  - `Seo({ pathname }: { pathname: string })` returns `null`.

- [ ] **Step 1: Add the failing `seo` checks**

Append to `scripts/verify-build.mjs`:

```js
const seo = async () => {
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
};
groups.seo = seo;
```

- [ ] **Step 2: Run the checks to confirm they fail**

Run: `npm.cmd run build && node scripts/verify-build.mjs seo`

Expected: FAIL on title length (or missing canonical) for every page.

- [ ] **Step 3: Add the production URL fallback**

`src/config/site.ts`:

```ts
const rawSiteUrl =
  import.meta.env.VITE_SITE_URL?.trim() || "https://www.aura-soli.online";

export const SITE_URL = rawSiteUrl.replace(/\/+$/, "");
```

Keep `SITE_NAME`.

- [ ] **Step 4: Create `src/config/seo.ts` with the approved values**

Use these exact strings (lengths verified):

| Path | Title (length) | Description (length) |
|---|---|---|
| `/` | `Aurasoli \| Digital Solutions, Web Development & Automation` (58) | `Aurasoli builds digital solutions that help businesses develop their ideas, automate operations, and grow their modern online presence with confidence.` (151) |
| `/services` | `Web Development, Automation & Digital Solutions \| Aurasoli` (58) | `Aurasoli offers seven digital services, including web development, SaaS platforms, mobile apps, automation, SEO, and brand identity for growing businesses.` (155) |
| `/projects` | `Digital Solutions & Web Development Projects \| Aurasoli` (55) | `Aurasoli project examples show how digital products come together: operations systems, SaaS platforms, mobile apps, and automation concepts.` (140) |
| `/about` | `About Aurasoli \| Digital Solutions Partner for Business` (55) | `Learn about Aurasoli's mission, approach, and values as a digital solutions partner helping businesses build useful products and stronger operations.` (149) |
| `/contact` | `Contact Aurasoli \| Start Your Digital Solutions Project` (55) | `Tell Aurasoli about your project. Share your goals, requirements, and timeline for web development, automation, SEO, or digital growth work.` (140) |
| 404 | `Page Not Found \| Aurasoli` | `The page you requested does not exist or may have moved. Return to Aurasoli to explore our digital solutions, services, and recent work.` |

`DEFAULT_OG_IMAGE` is `${SITE_URL}/og-image.png`; OG alt is `Aurasoli logo on a dark background`.

`buildHeadTags` order: title; `description`; `robots` only when `noindex`; canonical when not `noindex`; `og:type=website`, `og:site_name=Aurasoli`, `og:title`, `og:description`, `og:url`, `og:image`, `og:image:type=image/png`, `og:image:width=1200`, `og:image:height=630`, `og:image:alt`; `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`; JSON-LD comes in Task 3.

`renderHead` escapes `&`, `<`, `>`, and `"` in text and attributes, and escapes `<` inside JSON text as `\u003c`. `applyHead` sets `document.title`, finds existing `meta[property]`, `meta[name]`, and `link[rel="canonical"]` nodes and updates them, creates missing ones, removes managed canonical/robots nodes that the new page does not use, and replaces all `script[data-seo-jsonld]` nodes.

- [ ] **Step 5: Replace the old metadata hook**

Create `src/components/seo/Seo.tsx`:

```tsx
import { useEffect } from "react";
import { applyHead, getPageSeo } from "../../config/seo";

export default function Seo({ pathname }: { pathname: string }) {
  useEffect(() => {
    applyHead(getPageSeo(pathname));
  }, [pathname]);
  return null;
}
```

Render `<Seo pathname={location.pathname} />` once in `src/layouts/MainLayout.tsx`. Remove every `usePageMeta(...)` call and import from the five page files and `NotFoundPage`, then delete `src/hooks/usePageMeta.ts`.

- [ ] **Step 6: Generate the head during prerender**

`src/entry-server.tsx` imports `getPageSeo` and `renderHead`, and returns `head: renderHead(getPageSeo(normalized))`.

`index.html` keeps `charset`, `viewport`, `theme-color`, the Google verification tag, and the icon links. Replace the current title/description/OG/Twitter block with a fallback block:

```html
<!--seo-head-start-->
<title>Aurasoli | Digital Solutions, Web Development &amp; Automation</title>
<meta name="description" content="Aurasoli builds digital solutions that help businesses develop their ideas, automate operations, and grow their modern online presence with confidence." />
<link rel="canonical" href="https://www.aura-soli.online/" />
<!--seo-head-end-->
```

In `scripts/prerender.mjs`, replace the whole block with `<!--seo-head-start-->${head}<!--seo-head-end-->` for each route.

- [ ] **Step 7: Verify**

Run: `npm.cmd run lint && npm.cmd run build && node scripts/verify-build.mjs prerender seo`

Expected: all checks pass.

- [ ] **Step 8: Commit**

```bash
git add src index.html scripts
git commit -m "feat(seo): add per-page head, canonical URLs and social metadata"
```

---

### Task 3: Structured Data, Sitemap, and 404 Semantics

**Files:**
- Modify: `src/config/seo.ts`, `src/entry-server.tsx`, `scripts/prerender.mjs`, `scripts/verify-build.mjs`
- Test: `scripts/verify-build.mjs` (`structured` group)

**Interfaces:**
- Consumes: `serviceCategories`, `SITE_URL`, `getPageSeo`.
- Produces:
  - `export function buildOrganizationJsonLd(): Record<string, unknown>`.
  - `export function buildWebSiteJsonLd(): Record<string, unknown>`.
  - `export function buildServicesJsonLd(): Record<string, unknown>`.
  - `buildHeadTags` appends those scripts for indexable pages; services are appended only for `/services`.

- [ ] **Step 1: Add the failing `structured` checks**

```js
const structured = async () => {
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
};
groups.structured = structured;
```

- [ ] **Step 2: Run the checks to confirm they fail**

Run: `npm.cmd run build && node scripts/verify-build.mjs structured`

Expected: FAIL on Organization JSON-LD and Service ItemList.

- [ ] **Step 3: Implement the schema builders**

Use `@id` values `${SITE_URL}/#organization` and `${SITE_URL}/#website`. Organization fields: `name: "Aurasoli"`, `url: SITE_URL + "/"`, `logo` as `ImageObject` pointing to `${SITE_URL}/assets/logo/Aurasoli-logo-704.png` with `width: 704`, `height: 203`, and the home description. WebSite fields: `name`, `url`, `inLanguage: "en"`, `publisher: { "@id": organization @id }`.

`buildServicesJsonLd` returns `ItemList` with `name: "Aurasoli digital services"` and `itemListElement` mapping `serviceCategories` to `{ "@type": "Service", name, description, serviceType, url: ${SITE_URL}/services#${slug}, provider: { "@id": organization @id } }`.

Add all three scripts to `buildHeadTags` when `!seo.noindex`, with services only when `seo.path === "/services"`. Give every JSON-LD script the attribute `data-seo-jsonld=""` so `applyHead` can replace it on navigation. Serialize with `JSON.stringify` and the `<` escape from Task 2.

- [ ] **Step 4: Finish sitemap and robots generation**

Keep the Task 1 sitemap writer and include `<changefreq>`/`<priority>` values matching `public/sitemap.xml` (weekly/1.0, monthly/0.8, 0.8, 0.6, 0.6). Read `public/robots.txt` and write it to `dist/robots.txt` explicitly so a missing public copy fails loudly. The organization logo URL points at `Aurasoli-logo-704.png`, which Task 4 generates; the JSON-LD is valid before then, but do not ship a deploy between Tasks 3 and 4.

- [ ] **Step 5: Verify**

Run: `npm.cmd run lint && npm.cmd run build && node scripts/verify-build.mjs prerender seo structured`

Expected: all checks pass, including `JSON.parse` of every block.

- [ ] **Step 6: Commit**

```bash
git add src scripts
git commit -m "feat(seo): add JSON-LD, generated sitemap and 404 semantics"
```

---

### Task 4: Brand Assets, OG Image, and Logo Picture

**Files:**
- Create: `scripts/generate-assets.mjs`, `src/components/ui/BrandLogo.tsx`
- Modify: `package.json`, `index.html`, `src/components/navigation/Navbar.tsx`, `src/components/layout/Footer.tsx`, `scripts/verify-build.mjs`
- Add: `public/assets/logo/Aurasoli-logo-352.{avif,webp,png}`, `public/assets/logo/Aurasoli-logo-704.{avif,webp,png}`, `public/og-image.png`, `public/favicon-32x32.png`, `public/apple-touch-icon.png`, `public/icon-192.png`, `public/icon-512.png`, `public/site.webmanifest`
- Test: `scripts/verify-build.mjs` (`assets` group)

**Interfaces:**
- Consumes: `public/assets/logo/Aurasoli-logo.png` (1400×404) and `public/assets/logo/Aurasoli-icon.png` (96×96), `sharp`.
- Produces: `BrandLogo({ className?, loading?, fetchPriority? })` rendering `<picture>` + `<img alt="Aurasoli logo">` with `width={704}` and `height={203}`.

- [ ] **Step 1: Add the failing `assets` checks**

```js
const assets = async () => {
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
};
groups.assets = assets;
```

- [ ] **Step 2: Run the checks to confirm they fail**

Run: `node scripts/verify-build.mjs assets`

Expected: FAIL on the first missing logo variant.

- [ ] **Step 3: Add `sharp` and the generator**

Run: `npm.cmd install -D sharp`

`package.json` gets `"assets": "node scripts/generate-assets.mjs"`.

`scripts/generate-assets.mjs`:

- Read `public/assets/logo/Aurasoli-logo.png`; write widths `352` and `704` to `.avif`, `.webp`, and `.png` using `sharp(input).resize({ width })`. Do not overwrite the 1400×404 source or the 96×96 icon.
- Build `public/og-image.png` at 1200×630: composite an SVG background (`#0B0C0F`) with one centered clay radial glow (`#C66B4E` at `0.16` opacity fading to 0) and the logo resized to width 620, centered with `left = (1200 - 620) / 2` and `top = (630 - logoHeight) / 2`. PNG output.
- Generate icons from the monogram: 32, 180, 192, 512, each on opaque `#0B0C0F` using `resize(size, size, { fit: "contain", background: "#0B0C0F" })`.
- Write `site.webmanifest` with `name`/`short_name` `Aurasoli`, `start_url: "/"`, `display: "standalone"`, `background_color`/`theme_color` `#0B0C0F`, and the 192/512 icons.
- Print a short list of generated paths and throw on a missing source.

Run `npm.cmd run assets` and commit the generated binaries.

- [ ] **Step 4: Use the picture component**

`BrandLogo` renders AVIF and WebP `<source>` entries with `srcSet` for 352w/704w, `sizes="132px"`, and a PNG fallback `<img src="/assets/logo/Aurasoli-logo-704.png">` carrying `width={704}`, `height={203}`, `alt="Aurasoli logo"`, `loading`, `fetchPriority`, and `decoding="async"`.

Use `<BrandLogo loading="eager" fetchPriority="high" />` in `Navbar` and `<BrandLogo loading="lazy" />` in `Footer`.

Add to `index.html`:

```html
<link rel="preload" as="image" type="image/avif" href="/assets/logo/Aurasoli-logo-352.avif"
      imagesrcset="/assets/logo/Aurasoli-logo-352.avif 352w, /assets/logo/Aurasoli-logo-704.avif 704w"
      imagesizes="132px" fetchpriority="high" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
```

Remove the old 96×96 favicon link.

- [ ] **Step 5: Verify**

Run: `npm.cmd run assets && npm.cmd run build && node scripts/verify-build.mjs prerender seo structured assets`

Expected: all checks pass.

- [ ] **Step 6: Commit**

```bash
git add public src scripts package.json package-lock.json index.html
git commit -m "feat(assets): add optimized logo, OG image and site icons"
```

---

### Task 5: Scroll Reveals and Hero Entrance

**Files:**
- Create: `src/hooks/useInViewOnce.ts`, `src/components/motion/Reveal.tsx`, `src/styles/motion.css`
- Modify: `src/main.tsx`, `src/pages/Home/homepage.css`, `src/pages/Home/components/ServicesOverview.tsx`, `Approach.tsx`, `WhyAurasoli.tsx`, `FeaturedProjects.tsx`, `FinalCta.tsx`, `src/pages/Services/components/ServiceSections.tsx`, `ServicesClosingCta.tsx`, `src/pages/Projects/components/ProjectGallery.tsx`, `ProjectsClosingCta.tsx`, `src/pages/About/components/MissionStatement.tsx`, `AboutApproach.tsx`, `AboutServices.tsx`, `AboutValues.tsx`, `AboutClosingCta.tsx`, `src/pages/Contact/ContactPage.tsx`, `scripts/verify-build.mjs`
- Test: `scripts/verify-build.mjs` (`motion` group)

**Interfaces:**
- Consumes: React, `prefers-reduced-motion`.
- Produces:
  - `type RevealPhase = "idle" | "armed" | "visible"`.
  - `useInViewOnce<T extends HTMLElement>(): { ref: RefObject<T | null>; phase: RevealPhase }`.
  - `Reveal({ children, as = "div", className, delay = 0 })` renders a visible element with classes `reveal`, optionally `is-armed`/`is-visible`, and sets the `--reveal-delay` custom property only when `delay > 0`, capped at 240 ms.

- [ ] **Step 1: Add the failing `motion` checks**

```js
const motion = async () => {
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
  const pkg = JSON.parse(await readFile("package.json", "utf8"));
  check("no animation runtime", !("framer-motion" in pkg.dependencies));
  const reveal = await readFile("src/hooks/useInViewOnce.ts", "utf8");
  check("observer disconnects", reveal.includes("disconnect()"));
};
groups.motion = motion;
```

- [ ] **Step 2: Run the checks to confirm they fail**

Run: `npm.cmd run build && node scripts/verify-build.mjs motion`

Expected: FAIL on reveal styles and the hero keyframes.

- [ ] **Step 3: Implement the observer and reveal component**

In `useInViewOnce`, use a `phase` state initialized to `"idle"`. In an effect:

- Return early and stay `"idle"` when `window.matchMedia("(prefers-reduced-motion: reduce)").matches` or `IntersectionObserver` is undefined.
- If the element's `getBoundingClientRect().top` is above `window.innerHeight * 0.9`, leave it `"idle"` (already visible, so no flash).
- Otherwise set `"armed"`, observe with `{ threshold: 0.12, rootMargin: "0px 0px -8% 0px" }`, set `"visible"` on the first intersection, and `disconnect()` immediately.
- Clean up with `observer.disconnect()`.

`Reveal` renders its tag with `ref`, composes classes, and sets the delay custom property only when `delay > 0`. It must not render `aria-hidden` or hide children.

`src/styles/motion.css`:

```css
.reveal {
  transition:
    opacity 600ms ease-out var(--reveal-delay, 0ms),
    transform 600ms ease-out var(--reveal-delay, 0ms);
}

.reveal.is-armed {
  opacity: 0;
  transform: translateY(20px);
  will-change: opacity, transform;
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
  will-change: auto;
}

@media (prefers-reduced-motion: reduce) {
  .reveal,
  .reveal.is-armed,
  .reveal.is-visible {
    opacity: 1;
    transform: none;
    transition: none;
    will-change: auto;
  }
}
```

Import it in `src/main.tsx` after `sections.css`.

- [ ] **Step 4: Apply reveals to the spec's content groups**

Wrap section headers and CTA panels in `<Reveal>`. Convert repeated grid/list children to `<Reveal as="li" delay={index * 60}>` or wrap the existing card where changing the element type would break layout. Cover:

- Home: services header and 7 cards; approach header and 4 steps; why header and 3 values; projects header and 3 cards; final CTA panel.
- Services: each service detail block and the closing CTA panel.
- Projects: filter bar, each gallery item, closing CTA panel.
- About: mission header and aims; services header and cards; approach header and steps; values header and cards; closing CTA.
- Contact: form card and aside, each with a 60 ms stagger.

Do not wrap the hero, skip link, navbar, footer, or the main landmark.

- [ ] **Step 5: Add the hero entrance**

In `homepage.css`, under `@media (prefers-reduced-motion: no-preference)`, animate `.hero__content > .eyebrow`, `.hero__title`, `.hero__lead`, and `.hero__actions` with a `hero-rise` keyframe (opacity 0 → 1, `translateY(16px)` → 0) using 600–650 ms ease-out and delays 0/90/180/270 ms, `both` fill. Add a slow 20 s `hero-glow-drift` on `.hv__glow` and `.hero::before` using transform/opacity only. Do not animate the `<h1>` text itself in a way that hides it before CSS loads; `animation-fill-mode: both` is acceptable because it only applies when CSS is present.

- [ ] **Step 6: Verify and manually check reduced motion**

Run: `npm.cmd run lint && npm.cmd run build && node scripts/verify-build.mjs motion`

Expected: all checks pass.

Preview `/` and `/services`; scroll slowly and quickly. Confirm cards start visible when scrolled into view, reveal once, and never flash for above-fold content. In Chrome DevTools → Rendering → “Emulate CSS media feature prefers-reduced-motion: reduce”, reload and confirm everything is visible with no movement.

- [ ] **Step 7: Commit**

```bash
git add src scripts
git commit -m "feat(ui): add scroll reveals and hero entrance"
```

---

### Task 6: Navbar, Mobile Menu, and Route Transitions

**Files:**
- Modify: `src/components/navigation/Navbar.tsx`, `src/components/navigation/MobileNavigation.tsx`, `src/components/ui/Button.tsx`, `src/layouts/MainLayout.tsx`, `src/components/layout/Footer.tsx`, `src/pages/Home/components/ServicesOverview.tsx`, `src/pages/About/components/AboutServices.tsx`, `src/styles/components.css`, `src/styles/sections.css`, `src/styles/motion.css`, `src/styles/global.css`, `scripts/verify-build.mjs`
- Test: `scripts/verify-build.mjs` (`ui` group)

**Interfaces:**
- Consumes: React Router `Link`/`NavLink` `viewTransition` props, existing focus trap and scroll lock.
- Produces:
  - `header.site-header` gains `is-scrolled` after `window.scrollY > 8`.
  - `MobileNavigation` renders a closing frame with `is-closing` for 220 ms before `hidden`.
  - `Button` internal links pass `viewTransition`.
  - `MainLayout` adds `.route-view` and `.route-view--enter` when the browser lacks `document.startViewTransition`.

- [ ] **Step 1: Add the failing `ui` checks**

```js
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
```

- [ ] **Step 2: Run the checks to confirm they fail**

Run: `npm.cmd run build && node scripts/verify-build.mjs ui`

Expected: FAIL on the scrolled navbar style.

- [ ] **Step 3: Animate the navbar on scroll**

In `Navbar`, add `isScrolled` state and one passive scroll effect with `requestAnimationFrame` coalescing. Set it from `window.scrollY > 8`, call it once on mount, and cancel the pending frame on cleanup. Add `is-scrolled` to the header class.

In `components.css`, make `.site-header` start with `border-bottom-color: transparent; background: transparent;` and no backdrop filter; add `transition: background-color 200ms ease-out, border-color 200ms ease-out`. Move the existing `var(--nav-bg)`, blur, and border to `.site-header.is-scrolled`. Keep the sticky position and z-index.

- [ ] **Step 4: Add hover lift and glow**

Keep the existing hover colors. Remove the unconditional `transform: translateY(-1px)` declarations from `.btn--primary:hover` and `.btn--secondary:hover` in `components.css`, and remove the existing `box-shadow`/`transform` from `.project-card:hover` and `.service-card:hover` in `sections.css`. Then add the lift and glow inside one hover-capable media query:

```css
@media (hover: hover) and (pointer: fine) {
  .btn:hover {
    box-shadow: var(--glow-clay);
    transform: translateY(-2px);
  }

  .project-card:hover,
  .service-card:hover,
  .value-card:hover {
    box-shadow: var(--glow-clay), var(--shadow-md);
    transform: translateY(-3px);
  }
}
```

Include `transform` and `box-shadow` in the existing 200 ms transitions. Do not change focus-visible rings or colors. Every animation duration added in this task stays at or below 220 ms. `--glow-clay` already exists in `tokens.css`.

- [ ] **Step 5: Animate mobile menu exit without breaking accessibility**

In `MobileNavigation`, track a `wasOpen` ref and an `isClosing` state:

- On `open === true`: set `wasOpen.current = true` and `isClosing = false`.
- On `open === false` after having been open: if reduced motion, skip the closing frame. Otherwise set `isClosing = true`, keep the panel rendered, and clear it after 220 ms.
- `hidden={!open && !isClosing}`; add `is-closing` to the wrapper when closing; set `pointer-events: none` while closing.
- Leave the existing focus-trap effect keyed on `open` and the body-lock effect in `Navbar` unchanged.

Add `@keyframes mobile-nav-exit` (opacity 1 → 0, translateY(0) → -8px) and `.mobile-nav.is-closing .mobile-nav__panel { animation: mobile-nav-exit 200ms ease-in both; }`. Keep the existing enter animation.

- [ ] **Step 6: Add route transitions**

Add `viewTransition` to every internal `<Link>` in `Button`, `Navbar`, `MobileNavigation`, `Footer`, `ServicesOverview`, and `AboutServices` (and to `NavLink` where a route link is rendered).

In `MainLayout`, compute the fallback key. Use a layout effect so the new route does not paint once before its entrance animation starts:

```tsx
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const [routeKey, setRouteKey] = useState(0);
useIsomorphicLayoutEffect(() => {
  if (!("startViewTransition" in document)) {
    setRouteKey((key) => key + 1);
  }
}, [location.pathname]);

<div key={routeKey} className={routeKey > 0 ? "route-view route-view--enter" : "route-view"}>
  <Outlet />
</div>
```

Keep the existing hash/scroll effect untouched.

In `motion.css`:

```css
main {
  view-transition-name: main-content;
}

::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
}

::view-transition-old(main-content) {
  animation: 120ms ease-in both route-fade-out;
}

::view-transition-new(main-content) {
  animation: 200ms ease-out both route-fade-in;
}

.route-view--enter {
  animation: route-enter 200ms ease-out both;
}

@keyframes route-enter {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
```

Disable both under `prefers-reduced-motion: reduce`.

- [ ] **Step 7: Verify interaction manually**

Run: `npm.cmd run lint && npm.cmd run build && node scripts/verify-build.mjs ui`

Then in preview:

1. Scroll on `/` → header gains blur/background smoothly and loses it at the top.
2. Open the mobile menu (narrow viewport), press Escape, and confirm focus returns to the toggle and the menu fades out.
3. Tab through the open menu and confirm focus stays trapped; confirm background scroll is locked.
4. Navigate via navbar and CTAs in Chrome and Safari/Firefox if available; confirm no header/footer flicker and hash links still scroll.
5. Repeat with reduced motion and confirm fades are instant.

- [ ] **Step 8: Commit**

```bash
git add src scripts
git commit -m "feat(ui): animate navbar, mobile menu and route changes"
```

---

### Task 7: Route Splitting, Eager Page CSS, and EmailJS Split

**Files:**
- Create: `src/styles/pages.css`, `src/app/clientRoutes.tsx`
- Modify: `src/main.tsx`, `src/hooks/useCountUp.ts` (only if the build reveals non-determinism), `src/services/contactSubmission.ts`, `src/pages/Home/HomePage.tsx`, `src/pages/Services/ServicesPage.tsx`, `src/pages/Projects/ProjectsPage.tsx`, `src/pages/About/AboutPage.tsx`, `src/pages/Contact/ContactPage.tsx`, `src/components/hero/HeroVisual.tsx`, `vite.config.ts`, `scripts/prerender.mjs`, `scripts/verify-build.mjs`
- Test: `scripts/verify-build.mjs` (`perf` group)

**Interfaces:**
- Consumes: Vite manifest, React Router `RouteObject["lazy"]`, `router.state.initialized`.
- Produces:
  - `src/app/routes.tsx` remains the static server table; `src/app/clientRoutes.tsx` exports the same paths with `lazy` loaders.
  - `main.tsx` waits for router initialization before hydrating.
  - `EmailJS` is imported only inside `submitContactForm`.
  - `dist/index.html` preloads the hashed Latin Inter woff2 and each route HTML preloads its page chunk.

- [ ] **Step 1: Add the failing `perf` checks**

```js
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
```

- [ ] **Step 2: Run the checks to confirm they fail**

Run: `npm.cmd run build && node scripts/verify-build.mjs perf`

Expected: FAIL because the manifest and dynamic page chunks do not exist yet.

- [ ] **Step 3: Keep page CSS in the initial stylesheet**

Create `src/styles/pages.css` containing only:

```css
@import "../pages/Home/homepage.css";
@import "../pages/Services/services.css";
@import "../pages/Projects/projects.css";
@import "../pages/About/about.css";
@import "../pages/Contact/contact.css";
@import "../components/hero/heroVisual.css";
```

Import `./styles/pages.css` in `src/main.tsx` after `sections.css`. Remove the five page-level CSS imports from the page components and the `heroVisual.css` import from `HeroVisual.tsx`. The hero visual is rendered in the Home page's prerendered HTML, so its CSS must ship in the initial stylesheet as well. Verify the client build emits one initial CSS set containing every page selector; if Vite deduplicates, that is fine as long as the selectors are present in the CSS linked by `dist/index.html`.

- [ ] **Step 4: Split page JavaScript in the browser**

Keep `src/app/routes.tsx` exactly as built in Task 1. It is the static server table. Create `src/app/clientRoutes.tsx` as the browser twin:

```tsx
import type { ComponentType } from "react";
import type { RouteObject } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

const lazyComponent = (
  loader: () => Promise<{ default: ComponentType }>,
): RouteObject["lazy"] =>
  async () => ({ Component: (await loader()).default });

export const clientRoutes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      { path: "/", lazy: lazyComponent(() => import("../pages/Home/HomePage")) },
      {
        path: "/services",
        lazy: lazyComponent(() => import("../pages/Services/ServicesPage")),
      },
      {
        path: "/projects",
        lazy: lazyComponent(() => import("../pages/Projects/ProjectsPage")),
      },
      {
        path: "/about",
        lazy: lazyComponent(() => import("../pages/About/AboutPage")),
      },
      {
        path: "/contact",
        lazy: lazyComponent(() => import("../pages/Contact/ContactPage")),
      },
      {
        path: "*",
        lazy: lazyComponent(() => import("../pages/NotFound/NotFoundPage")),
      },
    ],
  },
];
```

`src/main.tsx` imports `clientRoutes` and calls `createBrowserRouter(clientRoutes)`.

**Do not put `lazy` on the server table.** In React Router 7.18.4, `createStaticHandler` resolves lazy modules into its internal manifest, but `createStaticRouter(routes, context)` rebuilds a manifest from the original route objects. The rebuilt entries still have `lazy` and no `Component`, so `StaticRouterProvider` renders an empty tree. This was reproduced with a two-route fixture before writing this step. Two tables keep page components static on the server and split in the browser.

In `src/main.tsx`, after `createBrowserRouter(clientRoutes)`:

```tsx
function waitForRouter(router: ReturnType<typeof createBrowserRouter>) {
  if (router.state.initialized) return Promise.resolve();
  return new Promise<void>((resolve) => {
    const unsubscribe = router.subscribe((state) => {
      if (state.initialized) {
        unsubscribe();
        resolve();
      }
    });
  });
}

await waitForRouter(router);
```

Import the `Router` type only if needed for the helper signature; the `ReturnType` form avoids extra imports. Keep `hydrateRoot` after the await so server markup stays visible while the initial page chunk loads. If a chunk fails, the router never initializes and the prerendered HTML remains readable; log the failure instead of clearing the root.

- [ ] **Step 5: Split EmailJS**

In `src/services/contactSubmission.ts`, remove the top-level `import emailjs from "@emailjs/browser"` and load it only inside the `try` after the config check:

```ts
const { default: emailjs } = await import("@emailjs/browser");
```

Missing config must still return `{ delivered: false, reason: "missing-config" }` without loading the chunk.

- [ ] **Step 6: Configure Vite chunks and manifest**

`vite.config.ts` becomes a function config:

```ts
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: {
    manifest: !isSsrBuild,
    rollupOptions: isSsrBuild
      ? undefined
      : {
          output: {
            manualChunks(id) {
              if (!id.includes("node_modules")) return;
              if (/node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/.test(id)) return "framework";
              if (id.includes("lucide-react")) return "icons";
              if (id.includes("@vercel/analytics")) return "analytics";
            },
          },
        },
  },
}));
```

Do not split React and React DOM into separate chunks; that risks initialization-order errors.

While the config is open, audit dependencies for unused packages. Run `npm.cmd ls --depth=0`, then grep `src/`, `scripts/`, `vite.config.ts`, and `eslint.config.*` for each package name. Remove only packages with no import and no peer expectation. Keep `sharp` (dev-only asset generator), `@vercel/analytics`, and every package used by linting or the build. If nothing is unused, say so in the commit message instead of changing `package.json`.

- [ ] **Step 7: Inject font and route preloads**

In `scripts/prerender.mjs`, after reading the template:

- Find exactly one `dist/assets/*.woff2` whose name contains `inter-latin-wght-normal`; throw if absent or ambiguous. Insert `<link rel="preload" href="/${name}" as="font" type="font/woff2" crossorigin>` before `</head>`.
- Read `dist/.vite/manifest.json`. Map routes to source modules: `/` → `src/pages/Home/HomePage.tsx`, `/services` → `src/pages/Services/ServicesPage.tsx`, `/projects` → `src/pages/Projects/ProjectsPage.tsx`, `/about` → `src/pages/About/AboutPage.tsx`, `/contact` → `src/pages/Contact/ContactPage.tsx`, `/404` → `src/pages/NotFound/NotFoundPage.tsx`.
- For each route, resolve `manifest[source].file` and insert `<link rel="modulepreload" href="/${file}">` before `</head>` in that route's output. Throw if a route module is missing from the manifest.

- [ ] **Step 8: Verify**

Run: `npm.cmd run lint && npm.cmd run build && node scripts/verify-build.mjs prerender seo structured assets motion ui perf`

Expected: all checks pass. Confirm `/services` HTML still contains all service copy and one `<h1>` after the route split.

- [ ] **Step 9: Commit**

```bash
git add src scripts vite.config.ts package.json package-lock.json
git commit -m "perf: split routes and EmailJS, preload fonts and page chunks"
```

---

### Task 8: Vercel Configuration, Documentation, and Final Verification

**Files:**
- Modify: `vercel.json`, `README.md`, `scripts/verify-build.mjs`, `.gitignore`
- Create: `docs/seo-launch-checklist.md`
- Test: `scripts/verify-build.mjs` (`deploy` group), Lighthouse, manual checks

**Interfaces:**
- Consumes: every previous task.
- Produces: production redirect/security/cache configuration and a launch checklist.

- [ ] **Step 1: Add the failing `deploy` checks**

```js
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
```

- [ ] **Step 2: Run the checks to confirm they fail**

Run: `node scripts/verify-build.mjs deploy`

Expected: FAIL on clean URLs and the missing checklist.

- [ ] **Step 3: Replace `vercel.json`**

Use exactly:

- `cleanUrls: true`, `trailingSlash: false`.
- One redirect: source `/:path*`, `has: [{ type: "host", value: "aura-soli.online" }]`, destination `https://www.aura-soli.online/:path*`, `statusCode: 301`, no `permanent` (which would emit 308).
- No rewrites.
- On `/(.*)`: `Strict-Transport-Security: max-age=31536000; includeSubDomains`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`, and:

```text
Content-Security-Policy: default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com https://api.emailjs.com; upgrade-insecure-requests
```

- On `/assets/(.*)`: `Cache-Control: public, max-age=31536000, immutable`.

- [ ] **Step 4: Write the documentation**

Update `README.md`:

- Build is now static prerendering, not an SPA rewrite. List the output files and the `npm.cmd run build` / `npm.cmd run verify` commands.
- Explain `SITE_URL` fallback, head generation, JSON-LD, sitemap, and the fact that metadata is present without JavaScript.
- Explain Vercel redirect, clean URLs, security headers, 404, and immutable assets. Call out that `/assets/logo/*` is not content-hashed, so rename files when artwork changes.
- Update the deploy/env/validation sections to match reality.
- Link `docs/seo-launch-checklist.md`.

`docs/seo-launch-checklist.md` must contain:

1. Verify the `https://www.aura-soli.online/` property in Search Console (domain or URL-prefix), keeping the existing verification meta tag.
2. Submit `https://www.aura-soli.online/sitemap.xml` and confirm five discovered URLs.
3. Use URL Inspection on `/`, `/services`, `/projects`, `/about`, `/contact`: Test Live URL, confirm rendered HTML, canonical, and title, then Request Indexing.
4. Confirm apex `https://aura-soli.online` redirects 301 to `https://www.aura-soli.online` and only the www URLs are indexed.
5. Confirm unknown paths return a real 404 status and the custom 404 page, and that it is `noindex`.
6. Check the Page Indexing report for duplicates or “Discovered – currently not indexed”; fix canonical or content issues before resubmitting.
7. After 28 days, review Core Web Vitals (LCP < 2.5 s, CLS < 0.1, INP < 200 ms) and mobile usability.
8. Re-run the sitemap submission after a domain or URL-structure change.

Add `.lighthouse` to `.gitignore`.

- [ ] **Step 5: Run the full production verification**

Run:

```bash
npm.cmd run lint
npm.cmd run build
node scripts/verify-build.mjs
```

Expected: every group passes.

Start preview (`npm.cmd run preview -- --port 4173`) and fetch each route; confirm 200s, real copy, one `<h1>`, canonical, and JSON-LD. Vite preview still serves an SPA fallback, so check `dist/404.html` directly and confirm the real 404 status on a Vercel preview deployment. Reload each route with JavaScript disabled and confirm the copy is still readable.

- [ ] **Step 6: Run Lighthouse mobile**

```powershell
npx.cmd --yes lighthouse@12 http://localhost:4173/ `
  --only-categories=performance,seo,accessibility,best-practices `
  --form-factor=mobile --screenEmulation.mobile `
  --output=json --output-path=.lighthouse/home-mobile.json `
  --chrome-flags="--headless=new --no-sandbox"
```

Repeat for `/services`, `/projects`, `/about`, and `/contact`. Report the actual scores; do not assume 95+. Investigate any Performance/SEO/Accessibility/Best Practices score below 95, CLS at or above 0.1, or LCP at or above 2.5 s before declaring the task complete. Save the reports under `.lighthouse/` (ignored).

- [ ] **Step 7: Manual checks**

- Reduced motion: all content visible, no transforms or fades.
- Keyboard: skip link, nav, mobile menu trap, Escape, form validation, and focus rings unchanged.
- CSP console: on a Vercel preview deployment (not `vite preview`, which does not apply `vercel.json` headers), confirm no blocked script/style/font/connect errors on load, navigation, or form submit.
- Contact form: with real EmailJS env vars, confirm the request goes to `api.emailjs.com`; with missing vars, confirm the honest `missing-config` error.
- Headings: on every route, confirm exactly one `<h1>` and that heading levels never skip (no `h2` followed directly by `h4`). The footer's `<h2>` elements must come after the page's main headings in DOM order.
- View source: each route contains its copy before the module script.

- [ ] **Step 8: Commit**

```bash
git add vercel.json README.md docs .gitignore scripts/verify-build.mjs
git commit -m "chore(deploy): add caching, security headers and clean 404"
```

---

## Self-Review Notes

- Spec coverage: prerender (Task 1), metadata (Task 2), structured data/sitemap/404 (Task 3), OG/icons/logo (Task 4), reveals/hero (Task 5), navbar/menu/route transitions (Task 6), splitting/assets/fonts (Task 7), deployment/docs/Lighthouse/GSC (Task 8).
- Review Focus tests live in the owning tasks: direct-load and trailing-slash checks (Tasks 1–2), no-hidden-content and reduced-motion checks (Task 5), deterministic hydration (`useCountUp`/footer in Task 1), and CSP/EmailJS checks (Tasks 7–8).
- All later-task names match earlier definitions: `PageSeo`, `buildHeadTags`, `renderHead`, `applyHead`, `getPageSeo`, `Seo`, `Reveal`, `useInViewOnce`, `BrandLogo`, `render`, `PUBLIC_ROUTES`.
