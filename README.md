# Aurasoli

Official Aurasoli website, built with React, TypeScript, Vite, and React Router.
Inter is bundled locally as a variable font. Every route is prerendered to static
HTML at build time, so content and metadata are present without JavaScript.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Install and run

```sh
npm install
npm run dev
```

Vite prints the local development URL after startup. The development server
provides an SPA fallback so each route can be opened or refreshed directly.

On Windows PowerShell, invoke npm as `npm.cmd` (for example
`npm.cmd run build`).

## Routes

- `/` — Home
- `/services` — Services
- `/projects` — Projects
- `/about` — About
- `/contact` — Contact
- Unknown paths — Not Found

## Build output

```sh
npm run build
```

The build runs `tsc -b`, the client Vite build, a server bundle used only for
prerendering, and `scripts/prerender.mjs`. It does not produce an SPA rewrite;
it writes real HTML for every route:

- `dist/index.html` — Home
- `dist/services/index.html`
- `dist/projects/index.html`
- `dist/about/index.html`
- `dist/contact/index.html`
- `dist/404.html` — custom Not Found page (`noindex, nofollow`)
- `dist/sitemap.xml` — five URLs with `lastmod`, `changefreq`, and `priority`
- `dist/robots.txt` — copied from `public/robots.txt`
- `dist/assets/*` — content-hashed JS, CSS, and fonts
- `dist/og-image.png`, icons, and `dist/site.webmanifest` — copied from `public`

Because the HTML is written at build time, each route already contains its page
copy, `<h1>`, title, description, canonical, Open Graph/Twitter tags, and
JSON-LD before the JavaScript module runs. Search engines and social crawlers do
not need to execute JavaScript to see them.

Verify the production output after a build:

```sh
npm run verify
```

This checks prerendering, per-page SEO tags, structured data and sitemap, image
assets, motion safeguards, UI behaviour, route splitting/fonts, and the Vercel
deployment configuration.

## Environment

`src/config/site.ts` resolves the public site origin from `VITE_SITE_URL`, with a
production fallback of `https://www.aura-soli.online`:

```sh
VITE_SITE_URL=https://www.aura-soli.online
```

Setting it is optional for the current production domain; the fallback keeps
canonical, Open Graph, and JSON-LD URLs stable when the variable is absent.
`VITE_SITE_URL` changes those rendered URLs only. `sitemap.xml` and `robots.txt`
are always generated with the production origin, so a staging deployment must
stay `noindex` and must not be submitted to Search Console. The value is public
by design — never place secrets in `VITE_`-prefixed variables.

If the domain changes, update the fallback in `src/config/site.ts`, the matching
constant in `scripts/prerender.mjs`, and `public/robots.txt`.

All `VITE_`-prefixed variables are inlined at build time, so they **must also be
set in the hosting platform's environment** (for this project, the Vercel
project settings). See the deployment section for the full list.

## Metadata and SEO

- Every route sets its own document title, meta description, canonical URL, and
  matching `og:title` / `og:description` / `og:url` /
  `twitter:title` / `twitter:description` tags.
- The home page emits `Organization` and `WebSite` JSON-LD; the services page
  emits an `ItemList` of `Service` entries with stable `#service` anchors.
- The 404 page emits no canonical and no JSON-LD, and is marked
  `noindex, nofollow`.
- `public/robots.txt` allows all crawlers and points to
  `https://www.aura-soli.online/sitemap.xml`. The sitemap is generated during
  the build and lists the five public routes. `public/sitemap.xml` is a legacy
  copy that the build overwrites in `dist`; change `scripts/prerender.mjs`, not
  the public file.
- `public/og-image.png` is a 1200×630 PNG used for Open Graph and Twitter
  previews.
- Generated favicon, Apple touch icon, and PWA icons live in `public/` along
  with `site.webmanifest`.

## Contact form

The contact form performs full client-side validation and accessible focus and
error handling, and delivers messages through
[EmailJS](https://www.emailjs.com/) using the official `@emailjs/browser`
package. Delivery runs in the browser with the EmailJS **Public Key** only — the
EmailJS **Private Key** is never used, bundled, or stored in this project.

`src/services/contactSubmission.ts` reads its configuration from Vite env vars:

```sh
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
```

It validates that all three are present before sending. When any is missing it
returns a typed `{ delivered: false, reason: "missing-config" }` result and the
UI shows an honest, retryable error (values are preserved; nothing is claimed as
delivered). The UI only reports success after EmailJS confirms the send.

Dashboard setup (owner steps):

1. Create/select an Email Service under **EmailJS → Email Services** and copy its
   **Service ID** into `VITE_EMAILJS_SERVICE_ID`.
2. Copy the **Public Key** (EmailJS → Account → General) into
   `VITE_EMAILJS_PUBLIC_KEY`.
3. Create a template using the variables `from_name`, `reply_to`, `company`,
   `service`, `budget`, and `project_details`, set **Reply-To** to
   `{{reply_to}}`, and copy the **Template ID** into `VITE_EMAILJS_TEMPLATE_ID`.
4. The recipient is whatever address is configured on the EmailJS account for
   that service; it is not set (and must not be guessed) in this code.

The `@emailjs/browser` SDK is loaded lazily when the form is submitted, so it is
not part of the initial page bundle. Until the Service ID is supplied and the
dashboard setup is complete, real delivery remains unverified.

## Deployment

The project deploys as static files on Vercel:

```sh
npm run build
npm run preview
```

- Build command: `npm run build`. Output directory: `dist`.
- `vercel.json` sets `cleanUrls: true` and `trailingSlash: false`, so routes are
  served at `/services`, `/projects`, `/about`, and `/contact` without `.html`
  or a trailing slash.
- An apex redirect sends `https://aura-soli.online/*` with a `301` to
  `https://www.aura-soli.online/*`. Only the `www` host is canonical.
- Unknown paths are served by `dist/404.html` with a real 404 status. There is
  no catch-all rewrite to `/index.html`.
- Security headers are applied by `vercel.json` to all responses:
  `Content-Security-Policy`, `Strict-Transport-Security`,
  `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, and
  `Permissions-Policy`. The CSP allows the Vercel analytics endpoints and
  `https://api.emailjs.com` for contact-form submissions.
- Files under `/assets/*` are served with
  `Cache-Control: public, max-age=31536000, immutable`. Vite content-hashes the
  JS, CSS, and font filenames, so this is safe for them.
- **The logo files under `/assets/logo/*` are not content-hashed.** Because they
  receive the same immutable cache header, rename the files (or otherwise change
  their URLs) whenever the artwork changes; replacing them in place would leave
  returning visitors and CDNs on the old image.
- Vercel Web Analytics is mounted from the React entry point. Enable Web
  Analytics in the Vercel project dashboard to view production traffic.
- `vercel.json` headers and clean URLs are only applied by Vercel. `npm run
  preview` serves the static build with Vite's SPA fallback and without those
  headers, so route resolution, redirects, and CSP must be checked on a Vercel
  preview deployment.
- Environment variables to configure on Vercel (Project → Settings →
  Environment Variables) before the production build:
  - `VITE_SITE_URL` — optional override for canonical, Open Graph, and JSON-LD
    URLs only (the code falls back to `https://www.aura-soli.online`).
    `sitemap.xml` and `robots.txt` always use the production origin.
  - `VITE_EMAILJS_PUBLIC_KEY` — EmailJS Public Key.
  - `VITE_EMAILJS_SERVICE_ID` — EmailJS Service ID.
  - `VITE_EMAILJS_TEMPLATE_ID` — EmailJS Template ID.

After deploying, follow [the SEO launch checklist](docs/seo-launch-checklist.md)
for Search Console verification, sitemap submission, URL inspection, and Core
Web Vitals review.

## Validation and production build

```sh
npm run lint
npm run build
npm run verify
```

`npm run lint` runs ESLint, `npm run build` type-checks and builds the client,
server bundle, and prerendered output, and `npm run verify` runs the full
production verification suite against `dist`. Use `npm run preview` to serve the
production build locally.

## Project structure

- `src/app` — application entry and route configuration
- `src/config` — site origin, page metadata, and structured data
- `src/layouts` — shared page layouts
- `src/components` — reusable layout, navigation, and UI foundations
- `src/pages` — route-level pages
- `src/data` and `src/types` — typed content data and models
- `src/styles` — design tokens, global styles, and utilities
- `public` — static assets and site metadata files
- `scripts` — asset generation, prerendering, and build verification
- `docs/seo-launch-checklist.md` — post-deploy Search Console checklist

Design tokens are centralized in `src/styles/tokens.css` and implement the
Aurasoli palette. The supplied Aurasoli wordmark is used in the header and
footer, with responsive AVIF, WebP, and PNG exports at
`public/assets/logo/Aurasoli-logo-352.*` and
`public/assets/logo/Aurasoli-logo-704.*`. The transparent PNG web version
renders the supplied dark lettering in Cloud for legibility on the site's dark
surfaces while preserving the Clay/Ochre mark. The generated monogram icons in
`public/` are used for the favicon, Apple touch icon, and web manifest.
