# Organization Success Analysis — Lock

`analyzeOrganizationSuccess(...)` in `src/lib/orgAnalysis.ts` computes one organization's collaboration readiness. It returns an `OrgSuccessAnalysis`.

## Discipline (inherited from v2 `readiness.ts`)

- **Deterministic** — no randomness, no clock; only the records passed in.
- **Explainable** — every dimension carries a plain-language `rationale`.
- **Weights visible in code** — coverage counts and thresholds are inline, not hidden.
- **Nothing persisted or scored per person** — all friction is org/relationship level.

## Thresholds

```
READY  = 80   → level 'ready'    label "Clear"
ALMOST = 55   → level 'almost'   label "Developing"
< 55          → level 'attention' label "Needs attention"
(no card)     → may yield 0      label "Not started"
```

`bucket(pct)` (exported as `orgScoreBucket`) maps pct → `ReadinessLevel`. Each dimension is a `ReadinessSummary { level, pct, label, rationale }`.

## The 11 dimensions (exact, in order)

1. **Mission Clarity** — coverage of mission, missionCriticalOutcomes, successConditions, leadingIndicators, stakeholderOutcomes. No card ⇒ 40 if mission text exists, else 0.
2. **Ownership Clarity** — coverage of responsibilities, services, decisions, businessOutcomes, notOwned. Empty `notOwned` is called out as a friction source.
3. **Input Clarity** — share of `requiredInputs` that have format + timing + qualityBar. No inputs ⇒ 0 ("not documented").
4. **Output Clarity** — coverage of outputs, servicesOffered, serviceExpectations, bestWaysToEngage.
5. **Dependency Health** — share of this org's dependencies that are `healthy`. No deps ⇒ 50 (neutral). At-risk/blocked counted out.
6. **Handoff Readiness** — share of `handoffRules` with checklist + definitionOfDone + handoffOwner. No rules ⇒ 0 ("handoffs stall").
7. **Meeting Readiness** — share of this org's evaluated meetings that are `ready` or `decision_ready`. No fits ⇒ 50 (neutral).
8. **Decision Clarity** — coverage of engagement.decisionRights, engagement.approvalRights, decisions.
9. **Escalation Clarity** — 100 if `engagement.escalationPath` is non-empty, else 0.
10. **Freshness** — from `org.freshness`: fresh 100 · aging 60 · stale 25 · unpublished 0.
11. **Agreement Coverage** — share of this org's agreements that are `published`. No agreements ⇒ 0; flags any `needs_refresh`.

## Score

`successReadinessScore` = `Math.round(mean of the 11 dimension pcts)`. `scoreRationale` reports how many dimensions are clear vs. need attention. `level` = `bucket(score)`.

## Outputs (`OrgSuccessAnalysis`)

- `successReadinessScore` (0–100) + `scoreRationale` + `level`.
- `dimensions` — the 11 `OrgDimension` summaries above.
- `topEnablers` — top 3 dimensions ≥ ALMOST, with rationale.
- `topRisks` — bottom 3 dimensions < READY, with rationale.
- `helpNeededFrom: OrgHelpLink[]` — from open/gap needs + non-healthy upstream dependencies (which orgs can help most).
- `helpOfferedTo: OrgHelpLink[]` — from active offers + downstream dependencies (which orgs this org most helps).
- `nextBestActions` — concrete strings (≤6), e.g. "Publish an escalation path…", "Add at least one handoff checklist…", "Refresh the agreement '…'", plus the card's own `nextBestActions`.

## Boundaries

All outputs are org-level. No individual is scored, named, or ranked. This engine drives Home rollups, Org Insights, and the Map's mutual-success mode.
