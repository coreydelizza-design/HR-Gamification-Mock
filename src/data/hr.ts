import type { EngagementCell, FrictionDetail, Insight, KPI, Nudge, StyleKey, TeamLB, Trend } from '../lib/types';

export const TEAMS_LB: TeamLB[] = [
  { team: 'Engineering',          members: 24, pct: 94, style: 'Analyzer-heavy' },
  { team: 'Customer Success',     members: 18, pct: 91, style: 'Connector-heavy' },
  { team: 'Product',              members: 12, pct: 88, style: 'Mixed (Analyzer/Visionary)' },
  { team: 'Strategy & Solutions', members: 9,  pct: 84, style: 'Driver-heavy' },
  { team: 'Marketing',            members: 15, pct: 76, style: 'Visionary-heavy' },
  { team: 'Sales',                members: 22, pct: 62, style: 'Driver-heavy' },
];

export const FRICTION_TEAMS = ['Eng', 'CS', 'Prod', 'Strat', 'Mktg', 'Sales'];
export const FRICTION_FULL  = ['Engineering', 'Customer Success', 'Product', 'Strategy & Solutions', 'Marketing', 'Sales'];

export const FRICTION: Array<Array<number | null>> = [
  [null, 22,   30,   64,   48,   70  ],
  [22,   null, 28,   40,   35,   44  ],
  [30,   28,   null, 46,   38,   55  ],
  [64,   40,   46,   null, 52,   34  ],
  [48,   35,   38,   52,   null, 58  ],
  [70,   44,   55,   34,   58,   null],
];

export const FRICTION_DETAIL: Record<string, FrictionDetail> = {
  '0-5': { pair: 'Engineering ↔ Sales',           body: 'Engineering skews Analyzer (evidence-led, async). Sales skews Driver (fast, verbal, decision-first). Sales reads Engineering as obstructive; Engineering reads Sales as reckless.', rec: 'Sales sends written context 24h before; Engineering leads syncs with a recommendation, then the analysis.' },
  '0-3': { pair: 'Engineering ↔ Strategy',        body: 'Strategy is Driver-paced, Engineering is Analyzer-paced. Strategy pushes for decisions before Engineering finishes sensitivity checks.', rec: 'Give Engineering 48h ahead. Strategy frames asks as hypotheses to test, not decisions to ratify.' },
  '4-5': { pair: 'Marketing ↔ Sales',             body: 'Marketing is Visionary, Sales is Driver. They talk past each other on specificity — Marketing wants exploration, Sales wants the concrete ask.', rec: 'Marketing brings one concrete deliverable per meeting; Sales resists killing early-stage ideas before they form.' },
  '2-5': { pair: 'Product ↔ Sales',               body: 'Product wants evidence; Sales wants speed. Friction shows up on roadmap commitments.', rec: 'Shared written problem statements. Sales brings the customer signal, Product brings the constraints — both pre-meeting.' },
  '3-4': { pair: 'Strategy ↔ Marketing',          body: 'Driver meets Visionary. Strategy wants the plan locked; Marketing wants room to explore.', rec: 'Time-box exploration explicitly. Capture Marketing\'s "what ifs" out loud, then let Strategy close.' },
  '2-3': { pair: 'Product ↔ Strategy',            body: "Moderate. Product's evidence-orientation slows Strategy's pace, but both respect rigor once aligned.", rec: 'Lead with the decision, back it with one slide of data. Works for both.' },
  '1-5': { pair: 'Customer Success ↔ Sales',      body: 'Both customer-facing. CS is Connector (consensus, care); Sales is Driver (close it). Tension at the handoff.', rec: "Warm handoffs with context. Sales states what was promised; CS confirms what's deliverable." },
  '1-3': { pair: 'Customer Success ↔ Strategy',   body: 'CS Connectors want people-impact considered; Strategy Drivers move fast. Low-moderate friction.', rec: "Strategy should name who's affected by a decision early — CS engages faster." },
  '0-4': { pair: 'Engineering ↔ Marketing',       body: 'Analyzer meets Visionary. Engineering wants specs; Marketing brings vibes-first concepts.', rec: 'Marketing translates concepts into concrete requirements before involving Engineering.' },
  '0-2': { pair: 'Engineering ↔ Product',         body: 'Low friction — both evidence-oriented, both async-comfortable. Healthy pairing.', rec: 'No intervention needed. Model pairing for the org.' },
  '1-4': { pair: 'Customer Success ↔ Marketing',  body: 'Both relationship-oriented. Minor pace differences only.', rec: "Occasional written recap helps Marketing's momentum-driven style." },
  '2-4': { pair: 'Product ↔ Marketing',           body: 'Both have a Visionary streak. Collaborate well early, diverge on rigor later.', rec: 'Bring Product in early for the vision, formalize before build.' },
  '0-1': { pair: 'Engineering ↔ Customer Success',body: "Low. CS Connectors translate well to Engineering's async style with a little structure.", rec: 'Healthy. CS providing written customer context keeps it smooth.' },
  '1-2': { pair: 'Customer Success ↔ Product',    body: 'Low. CS surfaces customer reality, Product values the evidence.', rec: 'No intervention needed. Strong cross-functional pairing.' },
  '3-5': { pair: 'Strategy ↔ Sales',              body: 'Both Driver-heavy. Same pace, mutual respect for decisiveness. Occasional collision over who has the call.', rec: "Clarify decision ownership up front. Two Drivers need to know who's leading." },
};

export const KPIS: KPI[] = [
  { label: 'Org completion',   value: '82%', delta: '+7 pts vs Q2',     up: true },
  { label: 'Profiles fresh',   value: '74%', delta: '+11 pts vs Q2',    up: true },
  { label: 'Gold tier',        value: '38',  delta: 'of 100 people',    up: false },
  { label: 'Avg time to fill', value: '4.2m',delta: 'under 5m target',  up: true },
];

export const TREND: Trend = {
  quarters: ['Q2 25', 'Q3 25', 'Q4 25', 'Q1 26', 'Q2 26', 'Q3 26'],
  completion: [31, 44, 58, 67, 75, 82],
  fresh:      [20, 30, 41, 55, 63, 74],
};

export const STYLE_DIST: Record<StyleKey, number> = {
  driver: 28, analyzer: 31, connector: 24, visionary: 17,
};

export const NUDGES_DATA: Nudge[] = [
  { team: 'Sales',                under: 8, members: 22, sent: false },
  { team: 'Marketing',            under: 4, members: 15, sent: false },
  { team: 'Strategy & Solutions', under: 2, members: 9,  sent: false },
];

export const INSIGHTS_DATA: Insight[] = [
  { color: 'var(--danger-soft)',  text: 'var(--danger-text)',  icon: '!', body: '<strong>Engineering ↔ Sales is your highest-friction pairing</strong> and they have 14 shared meetings next month. Pre-meeting briefs are now active for all of them.' },
  { color: 'var(--success-soft)', text: 'var(--success-text)', icon: '↗', body: '<strong>Sales completion jumped 18 points</strong> after the team challenge launched. Consider a charity-match reward to lock the gain.' },
  { color: 'var(--warning-soft)', text: 'var(--warning-text)', icon: '○', body: '<strong>11 profiles are going stale</strong> (80+ days), concentrated in Marketing. A targeted refresh nudge is queued for the Marketing manager.' },
];

export const ENGAGEMENT_MATRIX: EngagementCell[] = [
  { key: 'champions',  label: 'Champions',  desc: 'Complete & current',           count: 38, pct: 38, tone: 'success' },
  { key: 'stale',      label: 'Stale',      desc: 'Was engaged, now drifting',    count: 26, pct: 26, tone: 'warning' },
  { key: 'onboarding', label: 'Onboarding', desc: 'Recent activity, in progress', count: 19, pct: 19, tone: 'info'    },
  { key: 'disengaged', label: 'Disengaged', desc: 'Never started or churning',    count: 17, pct: 17, tone: 'danger'  },
];
