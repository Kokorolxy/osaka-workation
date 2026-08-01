-- Add a second one-week slot (Nov 8-14) package family.
-- Keeps existing week2_* as the 2-week option and week1_* as Nov 1-7.

insert into public.event_options (event_id, key, kind, name, description, price_jpy, sort_order)
select
  eo.event_id,
  'week2_single_general',
  'package',
  'Nov 8-14 (Week 2) · General',
  eo.description,
  eo.price_jpy,
  7
from public.event_options eo
where eo.kind = 'package'
  and eo.key = 'week1_general'
on conflict (event_id, key) do nothing;

insert into public.event_options (event_id, key, kind, name, description, price_jpy, sort_order)
select
  eo.event_id,
  'week2_single_early_bird',
  'package',
  'Nov 8-14 (Week 2) · Early bird',
  eo.description,
  eo.price_jpy,
  8
from public.event_options eo
where eo.kind = 'package'
  and eo.key = 'week1_early_bird'
on conflict (event_id, key) do nothing;

insert into public.event_options (event_id, key, kind, name, description, price_jpy, sort_order)
select
  eo.event_id,
  'week2_single_referral',
  'package',
  'Nov 8-14 (Week 2) · Referral',
  eo.description,
  eo.price_jpy,
  9
from public.event_options eo
where eo.kind = 'package'
  and eo.key = 'week1_referral'
on conflict (event_id, key) do nothing;
