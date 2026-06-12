import type { MeetingAgendaItem, MeetingCadence } from '../lib/types';

/**
 * Proxy seed — the raw material the deterministic proxyEngine classifies.
 *
 * Per meeting we declare: its cadence, a formalized agenda (each item carries a
 * kind, an optional need-by, and flags for decision-rights / agreement-review),
 * the full invitee roster (a superset of attendees, including observers so the
 * informational-attendance economics have something to recover), and an optional
 * duplicateOf link. Nothing here is scored per person; rosters are seats.
 *
 * Need-by dates are pinned around DEMO_NOW (2026-06-10) so every urgency state
 * and all three timing flags (overdue-input escalation, scheduled-past-deadline,
 * premature) fire on seeded data. See docs/MEETING_FIT_ENGINE.md.
 */

export interface MeetingMeta {
  cadence: MeetingCadence;
  agenda: MeetingAgendaItem[];
  /** Full invitee roster (personIds). Superset of the meeting's attendeePersonIds. */
  inviteePersonIds: string[];
  /** Need-by per required input, matched to fit.requiredInputs by input text. */
  inputNeedBy?: Record<string, { date: string; reason?: string }>;
  /** Set when this meeting substantially duplicates another (by id). */
  duplicateOf?: string;
}

export const MEETING_META: Record<string, MeetingMeta> = {
  /* 1 · Sales ↔ Legal — CRITICAL (decision right + agreement review + escalation) */
  'm-sales-legal': {
    cadence: 'monthly',
    inviteePersonIds: ['p-jw', 'p-me', 'p-dk'],
    agenda: [
      { topic: 'Approve fallback positions on liability terms', kind: 'decision', exercisesDecisionRight: true, reviewsAgreement: true, needBy: { date: '2026-06-03', reason: 'deal must reach signature in the Q3 window' } },
      { topic: 'Escalate non-standard data-processing clause', kind: 'escalation' },
      { topic: 'Review redline rationale per clause', kind: 'input_review' },
    ],
    inputNeedBy: {
      'Reviewed redline markup with rationale per clause': { date: '2026-06-03', reason: 'needed 24h before signature decision' },
      'Approved fallback positions for liability terms': { date: '2026-06-03' },
    },
  },

  /* 2 · Product ↔ Engineering — CRITICAL (build-order commitment) */
  'm-prod-eng': {
    cadence: 'monthly',
    inviteePersonIds: ['p-mc', 'p-mr', 'p-dk', 'p-me'],
    agenda: [
      { topic: 'Commit Q3 build order and two lead initiatives', kind: 'decision', exercisesDecisionRight: true, needBy: { date: '2026-06-15', reason: 'delivery cycle starts the following Monday' } },
      { topic: 'Review capacity and in-flight commitments', kind: 'input_review' },
    ],
  },

  /* 10 · Q3 Delivery Risk Review — 4-org composition (standard) */
  'm-q3-risk': {
    cadence: 'weekly',
    inviteePersonIds: ['p-mr', 'p-sk', 'p-me', 'p-dk'],
    agenda: [
      { topic: 'Re-baseline two at-risk milestones', kind: 'decision', exercisesDecisionRight: true, needBy: { date: '2026-06-13', reason: 'release cutoff is end of week' } },
      { topic: 'Review the cross-org delivery risk register', kind: 'input_review' },
      { topic: 'Status on open security findings', kind: 'status' },
    ],
    inputNeedBy: {
      'Open security findings affecting the release': { date: '2026-06-12', reason: 'must clear before the release decision' },
      'Reliability telemetry for at-risk services': { date: '2026-06-12' },
    },
  },

  /* 11 · Major Account Escalation — 5-org, escalation type (people-only) */
  'm-major-escalation': {
    cadence: 'one_time',
    inviteePersonIds: ['p-jw', 'p-sk', 'p-mr', 'p-me', 'p-dk'],
    agenda: [
      { topic: 'Walk the escalation trigger and account exposure', kind: 'escalation' },
      { topic: 'Decide remediation commitments and owners', kind: 'decision', exercisesDecisionRight: true, needBy: { date: '2026-06-11', reason: 'account decision needed within 48 hours' } },
    ],
    inputNeedBy: {
      'Open Sev tickets and SLA breaches': { date: '2026-06-10', reason: 'needed to size the remediation' },
    },
  },

  /* 3 · Product ↔ Engineering Weekly Sync — DUPLICATE of m-prod-eng */
  'm-prod-eng-sync': {
    cadence: 'weekly',
    duplicateOf: 'm-prod-eng',
    inviteePersonIds: ['p-mc', 'p-mr', 'p-dk'],
    agenda: [
      { topic: 'Re-confirm roadmap sequencing', kind: 'status' },
      { topic: 'Surface new engineering blockers', kind: 'status' },
    ],
  },

  /* 4 · Customer Success ↔ Support — REPRESENTATIONAL (input-led, with escalation) */
  'm-cs-support': {
    cadence: 'biweekly',
    inviteePersonIds: ['p-sk', 'p-mc', 'p-me'],
    agenda: [
      { topic: 'Agree a shared "at-risk" definition', kind: 'input_review', needBy: { date: '2026-06-16', reason: 'feeds the next renewal-risk review' } },
      { topic: 'Escalation routing for unowned at-risk accounts', kind: 'escalation' },
      { topic: 'Review last month of cross-team escalations', kind: 'status' },
    ],
    inputNeedBy: {
      'Escalation volume and recurring issue patterns': { date: '2026-06-07', reason: 'needed to agree the at-risk definition' },
      'Current routing rules for escalated tickets': { date: '2026-06-07' },
    },
  },

  /* 5 · People Ops ↔ Finance — CRITICAL (approval), decision owner absent */
  'm-hr-fin': {
    cadence: 'one_time',
    inviteePersonIds: ['p-me', 'p-dk', 'p-mc'],
    agenda: [
      { topic: 'Approve H2 hiring plan and budget envelope', kind: 'decision', exercisesDecisionRight: true, needBy: { date: '2026-06-24', reason: 'requisitions open at the start of H2' } },
      { topic: 'Reconcile hiring forecast with budget model', kind: 'input_review' },
    ],
    inputNeedBy: {
      'Approved budget envelope and headcount model': { date: '2026-06-09', reason: 'required before any plan can be approved' },
    },
  },

  /* 6 · Security ↔ IT Service Desk — CRITICAL (runbook sign-off / agreement) */
  'm-sec-itsd': {
    cadence: 'one_time',
    inviteePersonIds: ['p-mr', 'p-dk'],
    agenda: [
      { topic: 'Sign off joint incident-response runbook', kind: 'decision', exercisesDecisionRight: true, reviewsAgreement: true, needBy: { date: '2026-06-30', reason: 'before the next Sev-1 game-day' } },
      { topic: 'Confirm on-call escalation matrix', kind: 'input_review' },
    ],
  },

  /* 7 · Program Mgmt ↔ Engineering — REPRESENTATIONAL (risk review, no org decision) */
  'm-pmo-eng': {
    cadence: 'weekly',
    inviteePersonIds: ['p-me', 'p-mr', 'p-dk'],
    agenda: [
      { topic: 'Walk the delivery risk register', kind: 'input_review' },
      { topic: 'Status on at-risk milestone mitigations', kind: 'status' },
    ],
  },

  /* 8 · Data & AI ↔ Operations — INFORMATIONAL / async, and PREMATURE */
  'm-data-ops': {
    cadence: 'biweekly',
    inviteePersonIds: ['p-dk', 'p-me'],
    agenda: [
      { topic: 'Triage automation intake queue', kind: 'status' },
      { topic: 'Score effort vs impact per request', kind: 'status' },
    ],
    inputNeedBy: {
      'Automation intake requests with business context': { date: '2026-06-20', reason: 'next build slot does not open until the following cycle' },
      'Effort and impact sizing per request': { date: '2026-06-20' },
    },
  },

  /* 9 · Marketing ↔ Sales — INFORMATIONAL, scheduled PAST its decision need-by */
  'm-mktg-sales': {
    cadence: 'monthly',
    inviteePersonIds: ['p-pp', 'p-jw'],
    agenda: [
      { topic: 'Agree campaign-qualified-lead definition and SLA', kind: 'decision', needBy: { date: '2026-06-09', reason: 'campaign launches mid-month and needs the SLA in place' } },
      { topic: 'Review campaign lead volume and sources', kind: 'status' },
    ],
  },
};
