import type { ReactNode } from "react";

interface LaptopProps {
  children: ReactNode;
}

export default function Laptop({ children }: LaptopProps) {
  return (
    <div className="hv-laptop" aria-hidden="true">
      <div className="hv-laptop__lid">
        <span className="hv-laptop__camera" />
      </div>

      <div className="hv-laptop__screen">
        <div className="hv-laptop__ui">{children}</div>
        <span className="hv-laptop__glass" />
      </div>

      <div className="hv-laptop__base">
        <span className="hv-laptop__notch" />
      </div>

      <span className="hv-laptop__shadow" />
    </div>
  );
}
