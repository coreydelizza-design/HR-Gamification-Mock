# Org Insights & Guardrails — Lock

Org Insights is the aggregate organizational-clarity screen. It is **aggregate-only**. This doc also folds in the v2 gamification guardrails.

## Aggregate-only rule

- Org Insights aggregates only. **No individual is ever named** on an Org Insights surface (except as the actor in an audit log, per `PRIVACY_GOVERNANCE_LOCK.md`).
- **No surface compares two named employees** against each other on any metric.
- Any matrix counts cards / orgs, not people, and frames buckets as **states**, not labels for individuals.

## Questions it answers

- Which orgs are unclear about what they own?
- Which orgs have stale cards?
- Which relationships lack agreements?
- Which handoffs are at risk?
- Which meetings are not ready?
- Which orgs need to define required inputs?
- Which orgs are helping others succeed well?
- Where is the operating model unclear?

It surfaces: org-card coverage, freshness mix, missing success models, missing required-input guidance, missing handoff checklists, missing decision rights, stale agreements, agreement coverage by org, meeting-fit trends, dependency risk, cross-org friction themes (org-level), highest-risk handoffs, nudges by organization, and org-pack adoption. All values come from the deterministic analysis engines.

## FORBIDDEN on every insight surface

- Any **individual** metric, ranking, friction score, or comparison.
- Any **personality**, culture-fit, or working-style label applied to a person.
- Any **performance** label or personnel-action signal.
- Any **surveillance** framing.

`OrgNudge` messages are advisory, org-level, and never punitive.

## Gamification guardrails (folded from GAMIFICATION_LOCK)

Badges recognize **collaboration readiness, not performance**. They are awarded to **organizations** (and occasionally teams) — `OrgBadge.awardedTo: 'organization' | 'team'`, keyed by `awardedToOrgId`. **Never** to a person, and never used to compare people.

Each `OrgBadge` carries an explainable, non-punitive `awardedReason`. Citing one inside a personnel-action document must be obviously inappropriate.

### The 10 org badges (`OrgBadgeKey`)

```
org_card_published        Org Card Published
success_model_complete    Success Model Complete
inputs_defined            Inputs Defined
handoff_ready             Handoff Ready
agreement_verified        Agreement Verified
fresh_this_quarter        Fresh This Quarter
decision_rights_clear     Decision Rights Clear
escalation_path_clear     Escalation Path Clear
partner_org_ready         Partner Org Ready
meeting_fit_ready         Meeting Fit Ready
```

Badge language is configured per pack (`OrgPack.badgeLanguage`), so the labels are white-labelable but the awarding subject (org/team) is fixed.

## Commercial data (v3.5)

Commercial structure (revenue role, targets, attainment, headcount, cost
center) attaches to **organizations only**, via `OrganizationCard.commercial`.

Forbidden, grep-verifiable: no target, quota, attainment, or revenue field on
any `Person` / `RoleCard` / `IndividualWorkCard`. The "Commercial clarity" stat
("your revenue engine's operating model is X% clear") is computed from
**organization-level readiness** of revenue-responsible orgs (P&L owners +
revenue-generating) — never from individual attainment. Attainment bars show an
organization's target progress with no person attribution. The People & role
cards section of any Organization Card explicitly carries no commercial data.

## v3.5b — Delegation economics are org-level only

The Proxy capability adds meeting economics and an Opportunity headline (annual
meeting spend vs. recoverable, by driver: informational attendance, duplicate
meetings, async-eligible status meetings, agreement-gap escalations). These
**aggregate at the organization / relationship level only**.

Hard rule: **no individual delegation metric exists anywhere** — no "skipped
meetings" count, no per-person delegation rate, no per-person cost. Rates attach
to **role bands (seats), never to a named person**; no individual compensation is
stored, displayed, or implied (Shopify precedent). The only per-person state is a
person's own current attendance mode for a meeting, which they alone control. All
figures are estimates for decision-making, never payroll. See
`docs/AGENT_REPRESENTATION_LOCK.md`.
