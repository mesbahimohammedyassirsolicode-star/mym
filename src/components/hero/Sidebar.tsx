import {
  FolderKanban,
  Inbox,
  LayoutDashboard,
  Settings2,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { heroNav } from "../../data/heroVisual";
import type { NavIcon } from "../../types/heroVisual";

const navIcons: Record<NavIcon, LucideIcon> = {
  overview: LayoutDashboard,
  projects: FolderKanban,
  requests: Inbox,
  clients: Users,
  settings: Settings2,
};

export default function Sidebar() {
  return (
    <aside className="hv-ui__side">
      <span className="hv-ui__mark" aria-hidden="true">
        M
      </span>
      <nav className="hv-ui__nav">
        {heroNav.map((item) => {
          const Icon = navIcons[item.icon];

          return (
            <span
              key={item.id}
              className={
                item.active
                  ? "hv-ui__nav-item hv-ui__nav-item--active"
                  : "hv-ui__nav-item"
              }
            >
              <Icon aria-hidden="true" />
              <span className="hv-ui__nav-label">{item.label}</span>
            </span>
          );
        })}
      </nav>
    </aside>
  );
}
