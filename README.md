# Fieldguide

**How to work with me, structured.** A prototype HR product that helps teams break down silos by giving every employee a working-style profile, then surfacing the relational tension between people and teams.

This repository is Phase 1 of the product — the full UI prototype as a Vite + React + TypeScript build, deployable to Railway in one click.

- 🌓 **Light + dark mode** with OS-preference detection and `localStorage` persistence
- 🎨 **White-label ready** — change four CSS variables to fully rebrand
- ⚪ **Monochrome by default** — neutral primary palette, categorical colors only where they convey meaning

## What's in here

Nine navigable views demonstrating the full product surface:

**For employees**
- `Dashboard` — Your card landing with completion ring and next meeting brief
- `My card` — Edit the eight working-style questions with live scoring
- `Team` — Filterable directory of all teammates
- `Person` — The marquee "How to work with me" page (open from Team)
- `Meetings` — AI-generated meeting briefs per attendee mix
- `Leaderboard` — Team-vs-team rankings (no individual ranking)

**For HR**
- `HR Dashboard` — KPIs, completion trend, working-style mix, cross-team friction heatmap, nudge queue
- `Settings` — Gamification configurator with four presets

**About the prototype**
- `Roadmap` — Five-phase product plan from this build through enterprise governance

## Local development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173` with hot reload.

## Production build

```bash
npm run build
npm run preview
```

`preview` serves the built static assets on `${PORT:-4173}` — that's the script Railway runs.

## Deploy to Railway

1. Push this repo to GitHub (GitHub Desktop: File → Add Local Repository → publish to GitHub)
2. In Railway: **New Project → Deploy from GitHub repo → select this repo**
3. Railway auto-detects Nixpacks and uses the `start` script (`npm run preview`)
4. After the first deploy: service → **Settings → Networking → Generate Domain** for a public URL

No env vars needed for Phase 1 — the data is static, baked into `src/data/`.

## Theming & white-labeling

### Toggle light / dark

A sun/moon button in the top-right of every view toggles theme. The choice persists via `localStorage` (key: `fieldguide:theme`). First-time visitors get their OS preference (`prefers-color-scheme`) as default. An inline script in `index.html` applies the theme before paint to prevent a flash of incorrect colors.

### White-label in 60 seconds

Open `src/styles/index.css` and edit the first block:

```css
:root {
  /* === BRAND === */
  --brand: #0A0A0A;            /* Primary brand color (light mode) */
  --brand-on: #FFFFFF;         /* Foreground on brand (light mode) */
  --brand-dark: #FAFAFA;       /* Primary brand color (dark mode) */
  --brand-on-dark: #0A0A0A;    /* Foreground on brand (dark mode) */

  /* === CATEGORICAL === */
  --cat-1: #B45309;            /* Driver — warm/assertive */
  --cat-2: #1D4ED8;            /* Analyzer — cool/analytical */
  --cat-3: #047857;            /* Connector — green/collaborative */
  --cat-4: #6D28D9;            /* Visionary — violet/creative */

  --cat-1-dark: #FBBF24;       /* Dark-mode variants */
  --cat-2-dark: #60A5FA;
  --cat-3-dark: #34D399;
  --cat-4-dark: #A78BFA;
}
```

That's it. Every component reads from these variables — no need to grep through TSX files.

### Add a new theme variant

Append a selector to `src/styles/index.css`:

```css
[data-theme="brand-blue"] {
  --brand: #1E40AF;
  /* override anything else */
}
```

Then set `data-theme="brand-blue"` on `<html>` from your code.

### Component-level overrides

All surfaces, text colors, borders, and status colors are CSS variables (`--surface`, `--ink`, `--muted`, `--rule`, `--success`, `--warning`, `--danger`). Inspect `src/styles/index.css` for the full list.

## Repo structure

```
src/
├── App.tsx                    Root component — view registry, state
├── main.tsx                   React entry point
├── styles/index.css           Full design system (CSS variables, components)
├── lib/
│   ├── types.ts               TypeScript interfaces for the data model
│   ├── scoring.ts             Score computation + friction helpers
│   └── theme.ts               useTheme hook (light/dark with persistence)
├── data/                      All static data — extract this first when moving to Supabase
│   ├── styles.ts              Working style configs
│   ├── questions.ts           The eight questions
│   ├── people.ts              User + 6 teammates
│   ├── compat.ts              Compatibility scoring
│   ├── meetings.ts            Sample meetings
│   ├── hr.ts                  HR analytics
│   ├── gamification.ts        5 categories, 22 mechanics, 4 presets
│   └── roadmap.ts             Product roadmap
├── components/
│   ├── Icons.tsx              Inline SVG icon set (no external deps)
│   ├── Shared.tsx             Avatar, StylePill, TierBadge, Bar
│   ├── Sidebar.tsx            Left nav
│   └── TopBar.tsx             Breadcrumb, streak pill, theme toggle
└── views/                     One file per view
    ├── Dashboard.tsx
    ├── Edit.tsx
    ├── Team.tsx
    ├── Person.tsx
    ├── Meetings.tsx
    ├── Leaderboard.tsx
    ├── HRDashboard.tsx
    ├── Settings.tsx
    └── Roadmap.tsx
```

## Design language

- **Fonts**: Fraunces (serif, headings), Geist (sans, body), JetBrains Mono (numbers/codes)
- **Default palette**: Monochrome — white/light gray surfaces over near-black text, inverted in dark mode
- **Status colors**: green (success), amber (warning), red (danger) — used sparingly, semantic only
- **Categorical**: four working styles get muted-but-distinct colors (override via `--cat-1` through `--cat-4`)
- **Tier system**: Gold / Silver / Bronze / Incomplete (semantic, themed for both modes)

## Where to take it next (Phase 2)

The data files in `src/data/` are the natural extraction point for moving to Supabase. Each maps to one or two tables:

- `people.ts` → `people` + `answers` table
- `compat.ts` → derived from `answers` at query time
- `meetings.ts` → `meetings` + `meeting_attendees` join
- `hr.ts` (friction) → derived from `people.style` aggregation per team
- `gamification.ts` → `org_settings` table

Then the integrations layer: Slack app for brief delivery, Google Calendar / Outlook for invite injection, HRIS sync for org-chart auto-population. See the `Roadmap` view inside the app for full sequencing.

## License

Private prototype. Not for redistribution.
