-- Referral codes are admin-only: null out all non-admin codes
-- and restrict the lookup function to admin profiles only.

-- Allow null referral_code (non-admins won't have one)
alter table public.profiles
  alter column referral_code drop not null;

-- Clear codes for all non-admin users
update public.profiles
set referral_code = null
where role != 'admin';

-- Update signup trigger: only assign referral_code to admins
-- (admins are promoted via SQL/service role after signup, not on creation,
--  so new signups never need a code assigned automatically)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, role, referral_code)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    'user',
    null
  );
  return new;
end;
$$;

-- Restrict referral code lookup to admins only
create or replace function public.find_referrer_by_code(code text)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id
  from public.profiles
  where referral_code = upper(trim(code))
    and role = 'admin'
  limit 1;
$$;

revoke all on function public.find_referrer_by_code(text) from public;
grant execute on function public.find_referrer_by_code(text) to authenticated;
