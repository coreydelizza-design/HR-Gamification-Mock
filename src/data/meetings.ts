import type { Meeting, MeetingAttendee, MeetingFitBrief } from '../lib/types';

const ORG = 'org-acme-na';

export const MEETINGS: Meeting[] = [
  {
    id: 'mtg-q3-plan',
    orgId: ORG,
    title: 'Q3 planning sync',
    startsAt: '2026-06-04T20:00:00Z',
    durationMinutes: 45,
    ownerPersonId: 'p-me',
    agendaSummary: 'Lock the Q3 themes, owners, and the one decision we will not relitigate.',
    decisionRequested: 'Approve three Q3 themes with a single accountable owner each.',
    requiredTeamIds: ['t-prod', 't-eng', 't-mktg', 't-strat'],
  },
  {
    id: 'mtg-1-1-mr',
    orgId: ORG,
    title: '1:1 with Marcus',
    startsAt: '2026-06-03T16:30:00Z',
    durationMinutes: 30,
    ownerPersonId: 'p-me',
    agendaSummary: 'Decide whether the platform migration goes in Q3 or Q4.',
    decisionRequested: 'Lock the platform-migration timing.',
    requiredTeamIds: ['t-eng', 't-strat'],
  },
  {
    id: 'mtg-data-review',
    orgId: ORG,
    title: 'Data review with David',
    startsAt: '2026-06-05T15:00:00Z',
    durationMinutes: 60,
    ownerPersonId: 'p-me',
    agendaSummary: 'Walk through the retention model assumptions and the sensitivity checks before sharing org-wide.',
    decisionRequested: 'Confirm we can socialize the model to the leadership team next week.',
    requiredTeamIds: ['t-eng', 't-strat', 't-cs'],
  },
  {
    id: 'mtg-pricing',
    orgId: ORG,
    title: 'Pricing decision (Sales + Product)',
    startsAt: '2026-06-06T17:00:00Z',
    durationMinutes: 45,
    ownerPersonId: 'p-mc',
    agendaSummary: 'Approve the mid-tier pricing change for the August release.',
    decisionRequested: 'Approve or defer the mid-tier pricing change.',
    requiredTeamIds: ['t-prod', 't-sales', 't-mktg', 't-cs'],
  },
];

export const MEETING_BY_ID: Record<string, Meeting> = Object.fromEntries(
  MEETINGS.map((m) => [m.id, m]),
);

export const MEETING_ATTENDEES: MeetingAttendee[] = [
  // Q3 planning
  { id: 'ma-q3-1', meetingId: 'mtg-q3-plan', personId: 'p-me', role: 'organizer',      preReadConfirmed: true  },
  { id: 'ma-q3-2', meetingId: 'mtg-q3-plan', personId: 'p-mc', role: 'decision_owner', preReadConfirmed: true  },
  { id: 'ma-q3-3', meetingId: 'mtg-q3-plan', personId: 'p-mr', role: 'required',       preReadConfirmed: false },
  { id: 'ma-q3-4', meetingId: 'mtg-q3-plan', personId: 'p-pp', role: 'required',       preReadConfirmed: false },

  // 1:1 with Marcus
  { id: 'ma-mr-1', meetingId: 'mtg-1-1-mr', personId: 'p-me', role: 'organizer', preReadConfirmed: true },
  { id: 'ma-mr-2', meetingId: 'mtg-1-1-mr', personId: 'p-mr', role: 'required',  preReadConfirmed: true },

  // Data review
  { id: 'ma-dr-1', meetingId: 'mtg-data-review', personId: 'p-me', role: 'organizer',      preReadConfirmed: true },
  { id: 'ma-dr-2', meetingId: 'mtg-data-review', personId: 'p-dk', role: 'decision_owner', preReadConfirmed: true },

  // Pricing
  { id: 'ma-pr-1', meetingId: 'mtg-pricing', personId: 'p-mc', role: 'organizer',      preReadConfirmed: true  },
  { id: 'ma-pr-2', meetingId: 'mtg-pricing', personId: 'p-jw', role: 'decision_owner', preReadConfirmed: false },
  { id: 'ma-pr-3', meetingId: 'mtg-pricing', personId: 'p-pp', role: 'required',       preReadConfirmed: false },
  { id: 'ma-pr-4', meetingId: 'mtg-pricing', personId: 'p-sk', role: 'required',       preReadConfirmed: true  },
];

export const MEETING_FIT_BRIEFS: MeetingFitBrief[] = [
  {
    id: 'mfb-q3-plan', meetingId: 'mtg-q3-plan',
    status: 'at_risk',
    attendeeContext: 'Mixed group: a Director who works in writing, a PM who needs a pre-read, an EM who processes in silence before committing, and a Marketing Director who thinks by talking. The pre-read will land for two of them; the other two need a 5-minute pre-call.',
    agendaReadiness: 'partial',
    requiredInputs: [
      { teamId: 't-prod',  input: 'Draft Q3 theme list',         received: true  },
      { teamId: 't-eng',   input: 'Platform-migration estimate', received: false },
      { teamId: 't-mktg',  input: 'Campaign window options',     received: false },
      { teamId: 't-strat', input: 'Carry-over commitments',      received: true  },
    ],
    decisionOwnerPersonId: 'p-mc',
    prepGaps: [
      'Engineering input is outstanding — without it we cannot land themes that touch platform work.',
      'Marketing has not posted the campaign window options yet.',
      'Two attendees have not confirmed they have read the pre-read.',
    ],
    asyncRecommendation: 'Send a one-page theme draft asynchronously this evening; the meeting can shrink to 25 minutes of decision-only.',
    suggestedFollowUp: 'Publish themes and owners in #strategy within 24h of the meeting; do not relitigate in next week\'s standing sync.',
    governingAgreementId: 'wa-strat-all',
  },
  {
    id: 'mfb-1-1-mr', meetingId: 'mtg-1-1-mr',
    status: 'decision_ready',
    attendeeContext: 'Marcus reads tone better than text. Open warm, name the decision early, and leave space for the quiet processing. He will commit once he has heard what his team thinks.',
    agendaReadiness: 'complete',
    requiredInputs: [
      { teamId: 't-eng',   input: 'Migration sequencing options', received: true },
      { teamId: 't-strat', input: 'Cross-team dependencies map',   received: true },
    ],
    decisionOwnerPersonId: 'p-me',
    prepGaps: [],
    suggestedFollowUp: 'Post the decision in #engineering by EOD and update the working agreement next review.',
    governingAgreementId: 'wa-eng-prod',
  },
  {
    id: 'mfb-data-review', meetingId: 'mtg-data-review',
    status: 'ready',
    attendeeContext: 'David distrusts his own first answer and will start the conversation at the second pass. He has already pre-shared the model and the sensitivity tests.',
    agendaReadiness: 'complete',
    requiredInputs: [
      { teamId: 't-eng',   input: 'Model and sensitivity checks', received: true },
      { teamId: 't-cs',    input: 'Customer cohort definitions',  received: true },
      { teamId: 't-strat', input: 'Leadership audience read',     received: true },
    ],
    decisionOwnerPersonId: 'p-dk',
    prepGaps: [],
    asyncRecommendation: 'If David signals confidence in writing before the meeting, this could shrink to a 15-minute call.',
    suggestedFollowUp: 'Loop Sara on the customer-impact slide before the leadership share.',
  },
  {
    id: 'mfb-pricing', meetingId: 'mtg-pricing',
    status: 'async_recommended',
    attendeeContext: 'Pricing decision with the deal owner who has not confirmed the pre-read, plus Marketing who needs a concrete artifact to react to, plus CS who needs to understand the renewal impact.',
    agendaReadiness: 'missing',
    requiredInputs: [
      { teamId: 't-prod',  input: 'Pricing rationale memo',         received: true  },
      { teamId: 't-sales', input: 'Top-account impact analysis',    received: false },
      { teamId: 't-mktg',  input: 'External messaging draft',       received: false },
      { teamId: 't-cs',    input: 'Renewal-window impact estimate', received: true  },
    ],
    decisionOwnerPersonId: 'p-jw',
    prepGaps: [
      'Top-account impact analysis is not posted.',
      'External messaging draft is not started.',
      'Decision owner has not confirmed the pre-read.',
    ],
    asyncRecommendation: 'Move this to a written decision memo. Hold a 15-minute call to confirm only.',
    suggestedFollowUp: 'Publish a decision log within 24h and update the Sales↔Product working agreement next review.',
    governingAgreementId: 'wa-prod-sales',
  },
];

export const FIT_BY_MEETING: Record<string, MeetingFitBrief> = Object.fromEntries(
  MEETING_FIT_BRIEFS.map((b) => [b.meetingId, b]),
);
