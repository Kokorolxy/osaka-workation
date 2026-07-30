import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { L } from "@/components/locale-link";
import { FeedbackBanner } from "@/components/feedback-banner";
import { AdminStripeTestButton } from "@/components/admin-stripe-test-button";
import { ArrowRight, ClipboardList, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type EventStats = {
  id: string;
  title: string;
  pending: number;
  approved: number;
  paid: number;
  draft: number;
  cancelled: number;
  total: number;
};

export default async function AdminOverviewPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { stripe_test?: string };
}) {
  const locale = params.locale;
  const supabase = createClient();
  const [{ data: profiles }, { data: registrations }, { data: events }] =
    await Promise.all([
      supabase.from("profiles").select("id, role, created_at"),
      supabase.from("event_registrations").select("id, status, event_id"),
      supabase
        .from("events")
        .select("id, title, starts_on, is_active")
        .order("starts_on", { ascending: true }),
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
  const paidTotal = regs.filter((r) => r.status === "paid").length;

  const eventStats: EventStats[] = (events ?? []).map((event) => {
    const forEvent = regs.filter((r) => r.event_id === event.id);
    return {
      id: event.id,
      title: event.title,
      pending: forEvent.filter((r) => r.status === "pending_approval").length,
      approved: forEvent.filter((r) => r.status === "approved").length,
      paid: forEvent.filter((r) => r.status === "paid").length,
      draft: forEvent.filter((r) => r.status === "draft").length,
      cancelled: forEvent.filter((r) => r.status === "cancelled").length,
      total: forEvent.length,
    };
  });

  const stats = [
    { label: "Total users", value: total },
    { label: "Members", value: users },
    { label: "Joined last 7 days", value: recent },
    { label: "Pending approvals", value: pending, accent: pending > 0 },
    { label: "Paid registrations", value: paidTotal },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight text-brand-ink">
        Overview
      </h2>
      <p className="mt-1 text-sm text-muted">
        Snapshot of accounts and Join registrations by event.
      </p>

      {searchParams.stripe_test === "success" ? (
        <div className="mt-6">
          <FeedbackBanner variant="success">
            Stripe test checkout succeeded.
          </FeedbackBanner>
        </div>
      ) : null}
      {searchParams.stripe_test === "cancelled" ? (
        <div className="mt-6">
          <FeedbackBanner variant="info">
            Stripe test checkout was cancelled.
          </FeedbackBanner>
        </div>
      ) : null}

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-brand-ink">
              By event
            </h3>
            <p className="mt-1 text-sm text-muted">
              Pending approvals and paid spots for each workation.
            </p>
          </div>
          <L
            href="/admin/registrations"
            className="text-sm font-semibold text-brand-orange hover:underline"
          >
            View all registrations
          </L>
        </div>

        {eventStats.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-paper-line bg-white/70 px-5 py-10 text-center text-sm text-muted">
            No events yet.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {eventStats.map((event) => (
              <li
                key={event.id}
                className="rounded-3xl border border-paper-line bg-white p-5 sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-brand-ink">
                      {event.title}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {event.total} registration{event.total === 1 ? "" : "s"}{" "}
                      total
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <StatChip
                      label="Pending"
                      value={event.pending}
                      highlight={event.pending > 0}
                    />
                    <StatChip label="Approved" value={event.approved} />
                    <StatChip
                      label="Paid"
                      value={event.paid}
                      success={event.paid > 0}
                    />
                    <StatChip label="Draft" value={event.draft} muted />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

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
              : "Review tickets and approve members before checkout."}
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

      <section className="mt-10">
        <AdminStripeTestButton locale={locale} />
      </section>
    </div>
  );
}

function StatChip({
  label,
  value,
  highlight,
  success,
  muted,
}: {
  label: string;
  value: number;
  highlight?: boolean;
  success?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl px-3 py-2.5 ${
        highlight
          ? "bg-[#f3e0c8]/80"
          : success
            ? "bg-[#e7f3ea]"
            : muted
              ? "bg-paper-cream/60"
              : "bg-paper-sand/50"
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>
      <p
        className={`mt-0.5 text-xl font-bold tabular-nums ${
          highlight
            ? "text-[#7a4a12]"
            : success
              ? "text-[#1f6b3a]"
              : "text-brand-ink"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
