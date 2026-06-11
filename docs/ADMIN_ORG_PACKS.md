# Admin & Org Packs — Lock

Admin manages the enterprise configuration. All of it is **demo-static** in Phase 1 — the UI is present, the data does not persist.

## Admin's six sections

1. **Enterprise Settings** — name, default template, freshness cadence, default visibility, review cadence.
2. **Organization Catalog management** — create / edit / set parent / set owner / assign pack / activate. UI present, demo-static.
3. **Org Card Templates** — default / required / optional sections per template.
4. **Org Packs** — the 11 function packs below.
5. **Visibility & Governance** — visibility scopes including manager-visible and private individual context; consent / audit / retention placeholders (see `PRIVACY_GOVERNANCE_LOCK.md`).
6. **Integrations placeholders** — status chips only: HRIS, Teams, Slack, Outlook, Google Calendar, ServiceNow, Jira, Asana, Monday, Salesforce, Power BI.

## Org Packs

An Org Pack is a function-specific configuration bundle. Source of truth: `OrgPack` in `types.ts`, seeded in `src/data/orgPacks.ts`. A pack defines:

- `requiredCardSections` / `optionalCardSections` (which of the 13 card sections apply)
- `intakeFields`
- `meetingFitRules` (the Meeting Fit checks)
- `handoffTemplate` (default handoff checklist items)
- `decisionRightsTemplate`
- `successMetrics`
- `freshnessCadenceDays` / `nudgeCadenceDays`
- `badgeLanguage` (white-label badge labels)
- `visibilityDefault` / `dataRetentionDays`
- `appliesToCategory`

The mechanism is the v2 OrgPack, expanded from 3 packs to **11**.

### The 11 packs (`ORG_PACKS`)

```
pack-exec         Executive Office     (leadership)
pack-sales        Sales                (revenue)
pack-engineering  Engineering          (technology)
pack-legal        Legal                (finance_legal)
pack-hr           People Operations    (people)
pack-finance      Finance              (finance_legal)
pack-cs           Customer Success     (customer)
pack-security     Security             (technology)
pack-pmo          Program Management   (operations)
pack-data         Data & AI            (technology)
pack-operations   Operations           (operations) — enterprise default
```

`DEFAULT_ORG_PACK` resolves to `pack-operations`. Packs carrying stricter handling (Legal, HR, Finance, Security) default to `partners` visibility and longer `dataRetentionDays`; Sales uses a 7-day nudge cadence.

## Boundaries

Nothing in Admin enables personnel-action use. Visibility and consent settings exist to protect individuals, not to surveil them. Templates and packs configure **organizations**, never rank individuals.
