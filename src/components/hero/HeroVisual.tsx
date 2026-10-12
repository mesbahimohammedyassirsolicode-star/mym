import { useEffect, useRef } from "react";
import {
  activityBars,
  badgeAccentLine,
  badgeLines,
  heroProgress,
  heroStat,
  panelItems,
  panelLink,
} from "../../data/heroVisual";
import ActivityChart from "./ActivityChart";
import GlassBadge from "./GlassBadge";
import Laptop from "./Laptop";
import ProgressCard from "./ProgressCard";
import RightPanel from "./RightPanel";
import Sidebar from "./Sidebar";
import StatCard from "./StatCard";
import Topbar from "./Topbar";
import "./heroVisual.css";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const MAX_TILT_DEG = 3;

export default function HeroVisual() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    const finePointer = window.matchMedia(POINTER_QUERY);

    if (reducedMotion.matches || !finePointer.matches) {
      return;
    }

    let frame = 0;

    const handleMove = (event: MouseEvent) => {
      if (frame) {
        cancelAnimationFrame(frame);
      }

      frame = requestAnimationFrame(() => {
        const rect = root.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        root.style.setProperty(
          "--hv-tilt-y",
          `${(x * MAX_TILT_DEG).toFixed(2)}deg`,
        );
        root.style.setProperty(
          "--hv-tilt-x",
          `${(-y * MAX_TILT_DEG).toFixed(2)}deg`,
        );
      });
    };

    const handleLeave = () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }
      root.style.setProperty("--hv-tilt-x", "0deg");
      root.style.setProperty("--hv-tilt-y", "0deg");
    };

    root.addEventListener("mousemove", handleMove);
    root.addEventListener("mouseleave", handleLeave);

    return () => {
      root.removeEventListener("mousemove", handleMove);
      root.removeEventListener("mouseleave", handleLeave);
      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <div className="hv" ref={rootRef}>
      <div className="hv__glow" aria-hidden="true" />
      <div className="hv__grid" aria-hidden="true" />
      <div className="hv__streaks" aria-hidden="true">
        <span className="hv__streak hv__streak--1" />
        <span className="hv__streak hv__streak--2" />
        <span className="hv__streak hv__streak--3" />
      </div>

      <div className="hv__stage">
        <div className="hv__reflection" aria-hidden="true" />
        <Laptop>
          <div className="hv-ui">
            <Sidebar />

            <div className="hv-ui__workspace">
              <Topbar />

              <div className="hv-ui__body">
                <div className="hv-ui__main">
                  <StatCard stat={heroStat} />
                  <ProgressCard progress={heroProgress} />
                  <ActivityChart bars={activityBars} />
                </div>

                <RightPanel
                  status="Active"
                  items={panelItems}
                  link={panelLink}
                />
              </div>
            </div>
          </div>
        </Laptop>
      </div>

      <GlassBadge lines={badgeLines} accentLine={badgeAccentLine} />
    </div>
  );
}
