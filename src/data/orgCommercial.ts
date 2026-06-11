import type { OrgCommercialProfile, RevenueRole } from '../lib/types';

/**
 * Commercial profiles — ORGANIZATION-LEVEL ONLY. No individual targets,
 * quotas, attainment, or revenue metrics exist on any Person / RoleCard /
 * IndividualWorkCard. All 12 Tier-1 orgs carry a full profile; all 24 Tier-2
 * orgs carry at least a revenue role. Merged onto org cards at store seed.
 */

const FY = 'FY2026';

function p(
  revenueRole: RevenueRole,
  extra: Partial<OrgCommercialProfile> = {},
): OrgCommercialProfile {
  return { revenueRole, fiscalYear: FY, targets: [], keyCommercialMetrics: [], ...extra };
}

export const ORG_COMMERCIAL: Record<string, OrgCommercialProfile> = {
  /* ── Tier 1 — full profiles ──────────────────────────────────── */
  'o-sales': p('pl_owner', {
    headcount: 41,
    targets: [
      { metric: 'revenue', amount: 48_000_000, currency: 'USD', attainmentPct: 82 },
      { metric: 'pipeline', amount: 140_000_000, currency: 'USD', attainmentPct: 95 },
      { metric: 'bookings', amount: 52_000_000, currency: 'USD', attainmentPct: 78 },
    ],
    keyCommercialMetrics: ['Win rate', 'Avg deal cycle', 'Quota coverage', 'Stage conversion'],
  }),
  'o-cs': p('revenue_generating', {
    headcount: 33,
    targets: [
      { metric: 'renewals', amount: 38_000_000, currency: 'USD', attainmentPct: 91 },
      { metric: 'nrr', amount: 112, currency: 'USD', attainmentPct: 93 },
    ],
    keyCommercialMetrics: ['NRR', 'Gross retention', 'Time to value', 'Expansion rate'],
  }),
  'o-prod': p('revenue_influencing', {
    headcount: 19,
    keyCommercialMetrics: ['Feature adoption', 'Roadmap confidence', 'Influenced pipeline'],
  }),
  'o-eng': p('enablement', {
    headcount: 64,
    keyCommercialMetrics: ['SLO attainment', 'Lead time', 'Change failure rate'],
  }),
  'o-ea': p('enablement', {
    headcount: 14,
    keyCommercialMetrics: ['Pattern adoption', 'Architecture exceptions'],
  }),
  'o-data': p('enablement', {
    headcount: 21,
    keyCommercialMetrics: ['Decision adoption', 'Data quality', 'Model reliability'],
  }),
  'o-sec': p('enablement', {
    headcount: 17,
    keyCommercialMetrics: ['Mean time to remediate', 'Control coverage', 'Audit findings closed'],
  }),
  'o-pmo': p('enablement', {
    headcount: 18,
    keyCommercialMetrics: ['On-time delivery', 'Dependency clarity', 'Decision latency'],
  }),
  'o-fin': p('shared_service', {
    headcount: 26, costCenterCode: 'FIN-100',
    targets: [{ metric: 'cost_savings', amount: 6_000_000, currency: 'USD', attainmentPct: 70 }],
    keyCommercialMetrics: ['Forecast accuracy', 'Close cycle time', 'Control exceptions'],
  }),
  'o-hr': p('shared_service', {
    headcount: 22, costCenterCode: 'HR-100',
    keyCommercialMetrics: ['Time to hire', 'Retention', 'Manager satisfaction'],
  }),
  'o-legal': p('enablement', {
    headcount: 12,
    keyCommercialMetrics: ['Review turnaround', 'Intake completeness', 'Escalations avoided'],
  }),
  'o-ops': p('shared_service', {
    headcount: 38, costCenterCode: 'OPS-100',
    targets: [{ metric: 'cost_savings', amount: 4_000_000, currency: 'USD', attainmentPct: 64 }],
    keyCommercialMetrics: ['SLA attainment', 'Throughput', 'Backlog age'],
  }),

  /* ── Tier 2 — revenue role (+ a target/metric where it matters) ── */
  'o-exec': p('pl_owner', { targets: [{ metric: 'revenue', amount: 210_000_000, currency: 'USD', attainmentPct: 86 }], keyCommercialMetrics: ['Enterprise revenue', 'Operating margin'] }),
  'o-strat': p('enablement', { keyCommercialMetrics: ['Strategy adoption'] }),
  'o-sa': p('revenue_influencing', { keyCommercialMetrics: ['Technical win rate', 'POC conversion'] }),
  'o-plat': p('enablement', { keyCommercialMetrics: ['Deploy frequency', 'Developer NPS'] }),
  'o-cloud': p('cost_center', { costCenterCode: 'INFRA-200', targets: [{ metric: 'cost_savings', amount: 3_000_000, currency: 'USD', attainmentPct: 58 }], keyCommercialMetrics: ['Cloud unit cost'] }),
  'o-netops': p('cost_center', { costCenterCode: 'NET-200', keyCommercialMetrics: ['Uptime', 'Cost per circuit'] }),
  'o-itsd': p('cost_center', { costCenterCode: 'ITSD-200', keyCommercialMetrics: ['Cost per ticket', 'CSAT'] }),
  'o-grc': p('enablement', { keyCommercialMetrics: ['Control coverage', 'Audit readiness'] }),
  'o-revops': p('revenue_influencing', { keyCommercialMetrics: ['Forecast accuracy', 'Funnel conversion'] }),
  'o-mktg': p('revenue_influencing', { targets: [{ metric: 'pipeline', amount: 60_000_000, currency: 'USD', attainmentPct: 88 }], keyCommercialMetrics: ['Sourced pipeline', 'CAC', 'MQL→SQL'] }),
  'o-partner': p('revenue_influencing', { targets: [{ metric: 'pipeline', amount: 22_000_000, currency: 'USD', attainmentPct: 71 }], keyCommercialMetrics: ['Partner-sourced revenue', 'Co-sell rate'] }),
  'o-support': p('enablement', { costCenterCode: 'SUP-300', keyCommercialMetrics: ['Resolution time', 'CSAT', 'Escalation rate'] }),
  'o-ps': p('revenue_generating', { targets: [{ metric: 'revenue', amount: 14_000_000, currency: 'USD', attainmentPct: 76 }], keyCommercialMetrics: ['Services revenue', 'Utilization', 'Margin'] }),
  'o-deliv': p('enablement', { keyCommercialMetrics: ['On-time delivery', 'Plan variance'] }),
  'o-ta': p('shared_service', { costCenterCode: 'TA-100', keyCommercialMetrics: ['Time to hire', 'Offer accept rate'] }),
  'o-ld': p('cost_center', { costCenterCode: 'LD-100', keyCommercialMetrics: ['Course completion', 'Skill coverage'] }),
  'o-proc': p('shared_service', { targets: [{ metric: 'cost_savings', amount: 5_000_000, currency: 'USD', attainmentPct: 67 }], keyCommercialMetrics: ['Savings captured', 'Cycle time'] }),
  'o-fac': p('cost_center', { costCenterCode: 'FAC-200', keyCommercialMetrics: ['Cost per seat', 'Utilization'] }),
  'o-audit': p('shared_service', { keyCommercialMetrics: ['Findings closed', 'Coverage'] }),
  'o-region': p('shared_service', { keyCommercialMetrics: ['Regional SLA', 'Local compliance'] }),
  'o-cx': p('revenue_influencing', { keyCommercialMetrics: ['CSAT', 'Journey friction', 'Influenced retention'] }),
  'o-qa': p('enablement', { keyCommercialMetrics: ['Escaped defects', 'Release confidence'] }),
  'o-supply': p('cost_center', { costCenterCode: 'SCM-200', targets: [{ metric: 'cost_savings', amount: 2_500_000, currency: 'USD', attainmentPct: 61 }], keyCommercialMetrics: ['Landed cost', 'On-time supply'] }),
  'o-change': p('enablement', { keyCommercialMetrics: ['Adoption rate', 'Change readiness'] }),
};
