-- Enforce referral ownership: admin profiles have codes, non-admin profiles do not.
-- Any authenticated user can redeem an admin referral code in Join.

-- Non-admin accounts should not store referral codes.
alter table public.profiles
  alter column referral_code drop not null;

update public.profiles
set referral_code = null
where role <> 'admin';

-- Ensure current admins always have a code.
update public.profiles
set referral_code = upper(substr(replace(id::text, '-', ''), 1, 8))
where role = 'admin'
  and referral_code is null;

-- New signups start as member users, so no referral code at creation.
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

-- If a member is promoted to admin later, assign a code automatically when missing.
create or replace function public.ensure_admin_referral_code()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role = 'admin' and new.referral_code is null then
    new.referral_code := upper(substr(replace(new.id::text, '-', ''), 1, 8));
  end if;

  if new.role <> 'admin' then
    new.referral_code := null;
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_referral_code_by_role on public.profiles;
create trigger profiles_referral_code_by_role
before insert or update of role on public.profiles
for each row
execute function public.ensure_admin_referral_code();

-- Referral lookups only resolve admin-owned codes.
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
