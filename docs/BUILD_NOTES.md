# Build Notes

## Stack

- Vite + React 18 + TypeScript (strict).
- No external runtime dependencies beyond React and `react-dom`.
- Deployed to Railway via `npm run preview` (already wired in `railway.json`).

## Scripts

```bash
npm install
npm run dev       # local dev with hot reload
npm run build     # tsc -b && vite build
npm run preview   # serves dist on $PORT (Railway uses this as `start`)
```

`npm run build` runs `tsc -b` first, so all type errors are caught before Vite touches the bundle.

## Repo shape

```
src/
├── App.tsx                       view registry, top-level state
├── main.tsx                      React entry
├── styles/index.css              full design system + v2 patterns
├── lib/
│   ├── types.ts                  26-interface data model
│   ├── readiness.ts              explainable readiness math
│   └── theme.ts                  light/dark hook + persistence
├── data/                         static demo data; Supabase-shaped
│   ├── enterprise.ts
│   ├── cardSections.ts
│   ├── teams.ts
│   ├── people.ts
│   ├── meetings.ts
│   ├── agreements.ts
│   ├── orgInsights.ts
│   ├── operatingNorms.ts
│   ├── badges.ts
│   └── admin.ts
├── components/
│   ├── Icons.tsx                 inline SVG set, no external deps
│   ├── Shared.tsx                Avatar, Bar, Ring, ReadinessMeter, StatusPill, FreshnessBadge, TeamMark
│   ├── Sidebar.tsx               7-item primary nav
│   └── TopBar.tsx                breadcrumb + theme toggle
└── views/
    ├── Home.tsx
    ├── MyFieldguide.tsx
    ├── PeopleTeams.tsx
    ├── PersonDetail.tsx
    ├── TeamDetail.tsx
    ├── Meetings.tsx
    ├── MeetingDetail.tsx
    ├── WorkingAgreements.tsx
    ├── AgreementDetail.tsx
    ├── OrgInsights.tsx
    └── Admin.tsx

docs/                              lock docs (this folder)
```

## Adding a view

1. Add the `ViewKey` literal to `src/lib/types.ts`.
2. Add a label entry in `src/components/TopBar.tsx#LABELS`.
3. Add a nav entry in `src/components/Sidebar.tsx#NAV`.
4. Add a route in `src/App.tsx` view registry.
5. Create `src/views/Foo.tsx`.

## Adding a static-data file

1. Define the interface in `src/lib/types.ts`.
2. Create `src/data/foo.ts`.
3. Export both an array (e.g. `FOOS`) and a `*_BY_ID` lookup map.
4. Document the future Supabase table in `OBJECT_MODEL_LOCK.md`.

## Theming

- White-label variables live in the first block of `src/styles/index.css`. Edit four `--brand-*` variables to rebrand.
- Light/dark toggle is via `useTheme()` (`lib/theme.ts`). The choice persists in `localStorage` under `fieldguide:theme`. An inline script in `index.html` applies the theme before paint.

## Future Supabase migration

Each static data file maps cleanly to one or two tables (see `OBJECT_MODEL_LOCK.md`). The migration path:

1. Spin up Supabase. Apply schema mirroring `data/*` interfaces.
2. Replace each `data/foo.ts` export with a fetch from the table.
3. Add an auth layer; resolve `ME` from the session, not from a hardcoded ID.

Until then: static demo only. No Supabase, no auth, no backend.
