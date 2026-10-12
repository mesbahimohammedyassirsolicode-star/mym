import {
  Cloud,
  Code2,
  LayoutDashboard,
  Palette,
  Search,
  Smartphone,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const serviceIcons: Record<string, LucideIcon> = {
  "web-development": Code2,
  "saas-platforms": Cloud,
  "mobile-applications": Smartphone,
  "management-systems": LayoutDashboard,
  "digital-marketing-seo": Search,
  "automation-integrations": Workflow,
  "brand-identity-branding": Palette,
};