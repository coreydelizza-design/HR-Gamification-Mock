# Fieldguide

**The organization-first collaboration-readiness platform — how every organization succeeds, what it owns, what it needs, and how it helps others.**

> Org charts show reporting structure. Fieldguide shows working structure.

Fieldguide makes the **Organization Card** the primary product object. Each organization (department / function) publishes how it succeeds, what it owns and explicitly does not own, what it needs from others, how it helps others, its dependencies, engagement model, meeting norms, and handoff rules. Individual work cards survive only as nested supporting context.

Phase 1 is a Vite + React + TypeScript prototype with full static demo data, deployable to Railway with no backend.

- 🌓 **Light + dark mode** with OS-preference detection and `localStorage` persistence
- 🎨 **White-label ready** — change four CSS variables at the top of `src/styles/index.css` to fully rebrand
- 🧭 **Monochrome by default** — color is reserved for semantic readiness states (success / warning / danger / muted)
- 🧮 **Deterministic, explainable scoring** — every readiness score carries a plain-language rationale; nothing is scored per person

## Product spine

Enterprise → Organization Catalog → Organization Card → Organization Success Model → Cross-Org Needs/Offers → Success Agreements → Meeting Fit → Collaboration Map → Org Intelligence

Individual nesting: Enterprise → Organization → Team → Role → Individual Work Card.

## The seven views

**Collaboration**
- `Home` — where organizational clarity needs attention today: enterprise collaboration-readiness meters, organizations needing attention, critical cross-org relationships, meetings at risk, how organizations help each other, and aggregated next-best actions.
- `Organization Cards` — a searchable, filterable catalog of 36 organizations across two tiers (12 rich, 24 catalog). Each detail view renders the 13-section card; Tier-2 cards show "section not yet published" placeholders — honest about depth, structurally identical.
- `Collaboration Map` — CSS-only relationship map with four modes: Enterprise, Selected org, Mutual success (runs the cross-org analysis), and Risk.
- `Success Agreements` — first-class organization-to-organization operating agreements with a six-state lifecycle (draft → shared → mutual_review → published → needs_refresh → archived).
- `Meeting Fit` — is this cross-org meeting ready? Required orgs represented, inputs present, decision owner, format vs. norms, async recommendation, handoff impact. Attendee individual-card context renders inline in the detail (the meeting-prep survival rule).

**Enterprise**
- `Org Insights` — aggregate organizational clarity only: card coverage, freshness mix, dependency risk, agreement coverage, which orgs are unclear about what they own, org-pack adoption. No individual metric, ranking, or comparison.
- `Admin` — enterprise + organization configuration: org catalog, card templates, the 11 org packs, visibility & governance, integrations.

The product answers nine questions: how does this organization succeed; what does it own; what does it need from others; how does it help others; how should another organization engage it; what handoffs are at risk; what Success Agreements govern a relationship; is this cross-org meeting ready; where is the operating model unclear.

## What Fieldguide is not

- Not a personality test or working-style quiz.
- Not a generic HR engagement dashboard.
- Not a gamified leaderboard or employee-ranking system.
- Not a meeting-summary or transcription tool.
- Not a system of record for hiring, firing, promotion, total-rewards, discipline, or performance decisions.

There is no individual ranking, friction score, or comparison of two named employees — anywhere, including the data shapes. All analytics aggregate at the organization / relationship level. See `docs/PRIVACY_GOVERNANCE_LOCK.md` and `docs/ORG_INSIGHTS_GUARDRAILS.md`.

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

`npm run build` runs `tsc -b && vite build`. `preview` serves the built assets on `${PORT:-4173}` — the script Railway runs.

## Deploy to Railway

1. Push this repo to GitHub.
2. Railway: **New Project → Deploy from GitHub repo → select this repo**.
3. Railway auto-detects Nixpacks and uses the `start` script (`npm run preview`).
4. After the first deploy: service → **Settings → Networking → Generate Domain**.

No env vars needed — all data is static, baked into `src/data/`.

## Theming & white-labeling

A sun/moon button toggles theme; the choice persists via `localStorage` (key `fieldguide:theme`), defaulting to OS preference, applied before paint to avoid a flash. To rebrand, edit the four `--brand*` variables at the top of `src/styles/index.css`; every component reads from them.

## Repo structure

```
src/
├── App.tsx                       view registry, top-level state (no router)
├── styles/index.css              design system + organization-first surfaces
├── lib/
│   ├── types.ts                  data model (Supabase-shaped: string IDs, *Id FKs, ISO timestamps)
│   ├── orgAnalysis.ts            analyzeOrganizationSuccess (11 dimensions) + analyzeCrossOrgSuccess
│   ├── orgData.ts                memoized wiring of data into the analysis engine
│   ├── readiness.ts              shared readiness helpers (levels, colors, status labels)
│   └── theme.ts                  light/dark hook with persistence
├── data/                         static demo data (extraction point for Supabase)
│   ├── organizations.ts          canonical 36-org registry, two tiers, 7 categories
│   ├── orgPacks.ts               11 function-specific packs
│   ├── orgCards.ts               aggregator over orgCardsTier1 / orgCardsTier2
│   ├── orgCardsTier1.ts          12 rich organization cards (full 13 sections)
│   ├── orgCardsTier2.ts          24 catalog organization cards
│   ├── orgDependencies.ts        cross-org dependencies (health / strength)
│   ├── orgNeedsOffers.ts         OrgNeed + OrgOffer (first-class)
│   ├── successAgreements.ts      14 Success Agreements + sections
│   ├── meetingFit.ts             8 organization-first meetings + fit briefs
│   ├── collaborationMap.ts       collaboration map edges
│   ├── roleCards.ts              role cards + person→organization mapping
│   ├── people.ts                 people + nested individual work cards
│   ├── cardSections.ts           individual-card section definitions (nested context)
│   └── enterprise.ts             enterprise tenant record
├── components/
│   ├── Icons.tsx                 inline SVG icon set
│   ├── Shared.tsx                Avatar, Bar, Ring, ReadinessMeter, StatusPill, FreshnessBadge
│   ├── Org.tsx                   organization-first panels, badges, preview cards
│   ├── Sidebar.tsx               7-item primary nav
│   └── TopBar.tsx                enterprise crumb, freshness, search, theme toggle
└── views/                        Home, OrganizationCards, OrganizationCardDetail, CollaborationMap,
                                  SuccessAgreements, SuccessAgreementDetail, MeetingFit,
                                  MeetingFitDetail, OrgInsights, Admin
```

## Where to take it next (Phase 2)

The files in `src/data/` are the extraction point for Supabase — each maps cleanly to one or two tables. See `docs/OBJECT_MODEL_LOCK.md`. Integration layer next: Slack / Teams for nudges, Calendar / Outlook for meeting context, HRIS for membership freshness. Until then: static demo only — no Supabase, no auth, no router.

## Documentation

The `docs/` directory contains the v3 lock set:

- `PRODUCT_SPINE.md` — positioning, the v3 spine, the nine product questions.
- `ORGANIZATION_FIRST_MODEL.md` — organization-as-primary, nav, forbidden directions.
- `ORG_CARD_SCHEMA.md` — the 13-section card schema and tier model.
- `ORG_SUCCESS_ANALYSIS.md` — the 11 success dimensions.
- `CROSS_ORG_SUCCESS_ANALYSIS.md` — the mutual-success engine.
- `SUCCESS_AGREEMENTS.md` — six-state lifecycle and section architecture.
- `MEETING_FIT_ENGINE.md` — org-first meeting fit + the meeting-prep survival rule.
- `COLLABORATION_MAP.md` — the four map modes.
- `ORG_INSIGHTS_GUARDRAILS.md` — aggregate-only guardrails and org badges.
- `ADMIN_ORG_PACKS.md` — Admin sections and the 11 packs.
- `OBJECT_MODEL_LOCK.md` — object model + Supabase extraction path.
- `PRIVACY_GOVERNANCE_LOCK.md` — hard boundaries on personnel decisions.
- `BUILD_NOTES.md` — stack, scripts, data layout.

## License

Private prototype. Not for redistribution.
