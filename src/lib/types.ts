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
  | 'organizations'
  | 'organization-detail'        // org card detail (PARENT_OF organizations)
  | 'collaboration-map'
  | 'success-agreements'
  | 'success-agreement-detail'   // PARENT_OF success-agreements
  | 'meeting-fit'
  | 'meeting-fit-detail'         // PARENT_OF meeting-fit
  | 'org-insights'
  | 'estimator'                  // Meeting Cost Estimator (PARENT_OF admin)
  | 'admin';


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

/**
 * Tenant — the customer account root (one enterprise instance).
 * (v2 called this `Organization`; in the v3 organization-first model the
 * word "Organization" is reserved for a department/function, so the tenant
 * record is named `Tenant`. See the v3 block at the bottom of this file.)
 */
export interface Tenant {
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
  // ── v3 organization-first additions (optional so v2 packs still satisfy) ──
  appliesToCategory?: OrganizationCategory;
  intakeFields?: string[];
  handoffTemplate?: string[];        // default handoff checklist items
  decisionRightsTemplate?: string[];
  successMetrics?: string[];
  freshnessCadenceDays?: number;
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
  weDontOwn: string[];          // explicit non-ownership
  weProduce: string[];
  weNeed: string[];             // required inputs
  bestEngagement: string;       // how to engage this team well
  commonBlockers: string[];     // what slows this team down
  responseExpectations: string; // typical response time / cadence
  escalationPath: string;       // who to escalate to, when
  decisionRights: string[];     // what calls this team owns
  decisionOwners: string[];     // names/role of approvers
  meetingNorms: string;         // how this team prefers meetings
  partnerTeamIds: string[];     // partner team references
  downstreamImpact: string;     // who depends on this team's output
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
  // Per-section visibility override. If absent, falls back to card visibility.
  visibility?: VisibilityScope;
  lastUpdatedAt: string;
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
export type MeetingFitStatus =
  | 'draft'
  | 'ready'
  | 'decision_ready'
  | 'async_recommended'
  | 'at_risk';

export interface MeetingFitBrief {
  id: string;
  meetingId: string;
  status: MeetingFitStatus;
  attendeeContext: string;      // narrative summary of attendee work-context
  agendaReadiness: 'complete' | 'partial' | 'missing';
  requiredInputs: Array<{ teamId: string; input: string; received: boolean }>;
  decisionOwnerPersonId: string;
  prepGaps: string[];
  asyncRecommendation?: string; // optional: "this could be a doc"
  suggestedFollowUp: string;
  // Optional reference to a Working Agreement that governs this meeting.
  governingAgreementId?: string;
}


/* ─────────────────────────────────────────────────────────────────
   Collaboration plumbing — needs / offers / dependencies
   ───────────────────────────────────────────────────────────────── */
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
export type AgreementStatus =
  | 'draft'
  | 'shared'
  | 'mutual_review'
  | 'published'
  | 'needs_refresh'
  | 'archived';

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
  | 'team_a_needs'
  | 'team_b_needs'
  | 'required_inputs'
  | 'handoff_checklist'
  | 'meeting_norms'
  | 'escalation_path'
  | 'decision_rights'
  | 'common_failure_points'
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


/* ═══════════════════════════════════════════════════════════════════
   V3 — ORGANIZATION-FIRST MODEL
   The Organization Card is the primary product object. Individual work
   cards survive only as nested supporting context.

   Migration contract (same discipline as v2): string IDs, *Id foreign
   keys, ISO timestamps. Prose-heavy card sections are flattened as
   string / string[] fields on OrganizationCard — Phase 1 is static.
   ═══════════════════════════════════════════════════════════════════ */

export type OrganizationCategory =
  | 'leadership'
  | 'technology'
  | 'revenue'
  | 'customer'
  | 'people'
  | 'finance_legal'
  | 'operations';

export type OrgTier = 1 | 2;

/** Maturity of an organization's operating clarity. */
export type OrgMaturity = 'forming' | 'developing' | 'established' | 'leading';

/** Freshness lifecycle for cards and agreements. */
export type FreshnessState = 'fresh' | 'aging' | 'stale' | 'unpublished';

/**
 * Organization — a department / function. The primary operating entity.
 * Hierarchy: Enterprise → Organization → Team → Role → Individual.
 */
export interface Organization {
  id: string;
  enterpriseId: string;
  name: string;
  category: OrganizationCategory;
  tier: OrgTier;
  mission: string;
  executiveOwner: string;       // executive accountable (name · title)
  operatingOwner: string;       // day-to-day operating lead (name · title)
  parentOrgId?: string;
  orgPackId: string;
  memberCount: number;
  partnerOrgIds: string[];
  freshness: FreshnessState;
  lastReviewedAt: string;
  nextReviewAt: string;
  visibility: VisibilityScope;
  createdAt: string;
}

/* ── Card sub-structures ────────────────────────────────────────── */

export interface OrgMetric {
  label: string;
  value: string;
  kind: 'leading' | 'lagging' | 'capacity' | 'quality' | 'operating';
  trend?: 'up' | 'down' | 'flat';
}

export interface RequiredInput {
  input: string;
  fromOrgId?: string;           // upstream organization, when known
  format: string;
  timing: string;
  qualityBar: string;
}

export interface EngagementModel {
  howToEngage: string;
  intakeProcess: string;
  intakeFields: string[];
  contactChannel: string;
  responseRhythm: string;
  officeHours?: string;
  cadenceStyle: 'async_first' | 'meeting_first' | 'balanced';
  escalationPath: string;
  decisionRights: string[];
  approvalRights: string[];
}

export interface OrgMeetingNorms {
  includeWhen: string[];
  doNotIncludeWhen: string[];
  requiredPreRead: string;
  requiredAgenda: string;
  requiredDecisionOwner: boolean;
  preferredLength: string;
  preferredCadence: string;
  asyncAlternatives: string[];
  recurringRules: string;
}

export interface HandoffRule {
  id: string;
  name: string;
  checklist: string[];
  definitionOfReady: string[];
  definitionOfDone: string[];
  requiredApprovals: string[];
  requiredArtifacts: string[];
  handoffOwner: string;
  receivingOrgId?: string;
  failureModes: string[];
  recoveryPath: string;
}

export type OrgRiskKind =
  | 'operational' | 'dependency' | 'capacity' | 'decision'
  | 'handoff' | 'meeting' | 'stakeholder' | 'stale_knowledge';

export interface OrgRisk {
  kind: OrgRiskKind;
  description: string;
  severity: 'low' | 'medium' | 'high';
  mitigation?: string;
}

/** The 13-section card keys (Overview / Dependencies / Agreements / People /
 *  Freshness are joined from other records; the rest live on OrganizationCard). */
export type OrgCardSectionKey =
  | 'overview'
  | 'how_succeeds'
  | 'what_owns'
  | 'what_needs'
  | 'how_helps'
  | 'dependencies'
  | 'engagement'
  | 'meeting_norms'
  | 'handoff_rules'
  | 'agreements'
  | 'people'
  | 'risks'
  | 'freshness';

/**
 * OrgCommercialProfile — the organization's commercial structure.
 * COMMERCIAL DATA ATTACHES TO ORGANIZATIONS ONLY. There are no individual
 * targets, quotas, attainment, or revenue metrics on any Person / RoleCard /
 * IndividualWorkCard type — by design and by data shape. See
 * docs/ORG_INSIGHTS_GUARDRAILS.md and docs/ORG_CARD_SCHEMA.md.
 */
export type RevenueRole =
  | 'pl_owner'
  | 'revenue_generating'
  | 'revenue_influencing'
  | 'enablement'
  | 'shared_service'
  | 'cost_center';

export type CommercialMetric =
  | 'revenue' | 'bookings' | 'renewals' | 'pipeline' | 'nrr' | 'cost_savings';

export type Currency = 'USD' | 'EUR' | 'GBP';

export interface CommercialTarget {
  metric: CommercialMetric;
  amount: number;             // org-level only
  currency: Currency;
  attainmentPct?: number;     // 0–100, org-level; never person-attributed
}

export interface OrgCommercialProfile {
  revenueRole: RevenueRole;
  fiscalYear: string;                 // e.g. "FY2026"
  targets: CommercialTarget[];        // org-level only
  budgetOwnerPersonId?: string;       // a budget owner reference — not a target owner
  headcount?: number;
  costCenterCode?: string;
  keyCommercialMetrics: string[];     // e.g. "Win rate", "Avg deal cycle", "Churn %"
}

/**
 * OrganizationCard — the prose content for an Organization, flattened.
 * Sections 1/6/10/11/13 are derived (Organization, OrgDependency,
 * SuccessAgreement, RoleCard/Person, freshness). The rest are carried here.
 * `publishedSections` lists which of the 13 keys actually have content
 * (Tier-2 cards publish fewer — honest about depth, structurally identical).
 */
export interface OrganizationCard {
  id: string;
  orgId: string;

  // 2 · How this organization succeeds
  missionCriticalOutcomes: string[];
  successConditions: string[];
  leadingIndicators: string[];
  laggingIndicators: string[];
  operatingMetrics: OrgMetric[];
  capacitySignals: string[];
  qualitySignals: string[];
  riskSignals: string[];
  stakeholderOutcomes: string[];
  maturityLevel: OrgMaturity;
  currentBlockers: string[];
  nextBestActions: string[];

  // 3 · What this organization owns
  responsibilities: string[];
  services: string[];
  systems: string[];
  decisions: string[];
  processes: string[];
  businessOutcomes: string[];
  artifactsProduced: string[];
  governanceAreas: string[];
  notOwned: string[];

  // 4 · What this organization needs from others
  requiredInputs: RequiredInput[];
  missingInputFailureModes: string[];
  escalationTriggers: string[];
  commonMisconceptions: string[];
  reworkCauses: string[];
  delayCauses: string[];

  // 5 · How this organization helps others succeed
  outputs: string[];
  servicesOffered: string[];
  expertise: string[];
  decisionSupport: string[];
  enablement: string[];
  riskReduction: string[];
  acceleration: string[];
  advisoryRole: string[];
  reusableArtifacts: string[];
  serviceExpectations: string[];   // SLEs
  bestWaysToEngage: string[];

  // 7 · Engagement model
  engagement: EngagementModel;
  // 8 · Meeting norms
  meetingNorms: OrgMeetingNorms;
  // 9 · Handoff rules
  handoffRules: HandoffRule[];
  // 12 · Risks and blockers
  risks: OrgRisk[];

  publishedSections: OrgCardSectionKey[];
  lastUpdatedAt: string;

  // Commercial structure (organization-level only). Optional: not every card
  // publishes it, and Tier-2 cards may carry only a revenue role.
  commercial?: OrgCommercialProfile;
}

/* ── Cross-org needs / offers / dependencies (first-class) ──────── */

export type DependencyStrength = 'critical' | 'strong' | 'moderate' | 'weak';
export type DependencyHealth = 'healthy' | 'at_risk' | 'blocked' | 'unknown';

export interface OrgDependency {
  id: string;
  fromOrgId: string;            // the org that depends (downstream consumer)
  toOrgId: string;              // the org depended on (upstream provider)
  description: string;
  requiredInput: string;
  outputProvided: string;
  strength: DependencyStrength;
  health: DependencyHealth;
  risk: string;
  gaps: string[];
  owner: string;
  reviewCadence: string;
  governingAgreementId?: string;
}

export interface OrgNeed {
  id: string;
  ownerOrgId: string;           // who needs it
  needFromOrgId: string;        // who provides it
  description: string;
  format: string;
  timing: string;
  status: 'open' | 'covered' | 'gap';
  coveredByAgreementId?: string;
}

export interface OrgOffer {
  id: string;
  ownerOrgId: string;           // who offers it
  offeredToOrgId: string;       // beneficiary
  description: string;
  serviceLevel: string;         // SLE
  active: boolean;
}

/* ── Success Agreements (v2 Working Agreements, org-first) ───────── */

export type SuccessAgreementSectionKey =
  | 'shared_business_outcome'
  | 'a_needs_from_b'
  | 'b_needs_from_a'
  | 'required_inputs'
  | 'required_outputs'
  | 'handoff_checklist'
  | 'decision_rights'
  | 'approval_rights'
  | 'meeting_norms'
  | 'escalation_path'
  | 'common_failure_modes'
  | 'service_expectations'
  | 'review_cadence';

export interface SuccessAgreement {
  id: string;
  title: string;
  orgIds: string[];                       // participating organizations
  status: AgreementStatus;                // reuse the six-state lifecycle
  sharedBusinessOutcome: string;
  reviewCadenceDays: number;
  nextReviewAt: string;
  lastUpdatedAt: string;
  ownerByOrg: Record<string, string>;     // orgId → owner name
  freshness: FreshnessState;
}

export interface SuccessAgreementSection {
  id: string;
  agreementId: string;
  key: SuccessAgreementSectionKey;
  label: string;
  body: string;
  lastUpdatedAt: string;
}

/** A recommended clause emitted by cross-org analysis (a gap with no cover). */
export interface SuccessAgreementClause {
  forGap: string;
  recommendation: string;
  rationale: string;
}

/* ── Organization-first meetings ────────────────────────────────── */

export interface OrgMeeting {
  id: string;
  title: string;
  startsAt: string;
  durationMinutes: number;
  participatingOrgIds: string[];        // N participating org slugs (no upper limit)
  requiredOrgIds: string[];
  attendeePersonIds: string[];
  decisionOwnerPersonId: string;
  decisionRequested: string;
  agendaSummary: string;
  governingAgreementId?: string;
  // v3.5c — composition. When present on the meeting these override the seed
  // MeetingMeta, so a composed/edited meeting is self-contained and recomputes
  // through the same engine functions. (proxyEngine.metaOf merges them.)
  meetingType?: 'standard' | 'escalation';
  agenda?: MeetingAgendaItem[];
  cadence?: MeetingCadence;
  inviteePersonIds?: string[];
  inputNeedBy?: Record<string, { date: string; reason?: string }>;
  duplicateOf?: string;
}

export interface OrgMeetingFit {
  id: string;
  meetingId: string;
  status: MeetingFitStatus;               // reuse v2 status enum
  requiredInputs: Array<{ orgId: string; input: string; received: boolean }>;
  missingOrgIds: string[];                // required orgs not represented
  agendaReadiness: 'complete' | 'partial' | 'missing';
  decisionOwnerPresent: boolean;
  formatMatchesNorms: boolean;
  asyncRecommendation?: string;
  handoffImpact: string;
  createsOrResolvesRisk: string;
  followUpOwnerPersonId: string;
  nextBestAction: string;
}

/* ── Collaboration map ──────────────────────────────────────────── */

export interface CollabEdge {
  id: string;
  sourceOrgId: string;          // provider / upstream
  targetOrgId: string;          // consumer / downstream
  dependencyType: string;
  strength: DependencyStrength;
  health: DependencyHealth;
  requiredInput: string;
  outputProvided: string;
  risk: string;
  governingAgreementId?: string;
}

/* ── Nested individual context (demoted) ────────────────────────── */

export interface RoleCard {
  id: string;
  orgId: string;
  title: string;
  personId?: string;            // filled role, when assigned
  roleBand: RoleBand;           // the seat's band — drives rate-card economics (never comp)
  responsibilities: string[];
  decisionRights: string[];
  smeTags: string[];
}

/** Alias: WorkCard remains the nested individual card record. */
export type IndividualWorkCard = WorkCard;

/* ── Org intelligence ───────────────────────────────────────────── */

export interface OrgInsight {
  id: string;
  metricKey: string;
  label: string;
  value: number;
  unit: 'count' | 'pct';
  detail: string;
}

export type OrgNudgeKind =
  | 'stale_card' | 'missing_section' | 'agreement_review'
  | 'handoff_gap' | 'undefined_inputs' | 'meeting_not_ready';

export interface OrgNudge {
  id: string;
  orgId: string;
  kind: OrgNudgeKind;
  message: string;              // advisory, org-level, never punitive
  triggeredAt: string;
}

/* ── Org-readiness badges (awarded to organizations / teams) ─────── */

export type OrgBadgeKey =
  | 'org_card_published'
  | 'success_model_complete'
  | 'inputs_defined'
  | 'handoff_ready'
  | 'agreement_verified'
  | 'fresh_this_quarter'
  | 'decision_rights_clear'
  | 'escalation_path_clear'
  | 'partner_org_ready'
  | 'meeting_fit_ready';

export interface OrgBadge {
  id: string;
  key: OrgBadgeKey;
  label: string;
  description: string;          // explainable, non-punitive
  awardedTo: 'organization' | 'team';
  awardedToOrgId: string;
  awardedAt: string;
  awardedReason: string;
}

/* ── Analysis engine outputs (lib/orgAnalysis.ts) ───────────────── */

export interface OrgDimension {
  key: string;
  label: string;
  summary: ReadinessSummary;
}

export interface OrgHelpLink {
  orgId: string;
  why: string;
}

export interface OrgSuccessAnalysis {
  orgId: string;
  successReadinessScore: number;          // 0–100
  scoreRationale: string;
  level: ReadinessLevel;
  dimensions: OrgDimension[];             // 11 explainable dimensions
  topEnablers: string[];
  topRisks: string[];
  helpNeededFrom: OrgHelpLink[];
  helpOfferedTo: OrgHelpLink[];
  nextBestActions: string[];
}

export interface CrossOrgSuccessAnalysis {
  orgAId: string;
  orgBId: string;
  mutualSummary: string;
  aNeedsFromB: string[];
  bNeedsFromA: string[];
  aHelpsB: string[];
  bHelpsA: string[];
  sharedOutcomes: string[];
  frictionPoints: string[];               // org-level only — never a person
  recommendedClauses: SuccessAgreementClause[];
  meetingGuidance: string;
  nextBestActions: string[];
}


/* ═══════════════════════════════════════════════════════════════════
   V3.5b — PROXY: GOVERNED MEETING DELEGATION

   Two-sided consent is structural, not cosmetic:
   - The organizer sets a representation FLOOR per invitee (RepresentationRequirement).
   - The individual alone sets their AttendanceMode and produces a DelegationGrant.
   Critical invitees in critical meetings are non-delegable. Delegates capture
   only remit-scoped digest items — never a transcript, never observations about
   other attendees. No individual delegation metrics exist; economics aggregate at
   the organization level, and rates attach to role bands (the seat), never people.
   See docs/AGENT_REPRESENTATION_LOCK.md.
   ═══════════════════════════════════════════════════════════════════ */

export type MeetingClass = 'critical' | 'representational' | 'informational' | 'duplicate';
export type InviteeCriticality = 'critical' | 'contributing' | 'informational';
export type RepresentationRequirement = 'person_required' | 'org_delegate_minimum' | 'agent_optional';
export type AttendanceMode = 'live' | 'delegate' | 'async_digest' | 'not_needed';

/** Consent record produced when an individual delegates a meeting to an agent. */
export interface DelegationGrant {
  personId: string;
  meetingId: string;
  grantedAt: string;            // ISO
  scope: 'own_remit';
  revoked?: boolean;
}

export interface MeetingInvitee {
  personId: string;
  orgSlug: string;
  criticality: InviteeCriticality;
  criticalityRationale: string;            // computed, plain language
  requirement: RepresentationRequirement;  // organizer floor
  chosenMode?: AttendanceMode;             // set only by the individual
  delegationGrant?: DelegationGrant;
}

export type RemitDigestKind =
  | 'ask_of_my_org' | 'decision_affecting_dependency' | 'action_in_my_remit' | 'input_requested';

export interface RemitDigestItem {
  kind: RemitDigestKind;
  text: string;
  sourceRemitRef: string;                  // cites the org-card section / role card it came from
}

/* ── Agenda + need-by timing ─────────────────────────────────────── */
export interface NeedBy {
  date: string;                            // ISO date the outcome is needed by
  reason?: string;
}

export type AgendaItemKind = 'decision' | 'input_review' | 'status' | 'escalation';

export interface MeetingAgendaItem {
  topic: string;
  kind: AgendaItemKind;
  needBy?: NeedBy;                         // when the decision/outcome is needed
  exercisesDecisionRight?: boolean;        // a named decision right is invoked
  reviewsAgreement?: boolean;              // signs / reviews a Success Agreement
}

export type Urgency = 'overdue' | 'due_this_week' | 'on_track' | 'no_pressure';
export type MeetingCadence = 'one_time' | 'weekly' | 'biweekly' | 'monthly';

/* ── Rate card (the seat, never the person) ──────────────────────── */
export type RoleBand =
  | 'individual_contributor' | 'senior_ic' | 'manager' | 'director' | 'vp' | 'c_level';

export interface RateBand {
  annualBase: number;
  hourly: number;                          // = annualBase × multiplier ÷ 2080 (derived)
  halfHour: number;                        // = hourly ÷ 2 (derived)
}

export interface RateCard {
  currency: Currency;
  loadedCostMultiplier: number;            // default 1.35 (benefits / overhead on base comp)
  bands: Record<RoleBand, RateBand>;
  illustrative: boolean;                   // true until first edited in Admin
}

/* ── Economics (estimates for decision-making, never payroll) ────── */
export interface MeetingEconomics {
  durationMin: number;
  liveCount: number;
  delegateCount: number;
  asyncCount: number;
  hoursCost: number;                       // total seat-hours consumed live
  hoursReturned: number;                   // seat-hours returned via delegate / async
  costEstimate: number;                    // Σ live-attendee band hourly × duration
  costAvoided: number;                     // Σ delegated / async band hourly × duration
  recoverableOpportunity: number;          // what COULD still be saved
  annualizedRecurringCost?: number;        // recurring: per-occurrence × occurrences/yr
  annualizedRecoverable?: number;          // recurring: recoverable × occurrences/yr
  rationale: string;
}

export type OpportunityDriver =
  | 'informational_attendance' | 'duplicate_meetings' | 'async_eligible' | 'agreement_gap_escalations';

export interface EnterpriseOpportunity {
  annualMeetingSpend: number;
  recoverable: number;
  byDriver: Array<{ driver: OpportunityDriver; amount: number; rationale: string }>;
}
