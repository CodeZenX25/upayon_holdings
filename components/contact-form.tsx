"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, LoaderCircle } from "lucide-react";

interface SubmissionResponse {
  message?: string;
}

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email") || undefined,
      inquiryType: formData.get("inquiryType"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as SubmissionResponse;

      if (!response.ok) {
        throw new Error(
          result.message ?? "We couldn't send your message. Please try again.",
        );
      }

      setStatus("success");
      setMessage(
        result.message ??
          "Thank you. Our team has received your enquiry and will be in touch.",
      );
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          Your name <span aria-hidden="true">*</span>
          <input
            name="name"
            autoComplete="name"
            placeholder="e.g. Samira Rahman"
            minLength={1}
            maxLength={120}
            required
          />
        </label>
        <label>
          Phone number <span aria-hidden="true">*</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+880 1XXX-XXXXXX"
            minLength={7}
            maxLength={30}
            required
          />
        </label>
        <label>
          Email address
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
          />
        </label>
        <label>
          I&apos;m interested in
          <select name="inquiryType" defaultValue="general">
            <option value="general">A general enquiry</option>
            <option value="land-share">Land-share opportunities</option>
            <option value="flat-share">Flat-share opportunities</option>
            <option value="site-visit">Scheduling a site visit</option>
          </select>
        </label>
      </div>
      <label>
        How can we help?
        <textarea
          name="message"
          rows={4}
          placeholder="Tell us what you are looking for..."
          minLength={1}
          maxLength={5000}
          required
        />
      </label>
      {message ? (
        <p
          className={`form-message form-message-${status}`}
          role={status === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      ) : null}
      <button className="button button-dark form-submit" disabled={status === "sending"}>
        {status === "sending" ? (
          <>
            <LoaderCircle size={16} className="spin" aria-hidden="true" />
            Sending...
          </>
        ) : (
          <>
            Send your enquiry <ArrowUpRight size={16} aria-hidden="true" />
          </>
        )}
      </button>
      <p className="form-privacy">
        By submitting, you agree that our team may contact you about your
        enquiry.
      </p>
    </form>
  );
}
