# Object Model — Lock

The v3 data model is **shaped for Supabase extraction from day one**, even though Phase 1 is static. Same discipline as v2: string IDs (UUID-ready slugs), foreign keys named `*Id`, ISO-string timestamps, references-by-ID (no nested-only objects on first-class records).

Source of truth: `src/lib/types.ts`. The v3 organization-first block lives at the bottom of that file.

## Core objects → future tables

| Object (`types.ts`)        | Phase 1 file                  | Future table                  |
|----------------------------|-------------------------------|-------------------------------|
| `Enterprise`               | `data/enterprise.ts`          | `enterprises`                 |
| `Organization`             | `data/organizations.ts`       | `organizations`               |
| `OrganizationCard`         | `data/orgCards*.ts`           | `organization_cards`          |
| `OrgDependency`            | `data/orgDependencies.ts`     | `org_dependencies`            |
| `OrgNeed`                  | `data/orgNeedsOffers.ts`      | `org_needs`                   |
| `OrgOffer`                 | `data/orgNeedsOffers.ts`      | `org_offers`                  |
| `SuccessAgreement`         | `data/successAgreements.ts`   | `success_agreements`          |
| `SuccessAgreementSection`  | `data/successAgreements.ts`   | `success_agreement_sections`  |
| `OrgMeeting`               | `data/meetingFit.ts`          | `org_meetings`                |
| `OrgMeetingFit`            | `data/meetingFit.ts`          | `org_meeting_fits`            |
| `CollabEdge`               | `data/collaborationMap.ts`    | `collab_edges`                |
| `RoleCard`                 | `data/roleCards.ts`           | `role_cards`                  |
| `Person` / `IndividualWorkCard` (`WorkCard`) | `data/people.ts`, `data/individualWorkCards.ts` | `people` / `individual_work_cards` |
| `OrgPack`                  | `data/orgPacks.ts`            | `org_packs`                   |
| `OrgInsight` / `OrgNudge`  | `data/orgInsights.ts`         | `org_insights` / `org_nudges` |
| `OrgBadge`                 | `data/badges.ts`              | `org_badges`                  |
| `ConsentRecord` / `AuditLog` | `data/admin.ts`             | `consent_records` / `audit_logs` |

Each data file exports an array plus a `*_BY_ID` lookup map (v2 convention).

## Modeling rules

- **Organization is the primary record.** `OrganizationCard` carries the prose sections (flattened as `string`/`string[]`); sections 1/6/10/11/13 are joined from `Organization`, `OrgDependency`, `SuccessAgreement`, `RoleCard`/`Person`, and freshness (see `ORG_CARD_SCHEMA.md`).
- **Needs / offers / dependencies are first-class** — `OrgNeed`, `OrgOffer`, `OrgDependency` with `strength` and `health` enums, referenced by ID.
- **Agreements are bi-directional and section-keyed** — `a_needs_from_b` and `b_needs_from_a` are separate `SuccessAgreementSection` rows.
- **Individual records are demoted, not deleted.** `Person`, `RoleCard`, `IndividualWorkCard` persist as nested context, reachable only via org or meeting detail.
- **No individual scoring tables.** Readiness/analysis is computed and returned (`ReadinessSummary`, `OrgSuccessAnalysis`, `CrossOrgSuccessAnalysis`); never persisted as a per-person rank.
- **Visual variety only.** `visualKey: 'a'|'b'|'c'|'d'` tints avatars and carries no personality claim.

## Supabase extraction path

1. Apply a schema mirroring the table column above; slugs become UUIDs.
2. Replace each `data/*.ts` export with a query from its table.
3. Add an auth layer; resolve the current user from the session, not a hardcoded ID.

Until then: static demo only. No Supabase, no auth, no backend, no new runtime dependencies.

## Extension policy

New interfaces are welcome **only if** the spine demands them. Do not extend types for cosmetic UI state — use local component state. Never add a type that ranks or compares named individuals.
