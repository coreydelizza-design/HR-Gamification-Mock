import type {
  WorkingAgreement, AgreementSection, CollaborationNeed, CollaborationOffer, Dependency,
} from '../lib/types';

const ORG = 'org-acme-na';

export const WORKING_AGREEMENTS: WorkingAgreement[] = [
  {
    id: 'wa-eng-prod',
    orgId: ORG,
    title: 'Engineering ↔ Product operating agreement',
    teamIds: ['t-eng', 't-prod'],
    status: 'published',
    reviewCadenceDays: 90,
    nextReviewAt: '2026-08-12T00:00:00Z',
    lastUpdatedAt: '2026-05-12T00:00:00Z',
    authorPersonId: 'p-mc',
  },
  {
    id: 'wa-prod-sales',
    orgId: ORG,
    title: 'Product ↔ Sales commitment agreement',
    teamIds: ['t-prod', 't-sales'],
    status: 'published',
    reviewCadenceDays: 90,
    nextReviewAt: '2026-07-01T00:00:00Z',
    lastUpdatedAt: '2026-04-04T00:00:00Z',
    authorPersonId: 'p-mc',
  },
  {
    id: 'wa-cs-sales',
    orgId: ORG,
    title: 'Customer Success ↔ Sales handoff agreement',
    teamIds: ['t-cs', 't-sales'],
    status: 'review',
    reviewCadenceDays: 60,
    nextReviewAt: '2026-06-15T00:00:00Z',
    lastUpdatedAt: '2026-05-25T00:00:00Z',
    authorPersonId: 'p-sk',
  },
  {
    id: 'wa-mktg-sales',
    orgId: ORG,
    title: 'Marketing ↔ Sales feedback loop',
    teamIds: ['t-mktg', 't-sales'],
    status: 'draft',
    reviewCadenceDays: 90,
    nextReviewAt: '2026-07-20T00:00:00Z',
    lastUpdatedAt: '2026-05-18T00:00:00Z',
    authorPersonId: 'p-pp',
  },
  {
    id: 'wa-strat-all',
    orgId: ORG,
    title: 'Strategy operating cadence (cross-team)',
    teamIds: ['t-strat', 't-prod', 't-eng', 't-cs'],
    status: 'published',
    reviewCadenceDays: 180,
    nextReviewAt: '2026-11-01T00:00:00Z',
    lastUpdatedAt: '2026-05-02T00:00:00Z',
    authorPersonId: 'p-me',
  },
];

export const AGREEMENT_BY_ID: Record<string, WorkingAgreement> = Object.fromEntries(
  WORKING_AGREEMENTS.map((a) => [a.id, a]),
);

export const AGREEMENT_SECTIONS: AgreementSection[] = [
  // Engineering ↔ Product
  { id: 'as-ep-1', agreementId: 'wa-eng-prod', key: 'mutual_needs', label: 'Mutual needs',
    body: 'Product brings a problem statement with assumptions. Engineering brings sequencing options with confidence levels. Neither team commits without both.',
    lastUpdatedAt: '2026-05-12T00:00:00Z' },
  { id: 'as-ep-2', agreementId: 'wa-eng-prod', key: 'required_inputs', label: 'Required inputs',
    body: 'Problem statement (PM) and feasibility note (EM) at least 48h before any commitment meeting.',
    lastUpdatedAt: '2026-05-12T00:00:00Z' },
  { id: 'as-ep-3', agreementId: 'wa-eng-prod', key: 'escalation_path', label: 'Escalation path',
    body: 'Blocked >24h: Maya (PM lead) and David (architecture). Unresolved >5 days: Director of Engineering.',
    lastUpdatedAt: '2026-05-12T00:00:00Z' },
  { id: 'as-ep-4', agreementId: 'wa-eng-prod', key: 'handoff_checklist', label: 'Handoff checklist',
    body: 'Problem statement signed off · feasibility note posted · estimate ranged not point · owner named · review date set.',
    lastUpdatedAt: '2026-05-12T00:00:00Z' },
  { id: 'as-ep-5', agreementId: 'wa-eng-prod', key: 'review_cadence', label: 'Review cadence',
    body: 'Reviewed every 90 days. Either side can request an out-of-cycle review when a recurring friction shows up twice.',
    lastUpdatedAt: '2026-05-12T00:00:00Z' },
  { id: 'as-ep-6', agreementId: 'wa-eng-prod', key: 'success_signals', label: 'Success signals',
    body: 'Fewer planning escalations. More decisions made async. Pre-read confirmation rate above 80%.',
    lastUpdatedAt: '2026-05-12T00:00:00Z' },

  // Product ↔ Sales
  { id: 'as-ps-1', agreementId: 'wa-prod-sales', key: 'mutual_needs', label: 'Mutual needs',
    body: 'Sales brings the customer signal with the pattern, not the anecdote. Product brings what is on the roadmap with realistic confidence.',
    lastUpdatedAt: '2026-04-04T00:00:00Z' },
  { id: 'as-ps-2', agreementId: 'wa-prod-sales', key: 'required_inputs', label: 'Required inputs',
    body: 'Top-account impact analysis (Sales) and roadmap-with-confidence note (Product) before any commitment to a customer.',
    lastUpdatedAt: '2026-04-04T00:00:00Z' },
  { id: 'as-ps-3', agreementId: 'wa-prod-sales', key: 'escalation_path', label: 'Escalation path',
    body: 'In-flight deal request: PM lead within 24h. Recurring roadmap pressure: Director of Product + Director of Sales monthly.',
    lastUpdatedAt: '2026-04-04T00:00:00Z' },
  { id: 'as-ps-4', agreementId: 'wa-prod-sales', key: 'handoff_checklist', label: 'Handoff checklist',
    body: 'Customer pattern documented · commitment language reviewed · timing in writing · CS looped before promise.',
    lastUpdatedAt: '2026-04-04T00:00:00Z' },
  { id: 'as-ps-5', agreementId: 'wa-prod-sales', key: 'review_cadence', label: 'Review cadence',
    body: 'Reviewed every 90 days.',
    lastUpdatedAt: '2026-04-04T00:00:00Z' },

  // CS ↔ Sales (in review)
  { id: 'as-cs-1', agreementId: 'wa-cs-sales', key: 'mutual_needs', label: 'Mutual needs',
    body: 'Sales: a clean handoff with the commitments written down. CS: warm intro to the buyer and the champion within 5 business days of close.',
    lastUpdatedAt: '2026-05-25T00:00:00Z' },
  { id: 'as-cs-2', agreementId: 'wa-cs-sales', key: 'required_inputs', label: 'Required inputs',
    body: 'Signed-off commitments doc (Sales). Onboarding plan (CS). Risk flags from discovery (Sales).',
    lastUpdatedAt: '2026-05-25T00:00:00Z' },
  { id: 'as-cs-3', agreementId: 'wa-cs-sales', key: 'handoff_checklist', label: 'Handoff checklist',
    body: 'Commitments doc shared · onboarding plan drafted · champion intro within 5 days · risk flags noted · CS owns the renewal narrative.',
    lastUpdatedAt: '2026-05-25T00:00:00Z' },
  { id: 'as-cs-4', agreementId: 'wa-cs-sales', key: 'escalation_path', label: 'Escalation path',
    body: 'Handoff incomplete >7 days: Head of CS + Director of Sales.',
    lastUpdatedAt: '2026-05-25T00:00:00Z' },
  { id: 'as-cs-5', agreementId: 'wa-cs-sales', key: 'review_cadence', label: 'Review cadence',
    body: 'Reviewed every 60 days while in early adoption.',
    lastUpdatedAt: '2026-05-25T00:00:00Z' },

  // Marketing ↔ Sales (draft)
  { id: 'as-ms-1', agreementId: 'wa-mktg-sales', key: 'mutual_needs', label: 'Mutual needs',
    body: 'Sales needs sharper messaging on the mid-market. Marketing needs structured deal feedback to refine positioning.',
    lastUpdatedAt: '2026-05-18T00:00:00Z' },
  { id: 'as-ms-2', agreementId: 'wa-mktg-sales', key: 'required_inputs', label: 'Required inputs',
    body: 'Monthly lost-deal patterns (Sales) and messaging tests (Marketing).',
    lastUpdatedAt: '2026-05-18T00:00:00Z' },

  // Strategy operating cadence
  { id: 'as-sa-1', agreementId: 'wa-strat-all', key: 'mutual_needs', label: 'Mutual needs',
    body: 'Strategy publishes the quarterly themes by week 2 of the quarter. Functional teams confirm or push back within one week.',
    lastUpdatedAt: '2026-05-02T00:00:00Z' },
  { id: 'as-sa-2', agreementId: 'wa-strat-all', key: 'required_inputs', label: 'Required inputs',
    body: 'Function leads send a 1-page operating-state note before the quarterly off-site.',
    lastUpdatedAt: '2026-05-02T00:00:00Z' },
  { id: 'as-sa-3', agreementId: 'wa-strat-all', key: 'escalation_path', label: 'Escalation path',
    body: 'Theme conflict unresolved >10 days: Director of Strategy + the two functional leads.',
    lastUpdatedAt: '2026-05-02T00:00:00Z' },
  { id: 'as-sa-4', agreementId: 'wa-strat-all', key: 'review_cadence', label: 'Review cadence',
    body: 'Reviewed at the start of each half. Decisions log preserved across cycles.',
    lastUpdatedAt: '2026-05-02T00:00:00Z' },
];

/* ─────────────────────────────────────────────────────────────────
   Collaboration plumbing
   ───────────────────────────────────────────────────────────────── */
export const COLLAB_NEEDS: CollaborationNeed[] = [
  { id: 'cn-1', ownerTeamId: 't-prod',  needFromTeamId: 't-eng',   description: 'Quarterly feasibility view on the in-flight roadmap.', cadence: 'quarterly', status: 'covered' },
  { id: 'cn-2', ownerTeamId: 't-cs',    needFromTeamId: 't-prod',  description: 'Honest delivery dates for known customer commitments.', cadence: 'monthly',   status: 'gap'    },
  { id: 'cn-3', ownerTeamId: 't-sales', needFromTeamId: 't-mktg',  description: 'Mid-market messaging refresh.',                          cadence: 'quarterly', status: 'open'   },
  { id: 'cn-4', ownerTeamId: 't-mktg',  needFromTeamId: 't-cs',    description: 'Customer language and lost-deal patterns.',              cadence: 'monthly',   status: 'covered' },
  { id: 'cn-5', ownerTeamId: 't-eng',   needFromTeamId: 't-prod',  description: 'Problem statements with assumptions stated.',            cadence: 'ad-hoc',    status: 'covered' },
  { id: 'cn-6', ownerTeamId: 't-strat', needFromTeamId: 't-eng',   description: 'Architecture posture against the next two quarters.',    cadence: 'half',      status: 'open'   },
];

export const COLLAB_OFFERS: CollaborationOffer[] = [
  { id: 'co-1', ownerTeamId: 't-eng',   offeredToTeamId: 't-prod', description: 'Async feasibility note within 48h of a problem statement.', sla: '48h',     active: true },
  { id: 'co-2', ownerTeamId: 't-cs',    offeredToTeamId: 't-mktg', description: 'Weekly customer signal digest with named patterns.',       sla: 'weekly',  active: true },
  { id: 'co-3', ownerTeamId: 't-prod',  offeredToTeamId: 't-sales',description: 'Pricing rationale memos for top-tier deals.',              sla: '5 days',  active: true },
  { id: 'co-4', ownerTeamId: 't-strat', offeredToTeamId: 't-eng',  description: 'Quarterly theme draft before week 2.',                     sla: 'quarterly', active: true },
];

export const DEPENDENCIES: Dependency[] = [
  { id: 'dep-1', fromTeamId: 't-prod',  toTeamId: 't-eng',   description: 'Mid-tier pricing rollout requires platform changes.', criticality: 'high',   status: 'at_risk' },
  { id: 'dep-2', fromTeamId: 't-cs',    toTeamId: 't-prod',  description: 'Renewal motion depends on bug burndown reaching target.', criticality: 'medium', status: 'clear' },
  { id: 'dep-3', fromTeamId: 't-mktg',  toTeamId: 't-prod',  description: 'August launch messaging waits on feature confirmation.', criticality: 'high',   status: 'at_risk' },
  { id: 'dep-4', fromTeamId: 't-sales', toTeamId: 't-cs',    description: 'Sales pipeline forecast assumes CS capacity for onboarding.', criticality: 'medium', status: 'clear' },
  { id: 'dep-5', fromTeamId: 't-strat', toTeamId: 't-prod',  description: 'Strategy off-site needs roadmap confidence levels.',     criticality: 'low',    status: 'blocked' },
];
