export const SITE_NAME = "Aurasoli";

const rawSiteUrl =
  import.meta.env.VITE_SITE_URL?.trim() || "https://www.aura-soli.online";

export const SITE_URL = rawSiteUrl.replace(/\/+$/, "");
