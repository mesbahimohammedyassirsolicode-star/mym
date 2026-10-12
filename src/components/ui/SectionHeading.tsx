import type { ReactNode } from "react";

interface SectionHeadingProps {
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
}

export default function SectionHeading({
  children,
  as: Tag = "h1",
  id,
  className,
}: SectionHeadingProps) {
  const resolvedId = id ?? (Tag === "h1" ? "page-title" : undefined);

  return (
    <Tag id={resolvedId} className={className ?? "page-heading"}>
      {children}
    </Tag>
  );
}
