# Build Notes

## Stack

- Vite + React 18 + TypeScript (strict).
- **Zero runtime dependencies beyond `react` and `react-dom`.** No graph library, no router, no state library. Adding a runtime dep is a lock violation.
- Light/dark + white-label variables preserved from v2 (see Theming).

## Scripts

```bash
npm install
npm run dev       # local dev with hot reload
npm run build     # tsc -b && vite build
npm run preview   # serves dist on $PORT
```

`npm run build` runs `tsc -b` first, so all type errors are caught before Vite bundles.

## What this is

Fieldguide **v3** — the organization-first rebuild. The Organization Card is the primary object; individual work cards are nested context only. See `PRODUCT_SPINE.md` and `ORGANIZATION_FIRST_MODEL.md`.

Data is **static demo only** — no Supabase, no auth, no router (the view-registry pattern in `App.tsx` is kept).

## Data file layout (`src/data/`)

```
enterprise.ts            the tenant root
organizations.ts         36-org registry, two tiers, 7 categories (canonical o-* IDs)
orgCards*.ts             OrganizationCard prose (split tier1/tier2 if a file exceeds ~1,200 lines)
orgSuccessModels.ts      success-model content (if split out)
orgNeedsOffers.ts        OrgNeed + OrgOffer
orgDependencies.ts       OrgDependency
successAgreements.ts     SuccessAgreement + SuccessAgreementSection (~14 agreements)
meetingFit.ts            OrgMeeting + OrgMeetingFit (8 meetings)
collaborationMap.ts      CollabEdge (~25–31 edges)
orgInsights.ts           OrgInsight + OrgNudge
orgPacks.ts              11 OrgPacks
people.ts                Person (nested context)
roleCards.ts             RoleCard (nested context)
individualWorkCards.ts   IndividualWorkCard / WorkCard (nested context)
admin.ts                 governance / consent / audit placeholders
badges.ts                OrgBadge catalog
```

Each file exports an array plus a `*_BY_ID` lookup map (v2 convention).

## Library layout (`src/lib/`)

```
types.ts        the v3 data model (v3 organization-first block at the bottom)
orgAnalysis.ts  analyzeOrganizationSuccess + analyzeCrossOrgSuccess (deterministic, explainable)
readiness.ts    v2 readiness math, reused for the ReadinessSummary discipline
theme.ts        light/dark hook + persistence
```

## Adding a view

1. Add the `ViewKey` literal to `types.ts`.
2. Add a label in `TopBar.tsx`.
3. Add a nav entry in `Sidebar.tsx` (only if it is one of the 7 primary items; detail views are `PARENT_OF`-mapped, not nav entries).
4. Add a route in the `App.tsx` view registry.
5. Create `src/views/Foo.tsx`.

## Theming

- White-label variables live in the first block of `src/styles/index.css`.
- Light/dark via `useTheme()` (`lib/theme.ts`), persisted in `localStorage`; an inline script in `index.html` applies the theme before paint.

## Future Supabase migration

See `OBJECT_MODEL_LOCK.md` for the object → table mapping. Until then: static demo only.

## v3.5 — Interactive workshop kit

Static demo turned into a no-backend workshop instrument (still zero runtime
deps beyond react/react-dom):

- `src/lib/demoStore.ts` — mutable in-memory source (Organizations + cards +
  enterprise label), localStorage-persisted (`fieldguide:demo-state:v1`,
  `schemaVersion`), exposed via a `useSyncExternalStore` hook. The only seam
  views read org/card data through; `lib/orgData.ts` analysis cache busts on
  state identity so readiness recomputes live.
- `src/components/Editors.tsx` + `CardEditors.tsx` — structured section editors
  (chips / selects / entity pickers) writing through the store.
- `src/data/orgCommercial.ts` — organization-level commercial profiles (no
  individual targets, ever).
- `src/components/CreateOrgWizard.tsx` + Admin "Workshop" tab — create org,
  export/import session JSON, rename enterprise, local snapshots.

See WORKSHOP_MODE.md for the session shape and the 1:1 Supabase seed mapping.
