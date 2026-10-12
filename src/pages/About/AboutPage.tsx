import usePageMeta from "../../hooks/usePageMeta";
import AboutHero from "./components/AboutHero";
import MissionStatement from "./components/MissionStatement";
import AboutServices from "./components/AboutServices";
import AboutApproach from "./components/AboutApproach";
import AboutValues from "./components/AboutValues";
import AboutClosingCta from "./components/AboutClosingCta";
import "./about.css";

export default function AboutPage() {
  usePageMeta(
    "About | MYM — Make Your Move",
    "Learn about MYM, a digital solutions partner that helps businesses build useful products, improve operations, strengthen their online presence, and establish consistent brand identities.",
  );

  return (
    <>
      <AboutHero />
      <MissionStatement />
      <AboutServices />
      <AboutApproach />
      <AboutValues />
      <AboutClosingCta />
    </>
  );
}