# Organization Card Schema — Lock

The Organization Card is the primary object. It has **13 sections**, rendered via reusable panel components — never one-off per-org screens.

Source of truth: `OrganizationCard`, `Organization`, and the sub-structures in `src/lib/types.ts`.

## Derived vs. carried

- **Sections 1, 6, 10, 11, 13 are derived / joined** from other records — they are *not* fields on `OrganizationCard`.
- **Sections 2, 3, 4, 5, 7, 8, 9, 12 are carried** on `OrganizationCard` (prose flattened to `string` / `string[]`).

## The 13 sections

1. **Overview** *(derived from `Organization`)* — name, category, parentOrgId, executiveOwner, operatingOwner, mission, freshness, orgPackId, memberCount, partnerOrgIds, readiness status (computed).
2. **How This Organization Succeeds** *(carried)* — `missionCriticalOutcomes`, `successConditions`, `leadingIndicators`, `laggingIndicators`, `operatingMetrics: OrgMetric[]`, `capacitySignals`, `qualitySignals`, `riskSignals`, `stakeholderOutcomes`, `maturityLevel: OrgMaturity`, `currentBlockers`, `nextBestActions`.
3. **What This Organization Owns** *(carried)* — `responsibilities`, `services`, `systems`, `decisions`, `processes`, `businessOutcomes`, `artifactsProduced`, `governanceAreas`, `notOwned` (explicit non-ownership).
4. **What This Organization Needs From Others** *(carried)* — `requiredInputs: RequiredInput[]` (input, fromOrgId, format, timing, qualityBar), `missingInputFailureModes`, `escalationTriggers`, `commonMisconceptions`, `reworkCauses`, `delayCauses`.
5. **How This Organization Helps Others Succeed** *(carried)* — `outputs`, `servicesOffered`, `expertise`, `decisionSupport`, `enablement`, `riskReduction`, `acceleration`, `advisoryRole`, `reusableArtifacts`, `serviceExpectations` (SLEs), `bestWaysToEngage`.
6. **Cross-Org Dependencies** *(derived from `OrgDependency`)* — fromOrgId/toOrgId, strength (`critical|strong|moderate|weak`), health (`healthy|at_risk|blocked|unknown`), requiredInput, outputProvided, risk, gaps, owner, reviewCadence, governingAgreementId.
7. **Engagement Model** *(carried — `EngagementModel`)* — howToEngage, intakeProcess, intakeFields, contactChannel, responseRhythm, officeHours, cadenceStyle (`async_first|meeting_first|balanced`), escalationPath, decisionRights, approvalRights.
8. **Meeting Norms** *(carried — `OrgMeetingNorms`)* — includeWhen, doNotIncludeWhen, requiredPreRead, requiredAgenda, requiredDecisionOwner, preferredLength, preferredCadence, asyncAlternatives, recurringRules.
9. **Handoff Rules** *(carried — `HandoffRule[]`)* — checklist, definitionOfReady, definitionOfDone, requiredApprovals, requiredArtifacts, handoffOwner, receivingOrgId, failureModes, recoveryPath.
10. **Success Agreements** *(derived from `SuccessAgreement`)* — active / draft / needs-refresh agreements, partner orgs, readiness, next review.
11. **People and Role Cards** *(derived from `RoleCard` / `Person` / `IndividualWorkCard`)* — org leader, team leads, role cards, nested individual work cards, SME tags. **Subordinate section — render compact, never dominant.**
12. **Risks and Blockers** *(carried — `OrgRisk[]`)* — kind (`operational|dependency|capacity|decision|handoff|meeting|stakeholder|stale_knowledge`), description, severity, mitigation.
13. **Freshness and Governance** *(derived)* — card owner, lastReviewedAt, nextReviewAt, stale/missing sections, visibility, audit placeholder.

Section keys (`OrgCardSectionKey`): `overview`, `how_succeeds`, `what_owns`, `what_needs`, `how_helps`, `dependencies`, `engagement`, `meeting_norms`, `handoff_rules`, `agreements`, `people`, `risks`, `freshness`.

## Two tiers

- **Tier 1 — 12 rich cards** (full 13-section content): Enterprise Architecture, Operations, People Operations, Sales, Customer Success, Program Management, Product Management, Engineering, Finance, Legal, Security, Data & AI.
- **Tier 2 — 24 catalog cards** (name, category, mission, executive owner, 3–5 items each for owns/needs/helps, partner org IDs, freshness, readiness).

The catalog is searchable (by name) and filterable (by category and readiness). Tier-2 detail views are **structurally identical** to Tier 1 — they render the fields they have and show "section not yet published" placeholders for the rest.

## The `publishedSections` honesty mechanism

`OrganizationCard.publishedSections: OrgCardSectionKey[]` lists which of the 13 keys actually have content. A section absent from `publishedSections` renders as an honest "not yet published" placeholder, not as fabricated content. Tier-2 cards publish fewer sections — honest about depth, structurally identical to Tier 1.

Content style: specific, operational, no fluff (e.g. Enterprise Architecture: "architecture patterns are adopted before delivery starts"; Legal: "accelerating reviews when intake is complete").

## Commercial profile (v3.5)

`OrganizationCard.commercial?: OrgCommercialProfile` carries the organization's
commercial structure. **It is ORGANIZATION-LEVEL ONLY.**

Fields: `revenueRole` (pl_owner | revenue_generating | revenue_influencing |
enablement | shared_service | cost_center), `fiscalYear`, `targets[]`
({metric, amount, currency, attainmentPct?} — metric ∈ revenue | bookings |
renewals | pipeline | nrr | cost_savings), `budgetOwnerPersonId?` (a budget
owner reference, never a target owner), `headcount?`, `costCenterCode?`,
`keyCommercialMetrics[]` (metric *names*, not per-person numbers).

LOCK: there are **no** targets, quotas, attainment, or revenue metrics on any
`Person`, `RoleCard`, or `IndividualWorkCard` type — by design and by data
shape. Attainment displays carry no person linkage. Commercial fields feed only
organization-level rollups (catalog filter, Org Insights "Commercial clarity",
Home "Revenue-engine clarity"), each with a visible rationale. See
docs/ORG_INSIGHTS_GUARDRAILS.md.
