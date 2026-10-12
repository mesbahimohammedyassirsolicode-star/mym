import type { PanelItem } from "../../types/heroVisual";

interface RightPanelProps {
  status: string;
  items: PanelItem[];
  link: string;
}

export default function RightPanel({ status, items, link }: RightPanelProps) {
  return (
    <aside className="hv-panel">
      <span className="hv-panel__pill">{status}</span>
      <ul className="hv-panel__list">
        {items.map((item) => (
          <li className="hv-panel__item" key={item.id}>
            <span className="hv-panel__dot" aria-hidden="true" />
            <span className="hv-panel__title">{item.title}</span>
          </li>
        ))}
      </ul>
      <span className="hv-panel__link">{link}</span>
    </aside>
  );
}
