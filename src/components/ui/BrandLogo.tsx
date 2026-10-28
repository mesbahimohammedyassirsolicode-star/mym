import type { ImgHTMLAttributes } from "react";

type BrandLogoProps = Pick<
  ImgHTMLAttributes<HTMLImageElement>,
  "className" | "loading" | "fetchPriority"
>;

export default function BrandLogo({
  className,
  loading = "lazy",
  fetchPriority,
}: BrandLogoProps) {
  const imageClassName = className ? `brand-logo ${className}` : "brand-logo";

  return (
    <picture>
      <source
        type="image/avif"
        srcSet="/assets/logo/Aurasoli-logo-352.avif 352w, /assets/logo/Aurasoli-logo-704.avif 704w"
        sizes="140px"
      />
      <source
        type="image/webp"
        srcSet="/assets/logo/Aurasoli-logo-352.webp 352w, /assets/logo/Aurasoli-logo-704.webp 704w"
        sizes="140px"
      />
      <img
        className={imageClassName}
        src="/assets/logo/Aurasoli-logo-704.png"
        alt="Aurasoli logo"
        width={704}
        height={203}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
      />
    </picture>
  );
}
