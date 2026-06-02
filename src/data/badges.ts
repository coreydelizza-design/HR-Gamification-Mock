import type { Badge, BadgeKey } from '../lib/types';

/**
 * Allowed badges only. Every badge rewards clarity, readiness,
 * freshness, or collaboration hygiene — never personality or ranking.
 */
export const BADGE_CATALOG: Record<BadgeKey, { label: string; description: string }> = {
  meeting_ready:             { label: 'Meeting Ready',             description: 'Pre-read confirmed, agenda complete, decision owner named.' },
  team_guide_published:      { label: 'Team Guide Published',      description: 'Team card is published and visible to partner teams.' },
  handoff_clarity_achieved:  { label: 'Handoff Clarity Achieved',  description: 'Handoff checklist on a partner agreement is fully covered.' },
  agreement_verified:        { label: 'Agreement Verified',        description: 'Working agreement was reviewed by both teams on schedule.' },
  fresh_this_quarter:        { label: 'Fresh This Quarter',        description: 'Card was reviewed within the last 90 days.' },
  escalation_path_clear:     { label: 'Escalation Path Clear',     description: 'Escalation section on the card is filled in and current.' },
  async_friendly:            { label: 'Async-Friendly',            description: 'Communication preferences support async-first collaboration.' },
  decision_path_mapped:      { label: 'Decision Path Mapped',      description: 'Decision-making section names the decision owner and the reverse conditions.' },
  partner_team_ready:        { label: 'Partner Team Ready',        description: 'Team card answers what partner teams need to engage well.' },
};

export const EARNED_BADGES: Badge[] = [
  // People
  { id: 'b-1', key: 'fresh_this_quarter',       label: BADGE_CATALOG.fresh_this_quarter.label,       description: BADGE_CATALOG.fresh_this_quarter.description,       awardedTo: 'person', awardedToId: 'p-me', awardedAt: '2026-05-29T00:00:00Z', awardedReason: 'Card reviewed three days ago.' },
  { id: 'b-2', key: 'decision_path_mapped',     label: BADGE_CATALOG.decision_path_mapped.label,     description: BADGE_CATALOG.decision_path_mapped.description,     awardedTo: 'person', awardedToId: 'p-me', awardedAt: '2026-05-29T00:00:00Z', awardedReason: 'Decision-making section names the reverse conditions.' },
  { id: 'b-3', key: 'async_friendly',           label: BADGE_CATALOG.async_friendly.label,           description: BADGE_CATALOG.async_friendly.description,           awardedTo: 'person', awardedToId: 'p-dk', awardedAt: '2026-05-27T00:00:00Z', awardedReason: 'Communication preferences support async-first collaboration.' },
  { id: 'b-4', key: 'fresh_this_quarter',       label: BADGE_CATALOG.fresh_this_quarter.label,       description: BADGE_CATALOG.fresh_this_quarter.description,       awardedTo: 'person', awardedToId: 'p-sk', awardedAt: '2026-05-31T00:00:00Z', awardedReason: 'Card reviewed yesterday.' },
  { id: 'b-5', key: 'escalation_path_clear',    label: BADGE_CATALOG.escalation_path_clear.label,    description: BADGE_CATALOG.escalation_path_clear.description,    awardedTo: 'person', awardedToId: 'p-sk', awardedAt: '2026-05-31T00:00:00Z', awardedReason: 'Escalation section is filled in and recent.' },

  // Teams
  { id: 'b-6', key: 'team_guide_published',     label: BADGE_CATALOG.team_guide_published.label,     description: BADGE_CATALOG.team_guide_published.description,     awardedTo: 'team', awardedToId: 't-eng',   awardedAt: '2026-03-12T00:00:00Z', awardedReason: 'Engineering team card published org-wide.' },
  { id: 'b-7', key: 'partner_team_ready',       label: BADGE_CATALOG.partner_team_ready.label,       description: BADGE_CATALOG.partner_team_ready.description,       awardedTo: 'team', awardedToId: 't-eng',   awardedAt: '2026-05-04T00:00:00Z', awardedReason: 'Engineering card explains how to engage well from a partner team.' },
  { id: 'b-8', key: 'team_guide_published',     label: BADGE_CATALOG.team_guide_published.label,     description: BADGE_CATALOG.team_guide_published.description,     awardedTo: 'team', awardedToId: 't-cs',    awardedAt: '2026-02-20T00:00:00Z', awardedReason: 'Customer Success team card published.' },
  { id: 'b-9', key: 'agreement_verified',       label: BADGE_CATALOG.agreement_verified.label,       description: BADGE_CATALOG.agreement_verified.description,       awardedTo: 'team', awardedToId: 't-prod',  awardedAt: '2026-05-12T00:00:00Z', awardedReason: 'Eng↔Prod agreement reviewed on schedule.' },
  { id: 'b-10', key: 'handoff_clarity_achieved', label: BADGE_CATALOG.handoff_clarity_achieved.label, description: BADGE_CATALOG.handoff_clarity_achieved.description, awardedTo: 'team', awardedToId: 't-cs',    awardedAt: '2026-05-25T00:00:00Z', awardedReason: 'CS↔Sales handoff checklist is fully covered.' },
];
