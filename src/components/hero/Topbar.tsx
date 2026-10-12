import { Search } from "lucide-react";

export default function Topbar() {
  return (
    <header className="hv-ui__topbar">
      <span className="hv-ui__title">Overview</span>
      <span className="hv-ui__spacer" />
      <span className="hv-ui__icon" aria-hidden="true">
        <Search />
      </span>
      <span className="hv-ui__avatar" aria-hidden="true" />
    </header>
  );
}
