import {
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { CheckCircle2, Send } from "lucide-react";
import Button from "../../../components/ui/Button";
import { serviceCategories } from "../../../data/services";
import {
  submitContactForm,
  type ContactFormData,
} from "../../../services/contactSubmission";

type FormValues = ContactFormData;

type FieldKey = keyof FormValues;

type FormErrors = Partial<Record<FieldKey, string>>;

const initialValues: FormValues = {
  fullName: "",
  email: "",
  company: "",
  service: "",
  budget: "",
  details: "",
};

const FIELD_ORDER: FieldKey[] = [
  "fullName",
  "email",
  "company",
  "service",
  "budget",
  "details",
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const serviceOptions = [
  ...serviceCategories.map((category) => ({
    value: category.id,
    label: category.title,
  })),
  { value: "other", label: "Other" },
];

const budgetOptions = [
  { value: "under-5k", label: "Under $5,000" },
  { value: "5k-20k", label: "$5,000 – $20,000" },
  { value: "20k-50k", label: "$20,000 – $50,000" },
  { value: "over-50k", label: "$50,000+" },
  { value: "not-sure", label: "Not sure yet" },
];

const serviceHint =
  "Not sure? Pick the closest match — there's an 'Other' option if none fit.";
const budgetHint =
  "Indicative ranges for planning only — not a quote or MYM pricing list.";
const detailsHint =
  "Try 2–4 sentences: what you're building, its goals, and anything time-sensitive.";

function validateField(key: FieldKey, value: string): string | undefined {
  switch (key) {
    case "fullName":
      return value.trim().length < 2 ? "Please enter your full name." : undefined;
    case "email":
      if (!value.trim()) {
        return "Please enter your email address.";
      }
      return EMAIL_PATTERN.test(value.trim())
        ? undefined
        : "Please enter a valid email address.";
    case "service":
      return value ? undefined : "Please select a service.";
    case "details":
      if (!value.trim()) {
        return "Please describe your project.";
      }
      return value.trim().length < 20
        ? "Please describe your project in at least 20 characters."
        : undefined;
    default:
      return undefined;
  }
}

function validateAll(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  for (const key of FIELD_ORDER) {
    const error = validateField(key, values[key]);
    if (error) {
      errors[key] = error;
    }
  }
  return errors;
}

function describedBy(
  id: FieldKey,
  error: string | undefined,
  hint: string | undefined,
): string | undefined {
  const refs: string[] = [];
  if (error) {
    refs.push(`${id}-error`);
  } else if (hint) {
    refs.push(`${id}-hint`);
  }
  return refs.join(" ") || undefined;
}

function controlClass(hasError: boolean): string {
  return hasError ? "form-control form-control--invalid" : "form-control";
}

interface FormFieldProps {
  id: FieldKey;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

function FormField({
  id,
  label,
  required = false,
  hint,
  error,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={className ? `form-field ${className}` : "form-field"}>
      <label className="form-label" htmlFor={id}>
        {label}
        {required && (
          <>
            <span className="form-label__required" aria-hidden="true">
              {" "}
              *
            </span>
            <span className="visually-hidden"> (required)</span>
          </>
        )}
      </label>
      {children}
      {hint && !error ? (
        <p className="form-hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="form-error" id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted">(
    "idle",
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fieldRefs = useRef<Partial<Record<FieldKey, HTMLElement | null>>>({});

  function setFieldRef(key: FieldKey, node: HTMLElement | null) {
    fieldRefs.current[key] = node;
  }

  function focusFirstError(nextErrors: FormErrors) {
    const firstKey = FIELD_ORDER.find((key) => nextErrors[key]);
    if (firstKey) {
      const element = fieldRefs.current[firstKey];
      if (element) {
        element.focus();
      }
    }
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    const key = name as FieldKey;
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) {
        return prev;
      }
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function handleBlur(
    event: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    const key = name as FieldKey;
    const error = validateField(key, value);
    setErrors((prev) => {
      const next = { ...prev };
      if (error) {
        next[key] = error;
      } else {
        delete next[key];
      }
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") {
      return;
    }
    const nextErrors = validateAll(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      focusFirstError(nextErrors);
      return;
    }
    setErrors({});
    setSubmitError(null);
    setStatus("submitting");
    try {
      const result = await submitContactForm(values);
      if (result.delivered) {
        setStatus("submitted");
        return;
      }
      setSubmitError(
        result.reason === "missing-config"
          ? "This contact form isn't connected to an email service yet, so your message wasn't sent. Please try again later."
          : "We couldn't send your message right now. Please check your connection and try again.",
      );
      setStatus("idle");
    } catch {
      setSubmitError(
        "Something went wrong while sending your message. Please try again.",
      );
      setStatus("idle");
    }
  }

  function handleReset() {
    setValues(initialValues);
    setErrors({});
    setSubmitError(null);
    setStatus("idle");
    requestAnimationFrame(() => {
      const input = fieldRefs.current.fullName;
      if (input) {
        input.focus();
      }
    });
  }

  if (status === "submitted") {
    return (
      <div className="contact-success" role="status">
        <CheckCircle2
          className="contact-success__icon"
          size={40}
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <h3
          tabIndex={-1}
          ref={(node) => {
            if (node) {
              node.focus();
            }
          }}
          className="contact-success__title"
        >
          Thanks — your message is on its way.
        </h3>
        <p className="contact-success__text">
          We'll review your details and get back to you with next steps.
        </p>
        <Button type="button" variant="secondary" onClick={handleReset}>
          Submit another message
        </Button>
      </div>
    );
  }

  return (
    <form className="contact-form" noValidate onSubmit={handleSubmit}>
      <div className="form-grid">
        <FormField
          id="fullName"
          label="Full Name"
          required
          error={errors.fullName}
        >
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            className={controlClass(Boolean(errors.fullName))}
            value={values.fullName}
            ref={(node) => setFieldRef("fullName", node)}
            aria-invalid={errors.fullName ? true : undefined}
            aria-describedby={describedBy(
              "fullName",
              errors.fullName,
              undefined,
            )}
            required
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </FormField>

        <FormField id="email" label="Email Address" required error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={controlClass(Boolean(errors.email))}
            value={values.email}
            ref={(node) => setFieldRef("email", node)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("email", errors.email, undefined)}
            required
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </FormField>

        <FormField id="company" label="Company Name">
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            className="form-control"
            value={values.company}
            ref={(node) => setFieldRef("company", node)}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </FormField>

        <FormField
          id="service"
          label="Service Interested In"
          required
          hint={serviceHint}
          error={errors.service}
        >
          <select
            id="service"
            name="service"
            className={controlClass(Boolean(errors.service))}
            value={values.service}
            ref={(node) => setFieldRef("service", node)}
            aria-invalid={errors.service ? true : undefined}
            aria-describedby={describedBy("service", errors.service, serviceHint)}
            required
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="" disabled>
              Select a service
            </option>
            {serviceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          id="budget"
          label="Project Budget"
          hint={budgetHint}
          error={errors.budget}
        >
          <select
            id="budget"
            name="budget"
            className="form-control"
            value={values.budget}
            ref={(node) => setFieldRef("budget", node)}
            aria-describedby={describedBy("budget", errors.budget, budgetHint)}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="">Select a range (optional)</option>
            {budgetOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          id="details"
          label="Project Details"
          required
          hint={detailsHint}
          error={errors.details}
          className="form-field--full"
        >
          <textarea
            id="details"
            name="details"
            rows={6}
            className={controlClass(Boolean(errors.details))}
            value={values.details}
            ref={(node) => setFieldRef("details", node)}
            aria-invalid={errors.details ? true : undefined}
            aria-describedby={describedBy("details", errors.details, detailsHint)}
            required
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </FormField>
      </div>

      {submitError ? (
        <p className="form-error form-error--summary" role="alert">
          {submitError}
        </p>
      ) : null}

      <div className="form-actions">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={status === "submitting"}
          aria-busy={status === "submitting"}
        >
          {status === "submitting" ? (
            "Sending message…"
          ) : (
            <>
              Send Message
              <Send size={18} aria-hidden="true" />
            </>
          )}
        </Button>
        <p className="form-disclosure">
          Your message is sent securely to the MYM team via EmailJS.
        </p>
      </div>
    </form>
  );
}