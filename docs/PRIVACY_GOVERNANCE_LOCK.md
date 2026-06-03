# Privacy & Governance — Lock

Fieldguide is **not** a system of record for hiring, firing, promotion, compensation, discipline, or performance decisions. This boundary is a product-level non-negotiable, not a settings toggle.

## Hard product boundaries

The system must not be used to:

- Inform a hiring decision.
- Inform a termination decision.
- Inform a promotion or compensation decision.
- Inform a disciplinary action.
- Inform a performance review.

Every label, badge, and metric is designed so that **citing it inside a personnel-action document would be obviously inappropriate**.

## Visibility model

Visibility is a property of cards and individual sections.

```
private      → only the author can see it
team         → the author's primary team
partners     → declared partner teams + the author's team
org          → everyone in the Organization
```

- Per-section visibility lives on `CardAnswer.visibility`. Absent ⇒ inherits the card's `visibility`.
- Org defaults are set by the Org Pack (`OrgPack.visibilityDefault`).
- "Preview as teammate" mode in `MyFieldguide` re-renders the card under the viewer's scope, hiding sections that fall outside it. The data is hidden, not deleted.

## Consent

- `ConsentRecord` captures publish events, scope changes, and integration syncs.
- Consent is per scope (`card_publish`, `org_visibility`, `partner_visibility`, `integration_sync`).
- Consent is versioned (`version: 'policy-vX'`).
- Revocation re-renders the card under the revoked scope on next read.

## Audit

- `AuditLog` records actor, action, subject, timestamp, and a short diff summary.
- Audit retention is governed by `OrgPack.dataRetentionDays`.

## Org Insights guardrails

- Org Insights aggregates only.
- No individual is named on an Org Insights surface (except as the actor in audit logs).
- No surface compares two named employees against each other on any readiness metric.
- The Engagement Matrix counts cards, not people, and frames the four buckets as **states**, not labels for individuals.
