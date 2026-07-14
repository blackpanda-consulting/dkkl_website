"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  bookingSchema,
  type BookingInput,
  CONDITION_OPTIONS,
  MOBILITY_OPTIONS,
} from "@/lib/booking-schema";
import { computePrice, formatInr, MAX_MONTHS } from "@/lib/pricing";
import {
  twinSharingNote,
  optionalServicesNote,
  paymentNote,
  site,
} from "@/lib/content";

type Props = {
  monthlyRatePaise: number;
  depositPaise: number;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function StayCalculator({ monthlyRatePaise, depositPaise }: Props) {
  const [months, setMonths] = useState(1);
  const [moreThanMax, setMoreThanMax] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Let RHF infer input/output types from the resolver. z.coerce fields have an
  // `unknown` input type, so an explicit output generic here would not match.
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    mode: "onChange",
  });

  const price = useMemo(
    () => computePrice(months, monthlyRatePaise, depositPaise),
    [months, monthlyRatePaise, depositPaise],
  );

  const wa = site.whatsapp ? `https://wa.me/${site.whatsapp}` : "#contact";

  async function onSubmit(data: BookingInput) {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, months }),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.error ?? "Could not start payment. Please try again.");
      }

      const ok = await loadRazorpay();
      if (!ok || !window.Razorpay) {
        throw new Error("Payment could not load. Check your connection and retry.");
      }

      const rzp = new window.Razorpay({
        key: payload.keyId,
        order_id: payload.orderId,
        amount: payload.amountPaise,
        currency: "INR",
        name: site.name,
        description: `Long-term stay — ${months} month(s)`,
        prefill: { name: data.familyName, contact: data.familyMobile },
        notes: { bookingRef: payload.bookingRef },
        theme: { color: "#a8471f" },
        handler: async (r: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          // Optimistic client verification; the webhook is authoritative.
          await fetch("/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(r),
          });
          window.location.href = `/book/success?ref=${encodeURIComponent(
            payload.bookingRef,
          )}&status=success`;
        },
        modal: {
          ondismiss: () => setSubmitting(false),
        },
      });
      rzp.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      {/* ---- Left: calculator summary ---- */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground">Calculate Stay Cost</h3>

        <label className="mt-5 block text-sm font-medium text-foreground">
          Number of months
        </label>
        <div className="mt-2 flex items-center gap-3">
          <select
            value={moreThanMax ? "more" : months}
            onChange={(e) => {
              if (e.target.value === "more") {
                setMoreThanMax(true);
              } else {
                setMoreThanMax(false);
                setMonths(Number(e.target.value));
              }
            }}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            {Array.from({ length: MAX_MONTHS }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m} {m === 1 ? "month" : "months"}
              </option>
            ))}
            <option value="more">More than {MAX_MONTHS} months</option>
          </select>
        </div>

        {moreThanMax ? (
          <div className="mt-6 rounded-xl bg-accent-soft p-4 text-sm text-foreground">
            <p className="font-medium">Stays over {MAX_MONTHS} months</p>
            <p className="mt-1 text-muted">
              Please contact our Kashi team so we can plan a longer stay with you.
            </p>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
            >
              Request a callback
            </a>
          </div>
        ) : (
          <dl className="mt-6 space-y-3 text-sm">
            <Row label="Monthly accommodation rate" value={formatInr(monthlyRatePaise)} />
            <Row
              label={`Accommodation × ${months} ${months === 1 ? "month" : "months"}`}
              value={formatInr(price.accommodationPaise)}
            />
            <Row
              label="Refundable security deposit (one-time)"
              value={formatInr(depositPaise)}
            />
            <div className="border-t border-border pt-3">
              <Row label="Total payable now" value={formatInr(price.totalPaise)} strong />
            </div>
          </dl>
        )}

        <p className="mt-5 rounded-lg bg-surface-muted p-3 text-xs leading-relaxed text-muted">
          {twinSharingNote}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-muted">{optionalServicesNote}</p>
      </div>

      {/* ---- Right: details form + consent + CTA ---- */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-foreground">Resident &amp; family details</h3>
        <p className="mt-1 text-sm text-muted">
          Required before payment. Our team uses these to plan arrival and support.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Family contact name" error={errors.familyName?.message}>
            <input {...register("familyName")} className={inputCls} autoComplete="name" />
          </Field>
          <Field label="Family mobile number" error={errors.familyMobile?.message}>
            <input {...register("familyMobile")} className={inputCls} inputMode="tel" />
          </Field>
          <Field label="Resident name" error={errors.residentName?.message}>
            <input {...register("residentName")} className={inputCls} />
          </Field>
          <Field label="Resident age" error={errors.residentAge?.message}>
            <input {...register("residentAge")} type="number" min={0} max={120} className={inputCls} />
          </Field>
          <Field label="Current condition" error={errors.condition?.message}>
            <select {...register("condition")} defaultValue="" className={inputCls}>
              <option value="" disabled>Select…</option>
              {CONDITION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Mobility" error={errors.mobility?.message}>
            <select {...register("mobility")} defaultValue="" className={inputCls}>
              <option value="" disabled>Select…</option>
              {MOBILITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Expected arrival date" error={errors.arrivalDate?.message}>
            <input {...register("arrivalDate")} type="date" className={inputCls} />
          </Field>
          <Field label="Attendant name" error={errors.attendantName?.message}>
            <input {...register("attendantName")} className={inputCls} />
          </Field>
          <Field label="Attendant relationship" error={errors.attendantRelation?.message}>
            <input {...register("attendantRelation")} className={inputCls} placeholder="e.g. Son, Daughter, Nurse" />
          </Field>
        </div>

        <div className="mt-5 space-y-3">
          <Checkbox {...register("longTermConfirmed")} error={errors.longTermConfirmed?.message}>
            I confirm this is a long-term stay and not tourist accommodation.
          </Checkbox>
          <Checkbox {...register("consentAccepted")} error={errors.consentAccepted?.message}>
            I accept the responsibility, cancellation, refund and privacy terms.{" "}
            <a href="/terms" target="_blank" className="text-accent underline">Read terms</a>.
          </Checkbox>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted">{paymentNote}</p>

        {error && (
          <p className="mt-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
        )}

        <button
          type="submit"
          disabled={!isValid || moreThanMax || submitting}
          className="mt-5 w-full rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? "Starting secure payment…"
            : `Proceed to Secure Payment · ${formatInr(price.totalPaise)}`}
        </button>
        <p className="mt-2 text-center text-xs text-muted">
          Payments are processed securely by Razorpay.
        </p>
      </form>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className={strong ? "font-semibold text-foreground" : "text-muted"}>{label}</dt>
      <dd className={strong ? "text-lg font-bold text-accent" : "font-medium text-foreground"}>{value}</dd>
    </div>
  );
}

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
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-foreground">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
}

const Checkbox = function Checkbox({
  error,
  children,
  ...props
}: React.ComponentPropsWithRef<"input"> & { error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-start gap-3 text-sm text-foreground/90">
        <input type="checkbox" {...props} className="mt-0.5 h-4 w-4 accent-accent" />
        <span>{children}</span>
      </label>
      {error && <span className="ml-7 mt-1 block text-xs text-danger">{error}</span>}
    </div>
  );
};
