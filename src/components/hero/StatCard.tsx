import useCountUp from "../../hooks/useCountUp";
import type { Stat } from "../../types/heroVisual";

interface StatCardProps {
  stat: Stat;
  badge?: string;
}

export default function StatCard({ stat, badge = "Sample" }: StatCardProps) {
  const value = useCountUp(stat.value, 260);

  return (
    <div className="hv-stat">
      <div className="hv-stat__head">
        <span className="hv-stat__label">{stat.label}</span>
        <span className="hv-stat__badge">{badge}</span>
      </div>
      <span className="hv-stat__value">{value}</span>
    </div>
  );
}
