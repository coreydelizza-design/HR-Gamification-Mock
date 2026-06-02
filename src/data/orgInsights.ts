import type { Nudge, FreshnessSignal } from '../lib/types';

/**
 * Aggregate signals for the Org Insights view.
 * All metrics are organization-wide; no individual rankings.
 */

export interface AdoptionMetric {
  label: string;
  pct: number;          // 0–100
  count: number;
  total: number;
  trend: 'up' | 'flat' | 'down';
  deltaLabel: string;
}

export interface TrendSeries {
  label: string;
  periods: string[];
  values: number[];
}

export interface CoverageRow {
  label: string;
  detail: string;
  status: 'ready' | 'almost' | 'attention';
  pct: number;
}

export const CARD_ADOPTION: AdoptionMetric = {
  label: 'Work cards adopted',
  pct: 82, count: 41, total: 50,
  trend: 'up', deltaLabel: '+7 pts vs last quarter',
};

export const TEAM_CARD_ADOPTION: AdoptionMetric = {
  label: 'Team cards adopted',
  pct: 67, count: 4, total: 6,
  trend: 'up', deltaLabel: '+1 team this quarter',
};

export const AGREEMENT_COVERAGE: AdoptionMetric = {
  label: 'Cross-team agreements',
  pct: 60, count: 6, total: 10,
  trend: 'up', deltaLabel: '+2 agreements vs last quarter',
};

export const MEETING_READINESS_RATE: AdoptionMetric = {
  label: 'Meeting readiness rate',
  pct: 71, count: 17, total: 24,
  trend: 'flat', deltaLabel: 'within 1 pt of last quarter',
};

export const READINESS_TREND: TrendSeries = {
  label: 'Card readiness over time',
  periods: ['Q2 25', 'Q3 25', 'Q4 25', 'Q1 26', 'Q2 26', 'Q3 26'],
  values: [31, 44, 58, 67, 75, 82],
};

export const FRESHNESS_TREND: TrendSeries = {
  label: 'Cards reviewed this quarter',
  periods: ['Q2 25', 'Q3 25', 'Q4 25', 'Q1 26', 'Q2 26', 'Q3 26'],
  values: [20, 30, 41, 55, 63, 74],
};

/**
 * Engagement matrix shape: aggregate org-wide. Not individual.
 */
export interface EngagementBucket {
  key: 'champions' | 'aging' | 'getting_started' | 'attention';
  label: string;
  desc: string;
  count: number;
  pct: number;
  tone: 'success' | 'warning' | 'info' | 'attention';
}

export const ENGAGEMENT_BUCKETS: EngagementBucket[] = [
  { key: 'champions',       label: 'Cards in good shape',        desc: 'Adopted and reviewed within 90 days',         count: 38, pct: 38, tone: 'success'  },
  { key: 'aging',           label: 'Cards aging',                desc: 'Adopted but not reviewed in 60–90 days',      count: 26, pct: 26, tone: 'warning'  },
  { key: 'getting_started', label: 'Cards getting started',      desc: 'Recent activity, sections still in progress', count: 19, pct: 19, tone: 'info'     },
  { key: 'attention',       label: 'Cards needing attention',    desc: 'Not yet adopted or 90+ days without review',  count: 17, pct: 17, tone: 'attention' },
];

/**
 * Handoff & dependency clarity gaps (team-level only).
 */
export const HANDOFF_CLARITY_GAPS: CoverageRow[] = [
  { label: 'Customer Success ↔ Sales', detail: 'Handoff checklist in review — one section pending.', status: 'almost',    pct: 80 },
  { label: 'Product ↔ Engineering',    detail: 'Handoff checklist complete and reviewed last cycle.', status: 'ready',     pct: 100 },
  { label: 'Marketing ↔ Sales',        detail: 'Agreement still in draft; no handoff checklist yet.', status: 'attention', pct: 25 },
  { label: 'Strategy ↔ Product',       detail: 'Operating cadence covers handoffs implicitly.',       status: 'almost',    pct: 70 },
];

export const DEPENDENCY_GAPS: CoverageRow[] = [
  { label: 'Pricing rollout (Prod → Eng)',            detail: 'Cross-team dependency at risk pending platform sizing.', status: 'attention', pct: 35 },
  { label: 'August launch (Mktg → Prod)',             detail: 'Feature confirmation outstanding.',                       status: 'attention', pct: 40 },
  { label: 'Renewal motion (CS → Prod)',              detail: 'Bug burndown on track.',                                   status: 'ready',     pct: 90 },
  { label: 'Off-site preparation (Strat → Prod)',     detail: 'Roadmap confidence levels not yet posted.',                status: 'attention', pct: 20 },
];

/* ─────────────────────────────────────────────────────────────────
   Nudges — aggregated for the org view, and per-person for Home.
   ───────────────────────────────────────────────────────────────── */
export const NUDGES: Nudge[] = [
  { id: 'n-1', kind: 'stale_card',           audience: 'person',  audienceId: 'p-jw', message: 'Your Fieldguide is 90+ days old. A 10-minute refresh keeps it useful for incoming teammates.', triggeredAt: '2026-05-30T00:00:00Z', cardId: 'wc-jw' },
  { id: 'n-2', kind: 'pre_meeting_refresh',  audience: 'person',  audienceId: 'p-pp', message: 'You have a Q3 planning sync this week. Your Meetings section was updated 38 days ago — quick review?', triggeredAt: '2026-06-01T00:00:00Z', cardId: 'wc-pp', meetingId: 'mtg-q3-plan' },
  { id: 'n-3', kind: 'agreement_review_due', audience: 'team',    audienceId: 't-cs', message: 'The CS ↔ Sales agreement is due for review on June 15.', triggeredAt: '2026-05-28T00:00:00Z', agreementId: 'wa-cs-sales' },
  { id: 'n-4', kind: 'handoff_gap',          audience: 'team',    audienceId: 't-mktg', message: 'The Marketing ↔ Sales agreement is still a draft. A handoff checklist would close the loop.', triggeredAt: '2026-05-26T00:00:00Z', agreementId: 'wa-mktg-sales' },
  { id: 'n-5', kind: 'team_readiness',       audience: 'manager', audienceId: 'p-jw',  message: 'Sales team card has not been updated since March. Adding the engagement and decision sections would help partner teams plan.', triggeredAt: '2026-05-24T00:00:00Z' },
];

/* ─────────────────────────────────────────────────────────────────
   Freshness signals — derived from card lastUpdatedAt.
   These are precomputed for the demo.
   ───────────────────────────────────────────────────────────────── */
export const FRESHNESS_SIGNALS: FreshnessSignal[] = [
  { id: 'f-me',  subjectKind: 'work_card', subjectId: 'wc-me', lastUpdatedAt: '2026-05-29T00:00:00Z', daysSinceUpdate: 4,  status: 'fresh' },
  { id: 'f-mc',  subjectKind: 'work_card', subjectId: 'wc-mc', lastUpdatedAt: '2026-05-22T00:00:00Z', daysSinceUpdate: 11, status: 'fresh' },
  { id: 'f-mr',  subjectKind: 'work_card', subjectId: 'wc-mr', lastUpdatedAt: '2026-05-11T00:00:00Z', daysSinceUpdate: 22, status: 'fresh' },
  { id: 'f-pp',  subjectKind: 'work_card', subjectId: 'wc-pp', lastUpdatedAt: '2026-04-25T00:00:00Z', daysSinceUpdate: 38, status: 'aging' },
  { id: 'f-jw',  subjectKind: 'work_card', subjectId: 'wc-jw', lastUpdatedAt: '2026-03-02T00:00:00Z', daysSinceUpdate: 92, status: 'stale' },
  { id: 'f-sk',  subjectKind: 'work_card', subjectId: 'wc-sk', lastUpdatedAt: '2026-05-31T00:00:00Z', daysSinceUpdate: 2,  status: 'fresh' },
  { id: 'f-dk',  subjectKind: 'work_card', subjectId: 'wc-dk', lastUpdatedAt: '2026-05-27T00:00:00Z', daysSinceUpdate: 6,  status: 'fresh' },
];
