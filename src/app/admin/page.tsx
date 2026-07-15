import { isAdmin } from "@/lib/admin-auth";
import { getSettings } from "@/lib/settings";
import { prisma } from "@/lib/db";
import { formatInr } from "@/lib/pricing";
import AdminLogin from "@/components/AdminLogin";
import AdminRateForm from "@/components/AdminRateForm";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

const STATUS_STYLES: Record<string, string> = {
  PAID_PENDING_ADMISSION: "bg-success/15 text-success",
  PROVISIONAL: "bg-surface-muted text-muted",
  PENDING: "bg-accent/15 text-accent",
  FAILED: "bg-danger/15 text-danger",
  REFUND_INITIATED: "bg-accent/15 text-accent",
  REFUND_COMPLETED: "bg-accent/15 text-accent",
};

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return <AdminLogin />;
  }

  const [settings, bookings] = await Promise.all([
    getSettings(),
    prisma.booking.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
  ]);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">DKKL Admin</h1>
        <LogoutButton />
      </div>

      <div className="mt-6">
        <AdminRateForm
          monthlyRateRupees={settings.monthlyRatePaise / 100}
          depositRupees={settings.depositPaise / 100}
        />
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">
          Bookings <span className="text-muted">({bookings.length})</span>
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted">
              <tr className="border-b border-border">
                <th className="py-2 pr-4">Reference</th>
                <th className="py-2 pr-4">Resident</th>
                <th className="py-2 pr-4">Family</th>
                <th className="py-2 pr-4">Months</th>
                <th className="py-2 pr-4">Amount</th>
                <th className="py-2 pr-4">Arrival</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-muted">
                    No bookings yet.
                  </td>
                </tr>
              )}
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-border/60">
                  <td className="py-2.5 pr-4 font-medium text-foreground">{b.bookingRef}</td>
                  <td className="py-2.5 pr-4">
                    {b.residentName} <span className="text-muted">({b.residentAge})</span>
                  </td>
                  <td className="py-2.5 pr-4">
                    {b.familyName}
                    <br />
                    <span className="text-muted">{b.familyMobile}</span>
                  </td>
                  <td className="py-2.5 pr-4">{b.months}</td>
                  <td className="py-2.5 pr-4">{formatInr(b.amountPaise)}</td>
                  <td className="py-2.5 pr-4">{b.arrivalDate.toISOString().slice(0, 10)}</td>
                  <td className="py-2.5 pr-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                        STATUS_STYLES[b.status] ?? "bg-surface-muted text-muted"
                      }`}
                    >
                      {b.status.replaceAll("_", " ")}
                    </span>
                  </td>
                  <td className="py-2.5 text-muted">
                    {b.createdAt.toISOString().slice(0, 10)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function LogoutButton() {
  async function logout() {
    "use server";
    const { cookies } = await import("next/headers");
    const { ADMIN_COOKIE } = await import("@/lib/admin-auth");
    const jar = await cookies();
    jar.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  }
  return (
    <form action={logout}>
      <button
        type="submit"
        className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:border-accent hover:text-accent"
      >
        Sign out
      </button>
    </form>
  );
}
