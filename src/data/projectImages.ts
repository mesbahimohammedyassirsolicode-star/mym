import type { ImageMetadata } from "astro";
import itiInfo from "../assets/projects/iti-info.jpg";
import soliways from "../assets/projects/soliways.jpg";
import areach from "../assets/projects/areach.jpg";
import automationWorkflow from "../assets/projects/automation-workflow.svg";

/**
 * Project imagery is imported so `astro:assets` can optimise it at build time.
 * Keys match the `src` strings kept in `src/data/projects.ts`.
 */
const projectImages: Record<string, ImageMetadata> = {
  "/assets/projects/iti-info.jpg": itiInfo,
  "/assets/projects/soliways.jpg": soliways,
  "/assets/projects/areach.jpg": areach,
  "/assets/projects/automation-workflow.svg": automationWorkflow,
};

export function getProjectImage(src: string): ImageMetadata | undefined {
  return projectImages[src];
}
