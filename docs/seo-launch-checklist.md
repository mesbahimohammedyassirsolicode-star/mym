# SEO launch checklist

Run this checklist once the site is live on Vercel at
`https://www.aura-soli.online/`. The build already prerenders every route, emits
canonical URLs, Open Graph metadata, JSON-LD, `robots.txt`, and a five-URL
`sitemap.xml`, so the steps below are verification and Search Console
submission tasks rather than code changes.

Expected values:

- Canonical host: `https://www.aura-soli.online` (www, HTTPS).
- Indexable routes: `/`, `/services`, `/projects`, `/about`, `/contact`.
- Sitemap entries: five `<loc>` values pointing at those routes.
- `dist/404.html` is excluded from indexing with `noindex, nofollow`.

## Checklist

1. **Verify the property in Search Console.** Verify
   `https://www.aura-soli.online/` in Google Search Console as a domain property
   or a URL-prefix property, and keep the existing verification meta tag in
   `index.html`.

2. **Submit the sitemap.** Submit
   `https://www.aura-soli.online/sitemap.xml` in Search Console and confirm that
   five URLs are discovered.

3. **Inspect every route.** Use URL Inspection on `/`, `/services`, `/projects`,
   `/about`, and `/contact`. For each route choose **Test Live URL**, confirm the
   rendered HTML contains the page copy, the correct canonical URL, and the
   expected title, then choose **Request Indexing**.

4. **Confirm the apex redirect.** Confirm that `https://aura-soli.online`
   redirects with HTTP `301` to `https://www.aura-soli.online` and that only the
   `www` URLs become indexed.

5. **Check the 404 behaviour.** Confirm that unknown paths return a real HTTP
   `404` status (not a soft 404 or a 200 SPA fallback) and display the custom 404
   page, and that the 404 page is marked `noindex`.

6. **Review Page Indexing.** Check the Page Indexing report for duplicates or
   "Discovered – currently not indexed" entries. Fix canonical or content issues
   before resubmitting.

7. **Review Core Web Vitals after 28 days.** Check Core Web Vitals (LCP < 2.5 s,
   CLS < 0.1, INP < 200 ms) and mobile usability, and address any field-data
   regressions.

8. **Resubmit after URL changes.** Re-run the sitemap submission after a domain
   change or any change to the URL structure.
