import type { OrgSuccessAnalysis, CrossOrgSuccessAnalysis } from './types';
import { ORG_BY_ID } from '../data/organizations';
import { ORG_CARD_BY_ORG } from '../data/orgCards';
import { ORG_DEPENDENCIES } from '../data/orgDependencies';
import { SUCCESS_AGREEMENTS, SUCCESS_AGREEMENT_SECTIONS } from '../data/successAgreements';
import { ORG_NEEDS, ORG_OFFERS } from '../data/orgNeedsOffers';
import { ORG_MEETINGS, ORG_MEETING_FITS } from '../data/meetingFit';
import { analyzeOrganizationSuccess, analyzeCrossOrgSuccess } from './orgAnalysis';

/**
 * Wiring layer: binds the static v3 data to the deterministic analysis
 * engine and memoizes results. Views call successFor / crossFor instead of
 * re-importing every data array.
 */

const successCache = new Map<string, OrgSuccessAnalysis>();

export function successFor(orgId: string): OrgSuccessAnalysis | undefined {
  const org = ORG_BY_ID[orgId];
  if (!org) return undefined;
  const cached = successCache.get(orgId);
  if (cached) return cached;
  const analysis = analyzeOrganizationSuccess(
    org, ORG_CARD_BY_ORG[orgId],
    ORG_DEPENDENCIES, SUCCESS_AGREEMENTS, ORG_NEEDS, ORG_OFFERS,
    ORG_MEETINGS, ORG_MEETING_FITS,
  );
  successCache.set(orgId, analysis);
  return analysis;
}

const crossCache = new Map<string, CrossOrgSuccessAnalysis>();

export function crossFor(aId: string, bId: string): CrossOrgSuccessAnalysis | undefined {
  const orgA = ORG_BY_ID[aId];
  const orgB = ORG_BY_ID[bId];
  if (!orgA || !orgB) return undefined;
  const key = `${aId}|${bId}`;
  const cached = crossCache.get(key);
  if (cached) return cached;
  const analysis = analyzeCrossOrgSuccess(
    orgA, orgB,
    ORG_DEPENDENCIES, SUCCESS_AGREEMENTS, SUCCESS_AGREEMENT_SECTIONS,
    ORG_NEEDS, ORG_OFFERS,
    ORG_CARD_BY_ORG[aId], ORG_CARD_BY_ORG[bId],
    ORG_MEETINGS, ORG_MEETING_FITS,
  );
  crossCache.set(key, analysis);
  return analysis;
}

export const orgName = (id: string): string => ORG_BY_ID[id]?.name ?? id;

/** Demo "now" — keeps meeting ordering deterministic without Date.now(). */
export const DEMO_NOW = new Date('2026-06-10T13:00:00Z').getTime();
