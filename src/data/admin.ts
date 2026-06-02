/**
 * Admin-side defaults: card section requirements per pack, team templates,
 * meeting-fit rules, visibility defaults, badge language, nudge cadence,
 * integration placeholders, retention, and consent/audit stubs.
 *
 * Static demo. Shaped for future Supabase extraction.
 */

import type { ConsentRecord, AuditLog } from '../lib/types';

export interface IntegrationStub {
  id: string;
  name: string;
  category: 'identity' | 'calendar' | 'messaging' | 'hris' | 'docs' | 'video';
  status: 'available' | 'connected' | 'coming_soon';
  description: string;
}

export const INTEGRATIONS: IntegrationStub[] = [
  { id: 'int-okta',    name: 'Okta SSO',          category: 'identity',  status: 'connected',   description: 'Single sign-on for all users.' },
  { id: 'int-gworks',  name: 'Google Workspace',  category: 'calendar',  status: 'connected',   description: 'Calendar context for meeting fit briefs.' },
  { id: 'int-slack',   name: 'Slack',             category: 'messaging', status: 'connected',   description: 'Deliver nudges and meeting fit briefs in channel.' },
  { id: 'int-teams',   name: 'Microsoft Teams',   category: 'messaging', status: 'available',   description: 'Alternative to Slack for nudge delivery.' },
  { id: 'int-out365',  name: 'Outlook 365',       category: 'calendar',  status: 'available',   description: 'Calendar context for orgs not on Google Workspace.' },
  { id: 'int-workday', name: 'Workday',           category: 'hris',      status: 'available',   description: 'Org chart sync to keep team memberships fresh.' },
  { id: 'int-notion',  name: 'Notion',            category: 'docs',      status: 'coming_soon', description: 'Embed working agreements inside Notion pages.' },
  { id: 'int-zoom',    name: 'Zoom',              category: 'video',     status: 'coming_soon', description: 'Auto-attach meeting fit briefs to scheduled calls.' },
];

export interface TeamTemplate {
  id: string;
  label: string;
  description: string;
  defaultSections: string[];
}

export const TEAM_TEMPLATES: TeamTemplate[] = [
  {
    id: 'team-template-default',
    label: 'Standard team',
    description: 'Mission, ownership, production, needs, engagement, escalation.',
    defaultSections: ['mission', 'we_own', 'we_produce', 'we_need', 'best_engagement', 'escalation'],
  },
  {
    id: 'team-template-platform',
    label: 'Platform team',
    description: 'Adds SLAs and architecture decision pointers.',
    defaultSections: ['mission', 'we_own', 'we_produce', 'we_need', 'best_engagement', 'escalation', 'slas', 'adr_index'],
  },
  {
    id: 'team-template-customer',
    label: 'Customer-facing team',
    description: 'Adds renewal motion, customer signal cadence, and escalation.',
    defaultSections: ['mission', 'we_own', 'we_produce', 'we_need', 'best_engagement', 'escalation', 'renewal_motion', 'customer_signal'],
  },
];

export interface NudgeCadenceOption {
  id: string;
  label: string;
  description: string;
  days: number;
}

export const NUDGE_CADENCES: NudgeCadenceOption[] = [
  { id: 'cad-weekly',     label: 'Weekly',      description: 'Best for early adoption and startups.',           days: 7 },
  { id: 'cad-biweekly',   label: 'Bi-weekly',   description: 'Recommended default for established orgs.',       days: 14 },
  { id: 'cad-monthly',    label: 'Monthly',     description: 'For mature orgs with strong baseline adoption.',  days: 30 },
  { id: 'cad-quarterly',  label: 'Quarterly',   description: 'Lowest-touch. Recommended only post-rollout.',    days: 90 },
];

export interface RetentionOption {
  id: string;
  label: string;
  description: string;
  days: number;
}

export const RETENTION_OPTIONS: RetentionOption[] = [
  { id: 'ret-1y',  label: '1 year',  description: 'Minimum retention for active workspaces.',  days: 365 },
  { id: 'ret-2y',  label: '2 years', description: 'Standard for most orgs.',                    days: 730 },
  { id: 'ret-7y',  label: '7 years', description: 'Regulated industries (financial, health).',  days: 2555 },
];

/* ─────────────────────────────────────────────────────────────────
   Consent & audit — minimal placeholders for the Admin view.
   ───────────────────────────────────────────────────────────────── */
export const CONSENT_RECORDS: ConsentRecord[] = [
  { id: 'c-1', personId: 'p-me', scope: 'card_publish',        grantedAt: '2025-11-30T00:00:00Z', version: 'policy-v3' },
  { id: 'c-2', personId: 'p-me', scope: 'org_visibility',      grantedAt: '2025-11-30T00:00:00Z', version: 'policy-v3' },
  { id: 'c-3', personId: 'p-sk', scope: 'card_publish',        grantedAt: '2026-02-01T00:00:00Z', version: 'policy-v3' },
  { id: 'c-4', personId: 'p-mc', scope: 'partner_visibility',  grantedAt: '2025-09-12T00:00:00Z', version: 'policy-v3' },
];

export const AUDIT_LOGS: AuditLog[] = [
  { id: 'al-1', actorPersonId: 'p-me', action: 'publish_card',     subjectKind: 'work_card',  subjectId: 'wc-me',          at: '2025-12-01T15:24:00Z', diffSummary: 'Published Alex Morgan work card org-wide.' },
  { id: 'al-2', actorPersonId: 'p-mc', action: 'edit_agreement',   subjectKind: 'agreement',  subjectId: 'wa-eng-prod',    at: '2026-05-12T10:11:00Z', diffSummary: 'Updated handoff checklist and escalation path.' },
  { id: 'al-3', actorPersonId: 'p-sk', action: 'edit_agreement',   subjectKind: 'agreement',  subjectId: 'wa-cs-sales',    at: '2026-05-25T09:48:00Z', diffSummary: 'Moved to review; refined required inputs.' },
  { id: 'al-4', actorPersonId: 'p-dk', action: 'publish_team_card', subjectKind: 'team_card', subjectId: 'tc-eng',         at: '2026-03-12T19:02:00Z', diffSummary: 'Engineering team card published org-wide.' },
];
