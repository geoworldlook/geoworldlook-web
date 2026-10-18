# GeoWorldLook web

Source of [geoworldlook.vercel.app](https://geoworldlook.vercel.app), the portfolio site of Dawid Sajewski:
Earth-observation projects, notebook-based articles and contact.

**Stack:** Next.js 15 (App Router, fully static) · React 19 · TypeScript · Tailwind CSS · MapLibre GL · Formspree.

## Content-first structure

All texts live in [`content/`](content/) and are validated at build time, so adding a post or a project never
requires touching the code. A step-by-step guide (in Polish) is in [`content/README.md`](content/README.md).

```text
content/
├── site.yaml            # identity, contact, navigation, home page sections
├── about.yaml           # about page
├── projects/*.yaml      # one file per project → /analyses and /analyses/<slug>
└── blog/*.ipynb         # one Jupyter notebook per article → /blog/<slug>
src/
├── app/(marketing)/     # routes: home, analyses, blog, about, contact
├── lib/content/         # loaders: YAML + zod validation, notebook parser
├── features/            # blog (notebook rendering), contact form, map
└── components/          # navbar, footer, UI primitives
```

### Blog posts from notebooks

- The first markdown cell holds YAML metadata (`title`, `date`, `summary`, `tags`, optional `project`, `draft`).
- Saved outputs are rendered as they are: figures (PNG, JPEG, SVG), HTML tables and text.
- Code cells accept Quarto-style options: `#| echo: false`, `#| output: false`, `#| include: false`.
- Drafts are visible in `npm run dev` only.

## Run locally

```bash
npm install
npm run dev        # http://localhost:9002
npm run build      # production build, also type-checks and validates content
```

Pushing to `main` deploys to Vercel; other branches get preview deployments.
