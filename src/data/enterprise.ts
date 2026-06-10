import type { Enterprise, Tenant, OrgPack, MeetingFitRule, BadgeLanguagePack } from '../lib/types';

const DEFAULT_BADGE_LANGUAGE: BadgeLanguagePack = {
  meetingReady: 'Meeting Ready',
  teamGuidePublished: 'Team Guide Published',
  handoffClarityAchieved: 'Handoff Clarity Achieved',
  agreementVerified: 'Agreement Verified',
  freshThisQuarter: 'Fresh This Quarter',
  escalationPathClear: 'Escalation Path Clear',
  asyncFriendly: 'Async-Friendly',
  decisionPathMapped: 'Decision Path Mapped',
  partnerTeamReady: 'Partner Team Ready',
};

const DEFAULT_MEETING_FIT_RULES: MeetingFitRule[] = [
  { id: 'fr-1', label: 'Pre-read required', description: 'A pre-read is shared at least 24h ahead.' },
  { id: 'fr-2', label: 'Decision owner named', description: 'Every meeting has a named decision owner.' },
  { id: 'fr-3', label: 'Agenda complete', description: 'Agenda is finalized and shared with attendees.' },
  { id: 'fr-4', label: 'Required inputs received', description: 'All inputs from contributing teams are accounted for.' },
  { id: 'fr-5', label: 'Async-first when possible', description: 'Status-only meetings are recommended as written updates.' },
];

export const ORG_PACKS: OrgPack[] = [
  {
    id: 'pack-default',
    name: 'Standard Enterprise',
    description: 'Balanced configuration. Required: communication, decisions, meetings. Optional: everything else.',
    requiredCardSections: ['communication', 'decisions', 'meetings'],
    optionalCardSections: ['feedback', 'focus', 'escalation', 'needs_from_others', 'count_on_me', 'visibility', 'freshness'],
    teamTemplate: 'team-template-default',
    meetingFitRules: DEFAULT_MEETING_FIT_RULES,
    visibilityDefault: 'org',
    badgeLanguage: DEFAULT_BADGE_LANGUAGE,
    nudgeCadenceDays: 14,
    dataRetentionDays: 730,
  },
  {
    id: 'pack-regulated',
    name: 'Regulated Industry',
    description: 'Stricter visibility defaults and longer retention for regulated sectors.',
    requiredCardSections: ['communication', 'decisions', 'meetings', 'escalation', 'visibility'],
    optionalCardSections: ['feedback', 'focus', 'needs_from_others', 'count_on_me', 'freshness'],
    teamTemplate: 'team-template-default',
    meetingFitRules: DEFAULT_MEETING_FIT_RULES,
    visibilityDefault: 'team',
    badgeLanguage: DEFAULT_BADGE_LANGUAGE,
    nudgeCadenceDays: 21,
    dataRetentionDays: 2555,
  },
  {
    id: 'pack-startup',
    name: 'Growth-Stage Startup',
    description: 'Lightweight requirements; encourages early publishing and broad visibility.',
    requiredCardSections: ['communication', 'decisions'],
    optionalCardSections: ['meetings', 'feedback', 'focus', 'escalation', 'needs_from_others', 'count_on_me', 'visibility', 'freshness'],
    teamTemplate: 'team-template-default',
    meetingFitRules: DEFAULT_MEETING_FIT_RULES.slice(0, 3),
    visibilityDefault: 'org',
    badgeLanguage: DEFAULT_BADGE_LANGUAGE,
    nudgeCadenceDays: 7,
    dataRetentionDays: 365,
  },
];

export const ENTERPRISE: Enterprise = {
  id: 'ent-acme',
  name: 'Acme Corporation',
  primaryDomain: 'acme.com',
  region: 'North America',
  createdAt: '2024-01-15T00:00:00Z',
};

export const ORGANIZATION: Tenant = {
  id: 'org-acme-na',
  enterpriseId: 'ent-acme',
  name: 'Acme North America',
  industry: 'B2B Software',
  size: '100–250',
  orgPackId: 'pack-default',
  createdAt: '2024-01-15T00:00:00Z',
};

export const ACTIVE_ORG_PACK: OrgPack =
  ORG_PACKS.find((p) => p.id === ORGANIZATION.orgPackId) ?? ORG_PACKS[0];
