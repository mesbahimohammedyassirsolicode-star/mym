import type { Project } from "../types/project";

export const projects: Project[] = [
  {
    id: "operations-system",
    title: "Operations Management System",
    description:
      "A concept for an internal system that brings scheduling, inventory, and reporting into a single workspace.",
    category: "Management Systems",
    tags: ["Management System", "Automation"],
    status: "concept",
  },
  {
    id: "customer-platform",
    title: "Customer Account Platform",
    description:
      "A concept for a SaaS platform where customers manage their accounts, requests, and billing in one place.",
    category: "SaaS Platforms",
    tags: ["SaaS", "Web App"],
    status: "concept",
  },
  {
    id: "service-booking-app",
    title: "Service Booking App",
    description:
      "A concept for a mobile app where customers browse services and book appointments with automated confirmations.",
    category: "Mobile Applications",
    tags: ["Mobile App", "Automation"],
    status: "concept",
  },
];
