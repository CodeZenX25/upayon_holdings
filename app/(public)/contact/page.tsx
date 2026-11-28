import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact Us — Visit Our Mirpur DOHS Office",
  description:
    "Call +880 1339336953 or visit Upayon Holdings at House-342, Road-5, Avenue 3, Mirpur DOHS, Dhaka 1216 to discuss land share, flat share and apartments for sale.",
  alternates: { canonical: "/contact" },
};

const contactItems = [
  {
    icon: <MessageCircle size={17} aria-hidden="true" />,
    title: "Land-share & flat-share",
    detail: "Explore project opportunities",
    href: "#enquiry-form",
  },
  {
    icon: <ArrowUpRight size={17} aria-hidden="true" />,
    title: "Send an enquiry",
    detail: "Tell us what you are looking for",
    href: "#enquiry-form",
  },
  {
    icon: <MapPin size={17} aria-hidden="true" />,
    title: "Find us",
    detail: "Dhaka, Bangladesh",
    href: "https://maps.google.com/?q=Dhaka,Bangladesh",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="page-hero page-hero-contact">
        <div className="page-container">
          <p className="eyebrow eyebrow-light">We&apos;re here to help</p>
          <h1>Let&apos;s start a conversation.</h1>
          <p>
            Ask a question, explore an opportunity, or simply tell us what
            you&apos;re looking for.
          </p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            Contact
          </div>
        </div>
      </section>

      <section className="contact-page-section section-padding">
        <div className="page-container contact-page-grid">
          <div className="contact-details">
            <p className="eyebrow">Reach out, your way</p>
            <h2>We&apos;d love to hear from you.</h2>
            <p>
              Share what you have in mind and a member of our team will be in
              touch to understand how we can help.
            </p>
            <div className="contact-methods">
              {contactItems.map((item) => (
                <a className="contact-method" href={item.href} key={item.title}>
                  <span className="contact-method-icon">{item.icon}</span>
                  <span>
                    <small>{item.title}</small>
                    <strong>{item.detail}</strong>
                  </span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              ))}
            </div>
            <div className="office-note">
              <span>
                <MessageCircle size={16} aria-hidden="true" />
              </span>
              <p>
                <strong>What happens next</strong>
                <br />
                We&apos;ll review your message and follow up with you about your
                enquiry.
              </p>
            </div>
            <div className="contact-whatsapp">
              <MessageCircle size={19} aria-hidden="true" />
              <div>
                <strong>Not sure where to start?</strong>
                <p>A few details are enough to begin the conversation.</p>
              </div>
              <a href="#enquiry-form" aria-label="Go to enquiry form">
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="contact-form-panel" id="enquiry-form">
            <div className="contact-form-heading">
              <p className="eyebrow">Send us a note</p>
              <h2>How can we help?</h2>
              <p>Fields marked with * are required.</p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="contact-map-section">
        <div className="page-container contact-map-inner">
          <div className="contact-map-visual" aria-hidden="true">
            <span className="map-street map-street-one" />
            <span className="map-street map-street-two" />
            <span className="map-street map-street-three" />
            <span className="map-water" />
            <span className="map-pin">
              <MapPin size={18} aria-hidden="true" />
            </span>
            <span className="map-label">DHAKA, BANGLADESH</span>
          </div>
          <div>
            <p className="eyebrow">Rooted in Dhaka</p>
            <h2>Local understanding, personal guidance.</h2>
            <p>
              Our team works across Dhaka and understands that every
              neighborhood has its own character. Get in touch to arrange a
              conversation or discuss a site visit.
            </p>
            <Link className="text-link" href="/projects">
              Explore our project locations{" "}
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
