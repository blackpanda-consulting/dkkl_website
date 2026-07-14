import Link from "next/link";
import TopNav from "@/components/TopNav";
import MobileActions from "@/components/MobileActions";
import Faq from "@/components/Faq";
import StayCalculator from "@/components/StayCalculator";
import { getSettings } from "@/lib/settings";
import {
  hero,
  who,
  includes,
  responsibility,
  howItWorks,
  faqs,
  footerDisclaimer,
  site,
} from "@/lib/content";

// Always render fresh so an admin rate change is reflected immediately (spec §7).
export const dynamic = "force-dynamic";

export default async function Home() {
  const settings = await getSettings();
  const tel = site.phone ? `tel:${site.phone}` : "#contact";
  const wa = site.whatsapp ? `https://wa.me/${site.whatsapp}` : "#contact";

  return (
    <>
      <TopNav />

      <main className="flex-1 pb-20 md:pb-0">
        {/* HERO */}
        <section id="home" className="relative overflow-hidden">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
            <div>
              <p className="mb-3 inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
                {hero.eyebrow}
              </p>
              <h1 className="text-3xl font-semibold leading-tight text-foreground md:text-5xl">
                {hero.headline}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
                {hero.body}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="#pricing"
                  className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
                >
                  {hero.primaryCta}
                </Link>
                <a
                  href={tel}
                  className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  {hero.secondaryCta}
                </a>
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-surface p-8 shadow-sm">
              <blockquote className="font-serif text-xl leading-relaxed text-foreground/90">
                &ldquo;A quiet, respectful place to be together in Kashi during
                the final phase of life.&rdquo;
              </blockquote>
              <ul className="mt-6 space-y-3 text-sm text-muted">
                <Feature>Twin-sharing room for resident + one attendant</Feature>
                <Feature>Local coordination for food, hospital &amp; temple visits</Feature>
                <Feature>Refundable security deposit, transparent pricing</Feature>
              </ul>
            </div>
          </div>
        </section>

        {/* WHO IT IS FOR */}
        <Section id="who" title={who.heading} tone="muted">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-success">
                <Dot className="bg-success" /> {who.forTitle}
              </h3>
              <List items={who.forItems} marker="check" />
            </Card>
            <Card>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-danger">
                <Dot className="bg-danger" /> {who.notForTitle}
              </h3>
              <List items={who.notForItems} marker="cross" />
            </Card>
          </div>
        </Section>

        {/* WHAT THE STAY INCLUDES */}
        <Section id="help" title={includes.heading}>
          <div className="grid gap-6 md:grid-cols-2">
            <p className="text-lg leading-relaxed text-muted">{includes.body}</p>
            <Card>
              <h3 className="mb-2 text-base font-semibold text-foreground">
                {includes.supportTitle}
              </h3>
              <p className="text-muted">{includes.support}</p>
            </Card>
          </div>
        </Section>

        {/* RESPONSIBILITY MODEL */}
        <Section id="responsibility" title={responsibility.heading} tone="muted">
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted">
            {responsibility.body}
          </p>
        </Section>

        {/* HOW IT WORKS */}
        <Section id="how" title={howItWorks.heading}>
          <ol className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
            {howItWorks.steps.map((step, i) => (
              <li key={i} className="flex gap-4 rounded-xl border border-border bg-surface p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <span className="text-foreground/90">{step}</span>
              </li>
            ))}
          </ol>
        </Section>

        {/* PRICING / CALCULATOR */}
        <Section id="pricing" title="Stay & Pricing" tone="muted">
          <StayCalculator
            monthlyRatePaise={settings.monthlyRatePaise}
            depositPaise={settings.depositPaise}
          />
        </Section>

        {/* FAQ */}
        <Section id="faqs" title={faqs.heading}>
          <Faq />
        </Section>

        {/* CONTACT */}
        <Section id="contact" title="Speak to Our Kashi Team">
          <div className="mx-auto flex max-w-xl flex-wrap justify-center gap-3">
            <a
              href={tel}
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-hover"
            >
              Call Our Kashi Team
            </a>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground hover:border-accent hover:text-accent"
            >
              WhatsApp Us
            </a>
          </div>
        </Section>
      </main>

      {/* FOOTER DISCLAIMER */}
      <footer className="border-t border-border bg-surface-muted">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <p className="text-sm leading-relaxed text-muted">{footerDisclaimer}</p>
          <p className="mt-6 text-xs text-muted">
            © {site.name} · {site.legalName}
          </p>
        </div>
      </footer>

      <MobileActions />
    </>
  );
}

/* ---------- small presentational helpers ---------- */

function Section({
  id,
  title,
  tone,
  children,
}: {
  id: string;
  title: string;
  tone?: "muted";
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={tone === "muted" ? "bg-surface-muted" : "bg-background"}
    >
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <h2 className="mb-8 text-center text-2xl font-semibold text-foreground md:text-3xl">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
      {children}
    </div>
  );
}

function List({ items, marker }: { items: string[]; marker: "check" | "cross" }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-foreground/90">
          <span className={marker === "check" ? "text-success" : "text-danger"} aria-hidden>
            {marker === "check" ? "✓" : "✕"}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="text-accent" aria-hidden>✓</span>
      <span>{children}</span>
    </li>
  );
}

function Dot({ className }: { className: string }) {
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${className}`} aria-hidden />;
}
