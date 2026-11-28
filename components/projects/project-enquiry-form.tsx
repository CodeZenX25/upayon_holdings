"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";

interface ProjectEnquiryFormProps {
  /** Linked Project id (omit for pages that aren't Projects, e.g. Construction). */
  projectId?: string;
  projectTitle: string;
  inquiryType: "land-share" | "flat-share" | "general";
}

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

const fieldClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-[16px] text-navy-900 placeholder:text-slate-500 transition focus:border-brand-purple focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-purple/10";

export function ProjectEnquiryForm({ projectId, projectTitle, inquiryType }: ProjectEnquiryFormProps) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (key: string) => String(data.get(key) ?? "").trim();

    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: value("name"),
          phone: value("phone"),
          email: value("email") || undefined,
          message: projectId
            ? value("message") || `I would like more information about ${projectTitle}.`
            : `[${projectTitle}] ${value("message") || "I would like more information about this construction."}`,
          project: projectId,
          inquiryType,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) {
        setStatus({ kind: "error", message: body.message ?? "Something went wrong. Please try again." });
        return;
      }
      form.reset();
      setStatus({ kind: "sent" });
    } catch {
      setStatus({ kind: "error", message: "Network error. Please check your connection and try again." });
    }
  }

  if (status.kind === "sent") {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center" role="status">
        <CheckCircle2 className="size-12 text-brand-purple" aria-hidden="true" />
        <p className="text-[20px] font-semibold text-navy-900">Thank you!</p>
        <p className="text-[15px] leading-relaxed text-slate-600">
          Our team has received your request and will contact you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus({ kind: "idle" })}
          className="mt-2 text-[14px] font-semibold text-brand-purple hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5" noValidate={false}>
      <label className="block">
        <span className="sr-only">Full name</span>
        <input name="name" required maxLength={120} autoComplete="name" placeholder="Full name*" className={fieldClass} />
      </label>
      <label className="block">
        <span className="sr-only">Phone number</span>
        <input
          name="phone"
          type="tel"
          required
          minLength={7}
          maxLength={30}
          autoComplete="tel"
          placeholder="Phone number*"
          className={fieldClass}
        />
      </label>
      <label className="block">
        <span className="sr-only">Email</span>
        <input name="email" type="email" autoComplete="email" placeholder="Email (optional)" className={fieldClass} />
      </label>
      <label className="block">
        <span className="sr-only">Message</span>
        <textarea
          name="message"
          rows={4}
          maxLength={5000}
          placeholder="Message..."
          className={`${fieldClass} resize-none`}
        />
      </label>

      {status.kind === "error" && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-[14px] text-red-700" role="alert">
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={status.kind === "sending"}
        className="group flex w-full items-center justify-center gap-2 rounded-full bg-brand-purple px-7 py-4 text-[15px] font-semibold text-white transition hover:bg-[#6a3f93] disabled:opacity-70"
      >
        {status.kind === "sending" ? (
          <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
        ) : (
          <>
            Submit
            <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
