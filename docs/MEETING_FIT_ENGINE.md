# Meeting Fit Engine

The Meeting Fit Engine answers one question per meeting:

> **Is this meeting ready, and what context is missing?**

It does **not** try to be a note-taker, a transcription tool, or a summary generator. It runs **before** the meeting.

## Inputs

A `MeetingFitBrief` (see `src/lib/types.ts`) combines:

- The `Meeting` (title, owner, agenda summary, decision requested, required team IDs).
- `MeetingAttendee[]` (role, pre-read confirmation).
- The work cards of attendees (for attendee context).
- The team cards of `requiredTeamIds` (for required inputs).
- Optionally, a `governingAgreementId` pointing to the relevant `WorkingAgreement`.

## Statuses

```
draft              — not yet sent / agenda not finalized
ready              — all checks pass; the meeting is worth holding
decision_ready     — explicit subset of ready: a single decision can be made today
async_recommended  — the work could be done in writing; live time not required
at_risk            — required inputs missing, decision owner not confirmed, etc.
```

Status is **declared on the brief** and used directly by the UI (`StatusPill`, `ReadinessMeter`). The underlying percentage is still computed for transparency (inputs received × agenda readiness × pre-read confirmation) but does not override the declared status.

## Meeting Fit checks

These are the questions the engine answers, drawn from `OrgPack.meetingFitRules`:

1. Does the meeting have a clear purpose? (agenda summary present)
2. Is the agenda finalized? (`agendaReadiness === 'complete'`)
3. Are required teams represented? (every `requiredTeamIds` has an attendee from that team or a written input)
4. Are decision-makers included? (`decisionOwnerPersonId` is on the attendee list)
5. Are required inputs attached? (`requiredInputs[].received`)
6. Have attendees confirmed the pre-read? (`MeetingAttendee.preReadConfirmed`)
7. Is async better? (declared via `asyncRecommendation`)
8. Is follow-up ownership clear? (`suggestedFollowUp` non-empty)
9. Does a working agreement apply? (`governingAgreementId` present)

## Output

The brief renders in `MeetingDetail.tsx` as a structured panel:

- Attendee context (narrative, drawn from attendee cards).
- Decision owner.
- Required team inputs (with received / pending).
- Agenda readiness + prep gaps.
- Governing agreement (if any).
- Async recommendation (if any).
- Suggested follow-up.

## What the engine is not

- Not a summary tool.
- Not an automatic transcriber.
- Not a meeting scorer that ranks attendees.
- Not a way to flag individuals as "non-collaborative."
