import Button from "../../components/ui/Button";
import SectionHeading from "../../components/ui/SectionHeading";
import usePageMeta from "../../hooks/usePageMeta";

export default function NotFoundPage() {
  usePageMeta(
    "Page not found | MYM — Make Your Move",
    "The page you requested does not exist.",
  );

  return (
    <section className="page-section" aria-labelledby="page-title">
      <div className="page-stack">
        <p className="eyebrow">404</p>
        <SectionHeading>Page not found</SectionHeading>
        <p>The page you requested does not exist or may have moved.</p>
        <Button to="/" variant="primary" size="lg">
          Return home
        </Button>
      </div>
    </section>
  );
}