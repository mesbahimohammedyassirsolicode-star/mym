export const SITE_NAME = "Aurasoli";

/**
 * Public origin used for canonical, Open Graph and structured-data URLs.
 * `PUBLIC_SITE_URL` is optional: `astro.config.mjs` already declares the
 * production origin via `site`, so a missing env var is not a failure.
 */
const rawSiteUrl =
  import.meta.env.PUBLIC_SITE_URL?.trim() || "https://www.aura-soli.online";

export const SITE_URL = rawSiteUrl.replace(/\/+$/, "");

export const SITE_DESCRIPTION =
  "Aurasoli builds digital solutions that help businesses develop their ideas, automate operations, and grow their digital presence, from websites to automation.";

export const SITE_TAGLINE = "Make Your Move.";
