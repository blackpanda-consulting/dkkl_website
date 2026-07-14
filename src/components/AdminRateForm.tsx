"use client";

import { useState } from "react";

export default function AdminRateForm({
  monthlyRateRupees,
  depositRupees,
}: {
  monthlyRateRupees: number;
  depositRupees: number;
}) {
  const [rate, setRate] = useState(String(monthlyRateRupees));
  const [deposit, setDeposit] = useState(String(depositRupees));
  const [status, setStatus] = useState<null | "saving" | "saved" | "error">(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    const res = await fetch("/api/admin/rate", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        monthlyRateRupees: Number(rate),
        depositRupees: Number(deposit),
      }),
    });
    setStatus(res.ok ? "saved" : "error");
  }

  return (
    <form onSubmit={save} className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground">Pricing</h2>
      <p className="mt-1 text-sm text-muted">
        Changes take effect immediately on the public calculator — no deploy needed.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-foreground">
            Monthly accommodation rate (₹)
          </span>
          <input
            type="number"
            min={0}
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-foreground">
            Refundable deposit (₹)
          </span>
          <input
            type="number"
            min={0}
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </label>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50"
        >
          {status === "saving" ? "Saving…" : "Save pricing"}
        </button>
        {status === "saved" && <span className="text-sm text-success">Saved ✓</span>}
        {status === "error" && <span className="text-sm text-danger">Could not save</span>}
      </div>
    </form>
  );
}
