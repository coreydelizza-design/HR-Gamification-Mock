import type { Organization, OrganizationCard } from './types';

/**
 * Enterprise readiness aggregations shared by Home and Org Insights — the single
 * source for formulas that were duplicated across both views. Pure, deterministic.
 */

const CARD_SECTION_COUNT = 13;

/** Rounded percentage n/d×100 (display meters). */
export const pct = (n: number, d: number): number => (d ? Math.round((n / d) * 100) : 0);
/** Unrounded percentage n/d×100 (exact bar widths). */
export const pctRaw = (n: number, d: number): number => (d ? (n / d) * 100 : 0);

/** Average published-section coverage across all orgs, 0–100. */
export function cardCoveragePct(
  orgs: Organization[],
  cardByOrg: Record<string, OrganizationCard>,
): number {
  if (orgs.length === 0) return 0;
  const sum = orgs.reduce(
    (s, o) => s + ((cardByOrg[o.id]?.publishedSections.length ?? 0) / CARD_SECTION_COUNT),
    0,
  );
  return Math.round((sum / orgs.length) * 100);
}

/** Share of revenue-responsible orgs at the ready threshold, 0–100. */
export function revenueClarityPct(clear: number, responsible: number): number {
  return pct(clear, responsible);
}
