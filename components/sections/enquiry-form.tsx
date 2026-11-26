"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "success" | "error";

// Light theme: boxed fields on white, logo-purple focus ring (no gradients).
const fieldClass =
  "mt-2 w-full rounded-xl border border-navy-900/10 bg-paper px-4 py-3.5 text-[16px] text-navy-900 placeholder:text-slate-400 outline-none transition focus:border-brand-purple focus:bg-white focus:ring-4 focus:ring-brand-purple/15";
const labelClass = "block text-[12px] font-bold uppercase tracking-[0.18em] text-slate-600";

export function EnquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          phone: data.get("phone"),
          email: data.get("email") || undefined,
          inquiryType: data.get("inquiryType"),
          message: data.get("message"),
        }),
      });
      const result = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) {
        throw new Error(result.message ?? "We couldn't send your enquiry. Please try again.");
      }
      setStatus("success");
      setMessage(result.message ?? "Thank you! Our team will contact you shortly.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Name *</span>
          <input name="name" required maxLength={120} autoComplete="name" placeholder="Enter your name" className={fieldClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Phone *</span>
          <input name="phone" type="tel" required minLength={7} maxLength={30} autoComplete="tel" placeholder="+880 1XXX-XXXXXX" className={fieldClass} />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Email</span>
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com" className={fieldClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Interested in</span>
          <select name="inquiryType" defaultValue="general" className={cn(fieldClass, "cursor-pointer")}>
            <option value="general">General enquiry</option>
            <option value="land-share">Land share</option>
            <option value="flat-share">Flat share</option>
            <option value="site-visit">Book a site visit</option>
          </select>
        </label>
      </div>
      <label className="block">
        <span className={labelClass}>Message *</span>
        <textarea
          name="message"
          required
          maxLength={5000}
          rows={4}
          placeholder="I am interested in Land Share / Flat Share..."
          className={cn(fieldClass, "resize-none")}
        />
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="group !mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-brand-purple px-8 py-4 text-[14px] font-bold uppercase tracking-[0.12em] text-white transition-colors duration-300 hover:bg-navy-900 disabled:opacity-60"
      >
        {status === "sending" ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
        )}
        {status === "sending" ? "Sending…" : "Submit enquiry"}
      </button>

      <p
        role="status"
        aria-live="polite"
        className={cn(
          "flex items-center gap-2 text-[15px] font-medium empty:hidden",
          status === "success" && "text-brand-purple",
          status === "error" && "text-red-600",
        )}
      >
        {status === "success" && <CheckCircle2 className="size-4" aria-hidden="true" />}
        {message}
      </p>
    </form>
  );
}
