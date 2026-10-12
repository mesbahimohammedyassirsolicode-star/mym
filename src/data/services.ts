import type { Service, ServiceCategory } from "../types/service";

export const services: Service[] = [];

export const serviceCategories: ServiceCategory[] = [
  {
    id: "web-development",
    slug: "web-development",
    title: "Web Development",
    description:
      "Fast, responsive websites and web applications built on modern, maintainable foundations.",
    capabilities: [
      "Marketing and corporate websites",
      "Web applications and client portals",
      "E-commerce storefronts",
      "CMS-backed content platforms",
      "Performance, accessibility, and SEO tuning",
    ],
    useCases: [
      "A business website that turns visitors into enquiries",
      "A client area with documents and self-service options",
      "An online store with payments and order tracking",
    ],
  },
  {
    id: "saas-platforms",
    slug: "saas-platforms",
    title: "SaaS Platforms",
    description:
      "Product platforms with accounts, subscriptions, and the features your users rely on.",
    capabilities: [
      "Account and workspace management",
      "Subscription and billing flows",
      "Dashboards and reporting views",
      "Roles, permissions, and multi-user access",
      "Payment and third-party integrations",
    ],
    useCases: [
      "A tool customers subscribe to and renew each month",
      "A platform where teams collaborate on shared projects",
      "A product with usage limits and upgrade paths",
    ],
  },
  {
    id: "mobile-applications",
    slug: "mobile-applications",
    title: "Mobile Applications",
    description:
      "Mobile experiences that keep your service in your customers' hands, wherever they are.",
    capabilities: [
      "iOS and Android applications",
      "Cross-platform delivery",
      "Offline-capable experiences",
      "Push notifications",
      "Device features such as camera, location, and mapping",
    ],
    useCases: [
      "A booking app customers use on the go",
      "A field application that works without a connection",
      "An app that keeps customers updated in real time",
    ],
  },
  {
    id: "management-systems",
    slug: "management-systems",
    title: "Management Systems",
    description:
      "Internal tools and systems that organise operations and reduce repetitive manual work.",
    capabilities: [
      "Custom dashboards and reporting",
      "Inventory, orders, and operations tracking",
      "Team roles and approval workflows",
      "Legacy data migration",
      "Alerts that surface what needs attention",
    ],
    useCases: [
      "Replacing spreadsheets with one shared workspace",
      "Tracking jobs, stock, and invoices from a single view",
      "Giving managers a live picture of daily operations",
    ],
  },
  {
    id: "digital-marketing-seo",
    slug: "digital-marketing-seo",
    title: "Digital Marketing & SEO",
    description:
      "Technical SEO and clear content structure that help the right people find your business.",
    capabilities: [
      "Technical SEO audits",
      "Site structure and page optimisation",
      "Analytics setup and reporting",
      "Landing pages and campaign support",
      "Content structure that supports organic growth",
    ],
    useCases: [
      "Helping the right customers find a website",
      "Improving page speed and mobile experience",
      "Measuring what drives enquiries and sign-ups",
    ],
  },
  {
    id: "automation-integrations",
    slug: "automation-integrations",
    title: "Automation & Integrations",
    description:
      "Connected workflows that link your tools together and remove repetitive steps.",
    capabilities: [
      "Workflow automation",
      "Integration between business tools",
      "Forms, notifications, and data routing",
      "File and record synchronisation",
      "Custom scripts for repeated processes",
    ],
    useCases: [
      "Removing manual entry between systems",
      "Keeping a shared view of leads and projects",
      "Automating confirmations and follow-ups",
    ],
  },
  {
    id: "brand-identity-branding",
    slug: "brand-identity-branding",
    title: "Brand Identity & Branding",
    description:
      "A consistent visual identity that makes your business recognisable, clear, and credible.",
    capabilities: [
      "Logo and visual identity",
      "Brand guidelines and usage rules",
      "Tone of voice and messaging",
      "Templates for marketing materials",
      "A consistent look across web and print",
    ],
    useCases: [
      "A new identity that feels professional and consistent",
      "Guidelines that keep a growing team on brand",
      "A rollout that unifies your online presence",
    ],
  },
];