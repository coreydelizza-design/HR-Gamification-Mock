# UI & Navigation — Lock

## Primary navigation (in order)

1. **Home** — what the user needs to know to work well today.
2. **My Fieldguide** — individual operating manual.
3. **People & Teams** — combined people roster + team cards (tabbed).
4. **Meetings** — meeting fit and readiness.
5. **Working Agreements** — team-to-team operating agreements.
6. **Org Insights** — aggregate operating clarity.
7. **Admin** — enterprise + org-pack configuration.

Implemented in `src/components/Sidebar.tsx` under two groups:

- `Workspace` — Home, My Fieldguide, People & Teams, Meetings, Working Agreements.
- `Organization` — Org Insights, Admin.

## Removed primary nav

These labels were retired from the primary nav in the v2 rebuild and must not return:

- Dashboard
- My card
- Team
- Person
- Leaderboard
- HR Dashboard
- Settings
- Roadmap

The Roadmap content survives only as internal docs (this directory) or as a future hidden admin-only view; it is not a primary nav item.

## Detail views (not in nav)

Reached by drilling in from a list:

- `person` (from People tab) → `views/PersonDetail.tsx`
- `team` (from Teams tab) → `views/TeamDetail.tsx`
- `meeting` (from Meetings list) → `views/MeetingDetail.tsx`
- `agreement` (from Working Agreements list) → `views/AgreementDetail.tsx`

Detail views must not bypass the parent nav highlight. `Sidebar.tsx#PARENT_OF` enforces this.

## Visual language

- Monochrome default surfaces.
- Color is **semantic only**: `--success`, `--warning`, `--danger`, `--muted`.
- No personality-style color as primary identity (Driver / Analyzer / etc. are not used as labels).
- Avatars use `Person.visualKey` as a deterministic color seed; initials are the fallback rendering.
- All status conveyed via `ReadinessMeter`, `StatusPill`, `FreshnessBadge`.
- Light/dark via the existing `data-theme` attribute. White-label via the variable block at the top of `src/styles/index.css`.

## Forbidden UI patterns

- Cartoon trophies, party emojis, or celebratory confetti.
- Comparing two named individuals on a single chart.
- Any "leaderboard" surface in the primary nav or sidebar.
- Personality archetype as a primary visual identity (chips, banners, top-of-card pills).
