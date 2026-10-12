import Container from "../../components/layout/Container";
import usePageMeta from "../../hooks/usePageMeta";
import ContactHero from "./components/ContactHero";
import ContactForm from "./components/ContactForm";
import ContactAside from "./components/ContactAside";
import "./contact.css";

export default function ContactPage() {
  usePageMeta(
    "Contact | MYM — Make Your Move",
    "Tell MYM what you're planning to build. Share your goals and requirements so we can understand how we may help your business move forward.",
  );

  return (
    <>
      <ContactHero />

      <section className="home-section" aria-labelledby="contact-form-title">
        <Container>
          <div className="contact-layout">
            <div className="contact-form-card">
              <h2 id="contact-form-title" className="contact-form-card__title">
                Tell Us About Your Project.
              </h2>
              <p className="contact-form-card__lead">
                The short form below covers the essentials. Fields marked with{" "}
                <span aria-hidden="true">*</span>
                <span className="visually-hidden">(asterisk)</span> are
                required.
              </p>
              <ContactForm />
            </div>
            <ContactAside />
          </div>
        </Container>
      </section>
    </>
  );
}