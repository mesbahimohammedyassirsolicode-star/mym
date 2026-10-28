import Button from "../../components/ui/Button";
import SectionHeading from "../../components/ui/SectionHeading";

export default function NotFoundPage() {
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