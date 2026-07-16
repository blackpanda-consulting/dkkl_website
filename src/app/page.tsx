import Link from "next/link";
import Image from "next/image";
import TopNav from "@/components/TopNav";
import MobileActions from "@/components/MobileActions";
import Faq from "@/components/Faq";
import StayCalculator from "@/components/StayCalculator";
import EnquiryForm from "@/components/EnquiryForm";
import Reveal from "@/components/Reveal";
import { getPublicSettings } from "@/lib/settings";
import { formatPhone } from "@/lib/format-phone";
import {
  hero,
  who,
  includes,
  howItWorks,
  faqs,
  footerDisclaimer,
  site,
} from "@/lib/content";

// Statically cached (fast, CDN-served) and revalidated hourly. The admin rate
// change also triggers on-demand revalidation, so pricing stays accurate (spec §7).
export const revalidate = 3600;

export default async function Home() {
  const settings = await getPublicSettings();
  const tel = site.phone ? `tel:${site.phone}` : "#contact";
  const wa = site.whatsapp ? `https://wa.me/${site.whatsapp}` : "#contact";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Structured data: Organization + FAQ (eligible for rich results).
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: site.fullName,
        legalName: site.fullName,
        alternateName: "Kashi Laabh",
        url: siteUrl,
        description:
          "Long-term twin-sharing residential accommodation in Kashi (Varanasi) for terminally ill, elderly and frail residents accompanied by a family member or attendant.",
        areaServed: { "@type": "City", name: "Varanasi" },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.items.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TopNav />

      <main className="flex-1 pb-20 md:pb-0">
        {/* HERO */}
        <section id="home" className="hero-sky relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/hero.jpg"
              alt="An elderly resident and her daughter sitting together at Dinesh Kiran Kashi Laabh in Kashi"
              fill
              priority
              sizes="100vw"
              className="object-cover object-right"
            />
            {/* Keep the left-side copy readable over the photo. */}
            <div className="absolute inset-0 bg-linear-to-r from-background via-background/88 to-background/25 md:via-background/70 md:to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-background/85 via-transparent to-transparent md:from-background/45" />
          </div>
          <div className="relative mx-auto flex min-h-130 max-w-6xl items-center px-4 pt-16 pb-16 md:min-h-150 md:pt-24 md:pb-24">
            <div className="max-w-2xl">
              <p className="enter mb-5 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-surface/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-accent backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {hero.eyebrow}
              </p>
              <h1 className="enter enter-1 text-4xl font-semibold leading-[1.1] text-foreground md:text-6xl">
                A Dignified Place for the{" "}
                <span className="text-gradient">Final Years, Months or Days</span> in
                Kashi
              </h1>
              <p className="enter enter-2 mt-6 max-w-xl text-lg leading-relaxed text-muted">
                {hero.body}
              </p>
              <div className="enter enter-3 mt-8 flex flex-wrap gap-3">
                <Link
                  href="#pricing"
                  className="btn-primary rounded-full px-7 py-3.5 text-sm font-semibold"
                >
                  {hero.primaryCta} →
                </Link>
                <a
                  href={tel}
                  className="rounded-full border border-border bg-surface px-7 py-3.5 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                >
                  {hero.secondaryCta}
                </a>
              </div>

              <dl className="enter enter-3 mt-12 grid max-w-lg grid-cols-3 gap-6">
                <Stat value="Twin-share" label="Room for resident + attendant" />
                <Stat value="1–24 mo" label="Flexible long-term stays" />
                <Stat value="Local team" label="Food · hospital · temple help" />
              </dl>
            </div>
          </div>
        </section>

        {/* WHO IT IS FOR */}
        <Section id="who" eyebrow="Eligibility" title={who.heading} tone="muted">
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal dir="left" className="h-full">
              <EligibilityCard tone="success" title={who.forTitle} items={who.forItems} />
            </Reveal>
            <Reveal dir="right" delayMs={80} className="h-full">
              <EligibilityCard tone="danger" title={who.notForTitle} items={who.notForItems} />
            </Reveal>
          </div>
        </Section>

        {/* WHAT THE STAY INCLUDES */}
        <Section id="help" eyebrow="How we help" title={includes.heading}>
          {/* Row 1 — the room */}
          <div className="grid items-center gap-8 lg:gap-14 md:grid-cols-2">
            <Reveal dir="left">
              <Photo
                src="/images/room.jpg"
                alt="A calm twin-sharing room at Dinesh Kiran Kashi Laabh"
                caption="Twin-sharing room"
                ratio="aspect-4/3"
              />
            </Reveal>
            <Reveal dir="right" delayMs={100}>
              <p className="text-xl leading-relaxed text-foreground/90">{includes.body}</p>
              <ul className="mt-7 space-y-3.5">
                {includes.roomFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-foreground/90">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Row 2 — support we coordinate (services grid + photo) */}
          <div className="mt-14 grid items-center gap-8 lg:mt-20 lg:gap-14 md:grid-cols-[1.15fr_0.85fr]">
            <div className="order-2 md:order-1">
              <Reveal dir="left">
                <h3 className="text-2xl font-semibold text-foreground">{includes.supportTitle}</h3>
                <p className="mt-2 text-muted">{includes.supportLead}</p>
              </Reveal>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {includes.services.map((s, i) => (
                  <Reveal key={s.label} dir="zoom" delayMs={i * 70} className="h-full">
                    <div className="service-tile flex h-full flex-col items-start gap-3 rounded-2xl border border-border bg-surface p-4">
                      <span className="tile-icon flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                        <ServiceIcon name={s.icon} />
                      </span>
                      <span className="text-sm font-medium leading-snug text-foreground">{s.label}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
              <p className="mt-5 rounded-xl border border-border bg-surface-muted/60 p-4 text-sm leading-relaxed text-muted">
                {includes.servicesNote}
              </p>
            </div>
            <div className="order-1 md:order-2">
              <Reveal dir="right" delayMs={100}>
                <Photo
                  src="/images/food.jpg"
                  alt="A caregiver helping an elderly resident with a warm vegetarian meal"
                  caption="Everyday care, coordinated locally"
                  ratio="aspect-4/3"
                />
              </Reveal>
            </div>
          </div>
        </Section>

        {/* IMMERSIVE KASHI BAND */}
        <section className="relative overflow-hidden">
          <div className="relative h-[380px] w-full md:h-[460px]">
            <Image
              src="/images/spiritual.jpg"
              alt="The eternal city of Kashi (Varanasi) at sunrise"
              fill
              sizes="100vw"
              className="kenburns object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-black/25" />
            <div className="absolute inset-0 flex items-end">
              <div className="mx-auto w-full max-w-6xl px-4 pb-10">
                <Reveal>
                  <p className="max-w-xl font-serif text-2xl leading-snug text-white md:text-3xl">
                    In the eternal city of Kashi — a place to spend the final phase of
                    life with care, peace and dignity.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <Section id="how" eyebrow="The journey" title={howItWorks.heading}>
          <ol className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
            {howItWorks.steps.map((step, i) => (
              <Reveal as="li" key={i} dir="up" delayMs={(i % 2) * 90} className="lift flex gap-4 rounded-xl border border-border bg-surface p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent font-display text-sm font-semibold text-white shadow-(--shadow-glow)">
                  {i + 1}
                </span>
                <span className="pt-1 text-foreground/90">{step}</span>
              </Reveal>
            ))}
          </ol>
        </Section>

        {/* PRICING / CALCULATOR */}
        <Section id="pricing" eyebrow="Stay & pricing" title="Calculate Your Stay Cost" tone="muted">
          <Reveal dir="zoom">
            <StayCalculator
              monthlyRatePaise={settings.monthlyRatePaise}
              depositPaise={settings.depositPaise}
            />
          </Reveal>
        </Section>

        {/* FAQ */}
        <Section id="faqs" eyebrow="Good to know" title={faqs.heading}>
          <Faq />
        </Section>

        {/* CONTACT */}
        <Section id="contact" eyebrow="Get in touch" title="Speak to Our Kashi Team">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <Reveal dir="left">
              <EnquiryForm />
            </Reveal>
            <Reveal dir="right" delayMs={100}>
              <div className="space-y-4">
                <ContactCard
                  href={tel}
                  title="Call us"
                  value={site.phone ? formatPhone(site.phone) : "Add a number"}
                  icon={<PhoneIcon />}
                />
                <ContactCard
                  href={wa}
                  external
                  title="WhatsApp"
                  value="Chat with our Kashi team"
                  icon={<ChatIcon />}
                />
                <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-teal to-teal-hover p-6 text-white shadow-(--shadow-md)">
                  <span className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" aria-hidden />
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
                    We&apos;re here for your family
                  </p>
                  <p className="mt-2 font-display text-xl font-semibold leading-snug">
                    Tell us about the resident and we&apos;ll help plan the stay — with
                    care and no pressure.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Section>
      </main>

      {/* FOOTER DISCLAIMER */}
      <footer className="border-t border-border bg-surface-muted">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="mb-6 flex items-center gap-3">
            <Image
              src="/logos/web-app-manifest-192x192.png"
              alt="Dinesh Kiran Kashi Laabh logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            <span className="font-serif text-lg font-semibold text-teal">{site.fullName}</span>
          </div>
          <p className="text-sm leading-relaxed text-muted">{footerDisclaimer}</p>
          <p className="mt-6 text-xs text-muted">© {site.fullName}</p>
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
  eyebrow,
  tone,
  children,
}: {
  id: string;
  title: string;
  eyebrow?: string;
  tone?: "muted";
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`border-t border-border ${
        tone === "muted" ? "bg-surface-muted pattern-dots" : "bg-background"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <Reveal className="mb-12 flex flex-col items-center text-center">
          {eyebrow && <span className="eyebrow mb-4">{eyebrow}</span>}
          <h2 className="text-2xl font-semibold text-foreground md:text-3xl">{title}</h2>
          <span className="title-accent" aria-hidden />
        </Reveal>
        {children}
      </div>
    </section>
  );
}

function EligibilityCard({
  tone,
  title,
  items,
}: {
  tone: "success" | "danger";
  title: string;
  items: string[];
}) {
  const isFor = tone === "success";
  const accentText = isFor ? "text-success" : "text-danger";
  const accentBg = isFor ? "bg-success/10" : "bg-danger/10";
  const topBar = isFor ? "bg-success" : "bg-danger";
  return (
    <div className="lift relative overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <span className={`absolute inset-x-0 top-0 h-1 ${topBar}`} aria-hidden />
      <div className="p-7">
        <div className="mb-5 flex items-center gap-3">
          <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${accentBg} ${accentText}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {isFor ? <path d="M20 6L9 17l-5-5" /> : <path d="M18 6L6 18M6 6l12 12" />}
            </svg>
          </span>
          <h3 className={`text-lg font-semibold ${accentText}`}>{title}</h3>
        </div>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item} className="flex gap-3 border-t border-border/60 pt-3 text-foreground/90 first:border-0 first:pt-0">
              <span className={`mt-0.5 shrink-0 ${accentText}`} aria-hidden>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  {isFor ? <path d="M20 6L9 17l-5-5" /> : <path d="M18 6L6 18M6 6l12 12" />}
                </svg>
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Photo({
  src,
  alt,
  caption,
  ratio = "aspect-4/3",
}: {
  src: string;
  alt: string;
  caption?: string;
  ratio?: string;
}) {
  return (
    <figure className={`group lift relative ${ratio} overflow-hidden rounded-2xl border border-border shadow-sm`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="zoom-img object-cover"
      />
      {caption && (
        <>
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
          <figcaption className="absolute bottom-3 left-4 right-4 flex items-center gap-2 text-sm font-medium text-white drop-shadow">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            {caption}
          </figcaption>
        </>
      )}
    </figure>
  );
}

function ServiceIcon({ name }: { name: string }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "food":
      return (
        <svg {...common}>
          <path d="M4 3v7a3 3 0 0 0 3 3v8M7 3v6M10 3v6M18 3c-1.5 0-2.5 2-2.5 5s1 4 2.5 4v9" />
        </svg>
      );
    case "hospital":
      return (
        <svg {...common}>
          <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" />
          <path d="M12 8v5M9.5 10.5h5" />
        </svg>
      );
    case "temple":
      return (
        <svg {...common}>
          <path d="M12 2l3 3H9l3-3zM7 9h10M6 9v12M18 9v12M10 21v-5h4v5M4 21h16" />
        </svg>
      );
    case "transport":
      return (
        <svg {...common}>
          <path d="M5 16V9l2-4h10l2 4v7M5 16h14M5 16v2M19 16v2" />
          <circle cx="8" cy="16" r="1.4" />
          <circle cx="16" cy="16" r="1.4" />
        </svg>
      );
    case "lotus":
      return (
        <svg {...common}>
          <path d="M12 4c1.6 1.7 2.4 3.6 2.4 5.6M12 4c-1.6 1.7-2.4 3.6-2.4 5.6M4 11c2 0 3.7.8 5 2.2M20 11c-2 0-3.7.8-5 2.2M12 20c-3.5 0-7-2.4-8-6 2.4-.4 4.2.2 5.6 1.4M12 20c3.5 0 7-2.4 8-6-2.4-.4-4.2.2-5.6 1.4" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="font-display text-lg font-semibold text-accent md:text-xl">{value}</dt>
      <dd className="mt-1 text-xs leading-snug text-muted">{label}</dd>
    </div>
  );
}

function ContactCard({
  href,
  title,
  value,
  icon,
  external,
}: {
  href: string;
  title: string;
  value: string;
  icon: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="lift group flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 hover:border-accent"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent transition-colors group-hover:bg-accent group-hover:text-white">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold uppercase tracking-wide text-muted">{title}</span>
        <span className="block truncate font-medium text-foreground">{value}</span>
      </span>
      <span className="ml-auto text-accent transition-transform group-hover:translate-x-1" aria-hidden>→</span>
    </a>
  );
}

function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.5-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9 9 0 0 1-4-1L3 20l1-4a8.5 8.5 0 1 1 16-4.5z" />
    </svg>
  );
}
