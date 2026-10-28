import { useEffect } from "react";
import { applyHead, getPageSeo } from "../../config/seo";

export default function Seo({ pathname }: { pathname: string }) {
  useEffect(() => {
    applyHead(getPageSeo(pathname));
  }, [pathname]);
  return null;
}
