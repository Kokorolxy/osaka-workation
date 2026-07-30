-- Replace legacy short/full/community packages with the 6 Workation packages.
-- Source of truth for keys/prices in app code: lib/workation-packages.ts

-- Clear registrations that used removed package keys (dev-safe; local/test data)
delete from public.event_registrations
where package_key in ('short', 'full', 'community');

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
      'coworking_no_transport',
      'Coworking + weekends',
      'Access to the shared coworking space (~2 days/week) and weekend group activities. Activity tickets included; transportation not included.',
      35000,
      1
    ),
    (
      'coworking_with_transport',
      'Coworking + weekends + transport',
      'Same coworking and weekend activities, with transportation to group activities included.',
      45000,
      2
    ),
    (
      'singular_housing_no_transport',
      'Private housing + coworking',
      'Your own (non-shared) housing for the Workation, plus coworking and weekend activities without transportation.',
      75000,
      3
    ),
    (
      'shared_housing_no_transport',
      'Shared housing + coworking',
      'Housing shared with other participants, plus coworking and weekend activities without transportation.',
      65000,
      4
    ),
    (
      'singular_housing_with_transport',
      'Private housing + transport',
      'Private housing, coworking, weekend activities, and transportation to group activities.',
      85000,
      5
    ),
    (
      'shared_housing_with_transport',
      'Shared housing + transport',
      'Shared housing with other participants, coworking, weekend activities, and transportation.',
      75000,
      6
    )
) as v(key, name, description, price_jpy, sort_order)
where e.slug = 'osaka-workation-2026';

update public.events
set description = 'Coworking (~2 days/week), weekend group activities, optional housing (singular or shared), and optional activity transportation. Choose the package that fits how you want to join.'
where slug = 'osaka-workation-2026';
