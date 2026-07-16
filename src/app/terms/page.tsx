import Link from "next/link";
import { footerDisclaimer, includes, site } from "@/lib/content";

export const metadata = {
  title: `Terms, Cancellation & Refund Policy — ${site.romanName}`,
};

// PLACEHOLDER for the legal clauses (§12) — final wording to be approved by
// Dinesh Kiran Kashi Laabh / legal. The Accommodation & Pricing content is
// supplied by the business.
export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-14">
      <Link href="/" className="text-sm text-accent hover:underline">
        ← Back to home
      </Link>
      <h1 className="mt-4 text-3xl font-semibold text-foreground">
        Terms, Accommodation &amp; Pricing
      </h1>

      {/* Accommodation & Pricing */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-foreground">Accommodation &amp; Pricing</h2>
        <p className="mt-2 leading-relaxed text-muted">{includes.intro}</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {includes.rooms.map((room) => (
            <div key={room.name} className="rounded-2xl border border-border bg-surface p-5">
              <h3 className="font-semibold text-foreground">{room.name}</h3>
              <p className="mt-2">
                <span className="text-2xl font-semibold text-accent">{room.price}</span>{" "}
                <span className="text-sm text-muted">{room.gst} · {room.per}</span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{room.desc}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-6 font-semibold text-foreground">{includes.includedTitle}</h3>
        <ul className="mt-2 list-inside list-disc text-muted">
          {includes.included.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>

        <h3 className="mt-6 font-semibold text-foreground">{includes.supportTitle}</h3>
        <p className="mt-1 text-sm text-muted">{includes.supportLead}</p>
        <ul className="mt-2 list-inside list-disc text-muted">
          {includes.services.map((s) => (
            <li key={s.label}>{s.label}</li>
          ))}
        </ul>
        <p className="mt-4 rounded-lg bg-surface-muted px-4 py-3 text-sm leading-relaxed text-muted">
          {includes.servicesNote}
        </p>
      </section>

      <div className="mt-10 space-y-6 text-muted [&_h2]:text-foreground">
        <Info title="Responsibility">{footerDisclaimer}</Info>
        <Info title="Eligibility and admission">
          Payment does not remove {site.romanName}&apos;s right to reject or modify
          admission if the resident does not meet the disclosed eligibility or safety
          requirements. Where admission is declined for this reason, refunds will be
          handled as described in the cancellation and refund policy below.
        </Info>
        <Info title="Cancellation and refunds">
          [To be specified: cancellation windows, deductions, and processing
          timelines, including how refunds are issued when admission is declined on
          eligibility/safety grounds.]
        </Info>
        <Info title="Privacy">
          [To be specified: how resident and family information is stored, used and
          shared.]
        </Info>
      </div>

      <p className="mt-8 text-xs text-muted">
        Final legal wording to be provided and approved by {site.romanName} before
        launch.
      </p>
    </main>
  );
}

function Info({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 leading-relaxed">{children}</p>
    </section>
  );
}
