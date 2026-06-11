# Meeting Fit Engine — Lock

Meeting Fit answers one question per meeting, **before** it runs:

> Is this cross-org meeting ready, and what is missing?

It is **not** a note-taker, transcriber, or summary generator. It is the third product object after Organization Card and Success Agreement.

Source of truth: `OrgMeeting`, `OrgMeetingFit`, `MeetingFitStatus` in `src/lib/types.ts`.

## Org-first reframe

A meeting is evaluated by **organizations**, not teams:

1. Which organizations are involved (`participatingOrgIds`).
2. Whether required orgs are represented (`missingOrgIds` empty).
3. Whether required inputs exist (`requiredInputs[].received`, keyed by `orgId`).
4. Whether a Success Agreement applies (`OrgMeeting.governingAgreementId`).
5. Whether the decision owner is present (`decisionOwnerPresent`).
6. Whether the format matches org norms (`formatMatchesNorms`).
7. Whether async is better (`asyncRecommendation`).
8. Whether handoff criteria are satisfied (`handoffImpact`).
9. Whether it creates or resolves cross-org risk (`createsOrResolvesRisk`).

## Statuses (`MeetingFitStatus`)

```
draft              — agenda not finalized
ready              — checks pass; worth holding
decision_ready     — a single decision can be made today
async_recommended  — could be handled in writing; no live time needed
at_risk            — required inputs missing, decision owner absent, etc.
```

Status is declared on the fit; the UI uses it directly (`StatusPill`). `agendaReadiness` is `complete | partial | missing`. `nextBestAction` and `followUpOwnerPersonId` close the loop.

## Seeded meetings (8)

1. Sales↔Legal contract review — missing inputs → `at_risk`.
2. Product↔Engineering roadmap review — `ready`.
3. CS↔Support escalation review — `at_risk`.
4. HR↔Finance headcount planning — missing decision owner → `at_risk`.
5. Security↔IT incident readiness — `decision_ready`.
6. PMO↔Engineering delivery risk review — `ready`.
7. Data&AI↔BizOps automation intake — `async_recommended`.
8. Marketing↔Sales campaign handoff — `draft`.

## THE MEETING-PREP SURVIVAL RULE

Demoting individual cards must not break pre-meeting prep. Therefore:

> The Meeting Fit **detail** view must render an attendee-context panel inline, surfacing each attendee's individual-card highlights — communication, meeting preferences, escalation preferences.

Person context is reachable in **≤1 click** from any meeting. This is the only individual surface that renders inside Meeting Fit, and it is read-only context, never a score.

## Boundaries

No attendee is scored, ranked, or flagged as "non-collaborative." All readiness is meeting/org-level. The engine reads `OrgPack.meetingFitRules` (see `ADMIN_ORG_PACKS.md`) for its checks.
