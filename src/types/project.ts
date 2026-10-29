export type ProjectPreview = "dashboard" | "saas" | "mobile" | "workflow";

export type ProjectStatus = "live" | "workflow";

export interface ProjectImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export interface ProjectFeature {
  title: string;
  description: string;
}

export interface WorkflowStep {
  label: string;
  description: string;
}

export interface ProjectCaseStudy {
  overview: string[];
  objective: string;
  problem: string;
  solution: string[];
  features: ProjectFeature[];
  technologies: string[];
  screenshots: ProjectImage[];
  workflow?: WorkflowStep[];
  verifiedNote: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  seoDescription: string;
  category: string;
  tags: string[];
  status: ProjectStatus;
  url?: string;
  ctaLabel: string;
  thumbnail: ProjectImage;
  caseStudy: ProjectCaseStudy;
}
