import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/lib/database.types";
import type { User } from "@supabase/supabase-js";

export function isAdminRole(role: UserRole | null | undefined): boolean {
  return role === "admin";
}

export async function getAuthUser(): Promise<User | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentProfile(): Promise<{
  user: User;
  profile: Profile;
} | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile) return null;

  return { user, profile };
}

export async function requireUser() {
  const result = await getCurrentProfile();
  if (!result) {
    throw new Error("Unauthorized");
  }
  return result;
}

export async function requireAdmin() {
  const result = await requireUser();
  if (!isAdminRole(result.profile.role)) {
    throw new Error("Forbidden");
  }
  return result;
}
