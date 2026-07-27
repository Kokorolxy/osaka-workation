import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { HOUSING_TYPES } from "@/lib/site";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { RegistrationActions } from "@/components/registration-actions";
import { RegistrationStatusBadge } from "@/components/registration-status";
import { FeedbackBanner } from "@/components/feedback-banner";
import { friendlyAppError } from "@/lib/errors/user-message";
import { Clock3, Inbox } from "lucide-react";

export const metadata: Metadata = {
  title: "Registrations · Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function housingLabel(key: string | null) {
  if (!key) return "None";
  if (key === "singular") return "Private";
  if (key === "shared") return "Shared";
  return HOUSING_TYPES.find((h) => h.key === key)?.name ?? key;
}

export default async function AdminRegistrationsPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: Locale = isLocale(params.locale)
    ? params.locale
    : defaultLocale;
  const supabase = createClient();

  const [
    { data: registrations, error },
    { data: profiles },
    { data: events },
    { data: options },
  ] = await Promise.all([
    supabase
      .from("event_registrations")
      .select(
        "id, user_id, event_id, package_key, stay_key, phone, notes, status, created_at, updated_at",
      )
      .order("updated_at", { ascending: false }),
    supabase.from("profiles").select("id, email, display_name"),
    supabase.from("events").select("id, slug, title"),
    supabase
      .from("event_options")
      .select("event_id, key, name")
      .eq("kind", "package"),
  ]);

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));
  const eventById = new Map((events ?? []).map((e) => [e.id, e]));
  const packageLabel = (eventId: string, packageKey: string) => {
    const match = (options ?? []).find(
      (o) => o.event_id === eventId && o.key === packageKey,
    );
    return match?.name ?? packageKey;
  };

  const rows = registrations ?? [];
  const pendingCount = rows.filter((r) => r.status === "pending_approval").length;
  const approvedCount = rows.filter((r) => r.status === "approved").length;
  const draftCount = rows.filter((r) => r.status === "draft").length;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-brand-ink">
            Registrations
          </h2>
          <p className="mt-1 text-sm text-muted">
            Review Join submissions and approve members before checkout.
          </p>
        </div>
        {pendingCount > 0 ? (
          <p className="inline-flex items-center gap-2 rounded-full bg-[#f3e0c8] px-3.5 py-2 text-xs font-semibold text-[#7a4a12]">
            <Clock3 className="h-3.5 w-3.5" />
            {pendingCount} awaiting approval
          </p>
        ) : null}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Pending", value: pendingCount },
          { label: "Approved", value: approvedCount },
          { label: "Drafts", value: draftCount },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-paper-line bg-white px-4 py-3"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              {stat.label}
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-brand-ink">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {error ? (
        <div className="mt-6">
          <FeedbackBanner variant="error">
            {friendlyAppError(
              error,
              "Please refresh the page. If this keeps happening, try signing in again.",
            )}
          </FeedbackBanner>
        </div>
      ) : null}

      {rows.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-paper-line bg-white/70 px-6 py-14 text-center">
          <Inbox className="mx-auto h-8 w-8 text-muted" />
          <p className="mt-3 text-base font-semibold text-brand-ink">
            No registrations yet
          </p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
            Choices appear here when members save or submit on Join.
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {rows.map((row) => {
            const profile = profileById.get(row.user_id);
            const event = eventById.get(row.event_id);
            const highlight = row.status === "pending_approval";

            return (
              <li
                key={row.id}
                className={`rounded-3xl border bg-white p-5 transition-shadow sm:p-6 ${
                  highlight
                    ? "border-brand-orange/40 shadow-[0_16px_36px_-28px_rgba(234,85,4,0.45)]"
                    : "border-paper-line"
                }`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <RegistrationStatusBadge status={row.status} />
                      <span className="text-xs text-muted">
                        Updated {formatDate(row.updated_at)}
                      </span>
                    </div>

                    <div>
                      <p className="text-base font-semibold text-brand-ink">
                        {profile?.display_name ?? "Member"}
                      </p>
                      <p className="text-sm text-muted">
                        {profile?.email ?? "—"}
                      </p>
                    </div>

                    <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                          Event
                        </dt>
                        <dd className="mt-1 font-medium text-brand-ink">
                          {event?.title ?? "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                          Package
                        </dt>
                        <dd className="mt-1 font-medium text-brand-ink">
                          {packageLabel(row.event_id, row.package_key)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                          Housing
                        </dt>
                        <dd className="mt-1 font-medium text-brand-ink">
                          {housingLabel(row.stay_key)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                          Phone
                        </dt>
                        <dd className="mt-1 font-medium text-brand-ink">
                          {row.phone ?? "—"}
                        </dd>
                      </div>
                    </dl>

                    {row.notes ? (
                      <p className="rounded-2xl bg-paper-cream/70 px-4 py-3 text-sm text-muted">
                        <span className="font-semibold text-brand-ink">
                          Note:{" "}
                        </span>
                        {row.notes}
                      </p>
                    ) : null}
                  </div>

                  <div className="shrink-0 lg:pt-1">
                    <RegistrationActions
                      locale={locale}
                      registrationId={row.id}
                      status={row.status}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
