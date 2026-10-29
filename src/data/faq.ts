export interface FaqItem {
  question: string;
  /** Rendered as visible copy and reused verbatim in the FAQPage JSON-LD. */
  answer: string;
}

/**
 * Every answer restates information already published on the site:
 * service list (src/data/services.ts), the four-step approach
 * (Approach.astro / AboutApproach.astro), the per-project scoping note
 * ("Scope, timelines, and any ongoing support are agreed for each project
 * individually."), and the contact form's own fields.
 *
 * Facts that are not published anywhere yet — code ownership, delivery
 * guarantees, business location, email and phone — are intentionally absent
 * rather than guessed.
 */
export const faqItems: FaqItem[] = [
  {
    question: "What does Aurasoli do?",
    answer:
      "Aurasoli builds and improves digital work for businesses: websites and web applications, SaaS platforms, mobile applications, management systems, digital marketing and SEO, automation and integrations, and brand identity.",
  },
  {
    question: "Who does Aurasoli work with?",
    answer:
      "Aurasoli works with businesses and entrepreneurs that want to develop their ideas, automate operations, and grow their digital presence.",
  },
  {
    question: "How does a project start?",
    answer:
      "Projects start with the form on the contact page. We review the message and the details you share, reply with clarifying questions or a proposal, and shape the scope together before anything is built.",
  },
  {
    question: "How does Aurasoli work through a project?",
    answer:
      "The work moves through four steps: Discover (understand the goals, challenges, and requirements), Design (plan a clear, user-focused digital experience), Build (develop with appropriate technologies and maintainable code), and Improve (support ongoing improvements based on actual project needs).",
  },
  {
    question: "How long does a project take?",
    answer:
      "Timelines are agreed for each project individually, alongside the scope. Aurasoli does not publish fixed delivery times, because the work is tailored to the business rather than taken from a template.",
  },
  {
    question: "How is a project priced?",
    answer:
      "Scope, timelines, and any ongoing support are agreed for each project individually. The project form asks for an indicative budget range for planning only — it is not a quote or a price list.",
  },
  {
    question: "What happens after launch?",
    answer:
      "The Improve step continues after delivery: ongoing improvements are based on actual project needs, and any ongoing support is agreed per project.",
  },
  {
    question: "How do I get in touch with Aurasoli?",
    answer:
      "Use the contact form on the contact page. It asks for your name, email, company, the service you need, an indicative budget range, and a short description of the project.",
  },
];
