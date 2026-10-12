import type { CSSProperties } from "react";
import useCountUp from "../../hooks/useCountUp";
import type { ProgressDatum } from "../../types/heroVisual";

interface ProgressCardProps {
  progress: ProgressDatum;
}

export default function ProgressCard({ progress }: ProgressCardProps) {
  const value = useCountUp(progress.value, 520, 900);
  const style = { "--hv-progress": `${progress.value}%` } as CSSProperties;

  return (
    <div className="hv-progress" style={style}>
      <div className="hv-progress__head">
        <span className="hv-progress__label">{progress.label}</span>
        <span className="hv-progress__value">{value}%</span>
      </div>
      <span className="hv-progress__track">
        <span className="hv-progress__fill" />
      </span>
    </div>
  );
}
