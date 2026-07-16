"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enquirySchema, STAY_OPTIONS } from "@/lib/enquiry-schema";

export default function EnquiryForm() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(enquirySchema),
    mode: "onBlur",
  });

  async function onSubmit(data: Record<string, unknown>) {
    setError(null);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again, or call us directly.");
    }
  }

  if (done) {
    return (
      <div className="card flex flex-col items-center justify-center p-8 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <h3 className="mt-4 font-display text-xl font-semibold text-foreground">Thank you</h3>
        <p className="mt-2 max-w-sm text-muted">
          We&apos;ve received your enquiry. Our Kashi team will call you back to help
          plan the stay.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card p-6 md:p-7">
      <h3 className="font-display text-xl font-semibold text-foreground">
        Book a Free Consultation
      </h3>
      <p className="mt-1 text-sm text-muted">
        Share a few details and our team will call you back — no obligation.
      </p>

      <div className="mt-5 space-y-4">
        <Field label="Full name" error={errors.name?.message as string}>
          <input {...register("name")} className={inputCls} autoComplete="name" placeholder="Your name" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Mobile number" error={errors.mobile?.message as string}>
            <input {...register("mobile")} className={inputCls} inputMode="tel" placeholder="+91…" />
          </Field>
          <Field label="Email (optional)" error={errors.email?.message as string}>
            <input {...register("email")} className={inputCls} inputMode="email" placeholder="you@example.com" />
          </Field>
        </div>
        <Field label="Preferred stay" error={errors.preferredStay?.message as string}>
          <select {...register("preferredStay")} defaultValue="" className={inputCls}>
            <option value="">Select…</option>
            {STAY_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </Field>
        <Field label="Message (optional)" error={errors.message?.message as string}>
          <textarea
            {...register("message")}
            rows={4}
            className={`${inputCls} resize-none`}
            placeholder="Tell us about the resident and how we can help."
          />
        </Field>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary mt-5 w-full rounded-full px-6 py-3.5 text-sm font-semibold"
      >
        {isSubmitting ? "Sending…" : "Book My Free Consultation"}
      </button>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${error ? "field-invalid" : ""}`}>
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
}
