# Organization-First Model — Lock

The **Organization** is the primary product object. Individual work cards survive only as nested supporting context.

## Primacy rules

1. `OrganizationCard` is the primary object; `SuccessAgreement` second; `OrgMeetingFit` third.
2. Individual cards (`Person`, `RoleCard`, `IndividualWorkCard`/`WorkCard`) are **nested context only**. They render inside an Organization Card (People section) or inside a Meeting Fit detail. They are never a top-level nav route.
3. **My Fieldguide** and **People & Teams** are gone from the navigation. They do not return.
4. Teams remain a sub-grouping inside organizations (`Enterprise → Organization → Team → Role → Individual`), but `Team` is no longer the top operating entity — `Organization` is.

## Navigation lock — the 7 primary nav items

```
1. Home
2. Organization Cards
3. Collaboration Map
4. Success Agreements
5. Meeting Fit
6. Org Insights
7. Admin
```

No other items appear in the primary nav. The streak pill is removed from the TopBar.

- **Sidebar footer:** "Working structure, not reporting structure."
- **TopBar:** enterprise name, active org pack, freshness status, theme toggle, search placeholder.

## Detail views — `PARENT_OF` mapping

Detail views are not in the nav. They are reached from their parent and mapped via `PARENT_OF` (in `Sidebar.tsx`):

```
organization-detail        → Organization Cards
success-agreement-detail   → Success Agreements
meeting-fit-detail         → Meeting Fit
```

Nested person / role panels render **inside** `organization-detail` (and inline in `meeting-fit-detail`). There is no standalone person nav route; an inline drawer or sub-panel is the only person surface.

`ViewKey` (from `types.ts`): `home`, `organizations`, `organization-detail`, `collaboration-map`, `success-agreements`, `success-agreement-detail`, `meeting-fit`, `meeting-fit-detail`, `org-insights`, `admin`. The view-registry pattern is kept; **no React Router**.

## Forbidden directions

The product is **not**, and must never read like:

- A personality tool, a quiz, a leaderboard, an HR engagement dashboard, or a meeting-summary/transcription tool.
- A surveillance dashboard.

The following are forbidden **everywhere**, including data shapes:

- Any individual ranking.
- Any individual friction score.
- Any comparison of two named employees on any metric.

No language implying **hiring, firing, promotion, compensation, performance, or discipline** use. See `PRIVACY_GOVERNANCE_LOCK.md` for the hard product boundary.

## Why this holds

Demoting individual cards does not break the pre-meeting use case: person context is always reachable in ≤1 click (org detail People section, or the Meeting Fit attendee-context panel — see `MEETING_FIT_ENGINE.md`).
