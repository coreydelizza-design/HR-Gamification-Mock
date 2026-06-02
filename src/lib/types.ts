/**
 * Fieldguide data model.
 *
 * Every interface here is designed for future Supabase extraction:
 * - String IDs (uuid-ready).
 * - Foreign keys are named *Id.
 * - Timestamps are ISO strings.
 * - No nested-only objects on first-class records; references live as IDs.
 *
 * Phase 1 stays static; this shape is the migration contract.
 */

/* ─────────────────────────────────────────────────────────────────
   App routing
   ───────────────────────────────────────────────────────────────── */
export type ViewKey =
  | 'home'
  | 'mycard'
  | 'people'
  | 'meetings'
  | 'agreements'
  | 'insights'
  | 'admin'
  | 'person'      // detail (opened from People & Teams)
  | 'team'        // detail (opened from People & Teams)
  | 'meeting'     // detail (opened from Meetings list)
  | 'agreement';  // detail (opened from Working Agreements)


/* ─────────────────────────────────────────────────────────────────
   Tenant hierarchy
   ───────────────────────────────────────────────────────────────── */
export interface Enterprise {
  id: string;
  name: string;
  primaryDomain: string;
  region: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  enterpriseId: string;
  name: string;
  industry: string;
  size: string;          // headcount band, eg "200–500"
  orgPackId: string;     // resolved configuration pack
  createdAt: string;
}

/**
 * OrgPack — the enterprise configuration bundle applied to an Organization.
 * It defines the active card sections, team templates, meeting-fit rules,
 * visibility defaults, and badge language for that org.
 */
export interface OrgPack {
  id: string;
  name: string;
  description: string;
  requiredCardSections: string[];    // CardSection.key list
  optionalCardSections: string[];
  teamTemplate: string;              // TeamCard template id
  meetingFitRules: MeetingFitRule[];
  visibilityDefault: VisibilityScope;
  badgeLanguage: BadgeLanguagePack;
  nudgeCadenceDays: number;
  dataRetentionDays: number;
}

export type VisibilityScope = 'org' | 'team' | 'partners' | 'private';

export interface BadgeLanguagePack {
  meetingReady: string;
  teamGuidePublished: string;
  handoffClarityAchieved: string;
  agreementVerified: string;
  freshThisQuarter: string;
  escalationPathClear: string;
  asyncFriendly: string;
  decisionPathMapped: string;
  partnerTeamReady: string;
}

export interface MeetingFitRule {
  id: string;
  label: string;
  description: string;
  // The boolean predicate is resolved at query time; here it's a label only.
}


/* ─────────────────────────────────────────────────────────────────
   Team + membership
   ───────────────────────────────────────────────────────────────── */
export interface Team {
  id: string;
  orgId: string;
  name: string;
  shortName: string;            // for compact UI
  function: string;             // eg "Engineering", "Customer Success"
  managerPersonId: string;
  parentTeamId?: string;
  // Display-only categorical to give teams visual variety (NOT a personality label).
  visualKey: 'a' | 'b' | 'c' | 'd';
  createdAt: string;
}

export interface TeamMembership {
  id: string;
  personId: string;
  teamId: string;
  role: 'lead' | 'manager' | 'member' | 'partner';
  startedAt: string;
}


/* ─────────────────────────────────────────────────────────────────
   Person
   ───────────────────────────────────────────────────────────────── */
export interface Person {
  id: string;
  orgId: string;
  name: string;
  initials: string;
  role: string;                 // job title
  primaryTeamId: string;
  location: string;
  timeZone: string;             // eg "America/Denver"
  workingHours: string;         // eg "8am–4pm MT"
  workCardId: string;
  // Visual-only categorical for avatar tinting; carries no personality claim.
  visualKey: 'a' | 'b' | 'c' | 'd';
  createdAt: string;
}


/* ─────────────────────────────────────────────────────────────────
   Cards
   ───────────────────────────────────────────────────────────────── */
export type CardSectionKey =
  | 'communication'
  | 'meetings'
  | 'feedback'
  | 'decisions'
  | 'focus'
  | 'escalation'
  | 'needs_from_others'
  | 'count_on_me'
  | 'visibility'
  | 'freshness';

/**
 * CardSection — the prompt/template definition. Same shape used for
 * WorkCard (individual) and TeamCard (team) when applicable.
 */
export interface CardSection {
  key: CardSectionKey;
  label: string;
  prompt: string;
  helpText: string;
  required: boolean;
  appliesTo: Array<'work' | 'team'>;
}

export type CardKind = 'work' | 'team';

export interface WorkCard {
  id: string;
  personId: string;
  orgId: string;
  kind: 'work';
  visibility: VisibilityScope;
  publishedAt?: string;
  lastUpdatedAt: string;
  // Computed at read time, materialized here for demo simplicity.
  freshnessSignalId?: string;
}

export interface TeamCard {
  id: string;
  teamId: string;
  orgId: string;
  kind: 'team';
  ownerPersonId: string;
  // What the team owns / produces / needs
  mission: string;
  weOwn: string[];
  weProduce: string[];
  weNeed: string[];
  bestEngagement: string;       // how to engage this team well
  decisionOwners: string[];     // names/role of approvers
  visibility: VisibilityScope;
  publishedAt?: string;
  lastUpdatedAt: string;
  freshnessSignalId?: string;
}

export interface CardAnswer {
  id: string;
  cardId: string;               // FK to WorkCard.id or TeamCard.id
  cardKind: CardKind;
  sectionKey: CardSectionKey;
  body: string;
  lastUpdatedAt: string;
}

export interface VisibilityRule {
  id: string;
  cardId: string;
  cardKind: CardKind;
  sectionKey?: CardSectionKey;  // null = whole card
  scope: VisibilityScope;
  audienceTeamIds?: string[];   // for "partners" scope
}


/* ─────────────────────────────────────────────────────────────────
   Meetings
   ───────────────────────────────────────────────────────────────── */
export interface Meeting {
  id: string;
  orgId: string;
  title: string;
  startsAt: string;             // ISO
  durationMinutes: number;
  ownerPersonId: string;        // decision owner / facilitator
  agendaSummary: string;
  decisionRequested: string;    // the call to be made
  requiredTeamIds: string[];    // which TeamCards inform this meeting
}

export interface MeetingAttendee {
  id: string;
  meetingId: string;
  personId: string;
  role: 'organizer' | 'required' | 'optional' | 'decision_owner';
  preReadConfirmed: boolean;
}

/**
 * MeetingFitBrief — the readiness summary surfaced before a meeting.
 * Advisory, explainable, never punitive. No individual scoring.
 */
export interface MeetingFitBrief {
  id: string;
  meetingId: string;
  status: 'ready' | 'almost' | 'not_ready';
  attendeeContext: string;      // narrative summary of attendee work-context
  agendaReadiness: 'complete' | 'partial' | 'missing';
  requiredInputs: Array<{ teamId: string; input: string; received: boolean }>;
  decisionOwnerPersonId: string;
  prepGaps: string[];
  asyncRecommendation?: string; // optional: "this could be a doc"
  suggestedFollowUp: string;
}


/* ─────────────────────────────────────────────────────────────────
   Collaboration plumbing — needs / offers / dependencies
   ───────────────────────────────────────────────────────────────── */
export interface CollaborationNeed {
  id: string;
  ownerTeamId: string;
  needFromTeamId: string;
  description: string;
  cadence: string;              // "weekly", "ad-hoc", etc.
  status: 'open' | 'covered' | 'gap';
}

export interface CollaborationOffer {
  id: string;
  ownerTeamId: string;
  offeredToTeamId: string;
  description: string;
  sla: string;                  // "5 business days", etc.
  active: boolean;
}

export interface Dependency {
  id: string;
  fromTeamId: string;
  toTeamId: string;
  description: string;
  criticality: 'low' | 'medium' | 'high';
  status: 'clear' | 'at_risk' | 'blocked';
}


/* ─────────────────────────────────────────────────────────────────
   Working Agreements
   ───────────────────────────────────────────────────────────────── */
export type AgreementStatus = 'draft' | 'review' | 'published' | 'archived';

export interface WorkingAgreement {
  id: string;
  orgId: string;
  title: string;
  teamIds: string[];            // the teams party to the agreement
  status: AgreementStatus;
  reviewCadenceDays: number;
  nextReviewAt: string;
  lastUpdatedAt: string;
  authorPersonId: string;
}

export type AgreementSectionKey =
  | 'mutual_needs'
  | 'required_inputs'
  | 'escalation_path'
  | 'handoff_checklist'
  | 'review_cadence'
  | 'success_signals';

export interface AgreementSection {
  id: string;
  agreementId: string;
  key: AgreementSectionKey;
  label: string;
  body: string;
  lastUpdatedAt: string;
}


/* ─────────────────────────────────────────────────────────────────
   Impact + missions
   ───────────────────────────────────────────────────────────────── */
export interface Mission {
  id: string;
  orgId: string;
  title: string;
  description: string;
  ownerTeamId: string;
  contributingTeamIds: string[];
  startsAt: string;
  targetCompleteAt: string;
  status: 'planning' | 'active' | 'at_risk' | 'shipped' | 'cancelled';
}

/**
 * ImpactLink — connects a card/agreement/meeting back to a Mission, so
 * collaboration artifacts are traceable to org outcomes.
 */
export interface ImpactLink {
  id: string;
  missionId: string;
  sourceKind: 'work_card' | 'team_card' | 'agreement' | 'meeting';
  sourceId: string;
  contribution: string;         // short narrative
}


/* ─────────────────────────────────────────────────────────────────
   Recognition (collaboration readiness, NOT performance ranking)
   ───────────────────────────────────────────────────────────────── */
export type BadgeKey =
  | 'meeting_ready'
  | 'team_guide_published'
  | 'handoff_clarity_achieved'
  | 'agreement_verified'
  | 'fresh_this_quarter'
  | 'escalation_path_clear'
  | 'async_friendly'
  | 'decision_path_mapped'
  | 'partner_team_ready';

export interface Badge {
  id: string;
  key: BadgeKey;
  label: string;
  description: string;          // explainable, non-punitive
  awardedTo: 'person' | 'team';
  awardedToId: string;          // personId or teamId
  awardedAt: string;
  awardedReason: string;        // why it was earned, in plain language
}


/* ─────────────────────────────────────────────────────────────────
   Nudges + freshness
   ───────────────────────────────────────────────────────────────── */
export type NudgeKind =
  | 'stale_card'
  | 'pre_meeting_refresh'
  | 'agreement_review_due'
  | 'handoff_gap'
  | 'team_readiness';

export interface Nudge {
  id: string;
  kind: NudgeKind;
  audience: 'person' | 'team' | 'manager';
  audienceId: string;           // personId / teamId / managerPersonId
  message: string;              // advisory, never punitive
  triggeredAt: string;
  acknowledgedAt?: string;
  // Optional links to the affected artifacts.
  cardId?: string;
  meetingId?: string;
  agreementId?: string;
}

export interface FreshnessSignal {
  id: string;
  subjectKind: 'work_card' | 'team_card' | 'agreement';
  subjectId: string;
  lastUpdatedAt: string;
  daysSinceUpdate: number;
  status: 'fresh' | 'aging' | 'stale';
}


/* ─────────────────────────────────────────────────────────────────
   Consent + audit (compliance scaffolding for Phase 2+)
   ───────────────────────────────────────────────────────────────── */
export interface ConsentRecord {
  id: string;
  personId: string;
  scope: 'card_publish' | 'org_visibility' | 'partner_visibility' | 'integration_sync';
  grantedAt: string;
  revokedAt?: string;
  version: string;              // policy version reference
}

export interface AuditLog {
  id: string;
  actorPersonId: string;
  action: string;               // verb, eg "publish_card", "edit_agreement"
  subjectKind: string;          // eg "work_card"
  subjectId: string;
  at: string;
  diffSummary?: string;
}


/* ─────────────────────────────────────────────────────────────────
   Readiness — computed, not stored. Returned by lib/readiness.ts.
   ───────────────────────────────────────────────────────────────── */
export type ReadinessLevel = 'ready' | 'almost' | 'attention' | 'unknown';

export interface ReadinessSummary {
  level: ReadinessLevel;
  pct: number;                  // 0–100
  label: string;                // short status word
  rationale: string;            // plain-language "why"
}
