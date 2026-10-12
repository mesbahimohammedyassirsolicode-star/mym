import { Check } from "lucide-react";

const nextSteps = [
  "We review your message and the details you share.",
  "We reply with clarifying questions or a proposal.",
  "We shape the scope together before anything is built.",
];

export default function ContactAside() {
  return (
    <aside className="contact-aside" aria-labelledby="next-steps-title">
      <div className="contact-aside__card">
        <h2 className="contact-aside__title" id="next-steps-title">
          What Happens Next
        </h2>
        <ol className="contact-aside__steps">
          {nextSteps.map((step) => (
            <li className="contact-aside__step" key={step}>
              <span className="contact-aside__check" aria-hidden="true">
                <Check size={16} strokeWidth={2.5} />
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="contact-aside__card">
        <h2 className="contact-aside__title">Make the First Reply Count</h2>
        <p className="contact-aside__text">
          The more you share about your goals, your audience, and your
          timeline, the more useful our first response can be.
        </p>
      </div>
    </aside>
  );
}