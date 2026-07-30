-- Security hardening for SECURITY DEFINER functions.
-- Goal: remove unnecessary execute permissions while preserving application behavior.

-- Make future functions safer by default (explicit grants required).
alter default privileges in schema public
  revoke execute on functions from public;

-- Trigger-only functions should never be callable by anon/authenticated clients.
revoke all on function public.set_profiles_updated_at() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.enforce_registration_status_for_members() from public, anon, authenticated;
revoke all on function public.ensure_admin_referral_code() from public, anon, authenticated;

-- is_admin() is required by RLS policies at query time for signed-in users.
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- find_referrer_by_code() is called by signed-in users during Join flow.
revoke all on function public.find_referrer_by_code(text) from public, anon;
grant execute on function public.find_referrer_by_code(text) to authenticated;
