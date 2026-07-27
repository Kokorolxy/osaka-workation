-- Replace add-ons with a selected stay preference (from curated STAYS list)

alter table public.event_registrations
  add column if not exists stay_key text;

comment on column public.event_registrations.stay_key is
  'Housing style key: hotel | coliving | guesthouse (from Stays page types).';

-- Drop seeded add-on options; packages remain
delete from public.event_options where kind = 'addon';

-- Clarify which packages include a stay choice (stored in description prefix for app + humans)
update public.event_options
set description = '7 days · networking meetup · includes housing type'
where key = 'short' and kind = 'package';

update public.event_options
set description = '14 days · complete programme · includes housing type'
where key = 'full' and kind = 'package';

update public.event_options
set description = '14 days · programme & coworking only · no housing'
where key = 'community' and kind = 'package';
