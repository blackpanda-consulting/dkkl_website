"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  bookingSchema,
  CONDITION_OPTIONS,
  MOBILITY_OPTIONS,
} from "@/lib/booking-schema";
import {
  computePrice,
  formatInr,
  rateForRoom,
  MAX_MONTHS,
  MIN_MONTHS,
  type RoomType,
} from "@/lib/pricing";
import { useCountUp } from "@/lib/useCountUp";
import { optionalServicesNote, paymentNote, site } from "@/lib/content";

type Props = {
  singleRatePaise: number;
  doubleRatePaise: number;
  sharedRatePaise: number;
};

const ROOM_OPTIONS: { key: RoomType; label: string; sub: string }[] = [
  { key: "SINGLE", label: "Single", sub: "Single occupancy" },
  { key: "DOUBLE", label: "Double", sub: "Double occupancy" },
  { key: "SHARED", label: "Shared", sub: "Shared occupancy" },
];

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

export default function StayCalculator({
  singleRatePaise,
  doubleRatePaise,
  sharedRatePaise,
}: Props) {
  const rates = { singleRatePaise, doubleRatePaise, sharedRatePaise };
  const [roomType, setRoomType] = useState<RoomType>("DOUBLE");
  const [months, setMonths] = useState(1);
  const [moreThanMax, setMoreThanMax] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, submitCount },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    mode: "onBlur",
    defaultValues: { roomType: "DOUBLE", months: 1 },
  });

  // Keep the non-input values (slider months, room-type buttons) in the form so
  // the schema validates against real values.
  useEffect(() => {
    setValue("months", months);
  }, [months, setValue]);
  useEffect(() => {
    setValue("roomType", roomType);
  }, [roomType, setValue]);

  const errorCount = Object.keys(errors).length;
  const showErrorSummary = submitCount > 0 && errorCount > 0;

  const ratePaise = rateForRoom(roomType, rates);
  const price = useMemo(() => computePrice(months, ratePaise), [months, ratePaise]);
  const animatedTotal = useCountUp(price.totalPaise);

  const wa = site.whatsapp ? `https://wa.me/${site.whatsapp}` : "#contact";

  async function onSubmit(data: Record<string, unknown>) {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, months, roomType }),
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
        theme: { color: "#b84427" },
        handler: async (r: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          await fetch("/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(r),
          });
          window.location.href = `/book/success?ref=${encodeURIComponent(
            payload.bookingRef,
          )}&status=success`;
        },
        modal: { ondismiss: () => setSubmitting(false) },
      });
      rzp.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      {/* ---------------- Left: interactive calculator ---------------- */}
      <div className="card overflow-hidden p-0">
        {/* Animated total header */}
        <div className="bg-linear-to-br from-accent to-accent-hover px-7 py-8 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
            {moreThanMax ? "Long stay" : "Total payable now"}
          </p>
          {moreThanMax ? (
            <p className="mt-2 font-display text-3xl font-semibold">Let&apos;s talk</p>
          ) : (
            <p className="mt-1 font-display text-4xl font-semibold tabular-nums md:text-5xl">
              {formatInr(animatedTotal)}
            </p>
          )}
          {!moreThanMax && (
            <p className="mt-2 text-sm text-white/80">
              {ROOM_OPTIONS.find((r) => r.key === roomType)?.label} · {months}{" "}
              {months === 1 ? "month" : "months"}
            </p>
          )}
        </div>

        <div className="p-7">
          {/* Room type */}
          <label className="text-sm font-semibold text-foreground">Room type</label>
          <div className="mt-2 grid grid-cols-3 gap-2.5">
            {ROOM_OPTIONS.map((r) => {
              const active = roomType === r.key;
              const rate = rateForRoom(r.key, rates);
              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRoomType(r.key)}
                  className={`rounded-2xl border p-3 text-left transition-all ${
                    active
                      ? "border-accent bg-accent-soft"
                      : "border-border bg-surface hover:border-accent/50"
                  }`}
                >
                  <span className="block text-sm font-semibold text-foreground">{r.label}</span>
                  <span className="block text-[11px] leading-tight text-muted">{r.sub}</span>
                  <span className="mt-1.5 block text-sm font-semibold text-accent">
                    {formatInr(rate)}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mb-2 mt-6 flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground">
              Number of months
            </label>
            <Stepper months={months} onChange={setMonths} disabled={moreThanMax} />
          </div>

          <input
            type="range"
            min={MIN_MONTHS}
            max={MAX_MONTHS}
            value={months}
            disabled={moreThanMax}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="range mt-3 disabled:opacity-40"
            style={{
              background: moreThanMax
                ? "var(--border)"
                : `linear-gradient(90deg, var(--accent) ${
                    ((months - 1) / (MAX_MONTHS - 1)) * 100
                  }%, var(--surface-muted) ${((months - 1) / (MAX_MONTHS - 1)) * 100}%)`,
            }}
            aria-label="Number of months"
          />
          <div className="mt-1 flex justify-between text-[11px] text-muted">
            <span>1 mo</span>
            <span>{MAX_MONTHS} mo</span>
          </div>

          {/* quick chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {[1, 3, 6, 12].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMoreThanMax(false);
                  setMonths(m);
                }}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  !moreThanMax && months === m
                    ? "bg-accent text-white"
                    : "bg-surface-muted text-foreground/70 hover:text-accent"
                }`}
              >
                {m} mo
              </button>
            ))}
            <button
              type="button"
              onClick={() => setMoreThanMax((v) => !v)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                moreThanMax
                  ? "bg-accent text-white"
                  : "bg-surface-muted text-foreground/70 hover:text-accent"
              }`}
            >
              24+ mo
            </button>
          </div>

          {moreThanMax ? (
            <div className="mt-6 rounded-2xl bg-accent-soft p-5 text-sm">
              <p className="font-semibold text-foreground">Planning a stay over {MAX_MONTHS} months?</p>
              <p className="mt-1 text-muted">
                Please contact our Kashi team so we can plan a longer stay with you.
              </p>
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-4 inline-block rounded-full px-5 py-2.5 text-sm font-semibold"
              >
                Request a callback
              </a>
            </div>
          ) : (
            <dl className="mt-6 space-y-3 text-sm">
              <Row label="Monthly rate" value={formatInr(ratePaise)} />
              <Row
                label={`× ${months} ${months === 1 ? "month" : "months"}`}
                value={formatInr(price.totalPaise)}
              />
              <div className="border-t border-border pt-3">
                <Row label="Total payable now" value={formatInr(price.totalPaise)} strong />
              </div>
            </dl>
          )}

          <p className="mt-6 text-xs leading-relaxed text-muted">
            GST, where applicable, is billed separately. {optionalServicesNote}
          </p>
        </div>
      </div>

      {/* ---------------- Right: details + consent + CTA ---------------- */}
      <form onSubmit={handleSubmit(onSubmit)} className="card p-7">
        <h3 className="font-display text-xl font-semibold text-foreground">
          Resident &amp; family details
        </h3>
        <p className="mt-1 text-sm text-muted">
          Required before payment. Our team uses these to plan arrival and support.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Family contact name" error={errors.familyName?.message as string}>
            <input {...register("familyName")} className={inputCls} autoComplete="name" />
          </Field>
          <Field label="Family mobile number" error={errors.familyMobile?.message as string}>
            <input {...register("familyMobile")} className={inputCls} inputMode="tel" />
          </Field>
          <Field label="Resident name" error={errors.residentName?.message as string}>
            <input {...register("residentName")} className={inputCls} />
          </Field>
          <Field label="Resident age" error={errors.residentAge?.message as string}>
            <input {...register("residentAge")} type="number" min={0} max={120} className={inputCls} />
          </Field>
          <Field label="Current condition" error={errors.condition?.message as string}>
            <select {...register("condition")} defaultValue="" className={inputCls}>
              <option value="" disabled>Select…</option>
              {CONDITION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Mobility" error={errors.mobility?.message as string}>
            <select {...register("mobility")} defaultValue="" className={inputCls}>
              <option value="" disabled>Select…</option>
              {MOBILITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Expected arrival date" error={errors.arrivalDate?.message as string}>
            <input {...register("arrivalDate")} type="date" className={inputCls} />
          </Field>
          <Field label="Attendant name" error={errors.attendantName?.message as string}>
            <input {...register("attendantName")} className={inputCls} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Attendant relationship" error={errors.attendantRelation?.message as string}>
              <input {...register("attendantRelation")} className={inputCls} placeholder="e.g. Son, Daughter, Nurse" />
            </Field>
          </div>
        </div>

        <div className="mt-5 space-y-3 rounded-2xl bg-surface-muted p-4">
          <Checkbox {...register("longTermConfirmed")} error={errors.longTermConfirmed?.message as string}>
            I confirm this is a long-term stay of a month or more.
          </Checkbox>
          <Checkbox {...register("consentAccepted")} error={errors.consentAccepted?.message as string}>
            I accept the responsibility, cancellation, refund and privacy terms.{" "}
            <a href="/terms" target="_blank" className="text-accent underline">Read terms</a>.
          </Checkbox>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted">{paymentNote}</p>

        {showErrorSummary && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5 text-sm text-danger"
          >
            <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <span>
              Please complete the {errorCount} highlighted{" "}
              {errorCount === 1 ? "field" : "fields"} above to continue.
            </span>
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
        )}

        <button
          type="submit"
          disabled={moreThanMax || submitting}
          aria-disabled={moreThanMax || submitting}
          className="btn-primary mt-5 flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold"
        >
          {submitting ? (
            <>
              <Spinner /> Starting secure payment…
            </>
          ) : (
            <>🔒 Proceed to Secure Payment · {formatInr(price.totalPaise)}</>
          )}
        </button>
        <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-xs text-muted">
          Payments processed securely by Razorpay
        </p>
      </form>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25";

function Stepper({
  months,
  onChange,
  disabled,
}: {
  months: number;
  onChange: (m: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className={`flex items-center gap-1 ${disabled ? "opacity-40" : ""}`}>
      <StepBtn label="−" onClick={() => onChange(Math.max(MIN_MONTHS, months - 1))} disabled={disabled || months <= MIN_MONTHS} />
      <span className="w-8 text-center font-display text-lg font-semibold text-foreground tabular-nums">
        {months}
      </span>
      <StepBtn label="+" onClick={() => onChange(Math.min(MAX_MONTHS, months + 1))} disabled={disabled || months >= MAX_MONTHS} />
    </div>
  );
}

function StepBtn({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-lg text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-30"
    >
      {label}
    </button>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className={strong ? "font-semibold text-foreground" : "text-muted"}>{label}</dt>
      <dd
        className={`tabular-nums ${
          strong ? "text-lg font-bold text-accent" : "font-semibold text-foreground"
        }`}
      >
        {value}
      </dd>
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
    <label className={`block ${error ? "field-invalid" : ""}`}>
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
      {error && (
        <span className="mt-1 flex items-center gap-1 text-xs text-danger">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          {error}
        </span>
      )}
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

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
