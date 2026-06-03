import type { Team, TeamCard, CardAnswer } from '../lib/types';

const ORG = 'org-acme-na';

export const TEAMS: Team[] = [
  { id: 't-eng',   orgId: ORG, name: 'Engineering',           shortName: 'Eng',   function: 'Engineering',       managerPersonId: 'p-dk', visualKey: 'b', createdAt: '2024-02-01T00:00:00Z' },
  { id: 't-cs',    orgId: ORG, name: 'Customer Success',      shortName: 'CS',    function: 'Customer',          managerPersonId: 'p-sk', visualKey: 'c', createdAt: '2024-02-01T00:00:00Z' },
  { id: 't-prod',  orgId: ORG, name: 'Product',               shortName: 'Prod',  function: 'Product',           managerPersonId: 'p-mc', visualKey: 'b', createdAt: '2024-02-01T00:00:00Z' },
  { id: 't-strat', orgId: ORG, name: 'Strategy & Solutions',  shortName: 'Strat', function: 'Strategy',          managerPersonId: 'p-me', visualKey: 'a', createdAt: '2024-02-01T00:00:00Z' },
  { id: 't-mktg',  orgId: ORG, name: 'Marketing',             shortName: 'Mktg',  function: 'Marketing',         managerPersonId: 'p-pp', visualKey: 'd', createdAt: '2024-02-01T00:00:00Z' },
  { id: 't-sales', orgId: ORG, name: 'Sales',                 shortName: 'Sales', function: 'Revenue',           managerPersonId: 'p-jw', visualKey: 'a', createdAt: '2024-02-01T00:00:00Z' },
];

export const TEAM_BY_ID: Record<string, Team> = Object.fromEntries(TEAMS.map((t) => [t.id, t]));

/* ─────────────────────────────────────────────────────────────────
   Team Cards — first-class. Operating entities, not member buckets.
   ───────────────────────────────────────────────────────────────── */
export const TEAM_CARDS: TeamCard[] = [
  {
    id: 'tc-eng', teamId: 't-eng', orgId: ORG, kind: 'team',
    ownerPersonId: 'p-dk',
    mission: 'Build and operate the platform that every other team relies on.',
    weOwn: ['Production reliability', 'Internal developer experience', 'Data platform', 'Security baseline'],
    weDontOwn: ['Pricing model', 'Customer-facing commitments', 'Go-to-market positioning'],
    weProduce: ['Quarterly platform roadmap', 'Incident reviews', 'Architecture decision records'],
    weNeed: ['Product problem statements with assumptions stated', 'Customer signal with evidence', 'Realistic timelines'],
    bestEngagement: 'Async-first. Share a written brief 48h ahead. Engineering will engage in writing, then book a sync only if needed.',
    commonBlockers: ['Verbal-only asks with no follow-up doc', 'Reprioritization mid-sprint without context', 'Scope without an owner'],
    responseExpectations: 'Async-first: half-day response on Slack, 48h on a problem statement.',
    escalationPath: 'Production incidents page on-call. Cross-team blockers >24h: EM. Unresolved >5 days: Director of Engineering.',
    decisionRights: ['Architecture and platform choices', 'Production change windows', 'Incident triage and severity'],
    decisionOwners: ['David Kim (architecture)', 'Marcus Rivera (delivery)'],
    meetingNorms: 'Standing meetings only with an agenda. Pre-read required for any decision meeting. Decisions confirmed in writing within 24h.',
    partnerTeamIds: ['t-prod', 't-strat', 't-cs'],
    downstreamImpact: 'All product surfaces and the data platform serving CS, Marketing, and Sales analytics.',
    visibility: 'org',
    publishedAt: '2026-03-12T00:00:00Z',
    lastUpdatedAt: '2026-05-04T00:00:00Z',
  },
  {
    id: 'tc-cs', teamId: 't-cs', orgId: ORG, kind: 'team',
    ownerPersonId: 'p-sk',
    mission: 'Make customers successful enough to expand, and surface their reality to the rest of the org.',
    weOwn: ['Customer onboarding', 'Renewal motion', 'Customer health signals'],
    weDontOwn: ['Discounts or commercial terms', 'Roadmap commitments', 'Sales pipeline forecast'],
    weProduce: ['Weekly customer signal digest', 'Renewal forecasts', 'Escalation summaries'],
    weNeed: ['Honest product timelines', 'Sales-to-CS handoff with context', 'Engineering bandwidth for retention-affecting fixes'],
    bestEngagement: 'Slack DM works. Loop us in early on anything that affects a live customer — late is the expensive failure mode.',
    commonBlockers: ['Commitments made to customers without CS context', 'Surprise feature changes', 'Renewal asks the week of expiry'],
    responseExpectations: 'Same-day on Slack. Customer-facing incidents within the hour during business hours.',
    escalationPath: 'At-risk renewal: Head of CS immediately. Customer-impacting bug: on-call + Head of CS.',
    decisionRights: ['Customer-facing commitments inside delivered scope', 'Health-score interpretation', 'Renewal recommendation'],
    decisionOwners: ['Sara Kowalski (customer-facing commitments)'],
    meetingNorms: 'Customer-blocking topics get a meeting same day. Routine reviews stay weekly.',
    partnerTeamIds: ['t-sales', 't-prod', 't-eng'],
    downstreamImpact: 'Renewal forecast and customer-signal digest used by Product roadmap and Sales pipeline.',
    visibility: 'org',
    publishedAt: '2026-02-20T00:00:00Z',
    lastUpdatedAt: '2026-05-22T00:00:00Z',
  },
  {
    id: 'tc-prod', teamId: 't-prod', orgId: ORG, kind: 'team',
    ownerPersonId: 'p-mc',
    mission: 'Decide what to build, in what order, and why — with evidence.',
    weOwn: ['Product roadmap', 'Problem framing', 'Customer research synthesis'],
    weDontOwn: ['Architecture decisions', 'Customer commitments', 'Brand and positioning'],
    weProduce: ['Quarterly priorities', 'Problem statements', 'Decision logs'],
    weNeed: ['Customer signal with patterns, not anecdotes', 'Engineering feasibility', 'Sales context on lost deals'],
    bestEngagement: 'Notion-first. Send the problem before the solution. Decisions are made in writing, then confirmed in a short sync.',
    commonBlockers: ['Anecdotes treated as patterns', 'Solution-first requests', 'Priorities renegotiated mid-quarter'],
    responseExpectations: 'Comments on Notion within 24h. Roadmap edits batched weekly.',
    escalationPath: 'Roadmap pressure unresolved >5 days: PM lead. Strategic conflicts: Director of Product.',
    decisionRights: ['Roadmap order', 'Problem framing', 'Definition of done for a feature'],
    decisionOwners: ['Maya Chen (roadmap prioritization)'],
    meetingNorms: 'Decisions land in writing first. Live meetings are confirmation, not deliberation.',
    partnerTeamIds: ['t-eng', 't-cs', 't-sales', 't-mktg'],
    downstreamImpact: 'Roadmap drives Engineering planning, Marketing launches, and CS expectation-setting with customers.',
    visibility: 'org',
    publishedAt: '2026-04-01T00:00:00Z',
    lastUpdatedAt: '2026-05-18T00:00:00Z',
  },
  {
    id: 'tc-strat', teamId: 't-strat', orgId: ORG, kind: 'team',
    ownerPersonId: 'p-me',
    mission: 'Translate strategy into the next decision, and unblock cross-team work.',
    weOwn: ['Cross-team operating cadence', 'Strategic planning rituals', 'Executive alignment'],
    weDontOwn: ['Functional roadmaps', 'Headcount planning', 'Compensation'],
    weProduce: ['Decision memos', 'Operating reviews', 'Quarterly themes'],
    weNeed: ['Honest signal, fast', 'Clear ownership on cross-team work', 'A real ask, not a discussion'],
    bestEngagement: 'Bring the decision or the ask first. Pre-read 24h ahead. Five-minute call to confirm, not to deliberate.',
    commonBlockers: ['Decisions disguised as discussions', 'Cross-team work without an owner', 'Status meetings posing as planning'],
    responseExpectations: 'Same-day for cross-team blockers. Themes finalized within week 2 of every quarter.',
    escalationPath: 'Theme conflict >10 days: Director of Strategy + the two functional leads.',
    decisionRights: ['Cross-team operating cadence', 'Quarterly theme nomination', 'Off-site agenda'],
    decisionOwners: ['Alex Morgan (cross-team coordination)'],
    meetingNorms: 'Reviews end with a written decision and an owner. No standing meeting without a recurring decision to make.',
    partnerTeamIds: ['t-prod', 't-eng', 't-cs', 't-mktg', 't-sales'],
    downstreamImpact: 'Quarterly themes set planning context for every functional team.',
    visibility: 'org',
    publishedAt: '2026-04-22T00:00:00Z',
    lastUpdatedAt: '2026-05-28T00:00:00Z',
  },
  {
    id: 'tc-mktg', teamId: 't-mktg', orgId: ORG, kind: 'team',
    ownerPersonId: 'p-pp',
    mission: 'Build a category position and pipeline, with the brand teams remember.',
    weOwn: ['Positioning', 'Demand gen', 'Brand'],
    weDontOwn: ['Product feature decisions', 'Customer health interpretation', 'Pricing changes'],
    weProduce: ['Campaign plans', 'Content calendar', 'Pipeline forecast'],
    weNeed: ['Customer language from CS', 'Product roadmap with confidence levels', 'Sales feedback on the messaging'],
    bestEngagement: 'A call or a voice memo beats a long Slack thread. Bring one concrete artifact per conversation.',
    commonBlockers: ['No artifact to react to', 'Brand asks landing 48h before launch', 'Messaging by committee'],
    responseExpectations: 'Bursty — same-day on calls and voice memos, slower on long Slack threads.',
    escalationPath: 'Launch dates at risk: Marketing Director + PM lead. Positioning conflict: Director of Marketing.',
    decisionRights: ['Positioning and messaging', 'Campaign timing', 'Brand standards'],
    decisionOwners: ['Priya Patel (positioning and campaign)'],
    meetingNorms: 'Working sessions over status meetings. Artifacts on the table, not screens of bullets.',
    partnerTeamIds: ['t-prod', 't-sales', 't-cs'],
    downstreamImpact: 'Positioning drives sales conversations and renewal narratives.',
    visibility: 'org',
    lastUpdatedAt: '2026-04-10T00:00:00Z',
  },
  {
    id: 'tc-sales', teamId: 't-sales', orgId: ORG, kind: 'team',
    ownerPersonId: 'p-jw',
    mission: 'Close the right customers with the right expectations.',
    weOwn: ['Pipeline progression', 'Discovery quality', 'Commitments to prospects'],
    weDontOwn: ['Product capability', 'Customer health interpretation post-close', 'Pricing model design'],
    weProduce: ['Weekly forecast', 'Won/lost reviews', 'Deal handoffs to CS'],
    weNeed: ['Product timelines we can responsibly commit to', 'Marketing air cover', 'CS context on existing accounts'],
    bestEngagement: 'Phone or short Slack. Send written commitments — if it lives in a hallway, it never happened.',
    commonBlockers: ['Verbal commitments without a doc', 'Late handoffs to CS', 'Feature requests labeled as deal-breakers without pattern'],
    responseExpectations: 'Same-day for live deals. Lower priority during quarter-end pushes.',
    escalationPath: 'Roadmap pressure on a deal: PM lead + Sales Director. Renewal at risk: CS Head.',
    decisionRights: ['Deal qualification', 'Discount within policy', 'Sales-cycle pacing'],
    decisionOwners: ['James Wilson (deal commitments above $50k ARR)'],
    meetingNorms: 'Pipeline reviews are weekly. Deal commitments captured in writing the same day.',
    partnerTeamIds: ['t-prod', 't-mktg', 't-cs'],
    downstreamImpact: 'Pipeline forecast feeds finance planning; deal handoffs feed CS onboarding load.',
    visibility: 'org',
    lastUpdatedAt: '2026-03-02T00:00:00Z',
  },
];

export const TEAM_CARD_BY_TEAM: Record<string, TeamCard> = Object.fromEntries(
  TEAM_CARDS.map((tc) => [tc.teamId, tc]),
);

/* ─────────────────────────────────────────────────────────────────
   Team Card section answers
   ───────────────────────────────────────────────────────────────── */
export const TEAM_CARD_ANSWERS: CardAnswer[] = [
  { id: 'tca-eng-1', cardId: 'tc-eng', cardKind: 'team', sectionKey: 'communication', body: 'Pull requests, threaded Slack with a clear ask, and a written brief 48h before any sync.', lastUpdatedAt: '2026-05-04T00:00:00Z' },
  { id: 'tca-eng-2', cardId: 'tc-eng', cardKind: 'team', sectionKey: 'decisions', body: 'Architecture decisions are logged as ADRs. Delivery decisions are made by the EM after the team has weighed in.', lastUpdatedAt: '2026-05-04T00:00:00Z' },
  { id: 'tca-eng-3', cardId: 'tc-eng', cardKind: 'team', sectionKey: 'escalation', body: 'Production incidents page on-call. Cross-team blockers go to the EM, then the Director of Engineering if unresolved in 24h.', lastUpdatedAt: '2026-05-04T00:00:00Z' },

  { id: 'tca-cs-1', cardId: 'tc-cs', cardKind: 'team', sectionKey: 'communication', body: 'Slack DM, customer channel, or escalation channel. Public channels for anything that affects multiple teams.', lastUpdatedAt: '2026-05-22T00:00:00Z' },
  { id: 'tca-cs-2', cardId: 'tc-cs', cardKind: 'team', sectionKey: 'decisions', body: 'CS makes the customer-facing call. Internal feasibility is owned by the team that builds it.', lastUpdatedAt: '2026-05-22T00:00:00Z' },

  { id: 'tca-prod-1', cardId: 'tc-prod', cardKind: 'team', sectionKey: 'communication', body: 'Async in Notion. Comments on the problem statement, not the proposed solution.', lastUpdatedAt: '2026-05-18T00:00:00Z' },
  { id: 'tca-prod-2', cardId: 'tc-prod', cardKind: 'team', sectionKey: 'decisions', body: 'Prioritization happens monthly. Roadmap edits require the problem and the evidence — not just the request.', lastUpdatedAt: '2026-05-18T00:00:00Z' },

  { id: 'tca-strat-1', cardId: 'tc-strat', cardKind: 'team', sectionKey: 'communication', body: 'Lead with the decision or the ask. Pre-read 24h ahead. Five-minute call to confirm.', lastUpdatedAt: '2026-05-28T00:00:00Z' },
  { id: 'tca-strat-2', cardId: 'tc-strat', cardKind: 'team', sectionKey: 'decisions', body: 'Strategy proposes; the relevant team owner decides. We hold the cross-functional integration.', lastUpdatedAt: '2026-05-28T00:00:00Z' },

  { id: 'tca-mktg-1', cardId: 'tc-mktg', cardKind: 'team', sectionKey: 'communication', body: 'Calls or voice memos for ideation. One artifact per conversation when we need to land something.', lastUpdatedAt: '2026-04-10T00:00:00Z' },

  { id: 'tca-sales-1', cardId: 'tc-sales', cardKind: 'team', sectionKey: 'communication', body: 'Phone-first for live deals. Slack for everything else. Commitments to prospects go in writing.', lastUpdatedAt: '2026-03-02T00:00:00Z' },
];
