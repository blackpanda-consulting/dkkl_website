import type { Metadata } from "next";
import { Lora, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const sans = Source_Sans_3({
  variable: "--font-sans-custom",
  subsets: ["latin"],
  display: "swap",
});

const serif = Lora({
  variable: "--font-serif-custom",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const description =
  "Long-term twin-sharing accommodation in Kashi (Varanasi) for terminally ill, elderly and frail residents, with a responsible family member or attendant. Calculate the stay cost and book securely.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kashi Laabh — Dignified Long-Term Stay in Kashi",
    template: "%s · Kashi Laabh",
  },
  description,
  applicationName: "Kashi Laabh",
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
    siteName: "Kashi Laabh",
    title: "Kashi Laabh — Dignified Long-Term Stay in Kashi",
    description,
    url: siteUrl,
    locale: "en_IN",
    images: [
      {
        url: "/images/hero.jpg",
        width: 2400,
        height: 1340,
        alt: "An elderly resident and her daughter looking out over the ghats of Kashi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kashi Laabh — Dignified Long-Term Stay in Kashi",
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
      className={`${sans.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
