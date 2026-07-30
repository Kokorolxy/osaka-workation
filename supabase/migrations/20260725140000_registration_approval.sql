-- Registration approval workflow:
-- draft → pending_approval (member submits) → approved (admin) → paid (checkout later)
-- cancelled for rejections / withdrawals

alter table public.event_registrations
  drop constraint if exists event_registrations_status_check;

-- Migrate legacy values before re-adding the check
update public.event_registrations
set status = 'pending_approval'
where status = 'submitted';

alter table public.event_registrations
  add constraint event_registrations_status_check
  check (
    status = any (
      array[
        'draft'::text,
        'pending_approval'::text,
        'approved'::text,
        'paid'::text,
        'cancelled'::text
      ]
    )
  );
