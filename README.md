# Aurasoli

Official Aurasoli website, built with Astro and TypeScript. Every route is
pre-rendered to static HTML at build time, so crawlers, link previews and AI
tools see the real headings and copy without executing JavaScript. React is
shipped only for the contact form island; all other interactivity runs from a
few kilobytes of vanilla script. Inter is bundled locally as a variable font.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Install and run

```sh
npm install
npm run dev
```

Astro prints the local development URL after startup.

## Scripts

- `npm run dev` — Astro development server with HMR.
- `npm run build` — `astro check` (type and template validation), then
  `astro build`, then `scripts/generate-llms-full.mjs`; writes the static site
  and `dist/llms-full.txt`.
- `npm run preview` — serve the built `dist/` output locally.
- `npm run lint` — ESLint over the JavaScript/TypeScript sources.
- `npm run verify` — sanity-check a finished build (see below).
- `npm run favicons` — regenerate the PNG favicon set from the logo.
- `npm run llms` — rebuild `public/llms-full.txt` from an existing `dist/`
  without a full rebuild.

## Routes

Each route is a file under `src/pages` and is emitted as
`dist/<route>/index.html`:

- `/` — Home (`src/pages/index.astro`)
- `/services` — Services (`src/pages/services.astro`)
- `/projects` — Projects index with the category filter
  (`src/pages/projects/index.astro`)
- `/projects/<projectId>` — One case study per entry in
  `src/data/projects.ts`, generated with `getStaticPaths`
  (`src/pages/projects/[projectId].astro`)
- `/about` — About (`src/pages/about.astro`)
- `/contact` — Contact (`src/pages/contact.astro`)
- Unknown paths — Not Found, emitted as `dist/404.html`
  (`src/pages/404.astro`)

## Rendering model

- `src/layouts/BaseLayout.astro` owns the document shell: `<html lang>`, meta
  tags, canonical link, Open Graph and Twitter tags, favicon, theme color,
  font preload, JSON-LD and the shared `Navbar` / `Footer` with the
  `#main-content` landmark.
- `src/components/sections/<page>/` holds one presentational `.astro` component
  per page section, with that page's CSS next to it. These ship no JavaScript.
- `src/components/hero/` holds the hero mockup (dashboard preview) as `.astro`
  components. The dashboard numbers count up and the mockup tilts with the
  pointer; both effects run from one small bundled script that respects
  `prefers-reduced-motion` and coarse pointers.
- The mobile navigation is Astro markup plus a small vanilla script. It lives
  outside `<header>` on purpose: the header's `backdrop-filter` makes it a
  containing block for `position: fixed` descendants.
- `src/components/islands/ContactForm.tsx` is the only React island and is
  hydrated with `client:load` on `/contact`.
- Icons come from `@lucide/astro` in static components and from `lucide-react`
  inside the React island.

## Environment

Copy `.env.example` to `.env`. Only `PUBLIC_`-prefixed variables reach the
browser, and they are inlined at build time, so they **must also be set in the
Vercel project settings** before a production build.

```sh
PUBLIC_SITE_URL=https://www.aura-soli.online
PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
```

`PUBLIC_SITE_URL` only overrides the origin used for canonical and Open Graph
URLs; when it is empty the site falls back to the `site` value in
`astro.config.mjs` (`https://www.aura-soli.online`). Never place secrets in a
`PUBLIC_` variable.

## Metadata and SEO

- Every page passes a unique `title` (50–60 characters) and `description`
  (140–160 characters) to `BaseLayout`, which renders the canonical URL from
  `Astro.site` plus `og:title`/`og:description`/`og:url`/`og:image` and the
  matching Twitter tags (`summary_large_image`).
- One `<h1>` per page, semantic `header`/`nav`/`main`/`footer` landmarks, an
  `aria-labelledby` on every section, descriptive alternative text on every
  image, `<address>` in the footer, and a skip link to `#main-content`.
- JSON-LD in `BaseLayout` is a single `@graph` containing a
  `ProfessionalService` node, a `WebSite` node, one `Service` node per entry in
  `src/data/services.ts`, plus `BreadcrumbList` on inner pages and `FAQPage` on
  the homepage. It is built from the same data the components render, so the
  markup never describes content a visitor cannot see. Contact details, social
  profiles and location are deliberately omitted until the business publishes
  them (see **Open questions**).
- Breadcrumbs are imported from the page's `breadcrumbs` prop — the same array
  feeds the visible `<nav class="breadcrumb">` and the structured data.
- `@astrojs/sitemap` writes `dist/sitemap-index.xml` and `dist/sitemap-0.xml`
  from the `site` origin, with a `lastmod` taken from the latest git commit.
  `public/robots.txt` allows all crawlers and points to the sitemap index.
- `public/favicon-16.png`, `favicon-32.png` and `apple-touch-icon.png` come from
  `scripts/generate-favicons.mjs` (`sharp`, flattened on the page background).
  The existing `google-site-verification` meta tag is preserved in
  `BaseLayout`.
- `public/og-image.png` is a 1200×630 placeholder generated by
  `scripts/generate-og-image.mjs` (`node scripts/generate-og-image.mjs`).
  Replace it with the final branded artwork, keeping the same path and size.
- `public/llms.txt` and `public/llms-full.txt` describe the site for AI answer
  engines; see **Machine readability**.
- Screenshots are served through `astro:assets` as responsive WebP; the
  automation workflow diagram stays an SVG and is passed through unchanged.

## Machine readability

Every route is plain HTML in the first response: no page content depends on
JavaScript, hydration or a fetch after load. The contact form hydrates as an
island but its labels, options and help text are already in the server markup.

- `public/robots.txt` allows every crawler and names the main AI agents
  explicitly (`GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`,
  `Claude-User`, `Claude-SearchBot`, `PerplexityBot`, `Google-Extended`,
  `Applebot-Extended`, `CCBot`) before the `Sitemap:` line.
- `public/llms.txt` follows the [llmstxt.org](https://llmstxt.org) format: the
  site name as `#`, a blockquote summary, then links to every page, to the seven
  service anchors and to the four case studies.
- `public/llms-full.txt` is generated by `scripts/generate-llms-full.mjs` from
  the built HTML: it extracts `<main>`, drops decorative subtrees
  (`aria-hidden`, the hero mockup), shifts heading levels and writes the plain
  text of every page under its canonical URL. It is regenerated by
  `npm run build`; never hand-edit it.
- `vercel.json` redirects the apex host `aura-soli.online` to
  `https://www.aura-soli.online`, so only one canonical origin serves pages.

## Contact form

The contact form performs full client-side validation with accessible focus and
error handling, and delivers messages through
[EmailJS](https://www.emailjs.com/) using `@emailjs/browser` from a React
island. Delivery runs in the browser with the EmailJS **Public Key** only — the
EmailJS **Private Key** is never used, bundled, or stored in this project.

`src/services/contactSubmission.ts` reads its configuration from
`PUBLIC_EMAILJS_*` variables. It validates that all three are present before
sending; when any is missing it returns a typed
`{ delivered: false, reason: "missing-config" }` result and the UI shows an
honest, retryable error (values are preserved; nothing is claimed as delivered).
The UI only reports success after EmailJS confirms the send.

Dashboard setup (owner steps):

1. Create/select an Email Service under **EmailJS → Email Services** and copy
   its **Service ID** into `PUBLIC_EMAILJS_SERVICE_ID`.
2. Copy the **Public Key** (EmailJS → Account → General) into
   `PUBLIC_EMAILJS_PUBLIC_KEY`.
3. Create a template using the variables `from_name`, `reply_to`, `company`,
   `service`, `budget`, and `project_details`, set **Reply-To** to
   `{{reply_to}}`, and copy the **Template ID** into
   `PUBLIC_EMAILJS_TEMPLATE_ID`.
4. The recipient is whatever address is configured on the EmailJS account for
   that service; it is not set (and must not be guessed) in this code.

Until the Service ID is supplied and the dashboard setup is complete, real
delivery remains unverified.

## Deployment

The build is a fully static site, so no Astro adapter is needed:

```sh
npm run build
npm run preview
```

- Output directory: `dist`, deployed to Vercel as static files.
- `vercel.json` enables clean URLs (`/services` instead of `/services/`),
  disables trailing slashes to match `trailingSlash: "never"`, redirects the
  apex host to `https://www.aura-soli.online`, and sets immutable cache headers
  for `/_astro/*` plus long-lived headers for `/assets/*`.
- Vercel Bot Management, Attack Challenge Mode and Deployment Protection can
  block the named AI crawlers even though `robots.txt` allows them. Keep the
  production domain public and check **Project → Firewall** for custom rules on
  `/` and `User-Agent`, and **Project → Settings → Deployment Protection** for
  Vercel Authentication on the production domain.
- Because each route is a real directory with an `index.html`, deep links such
  as `/projects/areach` resolve without any catch-all rewrite.
- Vercel Web Analytics is mounted with `@vercel/analytics/astro` inside
  `BaseLayout`; enable Web Analytics in the Vercel project dashboard. The
  insights script is only served on Vercel, so a 404 for
  `/_vercel/insights/script.js` in local preview is expected.
- Environment variables to configure on Vercel (Project → Settings →
  Environment Variables) before the production build:
  - `PUBLIC_SITE_URL` — the production origin (e.g.
    `https://www.aura-soli.online`).
  - `PUBLIC_EMAILJS_PUBLIC_KEY` — EmailJS Public Key.
  - `PUBLIC_EMAILJS_SERVICE_ID` — EmailJS Service ID.
  - `PUBLIC_EMAILJS_TEMPLATE_ID` — EmailJS Template ID.
- Serve over HTTPS. Security headers (for example `Content-Security-Policy`,
  `X-Content-Type-Options`, `Referrer-Policy`, and HSTS) belong at the
  host/CDN and are not configured in this repository.

## Validation and production build

```sh
npm run lint
npm run build
npm run verify
```

`npm run verify` runs two checkers over the emitted `dist/`:

- `scripts/verify-build.mjs` — canonical, Open Graph, Twitter and JSON-LD tags,
  `sitemap-index.xml`, `robots.txt`, `og-image.png`.
- `scripts/verify-ai-readability.mjs` — per route: `lang`, exactly one `<h1>`,
  landmarks, `<address>`, no empty root div, minimum visible copy, `alt` on every
  image, one parseable JSON-LD graph with `ProfessionalService`, `WebSite` and
  seven `Service` nodes, expected `BreadcrumbList`/`FAQPage`, visible breadcrumb
  and FAQ copy, robots meta. For the whole build: robots agent list and sitemap
  line, `llms.txt` structure and links, `llms-full.txt` content, favicons and a
  `lastmod` on every sitemap URL.

Use `npm run preview` to click through the built site locally.

## Project structure

- `src/pages` — routes (`.astro`), including `404.astro` and the dynamic
  project case studies
- `src/layouts/BaseLayout.astro` — document shell and SEO
- `src/components/sections` — page sections with their CSS
- `src/components/hero` — dashboard hero mockup
- `src/components/ui` — `Button`, `SectionHeader`, `ProjectCard`,
  `ProjectImage`, `SectionHeading`
- `src/components/layout`, `src/components/navigation` — footer, navbar,
  breadcrumbs
- `src/components/islands/ContactForm.tsx` — the only React island
- `src/data` and `src/types` — typed content data and models, including
  `src/data/faq.ts` (the FAQ shown on the homepage and emitted as `FAQPage`)
- `src/config/site.ts` — site name, tagline, description and default origin
- `src/styles` — design tokens, global styles, utilities, shared components and
  section styles
- `src/assets` — images processed by `astro:assets`
- `public` — passthrough assets (`og-image.png`, `llms.txt`, `llms-full.txt`,
  `robots.txt`, favicons, logo files)
- `scripts` — `generate-og-image.mjs`, `generate-favicons.mjs`,
  `generate-llms-full.mjs`, `verify-build.mjs`, `verify-ai-readability.mjs`

Design tokens are centralized in `src/styles/tokens.css` and implement the
Aurasoli palette. The Aurasoli wordmark (`src/assets/logo/Aurasoli-logo.png`) is
used in the header and footer and optimized by `astro:assets`; the monogram at
`public/assets/logo/Aurasoli-icon.png` is used as the icon favicon.

## Open questions

The FAQ and the Organization JSON-LD are limited to facts the site already
publishes. These details are still missing and would make the structured data
and the homepage copy both more complete and more quotable:

1. Business email address for `contactPoint.email` and a mailto link.
2. Phone or WhatsApp number, if Aurasoli wants calls.
3. City and country (or "remote worldwide") for `<address>` and `areaServed`.
4. Social profile URLs for `sameAs` (LinkedIn, Instagram, GitHub, X, …).
5. Who owns the code and design files after delivery.
6. Support and maintenance terms after launch (included window, retainer).
7. Typical project timelines and how pricing is structured (fixed scope,
   hourly, retainer).
8. Whether "Aurasoli" is a registered legal entity name, and the legal name to
   use in `Organization.legalName`.

Add the answers to `src/data/faq.ts` (new questions), `src/config/site.ts` and
the `organizationNode` in `src/layouts/BaseLayout.astro`, then run
`npm run verify`.
