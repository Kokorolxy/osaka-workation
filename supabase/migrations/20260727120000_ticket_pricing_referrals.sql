-- Ticket model: 1w/2w × general | early_bird | referral
-- Referral codes on profiles; referrer tracking on registrations

alter table public.profiles
  add column if not exists referral_code text;

update public.profiles
set referral_code = upper(substr(replace(id::text, '-', ''), 1, 8))
where referral_code is null;

alter table public.profiles
  alter column referral_code set not null;

create unique index if not exists profiles_referral_code_uidx
  on public.profiles (referral_code);

alter table public.event_registrations
  add column if not exists referrer_id uuid references public.profiles (id) on delete set null,
  add column if not exists referral_code_used text;

create index if not exists event_registrations_referrer_id_idx
  on public.event_registrations (referrer_id);

-- Assign referral_code on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  code text;
begin
  code := upper(substr(replace(new.id::text, '-', ''), 1, 8));
  insert into public.profiles (id, email, display_name, role, referral_code)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    'user',
    code
  );
  return new;
end;
$$;

-- Replace package catalog
delete from public.event_registrations
where package_key not in (
  'week1_general', 'week1_early_bird', 'week1_referral',
  'week2_general', 'week2_early_bird', 'week2_referral'
);

delete from public.event_options eo
using public.events e
where eo.event_id = e.id
  and e.slug = 'osaka-workation-2026'
  and eo.kind = 'package';

insert into public.event_options (event_id, key, kind, name, description, price_jpy, sort_order)
select e.id, v.key, 'package', v.name, v.description, v.price_jpy, v.sort_order
from public.events e
cross join (
  values
    (
      'week2_general',
      '2 weeks · General',
      'Full Workation ticket: coworking, t-shirt, community, welcome & farewell parties with meals, two guides, daily day+night events. Weekend city tours guided (transport & extras not included).',
      65000,
      1
    ),
    (
      'week2_early_bird',
      '2 weeks · Early bird',
      '10% off · first 20 tickets. Same inclusions as General.',
      58500,
      2
    ),
    (
      'week2_referral',
      '2 weeks · Referral',
      '10% off with a member referral code (max 10 redemptions per referrer). Same inclusions as General.',
      58500,
      3
    ),
    (
      'week1_general',
      '1 week · General',
      'Full Workation ticket for one week. Same inclusions as the 2-week General ticket.',
      38500,
      4
    ),
    (
      'week1_early_bird',
      '1 week · Early bird',
      '10% off · first 20 tickets. Same inclusions as General.',
      34650,
      5
    ),
    (
      'week1_referral',
      '1 week · Referral',
      '10% off with a member referral code (max 10 redemptions per referrer). Same inclusions as General.',
      34650,
      6
    )
) as v(key, name, description, price_jpy, sort_order)
where e.slug = 'osaka-workation-2026';

update public.events
set description = 'Coworking, community, welcome & farewell parties with meals, two guides, and daily day+night events. Choose 1 or 2 weeks — General, Early bird (first 20), or Referral (10% off).'
where slug = 'osaka-workation-2026';

-- Resolve referral code without exposing all profiles
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
  limit 1;
$$;

revoke all on function public.find_referrer_by_code(text) from public;
grant execute on function public.find_referrer_by_code(text) to authenticated;
