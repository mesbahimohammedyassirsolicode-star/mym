import { serviceCategories } from "../data/services";

export interface ContactFormData {
  fullName: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  details: string;
}

export type ContactSubmissionFailureReason = "missing-config" | "send-failed";

export type ContactSubmissionResult =
  | { delivered: true }
  | { delivered: false; reason: ContactSubmissionFailureReason };

const SERVICE_LABELS: Record<string, string> = {
  ...Object.fromEntries(
    serviceCategories.map((category) => [category.id, category.title]),
  ),
  other: "Other",
};

const BUDGET_LABELS: Record<string, string> = {
  "under-5k": "Under $5,000",
  "5k-20k": "$5,000 – $20,000",
  "20k-50k": "$20,000 – $50,000",
  "over-50k": "$50,000+",
  "not-sure": "Not sure yet",
};

function resolveLabel(labels: Record<string, string>, value: string): string {
  return labels[value] ?? value;
}

function readEnv(value: string | undefined): string {
  return (value ?? "").trim();
}

export async function submitContactForm(
  data: ContactFormData,
): Promise<ContactSubmissionResult> {
  const publicKey = readEnv(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  const serviceId = readEnv(import.meta.env.VITE_EMAILJS_SERVICE_ID);
  const templateId = readEnv(import.meta.env.VITE_EMAILJS_TEMPLATE_ID);

  if (!publicKey || !serviceId || !templateId) {
    return { delivered: false, reason: "missing-config" };
  }

  const templateParams: Record<string, string> = {
    from_name: data.fullName.trim(),
    reply_to: data.email.trim(),
    company: data.company.trim(),
    service: resolveServiceLabel(data.service),
    budget: data.budget ? resolveBudgetLabel(data.budget) : "Not specified",
    project_details: data.details.trim(),
  };

  try {
    const { default: emailjs } = await import("@emailjs/browser");
    const response = await emailjs.send(serviceId, templateId, templateParams, {
      publicKey,
    });
    if (response.status === 200) {
      return { delivered: true };
    }
    return { delivered: false, reason: "send-failed" };
  } catch {
    return { delivered: false, reason: "send-failed" };
  }
}

function resolveServiceLabel(value: string): string {
  return resolveLabel(SERVICE_LABELS, value);
}

function resolveBudgetLabel(value: string): string {
  return resolveLabel(BUDGET_LABELS, value);
}
