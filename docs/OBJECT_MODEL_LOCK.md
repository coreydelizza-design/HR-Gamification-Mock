# Object Model — Lock

The Fieldguide data model is **shaped for Supabase extraction from day one**, even though Phase 1 is static. Identifiers are string slugs that will become UUIDs; timestamps are ISO strings; foreign keys are named `*Id`.

## First-class objects

Every object below is defined in `src/lib/types.ts` and demoed in `src/data/`.

| Object              | Phase 1 file                  | Future table             |
|---------------------|-------------------------------|---------------------------|
| `Enterprise`        | `data/enterprise.ts`          | `enterprises`             |
| `Organization`      | `data/enterprise.ts`          | `organizations`           |
| `OrgPack`           | `data/enterprise.ts`          | `org_packs`               |
| `Team`              | `data/teams.ts`               | `teams`                   |
| `Person`            | `data/people.ts`              | `people`                  |
| `TeamMembership`    | `data/people.ts`              | `team_memberships`        |
| `WorkCard`          | `data/people.ts`              | `work_cards`              |
| `TeamCard`          | `data/teams.ts`               | `team_cards`              |
| `CardSection`       | `data/cardSections.ts`        | `card_sections`           |
| `CardAnswer`        | `data/people.ts`, `data/teams.ts` | `card_answers`        |
| `VisibilityRule`    | (in `CardAnswer.visibility`)  | `visibility_rules`        |
| `Meeting`           | `data/meetings.ts`            | `meetings`                |
| `MeetingAttendee`   | `data/meetings.ts`            | `meeting_attendees`       |
| `MeetingFitBrief`   | `data/meetings.ts`            | `meeting_fit_briefs`      |
| `CollaborationNeed` | `data/agreements.ts`          | `collaboration_needs`     |
| `CollaborationOffer`| `data/agreements.ts`          | `collaboration_offers`    |
| `Dependency`        | `data/agreements.ts`          | `dependencies`            |
| `WorkingAgreement`  | `data/agreements.ts`          | `working_agreements`      |
| `AgreementSection`  | `data/agreements.ts`          | `agreement_sections`      |
| `ImpactLink`        | (planned: `data/impact.ts`)   | `impact_links`            |
| `Mission`           | (planned: `data/impact.ts`)   | `missions`                |
| `Badge`             | `data/badges.ts`              | `badges`                  |
| `Nudge`             | `data/orgInsights.ts`         | `nudges`                  |
| `FreshnessSignal`   | `data/orgInsights.ts`         | `freshness_signals`       |
| `ConsentRecord`     | `data/admin.ts`               | `consent_records`         |
| `AuditLog`          | `data/admin.ts`               | `audit_logs`              |

## Modeling rules

- **Working style is not a central object.** Visual variety on avatars uses `visualKey: 'a' | 'b' | 'c' | 'd'` with no personality claim attached.
- **No individual scoring tables.** Readiness is computed, returned as `ReadinessSummary`, and never persisted as a per-person rank.
- **Per-section visibility lives on `CardAnswer.visibility`.** Card-level `visibility` is the default; a section may scope tighter.
- **Working agreements are bi-directional and section-keyed.** `team_a_needs` and `team_b_needs` are separate sections so each side is explicit.
- **Meetings reference both Person and Team context.** `MeetingFitBrief.requiredInputs[].teamId` ties prep to the team that owes it.

## Extension policy

New interfaces are welcome **only if** the spine demands them. Do not extend types for cosmetic UI state — use local component state for that.
