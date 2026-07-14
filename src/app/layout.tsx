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

export const metadata: Metadata = {
  title: "Kashi Laabh — Dignified Long-Term Stay in Kashi",
  description:
    "Long-term twin-sharing accommodation in Kashi for terminally ill, elderly and frail residents, with a responsible family member or attendant.",
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
