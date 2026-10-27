export const SITE_NAME = "Aurasoli";

const rawSiteUrl = import.meta.env.VITE_SITE_URL?.trim() ?? "";

export const SITE_URL = rawSiteUrl.replace(/\/+$/, "");
