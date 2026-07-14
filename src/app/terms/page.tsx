import Link from "next/link";
import { footerDisclaimer, site } from "@/lib/content";

export const metadata = {
  title: `Terms, Cancellation & Refund Policy — ${site.name}`,
};

// PLACEHOLDER: DKKL must supply final legal copy before launch. The clauses
// below are required by the spec (§12) and must be reviewed by DKKL/legal.
export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-14">
      <Link href="/" className="text-sm text-accent hover:underline">
        ← Back to home
      </Link>
      <h1 className="mt-4 text-3xl font-semibold text-foreground">
        Terms, Cancellation &amp; Refund Policy
      </h1>
      <p className="mt-2 rounded-lg bg-accent-soft px-4 py-3 text-sm text-foreground">
        Draft placeholder — final wording to be provided and approved by DKKL
        before launch.
      </p>

      <div className="mt-8 space-y-6 text-muted [&_h2]:text-foreground">
        <Section title="1. Responsibility">
          {footerDisclaimer}
        </Section>
        <Section title="2. Eligibility and admission">
          Payment does not remove DKKL&apos;s right to reject or modify admission if
          the resident does not meet the disclosed eligibility or safety
          requirements. Where admission is declined for this reason, refunds will
          be handled as described in the refund policy below.
        </Section>
        <Section title="3. Security deposit">
          The security deposit is refundable and charged once. It is separate from
          the accommodation amount and is not multiplied by the number of months.
        </Section>
        <Section title="4. Cancellation and refunds">
          [DKKL to specify cancellation windows, deductions, and processing
          timelines. Include how refunds are issued when admission is declined on
          eligibility/safety grounds.]
        </Section>
        <Section title="5. Additional services">
          Food, nursing, medical consultations, local transport, temple visits and
          other support are arranged separately according to need and are not
          included unless expressly shown at payment.
        </Section>
        <Section title="6. Privacy">
          [DKKL to specify how resident and family information is stored, used and
          shared.]
        </Section>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 leading-relaxed">{children}</p>
    </section>
  );
}
