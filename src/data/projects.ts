import type { Project } from "../types/project";

/**
 * Portfolio data source. Case studies only describe details that are visible on
 * the live projects or supplied with the workflow; unverified implementation
 * details, metrics, and client outcomes are deliberately omitted.
 */
export const projects: Project[] = [
  {
    id: "iti-info",
    title: "ITI Info",
    description:
      "An informational web platform for Institut Trans Informatique that brings professional IT and management training, enrolment steps, and contact routes into one clear, bilingual experience.",
    seoDescription:
      "ITI Info case study: an informational platform for Institut Trans Informatique covering professional IT and management training, enrolment, and contact routes.",
    category: "Web Development",
    tags: ["Informational Platform", "Bilingual", "Responsive"],
    status: "live",
    url: "https://iti-info.vercel.app/",
    ctaLabel: "View Live Project",
    thumbnail: {
      src: "/assets/projects/iti-info.jpg",
      alt: "ITI Info homepage showing the Institut Trans Informatique navigation and the French headline 'Préparez votre carrière dès aujourd'hui'.",
      width: 1440,
      height: 900,
    },
    caseStudy: {
      overview: [
        "ITI Info is the public website for Institut Trans Informatique in Tangier, an institute that trains professionals in IT and management. The platform introduces the institute, presents its programmes, explains how to enrol, and keeps contact routes easy to find.",
        "The experience is built around a persistent top navigation and a prominent enrolment call to action, with a French/English switch for visitors who prefer either language.",
      ],
      objective:
        "Give prospective students one clear place to understand the institute's offer, review training options, and begin an enrolment enquiry.",
      problem:
        "Prospective students need to compare programmes, understand the enrolment steps, and confirm the institute's credentials without a phone call or campus visit. ITI Info consolidates that information into a single navigable platform.",
      solution: [
        "A structured informational site with a fixed navigation covering Accueil, Formations, Inscription, and Contact.",
        "A homepage hero that introduces the institute's history — founded in 1986, with recognised diplomas since 1992 — and routes visitors to applications or programme details.",
        "A bilingual FR/EN switch and visible 2026 enrolment messaging so the site serves both local and international audiences.",
      ],
      features: [
        {
          title: "Programme catalogue",
          description:
            "A dedicated Formations route where visitors can explore the institute's training offer.",
        },
        {
          title: "Enrolment journey",
          description:
            "An Inscription route and repeated application calls to action keep the next step visible.",
        },
        {
          title: "Contact access",
          description:
            "A direct Contact route for questions before or during enrolment.",
        },
        {
          title: "Bilingual interface",
          description:
            "A FR/EN switch lets visitors read the site in French or English.",
        },
      ],
      technologies: [],
      screenshots: [
        {
          src: "/assets/projects/iti-info.jpg",
          alt: "ITI Info homepage with the Institut Trans Informatique logo, main navigation, and a campus photo behind the headline 'Préparez votre carrière dès aujourd'hui'.",
          width: 1440,
          height: 900,
          caption: "Homepage, captured from the live site.",
        },
      ],
      verifiedNote:
        "Verified on the live site: navigation labels, programme, enrolment and contact routes, the FR/EN switch, and the 2026 enrolment messaging. The objective and problem statements are editorial framing of what the site does, not a client-supplied brief. Implementation details and business results are not publicly verified and are not claimed here.",
    },
  },
  {
    id: "soliways-2027",
    title: "SOLIWAYS 2027",
    description:
      "A digital experience for SOLIWAYS 2027, a four-day IT event and hackathon in Tangier, with programme, themes, team, practical information, and partner sections.",
    seoDescription:
      "SOLIWAYS 2027 event website case study: programme, themes, team, practical information, and registration status for a four-day IT event and hackathon in Tangier.",
    category: "Event Website",
    tags: ["Event Platform", "Hackathon", "Bilingual", "Countdown"],
    status: "live",
    url: "https://www.soli-ways.online/",
    ctaLabel: "Explore Website",
    thumbnail: {
      src: "/assets/projects/soliways.jpg",
      alt: "SOLIWAYS 2027 homepage with a dark tech background, a countdown, and the headline 'Apprendre. Échanger. Créer.'",
      width: 1440,
      height: 900,
    },
    caseStudy: {
      overview: [
        "SOLIWAYS 2027 is a digital experience for a four-day IT event and hackathon taking place at Solicode Tanger, Morocco, from 13 to 16 April 2027. The site frames the event around the line 'Apprendre. Échanger. Créer.' and builds anticipation with a live countdown.",
        "Visitors can move through the programme, themes, team, practical information, and partners from a single navigation, in French or English.",
      ],
      objective:
        "Establish the event's identity, build anticipation before registrations open, and give attendees one place to explore the programme and practical details.",
      problem:
        "Multi-day events tend to spread information across announcements and social posts. SOLIWAYS 2027 consolidates the programme, themes, venue, team, partners, and registration status into one destination.",
      solution: [
        "A dark, technology-led visual direction with a live countdown to the event and a clear primary call to action for the programme.",
        "A bilingual FR/EN navigation covering Accueil, À propos, Programme, Thématiques, Équipe, Infos pratiques, and Partenaires.",
        "An honest registration state — 'Inscriptions bientôt disponibles' — keeps the next step clear while registrations are closed.",
      ],
      features: [
        {
          title: "Live countdown",
          description:
            "A countdown to the opening day gives the event a sense of momentum on the homepage.",
        },
        {
          title: "Programme and themes",
          description:
            "Dedicated routes organise the schedule and the topics the event explores.",
        },
        {
          title: "Team and partners",
          description:
            "Separate sections introduce the people and organisations behind the event.",
        },
        {
          title: "Practical information",
          description:
            "Venue and attendance details sit alongside the programme, so visitors do not have to hunt for logistics.",
        },
        {
          title: "Bilingual navigation",
          description:
            "A FR/EN switch keeps the event accessible to local and international participants.",
        },
      ],
      technologies: [],
      screenshots: [
        {
          src: "/assets/projects/soliways.jpg",
          alt: "SOLIWAYS 2027 homepage showing the event logo, bilingual navigation, countdown, and the headline 'Apprendre. Échanger. Créer.'",
          width: 1440,
          height: 900,
          caption: "Homepage, captured from the live site.",
        },
      ],
      verifiedNote:
        "Verified on the live site: the event dates and venue, countdown, navigation sections, FR/EN switch, and the 'Inscriptions bientôt disponibles' registration state. The objective and problem statements are editorial framing. Attendance, conversion, and business outcomes are not publicly verified and are not claimed here.",
    },
  },
  {
    id: "areach",
    title: "AREACH",
    description:
      "A modern online fashion store for elegant women's fashion, pairing editorial imagery with a multilingual storefront and direct product discovery.",
    seoDescription:
      "AREACH e-commerce case study: an editorial online fashion store for elegant women's fashion with shop, promotions, cart, and multilingual browsing.",
    category: "E-commerce",
    tags: ["Fashion Store", "Product Discovery", "Multilingual"],
    status: "live",
    url: "https://areachofficial.com/",
    ctaLabel: "Visit Store",
    thumbnail: {
      src: "/assets/projects/areach.jpg",
      alt: "AREACH storefront with an editorial fashion hero, minimal top navigation, and the headline 'Exclusive Collection'.",
      width: 1440,
      height: 900,
    },
    caseStudy: {
      overview: [
        "AREACH is an online fashion store focused on elegant women's fashion, presenting its collections under the line 'Elegant Luxury Defined'. The storefront leads with editorial photography and a restrained, warm visual language.",
        "Shop, promotions, cart, and language options stay within reach from the top of every page, so the brand story and product discovery support each other.",
      ],
      objective:
        "Translate a refined, editorial brand into an online storefront where visitors can browse collections, spot promotions, and move into the shop quickly.",
      problem:
        "Fashion shoppers judge quality visually and expect immediate access to the shop, current promotions, the cart, and their preferred language. A storefront has to carry the brand mood without hiding those routes.",
      solution: [
        "A full-bleed editorial hero with rotating collection messaging — 'Feminine Elegance' and 'Exclusive Collection' — anchored by direct shop and new-arrivals actions.",
        "A minimal top navigation with Home, Shop, and Promotions, plus a persistent cart and language switcher.",
        "A warm, neutral art direction that lets the product photography carry the page rather than competing UI elements.",
      ],
      features: [
        {
          title: "Editorial hero",
          description:
            "Full-width fashion imagery and rotating collection headlines set the brand tone immediately.",
        },
        {
          title: "Shop and promotions",
          description:
            "Dedicated routes keep the catalogue and current promotions one click from the homepage.",
        },
        {
          title: "Cart access",
          description:
            "A persistent cart icon keeps the purchase path visible while browsing.",
        },
        {
          title: "Four languages",
          description:
            "English, French, Arabic, and Dutch options widen the storefront's reach.",
        },
      ],
      technologies: [],
      screenshots: [
        {
          src: "/assets/projects/areach.jpg",
          alt: "AREACH homepage with an editorial fashion photograph, minimal navigation, cart icon, and the headline 'Exclusive Collection'.",
          width: 1440,
          height: 900,
          caption: "Homepage, captured from the live site.",
        },
      ],
      verifiedNote:
        "Verified on the live site: Home, Shop, and Promotions navigation, the cart icon, the EN/FR/AR/NL language options, and the rotating 'Feminine Elegance' / 'Exclusive Collection' hero messages. Checkout, payment, shipping, and catalogue size are not publicly verified and are not claimed here.",
    },
  },
  {
    id: "ai-lead-generation-automation",
    title: "AI Lead Generation & Website Audit Automation",
    description:
      "An automated lead-research pipeline that detects whether a prospect has a website, cleans its content, generates an AI-assisted website audit, and stores qualified results in Google Sheets.",
    seoDescription:
      "An n8n, Gemini, and Google Sheets workflow that researches prospects, cleans website content, generates AI-assisted audits, and stores qualified results.",
    category: "AI Automation",
    tags: ["n8n", "Google Gemini", "Google Sheets", "Workflow Engineering"],
    status: "workflow",
    ctaLabel: "Explore Automation",
    thumbnail: {
      src: "/assets/projects/automation-workflow.svg",
      alt: "Twelve-step n8n workflow diagram running from Manual Trigger and Lead Retrieval through Gemini Processing to Google Sheets Storage.",
      width: 1600,
      height: 1000,
    },
    caseStudy: {
      overview: [
        "A twelve-step n8n workflow that turns a list of prospects into structured, AI-assisted website audit notes. It runs on demand, checks which leads have a website, removes duplicates, fetches and cleans site content, asks Gemini for an audit, parses and qualifies the output, then writes the result back to Google Sheets.",
        "The workflow is designed to streamline prospect research and audit preparation. It is documented here as a workflow, not as a public demo, and no business outcomes are claimed.",
      ],
      objective:
        "Streamline prospect research and first-pass website audit preparation by replacing repetitive manual checks and drafting with a repeatable, reviewable pipeline.",
      problem:
        "Researching prospects one by one is repetitive: confirming a website exists, copying its content, cleaning it up, drafting observations, and recording the result consistently. Manual passes are slow and hard to compare.",
      solution: [
        "Start from a controlled manual trigger so each run is intentional and observable.",
        "Gate leads before enrichment: detect a website and remove duplicates so only unique, relevant prospects are fetched.",
        "Clean the fetched page content and build a focused prompt before sending it to Gemini.",
        "Parse and qualify the model output, then write only qualified results to Google Sheets for review.",
      ],
      features: [
        {
          title: "Controlled runs",
          description:
            "A manual trigger and a configuration step keep each execution deliberate and easy to inspect.",
        },
        {
          title: "Clean lead intake",
          description:
            "Website detection and duplicate removal stop incomplete or repeated prospects from moving forward.",
        },
        {
          title: "Focused AI input",
          description:
            "Website content is fetched, cleaned, and shaped into a prompt before Gemini processes it.",
        },
        {
          title: "Review-ready output",
          description:
            "Responses are parsed and qualified before Google Sheets storage, so the sheet holds structured results.",
        },
      ],
      technologies: ["n8n", "Google Gemini", "Google Sheets"],
      screenshots: [
        {
          src: "/assets/projects/automation-workflow.svg",
          alt: "Workflow diagram with twelve numbered nodes connected in sequence, from Manual Trigger and Configuration through Gemini Processing to Google Sheets Storage.",
          width: 1600,
          height: 1000,
          caption:
            "The twelve-step pipeline. This is a diagram of the workflow structure, not a public demo capture.",
        },
      ],
      workflow: [
        {
          label: "Manual Trigger",
          description:
            "Start the workflow on demand so every run is intentional and observable.",
        },
        {
          label: "Configuration",
          description:
            "Load the settings the run needs, such as audit parameters.",
        },
        {
          label: "Lead Retrieval",
          description:
            "Read the prospect rows that will be researched.",
        },
        {
          label: "Website Detection",
          description:
            "Check each prospect for a website before any content is requested.",
        },
        {
          label: "Duplicate Removal",
          description:
            "Remove repeated leads so the same prospect is not audited twice.",
        },
        {
          label: "Website Fetching",
          description:
            "Request the website content for every remaining lead.",
        },
        {
          label: "Content Cleaning",
          description:
            "Strip and normalise the fetched content to keep the model input focused.",
        },
        {
          label: "AI Prompt Construction",
          description:
            "Assemble the cleaned content into a consistent website-audit prompt.",
        },
        {
          label: "Gemini Processing",
          description:
            "Send the prompt to Google Gemini to generate the audit response.",
        },
        {
          label: "Output Parsing",
          description:
            "Parse the model response into a structured result the workflow can evaluate.",
        },
        {
          label: "Qualification",
          description:
            "Keep only the results that meet the workflow's qualification criteria.",
        },
        {
          label: "Google Sheets Storage",
          description:
            "Write the qualified audit results back to Google Sheets for review.",
        },
      ],
      verifiedNote:
        "Workflow steps and platforms are taken from the supplied workflow specification: n8n, Google Gemini, and Google Sheets. Prompt wording, qualification thresholds, and runtime configuration are not shown. This page makes no claims about revenue, conversion, time saved, or other business outcomes.",
    },
  },
];
