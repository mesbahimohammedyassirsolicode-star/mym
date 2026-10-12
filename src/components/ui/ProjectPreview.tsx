import type { ProjectPreview } from "../../types/project";

interface ProjectPreviewGraphicProps {
  variant: ProjectPreview;
}

function WindowDots() {
  return (
    <div className="pv-window">
      <span className="pv-dot" />
      <span className="pv-dot" />
      <span className="pv-dot" />
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="pv pv--dashboard">
      <WindowDots />
      <div className="pv-dash">
        <div className="pv-dash__rail">
          <span className="pv-dash__rail-item pv-dash__rail-item--active" />
          <span className="pv-dash__rail-item" />
          <span className="pv-dash__rail-item" />
          <span className="pv-dash__rail-item" />
        </div>
        <div className="pv-dash__main">
          <div className="pv-dash__stats">
            <span className="pv-dash__stat" />
            <span className="pv-dash__stat" />
            <span className="pv-dash__stat" />
          </div>
          <div className="pv-dash__chart">
            <span className="pv-dash__bar" />
            <span className="pv-dash__bar" />
            <span className="pv-dash__bar" />
            <span className="pv-dash__bar" />
            <span className="pv-dash__bar" />
            <span className="pv-dash__bar" />
            <span className="pv-dash__bar" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SaasPreview() {
  return (
    <div className="pv pv--saas">
      <WindowDots />
      <div className="pv-saas">
        <div className="pv-saas__tabs">
          <span className="pv-saas__tab pv-saas__tab--active" />
          <span className="pv-saas__tab" />
          <span className="pv-saas__tab" />
        </div>
        <div className="pv-saas__account">
          <span className="pv-saas__avatar" />
          <div className="pv-saas__lines">
            <span className="pv-saas__line pv-saas__line--wide" />
            <span className="pv-saas__line pv-saas__line--short" />
          </div>
        </div>
        <div className="pv-saas__usage">
          <span className="pv-saas__usage-fill" />
        </div>
        <div className="pv-saas__rows">
          <span className="pv-saas__row">
            <span className="pv-saas__row-line" />
            <span className="pv-saas__pill" />
          </span>
          <span className="pv-saas__row">
            <span className="pv-saas__row-line" />
            <span className="pv-saas__pill" />
          </span>
        </div>
      </div>
    </div>
  );
}

function MobilePreview() {
  return (
    <div className="pv pv--mobile">
      <div className="pv-phone">
        <span className="pv-phone__notch" />
        <span className="pv-phone__bar" />
        <div className="pv-phone__dates">
          <span className="pv-phone__date" />
          <span className="pv-phone__date pv-phone__date--active" />
          <span className="pv-phone__date" />
          <span className="pv-phone__date" />
        </div>
        <div className="pv-phone__slots">
          <span className="pv-phone__slot pv-phone__slot--active" />
          <span className="pv-phone__slot" />
          <span className="pv-phone__slot" />
        </div>
        <span className="pv-phone__cta" />
      </div>
    </div>
  );
}

export default function ProjectPreviewGraphic({
  variant,
}: ProjectPreviewGraphicProps) {
  if (variant === "dashboard") {
    return <DashboardPreview />;
  }
  if (variant === "saas") {
    return <SaasPreview />;
  }
  return <MobilePreview />;
}
