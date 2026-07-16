"use client";

import { useState } from "react";

export default function AdminRateForm({
  singleRateRupees,
  doubleRateRupees,
  sharedRateRupees,
}: {
  singleRateRupees: number;
  doubleRateRupees: number;
  sharedRateRupees: number;
}) {
  const [single, setSingle] = useState(String(singleRateRupees));
  const [double, setDouble] = useState(String(doubleRateRupees));
  const [shared, setShared] = useState(String(sharedRateRupees));
  const [status, setStatus] = useState<null | "saving" | "saved" | "error">(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    const res = await fetch("/api/admin/rate", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        singleRateRupees: Number(single),
        doubleRateRupees: Number(double),
        sharedRateRupees: Number(shared),
      }),
    });
    setStatus(res.ok ? "saved" : "error");
  }

  const field = (label: string, value: string, set: (v: string) => void) => (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-foreground">{label}</span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => set(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
    </label>
  );

  return (
    <form onSubmit={save} className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground">Monthly rates (₹, excl. GST)</h2>
      <p className="mt-1 text-sm text-muted">
        Changes take effect immediately on the public calculator — no deploy needed.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {field("Single occupancy (₹ / month)", single, setSingle)}
        {field("Double occupancy (₹ / month)", double, setDouble)}
        {field("Shared occupancy (₹ / month)", shared, setShared)}
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
