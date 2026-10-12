import type { CSSProperties } from "react";
import type { BarDatum } from "../../types/heroVisual";

const BAR_STAGGER = 30;
const BAR_DURATION = 640;
const LABEL_INDICES = new Set([0, 4, 8, 12, 17]);

interface ActivityChartProps {
  bars: BarDatum[];
}

export default function ActivityChart({ bars }: ActivityChartProps) {
  const max = Math.max(...bars.map((bar) => bar.value));
  const peakIndex = bars.findIndex((bar) => bar.value === max);
  const peakDelay = (bars.length - 1) * BAR_STAGGER + BAR_DURATION + 240;

  return (
    <div className="hv-chart">
      <div className="hv-chart__head">
        <span className="hv-chart__title">Daily requests</span>
        <span className="hv-chart__scale">18 days</span>
      </div>

      <div className="hv-chart__body">
        <div className="hv-chart__axis" aria-hidden="true">
          <span>{max}</span>
          <span>{Math.round(max / 2)}</span>
          <span>0</span>
        </div>

        <div className="hv-chart__main">
          <div className="hv-chart__bars">
            <span className="hv-chart__gridlines" aria-hidden="true" />
            {bars.map((bar, index) => {
              const isPeak = index === peakIndex;
              const style = {
                "--hv-bar": `${Math.round((bar.value / max) * 100)}%`,
                "--hv-bar-delay": `${index * BAR_STAGGER}ms`,
                ...(isPeak ? { "--hv-pulse-delay": `${peakDelay}ms` } : {}),
              } as CSSProperties;

              return (
                <div className="hv-chart__col" key={bar.id} style={style}>
                  <span
                    className={
                      isPeak
                        ? "hv-chart__bar hv-chart__bar--peak"
                        : "hv-chart__bar"
                    }
                  />
                </div>
              );
            })}
          </div>

          <div className="hv-chart__labels" aria-hidden="true">
            {bars.map((bar, index) => (
              <span className="hv-chart__label" key={bar.id}>
                {LABEL_INDICES.has(index) ? bar.label : ""}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
