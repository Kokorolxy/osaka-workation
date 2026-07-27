-- Stripe checkout tracking on registrations

alter table public.event_registrations
  add column if not exists stripe_checkout_session_id text,
  add column if not exists stripe_payment_intent_id text,
  add column if not exists paid_at timestamptz;

create unique index if not exists event_registrations_stripe_session_uidx
  on public.event_registrations (stripe_checkout_session_id)
  where stripe_checkout_session_id is not null;

-- Members may only keep draft / pending_approval via their own updates.
-- approved / paid / cancelled are set by admins or the Stripe webhook (service role).
create or replace function public.enforce_registration_status_for_members()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  jwt_role text := coalesce(auth.jwt() ->> 'role', '');
begin
  -- Service role (webhooks / privileged server) and admins may set any status.
  if jwt_role = 'service_role' or public.is_admin() then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if new.status is distinct from 'draft'
       and new.status is distinct from 'pending_approval' then
      raise exception 'Members can only create draft or pending registrations';
    end if;
    return new;
  end if;

  -- UPDATE by a normal member
  if old.status in ('approved', 'paid', 'cancelled') then
    if new.status is distinct from old.status
       or new.package_key is distinct from old.package_key
       or new.stay_key is distinct from old.stay_key
       or new.event_id is distinct from old.event_id then
      raise exception 'This registration is locked';
    end if;
    return new;
  end if;

  if new.status is distinct from 'draft'
     and new.status is distinct from 'pending_approval' then
    raise exception 'Members can only set draft or pending_approval';
  end if;

  return new;
end;
$$;

drop trigger if exists event_registrations_enforce_status on public.event_registrations;
create trigger event_registrations_enforce_status
before insert or update on public.event_registrations
for each row
execute function public.enforce_registration_status_for_members();
