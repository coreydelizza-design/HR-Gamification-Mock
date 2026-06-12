import type { OrgMeeting, OrgMeetingFit } from '../lib/types';

/**
 * Organization-first meetings and their readiness (Fit) briefs.
 *
 * Analysis is org-level only: required inputs, agenda readiness, decision
 * ownership, format-vs-norms, handoff impact, and risk. People appear ONLY
 * as attendees / decision owners / follow-up owners — operational roles.
 * No individual is ranked, scored, or compared. Advisory, never punitive.
 *
 * Attendees are drawn from the 7 demo people, picking the closest-org match
 * and reusing across meetings as needed.
 */

/* ─────────────────────────────────────────────────────────────────
   Meetings — exactly 8, one per partner pairing.
   ───────────────────────────────────────────────────────────────── */
export const ORG_MEETINGS: OrgMeeting[] = [
  {
    id: 'm-sales-legal',
    title: 'Sales ↔ Legal: Q3 Contract Review',
    startsAt: '2026-06-04T15:00:00Z',
    durationMinutes: 45,
    participatingOrgIds: ['o-sales', 'o-legal'],
    requiredOrgIds: ['o-sales', 'o-legal'],
    attendeePersonIds: ['p-jw', 'p-me'],
    decisionOwnerPersonId: 'p-jw',
    decisionRequested:
      'Approve the redlined Q3 enterprise MSA terms so the deal can move to signature this quarter.',
    agendaSummary:
      'Walk the open redlines on liability and data-processing terms, and decide which positions Sales can accept without further Legal review.',
    governingAgreementId: 'sa-sales-legal',
  },
  {
    id: 'm-prod-eng',
    title: 'Product ↔ Engineering: Roadmap Review',
    startsAt: '2026-06-05T17:30:00Z',
    durationMinutes: 50,
    participatingOrgIds: ['o-prod', 'o-eng'],
    requiredOrgIds: ['o-prod', 'o-eng'],
    attendeePersonIds: ['p-mc', 'p-mr', 'p-dk'],
    decisionOwnerPersonId: 'p-mc',
    decisionRequested:
      'Confirm the Q3 build order and which two initiatives Engineering will commit capacity to first.',
    agendaSummary:
      'Review the prioritized roadmap against current engineering capacity and lock the sequencing for the next two delivery cycles.',
    governingAgreementId: 'sa-prod-eng',
  },
  {
    id: 'm-cs-support',
    title: 'Customer Success ↔ Support: Escalation Review',
    startsAt: '2026-06-08T16:00:00Z',
    durationMinutes: 40,
    participatingOrgIds: ['o-cs', 'o-support'],
    requiredOrgIds: ['o-cs', 'o-support'],
    attendeePersonIds: ['p-sk', 'p-mc'],
    decisionOwnerPersonId: 'p-sk',
    decisionRequested:
      'Decide the escalation threshold and routing for at-risk accounts handed from Support to Customer Success.',
    agendaSummary:
      'Review the past month of cross-team escalations and agree on a shared definition of "at-risk" plus the handoff path that follows.',
    governingAgreementId: 'sa-cs-support',
  },
  {
    id: 'm-hr-fin',
    title: 'People Ops ↔ Finance: Headcount Planning',
    startsAt: '2026-06-09T18:00:00Z',
    durationMinutes: 55,
    participatingOrgIds: ['o-hr', 'o-fin'],
    requiredOrgIds: ['o-hr', 'o-fin'],
    attendeePersonIds: ['p-me', 'p-dk'],
    decisionOwnerPersonId: 'p-me',
    decisionRequested:
      'Approve the H2 hiring plan and the budget envelope for the next two open requisition waves.',
    agendaSummary:
      'Reconcile the People Ops hiring forecast with the Finance budget model and decide which roles open in which quarter.',
    governingAgreementId: 'sa-hr-fin',
  },
  {
    id: 'm-sec-itsd',
    title: 'Security ↔ IT Service Desk: Incident Readiness',
    startsAt: '2026-06-10T14:30:00Z',
    durationMinutes: 35,
    participatingOrgIds: ['o-sec', 'o-itsd'],
    requiredOrgIds: ['o-sec', 'o-itsd'],
    attendeePersonIds: ['p-mr', 'p-dk'],
    decisionOwnerPersonId: 'p-mr',
    decisionRequested:
      'Sign off on the joint incident-response runbook and the on-call escalation matrix for Sev-1 events.',
    agendaSummary:
      'Validate the end-to-end incident playbook between Security and the Service Desk and confirm ownership at each escalation tier.',
    governingAgreementId: 'sa-sec-itsd',
  },
  {
    id: 'm-pmo-eng',
    title: 'Program Management ↔ Engineering: Delivery Risk Review',
    startsAt: '2026-06-11T16:30:00Z',
    durationMinutes: 45,
    participatingOrgIds: ['o-pmo', 'o-eng'],
    requiredOrgIds: ['o-pmo', 'o-eng'],
    attendeePersonIds: ['p-me', 'p-mr'],
    decisionOwnerPersonId: 'p-me',
    decisionRequested:
      'Decide which two at-risk milestones get re-baselined and what dependency owners must resolve this week.',
    agendaSummary:
      'Walk the delivery risk register, confirm mitigation owners, and re-baseline the milestones that can no longer hit their original dates.',
    governingAgreementId: 'sa-pmo-eng',
  },
  {
    id: 'm-data-ops',
    title: 'Data & AI ↔ Operations: Automation Intake',
    startsAt: '2026-06-12T15:30:00Z',
    durationMinutes: 30,
    participatingOrgIds: ['o-data', 'o-ops'],
    requiredOrgIds: ['o-data', 'o-ops'],
    attendeePersonIds: ['p-dk', 'p-me'],
    decisionOwnerPersonId: 'p-dk',
    decisionRequested:
      'Triage the new automation intake requests and decide which qualify for a Data & AI build slot this cycle.',
    agendaSummary:
      'Review the Operations automation intake queue against effort and impact, and route each request to build, backlog, or decline.',
    governingAgreementId: 'sa-data-ops',
  },
  {
    id: 'm-mktg-sales',
    title: 'Marketing ↔ Sales: Campaign Handoff',
    startsAt: '2026-06-12T19:00:00Z',
    durationMinutes: 25,
    participatingOrgIds: ['o-mktg', 'o-sales'],
    requiredOrgIds: ['o-mktg', 'o-sales'],
    attendeePersonIds: ['p-pp', 'p-jw'],
    decisionOwnerPersonId: 'p-pp',
    decisionRequested:
      'Agree the lead-qualification criteria and SLA for handing campaign-sourced leads from Marketing to Sales.',
    agendaSummary:
      'Define what a campaign-qualified lead looks like and the timing Sales can expect, so the handoff stops dropping leads.',
    governingAgreementId: 'sa-mktg-sales',
  },
  {
    // A deliberate near-duplicate of m-prod-eng — same orgs, overlapping topics,
    // recurring weekly, no new required inputs. The classifier flags it for merge.
    id: 'm-prod-eng-sync',
    title: 'Product ↔ Engineering: Weekly Roadmap Sync',
    startsAt: '2026-06-12T17:30:00Z',
    durationMinutes: 30,
    participatingOrgIds: ['o-prod', 'o-eng'],
    requiredOrgIds: ['o-prod', 'o-eng'],
    attendeePersonIds: ['p-mc', 'p-mr', 'p-dk'],
    decisionOwnerPersonId: 'p-mc',
    decisionRequested:
      'Re-confirm roadmap sequencing and surface any new engineering blockers since the last sync.',
    agendaSummary:
      'Standing weekly status on roadmap order and capacity — largely the same ground as the Roadmap Review.',
    governingAgreementId: 'sa-prod-eng',
  },
];

/* ─────────────────────────────────────────────────────────────────
   Meeting Fit briefs — one per meeting.
   ───────────────────────────────────────────────────────────────── */
export const ORG_MEETING_FITS: OrgMeetingFit[] = [
  {
    id: 'fit-sales-legal',
    meetingId: 'm-sales-legal',
    status: 'at_risk',
    requiredInputs: [
      { orgId: 'o-sales', input: 'Deal summary and target close date', received: true },
      { orgId: 'o-legal', input: 'Reviewed redline markup with rationale per clause', received: false },
      { orgId: 'o-legal', input: 'Approved fallback positions for liability terms', received: false },
    ],
    missingOrgIds: [],
    agendaReadiness: 'partial',
    decisionOwnerPresent: true,
    formatMatchesNorms: true,
    handoffImpact:
      'Without the Legal redline rationale, Sales cannot confirm which terms are negotiable, so the handoff to signature stalls.',
    createsOrResolvesRisk:
      'Creates risk: meeting may end without an approvable position, pushing the deal past the Q3 signature window.',
    followUpOwnerPersonId: 'p-me',
    nextBestAction:
      'Have Legal circulate the annotated redline and fallback positions at least 24 hours before the meeting.',
  },
  {
    id: 'fit-prod-eng',
    meetingId: 'm-prod-eng',
    status: 'ready',
    requiredInputs: [
      { orgId: 'o-prod', input: 'Prioritized roadmap with outcome rationale', received: true },
      { orgId: 'o-eng', input: 'Current capacity and in-flight commitments', received: true },
      { orgId: 'o-eng', input: 'High-level sizing for the top initiatives', received: true },
    ],
    missingOrgIds: [],
    agendaReadiness: 'complete',
    decisionOwnerPresent: true,
    formatMatchesNorms: true,
    handoffImpact:
      'With roadmap priorities and capacity both pre-shared, the build-order decision can hand cleanly to delivery planning.',
    createsOrResolvesRisk:
      'Resolves risk: locking sequencing now prevents mid-cycle reprioritization that would churn engineering work.',
    followUpOwnerPersonId: 'p-mc',
    nextBestAction:
      'Confirm the two committed initiatives in the meeting and publish the agreed build order to both orgs same day.',
  },
  {
    id: 'fit-cs-support',
    meetingId: 'm-cs-support',
    status: 'at_risk',
    requiredInputs: [
      { orgId: 'o-cs', input: 'List of accounts flagged at-risk this month', received: true },
      { orgId: 'o-support', input: 'Escalation volume and recurring issue patterns', received: false },
      { orgId: 'o-support', input: 'Current routing rules for escalated tickets', received: false },
    ],
    missingOrgIds: [],
    agendaReadiness: 'partial',
    decisionOwnerPresent: true,
    formatMatchesNorms: true,
    handoffImpact:
      'Without Support escalation data, the two orgs cannot agree a shared at-risk definition, so handoffs stay ad hoc.',
    createsOrResolvesRisk:
      'Creates risk: inconsistent escalation routing leaves at-risk accounts unowned between the two orgs.',
    followUpOwnerPersonId: 'p-sk',
    nextBestAction:
      'Ask Support to share last month’s escalation breakdown and current routing rules before the review.',
  },
  {
    id: 'fit-hr-fin',
    meetingId: 'm-hr-fin',
    status: 'at_risk',
    requiredInputs: [
      { orgId: 'o-hr', input: 'Hiring forecast by role and quarter', received: true },
      { orgId: 'o-fin', input: 'Approved budget envelope and headcount model', received: false },
    ],
    missingOrgIds: [],
    agendaReadiness: 'partial',
    decisionOwnerPresent: false,
    formatMatchesNorms: true,
    handoffImpact:
      'Without the Finance budget owner present, any agreed hiring plan cannot be confirmed and must re-route for approval.',
    createsOrResolvesRisk:
      'Creates risk: the meeting can shape a plan but not approve it, delaying requisitions that need to open this quarter.',
    followUpOwnerPersonId: 'p-me',
    nextBestAction:
      'Secure the Finance budget decision owner before scheduling, or downgrade this session to a working pre-read.',
  },
  {
    id: 'fit-sec-itsd',
    meetingId: 'm-sec-itsd',
    status: 'decision_ready',
    requiredInputs: [
      { orgId: 'o-sec', input: 'Draft incident-response runbook', received: true },
      { orgId: 'o-itsd', input: 'On-call roster and Service Desk escalation tiers', received: true },
      { orgId: 'o-sec', input: 'Sev-1 severity definitions and SLAs', received: true },
    ],
    missingOrgIds: [],
    agendaReadiness: 'complete',
    decisionOwnerPresent: true,
    formatMatchesNorms: true,
    handoffImpact:
      'All inputs are in hand, so the joint runbook can be signed off and handed straight into on-call operations.',
    createsOrResolvesRisk:
      'Resolves risk: a ratified escalation matrix removes ambiguity about who owns each tier during a Sev-1 event.',
    followUpOwnerPersonId: 'p-mr',
    nextBestAction:
      'Make the sign-off decision in the meeting and distribute the ratified runbook to both on-call rotations.',
  },
  {
    id: 'fit-pmo-eng',
    meetingId: 'm-pmo-eng',
    status: 'ready',
    requiredInputs: [
      { orgId: 'o-pmo', input: 'Current delivery risk register with severities', received: true },
      { orgId: 'o-eng', input: 'Status and blockers on at-risk milestones', received: true },
    ],
    missingOrgIds: [],
    agendaReadiness: 'complete',
    decisionOwnerPresent: true,
    formatMatchesNorms: true,
    handoffImpact:
      'With the risk register and milestone status pre-shared, re-baselining decisions can hand cleanly to the delivery plan.',
    createsOrResolvesRisk:
      'Resolves risk: assigning mitigation owners now prevents at-risk milestones from slipping silently.',
    followUpOwnerPersonId: 'p-mr',
    nextBestAction:
      'Confirm mitigation owners per risk and publish the re-baselined milestone dates to both orgs after the review.',
  },
  {
    id: 'fit-data-ops',
    meetingId: 'm-data-ops',
    status: 'async_recommended',
    requiredInputs: [
      { orgId: 'o-ops', input: 'Automation intake requests with business context', received: true },
      { orgId: 'o-data', input: 'Effort and impact sizing per request', received: true },
    ],
    missingOrgIds: [],
    agendaReadiness: 'complete',
    decisionOwnerPresent: true,
    formatMatchesNorms: false,
    asyncRecommendation:
      'This is a structured triage with all sizing already attached — run it as an async scoring pass in the intake doc and reserve a meeting only for contested items.',
    handoffImpact:
      'An async triage produces the same routing decisions and hands a clear build/backlog/decline list to Data & AI without a live session.',
    createsOrResolvesRisk:
      'Resolves risk: documenting the triage rationale async creates a durable record of why each request was routed where it was.',
    followUpOwnerPersonId: 'p-dk',
    nextBestAction:
      'Convert the queue to an async scoring doc, give Operations 48 hours to comment, and meet live only if items remain contested.',
  },
  {
    id: 'fit-mktg-sales',
    meetingId: 'm-mktg-sales',
    status: 'draft',
    requiredInputs: [
      { orgId: 'o-mktg', input: 'Campaign lead volume and source breakdown', received: false },
      { orgId: 'o-sales', input: 'Current lead-acceptance criteria and SLA expectations', received: false },
    ],
    missingOrgIds: [],
    agendaReadiness: 'missing',
    decisionOwnerPresent: true,
    formatMatchesNorms: true,
    handoffImpact:
      'The handoff criteria are not yet drafted, so the campaign-to-Sales lead flow has no shared definition to hand off against.',
    createsOrResolvesRisk:
      'Creates risk: without agreed qualification criteria, campaign leads keep dropping between Marketing and Sales.',
    followUpOwnerPersonId: 'p-pp',
    nextBestAction:
      'Draft a starting lead-qualification definition and SLA proposal before the meeting so there is something concrete to react to.',
  },
  {
    id: 'fit-prod-eng-sync',
    meetingId: 'm-prod-eng-sync',
    status: 'async_recommended',
    requiredInputs: [
      { orgId: 'o-prod', input: 'Roadmap order (unchanged since Roadmap Review)', received: true },
      { orgId: 'o-eng', input: 'Capacity snapshot (unchanged since Roadmap Review)', received: true },
    ],
    missingOrgIds: [],
    agendaReadiness: 'complete',
    decisionOwnerPresent: true,
    formatMatchesNorms: false,
    asyncRecommendation:
      'This standing sync re-covers the Roadmap Review with no new inputs — fold it into that meeting or run it as an async status post.',
    handoffImpact:
      'Nothing new hands off here that the Roadmap Review does not already cover.',
    createsOrResolvesRisk:
      'Creates risk: a redundant recurring meeting burns recurring cost without producing a distinct decision.',
    followUpOwnerPersonId: 'p-mc',
    nextBestAction:
      'Merge into the Roadmap Review or convert to an async status thread; reserve live time only when sequencing actually changes.',
  },
];

/* ─────────────────────────────────────────────────────────────────
   Lookups
   ───────────────────────────────────────────────────────────────── */
export const ORG_MEETING_BY_ID: Record<string, OrgMeeting> =
  Object.fromEntries(ORG_MEETINGS.map((m) => [m.id, m]));

export const ORG_MEETING_FIT_BY_MEETING: Record<string, OrgMeetingFit> =
  Object.fromEntries(ORG_MEETING_FITS.map((f) => [f.meetingId, f]));
