import Link from "next/link";
import Image from "next/image";
import TopNav from "@/components/TopNav";
import MobileActions from "@/components/MobileActions";
import Faq from "@/components/Faq";
import StayCalculator from "@/components/StayCalculator";
import Reveal from "@/components/Reveal";
import { getPublicSettings } from "@/lib/settings";
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
        name: site.name,
        alternateName: site.legalName,
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
              alt="An elderly resident and her daughter looking out over the ghats of Kashi and the river Ganga"
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
        <Section id="who" title={who.heading} tone="muted">
          <div className="grid gap-6 md:grid-cols-2">
            <EligibilityCard tone="success" title={who.forTitle} items={who.forItems} />
            <EligibilityCard tone="danger" title={who.notForTitle} items={who.notForItems} />
          </div>
        </Section>

        {/* WHAT THE STAY INCLUDES */}
        <Section id="help" title={includes.heading}>
          {/* Row 1 — the room */}
          <div className="grid items-center gap-8 lg:gap-14 md:grid-cols-2">
            <Photo
              src="/images/room.jpg"
              alt="A calm twin-sharing room at Kashi Laabh overlooking the ghats"
              caption="Twin-sharing room · view of the ghats"
              ratio="aspect-4/3"
            />
            <div>
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
            </div>
          </div>

          {/* Row 2 — support we coordinate (services grid + photo) */}
          <div className="mt-14 grid items-center gap-8 lg:mt-20 lg:gap-14 md:grid-cols-[1.15fr_0.85fr]">
            <div className="order-2 md:order-1">
              <h3 className="text-2xl font-semibold text-foreground">{includes.supportTitle}</h3>
              <p className="mt-2 text-muted">{includes.supportLead}</p>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {includes.services.map((s) => (
                  <div
                    key={s.label}
                    className="lift flex flex-col items-start gap-3 rounded-2xl border border-border bg-surface p-4"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <ServiceIcon name={s.icon} />
                    </span>
                    <span className="text-sm font-medium leading-snug text-foreground">{s.label}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 rounded-xl border border-border bg-surface-muted/60 p-4 text-sm leading-relaxed text-muted">
                {includes.servicesNote}
              </p>
            </div>
            <div className="order-1 md:order-2">
              <Photo
                src="/images/food.jpg"
                alt="A caregiver helping an elderly resident with a warm vegetarian meal"
                caption="Everyday care, coordinated locally"
                ratio="aspect-4/3"
              />
            </div>
          </div>
        </Section>

        {/* IMMERSIVE KASHI BAND */}
        <section className="relative overflow-hidden">
          <div className="relative h-[380px] w-full md:h-[460px]">
            <Image
              src="/images/spiritual.jpg"
              alt="Sunrise over the ghats of Kashi with floating diyas on the river Ganga"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-black/25" />
            <div className="absolute inset-0 flex items-end">
              <div className="mx-auto w-full max-w-6xl px-4 pb-10">
                <Reveal>
                  <p className="max-w-xl font-serif text-2xl leading-snug text-white md:text-3xl">
                    Near the ghats, the temples and the Ganga — a place to live the
                    final phase of life with peace and dignity.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* RESPONSIBILITY MODEL */}
        <Section id="responsibility" title={responsibility.heading} tone="muted">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <Photo
              src="/images/support.jpg"
              alt="A family member holding an elderly resident's hand by a window overlooking the ghats"
              caption="The family or attendant stays and remains responsible"
              ratio="aspect-4/3"
            />
            <p className="text-lg leading-relaxed text-muted">{responsibility.body}</p>
          </div>
        </Section>

        {/* HOW IT WORKS */}
        <Section id="how" title={howItWorks.heading}>
          <ol className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
            {howItWorks.steps.map((step, i) => (
              <li key={i} className="lift flex gap-4 rounded-xl border border-border bg-surface p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <span className="text-foreground/90">{step}</span>
              </li>
            ))}
          </ol>
        </Section>

        {/* PRICING / CALCULATOR */}
        <Section id="pricing" title="Calculate Your Stay Cost" tone="muted">
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
        <Reveal as="h2" className="mb-8 text-center text-2xl font-semibold text-foreground md:text-3xl">
          {title}
        </Reveal>
        <Reveal delay={1}>{children}</Reveal>
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
    <figure className={`lift relative ${ratio} overflow-hidden rounded-2xl border border-border shadow-sm`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
      />
      {caption && (
        <>
          <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent" />
          <figcaption className="absolute bottom-3 left-4 right-4 text-sm font-medium text-white drop-shadow">
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
