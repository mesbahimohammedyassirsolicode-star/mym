# MYM — Make Your Move

Architecture foundation for the official MYM website, built with React,
TypeScript, Vite, and React Router. Inter is bundled locally as a variable font.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Install and run

```sh
npm install
npm run dev
```

Vite prints the local development URL after startup. Its development server
provides SPA fallback so each route can be opened or refreshed directly.

## Routes

- `/` — Home
- `/services` — Services
- `/projects` — Projects
- `/about` — About
- `/contact` — Contact
- Unknown paths — Not Found

## Environment

Copy `.env.example` to `.env` and set the public site origin:

```sh
VITE_SITE_URL=https://www.your-domain.com
```

`VITE_SITE_URL` is only used to build canonical and Open Graph URLs. When it is
empty, no canonical or `og:url` tags are emitted, so no domain is assumed. This
value is public by design — never place secrets in `VITE_`-prefixed variables.

## Metadata and SEO

- Every route sets its own document title, meta description, and matching
  `og:title` / `og:description` / `twitter:title` / `twitter:description`.
- Canonical and `og:url` tags are emitted per route only when `VITE_SITE_URL`
  is set.
- `public/robots.txt` currently allows all crawlers. A `Sitemap:` directive and
  a `public/sitemap.xml` should be added once the production domain is known.
- An Open Graph preview image is intentionally not set yet: no approved raster
  (for example 1200×630 PNG) asset exists. Social platforms do not reliably use
  SVG, so this waits on an approved export of the MYM mark.

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

Until the Service ID is supplied and the dashboard setup is complete, real
delivery remains unverified.

## Deployment

The build is a static single-page application:

```sh
npm run build
npm run preview
```

- Output directory: `dist`.
- Hosting must rewrite unknown paths to `/index.html` (SPA fallback), otherwise
  deep links such as `/services` or `/about` return 404 on refresh.
- Serve over HTTPS. Set security headers at the host/CDN (for example
  `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, and
  HSTS); they are not configured in the repository.
- These hosting-specific settings depend on the chosen platform and are
  intentionally not guessed here.

## Validation and production build

```sh
npm run lint
npx tsc -b
npm run build
```

Use `npm run preview` to serve the production build locally.

## Project structure

- `src/app` — application entry and route configuration
- `src/layouts` — shared page layouts
- `src/components` — reusable layout, navigation, and UI foundations
- `src/pages` — route-level pages
- `src/data` and `src/types` — typed content data and models
- `src/styles` — design tokens, global styles, and utilities
- `public` — static assets and site metadata files

Design tokens are centralized in `src/styles/tokens.css`, following the
supplied MYM design guide. The official logo is stored at
`public/assets/logo/MYM-logo.svg` and used on dark surfaces without modifying
its artwork. The favicon remains a neutral placeholder
(`public/favicon.svg`) until an approved MYM app-icon asset is available.
