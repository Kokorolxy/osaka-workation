# Applies supabase/migrations (+ seed) once the DB is healthy.
FROM alpine:3.20

RUN apk add --no-cache postgresql-client bash

WORKDIR /app

COPY docker/apply-migrations.sh /app/apply-migrations.sh
COPY supabase/migrations /app/migrations
COPY supabase/seed.sql /app/seed.sql

RUN sed -i 's/\r$//' /app/apply-migrations.sh \
  && chmod +x /app/apply-migrations.sh

ENTRYPOINT ["/app/apply-migrations.sh"]
