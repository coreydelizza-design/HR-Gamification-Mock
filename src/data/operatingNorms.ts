/**
 * Operating norms surfaced under "Org Context" on Home.
 * Pure presentation data — declarative summary of how an org pack
 * shows up in day-to-day work for the viewer.
 */

export interface OperatingNorm {
  id: string;
  label: string;
  detail: string;
}

export const ACTIVE_OPERATING_NORMS: OperatingNorm[] = [
  { id: 'on-1', label: 'Pre-read 24h ahead',         detail: 'Any decision meeting expects a pre-read shared at least 24 hours in advance.' },
  { id: 'on-2', label: 'Async-first on decisions',   detail: 'Decisions are made in writing first; live meetings confirm rather than deliberate.' },
  { id: 'on-3', label: 'Quarterly card refresh',     detail: 'Work cards stay fresh on a 90-day cadence. Nudges fire bi-weekly when a card is aging.' },
  { id: 'on-4', label: 'Cards visible org-wide',     detail: 'Default visibility for new cards is org-wide. Individuals can scope sections tighter.' },
  { id: 'on-5', label: 'Handoff checklist required', detail: 'Working agreements between teams require an explicit handoff checklist before publish.' },
];

export interface PartnerOrgPackSummary {
  id: string;
  name: string;
  context: string;
  visibilityDefault: string;
}

export const PARTNER_ORG_PACKS: PartnerOrgPackSummary[] = [
  { id: 'pack-regulated', name: 'Acme EMEA',  context: 'Operates under the Regulated Industry pack — stricter visibility defaults.', visibilityDefault: 'team' },
  { id: 'pack-startup',   name: 'Acme Labs',  context: 'Operates under the Growth-Stage pack — lighter requirements, broader visibility.', visibilityDefault: 'org' },
];
