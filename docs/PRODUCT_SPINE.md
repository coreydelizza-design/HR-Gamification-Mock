# Product Spine — Lock

Fieldguide v3 is an **organization-first collaboration-readiness platform**.

> Org charts show reporting structure. Fieldguide shows working structure.

## The spine

The product is one spine. Every surface sits on it; nothing is added off-spine.

```
Enterprise
  → Organization Catalog
    → Organization Card
      → Organization Success Model
        → Cross-Org Needs / Offers
          → Success Agreements
            → Meeting Fit
              → Collaboration Map
                → Org Intelligence
```

Individual nesting (supporting context only):

```
Enterprise → Organization → Team → Role → Individual Work Card
```

## What each link is

- **Enterprise** — the tenant root. One instance, one operating model.
- **Organization Catalog** — 36 organizations, two tiers, searchable/filterable by name, category, and readiness.
- **Organization Card** — the primary product object: a 13-section working profile of one organization.
- **Organization Success Model** — `analyzeOrganizationSuccess`: 11 explainable dimensions → a readiness score, enablers, risks, next actions.
- **Cross-Org Needs / Offers** — first-class `OrgNeed` / `OrgOffer` / `OrgDependency` records connecting organizations.
- **Success Agreements** — six-state working documents governing an org-to-org relationship.
- **Meeting Fit** — org-first meeting-readiness evaluation; attendee context nested inline.
- **Collaboration Map** — CSS-only relationship map across four modes.
- **Org Intelligence** — aggregate-only clarity insights for the enterprise operating model.

## The 9 questions the product answers

The product answers these, and only these:

1. How does this organization succeed?
2. What does this organization own?
3. What does this organization need from others?
4. How does this organization help others succeed?
5. How should another organization engage this one?
6. What handoffs are at risk?
7. What Success Agreements govern this relationship?
8. Is this cross-org meeting ready?
9. Where is the enterprise operating model unclear?

## Non-negotiables (carried by every doc)

- **Organization-first.** `OrganizationCard` is the primary object; `SuccessAgreement` second; `OrgMeetingFit` third.
- **Individual cards are nested context only.** Reachable in ≤1 click from an org or a meeting; never a top-level nav route.
- **Aggregate-only analytics.** No individual metric, ranking, friction score, or comparison of two named people — anywhere, including data shapes.
- **Deterministic + explainable scoring.** Every score carries a plain-language rationale. No black-box scoring.
- **No personnel-action framing.** No hiring/firing/promotion/comp/performance/discipline language (see `PRIVACY_GOVERNANCE_LOCK.md`).
- **Static demo data only.** No Supabase, no auth, no router, no new runtime dependencies.
- **Light/dark + white-label variables preserved.**

## Forbidden product directions

Not a personality tool, not a quiz, not a leaderboard, not an HR engagement dashboard, not a meeting-summary tool, not a surveillance system.
