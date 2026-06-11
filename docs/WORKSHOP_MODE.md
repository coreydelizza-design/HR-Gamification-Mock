# Workshop Mode (v3.5)

Fieldguide runs as an **interactive workshop instrument** with no backend: a
consultant can sit with a client, edit and create Organization Cards live,
capture commercial structure, save the session, and reload it later. State is
local-only (in-memory + `localStorage`) plus JSON export/import.

The edit surface built here is the Phase 4 (Supabase) **write surface**
unchanged — only the storage target changes later.

## Running a session

1. **Admin → Workshop → Enterprise name**: rename the enterprise so the client's
   name is on the masthead (TopBar).
2. **New organization** (catalog header, Admin → Workshop, or Admin → Org
   Catalog): a 3-step wizard — basics (name, category, parent, revenue role,
   pack) → mission + owners (free-text client names are fine) → quick-start
   chips (owns / needs / helps). Finish lands on the new card in **edit mode**.
3. **Edit any card**: the Edit toggle on an Organization Card reveals a pencil on
   every section. Each section opens a structured editor (selects / chips /
   entity pickers) with per-section Save/Cancel. Saving recomputes readiness
   live — watch the score move as sections fill in.
4. **Commercial profile**: edit revenue role, targets, headcount, and key
   metrics from the Overview section. Organization-level only.
5. **Export session**: Admin → Workshop → Export session downloads
   `fieldguide-session-{enterprise}-{date}.json` — the consulting deliverable.
6. **Import session** to resume, or **Restore** one of the last 3 local
   snapshots.

## What persists where

| Layer | Holds | Lifetime |
|---|---|---|
| In-memory `demoStore` | the live working state (orgs + cards + enterprise label) | the tab session |
| `localStorage: fieldguide:demo-state:v1` | the working state, debounced on every edit | survives refresh / browser restart |
| `localStorage: fieldguide:demo-snapshot:1..3` | up to 3 manual snapshots | until overwritten |
| Exported JSON file | a full `SessionFile` (state + schemaVersion + enterpriseLabel + exportedAt) | the deliverable / archive |

**Reset behavior**: Admin → Enterprise → *Reset demo data* (and Workshop reset)
clears `fieldguide:demo-state:v1` and reseeds from the static dataset. The
edited-state dot in the TopBar shows whether you are on clean or edited data.
On a `schemaVersion` mismatch the saved state is discarded and the static seed
reloads — so a shipped data change never corrupts a session.

Only Organizations and their Cards (+ enterprise label) are editable. The static
relationship data (dependencies, agreements, meetings, packs) is seed and is not
mutated by the workshop.

## Session JSON shape

```jsonc
{
  "schemaVersion": 1,
  "enterpriseLabel": "Acme Corporation",
  "organizations": [ /* Organization[] */ ],
  "orgCards":       [ /* OrganizationCard[] (with optional .commercial) */ ],
  "modified": true,
  "exportedAt": "2026-06-11T00:00:00.000Z"
}
```

## Supabase seed mapping (1:1)

The session JSON is structured to import straight into a real tenant later. Each
array maps onto one table; IDs and `*Id` foreign keys carry over unchanged
(string/uuid-ready), timestamps are ISO.

| Session JSON | Supabase table | Key columns |
|---|---|---|
| `enterpriseLabel` | `enterprises` (row) | `id`, `name` |
| `organizations[]` | `organizations` | `id`, `enterprise_id`, `name`, `category`, `tier`, `mission`, `executive_owner`, `operating_owner`, `parent_org_id`, `org_pack_id`, `member_count`, `partner_org_ids`, `freshness`, `last_reviewed_at`, `next_review_at`, `visibility` |
| `orgCards[]` | `organization_cards` | `id`, `org_id`, the flattened section arrays (or normalized child tables `org_card_sections`), `published_sections`, `last_updated_at` |
| `orgCards[].commercial` | `org_commercial_profiles` | `org_card_id`, `revenue_role`, `fiscal_year`, `headcount`, `cost_center_code`, `budget_owner_person_id` |
| `orgCards[].commercial.targets[]` | `org_commercial_targets` | `id`, `org_card_id`, `metric`, `amount`, `currency`, `attainment_pct` — **org-level only** |

The write mutators (`updateOrgCardSection`, `updateOrganization`,
`updateCommercialProfile`, `createOrganization`) are the seam: in Phase 4 their
bodies swap `localStorage` for Supabase `upsert` calls; the editor UI and the
session shape do not change.

**Guardrail carried into the seed**: there is no commercial, target, quota, or
attainment column on any person-level table. Commercial data attaches to
organizations only. See docs/ORG_INSIGHTS_GUARDRAILS.md and
docs/PRIVACY_GOVERNANCE_LOCK.md.
