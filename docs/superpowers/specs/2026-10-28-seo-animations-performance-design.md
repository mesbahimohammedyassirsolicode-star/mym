# Aurasoli — SEO, Motion, and Performance Upgrade

Date: 2026-10-28
Status: Design approved in conversation; pending written-spec review

## Context

Aurasoli (https://www.aura-soli.online) is a Vite 6 + React 19 single-page
application using React Router 7 and deployed on Vercel. `index.html` contains
only `<div id="root"></div>`, so crawlers and social previews see an empty
shell. Metadata is applied after mount by a custom `usePageMeta` hook and omits
canonical URLs, Open Graph images, and structured data. The site already has a
dark visual identity, semantic page structure, one `<h1>` per page, focus rings,
and `prefers-reduced-motion` handling.

The work has three goals:

1. Add subtle, premium motion without hurting Core Web Vitals or hiding content
   from crawlers.
2. Prerender every route so real HTML, headings, links, metadata, and JSON-LD
   are delivered before JavaScript runs.
3. Improve performance and deployment configuration while preserving the
   existing copy, brand, logo artwork, and color palette.

## Constraints

- Do not change visible copy, brand name, logo artwork, or colors.
- Keep React 19, React Router 7, Vite 6, and Vercel.
- Prerendered HTML must be readable without JavaScript.
- Animate only `transform` and `opacity`; protect CLS.
- Respect `prefers-reduced-motion`.
- Work in small, reviewable commits.
- Production origin is `https://www.aura-soli.online` (canonical host = www).

## Non-goals

- No CMS, blog, localization, or new pages.
- No redesign, typography changes, or palette changes.
- No analytics replacement.
- No fabricated social profiles in structured data.

## Architecture

### Shared route configuration

Create `src/app/routes.tsx` exporting the route array currently in
`src/app/router.tsx`:

- `/` — HomePage
- `/services` — ServicesPage
- `/projects` — ProjectsPage
- `/about` — AboutPage
- `/contact` — ContactPage
- `*` — NotFoundPage

Pages are loaded with `React.lazy` so each route becomes its own client chunk.
`MainLayout` remains the parent route element.

`src/app/App.tsx` becomes a small shell that receives a router instance:

```tsx
export default function App({ router }: { router: Router }) {
  return <RouterProvider router={router} />;
}
```

The browser entry (`src/main.tsx`) creates the router with
`createBrowserRouter(routes)`. This removes the module-level browser-router
creation that prevents server rendering.

### Server entry and prerendering

Add `src/entry-server.tsx`:

1. `createStaticHandler(routes)`.
2. `handler.query(new Request(`${SITE_URL}${url}`))` to resolve matched routes,
   lazy modules, and loaders.
3. `createStaticRouter(routes, context)` and render
   `<StaticRouterProvider router={router} context={context} />` inside
   `HelmetProvider`.
4. Return `{ html, head }` where `head` is built from the Helmet context
   (`title`, `meta`, `link`, `script`).

`createStaticHandler` is expected to resolve the `React.lazy` route modules
during `query`. If it does not, the fallback is to import page modules eagerly
in the client route config and keep only the EmailJS split; this is decided
during implementation by a build test.

Add `scripts/prerender.mjs`, run after both builds:

1. Read `dist/index.html` as the template.
2. For each public route, call the server render and write:
   - `/` → `dist/index.html`
   - `/services` → `dist/services/index.html`
   - `/projects` → `dist/projects/index.html`
   - `/about` → `dist/about/index.html`
   - `/contact` → `dist/contact/index.html`
   - `*` (rendered at `/404`) → `dist/404.html`
3. Replace the root placeholder with rendered markup.
4. Replace the head placeholder with Helmet output, preserving static tags
   (charset, viewport, theme-color, icons, preloads).
5. Inject a preload link for the hashed Latin Inter woff2.
6. Write `dist/sitemap.xml` with the five public URLs and the build date as
   `lastmod`. `public/sitemap.xml` remains the committed fallback.
7. Write `dist/robots.txt` unchanged (allow all, sitemap URL).

Build script:

```json
"build": "tsc -b && vite build && vite build --ssr src/entry-server.tsx --outDir .ssr && node scripts/prerender.mjs"
```

`.ssr/` is temporary and added to `.gitignore`.

### Hydration

`src/main.tsx` wraps the app in `HelmetProvider`, uses `hydrateRoot` when the
root element already has server markup, and `createRoot` in development.
`@vercel/analytics` remains client-only.

To avoid hydration mismatches:

- `useCountUp` starts at `0` on both server and client; reduced-motion users are
  set to the target inside the effect.
- Footer year is deterministic at build and hydration time.
- No `window` or `document` access during render or module evaluation.

## Metadata and SEO

### Head management

Add `react-helmet-async@3` (React 19 compatible) and replace
`src/hooks/usePageMeta.ts` with a single `src/components/seo/Seo.tsx` component.
Props: `title`, `description`, `path`, optional `image`, `type`, `noindex`,
and `jsonLd`.

The component renders:

- `<title>` and `<meta name="description">`
- `<link rel="canonical" href={`${SITE_URL}${path}`}>`
- `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`,
  `og:image`, `og:image:width`, `og:image:height`, `og:image:alt`
- `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`,
  `twitter:image`
- `<meta name="robots" content="noindex, nofollow">` for 404
- JSON-LD scripts

`SITE_URL` in `src/config/site.ts` gets a production fallback so canonical URLs
never depend on a missing Vercel environment variable:

```ts
const rawSiteUrl =
  import.meta.env.VITE_SITE_URL?.trim() || "https://www.aura-soli.online";
```

### Proposed titles and descriptions

Titles target 50–60 characters and descriptions 140–160 characters. Final
values are length-checked during implementation; wording may be adjusted only
to hit those ranges.

| Route | Title | Description theme |
|---|---|---|
| `/` | Aurasoli \| Digital Solutions, Web Development & Automation | Digital solutions, web development, automation, and online growth |
| `/services` | Web Development, Automation & Digital Solutions \| Aurasoli | Seven services, from web development and SaaS to SEO, automation, and branding |
| `/projects` | Digital Solutions & Web Development Projects \| Aurasoli | Conceptual product examples: operations systems, SaaS platforms, mobile apps |
| `/about` | About Aurasoli \| Digital Solutions Partner for Business | Mission, approach, and values of a digital solutions partner |
| `/contact` | Contact Aurasoli \| Start Your Digital Solutions Project | Share goals and requirements for web development or automation work |
| 404 | Page Not Found \| Aurasoli | Short recovery message; `noindex` |

The keywords "digital solutions", "web development", and "automation" appear
naturally in titles, descriptions, and structured data. Visible page copy is not
rewritten.

### Structured data

Site-wide (rendered once in `MainLayout`):

- `Organization` — `@id` `#organization`, name "Aurasoli", url, logo
  (ImageObject with dimensions), description, `sameAs` only when real profile
  URLs are supplied.
- `WebSite` — `@id` `#website`, name, url, publisher reference.

Page-level:

- `/services` — `ItemList` of `Service` entries (name, description, provider).
- 404 — no structured data.

No postal address, phone number, rating, or social profile is invented.

### Social image and icons

Generate once with `sharp` (dev-only) and commit the outputs:

- `public/og-image.png` — 1200×630, existing logo centered on `#0B0C0F` with a
  subtle clay radial glow. No new text.
- `public/assets/logo/Aurasoli-logo-352.{avif,webp,png}` and
  `-704.{avif,webp,png}` for a `<picture>` with 1x/2x sources.
- `public/favicon-32x32.png`, `public/apple-touch-icon.png` (180×180),
  `public/icon-192.png`, `public/icon-512.png`, and `public/site.webmanifest`.

The original logo and icon files remain untouched as source/brand assets.

### Semantic and accessibility fixes

- Logo `alt` becomes "Aurasoli logo" (navbar and footer).
- Header logo is eager with `fetchpriority="high"`; footer logo stays lazy.
- Every image keeps explicit `width`/`height`.
- Verify one `<h1>` per route and a logical heading order; fix only if the
  prerender audit finds a violation.
- Decorative graphics remain `aria-hidden`.

## Motion design

### Scroll reveals

Add `src/components/motion/Reveal.tsx` and `src/hooks/useInViewOnce.ts`.

- Server output is normal, visible markup: no `opacity: 0` in the HTML or static
  CSS.
- After hydration, elements whose top is below the viewport are marked
  "armed" (translated 20 px, opacity 0) and observed.
- IntersectionObserver adds a visible class once, then disconnects.
- CSS transition: opacity + transform, 600 ms, ease-out, optional 60 ms stagger
  per item capped at 240 ms.
- Elements already in the viewport are not armed, avoiding a flash.
- If the observer is unavailable or reduced motion is requested, nothing is
  armed and content stays visible.

Apply to section headers, service cards, value cards, approach steps, project
cards, mission aims, contact columns, and CTA panels.

### Hero

- CSS keyframe entrance for eyebrow, h1 lines, lead, and actions, staggered
  80–120 ms, 500–700 ms, ease-out, `animation-fill-mode: both`.
- Existing hero glow elements gain a slow (18–22 s) opacity/transform drift
  using the existing clay/ochre tints.
- No hero raster exists; the above-the-fold logo is the only image to preload.

### Buttons, cards, navbar, menu

- Buttons: 200 ms lift (−2 px) and soft clay glow; focus rings unchanged.
- Cards: 200 ms lift and border/glow emphasis; hover-only via
  `@media (hover: hover) and (pointer: fine)`.
- Navbar: transparent at the top; a blurred `--nav-bg` layer fades in after
  scrolling (rAF-throttled scroll listener). Border also fades.
- Mobile menu: animated enter and exit (opacity + transform), with the existing
  focus trap, Escape handling, and body scroll lock preserved. Reduced motion
  makes it instant.
- All durations stop at 220 ms except hero/reveals.

### Route transitions

- Enable React Router `viewTransition` on internal links and buttons where
  supported; scope the transition to `<main>` so the header and footer do not
  flicker.
- CSS cross-fade: outgoing ~120 ms, incoming ~200 ms.
- Fallback for unsupported browsers: a 200 ms fade/4 px rise on the new route
  content only.
- Reduced motion disables both.
- Scroll-to-top/hash behavior in `MainLayout` stays intact.

## Performance design

- Prerendered HTML for all routes and hydration instead of a blank SPA mount.
- Route-level code splitting (`React.lazy`) plus dynamic
  `import("@emailjs/browser")` only when the contact form is submitted.
- `manualChunks`: React/React DOM/React Router, `lucide-react`, and
  `@vercel/analytics`.
- Optimized logo via `<picture>`/`srcset` with dimensions; AVIF/WebP/PNG.
- Preload the Latin Inter woff2 (hashed filename injected at build) and the
  header logo. Fontsource already provides `font-display: swap`.
- No new runtime animation dependency.
- Do not remove any currently used dependency.

Targets: LCP < 2.5 s, CLS < 0.1, INP < 200 ms, Lighthouse mobile 95+ for
Performance, SEO, Accessibility, and Best Practices. Actual scores are
reported, not assumed.

## Deployment configuration

`vercel.json`:

- Redirect `aura-soli.online` (apex) to `https://www.aura-soli.online` with
  status 301.
- `cleanUrls: true`, `trailingSlash: false`.
- Remove the catch-all rewrite; known routes are real HTML and unknown routes
  use `dist/404.html`.
- `Cache-Control: public, max-age=31536000, immutable` for `/assets/(.*)`.
  Note: logo files live under `/assets/logo/` and are not content-hashed; this
  is called out in the final report.
- Security headers on all routes:
  `Strict-Transport-Security`, `X-Content-Type-Options`,
  `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, and a
  Content-Security-Policy allowing self, inline JSON-LD/styles, Vercel
  Analytics, and `https://api.emailjs.com`.

## Verification plan

1. `npm run lint`, `npm run build`.
2. Inspect `dist/index.html`, `dist/services/index.html`, and the other route
   files for: one `<h1>`, real body copy, canonical, title, description, OG
   tags, and JSON-LD.
3. Parse every JSON-LD block with `JSON.parse`.
4. Check title/description lengths are in range.
5. Verify `dist/404.html`, `dist/sitemap.xml`, `dist/robots.txt`, and
   `og-image.png` (1200×630).
6. Serve `dist` with `vite preview` and fetch each route to confirm 200s and
   raw HTML content.
7. Run Lighthouse mobile in headless Chrome against `vite preview`; save the
   report and report scores plus any remaining issues.
8. Manually confirm reduced-motion behavior and keyboard focus states.
9. Provide the Google Search Console checklist.

## Commit plan

1. `feat(seo): prerender all routes with React Router static rendering`
2. `feat(seo): per-page head tags, structured data, OG image and icons`
3. `feat(ui): scroll reveals and hero entrance`
4. `feat(ui): navbar, mobile menu and route transitions`
5. `perf: optimize assets, fonts and split EmailJS`
6. `chore(deploy): caching, security headers and clean 404`
7. `docs: document prerendering, metadata and deployment changes`

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| `createStaticHandler` does not resolve lazy routes | Fall back to eager page imports; keep EmailJS split |
| Hydration mismatch | Deterministic initial state, no browser APIs during render |
| Helmet duplicates static tags | Remove route-level tags from `index.html`; verify head output |
| View Transitions change scroll behavior | Scope to `<main>`; fall back to fade-in; test |
| CSP breaks analytics/EmailJS | Explicit allowlist; verify console during preview |
| Immutable cache on unhashed logo files | Documented; rename files when the logo changes |
| Prerender script fails on Windows paths | Use `node:path`/`URL` APIs; test the full build |
