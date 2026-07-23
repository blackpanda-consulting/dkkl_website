"use client";

import { useMemo, useState } from "react";
import {
  computePrice,
  depositForStay,
  depositLabel,
  estimatedTotalPaise,
  formatInr,
  rateForRoom,
  SHORT_STAY_DEPOSIT_PAISE,
  MAX_MONTHS,
  MIN_MONTHS,
  type RoomType,
} from "@/lib/pricing";
import { useCountUp } from "@/lib/useCountUp";
import { booking, optionalServicesNote, site } from "@/lib/content";

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

// Shows what a stay would cost so families can plan. It deliberately takes NO
// payment: booking is a flat fee paid on Razorpay's hosted page, so no amount
// can be carried across from here. The server-side order flow in /api/orders
// stays in place, dormant, for if per-booking charging returns.
export default function StayEstimator({
  singleRatePaise,
  doubleRatePaise,
  sharedRatePaise,
}: Props) {
  const rates = { singleRatePaise, doubleRatePaise, sharedRatePaise };
  const [roomType, setRoomType] = useState<RoomType>("DOUBLE");
  const [months, setMonths] = useState(1);
  const [moreThanMax, setMoreThanMax] = useState(false);

  const ratePaise = rateForRoom(roomType, rates);
  const price = useMemo(() => computePrice(months, ratePaise), [months, ratePaise]);
  // Deposit is tiered by stay length and derived from the selected room's rate.
  const deposit = depositForStay(months, ratePaise);
  // Headline figure is the family's full outlay: accommodation + deposit.
  const grandTotal = estimatedTotalPaise(price.totalPaise, deposit);
  const animatedTotal = useCountUp(grandTotal);

  const wa = site.whatsapp ? `https://wa.me/${site.whatsapp}` : "#contact";

  return (
    <div className="mx-auto max-w-3xl">
      <div className="card overflow-hidden p-0">
        {/* Estimate header */}
        <div className="bg-linear-to-br from-accent to-accent-hover px-7 py-8 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
            {moreThanMax ? "Long stay" : "Estimated cost of stay"}
          </p>
          {moreThanMax ? (
            <p className="mt-2 font-display text-3xl font-semibold">Let&apos;s talk</p>
          ) : (
            <>
              <p className="mt-1 font-display text-4xl font-semibold tabular-nums md:text-5xl">
                {formatInr(animatedTotal)}
              </p>
              <p className="mt-2 text-sm text-white/80">
                {ROOM_OPTIONS.find((r) => r.key === roomType)?.label} · {months}{" "}
                {months === 1 ? "month" : "months"} · includes {formatInr(deposit)}{" "}
                refundable deposit · plus GST
              </p>
            </>
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
                  aria-pressed={active}
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
            <label className="text-sm font-semibold text-foreground">Number of months</label>
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
              <p className="font-semibold text-foreground">
                Planning a stay over {MAX_MONTHS} months?
              </p>
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
              <Row label={depositLabel(months)} value={formatInr(deposit)} />
              <div className="border-t border-border pt-3">
                <Row label="Estimated total" value={formatInr(grandTotal)} strong />
              </div>
            </dl>
          )}

          <p className="mt-6 text-xs leading-relaxed text-muted">
            The security deposit is refundable and depends on the length of stay:{" "}
            {formatInr(SHORT_STAY_DEPOSIT_PAISE)}{" "}
            for a one-month stay, one month&apos;s charges for a three or six month
            stay, and two months&apos; charges for longer stays, based on the occupancy
            you choose. {booking.estimateNote} GST, where applicable, is billed
            separately. {optionalServicesNote}
          </p>
        </div>

        {/* Booking fee — the only thing actually paid online */}
        <div className="border-t border-border bg-surface-muted px-7 py-8">
          <h3 className="text-xl font-semibold text-foreground">{booking.heading}</h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{booking.note}</p>

          {/* The hosted page asks the payer to type an amount, so state it here
              where they'll actually read it — right above the button. */}
          {booking.link && (
            <p className="mt-4 flex max-w-xl items-start gap-2.5 rounded-xl border border-gold/40 bg-gold-soft/50 px-4 py-3 text-sm font-medium text-foreground">
              <span className="mt-0.5 shrink-0 text-caramel" aria-hidden>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v5M12 16h.01" />
                </svg>
              </span>
              {booking.enterAmountHint}
            </p>
          )}

          {booking.link ? (
            <a
              href={booking.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-5 inline-flex items-center gap-2.5 rounded-full px-7 py-4 text-sm font-semibold"
            >
              🔒 {booking.cta} · {booking.fee}
              <ExternalIcon />
            </a>
          ) : (
            // No link configured yet — never show a dead button on a payment CTA.
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-5 inline-flex items-center gap-2.5 rounded-full px-7 py-4 text-sm font-semibold"
            >
              Request a callback to book
            </a>
          )}

          <p className="mt-3 max-w-xl text-xs leading-relaxed text-muted">
            {booking.link
              ? `Opens in a new tab. ${booking.processorNote}`
              : "Online booking is being set up. Our team will take your booking by phone."}
          </p>
        </div>
      </div>
    </div>
  );
}

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
      <StepBtn
        label="−"
        onClick={() => onChange(Math.max(MIN_MONTHS, months - 1))}
        disabled={disabled || months <= MIN_MONTHS}
      />
      <span className="w-8 text-center font-display text-lg font-semibold text-foreground tabular-nums">
        {months}
      </span>
      <StepBtn
        label="+"
        onClick={() => onChange(Math.min(MAX_MONTHS, months + 1))}
        disabled={disabled || months >= MAX_MONTHS}
      />
    </div>
  );
}

function StepBtn({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
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

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
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

function ExternalIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M14 4h6v6M20 4l-8 8M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  );
}
