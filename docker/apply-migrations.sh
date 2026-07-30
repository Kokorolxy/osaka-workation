#!/usr/bin/env bash
set -euo pipefail

echo "Waiting for Postgres at ${PGHOST}:${PGPORT}..."
until pg_isready -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" >/dev/null 2>&1; do
  sleep 1
done

# Give the Supabase Postgres image time to finish role/schema bootstrap.
sleep 5

# GoTrue must own auth helper functions to finish its migrations.
echo "Handing auth helpers to supabase_auth_admin..."
psql -v ON_ERROR_STOP=1 -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -d "${PGDATABASE}" <<'EOF'
DO $$
DECLARE
  fn text;
BEGIN
  FOREACH fn IN ARRAY ARRAY['uid', 'role', 'email']
  LOOP
    IF EXISTS (
      SELECT 1
      FROM pg_proc p
      JOIN pg_namespace n ON n.oid = p.pronamespace
      WHERE n.nspname = 'auth' AND p.proname = fn
    ) THEN
      EXECUTE format('ALTER FUNCTION auth.%I() OWNER TO supabase_auth_admin', fn);
    END IF;
  END LOOP;
END $$;
EOF

echo "Ensuring schema_migrations table..."
psql -v ON_ERROR_STOP=1 -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -d "${PGDATABASE}" <<'EOF'
create table if not exists public.schema_migrations (
  filename text primary key,
  applied_at timestamptz not null default now()
);
EOF

# If this DB already has profiles but no migration log (manual / older runs),
# mark known applied files so we don't re-run them.
psql -v ON_ERROR_STOP=1 -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -d "${PGDATABASE}" <<'EOF'
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'profiles'
  ) THEN
    INSERT INTO public.schema_migrations (filename)
    VALUES ('20260722120000_profiles_and_roles.sql')
    ON CONFLICT DO NOTHING;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'events'
  ) THEN
    INSERT INTO public.schema_migrations (filename)
    VALUES ('20260725120000_events_and_registrations.sql')
    ON CONFLICT DO NOTHING;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'event_registrations'
      AND column_name = 'stay_key'
  ) THEN
    INSERT INTO public.schema_migrations (filename)
    VALUES ('20260725130000_registration_stay_choice.sql')
    ON CONFLICT DO NOTHING;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'event_registrations'
      AND constraint_name = 'event_registrations_status_check'
  ) THEN
    INSERT INTO public.schema_migrations (filename)
    VALUES ('20260725140000_registration_approval.sql')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
EOF

echo "Applying pending migrations..."
shopt -s nullglob
files=(/app/migrations/*.sql)
if [ ${#files[@]} -eq 0 ]; then
  echo "No migration files found."
else
  for f in "${files[@]}"; do
    name="$(basename "$f")"
    already="$(psql -At -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -d "${PGDATABASE}" \
      -c "select 1 from public.schema_migrations where filename = '${name}' limit 1")"
    if [ "$already" = "1" ]; then
      echo " -> ${name} (already applied, skip)"
      continue
    fi
    echo " -> ${name}"
    psql -v ON_ERROR_STOP=1 -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -d "${PGDATABASE}" -f "$f"
    psql -v ON_ERROR_STOP=1 -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -d "${PGDATABASE}" \
      -c "insert into public.schema_migrations (filename) values ('${name}') on conflict do nothing"
  done
fi

if [ -f /app/seed.sql ]; then
  echo "Applying seed.sql..."
  psql -v ON_ERROR_STOP=1 -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -d "${PGDATABASE}" -f /app/seed.sql
fi

echo "Migrations complete."
