import type { OrgNeed, OrgOffer } from '../lib/types';

/**
 * Cross-organization needs and offers (v3, organization-first).
 *
 * NEEDS  — what an organization requires *from* another to do its work well.
 * OFFERS — what an organization provides *to* another as a service/output.
 *
 * Centered on the 12 Tier-1 organizations, with several reaching into Tier-2.
 * Needs and offers are reciprocal in spirit: where one org needs an input,
 * the providing org carries a matching offer.
 *
 * Org-level only. No individual names, no ranking, no personality/performance
 * language. `coveredByAgreementId` is set only when a 'covered' need's pair
 * matches an existing Success Agreement.
 */

export const ORG_NEEDS: OrgNeed[] = [
  /* ── Engineering ────────────────────────────────────────────── */
  {
    id: 'need-eng-prod',
    ownerOrgId: 'o-eng',
    needFromOrgId: 'o-prod',
    description: 'Prioritized problem statements with acceptance criteria and the outcome each item should move.',
    format: 'Written brief',
    timing: '1 sprint ahead',
    status: 'covered',
    coveredByAgreementId: 'sa-prod-eng',
  },
  {
    id: 'need-eng-plat',
    ownerOrgId: 'o-eng',
    needFromOrgId: 'o-plat',
    description: 'Stable CI/CD pipelines and pre-provisioned environments for feature branches.',
    format: 'Self-service platform',
    timing: 'On demand',
    status: 'covered',
    coveredByAgreementId: 'sa-eng-plat',
  },
  {
    id: 'need-eng-sec',
    ownerOrgId: 'o-eng',
    needFromOrgId: 'o-sec',
    description: 'Threat models and secure-by-default patterns for new services before design freeze.',
    format: 'Review checklist',
    timing: 'At design review',
    status: 'open',
  },

  /* ── Product Management ─────────────────────────────────────── */
  {
    id: 'need-prod-eng',
    ownerOrgId: 'o-prod',
    needFromOrgId: 'o-eng',
    description: 'Feasibility assessments and rough effort sizing for candidate roadmap items.',
    format: 'Estimate notes',
    timing: 'At intake',
    status: 'covered',
    coveredByAgreementId: 'sa-prod-eng',
  },
  {
    id: 'need-prod-data',
    ownerOrgId: 'o-prod',
    needFromOrgId: 'o-data',
    description: 'Usage and funnel analytics tied to feature hypotheses for prioritization.',
    format: 'Dashboard',
    timing: 'Weekly',
    status: 'open',
  },
  {
    id: 'need-prod-cs',
    ownerOrgId: 'o-prod',
    needFromOrgId: 'o-cs',
    description: 'Themed customer pain signals with frequency and account impact.',
    format: 'Written brief',
    timing: 'Monthly',
    status: 'covered',
    coveredByAgreementId: 'sa-cs-prod',
  },

  /* ── Sales ──────────────────────────────────────────────────── */
  {
    id: 'need-sales-legal',
    ownerOrgId: 'o-sales',
    needFromOrgId: 'o-legal',
    description: 'Contract redline turnaround on non-standard commercial terms.',
    format: 'Ticket',
    timing: '48h ahead',
    status: 'covered',
    coveredByAgreementId: 'sa-sales-legal',
  },
  {
    id: 'need-sales-sa',
    ownerOrgId: 'o-sales',
    needFromOrgId: 'o-sa',
    description: 'Technical validation and solution fit confirmation for in-flight opportunities.',
    format: 'Scoping doc',
    timing: 'Per opportunity',
    status: 'covered',
    coveredByAgreementId: 'sa-sales-sa',
  },
  {
    id: 'need-sales-mktg',
    ownerOrgId: 'o-sales',
    needFromOrgId: 'o-mktg',
    description: 'Qualified pipeline with consistent lead-stage definitions and handoff context.',
    format: 'CRM record',
    timing: 'At handoff',
    status: 'gap',
  },

  /* ── Customer Success ──────────────────────────────────────── */
  {
    id: 'need-cs-prod',
    ownerOrgId: 'o-cs',
    needFromOrgId: 'o-prod',
    description: 'Roadmap visibility and committed dates for features tied to renewal risk.',
    format: 'Written brief',
    timing: 'Quarterly',
    status: 'covered',
    coveredByAgreementId: 'sa-cs-prod',
  },
  {
    id: 'need-cs-support',
    ownerOrgId: 'o-cs',
    needFromOrgId: 'o-support',
    description: 'Escalation status and resolution ETAs on tickets affecting strategic accounts.',
    format: 'Ticket',
    timing: 'Same day',
    status: 'covered',
    coveredByAgreementId: 'sa-cs-support',
  },
  {
    id: 'need-cs-ps',
    ownerOrgId: 'o-cs',
    needFromOrgId: 'o-ps',
    description: 'Implementation milestone status and go-live readiness for onboarding accounts.',
    format: 'Status report',
    timing: 'Weekly',
    status: 'open',
  },

  /* ── People Operations ─────────────────────────────────────── */
  {
    id: 'need-hr-fin',
    ownerOrgId: 'o-hr',
    needFromOrgId: 'o-fin',
    description: 'Approved headcount budget and compensation bands by organization.',
    format: 'Spreadsheet',
    timing: 'At planning cycle',
    status: 'covered',
    coveredByAgreementId: 'sa-hr-fin',
  },
  {
    id: 'need-hr-ta',
    ownerOrgId: 'o-hr',
    needFromOrgId: 'o-ta',
    description: 'Pipeline health and time-to-fill by requisition for workforce planning.',
    format: 'Dashboard',
    timing: 'Weekly',
    status: 'open',
  },

  /* ── Finance ───────────────────────────────────────────────── */
  {
    id: 'need-fin-ops',
    ownerOrgId: 'o-fin',
    needFromOrgId: 'o-ops',
    description: 'Operating cadence inputs and actuals reconciliation for close.',
    format: 'Spreadsheet',
    timing: 'Monthly',
    status: 'gap',
  },
  {
    id: 'need-fin-proc',
    ownerOrgId: 'o-fin',
    needFromOrgId: 'o-proc',
    description: 'Committed spend and vendor contract terms feeding the forecast.',
    format: 'Written brief',
    timing: 'At signature',
    status: 'open',
  },

  /* ── Program Management ────────────────────────────────────── */
  {
    id: 'need-pmo-eng',
    ownerOrgId: 'o-pmo',
    needFromOrgId: 'o-eng',
    description: 'Cross-team delivery status and dependency risk flags for the program plan.',
    format: 'Status report',
    timing: 'Weekly',
    status: 'covered',
    coveredByAgreementId: 'sa-pmo-eng',
  },
  {
    id: 'need-pmo-prod',
    ownerOrgId: 'o-pmo',
    needFromOrgId: 'o-prod',
    description: 'Scope decisions and tradeoff calls that affect the critical path.',
    format: 'Decision log',
    timing: 'At intake',
    status: 'gap',
  },

  /* ── Security ──────────────────────────────────────────────── */
  {
    id: 'need-sec-itsd',
    ownerOrgId: 'o-sec',
    needFromOrgId: 'o-itsd',
    description: 'Endpoint inventory and access change records for control monitoring.',
    format: 'Dashboard',
    timing: 'Daily',
    status: 'covered',
    coveredByAgreementId: 'sa-sec-itsd',
  },

  /* ── Data & AI ─────────────────────────────────────────────── */
  {
    id: 'need-data-ops',
    ownerOrgId: 'o-data',
    needFromOrgId: 'o-ops',
    description: 'Authoritative source-system access and definitions for the operating data model.',
    format: 'Data contract',
    timing: 'At onboarding',
    status: 'covered',
    coveredByAgreementId: 'sa-data-ops',
  },
  {
    id: 'need-data-eng',
    ownerOrgId: 'o-data',
    needFromOrgId: 'o-eng',
    description: 'Event instrumentation and schema stability for product analytics pipelines.',
    format: 'Written brief',
    timing: 'Per release',
    status: 'gap',
  },

  /* ── Legal ─────────────────────────────────────────────────── */
  {
    id: 'need-legal-proc',
    ownerOrgId: 'o-legal',
    needFromOrgId: 'o-proc',
    description: 'Complete intake packet (counterparty, value, risk flags) before contract review.',
    format: 'Intake form',
    timing: 'At intake',
    status: 'covered',
    coveredByAgreementId: 'sa-proc-legal',
  },
  {
    id: 'need-legal-sec',
    ownerOrgId: 'o-legal',
    needFromOrgId: 'o-sec',
    description: 'Security posture summaries for vendor and data-processing risk assessment.',
    format: 'Written brief',
    timing: 'Per review',
    status: 'open',
  },

  /* ── Operations ────────────────────────────────────────────── */
  {
    id: 'need-ops-fin',
    ownerOrgId: 'o-ops',
    needFromOrgId: 'o-fin',
    description: 'Budget-versus-actual signals to drive the operating review agenda.',
    format: 'Dashboard',
    timing: 'Monthly',
    status: 'open',
  },
];

export const ORG_OFFERS: OrgOffer[] = [
  /* ── Product → Engineering (reciprocal to need-eng-prod) ────── */
  {
    id: 'offer-prod-eng',
    ownerOrgId: 'o-prod',
    offeredToOrgId: 'o-eng',
    description: 'Roadmap clarity: prioritized briefs with outcomes, acceptance criteria, and rationale.',
    serviceLevel: 'Refreshed each sprint',
    active: true,
  },
  /* ── Engineering → Product (reciprocal to need-prod-eng) ────── */
  {
    id: 'offer-eng-prod',
    ownerOrgId: 'o-eng',
    offeredToOrgId: 'o-prod',
    description: 'Feasibility and effort sizing for candidate roadmap items.',
    serviceLevel: '3 business days',
    active: true,
  },
  /* ── Platform → Engineering (reciprocal to need-eng-plat) ───── */
  {
    id: 'offer-plat-eng',
    ownerOrgId: 'o-plat',
    offeredToOrgId: 'o-eng',
    description: 'Paved-road CI/CD pipelines and on-demand ephemeral environments.',
    serviceLevel: 'Same day for P1',
    active: true,
  },
  /* ── Security → Engineering (reciprocal to need-eng-sec) ────── */
  {
    id: 'offer-sec-eng',
    ownerOrgId: 'o-sec',
    offeredToOrgId: 'o-eng',
    description: 'Threat modeling and secure-by-default reference patterns for new services.',
    serviceLevel: '5 business days',
    active: true,
  },
  /* ── Data → Product (reciprocal to need-prod-data) ──────────── */
  {
    id: 'offer-data-prod',
    ownerOrgId: 'o-data',
    offeredToOrgId: 'o-prod',
    description: 'Self-serve usage and funnel dashboards mapped to feature hypotheses.',
    serviceLevel: 'Refreshed weekly',
    active: true,
  },
  /* ── Customer Success → Product (reciprocal to need-prod-cs) ── */
  {
    id: 'offer-cs-prod',
    ownerOrgId: 'o-cs',
    offeredToOrgId: 'o-prod',
    description: 'Themed customer pain signals with frequency and account-impact weighting.',
    serviceLevel: 'Monthly digest',
    active: true,
  },
  /* ── Legal → Sales (reciprocal to need-sales-legal) ─────────── */
  {
    id: 'offer-legal-sales',
    ownerOrgId: 'o-legal',
    offeredToOrgId: 'o-sales',
    description: 'Commercial redline reviews and a pre-approved fallback clause library.',
    serviceLevel: '48h for standard terms',
    active: true,
  },
  /* ── Solution Architecture → Sales (reciprocal need-sales-sa) ─ */
  {
    id: 'offer-sa-sales',
    ownerOrgId: 'o-sa',
    offeredToOrgId: 'o-sales',
    description: 'Technical validation and solution-fit scoping for active opportunities.',
    serviceLevel: '2 business days per opportunity',
    active: true,
  },
  /* ── Marketing → Sales (reciprocal to need-sales-mktg) ──────── */
  {
    id: 'offer-mktg-sales',
    ownerOrgId: 'o-mktg',
    offeredToOrgId: 'o-sales',
    description: 'Qualified pipeline handoff with shared lead-stage definitions and context.',
    serviceLevel: 'Daily sync',
    active: false,
  },
  /* ── Product → Customer Success (reciprocal to need-cs-prod) ── */
  {
    id: 'offer-prod-cs',
    ownerOrgId: 'o-prod',
    offeredToOrgId: 'o-cs',
    description: 'Roadmap visibility and committed dates for renewal-critical features.',
    serviceLevel: 'Quarterly briefing',
    active: true,
  },
  /* ── Support → Customer Success (reciprocal to need-cs-support)─ */
  {
    id: 'offer-support-cs',
    ownerOrgId: 'o-support',
    offeredToOrgId: 'o-cs',
    description: 'Escalation status and resolution ETAs on strategic-account tickets.',
    serviceLevel: 'Same day for P1',
    active: true,
  },
  /* ── Finance → People Operations (reciprocal to need-hr-fin) ── */
  {
    id: 'offer-fin-hr',
    ownerOrgId: 'o-fin',
    offeredToOrgId: 'o-hr',
    description: 'Approved headcount budget and compensation bands by organization.',
    serviceLevel: 'Per planning cycle',
    active: true,
  },
  /* ── Talent Acquisition → People Operations (need-hr-ta) ────── */
  {
    id: 'offer-ta-hr',
    ownerOrgId: 'o-ta',
    offeredToOrgId: 'o-hr',
    description: 'Pipeline health and time-to-fill reporting by requisition.',
    serviceLevel: 'Weekly dashboard',
    active: true,
  },
  /* ── Engineering → Program Management (reciprocal need-pmo-eng)─ */
  {
    id: 'offer-eng-pmo',
    ownerOrgId: 'o-eng',
    offeredToOrgId: 'o-pmo',
    description: 'Delivery status and dependency-risk flags feeding the program plan.',
    serviceLevel: 'Weekly update',
    active: true,
  },
  /* ── IT Service Desk → Security (reciprocal to need-sec-itsd) ─ */
  {
    id: 'offer-itsd-sec',
    ownerOrgId: 'o-itsd',
    offeredToOrgId: 'o-sec',
    description: 'Endpoint inventory and access-change feeds for control monitoring.',
    serviceLevel: 'Daily feed',
    active: true,
  },
  /* ── Operations → Data & AI (reciprocal to need-data-ops) ───── */
  {
    id: 'offer-ops-data',
    ownerOrgId: 'o-ops',
    offeredToOrgId: 'o-data',
    description: 'Governed source-system access and shared operating-data definitions.',
    serviceLevel: 'Onboarding within 10 business days',
    active: true,
  },
  /* ── Procurement → Legal (reciprocal to need-legal-proc) ────── */
  {
    id: 'offer-proc-legal',
    ownerOrgId: 'o-proc',
    offeredToOrgId: 'o-legal',
    description: 'Complete intake packets with counterparty, value, and risk flags.',
    serviceLevel: 'At intake, pre-validated',
    active: true,
  },
  /* ── Finance → Operations (reciprocal to need-ops-fin) ──────── */
  {
    id: 'offer-fin-ops',
    ownerOrgId: 'o-fin',
    offeredToOrgId: 'o-ops',
    description: 'Budget-versus-actual signals for the monthly operating review.',
    serviceLevel: 'Monthly',
    active: false,
  },
];

export const ORG_NEEDS_BY_ID: Record<string, OrgNeed> =
  Object.fromEntries(ORG_NEEDS.map((n) => [n.id, n]));

export const ORG_OFFERS_BY_ID: Record<string, OrgOffer> =
  Object.fromEntries(ORG_OFFERS.map((o) => [o.id, o]));
