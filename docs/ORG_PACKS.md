# Org Packs

An **Org Pack** is the enterprise configuration bundle applied to an Organization. It defines required card sections, team templates, meeting-fit rules, visibility defaults, badge language, nudge cadence, and retention.

Defined in `src/lib/types.ts` as `OrgPack`. Seeded packs live in `src/data/enterprise.ts`.

## What a pack controls

```ts
interface OrgPack {
  id: string;
  name: string;
  description: string;
  requiredCardSections: CardSectionKey[];
  optionalCardSections: CardSectionKey[];
  teamTemplate: string;
  meetingFitRules: MeetingFitRule[];
  visibilityDefault: VisibilityScope;
  badgeLanguage: BadgeLanguagePack;
  nudgeCadenceDays: number;
  dataRetentionDays: number;
}
```

## Seeded packs

1. **Standard Enterprise** (`pack-default`) — balanced config; required sections: `communication`, `decisions`, `meetings`. Visibility default: `org`. 14-day nudge cadence. 730-day retention.
2. **Regulated Industry** (`pack-regulated`) — adds `escalation` and `visibility` to required; tightens default visibility to `team`. 21-day cadence. 2555-day retention (7 years).
3. **Growth-Stage Startup** (`pack-startup`) — lightweight required sections. 7-day cadence. 365-day retention.

## Multi-organization mental model

- An **Enterprise** owns one or more **Organizations**.
- Each Organization is assigned an **OrgPack** via `Organization.orgPackId`.
- Packs are switchable in the Admin view (`views/Admin.tsx`) — packs preview their effect on required sections, visibility, cadence, retention, and meeting-fit rules.

## Editing packs (Phase 1 demo)

- Packs in the demo are read-only at runtime; the Admin UI lets you preview the impact of swapping packs.
- The `ACTIVE_ORG_PACK` is resolved at module load in `src/data/enterprise.ts`. Readiness math consumes `ACTIVE_ORG_PACK.requiredCardSections` to decide which sections gate `cardReadiness`.

## Future Supabase shape

- `org_packs` (one row per pack).
- `organizations.org_pack_id` foreign key.
- `org_pack_required_sections` (or jsonb on `org_packs`).
- `org_pack_meeting_fit_rules` (or jsonb).
- `org_pack_badge_language` (jsonb).
