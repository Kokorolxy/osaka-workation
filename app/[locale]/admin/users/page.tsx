import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Profile } from "@/lib/database.types";
import { FeedbackBanner } from "@/components/feedback-banner";
import { friendlyAppError } from "@/lib/errors/user-message";

export const metadata: Metadata = {
  title: "Users · Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type AuthExtras = {
  lastSignInAt: string | null;
  emailConfirmedAt: string | null;
};

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

async function loadAuthExtras(): Promise<Map<string, AuthExtras>> {
  const map = new Map<string, AuthExtras>();
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (error || !data?.users) return map;

    for (const user of data.users) {
      map.set(user.id, {
        lastSignInAt: user.last_sign_in_at ?? null,
        emailConfirmedAt: user.email_confirmed_at ?? null,
      });
    }
  } catch {
    // Service role missing or Auth admin unavailable — profiles-only view.
  }
  return map;
}

export default async function AdminUsersPage() {
  const supabase = createClient();
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, email, display_name, role, created_at, updated_at")
    .order("created_at", { ascending: false });

  const rows = (profiles ?? []) as Profile[];
  const authExtras = await loadAuthExtras();

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-brand-ink">
            Users
          </h2>
          <p className="mt-1 text-sm text-muted">
            {rows.length} account{rows.length === 1 ? "" : "s"} on the platform.
          </p>
        </div>
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

      <div className="mt-6 overflow-x-auto rounded-2xl border border-paper-line bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-paper-line bg-paper-cream/60 text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Joined</th>
              <th className="px-4 py-3 font-semibold">Last sign-in</th>
              <th className="px-4 py-3 font-semibold">Email confirmed</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-muted"
                >
                  No users yet. Sign up from the site to create the first
                  account.
                </td>
              </tr>
            ) : (
              rows.map((p) => {
                const extras = authExtras.get(p.id);
                return (
                  <tr
                    key={p.id}
                    className="border-b border-paper-line last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-brand-ink">
                      {p.display_name ?? "—"}
                      <p className="mt-0.5 font-mono text-[11px] text-muted">
                        {p.id.slice(0, 8)}…
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted">{p.email ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${
                          p.role === "admin"
                            ? "bg-brand-orange/10 text-brand-orange ring-brand-orange/25"
                            : "bg-paper-sand text-brand-ink ring-paper-line"
                        }`}
                      >
                        {p.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {formatDate(p.created_at)}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {formatDate(extras?.lastSignInAt)}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {extras?.emailConfirmedAt
                        ? formatDate(extras.emailConfirmedAt)
                        : extras
                          ? "No"
                          : "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
