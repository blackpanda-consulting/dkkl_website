import type { Metadata, Viewport } from "next";
import { EB_Garamond, Inter, Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#296569",
};

// Brand fonts: Inter (body) + EB Garamond (headings/display).
const sans = Inter({
  variable: "--font-sans-custom",
  subsets: ["latin"],
  display: "swap",
});

const serif = EB_Garamond({
  variable: "--font-serif-custom",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

// Devanagari glyphs for the "काशी लाभ" part of the brand name.
const devanagari = Noto_Serif_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const description =
  "Long-term twin-sharing accommodation in Kashi (Varanasi) for terminally ill, elderly and frail residents, with a responsible family member or attendant. Book a room securely, or talk to our Kashi team.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dinesh Kiran Kashi Laabh — Dignified Long-Term Stay in Kashi",
    template: "%s · Dinesh Kiran Kashi Laabh",
  },
  description,
  applicationName: "Dinesh Kiran Kashi Laabh",
  keywords: [
    "Kashi Laabh",
    "long-term stay Kashi",
    "Varanasi elderly care",
    "end-of-life stay Kashi",
    "twin-sharing accommodation Varanasi",
    "terminally ill residential stay",
    "Kashi Vishwanath elderly stay",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Dinesh Kiran Kashi Laabh",
    title: "Dinesh Kiran Kashi Laabh — Dignified Long-Term Stay in Kashi",
    description,
    url: siteUrl,
    locale: "en_IN",
    images: [
      {
        url: "/images/hero.jpg",
        width: 2400,
        height: 1340,
        alt: "An elderly resident and her daughter sitting together at Dinesh Kiran Kashi Laabh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dinesh Kiran Kashi Laabh — Dignified Long-Term Stay in Kashi",
    description,
    images: ["/images/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${devanagari.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
