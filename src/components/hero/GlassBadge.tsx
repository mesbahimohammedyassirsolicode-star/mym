import { ArrowUpRight } from "lucide-react";

interface GlassBadgeProps {
  lines: string[];
  accentLine: string;
}

export default function GlassBadge({ lines, accentLine }: GlassBadgeProps) {
  return (
    <div className="hv-badge">
      <span className="hv-badge__copy">
        {lines.map((line) => (
          <span
            key={line}
            className={
              line === accentLine
                ? "hv-badge__line hv-badge__line--accent"
                : "hv-badge__line"
            }
          >
            {line}
          </span>
        ))}
      </span>
      <span className="hv-badge__arrow" aria-hidden="true">
        <ArrowUpRight />
      </span>
    </div>
  );
}
