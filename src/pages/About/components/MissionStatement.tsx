import { Blocks, MonitorCheck, Palette, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Container from "../../../components/layout/Container";
import SectionHeader from "../../../components/ui/SectionHeader";

interface MissionAim {
  icon: LucideIcon;
  title: string;
  text: string;
}

const missionAims: MissionAim[] = [
  {
    icon: Blocks,
    title: "Useful digital products",
    text: "Software that solves a real problem and remains simple to use and maintain.",
  },
  {
    icon: MonitorCheck,
    title: "Improved operations",
    text: "Systems and automation that remove repetitive work and keep teams aligned.",
  },
  {
    icon: Workflow,
    title: "A stronger online presence",
    text: "Websites, content, and SEO that make a business easier to find and understand.",
  },
  {
    icon: Palette,
    title: "Consistent brand identity",
    text: "A clear, coherent identity that makes a business recognisable across every touchpoint.",
  },
];

export default function MissionStatement() {
  return (
    <section className="home-section" aria-labelledby="mission-title">
      <Container>
        <div className="mission">
          <div className="mission__copy">
            <SectionHeader
              eyebrow="Our Mission"
              titleId="mission-title"
              title={
                <>
                  Helping Businesses <span className="hl">Move Forward.</span>
                </>
              }
              description="Aurasoli exists to help businesses develop useful digital products, improve how they operate, strengthen their online presence, and establish a consistent brand identity."
            />
            <p className="mission__text">
              Every engagement starts with the business behind it: the goals,
              the people, and the work that needs to get done. From there, Aurasoli
              brings the right mix of development, automation, marketing, and
              design — so the technology earns its place in the business.
            </p>
          </div>

          <ul className="mission-aims">
            {missionAims.map(({ icon: Icon, title, text }) => (
              <li className="mission-aim" key={title}>
                <span className="mission-aim__icon" aria-hidden="true">
                  <Icon size={20} strokeWidth={1.75} />
                </span>
                <div className="mission-aim__body">
                  <h3 className="mission-aim__title">{title}</h3>
                  <p className="mission-aim__text">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}