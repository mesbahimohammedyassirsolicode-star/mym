import {
  Cloud,
  CodeXml,
  LayoutDashboard,
  Palette,
  Search,
  Smartphone,
  Workflow,
} from "@lucide/astro";
import type { AstroComponent } from "@lucide/astro";

export const serviceIcons: Record<string, AstroComponent> = {
  "web-development": CodeXml,
  "saas-platforms": Cloud,
  "mobile-applications": Smartphone,
  "management-systems": LayoutDashboard,
  "digital-marketing-seo": Search,
  "automation-integrations": Workflow,
  "brand-identity-branding": Palette,
};
