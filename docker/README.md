# Local Supabase (Docker)

Starts Postgres + Auth + PostgREST + Kong + Studio + Inbucket, then applies `supabase/migrations` via the `migrate` image.

```bash
npm run db:up
```

| Service | URL |
|---------|-----|
| API (Kong) | http://127.0.0.1:54321 |
| Studio | http://127.0.0.1:54323 |
| Inbucket (mail) | http://127.0.0.1:54324 |
| Postgres | localhost:54322 |

Copy `.env.example` → `.env.local` (keys already match `docker/.env`).

```bash
npm run db:down     # stop
npm run db:reset    # wipe volume + rebuild + remigrate
npm run db:logs     # follow logs
```

Promote your first admin after signup:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```
