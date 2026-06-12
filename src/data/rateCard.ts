import type { RateCard, RateBand, RoleBand, Currency } from '../lib/types';

/**
 * RateCard — ONE per enterprise, Admin-configurable.
 *
 * THE SEAT, NOT THE PERSON (Shopify precedent): band rates are published like
 * consulting bill rates. No individual's compensation is ever stored, displayed,
 * or implied — a rate belongs to a role band (a seat), never to a named employee.
 * Every figure derived from this card is an ESTIMATE for decision-making, never
 * payroll math. See docs/AGENT_REPRESENTATION_LOCK.md.
 *
 * hourly  = annualBase × loadedCostMultiplier ÷ 2080   (derived, never stored twice)
 * halfHour = hourly ÷ 2
 */

export const ROLE_BAND_LABEL: Record<RoleBand, string> = {
  individual_contributor: 'Individual contributor',
  senior_ic: 'Senior IC',
  manager: 'Manager',
  director: 'Director',
  vp: 'VP',
  c_level: 'C-level',
};

export const ROLE_BAND_ORDER: RoleBand[] = [
  'individual_contributor', 'senior_ic', 'manager', 'director', 'vp', 'c_level',
];

/** Illustrative public-benchmark base salaries (US, broad-market). Configure in Admin. */
export const DEFAULT_BASES: Record<RoleBand, number> = {
  individual_contributor: 95_000,
  senior_ic: 135_000,
  manager: 165_000,
  director: 210_000,
  vp: 290_000,
  c_level: 450_000,
};

export const DEFAULT_MULTIPLIER = 1.35;
const HOURS_PER_YEAR = 2080;

/** hourly = annualBase × multiplier ÷ 2080. The single source for the rate formula. */
export function deriveHourly(annualBase: number, multiplier: number): number {
  return Math.round((annualBase * multiplier) / HOURS_PER_YEAR);
}
/** half-hour = hourly ÷ 2. */
export function deriveHalfHour(hourly: number): number {
  return Math.round(hourly / 2);
}

function deriveBand(annualBase: number, multiplier: number): RateBand {
  const hourly = deriveHourly(annualBase, multiplier);
  return { annualBase, hourly, halfHour: deriveHalfHour(hourly) };
}

/** Rebuild a full rate card from base salaries + multiplier. The single source of
 *  derived hourly / half-hour rates — Admin edits feed straight back through here. */
export function buildRateCard(
  bases: Record<RoleBand, number>,
  multiplier: number,
  currency: Currency,
  illustrative: boolean,
): RateCard {
  const bands = {} as Record<RoleBand, RateBand>;
  for (const band of ROLE_BAND_ORDER) bands[band] = deriveBand(bases[band], multiplier);
  return { currency, loadedCostMultiplier: multiplier, bands, illustrative };
}

export const DEFAULT_RATE_CARD: RateCard = buildRateCard(
  DEFAULT_BASES, DEFAULT_MULTIPLIER, 'USD', true,
);
