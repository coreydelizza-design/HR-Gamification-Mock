# Success Agreements — Lock

Success Agreements (v2 "Working Agreements", renamed and reframed org-first) are the working documents that govern an organization-to-organization relationship. They are the **second** product object after the Organization Card.

Source of truth: `SuccessAgreement`, `SuccessAgreementSection`, `SuccessAgreementClause`, `AgreementStatus` in `src/lib/types.ts`.

## Six-state lifecycle (verbatim from v2)

```
draft          — being written by one side
shared         — sent to the partner org
mutual_review  — both orgs reviewing
published      — active and agreed
needs_refresh  — past review cadence; content may be stale
archived       — superseded / no longer in force
```

`AgreementStatus` is the single enum; it is reused by the agreement layer (and shared in spirit with meeting-fit naming, but those are distinct enums).

## Record shape

`SuccessAgreement`: `title`, `orgIds[]` (participating organizations), `status`, `sharedBusinessOutcome`, `reviewCadenceDays`, `nextReviewAt`, `lastUpdatedAt`, `ownerByOrg` (orgId → owner name), `freshness`.

## Section-key architecture

Each agreement is composed of `SuccessAgreementSection` records keyed by `SuccessAgreementSectionKey`:

```
shared_business_outcome   a_needs_from_b        b_needs_from_a
required_inputs           required_outputs      handoff_checklist
decision_rights           approval_rights       meeting_norms
escalation_path           common_failure_modes  service_expectations
review_cadence
```

`a_needs_from_b` and `b_needs_from_a` are **separate sections** so each side is explicit. Missing section keys are exactly what `analyzeCrossOrgSuccess` turns into recommended clauses (see `CROSS_ORG_SUCCESS_ANALYSIS.md`).

## Seeded agreements (~14)

Spanning: Sales↔Legal · Sales↔Solution Architecture · Product↔Engineering · Engineering↔Platform Engineering · CS↔Support · CS↔Product · HR↔Finance · PMO↔Engineering · Security↔IT Operations · Data&AI↔Business Operations · Procurement↔Legal · Marketing↔Sales · RevOps↔Sales · Professional Services↔CS. Statuses are mixed realistically.

## View

Browse; filter by status and by organization; surface `needs_refresh`. Each detail shows the mutual success summary, missing clauses, and recommended next actions from `analyzeCrossOrgSuccess`.

## Tone

**Working document, not legal contract.** Plain operating language. No clauses framed as liability, no contract boilerplate, no personnel-action language.

## Boundaries

Agreements are between organizations (`orgIds`), owned per-org by name (`ownerByOrg`) for accountability only — never to rank or compare the named owners.
