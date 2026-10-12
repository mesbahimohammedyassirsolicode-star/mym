import type {
  BarDatum,
  NavItem,
  PanelItem,
  ProgressDatum,
  Stat,
} from "../types/heroVisual";

export const heroNav: NavItem[] = [
  { id: "overview", label: "Overview", icon: "overview", active: true },
  { id: "projects", label: "Projects", icon: "projects" },
  { id: "requests", label: "Requests", icon: "requests" },
  { id: "clients", label: "Clients", icon: "clients" },
  { id: "settings", label: "Settings", icon: "settings" },
];

export const heroStat: Stat = {
  label: "This week",
  value: 48,
};

export const heroProgress: ProgressDatum = {
  label: "Automation coverage",
  value: 72,
};

export const activityBars: BarDatum[] = [
  { id: "day-01", label: "1", value: 21 },
  { id: "day-02", label: "2", value: 34 },
  { id: "day-03", label: "3", value: 26 },
  { id: "day-04", label: "4", value: 45 },
  { id: "day-05", label: "5", value: 30 },
  { id: "day-06", label: "6", value: 58 },
  { id: "day-07", label: "7", value: 37 },
  { id: "day-08", label: "8", value: 24 },
  { id: "day-09", label: "9", value: 49 },
  { id: "day-10", label: "10", value: 33 },
  { id: "day-11", label: "11", value: 63 },
  { id: "day-12", label: "12", value: 29 },
  { id: "day-13", label: "13", value: 46 },
  { id: "day-14", label: "14", value: 38 },
  { id: "day-15", label: "15", value: 54 },
  { id: "day-16", label: "16", value: 23 },
  { id: "day-17", label: "17", value: 41 },
  { id: "day-18", label: "18", value: 35 },
];

export const panelItems: PanelItem[] = [
  { id: "website-redesign", title: "Website redesign" },
  { id: "automation-setup", title: "Automation setup" },
  { id: "client-portal", title: "Client portal" },
  { id: "seo-audit", title: "SEO audit" },
  { id: "crm-sync", title: "CRM sync" },
];

export const panelLink = "View all requests";

export const badgeLines = ["Build.", "Automate.", "Grow.", "Forward."];
export const badgeAccentLine = "Forward.";
