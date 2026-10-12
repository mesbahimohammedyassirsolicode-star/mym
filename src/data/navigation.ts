export interface NavigationItem {
  label: string;
  to: string;
}

export const primaryNavigation: NavigationItem[] = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Projects", to: "/projects" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];
