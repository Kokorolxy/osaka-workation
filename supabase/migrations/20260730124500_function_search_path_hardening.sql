-- Fix Advisor "Function Search Path Mutable" warnings without changing behavior.

-- Trigger helper for profiles.updated_at
alter function public.set_profiles_updated_at()
  set search_path = public;

-- Trigger helper for event_registrations.updated_at
alter function public.set_event_registrations_updated_at()
  set search_path = public;

-- Optional hardening: these trigger-only helpers should not be directly callable.
revoke all on function public.set_event_registrations_updated_at() from public, anon, authenticated;
