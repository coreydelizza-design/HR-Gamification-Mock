# Working Agreements

Working Agreements are **the most strategically important module** in Fieldguide. They convert tacit cross-team norms into structured operating contracts that are visible, reviewable, and revisable.

## Object shape

```ts
interface WorkingAgreement {
  id: string;
  orgId: string;
  title: string;
  teamIds: string[];            // two or more teams party to the agreement
  status: AgreementStatus;
  reviewCadenceDays: number;
  nextReviewAt: string;
  lastUpdatedAt: string;
  authorPersonId: string;
}
```

## Status lifecycle

```
draft         — authored by one team, not yet shared
shared        — sent to the partner team for read
mutual_review — partner team is reviewing, edits expected
published     — both sides have signed off
needs_refresh — review cadence elapsed
archived      — superseded or no longer applicable
```

`agreementStatusLabel` and `agreementStatusLevel` in `lib/readiness.ts` map each status to a display label and a readiness level for the UI.

## Sections

Each agreement is composed of `AgreementSection` rows keyed by `AgreementSectionKey`:

- `team_a_needs` — what side A needs from side B.
- `team_b_needs` — what side B needs from side A.
- `required_inputs` — artifacts required for any commitment under the agreement.
- `handoff_checklist` — the explicit handoff steps.
- `meeting_norms` — how the two teams meet, when, with what pre-read.
- `escalation_path` — who and when.
- `decision_rights` — what each side owns.
- `common_failure_points` — the patterns that have hurt the handoff historically.
- `review_cadence` — review frequency.
- `success_signals` — what improvement looks like.

A complete agreement does not require every section, but `lib/readiness.ts#handoffReadiness` weighs `handoff_checklist`, `escalation_path`, `required_inputs`, and `review_cadence` as gating.

## UI surfaces

- **List**: `views/WorkingAgreements.tsx` — tabbed by status group (all, published, in-progress, needs refresh).
- **Detail**: `views/AgreementDetail.tsx` — full section grid, plus a readiness ring.
- **Home**: agreement coverage rollup and per-agreement chips.
- **Meeting Fit**: meetings can declare a `governingAgreementId` to surface the agreement that applies.

## Anti-patterns

- Don't auto-resolve disagreements. If two teams disagree on `team_a_needs`, the disagreement is the signal — the system surfaces it; the teams resolve it.
- Don't let an agreement be edited by a single side after publish. Editing moves the status back to `mutual_review`.
- Don't quietly archive — archiving must be authored.
