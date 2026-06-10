import type { OrganizationCard } from '../lib/types';
import { ORG_CARDS_TIER1 } from './orgCardsTier1';
import { ORG_CARDS_TIER2 } from './orgCardsTier2';

/**
 * Aggregated organization cards. Split tier1 / tier2 to keep each file
 * under the size budget; this module is the single import surface for views.
 */
export const ORG_CARDS: OrganizationCard[] = [...ORG_CARDS_TIER1, ...ORG_CARDS_TIER2];

export const ORG_CARD_BY_ORG: Record<string, OrganizationCard> =
  Object.fromEntries(ORG_CARDS.map((c) => [c.orgId, c]));

export const ORG_CARD_BY_ID: Record<string, OrganizationCard> =
  Object.fromEntries(ORG_CARDS.map((c) => [c.id, c]));
