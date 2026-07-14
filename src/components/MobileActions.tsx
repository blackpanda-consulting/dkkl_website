import Link from "next/link";
import { site } from "@/lib/content";

// Persistent mobile actions (spec §3): Call · WhatsApp · Calculate Stay Cost.
export default function MobileActions() {
  const tel = site.phone ? `tel:${site.phone}` : "#contact";
  const wa = site.whatsapp
    ? `https://wa.me/${site.whatsapp}`
    : "#contact";

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-border bg-surface/95 backdrop-blur md:hidden">
      <a
        href={tel}
        className="flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium text-foreground/80"
      >
        <PhoneIcon />
        Call
      </a>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-0.5 border-x border-border py-2.5 text-xs font-medium text-foreground/80"
      >
        <ChatIcon />
        WhatsApp
      </a>
      <Link
        href="#pricing"
        className="flex flex-col items-center gap-0.5 bg-accent py-2.5 text-xs font-semibold text-white"
      >
        <CalcIcon />
        Calculate
      </Link>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.5-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9 9 0 0 1-4-1L3 20l1-4a8.5 8.5 0 1 1 16-4.5z" />
    </svg>
  );
}
function CalcIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M8 6h8M8 10h2M12 10h4M8 14h2M12 14h4M8 18h2M12 18h4" />
    </svg>
  );
}
