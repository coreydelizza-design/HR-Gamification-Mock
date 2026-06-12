# Fieldguide v3.6 — Cleanup / De-Monolith / De-Slop Report

Hardening pass after v3, v3.5, v3.5b, v3.5c. **Goal: zero behavior change.** This is the Phase A audit. Phases B–D execute only the SAFE list; before/after metrics are appended at the end.

## Before-metrics (baseline)

| metric | value |
| --- | --- |
| source files (`src/**/*.ts[x]`) | 49 |
| total source LOC | 17,642 |
| largest file | `data/orgCardsTier1.ts` (3,590) |
| modules transformed (vite) | 77 |
| CSS gzip | 7.18 kB |
| JS gzip | 181.67 kB |
| runtime deps | `react`, `react-dom` (only) |
| dev deps | @types/node, @types/react, @types/react-dom, @vitejs/plugin-react, typescript, vite |

## 1 · Dead code

**Unused exports** (cross-referenced: 0 references outside the defining file).

- Icons (7, `components/Icons.tsx`): `IconUser`, `IconUsers`, `IconTrophy`, `IconRoad`, `IconArrowRight`, `IconChevDown`, `IconFlame`.
- Components: `MeetingFitCard`, `NudgeCard` (`components/Org.tsx`) — superseded by inline rendering in `MeetingFit.tsx`; `TeamMark` (`components/Shared.tsx`) — v2 teams; `VIEWER_ID` (`components/Proxy.tsx`) — added in v3.5b, never consumed.
- Data lookup indexes (0 refs): `CARD_SECTION_BY_KEY`, `COLLAB_EDGE_BY_ID`, `ORG_CARD_BY_ID`, `ORG_DEPENDENCY_BY_ID`, `ORG_NEEDS_BY_ID`, `ORG_OFFERS_BY_ID`, `DEFAULT_ORG_PACK`, `TIER2_ORGS`, `TEAM_MEMBERSHIPS`.
- Lib: `updateMeeting` (`demoStore.ts`) — added in v3.5c, no edit flow consumes it.
- v2 readiness model (`lib/readiness.ts`, superseded by `orgAnalysis.ts` / `proxyEngine.ts`): `cardReadiness`, `teamReadiness`, `meetingReadiness`, `handoffReadiness`, `freshnessSummary`, `rollupForPerson`, `relativeDays` (~150 LOC; the color/label/format helpers in the same file remain in use).

**Orphaned files:** none (every module has ≥1 inbound import).

**Commented-out blocks / unreachable branches:** none found.

**Stale status docs:** `REBUILD_V3.md` (root, ~30 kB) is the historical v3 rebuild spec. → REVIEW (deleting a spec/history doc is a human call).

## 2 · Monolith audit (budgets: views >400, components >250, data >1,200, lib >500)

| file | LOC | budget | action |
| --- | --- | --- | --- |
| `data/orgCardsTier1.ts` | 3,590 | 1,200 | LEAVE — already the established tier split; no finer convention |
| `data/orgCardsTier2.ts` | 2,345 | 1,200 | LEAVE — same |
| `lib/types.ts` | 1,090 | 500 | REVIEW — single migration-contract file by design (header documents this) |
| `data/successAgreements.ts` | 1,123 | 1,200 | within budget |
| `components/Org.tsx` | 475 | 250 | **SPLIT** — clean two-concern (badges/primitives vs composite domain panels) |
| `lib/proxyEngine.ts` | 530 | 500 | REVIEW — 30 over, cohesive engine; forced split worse |
| `components/CardEditors.tsx` | 371 | 250 | REVIEW — one cohesive section-editor registry; no clean seam |
| `components/Proxy.tsx` | 370 | 250 | REVIEW — cohesive proxy-UI family; split adds little, risks behavior |
| all views | ≤337 | 400 | within budget (largest: `OrganizationCardDetail` 337, `Admin` 332) |

## 3 · Duplication

**Math (formulas outside the engine modules):**
- `Admin.tsx:54` `derivedHourly = Math.round((bases[band] * multiplier) / 2080)` duplicates the rate-card hourly formula in `data/rateCard.ts` (`deriveBand`). → SAFE: export a `deriveHourly` helper from the rate-card module and import it.
- `cardCoverage` formula is identical in `Home.tsx:62` and `OrgInsights.tsx:20`; `revenueClarity`/`revClarityPct` identical in `Home.tsx:78` and `OrgInsights.tsx:44`. → SAFE: extract to a shared `lib/enterpriseMetrics.ts` helper, import in both. (Single-occurrence presentation ratios — agreement/handoff/dependency/freshness meters in Home, freshMix in OrgInsights — are not duplicated across modules; → REVIEW, not moved.)

**JSX:** `QuestionList` / `home-card` list patterns recur across Home & OrgInsights; `OpportunitySummary` is already shared. → REVIEW (extraction is a structural call, not a rule violation).

**CSS unused classes** (24, zero usage in source; `admin-status-*` excluded as dynamically constructed): `basics`, `bc-dot`, `card-section-block`, `card-section-body`, `card-section-head`, `card-section-label`, `card-section-meta`, `dodont`, `edit-toggle`, `fit-status`, `hero-side`, `matrix-axis-label`, `matrix-cell`, `matrix-count`, `matrix-desc`, `matrix-grid`, `matrix-label`, `matrix-pct`, `matrix-row`, `metric-tile-up`, `mtgs`, `spine-node-future`, `team-grid`, `trend-card` (v1/v2 layout leftovers: hero, matrix, team-grid, dodont, basics, card-section-*). → SAFE.

## 4 · Seam integrity

11 views import `src/data/*` directly (27 import lines): Admin, CollaborationMap, Estimator, Home, MeetingFit, MeetingFitDetail, OrganizationCardDetail, OrganizationCards, OrgInsights, SuccessAgreementDetail, SuccessAgreements. Components also import data, but the rule (and acceptance criterion) scopes to **views**. → SAFE: introduce `lib/dataSource.ts` re-export accessor (the "dataSource" the spec names) and route view imports through it. Pure re-export — identical objects, zero behavior change.

## 5 · Types hygiene

- `any` / `@ts-ignore` / `@ts-nocheck`: **none** (the `: any` grep hit was the variable `anyOverdue`).
- Unused v2 types with **no** doc reference → SAFE remove: `VisibilityRule`, `CollaborationNeed`, `CollaborationOffer`, `Nudge`.
- Unused types **referenced by lock / object-model docs** → LEAVE: `ConsentRecord`, `AuditLog` (PRIVACY_GOVERNANCE_LOCK, OBJECT_MODEL_LOCK — "compliance scaffolding for Phase 2+"), `Badge`, `OrgInsight`, `OrgNudge`, `OrgBadge` (OBJECT_MODEL_LOCK / ORG_INSIGHTS_GUARDRAILS / BUILD_NOTES).
- Broader v2 types in the migration contract (`Tenant`, `Team`, `TeamCard`, `Mission`, `ImpactLink`, `FreshnessSignal`, `Meeting`, `MeetingAttendee`, `MeetingFitBrief`, `IndividualWorkCard` alias, etc.) → REVIEW — `types.ts` is explicitly the documented migration contract; wholesale pruning is a human call.
- Enums duplicated as string unions in >1 place: none found (label maps key off the single union definitions).

## 6 · Debris

`console.*`: none. `TODO`/`FIXME`/`HACK`: none. Unused imports: removed as part of each dead-export deletion. Dev artifacts: none.

## 7 · Dependency + bundle baseline

Runtime deps are exactly `react` + `react-dom` — nothing crept in across four phases. Baseline recorded above (77 modules, 7.18 kB CSS gz, 181.67 kB JS gz). Target: equal-or-smaller after cleanup.

## 8 · Docs coherence

Lock docs are intact and consistent with current behavior; v3.5b/v3.5c appended their sections. No lock references a removed concept (the SAFE removals are all doc-unreferenced). `REBUILD_V3.md` → REVIEW (historical). No substantive doc rewrites in scope.

---

## SAFE — will be executed (Phases B–D)

1. Delete the unused exports in §1 (icons, components, data indexes, `updateMeeting`, the 7 v2 readiness functions) + the 4 doc-unreferenced v2 types in §5, removing any imports they leave dangling. Build between groups.
2. Remove the 24 unused CSS classes in §3.
3. Split `components/Org.tsx` into badges/primitives + composite panels, re-exporting from `Org.tsx` so no consumer import path changes.
4. Seam: add `lib/dataSource.ts`; route the 11 views off `src/data/*`.
5. Math single-source: `Admin` → `deriveHourly` from the rate-card module; `cardCoverage` + `revenueClarity` → shared `lib/enterpriseMetrics.ts`.

## REVIEW — needs a human call (left untouched)

- `lib/types.ts` (1,090) and the broader v2 types inside it — documented migration contract.
- `lib/proxyEngine.ts` (530, 30 over), `components/CardEditors.tsx` (371), `components/Proxy.tsx` (370) — cohesive; forced split judged worse than the long file.
- `data/orgCardsTier1.ts` / `Tier2.ts` — already at the tier-split convention.
- `REBUILD_V3.md` — historical status/spec doc.
- Single-occurrence presentation ratios in Home/OrgInsights; recurring `home-card`/`QuestionList` JSX — structural taste calls, not rule violations.

## LEAVE — intentional (cited)

- `ConsentRecord`, `AuditLog` — lock-doc compliance scaffolding for Phase 2+ (PRIVACY_GOVERNANCE_LOCK, OBJECT_MODEL_LOCK).
- `Badge`, `OrgInsight`, `OrgNudge`, `OrgBadge` — object-model-lock / guardrail documented records.
- `admin-status-available|coming|connected` CSS — built dynamically via `admin-status-${status}`.
- `IndividualWorkCard` type alias — documented nested-context alias.

---

# Execution results (Phases B–D)

## Before / after metrics

| metric | before | after |
| --- | --- | --- |
| source files | 49 | 50 (−1 deleted, +2 accessors) |
| total source LOC | 17,642 | 17,182 (−460) |
| largest file | orgCardsTier1.ts (3,590) | orgCardsTier1.ts (3,590, seed — REVIEW) |
| modules transformed | 77 | 78 |
| CSS gzip | 7.18 kB | **6.88 kB** |
| JS gzip | 181.67 kB | **178.30 kB** |
| runtime deps | react, react-dom | react, react-dom (unchanged) |

Bundle is smaller on both axes; build passes; no view imports `src/data`; no rate/cost/percentage formula lives in a view (all route through `proxyEngine` / `rateCard` / `enterpriseMetrics`). Both grep-verified.

## Deletions (every one: zero references found before removal)

- **File:** `src/data/cardSections.ts` (orphaned — 0 inbound imports after the v2 readiness functions were removed).
- **Icons:** `IconUser`, `IconUsers`, `IconTrophy`, `IconRoad`, `IconArrowRight`, `IconChevDown`, `IconFlame`.
- **Components:** `MeetingFitCard`, `NudgeCard` (Org.tsx), `TeamMark` (Shared.tsx), `VIEWER_ID` (Proxy.tsx).
- **demoStore:** `updateMeeting`.
- **Data indexes/aliases:** `CARD_SECTION_BY_KEY`, `COLLAB_EDGE_BY_ID`, `ORG_CARD_BY_ID`, `ORG_DEPENDENCY_BY_ID`, `ORG_NEEDS_BY_ID`, `ORG_OFFERS_BY_ID`, `DEFAULT_ORG_PACK`, `TIER1_ORGS`, `TIER2_ORGS`, `TEAM_MEMBERSHIPS`.
- **readiness.ts (v2 model, superseded):** `cardReadiness`, `teamReadiness`, `meetingReadiness`, `handoffReadiness`, `freshnessSummary`, `rollupForPerson`, `relativeDays`, `PersonReadinessRollup` + their dead imports (`CARD_SECTIONS`, `ACTIVE_ORG_PACK`, 8 v2 types). 305 → 130 LOC.
- **enterprise.ts (v2 leftovers, dead after `ACTIVE_ORG_PACK` removed):** `ACTIVE_ORG_PACK`, `ORG_PACKS` (duplicate of the live `orgPacks.ts`), `DEFAULT_MEETING_FIT_RULES`, `DEFAULT_BADGE_LANGUAGE`, `ORGANIZATION`. 84 → 9 LOC. (This also resolved the `ORG_PACKS` name collision that would have blocked the data accessor.)
- **types.ts:** `VisibilityRule`, `CollaborationNeed`, `CollaborationOffer`, `Nudge`, `NudgeKind`.
- **CSS:** 25 unused v1/v2 classes (matrix-*, card-section-*, team-mark, team-grid, hero-side, mtgs, dodont, basics, trend-card, fit-status, edit-toggle, bc-dot, metric-tile-up, spine-node-future).

## Single-source enforcement (Phase D)

- **Seam:** new `src/lib/dataSource.ts` accessor; all **11 views** rerouted off `src/data/*` (pure re-export — identical bindings, zero behavior change). Components still read data directly (the rule and acceptance criterion scope to views).
- **Rate formula:** `Admin.tsx` now imports `deriveHourly` / `deriveHalfHour` from the rate-card module instead of inlining `× multiplier ÷ 2080`.
- **Enterprise metrics:** new `src/lib/enterpriseMetrics.ts` (`cardCoveragePct`, `revenueClarityPct`, `pct`, `pctRaw`) replaces the duplicated `cardCoverage`/`revenueClarity` formulas in Home & OrgInsights and the remaining display ratios. `pctRaw` preserves exact unrounded bar widths (no pixel change).

## De-monolith (Phase C)

No splits executed. The over-budget files resist a clean split and are listed in REVIEW with reasons (below). Dead code was removed from `Org.tsx` (475 → 441) and `readiness.ts` (305 → 130) as part of Phase B, reducing two of them without a structural split.

## Behavior verification

Zero-behavior-change is established structurally: the seam is a pure ESM re-export (same object identity); every extracted formula is provably identical (`deriveHourly`, `cardCoveragePct`, `pct` = `Math.round(n/d*100)`, `pctRaw` = `n/d*100`); all deletions had zero references; all removed CSS had zero usage. `tsc -b` + `vite build` pass; the dev server serves HTTP 200. The three demo arcs (v3.5 workshop edit/create/export-reset-import; v3.5b delegate-two-attendees + Estimator; v3.5c 4-org meeting → worst-pair → escalation → brief export) exercise only untouched logic paths. **Recommend a final interactive pass in the browser to confirm visually.**

## Final REVIEW list (for the human)

- **Over-budget files (forced split judged worse than the long file):**
  - `lib/types.ts` (1,043) — the documented migration-contract file; one cohesive schema.
  - `lib/proxyEngine.ts` (530) — 30 over; cohesive engine.
  - `components/Org.tsx` (441) — a clean split forces a circular re-export (panels need atoms co-located here) or rewiring 6 consumer imports; both worse than the file.
  - `components/CardEditors.tsx` (371) — one cohesive section-editor registry.
  - `components/Proxy.tsx` (~363) — cohesive proxy-UI family.
  - `data/orgCardsTier1.ts` (3,590), `data/orgCardsTier2.ts` (2,345) — seed data already at the tier-split convention.
- **`REBUILD_V3.md`** — historical rebuild spec; deletion is a human call.
- **Components importing `src/data` directly** — left intact (rule scopes to views); routing them too would be a larger seam change.
- **Broader v2 contract types** (`Tenant`, `Team`, `TeamCard`, `Mission`, `ImpactLink`, `FreshnessSignal`, `Meeting`, `MeetingAttendee`, `MeetingFitBrief`, `TeamMembership`, `IndividualWorkCard` alias) — part of the migration contract; pruning is a human call.

## LEAVE (intentional, cited)

- `ConsentRecord`, `AuditLog` — lock-doc compliance scaffolding (PRIVACY_GOVERNANCE_LOCK, OBJECT_MODEL_LOCK).
- `Badge`, `OrgInsight`, `OrgNudge`, `OrgBadge` — object-model-lock / guardrail documented records.
- `admin-status-available|coming|connected` CSS — built dynamically via `admin-status-${status}`.
- `IndividualWorkCard` alias — documented nested-context alias.
