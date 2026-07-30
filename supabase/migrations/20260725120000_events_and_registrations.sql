-- Events catalog + per-user registration choices (checkout later)

create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  starts_on date,
  ends_on date,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.event_options (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  key text not null,
  kind text not null check (kind in ('package', 'addon')),
  name text not null,
  description text,
  price_jpy integer,
  sort_order integer not null default 0,
  unique (event_id, key)
);

create index event_options_event_id_idx on public.event_options (event_id);

create table public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  event_id uuid not null references public.events (id) on delete cascade,
  package_key text not null,
  addon_keys text[] not null default '{}',
  phone text,
  notes text,
  status text not null default 'draft'
    check (status in ('draft', 'pending_approval', 'approved', 'paid', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, event_id)
);

create index event_registrations_user_id_idx on public.event_registrations (user_id);
create index event_registrations_event_id_idx on public.event_registrations (event_id);

create or replace function public.set_event_registrations_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger event_registrations_set_updated_at
before update on public.event_registrations
for each row
execute function public.set_event_registrations_updated_at();

alter table public.events enable row level security;
alter table public.event_options enable row level security;
alter table public.event_registrations enable row level security;

create policy "Anyone authenticated can read active events"
  on public.events for select to authenticated
  using (is_active = true or public.is_admin());

create policy "Admins manage events"
  on public.events for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Anyone authenticated can read options for visible events"
  on public.event_options for select to authenticated
  using (
    exists (
      select 1 from public.events e
      where e.id = event_id
        and (e.is_active = true or public.is_admin())
    )
  );

create policy "Admins manage event options"
  on public.event_options for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Users read own registrations"
  on public.event_registrations for select to authenticated
  using (auth.uid() = user_id or public.is_admin());

create policy "Users insert own registrations"
  on public.event_registrations for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Users update own registrations"
  on public.event_registrations for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Admins update any registration"
  on public.event_registrations for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Seed: November Workation 2026
insert into public.events (slug, title, description, starts_on, ends_on, is_active)
values (
  'osaka-workation-2026',
  'November Workation 2026',
  'One ticket, the full Osaka life. Work your mornings, live the city your evenings — for two weeks, with a ready-made international community.',
  '2026-11-02',
  '2026-11-15',
  true
);

insert into public.event_options (event_id, key, kind, name, description, price_jpy, sort_order)
select e.id, v.key, v.kind, v.name, v.description, v.price_jpy, v.sort_order
from public.events e
cross join (
  values
    ('short', 'package', 'Short Stay', '7 days · networking meetup · includes housing type', 30000, 1),
    ('full', 'package', 'Full Program', '14 days · complete programme · includes housing type', 50000, 2),
    ('community', 'package', 'Community Pass', '14 days · programme & coworking only · no housing', 35000, 3)
) as v(key, kind, name, description, price_jpy, sort_order)
where e.slug = 'osaka-workation-2026';
