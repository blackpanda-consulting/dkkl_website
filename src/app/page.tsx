import Link from "next/link";
import Image from "next/image";
import TopNav from "@/components/TopNav";
import MobileActions from "@/components/MobileActions";
import Faq from "@/components/Faq";
import StayEstimator from "@/components/StayEstimator";
import EnquiryForm from "@/components/EnquiryForm";
import Reveal from "@/components/Reveal";
import WordReveal from "@/components/WordReveal";
import TitleAccent from "@/components/TitleAccent";
import HeroMotion from "@/components/HeroMotion";
import ParallaxMedia from "@/components/ParallaxMedia";
import { StaggerList, StaggerItem } from "@/components/StaggerList";
import { REVEAL_STAGGER } from "@/lib/motion";
import { getPublicSettings } from "@/lib/settings";
import { formatPhone } from "@/lib/format-phone";
import {
  hero,
  who,
  booking,
  nav,
  includes,
  talkToUs,
  twinSharingNote,
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
        name: site.romanName,
        legalName: site.romanName,
        alternateName: "Kashi Laabh",
        url: siteUrl,
        description:
          "Long-term twin-sharing residential accommodation in Kashi (Varanasi) for terminally ill and elderly residents accompanied by a family member or attendant.",
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
        <HeroMotion
          media={
            <Image
              src="/images/hero.jpg"
              alt="An elderly resident and her daughter sitting together at Dinesh Kiran Kashi Laabh in Kashi"
              fill
              priority
              sizes="100vw"
              className="object-cover object-right"
            />
          }
        >
          <Reveal>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-surface/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-accent backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {hero.eyebrow}
            </p>
          </Reveal>

          {/* The gradient span can't survive a per-word split, so the headline
              reveals as two runs and the accent phrase keeps its treatment. */}
          <h1 className="text-[1.9rem] font-semibold leading-[1.15] text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            <WordReveal text="A Dignified Place for the" delay={0.1} />{" "}
            <WordReveal className="text-gradient" text="Final Years, Months or Days" delay={0.28} />{" "}
            <WordReveal text="in Kashi" delay={0.62} />
          </h1>

          <Reveal delay={0.3}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{hero.body}</p>
          </Reveal>

          <Reveal delay={0.38}>
            <div className="mt-8 flex flex-wrap gap-3">
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
          </Reveal>

          <StaggerList as="dl" className="mt-12 grid max-w-lg grid-cols-3 gap-6">
            <StaggerItem as="div">
              <Stat value="Twin-share" label="Room for resident + attendant" />
            </StaggerItem>
            <StaggerItem as="div">
              <Stat value="1-24 months" label="Flexible long-term stays" />
            </StaggerItem>
            <StaggerItem as="div">
              <Stat value="Local team" label="Food · hospital · temple help" />
            </StaggerItem>
          </StaggerList>
        </HeroMotion>

        {/* WHO IT IS FOR */}
        <Section id="who" eyebrow="Eligibility" title={who.heading} tone="muted">
          <Reveal dir="up" className="mx-auto max-w-3xl">
            <EligibilityCard
              title={who.forTitle}
              items={who.forItems}
              close={who.forClose}
              tel={tel}
            />
          </Reveal>
        </Section>

        {/* ACCOMMODATION & PRICING */}
        <Section id="help" eyebrow="Accommodation" title={includes.heading}>
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-lg leading-relaxed text-muted">{includes.intro}</p>
          </Reveal>

          {/* Room offerings */}
          <div className="grid gap-7 md:grid-cols-3 md:gap-8">
            {includes.rooms.map((room, i) => (
              <Reveal key={room.name} dir="up" delay={i * REVEAL_STAGGER} className="h-full">
                <RoomCard room={room} />
              </Reveal>
            ))}
          </div>

          {/* What's included — the photo pairs with a single roomy list, so the
              copy no longer wraps against a cramped half-column. */}
          <div className="mt-20 grid items-center gap-10 md:grid-cols-2 lg:gap-16">
            <Reveal dir="left">
              <Photo
                src="/images/room.jpg"
                alt="A calm, fully furnished room at Dinesh Kiran Kashi Laabh"
                ratio="aspect-4/3"
              />
            </Reveal>

            <Reveal dir="right" delay={REVEAL_STAGGER}>
              <h3 className="text-2xl font-semibold text-foreground">{includes.includedTitle}</h3>
              <ul className="mt-6">
                {includes.included.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-3.5 border-t border-border/60 py-3.5 text-foreground/90 first:border-0 first:pt-0"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-soft text-teal">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-xl bg-teal-soft/45 p-5 text-sm leading-relaxed text-foreground/80">
                {twinSharingNote}
              </p>
            </Reveal>
          </div>

          {/* Additional services — full width, so six tiles fall into two even
              rows of three instead of a lopsided two-column stack. */}
          <div className="mt-20">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h3 className="text-2xl font-semibold text-foreground">{includes.supportTitle}</h3>
              <p className="mt-3 leading-relaxed text-muted">{includes.supportLead}</p>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {includes.services.map((s, i) => (
                <Reveal key={s.label} dir="up" delay={(i % 3) * REVEAL_STAGGER} className="h-full">
                  <div className="service-tile flex h-full items-center gap-4 rounded-2xl border border-border bg-surface p-5">
                    <span className="tile-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <ServiceIcon name={s.icon} />
                    </span>
                    <span className="text-sm font-medium leading-snug text-foreground">{s.label}</span>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-muted">
                {includes.servicesNote}
              </p>
            </Reveal>
          </div>

          {/* Talk to us — for families who would rather speak to someone than
              pick a room on their own. */}
          <Reveal dir="up" className="mt-20">
            <TalkToUs tel={tel} wa={wa} />
          </Reveal>
        </Section>

        {/* IMMERSIVE KASHI BAND */}
        <section className="relative overflow-hidden">
          <ParallaxMedia className="h-[380px] w-full md:h-[460px]">
            <Image
              src="/images/spiritual.jpg"
              alt="The eternal city of Kashi (Varanasi) at sunrise"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </ParallaxMedia>
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-black/25" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-6xl px-4 pb-10">
              <WordReveal
                as="p"
                text="In the eternal city of Kashi, a place to spend the final phase of life with care, peace and dignity."
                className="max-w-xl font-serif text-2xl leading-snug text-white md:text-3xl"
              />
            </div>
          </div>
        </section>

        {/* HOW IT WORKS — step grid */}
        <Section id="how" eyebrow="The journey" title={howItWorks.heading}>
          <ol className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2">
            {howItWorks.steps.map((step, i) => (
              <Reveal
                as="li"
                key={i}
                dir="up"
                delay={(i % 2) * REVEAL_STAGGER}
                className="lift flex gap-4 rounded-2xl border border-border bg-surface p-6 shadow-sm"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent font-display text-sm font-semibold text-white shadow-(--shadow-glow)">
                  {i + 1}
                </span>
                <span className="pt-1 text-foreground/90">{step}</span>
              </Reveal>
            ))}
          </ol>
        </Section>

        {/* PRICING / CALCULATOR */}
        <Section id="pricing" eyebrow="Stay & pricing" title="Book a Room" tone="muted">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-lg leading-relaxed text-muted">
              Estimate what a stay would cost, then pay the {booking.fee} booking fee to
              hold a place. The balance is arranged with our Kashi team, never on this
              page.
            </p>
          </Reveal>
          <Reveal dir="zoom">
            <StayEstimator
              singleRatePaise={settings.singleRatePaise}
              doubleRatePaise={settings.doubleRatePaise}
              sharedRatePaise={settings.sharedRatePaise}
            />
          </Reveal>
        </Section>

        {/* FAQ */}
        <Section id="faqs" eyebrow="Good to know" title={faqs.heading}>
          <Faq />
        </Section>

        {/* CONTACT */}
        <Section id="contact" eyebrow="Get in touch" title="Talk to Us Now">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <Reveal dir="left">
              <EnquiryForm />
            </Reveal>
            <Reveal dir="right" delay={REVEAL_STAGGER}>
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
                    Tell us about the resident and we&apos;ll help plan the stay, with
                    care and no pressure.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border bg-surface-muted">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
            {/* Brand — anchors the left. */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Image
                src="/logos/logo-lockup.png"
                alt={`${site.romanName}, Spiritual Hospice and Care Centre, powered by Aaroha Om`}
                width={576}
                height={391}
                sizes="(max-width: 768px) 240px, 280px"
                className="h-auto w-60 md:w-64"
              />
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
                {site.tagline}
              </p>
            </div>

            {/* Page links */}
            <nav aria-label="Footer">
              <h3 className="footer-heading">Explore</h3>
              <ul className="mt-4 space-y-2.5">
                {nav.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="footer-link text-sm">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Rooms */}
            <div>
              <h3 className="footer-heading">Our rooms</h3>
              <ul className="mt-4 space-y-2.5">
                {includes.rooms.map((room) => (
                  <li key={room.name}>
                    <a href="#pricing" className="footer-link text-sm">
                      {room.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Speak with us — anchors the right. */}
            <div>
              <h3 className="footer-heading">Speak with us</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {site.phone && (
                  <li>
                    <a href={tel} className="footer-link inline-flex items-center gap-2.5">
                      <span className="footer-ico"><PhoneIcon /></span>
                      {formatPhone(site.phone)}
                    </a>
                  </li>
                )}
                {site.whatsapp && (
                  <li>
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-link inline-flex items-center gap-2.5"
                    >
                      <span className="footer-ico"><ChatIcon /></span>
                      WhatsApp
                    </a>
                  </li>
                )}
                {site.email && (
                  <li>
                    <a
                      href={`mailto:${site.email}`}
                      className="footer-link inline-flex items-center gap-2.5"
                    >
                      <span className="footer-ico"><MailIcon /></span>
                      {site.email}
                    </a>
                  </li>
                )}
                <li>
                  <a href="#contact" className="footer-link inline-flex items-center gap-2.5">
                    <span className="footer-ico">→</span>
                    Send an enquiry
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Legal disclaimer + copyright */}
          <div className="mt-14 border-t border-border pt-8">
            <p className="max-w-4xl text-xs leading-relaxed text-muted">{footerDisclaimer}</p>
            <p className="mt-6 text-xs text-muted">
              © {new Date().getFullYear()} {site.romanName}
            </p>
          </div>
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
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
        {/* Eyebrow, then title — a short beat between them reads as an intro
            rather than the whole header popping in at once. */}
        <div className="mb-12 flex flex-col items-center text-center md:mb-14">
          {eyebrow && (
            <Reveal className="flex flex-col items-center">
              <span className="eyebrow mb-4">{eyebrow}</span>
            </Reveal>
          )}
          <WordReveal
            as="h2"
            text={title}
            delay={0.16}
            className="text-3xl font-semibold text-foreground md:text-4xl"
          />
          <TitleAccent />
        </div>
        {children}
      </div>
    </section>
  );
}

// Affirmative only. There is no counterpart "not for" card by design: families
// who are unsure are asked to call rather than rule themselves out.
function EligibilityCard({
  title,
  items,
  close,
  tel,
}: {
  title: string;
  items: string[];
  close?: string;
  tel: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <span className="absolute inset-x-0 top-0 h-1 bg-success" aria-hidden />
      <div className="p-8 md:p-10">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        </div>

        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item}
              className="flex gap-3 border-t border-border/60 pt-3 text-foreground/90 first:border-0 first:pt-0"
            >
              <span className="mt-0.5 shrink-0 text-success" aria-hidden>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {close && (
          <p className="mt-7 rounded-xl bg-teal-soft/45 p-5 text-sm leading-relaxed text-foreground/85">
            {close}{" "}
            <a
              href={tel}
              className="font-semibold text-teal underline underline-offset-2 hover:text-teal-hover"
            >
              Talk to us now
            </a>
            .
          </p>
        )}
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

// A quiet pause at the end of the section. It sits on white so it lifts off the
// cream background, and stays centred and narrow so it reads as an aside rather
// than another card competing with the rooms.
function TalkToUs({ tel, wa }: { tel: string; wa: string }) {
  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-border-strong bg-surface px-8 py-14 text-center shadow-(--shadow-md) md:px-14">
      <div className="ornament mb-7" aria-hidden>
        <ServiceIcon name="lotus" />
      </div>

      <h3 className="text-2xl font-semibold text-foreground md:text-3xl">{talkToUs.heading}</h3>
      <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">{talkToUs.body}</p>

      <div className="mt-9 flex flex-col items-center justify-center gap-x-7 gap-y-5 sm:flex-row">
        <a
          href={tel}
          className="lift inline-flex items-center gap-2.5 rounded-full bg-teal px-7 py-4 text-sm font-semibold text-white shadow-(--shadow-sm) hover:bg-teal-hover"
        >
          <PhoneIcon />
          {site.phone ? formatPhone(site.phone) : talkToUs.callLabel}
        </a>

        <p className="text-sm text-muted">
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-teal underline underline-offset-4 transition-colors hover:text-teal-hover"
          >
            {talkToUs.waLabel}
          </a>
          <span className="px-2.5 text-border-strong" aria-hidden>·</span>
          <a
            href="#contact"
            className="font-medium text-teal underline underline-offset-4 transition-colors hover:text-teal-hover"
          >
            {talkToUs.enquiryLabel}
          </a>
        </p>
      </div>

      <p className="mt-7 text-[11px] uppercase tracking-[0.14em] text-muted/70">
        {talkToUs.eyebrow}
      </p>
    </div>
  );
}

function RoomCard({ room }: { room: (typeof includes.rooms)[number] }) {
  return (
    <div
      className={`lift relative flex h-full flex-col overflow-hidden rounded-2xl bg-surface p-8 shadow-sm ${
        room.featured ? "border-2 border-accent/40" : "border border-border"
      }`}
    >
      {room.featured && (
        <span className="absolute right-5 top-5 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
          Most spacious
        </span>
      )}
      <h3 className="pr-24 text-xl font-semibold text-foreground">{room.name}</h3>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display text-3xl font-semibold text-accent md:text-4xl">{room.price}</span>
        <span className="text-sm font-medium text-muted">{room.gst}</span>
      </div>
      <p className="text-xs uppercase tracking-wide text-muted">{room.per}</p>
      <p className="mt-4 flex-1 leading-relaxed text-muted">{room.desc}</p>
      {/* Only the featured room carries the filled button — three glowing
          terracotta pills side by side read as a wall of red. */}
      <a
        href="#pricing"
        className={`mt-6 inline-block self-start rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
          room.featured
            ? "btn-primary"
            : "border border-border-strong text-accent hover:-translate-y-0.5 hover:border-accent hover:bg-accent-soft"
        }`}
      >
        Book this room →
      </a>
    </div>
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
    case "nursing":
      return (
        <svg {...common}>
          <path d="M20.8 5.6a5 5 0 0 0-7-.4l-1.8 1.6-1.8-1.6a5 5 0 0 0-7 7l8.8 8.4 8.8-8.4a5 5 0 0 0 0-6.6z" />
          <path d="M12 8v4M10 10h4" />
        </svg>
      );
    case "medical":
      return (
        <svg {...common}>
          <path d="M6 3v6a4 4 0 0 0 8 0V3" />
          <path d="M6 3H4M14 3h2M10 13v3a4 4 0 0 0 8 0v-1" />
          <circle cx="18" cy="12" r="2" />
        </svg>
      );
    case "other":
      return (
        <svg {...common}>
          <path d="M12 3l1.8 4.6L18 9l-4.2 1.4L12 15l-1.8-4.6L6 9l4.2-1.4L12 3zM18 15l.9 2.3L21 18l-2.1.7L18 21l-.9-2.3L15 18l2.1-.7L18 15z" />
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
function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5l8.5 6 8.5-6" />
    </svg>
  );
}
