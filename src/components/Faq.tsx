"use client";

import { useState } from "react";
import { faqs } from "@/lib/content";
import Reveal from "@/components/Reveal";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {faqs.items.map((item, i) => {
        const isOpen = open === i;
        return (
          <Reveal key={item.q} dir="up" delayMs={i * 60}>
            <div
              className={`lift overflow-hidden rounded-2xl border bg-surface shadow-sm transition-colors ${
                isOpen ? "border-accent/40" : "border-border"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-medium text-foreground">{item.q}</span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                    isOpen ? "rotate-45 bg-accent text-white" : "bg-accent-soft text-accent"
                  }`}
                  aria-hidden
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
              <div className={`acc-body ${isOpen ? "open" : ""}`}>
                <div>
                  <p className="px-5 pb-5 text-muted">{item.a}</p>
                </div>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
