# GeoWorldLook web

Source of [geoworldlook.vercel.app](https://geoworldlook.vercel.app), a portfolio site for Earth-observation analyses:
an interactive map, case studies and a technical blog.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · MapLibre GL · Supabase (PostGIS) · Tailwind CSS ·
a Python ETL job on GitHub Actions (Copernicus Data Space → Supabase).

## Structure

```text
src/
├── app/(marketing)/      # public routes: home, about, analyses, blog, contact
├── features/map/         # MapLibre map viewer
├── features/contact/     # contact form (server action)
├── lib/                  # Supabase client, notebook/blog content helpers
└── content/notebooks/    # analysis write-ups rendered on the site
scripts/backfill_copernicus.py      # Sentinel-2 statistics from Copernicus Data Space into Supabase
.github/workflows/copernicus-sync.yml  # scheduled ETL run
```

## Run locally

```bash
npm install
npm run dev        # http://localhost:9002
```

Environment variables (`.env.local`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
The ETL workflow reads `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `COPERNICUS_CLIENT_ID` and
`COPERNICUS_CLIENT_SECRET` from repository secrets.

## Related projects

The main analysis projects behind GeoWorldLook are [AgriScreen](https://github.com/geoworldlook/agriscreen)
(vineyard drought monitoring) and [EGMS Check](https://github.com/geoworldlook/egms-check) (InSAR validation).
