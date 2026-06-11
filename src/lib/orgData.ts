import type { OrgSuccessAnalysis, CrossOrgSuccessAnalysis } from './types';
import { ORG_DEPENDENCIES } from '../data/orgDependencies';
import { SUCCESS_AGREEMENTS, SUCCESS_AGREEMENT_SECTIONS } from '../data/successAgreements';
import { ORG_NEEDS, ORG_OFFERS } from '../data/orgNeedsOffers';
import { ORG_MEETINGS, ORG_MEETING_FITS } from '../data/meetingFit';
import { analyzeOrganizationSuccess, analyzeCrossOrgSuccess } from './orgAnalysis';
import { getState, indexOf, type DemoState } from './demoStore';

/**
 * Wiring layer: binds the (now mutable) demoStore org/card data to the
 * deterministic analysis engine. Results are memoized per DemoState identity,
 * so a single edit busts the cache and readiness recomputes live — while a
 * static render still hits the cache.
 *
 * Dependencies, agreements, meetings, needs/offers remain static seed.
 */

let cacheState: DemoState | null = null;
let successCache = new Map<string, OrgSuccessAnalysis>();
let crossCache = new Map<string, CrossOrgSuccessAnalysis>();

function ensureFresh(): void {
  const s = getState();
  if (s !== cacheState) {
    cacheState = s;
    successCache = new Map();
    crossCache = new Map();
  }
}

export function successFor(orgId: string): OrgSuccessAnalysis | undefined {
  ensureFresh();
  const idx = indexOf(getState());
  const org = idx.orgById[orgId];
  if (!org) return undefined;
  const cached = successCache.get(orgId);
  if (cached) return cached;
  const analysis = analyzeOrganizationSuccess(
    org, idx.orgCardByOrg[orgId],
    ORG_DEPENDENCIES, SUCCESS_AGREEMENTS, ORG_NEEDS, ORG_OFFERS,
    ORG_MEETINGS, ORG_MEETING_FITS,
  );
  successCache.set(orgId, analysis);
  return analysis;
}

export function crossFor(aId: string, bId: string): CrossOrgSuccessAnalysis | undefined {
  ensureFresh();
  const idx = indexOf(getState());
  const orgA = idx.orgById[aId];
  const orgB = idx.orgById[bId];
  if (!orgA || !orgB) return undefined;
  const key = `${aId}|${bId}`;
  const cached = crossCache.get(key);
  if (cached) return cached;
  const analysis = analyzeCrossOrgSuccess(
    orgA, orgB,
    ORG_DEPENDENCIES, SUCCESS_AGREEMENTS, SUCCESS_AGREEMENT_SECTIONS,
    ORG_NEEDS, ORG_OFFERS,
    idx.orgCardByOrg[aId], idx.orgCardByOrg[bId],
    ORG_MEETINGS, ORG_MEETING_FITS,
  );
  crossCache.set(key, analysis);
  return analysis;
}

export const orgName = (id: string): string => indexOf(getState()).orgById[id]?.name ?? id;

/** Demo "now" — keeps meeting ordering deterministic. */
export const DEMO_NOW = new Date('2026-06-10T13:00:00Z').getTime();
