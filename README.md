# Fieldguide

**The enterprise operating manual for how people, teams, and organizations work together.**

> Org charts show reporting structure. Fieldguide shows working structure.

Fieldguide is a collaboration readiness platform. It captures how each person works, how each team operates, and how teams hand off to each other — then uses that context to make meetings ready, surface stale handoffs, and keep cross-team agreements healthy.

Phase 1 is a Vite + React + TypeScript prototype with full static demo data, deployable to Railway with no backend.

- 🌓 **Light + dark mode** with OS-preference detection and `localStorage` persistence
- 🎨 **White-label ready** — change four CSS variables at the top of `src/styles/index.css` to fully rebrand
- 🧭 **Monochrome by default** — color is reserved for semantic readiness states (success / warning / danger / muted)

## Primary spine

Person → Work Card → Team Card → Meeting Fit → Working Agreement → Impact Map → Org Intelligence

## The seven views

**Workspace**
- `Home` — what you need to know to work well today: your card readiness, the next meeting's fit, the people and teams you're about to engage, handoff clarity gaps, the six-category collaboration-readiness rollup, and the active operating norms in your Org Pack.
- `My Fieldguide` — your individual operating manual. Ten sections (Communication, Meetings, Feedback, Decisions, Focus, Escalation, What I need from others, What others can count on me for, Visibility, Freshness). Per-section visibility and a Preview-as-teammate mode.
- `People & Teams` — tabbed: People (working-context cards) and Teams (operating-entity cards).
- `Meetings` — meeting fit and readiness, not meeting summaries. Each meeting shows attendee context, required team inputs, decision owner, prep gaps, async recommendation, suggested follow-up, and any governing agreement.
- `Working Agreements` — first-class team-to-team operating agreements (mutual needs, required inputs, handoff checklist, meeting norms, escalation path, decision rights, common failure points, review cadence).

**Organization**
- `Org Insights` — aggregate operating clarity: adoption, freshness, handoff gaps, dependency gaps, advisory nudge queue. No individual rankings.
- `Admin` — enterprise + organization configuration: Org Packs, required card sections, team templates, badge language, integrations, retention, consent and audit.

Each view answers one or more of the six product questions:

1. How do I work with this person?
2. How do I work with this team?
3. Is this meeting ready?
4. What does this team need from us?
5. What agreement governs this handoff?
6. Where is operating clarity missing?

## What Fieldguide is not

- Not a personality test or working-style quiz.
- Not a generic HR dashboard.
- Not a gamified leaderboard or employee-ranking system.
- Not a meeting-summary or transcription tool.
- Not a system of record for hiring, firing, promotion, compensation, discipline, or performance decisions.

The product enforces these boundaries at the data, UI, and gamification layers. See `docs/PRIVACY_GOVERNANCE_LOCK.md` and `docs/GAMIFICATION_LOCK.md`.

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

`preview` serves the built static assets on `${PORT:-4173}` — that is the script Railway runs.

## Deploy to Railway

1. Push this repo to GitHub.
2. In Railway: **New Project → Deploy from GitHub repo → select this repo**.
3. Railway auto-detects Nixpacks and uses the `start` script (`npm run preview`).
4. After the first deploy: service → **Settings → Networking → Generate Domain** for a public URL.

No env vars needed for Phase 1 — all data is static, baked into `src/data/`.

## Theming & white-labeling

### Toggle light / dark

A sun/moon button in the top-right toggles theme. The choice persists via `localStorage` (key: `fieldguide:theme`). First-time visitors get their OS preference (`prefers-color-scheme`) as default. An inline script in `index.html` applies the theme before paint to prevent a flash of incorrect colors.

### White-label in 60 seconds

Open `src/styles/index.css` and edit the first block:

```css
:root {
  --brand: #0A0A0A;            /* Primary brand color (light mode)  */
  --brand-on: #FFFFFF;         /* Foreground on brand (light mode)  */
  --brand-dark: #FAFAFA;       /* Primary brand color (dark mode)   */
  --brand-on-dark: #0A0A0A;    /* Foreground on brand (dark mode)   */
}
```

That is it. Every component reads from these variables — no need to grep through TSX files.

### Add a new theme variant

Append a selector to `src/styles/index.css`:

```css
[data-theme="brand-blue"] {
  --brand: #1E40AF;
}
```

Then set `data-theme="brand-blue"` on `<html>` from your code.

## Repo structure

```
src/
├── App.tsx                       view registry, top-level state
├── main.tsx                      React entry
├── styles/index.css              full design system + collaboration patterns
├── lib/
│   ├── types.ts                  26-interface data model (Supabase-shaped)
│   ├── readiness.ts              explainable, advisory readiness math
│   └── theme.ts                  light/dark hook with persistence
├── data/                         static demo data (extract first when moving to Supabase)
│   ├── enterprise.ts             Enterprise + Organization + OrgPacks
│   ├── cardSections.ts           Ten standard card sections
│   ├── teams.ts                  Teams + TeamCards (operating entities)
│   ├── people.ts                 People + WorkCards + CardAnswers
│   ├── meetings.ts               Meetings + MeetingFitBriefs
│   ├── agreements.ts             WorkingAgreements + sections + collaboration plumbing
│   ├── badges.ts                 Allowed-badge catalog + earned badges
│   ├── orgInsights.ts            Aggregate metrics + nudges + freshness signals
│   ├── operatingNorms.ts         Active norms and partner org packs
│   └── admin.ts                  Integrations, templates, retention, consent, audit
├── components/
│   ├── Icons.tsx                 Inline SVG icon set (no external deps)
│   ├── Shared.tsx                Avatar, Bar, Ring, ReadinessMeter, StatusPill, FreshnessBadge, TeamMark
│   ├── Sidebar.tsx               7-item primary nav
│   └── TopBar.tsx                Breadcrumb + theme toggle
└── views/                        Home, MyFieldguide, PeopleTeams, PersonDetail, TeamDetail,
                                  Meetings, MeetingDetail, WorkingAgreements, AgreementDetail,
                                  OrgInsights, Admin
```

## Design language

- **Fonts**: Fraunces (serif, headings), Geist (sans, body), JetBrains Mono (numbers/codes).
- **Default palette**: monochrome — white/light gray surfaces over near-black text, inverted in dark mode.
- **Status colors**: green (success), amber (warning), red (danger), neutral muted. Used sparingly, semantic only.
- **No personality-style color as primary identity.** Avatars use a deterministic visual key for color variety; the key carries no personality claim.

## Where to take it next (Phase 2)

The data files in `src/data/` are the natural extraction point for moving to Supabase. Each maps cleanly to one or two tables — see `docs/OBJECT_MODEL_LOCK.md` for the table-by-table mapping.

Integration layer next:
- Slack / Microsoft Teams for nudge delivery and meeting fit briefs.
- Google Calendar / Outlook for meeting context.
- HRIS sync for team-membership freshness.

Until then: static demo only. No Supabase, no auth, no backend.

## Documentation

The `docs/` directory contains the product-level locks that guide every change:

- `PRODUCT_SPINE.md` — positioning, primary spine, forbidden directions.
- `OBJECT_MODEL_LOCK.md` — 26-interface data model + future Supabase table map.
- `GAMIFICATION_LOCK.md` — allowed readiness categories and badges; forbidden patterns.
- `PRIVACY_GOVERNANCE_LOCK.md` — hard product boundaries on employment decisions.
- `UI_NAVIGATION_LOCK.md` — primary nav and retired labels.
- `ORG_PACKS.md` — multi-organization configuration model.
- `MEETING_FIT_ENGINE.md` — what the engine answers and what it deliberately is not.
- `WORKING_AGREEMENTS.md` — module shape and status lifecycle.
- `BUILD_NOTES.md` — scripts, repo shape, future Supabase migration.

## License

Private prototype. Not for redistribution.
