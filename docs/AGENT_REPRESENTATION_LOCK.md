# Agent Representation Lock (v3.5b)

The **Proxy** capability lets an individual delegate meeting attendance to an agent, grounded in remit cards. These rules are non-negotiable and are enforced **structurally in the types and engine**, not only in the UI. They are the authority boundary the future Phase-5 Agent Charter export will derive from.

## 1 · Self-sovereign delegation
Only the **individual** assigns their own delegate. Organizers set a representation **floor** per invitee (`RepresentationRequirement`: `person_required` → `org_delegate_minimum` → `agent_optional`); they can demand presence but can never assign anyone's delegate. Floors are **tighten-only** — an organizer may raise a floor, never lower it below the computed default. Every delegation produces a **consent record** (`DelegationGrant`: who, which meeting, when, scope) and is **revocable** at any time before the meeting; revoking restores live attendance.

*Enforced by:* `setAttendanceMode` (only writes the acting person's own row), `canSetRequirement` (tighten-only), `DelegationGrant` on `MeetingInvitee`.

## 2 · Disclosure
A delegate **always identifies as an agent** in any rendered context (roster row, digest header). It never appears as the person.

*Enforced by:* the `Agent delegate` / `Agent · {name}` tags rendered wherever a delegated row or digest appears.

## 3 · Remit-scoped capture only
A delegate captures only a **digest of items intersecting the attendee's own responsibility domain** (`RemitDigestItem`: asks of my org, decisions affecting my dependencies, actions in my remit, inputs requested). **Full transcripts and any observation about other attendees are forbidden artifacts.** The digest cites the org-card / role-card section each item came from.

*Enforced by:* `buildRemitDigestPreview` (templated from the person's own org card + role card; no transcript path exists).

## 4 · Critical meetings are non-delegable for critical invitees
A **critical** invitee (holds a decision right exercised on the agenda, owns a missing required input, is an owner-party to an agreement under review, or owns an invoked escalation path) in a **critical** meeting is **person-required, full stop**. The delegate option is blocked in the UI with an explanation, and the floor cannot be loosened.

*Enforced by:* `canDelegate` returns `false` for critical-in-critical regardless of the floor; `defaultRequirement` sets that floor to `person_required`.

## 5 · No individual delegation metrics
There are **no** "skipped meetings" counts, per-person delegation rates, or any individual delegation metric — anywhere, including the data shapes. Economics aggregate at the **organization** level only. Rates attach to **role bands (seats)**, never to a named person (Shopify precedent): no individual's compensation is stored, displayed, or implied.

*Enforced by:* `RateCard` keyed by `RoleBand`; `EnterpriseOpportunity` and `meetingEconomics` aggregate by org / band; no per-person counter exists in `AttendanceState` beyond the person's own current mode.

## 6 · Authority ceiling
A delegate **may** state card content (what the org owns, needs, offers; its engagement model). It **may commit only explicitly delegated decision rights** — of which there are **none** in this demo phase. It **must defer** everything else. The Phase-5 Agent Charter export derives its authority boundaries directly from this lock.

---

All economics are **estimates for decision-making, never payroll math**, and always render with a tilde (`~`). See `docs/MEETING_FIT_ENGINE.md` for the class/criticality taxonomy and `docs/ORG_INSIGHTS_GUARDRAILS.md` for the no-individual-metrics rule.
