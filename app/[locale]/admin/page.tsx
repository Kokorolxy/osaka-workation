import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { L } from "@/components/locale-link";
import { ArrowRight, ClipboardList, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const supabase = createClient();
  const [{ data: profiles }, { data: registrations }] = await Promise.all([
    supabase.from("profiles").select("id, role, created_at"),
    supabase.from("event_registrations").select("id, status"),
  ]);

  const all = profiles ?? [];
  const total = all.length;
  const admins = all.filter((p) => p.role === "admin").length;
  const users = total - admins;
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recent = all.filter(
    (p) => new Date(p.created_at).getTime() >= weekAgo,
  ).length;

  const regs = registrations ?? [];
  const pending = regs.filter((r) => r.status === "pending_approval").length;

  const stats = [
    { label: "Total users", value: total },
    { label: "Members", value: users },
    { label: "Joined last 7 days", value: recent },
    { label: "Pending approvals", value: pending, accent: pending > 0 },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight text-brand-ink">
        Overview
      </h2>
      <p className="mt-1 text-sm text-muted">
        Snapshot of accounts and Join registrations.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl border px-5 py-4 ${
              stat.accent
                ? "border-brand-orange/35 bg-brand-orange/[0.06]"
                : "border-paper-line bg-white"
            }`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              {stat.label}
            </p>
            <p
              className={`mt-2 text-3xl font-bold tabular-nums ${
                stat.accent ? "text-brand-orange" : "text-brand-ink"
              }`}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <L
          href="/admin/registrations"
          className="group rounded-3xl border border-paper-line bg-white p-6 transition-all hover:border-brand-orange/40 hover:shadow-[0_18px_40px_-28px_rgba(234,85,4,0.4)]"
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange">
            <ClipboardList className="h-5 w-5" />
          </span>
          <h3 className="mt-4 text-base font-semibold text-brand-ink">
            Registrations
          </h3>
          <p className="mt-1 text-sm text-muted">
            {pending > 0
              ? `${pending} waiting for your approval.`
              : "Review package, housing, and contact choices."}
          </p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange">
            Open queue
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </L>

        <L
          href="/admin/users"
          className="group rounded-3xl border border-paper-line bg-white p-6 transition-all hover:border-brand-orange/40 hover:shadow-[0_18px_40px_-28px_rgba(15,15,15,0.25)]"
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-paper-sand text-brand-ink">
            <Users className="h-5 w-5" />
          </span>
          <h3 className="mt-4 text-base font-semibold text-brand-ink">Users</h3>
          <p className="mt-1 text-sm text-muted">
            {admins} admin{admins === 1 ? "" : "s"} · {users} member
            {users === 1 ? "" : "s"} on the platform.
          </p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange">
            Browse users
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </L>
      </div>
    </div>
  );
}
