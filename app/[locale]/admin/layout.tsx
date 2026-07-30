import { redirect } from "next/navigation";
import { getCurrentProfile, isAdminRole } from "@/lib/auth/session";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { AdminNav } from "@/components/admin-nav";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale: Locale = isLocale(params.locale)
    ? params.locale
    : defaultLocale;

  const session = await getCurrentProfile();
  if (!session) {
    redirect(`/${locale}/login?next=/${locale}/admin`);
  }
  if (!isAdminRole(session.profile.role)) {
    redirect(`/${locale}/account`);
  }

  return (
    <div className="container-page py-24">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-6 border-b border-paper-line pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Admin</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-brand-ink">
              Platform
            </h1>
            <p className="mt-1 text-sm text-muted">
              Signed in as {session.profile.email}
            </p>
          </div>
          <AdminNav />
        </div>
        <div className="pt-8">{children}</div>
      </div>
    </div>
  );
}
