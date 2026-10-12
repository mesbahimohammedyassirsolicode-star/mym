import type { ReactNode } from "react";
import SectionHeading from "./SectionHeading";

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  titleId?: string;
  align?: "start" | "center";
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  titleId,
  align = "start",
  className,
}: SectionHeaderProps) {
  const classes = [
    "section-header",
    align === "center" && "section-header--center",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <SectionHeading as="h2" id={titleId} className="section-title">
        {title}
      </SectionHeading>
      {description ? <p className="section-lead">{description}</p> : null}
    </div>
  );
}