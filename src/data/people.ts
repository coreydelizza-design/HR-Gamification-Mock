import type { Person, TeamMembership, WorkCard, CardAnswer } from '../lib/types';

const ORG = 'org-acme-na';

/* ─────────────────────────────────────────────────────────────────
   People — the demo roster.
   The viewer is `p-me` (Tom Murray).
   ───────────────────────────────────────────────────────────────── */
export const PEOPLE: Person[] = [
  {
    id: 'p-me', orgId: ORG, name: 'Tom Murray', initials: 'TM',
    role: 'Director of Strategy', primaryTeamId: 't-strat',
    location: 'Boulder, CO', timeZone: 'America/Denver',
    workingHours: '8am – 4pm MT (deep focus 7–11am)',
    workCardId: 'wc-me', visualKey: 'a',
    createdAt: '2024-04-01T00:00:00Z',
  },
  {
    id: 'p-mc', orgId: ORG, name: 'Maya Chen', initials: 'MC',
    role: 'Senior PM', primaryTeamId: 't-prod',
    location: 'Austin, TX', timeZone: 'America/Chicago',
    workingHours: '9am – 5pm CT (deep AM, collab PM)',
    workCardId: 'wc-mc', visualKey: 'b',
    createdAt: '2024-04-01T00:00:00Z',
  },
  {
    id: 'p-mr', orgId: ORG, name: 'Marcus Rivera', initials: 'MR',
    role: 'Engineering Manager', primaryTeamId: 't-eng',
    location: 'San Diego, CA', timeZone: 'America/Los_Angeles',
    workingHours: '8am – 6pm PT',
    workCardId: 'wc-mr', visualKey: 'c',
    createdAt: '2024-04-01T00:00:00Z',
  },
  {
    id: 'p-pp', orgId: ORG, name: 'Priya Patel', initials: 'PP',
    role: 'Marketing Director', primaryTeamId: 't-mktg',
    location: 'Brooklyn, NY', timeZone: 'America/New_York',
    workingHours: '10am – 7pm ET',
    workCardId: 'wc-pp', visualKey: 'd',
    createdAt: '2024-04-01T00:00:00Z',
  },
  {
    id: 'p-jw', orgId: ORG, name: 'James Wilson', initials: 'JW',
    role: 'Senior Account Executive', primaryTeamId: 't-sales',
    location: 'Chicago, IL', timeZone: 'America/Chicago',
    workingHours: 'Variable (travel-heavy)',
    workCardId: 'wc-jw', visualKey: 'a',
    createdAt: '2024-04-01T00:00:00Z',
  },
  {
    id: 'p-sk', orgId: ORG, name: 'Sara Kowalski', initials: 'SK',
    role: 'Head of Customer Success', primaryTeamId: 't-cs',
    location: 'Toronto, ON', timeZone: 'America/Toronto',
    workingHours: '9am – 6pm ET',
    workCardId: 'wc-sk', visualKey: 'c',
    createdAt: '2024-04-01T00:00:00Z',
  },
  {
    id: 'p-dk', orgId: ORG, name: 'David Kim', initials: 'DK',
    role: 'Data Science Lead', primaryTeamId: 't-eng',
    location: 'Seattle, WA', timeZone: 'America/Los_Angeles',
    workingHours: '8am – 4pm PT (8–11am are gold)',
    workCardId: 'wc-dk', visualKey: 'b',
    createdAt: '2024-04-01T00:00:00Z',
  },
];

export const ME: Person = PEOPLE[0];
export const PERSON_BY_ID: Record<string, Person> = Object.fromEntries(PEOPLE.map((p) => [p.id, p]));

/* ─────────────────────────────────────────────────────────────────
   Team Memberships
   ───────────────────────────────────────────────────────────────── */
export const TEAM_MEMBERSHIPS: TeamMembership[] = [
  { id: 'tm-me',  personId: 'p-me', teamId: 't-strat', role: 'lead',    startedAt: '2024-04-01T00:00:00Z' },
  { id: 'tm-mc',  personId: 'p-mc', teamId: 't-prod',  role: 'lead',    startedAt: '2024-04-01T00:00:00Z' },
  { id: 'tm-mr',  personId: 'p-mr', teamId: 't-eng',   role: 'manager', startedAt: '2024-04-01T00:00:00Z' },
  { id: 'tm-pp',  personId: 'p-pp', teamId: 't-mktg',  role: 'lead',    startedAt: '2024-04-01T00:00:00Z' },
  { id: 'tm-jw',  personId: 'p-jw', teamId: 't-sales', role: 'member',  startedAt: '2024-04-01T00:00:00Z' },
  { id: 'tm-sk',  personId: 'p-sk', teamId: 't-cs',    role: 'lead',    startedAt: '2024-04-01T00:00:00Z' },
  { id: 'tm-dk',  personId: 'p-dk', teamId: 't-eng',   role: 'manager', startedAt: '2024-04-01T00:00:00Z' },
];

/* ─────────────────────────────────────────────────────────────────
   Work Cards — one per person.
   Freshness is varied to demonstrate Fresh / Aging / Stale.
   ───────────────────────────────────────────────────────────────── */
export const WORK_CARDS: WorkCard[] = [
  { id: 'wc-me', personId: 'p-me', orgId: ORG, kind: 'work', visibility: 'org', publishedAt: '2025-12-01T00:00:00Z', lastUpdatedAt: '2026-05-29T00:00:00Z' },
  { id: 'wc-mc', personId: 'p-mc', orgId: ORG, kind: 'work', visibility: 'org', publishedAt: '2025-09-15T00:00:00Z', lastUpdatedAt: '2026-05-22T00:00:00Z' },
  { id: 'wc-mr', personId: 'p-mr', orgId: ORG, kind: 'work', visibility: 'org', publishedAt: '2025-10-01T00:00:00Z', lastUpdatedAt: '2026-05-11T00:00:00Z' },
  { id: 'wc-pp', personId: 'p-pp', orgId: ORG, kind: 'work', visibility: 'org', publishedAt: '2025-09-01T00:00:00Z', lastUpdatedAt: '2026-04-25T00:00:00Z' },
  { id: 'wc-jw', personId: 'p-jw', orgId: ORG, kind: 'work', visibility: 'team', publishedAt: undefined, lastUpdatedAt: '2026-03-02T00:00:00Z' },
  { id: 'wc-sk', personId: 'p-sk', orgId: ORG, kind: 'work', visibility: 'org', publishedAt: '2026-02-01T00:00:00Z', lastUpdatedAt: '2026-05-31T00:00:00Z' },
  { id: 'wc-dk', personId: 'p-dk', orgId: ORG, kind: 'work', visibility: 'org', publishedAt: '2025-11-10T00:00:00Z', lastUpdatedAt: '2026-05-27T00:00:00Z' },
];

export const WORK_CARD_BY_PERSON: Record<string, WorkCard> = Object.fromEntries(
  WORK_CARDS.map((wc) => [wc.personId, wc]),
);

/* ─────────────────────────────────────────────────────────────────
   Card Answers — keyed to each person's WorkCard.
   Coverage is intentionally uneven across the roster to surface
   readiness gaps.
   ───────────────────────────────────────────────────────────────── */
const ans = (id: string, cardId: string, sectionKey: CardAnswer['sectionKey'], body: string, updated: string, visibility?: CardAnswer['visibility']): CardAnswer => ({
  id, cardId, cardKind: 'work', sectionKey, body, lastUpdatedAt: updated,
  ...(visibility ? { visibility } : {}),
});

export const CARD_ANSWERS: CardAnswer[] = [
  // Tom Murray (p-me) — well-covered
  ans('a-me-1', 'wc-me', 'communication',     'Slack DM during 8am–4pm MT. Email otherwise. Phone for true urgency — if it is on the phone, I assume it is on fire.', '2026-05-29T00:00:00Z'),
  ans('a-me-2', 'wc-me', 'meetings',          'Pre-read everything. I will skim once and want the meeting to start at the decision. Time-box to 25 minutes.', '2026-05-29T00:00:00Z'),
  ans('a-me-3', 'wc-me', 'feedback',          'Direct, immediate, and private. Skip the compliment sandwich — it makes me distrust the compliment and miss the point.', '2026-05-15T00:00:00Z', 'team'),
  ans('a-me-4', 'wc-me', 'decisions',         'Data-informed, fast, low-ego. Bring me new evidence and I will reverse without hesitation.', '2026-05-29T00:00:00Z'),
  ans('a-me-5', 'wc-me', 'focus',             '7–11am is deep focus. Post-lunch I crash and then get a second wind around 3pm.', '2026-05-15T00:00:00Z', 'private'),
  ans('a-me-6', 'wc-me', 'escalation',        'For cross-team blockers, pull me in directly. Do not wait for the next planning cycle.', '2026-05-29T00:00:00Z'),
  ans('a-me-7', 'wc-me', 'needs_from_others', 'Real autonomy, a weekly checkpoint instead of daily oversight, and a pre-read.', '2026-05-15T00:00:00Z'),
  ans('a-me-8', 'wc-me', 'count_on_me',       'Closing loops, naming the decision, and unblocking cross-team work.', '2026-05-29T00:00:00Z'),

  // Maya Chen (p-mc) — covered, evidence-led
  ans('a-mc-1', 'wc-mc', 'communication',     'Notion comments or scheduled Slack threads. Calendar holds are sacred.', '2026-05-22T00:00:00Z'),
  ans('a-mc-2', 'wc-mc', 'meetings',          'I will not engage without a pre-read. Lead with the assumptions, not the conclusion.', '2026-05-22T00:00:00Z'),
  ans('a-mc-3', 'wc-mc', 'feedback',          'Written, structured, with examples. Verbal first feels like an ambush.', '2026-05-01T00:00:00Z'),
  ans('a-mc-4', 'wc-mc', 'decisions',         'Evidence-led. Show me the data, the assumptions, and the second-order effects.', '2026-05-22T00:00:00Z'),
  ans('a-mc-5', 'wc-mc', 'focus',             'Mornings for deep work, afternoons for collaboration. Never evenings.', '2026-05-01T00:00:00Z'),
  ans('a-mc-7', 'wc-mc', 'needs_from_others', 'A real problem statement, time to think, and no drive-by reprioritization.', '2026-05-22T00:00:00Z'),
  ans('a-mc-8', 'wc-mc', 'count_on_me',       'Rigorous problem framing, written decision logs, and patience under uncertainty.', '2026-05-01T00:00:00Z'),

  // Marcus Rivera (p-mr) — partial
  ans('a-mr-1', 'wc-mr', 'communication',     '1:1 video for anything sensitive. Slack for async. I read tone better than text.', '2026-05-11T00:00:00Z'),
  ans('a-mr-2', 'wc-mr', 'meetings',          'Open warm. Name the decision early. Leave room for the team — silence usually means processing.', '2026-05-11T00:00:00Z'),
  ans('a-mr-3', 'wc-mr', 'feedback',          'In person, with care. I will absorb it — just lead with what is working.', '2026-04-20T00:00:00Z'),
  ans('a-mr-4', 'wc-mr', 'decisions',         'Consensus-informed. I want to know what my team thinks before I commit.', '2026-05-11T00:00:00Z'),
  ans('a-mr-8', 'wc-mr', 'count_on_me',       'Steady delivery, team health, and the human read on a hard call.', '2026-04-20T00:00:00Z'),

  // Priya Patel (p-pp) — light, aging
  ans('a-pp-1', 'wc-pp', 'communication',     'Quick voice memo or call. Long Slack threads kill momentum.', '2026-04-25T00:00:00Z'),
  ans('a-pp-2', 'wc-pp', 'meetings',          'I think by talking. Capture the "what if" out loud or it is gone. Bring one artifact.', '2026-04-25T00:00:00Z'),
  ans('a-pp-4', 'wc-pp', 'decisions',         'Gut plus a clear vision. I refine through doing, not deciding.', '2026-04-25T00:00:00Z'),

  // James Wilson (p-jw) — minimal, stale (priority intervention)
  ans('a-jw-1', 'wc-jw', 'communication',     'Phone first, Slack second. I am on the road most weeks.', '2026-03-02T00:00:00Z'),

  // Sara Kowalski (p-sk) — well-covered, very fresh
  ans('a-sk-1', 'wc-sk', 'communication',     'Slack DM works great. I am near my desk most of the day.', '2026-05-31T00:00:00Z'),
  ans('a-sk-2', 'wc-sk', 'meetings',          'Bring the customer voice. Tell me who is affected by what we decide.', '2026-05-31T00:00:00Z'),
  ans('a-sk-3', 'wc-sk', 'feedback',          'Direct but kind. I will act on it the same week.', '2026-05-10T00:00:00Z'),
  ans('a-sk-4', 'wc-sk', 'decisions',         'Customer impact first, then internal feasibility, then speed.', '2026-05-31T00:00:00Z'),
  ans('a-sk-5', 'wc-sk', 'focus',             'Late morning sweet spot, 10am–1pm.', '2026-05-10T00:00:00Z'),
  ans('a-sk-6', 'wc-sk', 'escalation',        'For at-risk renewals, pull me in immediately. For everything else, batch into the weekly.', '2026-05-31T00:00:00Z'),
  ans('a-sk-7', 'wc-sk', 'needs_from_others', 'Clear customer signal, honest timelines, and a team that trusts me to make the call.', '2026-05-31T00:00:00Z'),
  ans('a-sk-8', 'wc-sk', 'count_on_me',       'Following through, the customer perspective, and pushing back on unrealistic commitments.', '2026-05-10T00:00:00Z'),

  // David Kim (p-dk) — covered, analytic
  ans('a-dk-1', 'wc-dk', 'communication',     'GitHub issues or threaded Slack. Pings without context are entropy.', '2026-05-27T00:00:00Z'),
  ans('a-dk-2', 'wc-dk', 'meetings',          'Pre-share the model and methodology. The meeting starts at my second pass, not your first.', '2026-05-27T00:00:00Z'),
  ans('a-dk-3', 'wc-dk', 'feedback',          'In writing, with the reasoning. I want to understand the model.', '2026-05-05T00:00:00Z'),
  ans('a-dk-4', 'wc-dk', 'decisions',         'I distrust my first answer. Always run the sensitivity check.', '2026-05-27T00:00:00Z'),
  ans('a-dk-5', 'wc-dk', 'focus',             'Mornings 8–11am are gold. Drop after 2pm.', '2026-05-05T00:00:00Z'),
  ans('a-dk-7', 'wc-dk', 'needs_from_others', 'Clean data, a clear hypothesis, and someone to challenge my model.', '2026-05-27T00:00:00Z'),
];
