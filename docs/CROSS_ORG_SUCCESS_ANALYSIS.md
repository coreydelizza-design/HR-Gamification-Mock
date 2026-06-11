# Cross-Org Success Analysis — Lock

`analyzeCrossOrgSuccess(orgA, orgB, ...)` in `src/lib/orgAnalysis.ts` evaluates the relationship between **two organizations**. It returns a `CrossOrgSuccessAnalysis`.

Same discipline as `analyzeOrganizationSuccess`: deterministic, explainable, weights in code, nothing per person.

## Inputs

`orgA`, `orgB`, all `OrgDependency[]`, all `SuccessAgreement[]`, all `SuccessAgreementSection[]`, all `OrgNeed[]`, all `OrgOffer[]`, `cardA`/`cardB` (may be undefined), `OrgMeeting[]`, `OrgMeetingFit[]`.

## Outputs (`CrossOrgSuccessAnalysis`)

- **`mutualSummary`** — plain English: what A relies on B for, what B relies on A for, and the governing agreement + status (or "no agreement yet").
- **`aNeedsFromB` / `bNeedsFromA`** — from `OrgNeed` records in each direction, plus the `requiredInput` of directional dependencies.
- **`aHelpsB` / `bHelpsA`** — from `OrgOffer` records in each direction, plus the `outputProvided` of dependencies.
- **`sharedOutcomes`** — the agreement's `sharedBusinessOutcome` if one exists, else an inferred clean-handoff statement.
- **`frictionPoints`** — **org-level only, never a person.** Sources:
  - at-risk / blocked dependencies between the pair ("Blocked dependency: …" / "At-risk dependency: …");
  - `OrgNeed` records with `status === 'gap'` ("Uncovered need: …");
  - no governing agreement, or a governing agreement in `needs_refresh`;
  - either org has not published its card.
  Examples of acceptable friction language: "missing intake details", "unclear decision owner", "late engagement", "stale agreement".
- **`recommendedClauses: SuccessAgreementClause[]`** — gap → clause. A missing agreement-section key produces a clause `{ forGap, recommendation, rationale }`:
  - no `required_inputs` section (and needs exist) → document inputs with format/timing/quality bar;
  - no `handoff_checklist` → define a shared definition of ready/done;
  - no `escalation_path` → name who to escalate to, and when, on both sides;
  - no `decision_rights` → clarify which org owns which decision at the boundary.
- **`meetingGuidance`** — based on tracked pair meetings: none tracked → suggest a short cadence with a named decision owner; an at-risk fit → close missing inputs first; otherwise on track.
- **`nextBestActions`** — add the recommended clauses to the pair's agreement, repair non-healthy dependencies, and draft an agreement if none exists.

## Boundaries

Every friction point and action names organizations, never individuals. No individual ranking or comparison is produced or persisted. This engine powers the Collaboration Map's **Mutual success** mode, the Success Agreements detail, and Home's critical-relationships card.
