import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatInr } from "@/lib/pricing";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

// searchParams is async in Next 16.
export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; status?: string }>;
}) {
  const { ref } = await searchParams;
  const booking = ref
    ? await prisma.booking.findUnique({ where: { bookingRef: ref } })
    : null;

  const view = resolveView(booking?.status);

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-surface p-8 text-center shadow-sm">
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${view.iconBg}`}
          aria-hidden
        >
          {view.icon}
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-foreground">{view.title}</h1>
        <p className="mt-2 text-muted">{view.body}</p>

        {booking && (
          <dl className="mt-6 space-y-2 rounded-xl bg-surface-muted p-5 text-left text-sm">
            <Row label="Booking reference" value={booking.bookingRef} />
            <Row label="Expected stay" value={`${booking.months} month(s)`} />
            <Row label="Amount" value={formatInr(booking.amountPaise)} />
          </dl>
        )}

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {view.showRetry && (
            <Link
              href="/#pricing"
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
            >
              Retry Payment
            </Link>
          )}
          <Link
            href="/"
            className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-foreground hover:border-accent hover:text-accent"
          >
            Back to home
          </Link>
        </div>

        <p className="mt-6 text-xs text-muted">
          Questions? Our team is here to help.
        </p>
      </div>
    </main>
  );
}

function resolveView(status?: string) {
  switch (status) {
    case "PAID_PENDING_ADMISSION":
      return {
        title: "Payment successful",
        body: "Our Kashi team will contact you to complete final verification and arrival planning.",
        icon: <CheckIcon />,
        iconBg: "bg-success/15 text-success",
        showRetry: false,
      };
    case "FAILED":
      return {
        title: "Payment did not complete",
        body: "Your booking is held. You can retry the payment. No confirmed booking has been created.",
        icon: <CrossIcon />,
        iconBg: "bg-danger/15 text-danger",
        showRetry: true,
      };
    case "REFUND_INITIATED":
    case "REFUND_COMPLETED":
      return {
        title: "Refund in progress",
        body: "We have updated your refund status and will notify you when it completes.",
        icon: <CheckIcon />,
        iconBg: "bg-accent/15 text-accent",
        showRetry: false,
      };
    case "PROVISIONAL":
    case "PENDING":
      return {
        title: "Payment pending",
        body: "Your payment is being confirmed. Please do not initiate a duplicate payment. We will update you shortly.",
        icon: <ClockIcon />,
        iconBg: "bg-accent/15 text-accent",
        showRetry: false,
      };
    default:
      return {
        title: "We couldn't find that booking",
        body: "If you completed a payment, our team will still receive it. Please contact us with any payment reference you have.",
        icon: <ClockIcon />,
        iconBg: "bg-surface-muted text-muted",
        showRetry: false,
      };
  }
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="font-semibold text-foreground">{value}</dd>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
function CrossIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
