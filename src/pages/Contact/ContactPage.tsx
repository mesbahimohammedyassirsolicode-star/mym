import Container from "../../components/layout/Container";
import ContactHero from "./components/ContactHero";
import ContactForm from "./components/ContactForm";
import ContactAside from "./components/ContactAside";
import Reveal from "../../components/motion/Reveal";
import "./contact.css";

export default function ContactPage() {
  return (
    <>
      <ContactHero />

      <section className="home-section" aria-labelledby="contact-form-title">
        <Container>
          <div className="contact-layout">
            <Reveal className="contact-form-card">
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
            </Reveal>
            <Reveal delay={60}>
              <ContactAside />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}