export type NavIcon =
  | "overview"
  | "projects"
  | "requests"
  | "clients"
  | "settings";

export interface NavItem {
  id: string;
  label: string;
  icon: NavIcon;
  active?: boolean;
}

export interface Stat {
  label: string;
  value: number;
}

export interface ProgressDatum {
  label: string;
  value: number;
}

export interface BarDatum {
  id: string;
  label: string;
  value: number;
}

export interface PanelItem {
  id: string;
  title: string;
}
