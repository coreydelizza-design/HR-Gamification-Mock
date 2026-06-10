import type { OrgPack, MeetingFitRule, BadgeLanguagePack, OrganizationCategory } from '../lib/types';

/**
 * Org Packs — function-specific configuration bundles. A pack drives the
 * required card sections, intake fields, meeting-fit rules, handoff and
 * decision-rights templates, success metrics, freshness cadence, badge
 * language, and nudge cadence for the organizations assigned to it.
 *
 * The mechanism is the v2 OrgPack; v3 expands the catalog from 3 to 11.
 */

const ORG_BADGE_LANGUAGE: BadgeLanguagePack = {
  meetingReady: 'Meeting Fit Ready',
  teamGuidePublished: 'Org Card Published',
  handoffClarityAchieved: 'Handoff Ready',
  agreementVerified: 'Agreement Verified',
  freshThisQuarter: 'Fresh This Quarter',
  escalationPathClear: 'Escalation Path Clear',
  asyncFriendly: 'Inputs Defined',
  decisionPathMapped: 'Decision Rights Clear',
  partnerTeamReady: 'Partner Org Ready',
};

const BASE_FIT_RULES: MeetingFitRule[] = [
  { id: 'ofr-1', label: 'Required orgs represented', description: 'Every organization the decision touches has an attendee who can speak for it.' },
  { id: 'ofr-2', label: 'Decision owner present', description: 'A single named decision owner is in the room.' },
  { id: 'ofr-3', label: 'Required inputs received', description: 'Inputs from upstream organizations are accounted for before the meeting.' },
  { id: 'ofr-4', label: 'Agreement applies', description: 'If a Success Agreement governs the relationship, it is referenced.' },
  { id: 'ofr-5', label: 'Async-first when possible', description: 'Status-only syncs are recommended as written updates.' },
];

const REQUIRED_CORE = ['how_succeeds', 'what_owns', 'what_needs', 'how_helps', 'engagement'];
const OPTIONAL_CORE = ['meeting_norms', 'handoff_rules', 'dependencies', 'risks', 'people', 'freshness'];

function pack(
  id: string,
  name: string,
  category: OrganizationCategory,
  description: string,
  extras: Partial<OrgPack>,
): OrgPack {
  return {
    id, name, description,
    requiredCardSections: REQUIRED_CORE,
    optionalCardSections: OPTIONAL_CORE,
    teamTemplate: 'org-template-default',
    meetingFitRules: BASE_FIT_RULES,
    visibilityDefault: 'org',
    badgeLanguage: ORG_BADGE_LANGUAGE,
    nudgeCadenceDays: 14,
    dataRetentionDays: 730,
    appliesToCategory: category,
    freshnessCadenceDays: 90,
    ...extras,
  };
}

export const ORG_PACKS: OrgPack[] = [
  pack('pack-exec', 'Executive Office', 'leadership',
    'Direction-setting and cross-org tradeoffs. Emphasizes decision rights and stakeholder outcomes.', {
    requiredCardSections: ['how_succeeds', 'what_owns', 'engagement', 'how_helps'],
    intakeFields: ['Decision requested', 'Options considered', 'Cross-org impact', 'Recommendation'],
    handoffTemplate: ['Decision memo published', 'Owner named', 'Affected orgs notified', 'Review date set'],
    decisionRightsTemplate: ['Capital allocation', 'Org structure', 'Cross-org tradeoffs', 'Strategic themes'],
    successMetrics: ['Decision cycle time', 'Strategy adoption', 'Cross-org alignment'],
    freshnessCadenceDays: 60,
  }),
  pack('pack-sales', 'Sales', 'revenue',
    'Pipeline and commercial commitments. Emphasizes intake quality and handoff to delivery.', {
    intakeFields: ['Account', 'Deal stage', 'Commercial terms', 'Requested commitments', 'Close date'],
    handoffTemplate: ['Signed scope documented', 'Commitments logged', 'CS handoff brief sent', 'Decision owner confirmed'],
    decisionRightsTemplate: ['Deal qualification', 'Discount within policy', 'Commitment above threshold'],
    successMetrics: ['Forecast accuracy', 'Handoff completeness', 'Commitment-to-scope match'],
    nudgeCadenceDays: 7,
  }),
  pack('pack-engineering', 'Engineering', 'technology',
    'Platform and delivery. Emphasizes problem framing in, reliability out, and architecture alignment.', {
    intakeFields: ['Problem statement', 'Assumptions', 'Constraints', 'Success criteria', 'Target date'],
    handoffTemplate: ['Definition of ready met', 'Architecture reviewed', 'Tests and rollback defined', 'Owner accepts'],
    decisionRightsTemplate: ['Architecture and platform choices', 'Production change windows', 'Incident severity'],
    successMetrics: ['Reliability (SLO attainment)', 'Lead time', 'Change failure rate'],
  }),
  pack('pack-legal', 'Legal', 'finance_legal',
    'Commercial and regulatory review. Emphasizes complete intake to accelerate turnaround.', {
    requiredCardSections: ['what_needs', 'how_helps', 'engagement', 'handoff_rules'],
    intakeFields: ['Counterparty', 'Contract type', 'Deal value', 'Deadline', 'Standard vs. non-standard terms'],
    handoffTemplate: ['Intake complete', 'Risk flagged', 'Redlines returned', 'Approval recorded'],
    decisionRightsTemplate: ['Acceptable risk position', 'Non-standard term approval', 'Regulatory interpretation'],
    successMetrics: ['Review turnaround', 'Intake completeness', 'Escalations avoided'],
    visibilityDefault: 'partners',
    dataRetentionDays: 2555,
  }),
  pack('pack-hr', 'People Operations', 'people',
    'Hiring, growth, and retention. Carries stricter visibility for sensitive context.', {
    intakeFields: ['Request type', 'Org and role', 'Headcount approval', 'Timing', 'Budget owner'],
    handoffTemplate: ['Approval confirmed', 'Owner assigned', 'Affected manager briefed', 'SLA set'],
    decisionRightsTemplate: ['Hiring bar', 'Leveling', 'Policy interpretation'],
    successMetrics: ['Time to hire', 'Retention', 'Manager satisfaction'],
    visibilityDefault: 'partners',
    nudgeCadenceDays: 21,
  }),
  pack('pack-finance', 'Finance', 'finance_legal',
    'Planning, capital allocation, and controls. Emphasizes decision support and review cadence.', {
    intakeFields: ['Request', 'Cost center', 'Amount', 'Business case', 'Approver'],
    handoffTemplate: ['Numbers validated', 'Assumptions stated', 'Approval routed', 'Booked'],
    decisionRightsTemplate: ['Budget approval within policy', 'Capital allocation recommendation', 'Forecast sign-off'],
    successMetrics: ['Forecast accuracy', 'Close cycle time', 'Control exceptions'],
    visibilityDefault: 'partners',
    dataRetentionDays: 2555,
  }),
  pack('pack-cs', 'Customer Success', 'customer',
    'Retention and expansion. Emphasizes early engagement and customer-signal handoffs.', {
    intakeFields: ['Account', 'Health status', 'Renewal date', 'Risk', 'Requested support'],
    handoffTemplate: ['Context captured', 'Owner assigned', 'Customer impact stated', 'Follow-up scheduled'],
    decisionRightsTemplate: ['Customer-facing commitment within scope', 'Health interpretation', 'Renewal recommendation'],
    successMetrics: ['Net retention', 'Time to value', 'Escalation resolution time'],
  }),
  pack('pack-security', 'Security', 'technology',
    'Risk reduction by default. Stricter visibility and longer retention.', {
    requiredCardSections: ['how_succeeds', 'what_owns', 'what_needs', 'engagement', 'handoff_rules'],
    intakeFields: ['Request type', 'System or data scope', 'Sensitivity', 'Deadline', 'Risk owner'],
    handoffTemplate: ['Scope confirmed', 'Controls validated', 'Exceptions documented', 'Sign-off recorded'],
    decisionRightsTemplate: ['Risk acceptance', 'Control requirement', 'Incident severity and response'],
    successMetrics: ['Mean time to remediate', 'Control coverage', 'Audit findings closed'],
    visibilityDefault: 'partners',
    nudgeCadenceDays: 21,
    dataRetentionDays: 2555,
  }),
  pack('pack-pmo', 'Program Management', 'operations',
    'Cross-org delivery and product cadence. Emphasizes dependencies and decision flow.', {
    requiredCardSections: ['how_succeeds', 'what_owns', 'what_needs', 'how_helps', 'engagement', 'meeting_norms'],
    intakeFields: ['Program or initiative', 'Sponsor', 'Dependencies', 'Milestones', 'Risk'],
    handoffTemplate: ['RACI confirmed', 'Dependencies mapped', 'Decision log current', 'Owner accepts'],
    decisionRightsTemplate: ['Operating cadence', 'Scope-change routing', 'Milestone gating'],
    successMetrics: ['On-time delivery', 'Dependency clarity', 'Decision latency'],
  }),
  pack('pack-data', 'Data & AI', 'technology',
    'Trustworthy decisions and intelligent features. Emphasizes data quality inputs.', {
    intakeFields: ['Question or use case', 'Data sources', 'Decision it informs', 'Quality bar', 'Deadline'],
    handoffTemplate: ['Hypothesis stated', 'Data validated', 'Methodology documented', 'Result reviewed'],
    decisionRightsTemplate: ['Metric definitions', 'Model deployment', 'Data access policy'],
    successMetrics: ['Decision adoption', 'Data quality', 'Model reliability'],
  }),
  pack('pack-operations', 'Operations', 'operations',
    'Business operating systems and internal services. The default for operations-category orgs.', {
    intakeFields: ['Request type', 'Org served', 'Priority', 'Needed by', 'Owner'],
    handoffTemplate: ['Request scoped', 'Owner assigned', 'SLA confirmed', 'Closure verified'],
    decisionRightsTemplate: ['Service prioritization', 'Process standard', 'Tooling choice'],
    successMetrics: ['SLA attainment', 'Throughput', 'Backlog age'],
  }),
];

export const ORG_PACK_BY_ID: Record<string, OrgPack> =
  Object.fromEntries(ORG_PACKS.map((p) => [p.id, p]));

/** The enterprise-default pack used when an org's pack cannot be resolved. */
export const DEFAULT_ORG_PACK: OrgPack =
  ORG_PACK_BY_ID['pack-operations'] ?? ORG_PACKS[0];
