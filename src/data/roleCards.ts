import type { RoleCard, RoleBand } from '../lib/types';
import { PEOPLE } from './people';

/**
 * Role cards + person→organization mapping. The individual work cards
 * (people.ts) survive only as nested supporting context inside an
 * Organization Card's People section, and inline in Meeting Fit detail.
 *
 * Hierarchy: Organization → Role → Individual.
 */

/** Which organization each demo person belongs to (their work card nests here). */
export const ORG_OF_PERSON: Record<string, string> = {
  'p-me': 'o-strat',   // Tom Murray — Director of Strategy
  'p-mc': 'o-prod',    // Maya Chen — Director, Product
  'p-mr': 'o-eng',     // Marcus Rivera — Sr Engineering Manager
  'p-pp': 'o-mktg',    // Priya Patel — Marketing Director
  'p-jw': 'o-sales',   // James Wilson — Sr Director, Sales
  'p-sk': 'o-cs',      // Sara Kowalski — VP Customer Success
  'p-dk': 'o-data',    // David Kim — Data Science Lead
};

export const PEOPLE_BY_ORG: Record<string, string[]> = PEOPLE.reduce((acc, p) => {
  const orgId = ORG_OF_PERSON[p.id];
  if (orgId) (acc[orgId] ??= []).push(p.id);
  return acc;
}, {} as Record<string, string[]>);

export const ROLE_CARDS: RoleCard[] = [
  {
    id: 'rc-strat-lead', orgId: 'o-strat', title: 'Director of Strategy', personId: 'p-me', roleBand: 'director',
    responsibilities: ['Cross-team operating cadence', 'Strategic planning rituals', 'Executive alignment'],
    decisionRights: ['Quarterly theme nomination', 'Cross-team coordination'],
    smeTags: ['Strategy', 'Operating cadence', 'Decision memos'],
  },
  {
    id: 'rc-prod-lead', orgId: 'o-prod', title: 'Director, Product', personId: 'p-mc', roleBand: 'director',
    responsibilities: ['Product roadmap', 'Problem framing', 'Research synthesis'],
    decisionRights: ['Roadmap order', 'Definition of done for a feature'],
    smeTags: ['Product', 'Prioritization', 'Discovery'],
  },
  {
    id: 'rc-eng-lead', orgId: 'o-eng', title: 'Sr Engineering Manager', personId: 'p-mr', roleBand: 'manager',
    responsibilities: ['Delivery', 'Team health', 'Incident response'],
    decisionRights: ['Delivery sequencing', 'On-call policy'],
    smeTags: ['Engineering delivery', 'Reliability', 'Team leadership'],
  },
  {
    id: 'rc-mktg-lead', orgId: 'o-mktg', title: 'Marketing Director', personId: 'p-pp', roleBand: 'director',
    responsibilities: ['Positioning', 'Demand gen', 'Brand'],
    decisionRights: ['Positioning and messaging', 'Campaign timing'],
    smeTags: ['Positioning', 'Campaigns', 'Brand'],
  },
  {
    id: 'rc-sales-lead', orgId: 'o-sales', title: 'Sr Director, Sales', personId: 'p-jw', roleBand: 'director',
    responsibilities: ['Pipeline progression', 'Discovery quality', 'Commitments to prospects'],
    decisionRights: ['Deal qualification', 'Discount within policy'],
    smeTags: ['Sales', 'Forecasting', 'Deal handoffs'],
  },
  {
    id: 'rc-cs-lead', orgId: 'o-cs', title: 'VP Customer Success', personId: 'p-sk', roleBand: 'vp',
    responsibilities: ['Onboarding', 'Renewal motion', 'Customer health'],
    decisionRights: ['Customer-facing commitments within scope', 'Renewal recommendation'],
    smeTags: ['Customer success', 'Retention', 'Escalations'],
  },
  {
    id: 'rc-data-lead', orgId: 'o-data', title: 'Data Science Lead', personId: 'p-dk', roleBand: 'senior_ic',
    responsibilities: ['Data platform', 'Decision science', 'Model reliability'],
    decisionRights: ['Metric definitions', 'Model deployment'],
    smeTags: ['Data', 'Modeling', 'Experimentation'],
  },
];

export const ROLE_CARDS_BY_ORG: Record<string, RoleCard[]> = ROLE_CARDS.reduce((acc, rc) => {
  (acc[rc.orgId] ??= []).push(rc);
  return acc;
}, {} as Record<string, RoleCard[]>);

export const ROLE_CARD_BY_PERSON: Record<string, RoleCard> = ROLE_CARDS.reduce((acc, rc) => {
  if (rc.personId) acc[rc.personId] = rc;
  return acc;
}, {} as Record<string, RoleCard>);

/** A person's role band comes from their seat (role card), never from comp. */
export function roleBandOfPerson(personId: string): RoleBand {
  return ROLE_CARD_BY_PERSON[personId]?.roleBand ?? 'manager';
}
