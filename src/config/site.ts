export const SITE_NAME = "MYM — Make Your Move";

const rawSiteUrl = import.meta.env.VITE_SITE_URL?.trim() ?? "";

export const SITE_URL = rawSiteUrl.replace(/\/+$/, "");
