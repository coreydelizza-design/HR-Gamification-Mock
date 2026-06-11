import type { OrganizationCard } from '../lib/types';

/**
 * Tier-1 Organization Cards — the 12 "rich" cards.
 *
 * One card per Tier-1 organization (see data/organizations.ts), in catalog
 * order: o-ea, o-ops, o-hr, o-sales, o-cs, o-pmo, o-prod, o-eng, o-fin,
 * o-legal, o-sec, o-data. Each card publishes all 13 sections and carries the
 * full prose payload defined by OrganizationCard.
 *
 * Content is org-level and operational: what the organization owns, what it
 * needs, how it helps, how to engage it, and where it carries risk. No
 * individual names appear in friction/risk context; no ranking, scoring,
 * personality, or performance language.
 */

const ALL_SECTIONS = [
  'overview',
  'how_succeeds',
  'what_owns',
  'what_needs',
  'how_helps',
  'dependencies',
  'engagement',
  'meeting_norms',
  'handoff_rules',
  'agreements',
  'people',
  'risks',
  'freshness',
] as const;

export const ORG_CARDS_TIER1: OrganizationCard[] = [
  /* ── 1 · Enterprise Architecture (o-ea) ─────────────────────────── */
  {
    id: 'card-ea',
    orgId: 'o-ea',

    missionCriticalOutcomes: [
      'Target-state architecture is defined and adopted before delivery teams commit a sprint',
      'Cross-cutting concerns (identity, data residency, integration) are decided once and reused',
      'New systems land on approved patterns rather than one-off designs',
      'Technical debt is visible, prioritized, and traded off deliberately, not accidentally',
    ],
    successConditions: [
      'Architecture decisions are recorded as ADRs the delivery teams can find and cite',
      'A reference architecture exists for each major domain before build starts',
      'Pattern adoption is measured, not assumed',
      'Architects are engaged at intake, not invited to review after the design is fixed',
    ],
    leadingIndicators: [
      'Share of new initiatives that pass an early architecture review before sprint zero',
      'Number of approved reference patterns with a named owner',
      'Average lead time from architecture request to a decision record',
    ],
    laggingIndicators: [
      'Rate of post-launch rework traced to a missing or ignored pattern',
      'Count of duplicate capabilities built across teams in the last two quarters',
    ],
    operatingMetrics: [
      { label: 'Pattern adoption across active initiatives', value: '78%', kind: 'quality', trend: 'up' },
      { label: 'Median architecture-decision lead time', value: '6.5 days', kind: 'operating', trend: 'down' },
      { label: 'Reference architectures with a named owner', value: '14', kind: 'capacity', trend: 'flat' },
      { label: 'Initiatives reviewed before sprint zero', value: '71%', kind: 'leading', trend: 'up' },
    ],
    capacitySignals: [
      'Principal-architect time is the binding constraint on concurrent reviews',
      'Roughly four major domains can be actively shepherded at once',
      'Deep-dive design partnerships are capped at two per architect per quarter',
    ],
    qualitySignals: [
      'Decisions are documented as ADRs with context, options, and consequences',
      'Reference architectures carry a freshness date and a review owner',
      'Standards are expressed as fitness functions where they can be automated',
    ],
    riskSignals: [
      'Initiatives reaching design review with the architecture already locked',
      'Growth in shadow integrations bypassing approved patterns',
      'Reference material drifting past its review date',
    ],
    stakeholderOutcomes: [
      'Engineering builds on a coherent target state instead of negotiating it per project',
      'Security and Data inherit consistent control and integration points',
      'Product gets earlier, clearer feasibility signals on roadmap bets',
    ],
    maturityLevel: 'established',
    currentBlockers: [
      'Architecture is sometimes consulted after delivery commitments are already made',
      'A backlog of reference patterns lacks an assigned owner to keep them current',
    ],
    nextBestActions: [
      'Embed an architecture gate in the intake step of every major initiative',
      'Assign owners and review dates to the unowned reference patterns',
      'Publish the ADR index so delivery teams can self-serve prior decisions',
    ],

    responsibilities: [
      'Define and maintain the enterprise target-state architecture',
      'Own architecture patterns, reference designs, and the ADR record',
      'Run architecture review for major initiatives and significant changes',
      'Govern cross-cutting concerns: integration, identity, data flows, resilience',
    ],
    services: [
      'Early architecture consultation at initiative intake',
      'Reference architectures and reusable design patterns',
      'Architecture review boards and decision records',
      'Technical-debt assessment and remediation sequencing',
    ],
    systems: [
      'Architecture decision record (ADR) repository',
      'Reference-architecture and pattern catalog',
      'Enterprise system and capability map',
    ],
    decisions: [
      'Approve or revise target-state patterns for a domain',
      'Accept, reject, or condition an initiative\'s proposed architecture',
      'Sequence technical-debt remediation against delivery priorities',
    ],
    processes: [
      'Architecture intake and early-review triage',
      'ADR authoring, review, and ratification',
      'Pattern lifecycle: propose, approve, adopt, retire',
    ],
    businessOutcomes: [
      'Lower integration cost through reuse of approved patterns',
      'Fewer reliability and security surprises from inconsistent designs',
      'Faster delivery once teams build on a settled target state',
    ],
    artifactsProduced: [
      'Architecture decision records (ADRs)',
      'Reference architectures and pattern catalog entries',
      'Capability and system maps',
      'Technical-debt registers with remediation sequencing',
    ],
    governanceAreas: [
      'Integration and API standards',
      'Data-flow and residency patterns (with Data & AI and Security)',
      'Resilience and availability tiers',
    ],
    notOwned: [
      'Implementation and operation of services (Engineering owns build and run)',
      'Security policy and control enforcement (Security owns)',
      'Product priority and sequencing (Product Management owns)',
    ],

    requiredInputs: [
      {
        input: 'Problem statement and target outcomes for the initiative',
        fromOrgId: 'o-prod',
        format: 'One-page initiative brief with outcomes and constraints',
        timing: 'At intake, before sprint zero',
        qualityBar: 'Outcome stated as a measurable change, with hard constraints named',
      },
      {
        input: 'Security and compliance constraints for the domain',
        fromOrgId: 'o-sec',
        format: 'Control requirements mapped to the relevant data classification',
        timing: 'During early review, before pattern selection',
        qualityBar: 'Constraints are specific and reference an applicable standard',
      },
      {
        input: 'Data model and lineage expectations',
        fromOrgId: 'o-data',
        format: 'Source-of-truth definitions and integration contracts',
        timing: 'Before integration patterns are ratified',
        qualityBar: 'Ownership and lineage are unambiguous for each shared entity',
      },
      {
        input: 'Delivery capacity and timeline reality',
        fromOrgId: 'o-eng',
        format: 'Team availability and a feasible delivery window',
        timing: 'Before remediation sequencing is committed',
        qualityBar: 'Estimates reflect real team load, not aspirational headroom',
      },
    ],
    missingInputFailureModes: [
      'Without an outcome-anchored brief, reviews debate solutions before the problem is settled',
      'Missing security constraints force late redesigns after a pattern is chosen',
      'Unclear data ownership produces integration contracts that break downstream',
    ],
    escalationTriggers: [
      'An initiative proceeds to build without an architecture decision on record',
      'A delivery team adopts a non-approved pattern for a cross-cutting concern',
      'Two teams are independently building the same capability',
    ],
    commonMisconceptions: [
      'That architecture review is a sign-off gate rather than an early design partnership',
      'That a pattern, once approved, never needs revisiting',
      'That architecture owns implementation quality rather than design coherence',
    ],
    reworkCauses: [
      'Designs locked before architecture is engaged',
      'Constraints surfaced after the pattern is chosen',
      'Integration contracts authored without agreed data ownership',
    ],
    delayCauses: [
      'Initiative briefs that state a solution instead of an outcome',
      'Concurrent deep-dive requests exceeding architect capacity',
      'Stalled decisions waiting on absent security or data inputs',
    ],

    outputs: [
      'Ratified target-state architectures per domain',
      'Approved, documented patterns ready for reuse',
      'Decision records that delivery teams can cite',
    ],
    servicesOffered: [
      'Early architecture consultation before design lock',
      'Pattern selection and tailoring for a specific initiative',
      'Architecture review and conditional approval',
    ],
    expertise: [
      'Integration and distributed-systems design',
      'Resilience, availability tiering, and failure-mode analysis',
      'Build-versus-reuse and target-state tradeoff analysis',
    ],
    decisionSupport: [
      'Options analysis with consequences for major design choices',
      'Feasibility signal on roadmap bets before commitment',
      'Remediation sequencing recommendations for technical debt',
    ],
    enablement: [
      'Reference architectures that shorten design time',
      'Reusable patterns that remove repeated decisions',
      'Fitness functions that automate standard conformance',
    ],
    riskReduction: [
      'Consistent integration and identity reduce reliability surprises',
      'Early review catches incompatible designs before build cost is sunk',
      'Documented decisions prevent re-litigating settled tradeoffs',
    ],
    acceleration: [
      'Teams that adopt a reference pattern skip the design-from-scratch phase',
      'Early engagement removes late redesign loops',
    ],
    advisoryRole: [
      'Trusted advisor on cross-cutting technical strategy',
      'Neutral party for build-versus-reuse disputes across teams',
    ],
    reusableArtifacts: [
      'Pattern catalog entries with adoption guidance',
      'ADR templates and a searchable decision index',
      'Capability maps showing existing and planned coverage',
    ],
    serviceExpectations: [
      'Architecture decisions returned within one week of a complete request',
      'Early-review slot available within three business days of intake',
      'Reference patterns reviewed for freshness each quarter',
    ],
    bestWaysToEngage: [
      'Bring an outcome-anchored brief, not a finished design',
      'Engage at intake so options are still open',
      'Ask for an existing pattern before proposing a new one',
    ],

    engagement: {
      howToEngage: 'Open an architecture intake at initiative start with a one-page brief; deeper design partnership is scheduled from there.',
      intakeProcess: 'Submit an intake request; triage assigns an early-review slot or routes you to an existing pattern.',
      intakeFields: ['Initiative name', 'Target outcome', 'Hard constraints', 'Affected domains', 'Requested decision date'],
      contactChannel: '#architecture-intake (async) with a weekly office-hours block',
      responseRhythm: 'Acknowledged within one business day; early-review slot within three',
      officeHours: 'Tuesdays and Thursdays, 30-minute open consultation slots',
      cadenceStyle: 'balanced',
      escalationPath: 'Principal Architect, then VP Architecture for cross-org tradeoffs',
      decisionRights: ['Approve target-state patterns', 'Condition or reject an initiative architecture'],
      approvalRights: ['Ratify ADRs', 'Sign off cross-cutting integration and identity designs'],
    },
    meetingNorms: {
      includeWhen: [
        'A cross-cutting design decision needs to be made',
        'An initiative is selecting between competing patterns',
        'Technical-debt remediation must be sequenced against delivery',
      ],
      doNotIncludeWhen: [
        'The question is implementation detail inside one team',
        'A documented pattern already answers the question',
        'No decision is actually being requested',
      ],
      requiredPreRead: 'Initiative brief plus the candidate options, shared 24 hours ahead',
      requiredAgenda: 'Decision requested, options, and constraints listed explicitly',
      requiredDecisionOwner: true,
      preferredLength: '45 minutes',
      preferredCadence: 'Architecture review board weekly; design deep-dives as needed',
      asyncAlternatives: ['ADR comment thread', 'Pattern-selection checklist resolved in the ticket'],
      recurringRules: 'The weekly board only takes items with a complete pre-read; others roll to async',
    },
    handoffRules: [
      {
        id: 'ho-ea-1',
        name: 'Architecture decision to delivery team',
        checklist: [
          'ADR ratified and linked in the initiative ticket',
          'Selected pattern and its constraints documented',
          'Open risks and assumptions listed',
        ],
        definitionOfReady: [
          'Outcome and constraints agreed',
          'Options evaluated with consequences',
          'Security and data inputs incorporated',
        ],
        definitionOfDone: [
          'Decision recorded and discoverable',
          'Delivery team has acknowledged the pattern and constraints',
          'Follow-up review date set if assumptions are provisional',
        ],
        requiredApprovals: ['Principal Architect'],
        requiredArtifacts: ['Ratified ADR', 'Pattern reference link'],
        handoffOwner: 'Reviewing architect',
        receivingOrgId: 'o-eng',
        failureModes: [
          'Decision recorded but never linked where the team works',
          'Constraints captured as prose the team cannot act on',
        ],
        recoveryPath: 'Reopen the ADR thread and pair with the delivery lead to translate constraints into acceptance criteria',
      },
    ],
    risks: [
      { kind: 'dependency', description: 'Late security or data inputs stall decisions and push redesign downstream', severity: 'medium', mitigation: 'Require those inputs as part of intake completeness before scheduling review' },
      { kind: 'capacity', description: 'Concurrent deep-dive demand exceeds principal-architect availability', severity: 'medium', mitigation: 'Cap active partnerships and route the rest to patterns and office hours' },
      { kind: 'stale_knowledge', description: 'Reference patterns drift out of date and lose adoption trust', severity: 'high', mitigation: 'Assign owners and quarterly freshness reviews to every pattern' },
      { kind: 'decision', description: 'Architecture engaged after design lock, reducing review to a rubber stamp', severity: 'high', mitigation: 'Move the architecture gate to intake, before sprint zero' },
    ],

    publishedSections: [...ALL_SECTIONS],
    lastUpdatedAt: '2026-05-18T00:00:00Z',
  },

  /* ── 2 · Operations (o-ops) ─────────────────────────────────────── */
  {
    id: 'card-ops',
    orgId: 'o-ops',

    missionCriticalOutcomes: [
      'The business operating cadence runs on time and produces decisions, not just status',
      'Internal systems every org depends on stay available and current',
      'Cross-org processes have a clear owner and an agreed service level',
      'Operational exceptions are caught and routed before they become incidents',
    ],
    successConditions: [
      'Each recurring operating ritual has a named owner and a defined output',
      'Internal-system requests follow one intake, not a dozen side channels',
      'Process changes are communicated before they take effect',
      'Service levels are published and measured, not implied',
    ],
    leadingIndicators: [
      'Share of operating rituals that close with a recorded decision',
      'Internal-request intake compliance versus side-channel volume',
      'Backlog age for system and process change requests',
    ],
    laggingIndicators: [
      'Count of operational incidents traced to an unowned process',
      'Cycle time from request to fulfilled internal-system change',
    ],
    operatingMetrics: [
      { label: 'On-time operating-cadence completion', value: '94%', kind: 'operating', trend: 'flat' },
      { label: 'Internal-request median fulfillment', value: '3.1 days', kind: 'operating', trend: 'down' },
      { label: 'Processes with a named owner', value: '88%', kind: 'quality', trend: 'up' },
      { label: 'Intake compliance vs side channels', value: '82%', kind: 'leading', trend: 'up' },
    ],
    capacitySignals: [
      'A fixed pool of operations analysts absorbs cross-org request spikes',
      'Quarter-close and planning windows consume most discretionary capacity',
      'Net-new process design competes directly with run-the-business load',
    ],
    qualitySignals: [
      'Each process has an owner, an input, an output, and a service level',
      'Runbooks exist for recurring operational tasks',
      'Change requests carry an impact statement before they are scheduled',
    ],
    riskSignals: [
      'Rising volume of requests arriving outside the intake',
      'Operating rituals that produce status but no decisions',
      'Runbooks that have not been exercised or reviewed this quarter',
    ],
    stakeholderOutcomes: [
      'Other orgs spend less time chasing internal logistics and more on their mission',
      'Leadership gets a reliable operating rhythm that surfaces decisions on time',
      'Finance and HR inherit clean, predictable process handoffs',
    ],
    maturityLevel: 'established',
    currentBlockers: [
      'Some cross-org processes still lack a single accountable owner',
      'Side-channel requests undercut the central intake and create invisible load',
    ],
    nextBestActions: [
      'Assign owners to the remaining unowned cross-org processes',
      'Consolidate intake so all internal-system requests enter one queue',
      'Convert status-only rituals into decision-producing forums',
    ],

    responsibilities: [
      'Own the business operating cadence and its planning rituals',
      'Run and maintain the internal systems other orgs depend on',
      'Define, own, and measure cross-org operational processes',
      'Coordinate operational exception handling and routing',
    ],
    services: [
      'Operating-cadence facilitation and decision tracking',
      'Internal-system request intake and fulfillment',
      'Process design, documentation, and ownership assignment',
      'Operational reporting and exception escalation',
    ],
    systems: [
      'Internal request and workflow tooling',
      'Operating-cadence and planning calendar',
      'Process and runbook library',
    ],
    decisions: [
      'Set the operating-cadence schedule and required outputs',
      'Prioritize internal-system change requests',
      'Assign process ownership across organizations',
    ],
    processes: [
      'Operating-cadence planning and close',
      'Internal-request intake, triage, and fulfillment',
      'Process change control and communication',
    ],
    businessOutcomes: [
      'Predictable operating rhythm that produces timely decisions',
      'Lower friction for every org that depends on internal systems',
      'Fewer incidents from unowned or undocumented processes',
    ],
    artifactsProduced: [
      'Operating-cadence calendar and decision logs',
      'Process maps with owners and service levels',
      'Runbooks for recurring operational tasks',
      'Operational status and exception reports',
    ],
    governanceAreas: [
      'Process ownership and service-level standards',
      'Internal-system change control',
      'Operating-cadence design',
    ],
    notOwned: [
      'Financial planning and capital allocation (Finance owns)',
      'People programs and policy (People Operations owns)',
      'Product and engineering delivery (those orgs own)',
    ],

    requiredInputs: [
      {
        input: 'Budget and forecast envelope for operational planning',
        fromOrgId: 'o-fin',
        format: 'Approved operating budget by cost area',
        timing: 'Ahead of each planning cycle',
        qualityBar: 'Figures are final and reconciled, not provisional',
      },
      {
        input: 'Headcount and onboarding pipeline',
        fromOrgId: 'o-hr',
        format: 'Confirmed start dates and role assignments',
        timing: 'Two weeks before each onboarding wave',
        qualityBar: 'Dates are committed, not tentative',
      },
      {
        input: 'System change and incident context',
        fromOrgId: 'o-itsd',
        format: 'Change tickets with impact and rollback notes',
        timing: 'Before any scheduled maintenance window',
        qualityBar: 'Impact and affected orgs are explicitly named',
      },
      {
        input: 'Cross-org dependency and milestone map',
        fromOrgId: 'o-pmo',
        format: 'Current dependency register with dates',
        timing: 'Refreshed each operating cycle',
        qualityBar: 'Dependencies carry owners and due dates',
      },
    ],
    missingInputFailureModes: [
      'Without a final budget, planning rituals reopen decisions already thought settled',
      'Tentative start dates break onboarding logistics and create rework',
      'Change tickets without impact notes turn maintenance into surprise outages',
    ],
    escalationTriggers: [
      'A cross-org process operates with no accountable owner',
      'Internal-system requests stall past their published service level',
      'A planning ritual concludes with no decision recorded',
    ],
    commonMisconceptions: [
      'That Operations sets priorities rather than running the cadence that surfaces them',
      'That any request can bypass intake if it feels urgent',
      'That a process without a written owner is still being managed',
    ],
    reworkCauses: [
      'Provisional inputs treated as final during planning',
      'Requests entering through side channels and missing context',
      'Process changes deployed before affected orgs are informed',
    ],
    delayCauses: [
      'Intake bypassed, so work arrives without the data to act on it',
      'Capacity fully consumed by quarter-close and planning windows',
      'Decisions deferred for missing budget or headcount inputs',
    ],

    outputs: [
      'A reliable, decision-producing operating cadence',
      'Fulfilled internal-system changes within service level',
      'Owned, documented cross-org processes',
    ],
    servicesOffered: [
      'Facilitation of operating and planning rituals',
      'Intake and fulfillment for internal-system needs',
      'Process design and ownership assignment',
    ],
    expertise: [
      'Operating-cadence and planning design',
      'Process mapping and service-level definition',
      'Cross-org coordination and exception routing',
    ],
    decisionSupport: [
      'Operational status that frames the decisions leadership must make',
      'Impact analysis for proposed process or system changes',
      'Capacity reality for cross-org planning',
    ],
    enablement: [
      'Runbooks that let teams self-serve recurring tasks',
      'A single intake that removes request guesswork',
      'Process maps that clarify who owns what',
    ],
    riskReduction: [
      'Owned processes reduce unowned-gap incidents',
      'Change control with impact notes prevents surprise outages',
      'Decision-producing rituals prevent drift and re-litigation',
    ],
    acceleration: [
      'Standard intake shortens time from request to fulfillment',
      'Pre-agreed service levels remove negotiation per request',
    ],
    advisoryRole: [
      'Neutral coordinator for cross-org operational tradeoffs',
      'Advisor on operating-model design and process ownership',
    ],
    reusableArtifacts: [
      'Process map and service-level templates',
      'Operating-cadence and decision-log templates',
      'Runbook library for recurring operations',
    ],
    serviceExpectations: [
      'Internal-system requests acknowledged within one business day',
      'Standard requests fulfilled within three business days',
      'Operating-cadence outputs published within 24 hours of each ritual',
    ],
    bestWaysToEngage: [
      'Use the central intake, even when the request feels urgent',
      'Bring final inputs to planning, not provisional ones',
      'Name the decision you need from a ritual before it starts',
    ],

    engagement: {
      howToEngage: 'Route all operational and internal-system needs through the central intake queue; recurring forums are scheduled on the operating calendar.',
      intakeProcess: 'Submit a request with impact and timing; triage assigns an owner and a service-level commitment.',
      intakeFields: ['Request type', 'Affected orgs', 'Desired timing', 'Impact if delayed', 'Requesting owner'],
      contactChannel: '#ops-intake queue with a shared service-level dashboard',
      responseRhythm: 'Acknowledged within one business day; standard requests fulfilled within three',
      officeHours: 'Weekly operations clinic for cross-org coordination questions',
      cadenceStyle: 'balanced',
      escalationPath: 'Sr Director, Business Operations, then COO for cross-org conflicts',
      decisionRights: ['Set the operating-cadence schedule', 'Assign cross-org process ownership'],
      approvalRights: ['Approve internal-system change windows', 'Approve process change rollouts'],
    },
    meetingNorms: {
      includeWhen: [
        'A cross-org operational decision is needed this cycle',
        'A process owner must be assigned or reassigned',
        'A system change affects multiple organizations',
      ],
      doNotIncludeWhen: [
        'A status update can be read asynchronously',
        'The request fits the standard intake path',
        'No cross-org coordination is required',
      ],
      requiredPreRead: 'Operating status and the specific decisions requested, sent the day before',
      requiredAgenda: 'Each item names the decision, the owner, and the deadline',
      requiredDecisionOwner: true,
      preferredLength: '30 minutes',
      preferredCadence: 'Weekly operating review; planning rituals on the quarterly calendar',
      asyncAlternatives: ['Status dashboard', 'Decision log comment thread', 'Intake ticket resolution'],
      recurringRules: 'Recurring forums drop to async when no decision is on the agenda',
    },
    handoffRules: [
      {
        id: 'ho-ops-1',
        name: 'Process ownership transfer',
        checklist: [
          'Process map, inputs, outputs, and service level documented',
          'Runbook current and exercised',
          'Receiving owner acknowledged in writing',
        ],
        definitionOfReady: [
          'Process is mapped end to end',
          'Service level is defined and measurable',
          'Open exceptions are listed',
        ],
        definitionOfDone: [
          'New owner recorded in the process library',
          'Affected orgs notified of the ownership change',
          'First review date scheduled',
        ],
        requiredApprovals: ['Sr Director, Business Operations'],
        requiredArtifacts: ['Process map', 'Current runbook', 'Service-level definition'],
        handoffOwner: 'Outgoing process owner',
        receivingOrgId: 'o-pmo',
        failureModes: [
          'Ownership moved without the runbook being current',
          'Affected orgs never told the contact changed',
        ],
        recoveryPath: 'Pause the transfer, refresh the runbook, and re-notify dependent orgs before going live',
      },
    ],
    risks: [
      { kind: 'operational', description: 'Unowned cross-org processes turn into incidents no one is accountable for', severity: 'high', mitigation: 'Assign and publish an owner for every cross-org process' },
      { kind: 'capacity', description: 'Quarter-close and planning windows consume capacity needed for change work', severity: 'medium', mitigation: 'Reserve a fixed run-the-business buffer outside peak windows' },
      { kind: 'handoff', description: 'Side-channel requests bypass intake and lose required context', severity: 'medium', mitigation: 'Consolidate intake and decline out-of-channel work into the queue' },
      { kind: 'meeting', description: 'Operating rituals produce status but no decisions', severity: 'low', mitigation: 'Require a named decision on every recurring agenda item' },
    ],

    publishedSections: [...ALL_SECTIONS],
    lastUpdatedAt: '2026-05-22T00:00:00Z',
  },

  /* ── 3 · People Operations (o-hr) ───────────────────────────────── */
  {
    id: 'card-hr',
    orgId: 'o-hr',

    missionCriticalOutcomes: [
      'Hiring, growth, and retention programs keep every org adequately staffed',
      'People processes run predictably enough that managers can plan around them',
      'Policy and compliance obligations are met without slowing the business',
      'Workforce signals reach leadership early enough to act on',
    ],
    successConditions: [
      'Each people process has a defined owner, timeline, and service level',
      'Manager-facing guidance is current and self-serve',
      'Onboarding handoffs land with confirmed dates and equipment ready',
      'Policy changes are communicated before they take effect',
    ],
    leadingIndicators: [
      'Time from approved requisition to confirmed start date',
      'Onboarding readiness rate at day one',
      'Manager self-serve resolution versus escalated tickets',
    ],
    laggingIndicators: [
      'Regretted attrition trend by org',
      'Cycle time for people-process requests',
    ],
    operatingMetrics: [
      { label: 'Day-one onboarding readiness', value: '91%', kind: 'quality', trend: 'up' },
      { label: 'Requisition-to-start median', value: '37 days', kind: 'operating', trend: 'down' },
      { label: 'Manager self-serve resolution', value: '74%', kind: 'leading', trend: 'flat' },
      { label: 'People-process SLA adherence', value: '88%', kind: 'operating', trend: 'up' },
    ],
    capacitySignals: [
      'A fixed business-partner ratio limits concurrent org support',
      'Cyclical peaks (review cycles, onboarding waves) compress capacity',
      'Policy and compliance work draws from the same pool as program work',
    ],
    qualitySignals: [
      'Manager guidance is dated and reviewed each cycle',
      'Onboarding checklists are confirmed before start dates',
      'People-process requests carry a clear category and owner',
    ],
    riskSignals: [
      'Manager guidance drifting past its review date',
      'Onboarding handoffs arriving without confirmed dates',
      'Escalations rising as self-serve guidance goes stale',
    ],
    stakeholderOutcomes: [
      'Managers spend less time on process and more on their teams',
      'New hires reach productivity faster with ready onboarding',
      'Leadership sees workforce risk early enough to respond',
    ],
    maturityLevel: 'developing',
    currentBlockers: [
      'Some manager guidance has aged past its review date',
      'Onboarding handoffs sometimes arrive without confirmed start dates',
    ],
    nextBestActions: [
      'Refresh the manager guidance library and set review dates',
      'Tighten the onboarding handoff to require confirmed dates and equipment',
      'Publish people-process service levels so managers can plan around them',
    ],

    responsibilities: [
      'Run hiring partnership, onboarding, and offboarding processes',
      'Own performance, growth, and retention program operations',
      'Maintain people policy and compliance obligations',
      'Provide manager guidance and people-process support',
    ],
    services: [
      'Onboarding and offboarding coordination',
      'Manager guidance and people-process support',
      'Program operations for growth and retention',
      'Policy and compliance administration',
    ],
    systems: [
      'HRIS and people-records system',
      'Onboarding workflow and checklist tooling',
      'Policy and guidance knowledge base',
    ],
    decisions: [
      'Set people-process timelines and service levels',
      'Interpret and apply people policy to specific cases',
      'Prioritize program operations against run-the-business load',
    ],
    processes: [
      'Onboarding and offboarding execution',
      'Performance and growth cycle operations',
      'Policy change administration and communication',
    ],
    businessOutcomes: [
      'Predictable staffing and faster time to productivity',
      'Compliant people operations without business drag',
      'Earlier workforce-risk signal to leadership',
    ],
    artifactsProduced: [
      'Onboarding and offboarding checklists',
      'Manager guidance and policy documents',
      'Workforce status and people-process reports',
      'Compliance records and attestations',
    ],
    governanceAreas: [
      'People policy and compliance',
      'People-data privacy and access',
      'Process service-level standards',
    ],
    notOwned: [
      'Sourcing and candidate pipeline (Talent Acquisition owns)',
      'Skills curriculum design (Learning & Development owns)',
      'Total-rewards budget (Finance owns the envelope)',
    ],

    requiredInputs: [
      {
        input: 'Approved headcount and total-rewards envelope',
        fromOrgId: 'o-fin',
        format: 'Signed-off plan by org and role band',
        timing: 'Ahead of each hiring and review cycle',
        qualityBar: 'Numbers are final and reconciled with the operating plan',
      },
      {
        input: 'Confirmed candidate pipeline and offer status',
        fromOrgId: 'o-ta',
        format: 'Pipeline view with stage and target start dates',
        timing: 'Two weeks before each onboarding wave',
        qualityBar: 'Start dates are committed, with role and manager named',
      },
      {
        input: 'Policy and regulatory constraints',
        fromOrgId: 'o-legal',
        format: 'Reviewed policy language and jurisdiction notes',
        timing: 'Before any policy change is communicated',
        qualityBar: 'Constraints are jurisdiction-specific and reviewed',
      },
      {
        input: 'Onboarding logistics and access provisioning',
        fromOrgId: 'o-ops',
        format: 'Equipment, access, and workspace readiness confirmation',
        timing: 'Before each confirmed start date',
        qualityBar: 'Each item is confirmed, not assumed',
      },
    ],
    missingInputFailureModes: [
      'Without a final envelope, requisitions stall and start dates slip',
      'Unconfirmed pipeline dates break onboarding logistics',
      'Unreviewed policy language creates compliance exposure',
    ],
    escalationTriggers: [
      'A start date slips for missing access or equipment',
      'A policy is applied inconsistently across orgs',
      'A people-process request breaches its service level',
    ],
    commonMisconceptions: [
      'That People Operations sources candidates rather than partnering on hiring',
      'That guidance, once written, stays current without review',
      'That any policy interpretation is informal and unrecorded',
    ],
    reworkCauses: [
      'Onboarding started against tentative dates',
      'Policy communicated before legal review',
      'Stale guidance driving avoidable escalations',
    ],
    delayCauses: [
      'Missing or provisional budget inputs',
      'Cyclical peaks compressing partner capacity',
      'Logistics not confirmed before start dates',
    ],

    outputs: [
      'Ready onboarding at day one',
      'Current, self-serve manager guidance',
      'Compliant, well-administered people processes',
    ],
    servicesOffered: [
      'Onboarding and offboarding coordination',
      'Manager guidance and case support',
      'Program operations and policy administration',
    ],
    expertise: [
      'People-process design and service levels',
      'Policy interpretation and compliance',
      'Workforce-signal analysis',
    ],
    decisionSupport: [
      'Workforce status that frames staffing decisions',
      'Policy interpretation for specific situations',
      'Retention-risk signal for leadership planning',
    ],
    enablement: [
      'Self-serve manager guidance that reduces escalations',
      'Onboarding checklists that get hires productive faster',
      'Published service levels managers can plan around',
    ],
    riskReduction: [
      'Reviewed policy reduces compliance exposure',
      'Confirmed onboarding handoffs prevent day-one gaps',
      'Early workforce signal reduces surprise attrition',
    ],
    acceleration: [
      'Ready onboarding shortens time to productivity',
      'Self-serve guidance resolves manager questions without a queue',
    ],
    advisoryRole: [
      'Advisor to managers on people situations and policy',
      'Partner to leadership on workforce planning',
    ],
    reusableArtifacts: [
      'Onboarding and offboarding checklist templates',
      'Manager guidance library',
      'Policy and attestation templates',
    ],
    serviceExpectations: [
      'People-process requests acknowledged within one business day',
      'Onboarding readiness confirmed three days before start',
      'Manager guidance reviewed for currency each quarter',
    ],
    bestWaysToEngage: [
      'Bring confirmed dates and roles, not tentative ones',
      'Check the guidance library before opening a case',
      'Loop in People Operations before, not after, a policy-sensitive change',
    ],

    engagement: {
      howToEngage: 'Use the people-process intake for cases and onboarding; manager guidance is self-serve in the knowledge base first.',
      intakeProcess: 'Submit a categorized request; triage routes it to the right partner with a service-level commitment.',
      intakeFields: ['Request category', 'Affected org or person count', 'Timing', 'Policy sensitivity', 'Requesting manager'],
      contactChannel: '#people-help intake with a self-serve guidance base',
      responseRhythm: 'Acknowledged within one business day; case routing within two',
      officeHours: 'Weekly manager clinic for people-process and policy questions',
      cadenceStyle: 'async_first',
      escalationPath: 'Director, People Operations, then CHRO for policy or cross-org conflicts',
      decisionRights: ['Set people-process service levels', 'Interpret policy for specific cases'],
      approvalRights: ['Approve policy-change communications', 'Approve onboarding-process exceptions'],
    },
    meetingNorms: {
      includeWhen: [
        'A policy interpretation needs a decision',
        'A cross-org people program is being designed',
        'A sensitive case requires real-time coordination',
      ],
      doNotIncludeWhen: [
        'Guidance already answers the question',
        'The request fits the standard intake path',
        'A status update can be read asynchronously',
      ],
      requiredPreRead: 'Case summary or program brief shared a day ahead',
      requiredAgenda: 'The decision or guidance requested is stated explicitly',
      requiredDecisionOwner: true,
      preferredLength: '30 minutes',
      preferredCadence: 'Weekly partner sync; program reviews on the cycle calendar',
      asyncAlternatives: ['Guidance base article', 'Case ticket thread', 'Policy FAQ update'],
      recurringRules: 'Sensitive-case discussions are scheduled fresh, not folded into recurring status',
    },
    handoffRules: [
      {
        id: 'ho-hr-1',
        name: 'New-hire onboarding handoff',
        checklist: [
          'Start date, role, and manager confirmed',
          'Equipment, access, and workspace provisioning requested',
          'Day-one schedule and buddy assigned',
        ],
        definitionOfReady: [
          'Offer accepted with a committed start date',
          'Role and manager recorded in the HRIS',
          'Logistics request submitted to Operations',
        ],
        definitionOfDone: [
          'Day-one readiness confirmed three days prior',
          'Access and equipment verified',
          'Manager acknowledged the onboarding plan',
        ],
        requiredApprovals: ['Director, People Operations'],
        requiredArtifacts: ['Onboarding checklist', 'Confirmed start record'],
        handoffOwner: 'People Operations partner',
        receivingOrgId: 'o-ops',
        failureModes: [
          'Onboarding started against a tentative date',
          'Equipment request submitted too late for day one',
        ],
        recoveryPath: 'Reconfirm the date, expedite provisioning, and adjust the day-one plan with the manager',
      },
    ],
    risks: [
      { kind: 'stale_knowledge', description: 'Manager guidance ages past review and drives avoidable escalations', severity: 'medium', mitigation: 'Set review dates and refresh the guidance library each quarter' },
      { kind: 'handoff', description: 'Onboarding handoffs arrive without confirmed dates or logistics', severity: 'high', mitigation: 'Require confirmed dates and provisioning before onboarding starts' },
      { kind: 'dependency', description: 'Late budget or pipeline inputs stall hiring and start dates', severity: 'medium', mitigation: 'Lock final inputs ahead of each hiring and onboarding cycle' },
      { kind: 'capacity', description: 'Cyclical peaks compress partner capacity for program work', severity: 'low', mitigation: 'Stagger program work outside review and onboarding peaks' },
    ],

    publishedSections: [...ALL_SECTIONS],
    lastUpdatedAt: '2026-04-28T00:00:00Z',
  },

  /* ── 4 · Sales (o-sales) ────────────────────────────────────────── */
  {
    id: 'card-sales',
    orgId: 'o-sales',

    missionCriticalOutcomes: [
      'The right customers close with expectations that Customer Success can deliver on',
      'Market signal flows back into Product and the rest of the org',
      'Commercial value is validated, not assumed, before a deal is committed',
      'Deals move through stages with clean, reviewable artifacts',
    ],
    successConditions: [
      'Qualification criteria are applied consistently across the pipeline',
      'Commitments made in the sale are documented and handed off intact',
      'Legal and solution review happen before, not after, contract pressure peaks',
      'Forecast hygiene is good enough to plan against',
    ],
    leadingIndicators: [
      'Share of opportunities meeting qualification criteria at stage entry',
      'Pre-read completeness for deal reviews',
      'Time from intake to a completed legal or solution review',
    ],
    laggingIndicators: [
      'Win rate by segment',
      'Post-sale expectation-gap rate flagged by Customer Success',
    ],
    operatingMetrics: [
      { label: 'Qualified-stage compliance', value: '83%', kind: 'leading', trend: 'up' },
      { label: 'Forecast accuracy at quarter close', value: '92%', kind: 'lagging', trend: 'flat' },
      { label: 'Deal-desk turnaround median', value: '2.4 days', kind: 'operating', trend: 'down' },
      { label: 'Clean handoff rate to Customer Success', value: '79%', kind: 'quality', trend: 'up' },
    ],
    capacitySignals: [
      'Solution-architecture and legal review capacity gate complex deals',
      'End-of-quarter compresses review and approval bandwidth',
      'Deal-desk throughput limits concurrent non-standard terms',
    ],
    qualitySignals: [
      'Opportunities carry documented qualification at each stage',
      'Customer commitments are written down, not verbal',
      'Handoff packages to Customer Success are complete and reviewable',
    ],
    riskSignals: [
      'Non-standard terms requested late in the quarter',
      'Commitments made outside the documented scope',
      'Deals advancing stages without qualification evidence',
    ],
    stakeholderOutcomes: [
      'Customer Success inherits accounts they can actually make successful',
      'Product receives structured market signal to prioritize against',
      'Finance gets a forecast clean enough to plan capital against',
    ],
    maturityLevel: 'established',
    currentBlockers: [
      'Non-standard terms often arrive at legal and deal desk late in the quarter',
      'Some customer commitments are not captured in the handoff package',
    ],
    nextBestActions: [
      'Move legal and solution review earlier in the deal cycle',
      'Standardize the commitment record so handoffs carry full context',
      'Tighten qualification evidence at stage transitions',
    ],

    responsibilities: [
      'Own the sales pipeline from qualification to close',
      'Validate commercial value and fit before commitment',
      'Capture and route market signal to Product and leadership',
      'Produce clean handoff packages to Customer Success',
    ],
    services: [
      'Opportunity qualification and deal management',
      'Commercial-value validation',
      'Deal desk for non-standard terms',
      'Market-signal capture and routing',
    ],
    systems: [
      'CRM and pipeline tooling',
      'Deal-desk and approval workflow',
      'Forecasting and territory model',
    ],
    decisions: [
      'Qualify or disqualify an opportunity',
      'Approve standard commercial terms',
      'Sequence pipeline against capacity',
    ],
    processes: [
      'Qualification and stage progression',
      'Deal-desk review for non-standard terms',
      'Close and handoff to Customer Success',
    ],
    businessOutcomes: [
      'Revenue from customers who can be made successful',
      'A market-signal loop that sharpens the roadmap',
      'A forecast reliable enough to plan against',
    ],
    artifactsProduced: [
      'Qualified opportunity records',
      'Commitment and scope documents',
      'Handoff packages to Customer Success',
      'Forecast and pipeline reports',
    ],
    governanceAreas: [
      'Qualification and stage-gate standards',
      'Commercial-terms approval',
      'Forecast hygiene',
    ],
    notOwned: [
      'Contract drafting and legal risk (Legal owns)',
      'Implementation and ongoing success (Customer Success owns)',
      'Pricing strategy beyond approved bands (Finance and leadership own)',
    ],

    requiredInputs: [
      {
        input: 'Reviewed contract terms and risk position',
        fromOrgId: 'o-legal',
        format: 'Redlines and approved fallback positions',
        timing: 'Before the deal enters final negotiation',
        qualityBar: 'Fallbacks are pre-approved so reps can negotiate within them',
      },
      {
        input: 'Technical fit and implementation feasibility',
        fromOrgId: 'o-sa',
        format: 'Solution-fit assessment with implementation risks',
        timing: 'During qualification of complex deals',
        qualityBar: 'Risks and assumptions are explicit and testable',
      },
      {
        input: 'Product roadmap and capability boundaries',
        fromOrgId: 'o-prod',
        format: 'Current capability and committed roadmap dates',
        timing: 'Before any forward-looking commitment',
        qualityBar: 'Only committed items are presented as commitments',
      },
      {
        input: 'Approved pricing and discount bands',
        fromOrgId: 'o-fin',
        format: 'Discount authority matrix by deal size',
        timing: 'Ahead of negotiation',
        qualityBar: 'Authority levels are unambiguous and current',
      },
    ],
    missingInputFailureModes: [
      'Without pre-approved fallbacks, late legal review stalls close',
      'Without solution fit, deals close on assumptions that break in delivery',
      'Roadmap promises beyond commitment create downstream expectation gaps',
    ],
    escalationTriggers: [
      'Non-standard terms requested inside the close window',
      'A commitment is made outside approved scope or pricing',
      'A deal closes without a complete handoff package',
    ],
    commonMisconceptions: [
      'That Sales drafts contracts rather than negotiating within legal fallbacks',
      'That a verbal commitment carries into delivery without being written',
      'That roadmap aspiration is the same as a roadmap commitment',
    ],
    reworkCauses: [
      'Late legal and solution review under close pressure',
      'Commitments captured verbally and lost at handoff',
      'Pricing exceptions requested without authority context',
    ],
    delayCauses: [
      'Review capacity compressed at quarter end',
      'Non-standard terms entering deal desk late',
      'Missing roadmap or pricing inputs blocking negotiation',
    ],

    outputs: [
      'Qualified, well-scoped closed deals',
      'Structured market signal for Product',
      'Complete handoff packages for Customer Success',
    ],
    servicesOffered: [
      'Opportunity qualification and management',
      'Commercial-value validation',
      'Market-signal synthesis',
    ],
    expertise: [
      'Commercial qualification and negotiation',
      'Buyer and segment insight',
      'Deal structuring within approved bands',
    ],
    decisionSupport: [
      'Pipeline and forecast that frame revenue decisions',
      'Segment-level demand signal for prioritization',
      'Win/loss patterns for strategy',
    ],
    enablement: [
      'Qualification criteria that keep the pipeline clean',
      'Handoff packages that set Customer Success up to deliver',
      'Market signal that sharpens product bets',
    ],
    riskReduction: [
      'Validated fit reduces post-sale expectation gaps',
      'Pre-approved fallbacks reduce late-cycle legal risk',
      'Scoped commitments reduce delivery surprises',
    ],
    acceleration: [
      'Early legal and solution review shortens close cycles',
      'Pre-approved discount bands remove escalation loops',
    ],
    advisoryRole: [
      'Voice of the market in roadmap and pricing discussions',
      'Advisor on segment and buyer dynamics',
    ],
    reusableArtifacts: [
      'Qualification and stage-gate templates',
      'Commitment and handoff-package templates',
      'Win/loss and market-signal summaries',
    ],
    serviceExpectations: [
      'Deal-desk requests turned around within three business days',
      'Handoff package delivered within two days of close',
      'Market-signal summary published monthly',
    ],
    bestWaysToEngage: [
      'Bring solution and legal review in early, not at the close',
      'Document every customer commitment as you make it',
      'Present only committed roadmap items as commitments',
    ],

    engagement: {
      howToEngage: 'Engage deal desk for non-standard terms and solution architecture for complex fit; route market signal through the monthly synthesis.',
      intakeProcess: 'Open a deal-desk ticket with deal size, terms, and timing; review is scheduled by complexity.',
      intakeFields: ['Opportunity', 'Deal size', 'Non-standard terms', 'Target close date', 'Solution complexity'],
      contactChannel: '#deal-desk for terms; #market-signal for product-bound insight',
      responseRhythm: 'Deal-desk acknowledged same day; review within three business days',
      officeHours: 'Weekly deal clinic for structuring and qualification questions',
      cadenceStyle: 'meeting_first',
      escalationPath: 'Sr Director, Sales, then CRO for exception terms',
      decisionRights: ['Qualify or disqualify opportunities', 'Approve standard terms'],
      approvalRights: ['Approve discounts within authority', 'Approve handoff completeness'],
    },
    meetingNorms: {
      includeWhen: [
        'A non-standard term needs a real-time decision',
        'A complex deal needs cross-functional qualification',
        'A close-blocking issue needs immediate resolution',
      ],
      doNotIncludeWhen: [
        'A standard term fits the approval matrix',
        'A pipeline update can be read in the dashboard',
        'No decision is being requested',
      ],
      requiredPreRead: 'Deal summary, requested terms, and the specific ask, shared ahead',
      requiredAgenda: 'The decision requested and its deadline are explicit',
      requiredDecisionOwner: true,
      preferredLength: '30 minutes',
      preferredCadence: 'Weekly pipeline review; deal clinics as needed',
      asyncAlternatives: ['Deal-desk ticket', 'Pipeline dashboard', 'Approval-matrix self-serve'],
      recurringRules: 'Pipeline review stays to decisions and exceptions; status reads stay async',
    },
    handoffRules: [
      {
        id: 'ho-sales-1',
        name: 'Closed-won handoff to Customer Success',
        checklist: [
          'Signed scope and commitments documented',
          'Stakeholders, success criteria, and timeline captured',
          'Known risks and non-standard terms flagged',
        ],
        definitionOfReady: [
          'Contract signed and scope finalized',
          'Customer success criteria recorded',
          'Implementation assumptions validated with solution architecture',
        ],
        definitionOfDone: [
          'Handoff package delivered within two days of close',
          'Customer Success acknowledged and scheduled kickoff',
          'Open commitments tracked to an owner',
        ],
        requiredApprovals: ['Sr Director, Sales'],
        requiredArtifacts: ['Signed scope', 'Commitment record', 'Risk flags'],
        handoffOwner: 'Account executive',
        receivingOrgId: 'o-cs',
        failureModes: [
          'Verbal commitments missing from the package',
          'Risks discovered only after kickoff',
        ],
        recoveryPath: 'Reconvene with Customer Success to reconstruct commitments and re-baseline the kickoff plan',
      },
    ],
    risks: [
      { kind: 'handoff', description: 'Commitments made in the sale are lost before Customer Success receives them', severity: 'high', mitigation: 'Require a written commitment record in every handoff package' },
      { kind: 'capacity', description: 'Quarter-end compresses legal and solution review bandwidth', severity: 'medium', mitigation: 'Pull review earlier in the cycle and reserve close-window capacity' },
      { kind: 'stakeholder', description: 'Roadmap aspiration presented as commitment creates downstream expectation gaps', severity: 'medium', mitigation: 'Present only committed roadmap items, sourced from Product' },
      { kind: 'decision', description: 'Non-standard terms requested too late for proper review', severity: 'low', mitigation: 'Flag non-standard terms at qualification, not at signature' },
    ],

    publishedSections: [...ALL_SECTIONS],
    lastUpdatedAt: '2026-05-12T00:00:00Z',
  },

  /* ── 5 · Customer Success (o-cs) ────────────────────────────────── */
  {
    id: 'card-cs',
    orgId: 'o-cs',

    missionCriticalOutcomes: [
      'Customers reach and sustain value, making expansion the natural next step',
      'Onboarding lands customers on time and on scope',
      'Account health is visible early enough to act before renewal risk hardens',
      'Customer reality is surfaced to Product, Engineering, and Sales',
    ],
    successConditions: [
      'Onboarding starts from a complete handoff with documented commitments',
      'Health scoring reflects real usage and outcomes, not just sentiment',
      'Renewal risk is flagged a full cycle ahead of the date',
      'Escalations route to the right org with context, not just urgency',
    ],
    leadingIndicators: [
      'Time to first value during onboarding',
      'Share of accounts with a current health score and owner',
      'Renewal risk flagged days ahead of the renewal date',
    ],
    laggingIndicators: [
      'Gross and net retention',
      'Expansion rate from healthy accounts',
    ],
    operatingMetrics: [
      { label: 'On-time onboarding completion', value: '86%', kind: 'operating', trend: 'up' },
      { label: 'Net revenue retention', value: '112%', kind: 'lagging', trend: 'up' },
      { label: 'Accounts with current health score', value: '93%', kind: 'quality', trend: 'flat' },
      { label: 'Median time to first value', value: '21 days', kind: 'leading', trend: 'down' },
    ],
    capacitySignals: [
      'Account-to-CSM ratio caps the depth of proactive engagement',
      'Onboarding waves and renewal clusters create seasonal load',
      'Escalation handling competes with proactive health work',
    ],
    qualitySignals: [
      'Health scores combine usage, outcomes, and relationship signals',
      'Onboarding plans tie to the commitments captured at sale',
      'Renewal playbooks are current and outcome-anchored',
    ],
    riskSignals: [
      'Accounts onboarding without a complete handoff package',
      'Health scores going stale on key accounts',
      'Renewal risk surfacing inside the renewal window',
    ],
    stakeholderOutcomes: [
      'Sales gets expansion-ready accounts and honest reference signal',
      'Product hears structured customer reality to prioritize against',
      'Support inherits accounts with documented context',
    ],
    maturityLevel: 'leading',
    currentBlockers: [
      'Some accounts begin onboarding before the sales handoff is complete',
      'Health scoring lags on a subset of high-touch accounts',
    ],
    nextBestActions: [
      'Enforce handoff completeness before onboarding kickoff',
      'Refresh health scoring on the high-touch account segment',
      'Tighten the renewal-risk lead time to a full cycle ahead',
    ],

    responsibilities: [
      'Own customer onboarding to first value',
      'Own account health monitoring and intervention',
      'Own renewal motion and risk management',
      'Surface customer reality to Product, Engineering, and Sales',
    ],
    services: [
      'Onboarding planning and execution',
      'Account health management and intervention',
      'Renewal and expansion partnership',
      'Voice-of-customer synthesis',
    ],
    systems: [
      'Customer success platform and health model',
      'Onboarding and adoption tracking',
      'Renewal and lifecycle workflow',
    ],
    decisions: [
      'Set onboarding plans and success criteria',
      'Trigger health interventions',
      'Sequence renewal and expansion motions',
    ],
    processes: [
      'Onboarding kickoff through first value',
      'Health scoring and intervention',
      'Renewal risk identification and play execution',
    ],
    businessOutcomes: [
      'Retention and expansion from healthy customers',
      'Faster time to value across the base',
      'A reliable customer-reality signal to the rest of the org',
    ],
    artifactsProduced: [
      'Onboarding plans and success criteria',
      'Account health scores and intervention records',
      'Renewal-risk reports',
      'Voice-of-customer summaries',
    ],
    governanceAreas: [
      'Health-scoring methodology',
      'Onboarding and renewal standards',
      'Escalation routing rules',
    ],
    notOwned: [
      'Issue resolution and tickets (Customer Support owns)',
      'Paid implementation delivery (Professional Services owns)',
      'Product roadmap priority (Product Management owns)',
    ],

    requiredInputs: [
      {
        input: 'Complete sales handoff package',
        fromOrgId: 'o-sales',
        format: 'Signed scope, commitments, stakeholders, and success criteria',
        timing: 'At close, before onboarding kickoff',
        qualityBar: 'All commitments documented; no verbal-only items',
      },
      {
        input: 'Roadmap visibility for customer commitments',
        fromOrgId: 'o-prod',
        format: 'Committed roadmap dates relevant to the account',
        timing: 'Before setting customer expectations',
        qualityBar: 'Only committed items, with dates and caveats',
      },
      {
        input: 'Escalation status on customer-impacting issues',
        fromOrgId: 'o-support',
        format: 'Open-issue summary with severity and ETA',
        timing: 'Continuously for at-risk accounts',
        qualityBar: 'Severity and customer impact are clearly stated',
      },
      {
        input: 'Implementation status for paid projects',
        fromOrgId: 'o-ps',
        format: 'Milestone and risk status',
        timing: 'Throughout active implementations',
        qualityBar: 'Risks flagged early, not at the milestone deadline',
      },
    ],
    missingInputFailureModes: [
      'Onboarding without a complete handoff repeats discovery the customer already gave',
      'Without roadmap clarity, expectations get set that cannot be met',
      'Without issue status, health scores miss active risk',
    ],
    escalationTriggers: [
      'An account onboards without a complete handoff',
      'A renewal risk surfaces inside the renewal window',
      'A product or support gap blocks a customer commitment',
    ],
    commonMisconceptions: [
      'That Customer Success resolves tickets rather than owning the relationship',
      'That health is a sentiment score rather than an outcome signal',
      'That renewal work begins at the renewal date',
    ],
    reworkCauses: [
      'Incomplete handoffs forcing re-discovery',
      'Expectations set on uncommitted roadmap',
      'Late escalation of customer-impacting issues',
    ],
    delayCauses: [
      'Onboarding waiting on missing handoff context',
      'Renewal clusters compressing proactive capacity',
      'Cross-org dependencies blocking committed outcomes',
    ],

    outputs: [
      'Customers onboarded to first value on time',
      'Current account health with timely interventions',
      'Renewal risk flagged a cycle ahead',
    ],
    servicesOffered: [
      'Onboarding and adoption partnership',
      'Health monitoring and intervention',
      'Renewal and expansion support',
    ],
    expertise: [
      'Customer outcome and adoption design',
      'Health modeling and risk detection',
      'Renewal and expansion play execution',
    ],
    decisionSupport: [
      'Voice-of-customer signal for roadmap prioritization',
      'Account health for revenue-risk planning',
      'Reference-readiness signal for Sales and Marketing',
    ],
    enablement: [
      'Onboarding plans that get customers to value fast',
      'Health visibility that lets teams act early',
      'Customer context that routes escalations cleanly',
    ],
    riskReduction: [
      'Early risk detection reduces surprise churn',
      'Documented context reduces escalation thrash',
      'Outcome-anchored onboarding reduces stalled adoption',
    ],
    acceleration: [
      'Complete handoffs shorten time to first value',
      'Proactive health work shortens renewal cycles',
    ],
    advisoryRole: [
      'Voice of the customer in product and commercial discussions',
      'Advisor to Sales on expansion timing and account fit',
    ],
    reusableArtifacts: [
      'Onboarding and success-plan templates',
      'Health-scoring methodology',
      'Renewal and intervention playbooks',
    ],
    serviceExpectations: [
      'Onboarding kickoff within five business days of a complete handoff',
      'Health scores refreshed at least monthly',
      'Renewal risk flagged at least one cycle ahead',
    ],
    bestWaysToEngage: [
      'Hand off accounts complete, with documented commitments',
      'Bring committed roadmap dates, not aspirations',
      'Route customer-impacting issues with severity and impact stated',
    ],

    engagement: {
      howToEngage: 'Engage through the account team for relationship matters; use the escalation path for customer-impacting issues that cross orgs.',
      intakeProcess: 'Open an account request or escalation with account, impact, and timing; the assigned CSM coordinates.',
      intakeFields: ['Account', 'Request type', 'Customer impact', 'Timing', 'Cross-org dependency'],
      contactChannel: '#cs-accounts for relationship; #cs-escalation for at-risk issues',
      responseRhythm: 'Escalations acknowledged within hours; standard requests within a day',
      officeHours: 'Weekly account review and a customer-signal readout',
      cadenceStyle: 'balanced',
      escalationPath: 'Director, CS, then VP Customer Success for cross-org blockers',
      decisionRights: ['Set onboarding plans and success criteria', 'Trigger health interventions'],
      approvalRights: ['Approve renewal-risk plays', 'Approve escalation routing for accounts'],
    },
    meetingNorms: {
      includeWhen: [
        'A cross-org blocker threatens a customer commitment',
        'A renewal risk needs a coordinated play',
        'Customer signal must be synthesized for Product or Sales',
      ],
      doNotIncludeWhen: [
        'An account update can be read in the health dashboard',
        'A single-org issue fits the standard ticket path',
        'No decision or coordination is needed',
      ],
      requiredPreRead: 'Account context, the risk or signal, and the requested action, shared ahead',
      requiredAgenda: 'The decision or coordination requested is explicit',
      requiredDecisionOwner: true,
      preferredLength: '30 minutes',
      preferredCadence: 'Weekly account review; renewal-risk syncs as needed',
      asyncAlternatives: ['Health dashboard', 'Account thread', 'Voice-of-customer digest'],
      recurringRules: 'Account review focuses on at-risk accounts and decisions; healthy-account status stays async',
    },
    handoffRules: [
      {
        id: 'ho-cs-1',
        name: 'Onboarding to ongoing account management',
        checklist: [
          'First value achieved and confirmed with the customer',
          'Adoption plan and success criteria recorded',
          'Open risks and commitments transferred',
        ],
        definitionOfReady: [
          'Onboarding milestones complete',
          'Customer success criteria validated',
          'Health baseline established',
        ],
        definitionOfDone: [
          'Account moved to ongoing management with an owner',
          'Health score and renewal date set',
          'Outstanding commitments tracked',
        ],
        requiredApprovals: ['Director, CS'],
        requiredArtifacts: ['Success plan', 'Health baseline'],
        handoffOwner: 'Onboarding CSM',
        receivingOrgId: 'o-cs',
        failureModes: [
          'Adoption plan transferred without baseline health',
          'Open commitments dropped at the transition',
        ],
        recoveryPath: 'Reconstruct the baseline with the customer and re-log open commitments before steady-state begins',
      },
    ],
    risks: [
      { kind: 'handoff', description: 'Accounts onboard before the sales handoff is complete, repeating discovery', severity: 'high', mitigation: 'Gate onboarding kickoff on handoff completeness' },
      { kind: 'stale_knowledge', description: 'Health scores age on high-touch accounts and miss emerging risk', severity: 'medium', mitigation: 'Refresh scoring on a defined cadence for the high-touch segment' },
      { kind: 'dependency', description: 'Product or support gaps block committed customer outcomes', severity: 'medium', mitigation: 'Track cross-org commitments to owners and escalate early' },
      { kind: 'capacity', description: 'Renewal clusters compress proactive health capacity', severity: 'low', mitigation: 'Smooth renewal timing and stage proactive work around clusters' },
    ],

    publishedSections: [...ALL_SECTIONS],
    lastUpdatedAt: '2026-05-25T00:00:00Z',
  },

  /* ── 6 · Program Management (o-pmo) ─────────────────────────────── */
  {
    id: 'card-pmo',
    orgId: 'o-pmo',

    missionCriticalOutcomes: [
      'Cross-org delivery stays on track because dependencies are visible and owned',
      'Decisions flow between teams without stalling delivery',
      'Risk surfaces early enough that there is still time to act',
      'The operating cadence produces commitments, not just reports',
    ],
    successConditions: [
      'Every cross-org dependency has an owner and a due date',
      'Decisions have a named owner and a deadline before they are requested',
      'Status is current and trusted enough to plan against',
      'Escalations route with context, not just urgency',
    ],
    leadingIndicators: [
      'Share of dependencies with an owner and a date',
      'Decision lead time across teams',
      'Risk-to-mitigation lead time',
    ],
    laggingIndicators: [
      'On-time delivery rate for cross-org programs',
      'Count of slips traced to an unmanaged dependency',
    ],
    operatingMetrics: [
      { label: 'Dependencies with owner and date', value: '90%', kind: 'quality', trend: 'up' },
      { label: 'Cross-team decision lead time', value: '4.0 days', kind: 'operating', trend: 'down' },
      { label: 'On-time program milestones', value: '85%', kind: 'lagging', trend: 'flat' },
      { label: 'Risks mitigated before impact', value: '77%', kind: 'leading', trend: 'up' },
    ],
    capacitySignals: [
      'Program-manager coverage caps the number of concurrent programs tracked deeply',
      'Planning and quarterly-review windows compress coordination bandwidth',
      'New program standup competes with running-program coordination',
    ],
    qualitySignals: [
      'Dependency registers are current and owned',
      'Decision logs capture owner, date, and rationale',
      'Risk registers carry mitigations and owners',
    ],
    riskSignals: [
      'Dependencies without an owner or a date',
      'Decisions requested without a named owner',
      'Status that is stale or contested',
    ],
    stakeholderOutcomes: [
      'Engineering and Product deliver against a coherent, dependency-aware plan',
      'Leadership gets early, trustworthy risk signal',
      'Delivery teams spend less time chasing cross-org blockers',
    ],
    maturityLevel: 'established',
    currentBlockers: [
      'A minority of dependencies still lack a named owner or date',
      'Some decisions reach the cadence without a decision owner assigned',
    ],
    nextBestActions: [
      'Close the gap on unowned and undated dependencies',
      'Require a named decision owner before any decision enters the cadence',
      'Tighten risk-to-mitigation lead time on critical programs',
    ],

    responsibilities: [
      'Own the cross-org delivery operating cadence',
      'Maintain the dependency and risk registers across programs',
      'Drive the decision flow between teams',
      'Coordinate escalation and recovery for at-risk programs',
    ],
    services: [
      'Program planning and dependency management',
      'Decision facilitation and tracking',
      'Risk identification and mitigation tracking',
      'Cross-org status synthesis',
    ],
    systems: [
      'Program and dependency tracking tooling',
      'Decision and risk registers',
      'Operating-cadence calendar',
    ],
    decisions: [
      'Set program cadence and reporting standards',
      'Sequence dependencies and escalate blockers',
      'Trigger recovery actions for at-risk programs',
    ],
    processes: [
      'Program planning and dependency mapping',
      'Decision intake, routing, and tracking',
      'Risk review and escalation',
    ],
    businessOutcomes: [
      'Predictable cross-org delivery',
      'Earlier risk action and fewer late slips',
      'A decision flow that keeps teams unblocked',
    ],
    artifactsProduced: [
      'Program plans and dependency registers',
      'Decision logs',
      'Risk registers with mitigations',
      'Cross-org status reports',
    ],
    governanceAreas: [
      'Program cadence and reporting standards',
      'Dependency and risk-management discipline',
      'Decision-flow governance',
    ],
    notOwned: [
      'Engineering delivery execution (Engineering owns)',
      'Product priority (Product Management owns)',
      'Operational systems (Operations owns)',
    ],

    requiredInputs: [
      {
        input: 'Delivery status and capacity from build teams',
        fromOrgId: 'o-eng',
        format: 'Current milestone status and team load',
        timing: 'Each cadence cycle',
        qualityBar: 'Status reflects reality, with blockers named',
      },
      {
        input: 'Roadmap priority and scope decisions',
        fromOrgId: 'o-prod',
        format: 'Prioritized scope with committed outcomes',
        timing: 'At program planning and on change',
        qualityBar: 'Priority is unambiguous and decision-ready',
      },
      {
        input: 'Operating-calendar and resourcing constraints',
        fromOrgId: 'o-ops',
        format: 'Calendar windows and resource availability',
        timing: 'Ahead of each planning cycle',
        qualityBar: 'Constraints are firm, not aspirational',
      },
      {
        input: 'Change-impact and communications plan',
        fromOrgId: 'o-change',
        format: 'Affected-audience map and rollout timing',
        timing: 'Before a cross-org change ships',
        qualityBar: 'Audiences and timing are concrete',
      },
    ],
    missingInputFailureModes: [
      'Optimistic status hides blockers until they cause a slip',
      'Ambiguous priority leaves dependencies unsequenced',
      'Soft resourcing constraints break the plan mid-cycle',
    ],
    escalationTriggers: [
      'A critical dependency loses its owner or date',
      'A decision required this cycle has no owner',
      'A program risk has no mitigation as the date approaches',
    ],
    commonMisconceptions: [
      'That Program Management owns delivery rather than the cadence and dependencies around it',
      'That status reporting is the goal rather than surfacing decisions',
      'That a risk without a mitigation is still being managed',
    ],
    reworkCauses: [
      'Plans built on optimistic status',
      'Dependencies sequenced against ambiguous priority',
      'Late discovery of resourcing constraints',
    ],
    delayCauses: [
      'Decisions stalled for a missing owner',
      'Dependencies without dates blocking sequencing',
      'Coordination capacity compressed during planning windows',
    ],

    outputs: [
      'Current, owned dependency and risk registers',
      'Tracked decisions with owners and dates',
      'Trustworthy cross-org status',
    ],
    servicesOffered: [
      'Program planning and coordination',
      'Decision facilitation',
      'Risk and dependency management',
    ],
    expertise: [
      'Cross-org delivery coordination',
      'Dependency and risk management',
      'Decision-flow design',
    ],
    decisionSupport: [
      'Status and risk framing for leadership decisions',
      'Dependency analysis for sequencing choices',
      'Recovery options for at-risk programs',
    ],
    enablement: [
      'Visible dependencies that prevent surprise blockers',
      'A decision flow that keeps teams moving',
      'Risk registers that prompt early action',
    ],
    riskReduction: [
      'Owned dependencies reduce unmanaged-gap slips',
      'Early risk surfacing buys time to act',
      'Tracked decisions reduce re-litigation',
    ],
    acceleration: [
      'Pre-assigned decision owners shorten decision cycles',
      'Clear dependency sequencing removes coordination loops',
    ],
    advisoryRole: [
      'Neutral coordinator across delivering orgs',
      'Advisor on delivery risk and sequencing',
    ],
    reusableArtifacts: [
      'Program-plan and dependency-register templates',
      'Decision-log and risk-register templates',
      'Status-synthesis formats',
    ],
    serviceExpectations: [
      'Cross-org status published each cadence cycle',
      'Dependency and risk registers refreshed weekly',
      'Decision routing acknowledged within one business day',
    ],
    bestWaysToEngage: [
      'Bring decisions with a named owner and a deadline',
      'Report status that names blockers honestly',
      'Register dependencies with owners and dates as they arise',
    ],

    engagement: {
      howToEngage: 'Plug programs into the operating cadence; route decisions and dependencies through the program register, not side threads.',
      intakeProcess: 'Register a program or decision with owners, dates, and dependencies; coordination is assigned.',
      intakeFields: ['Program or decision', 'Owner', 'Dependencies', 'Deadline', 'Affected orgs'],
      contactChannel: '#program-cadence with shared dependency and decision registers',
      responseRhythm: 'Decision routing acknowledged within one business day',
      officeHours: 'Weekly cross-org coordination clinic',
      cadenceStyle: 'balanced',
      escalationPath: 'Director, PMO, then COO for cross-org conflicts',
      decisionRights: ['Set program cadence and standards', 'Sequence dependencies'],
      approvalRights: ['Approve program plans', 'Approve risk-mitigation and recovery actions'],
    },
    meetingNorms: {
      includeWhen: [
        'A cross-team decision is needed this cycle',
        'A dependency or risk needs coordinated action',
        'A program is at risk and needs a recovery plan',
      ],
      doNotIncludeWhen: [
        'Status can be read in the register',
        'A single-team issue does not cross orgs',
        'No decision is being requested',
      ],
      requiredPreRead: 'Current status, the decision requested, and affected dependencies, shared ahead',
      requiredAgenda: 'Each item names the decision, owner, and deadline',
      requiredDecisionOwner: true,
      preferredLength: '30 minutes',
      preferredCadence: 'Weekly cross-org cadence; recovery syncs as needed',
      asyncAlternatives: ['Dependency register', 'Decision log', 'Status digest'],
      recurringRules: 'The cadence takes only decision and risk items; status reads stay async',
    },
    handoffRules: [
      {
        id: 'ho-pmo-1',
        name: 'Program transition between phases',
        checklist: [
          'Dependency and risk registers current',
          'Open decisions logged with owners',
          'Receiving phase owner briefed',
        ],
        definitionOfReady: [
          'Phase exit criteria met',
          'Risks and dependencies reconciled',
          'Status validated with delivery teams',
        ],
        definitionOfDone: [
          'Next-phase owner accepts the registers',
          'Open items carry owners and dates',
          'Cadence updated for the new phase',
        ],
        requiredApprovals: ['Director, PMO'],
        requiredArtifacts: ['Dependency register', 'Risk register', 'Decision log'],
        handoffOwner: 'Program manager',
        receivingOrgId: 'o-deliv',
        failureModes: [
          'Registers handed off stale',
          'Open decisions transferred without owners',
        ],
        recoveryPath: 'Re-baseline the registers with delivery teams and assign owners before the next phase proceeds',
      },
    ],
    risks: [
      { kind: 'dependency', description: 'Unowned or undated dependencies cause downstream slips', severity: 'high', mitigation: 'Require an owner and date on every registered dependency' },
      { kind: 'decision', description: 'Decisions reach the cadence without a named owner and stall', severity: 'medium', mitigation: 'Assign a decision owner before the item enters the cadence' },
      { kind: 'stale_knowledge', description: 'Status drifts stale and erodes trust in the plan', severity: 'medium', mitigation: 'Refresh registers weekly and validate with delivery teams' },
      { kind: 'capacity', description: 'Planning windows compress coordination bandwidth', severity: 'low', mitigation: 'Reserve coordination capacity outside planning peaks' },
    ],

    publishedSections: [...ALL_SECTIONS],
    lastUpdatedAt: '2026-05-28T00:00:00Z',
  },

  /* ── 7 · Product Management (o-prod) ────────────────────────────── */
  {
    id: 'card-prod',
    orgId: 'o-prod',

    missionCriticalOutcomes: [
      'Engineering effort lands on outcomes that matter, in a defensible order',
      'Roadmap decisions are evidence-based and traceable',
      'Customer and market reality is translated into prioritized problems',
      'Commitments to customers and Sales reflect what is actually committed',
    ],
    successConditions: [
      'Each roadmap bet has a problem statement and a success measure',
      'Prioritization is explicit and revisited on a cadence',
      'Discovery evidence is available before build commitment',
      'Committed and aspirational roadmap items are clearly distinguished',
    ],
    leadingIndicators: [
      'Share of build items with a problem statement and success measure',
      'Discovery completeness before sprint commitment',
      'Roadmap-decision lead time',
    ],
    laggingIndicators: [
      'Outcome attainment on shipped bets',
      'Rate of rework from poorly specified problems',
    ],
    operatingMetrics: [
      { label: 'Build items with success measure', value: '81%', kind: 'quality', trend: 'up' },
      { label: 'Discovery-before-commit rate', value: '74%', kind: 'leading', trend: 'up' },
      { label: 'Roadmap-decision lead time', value: '5.5 days', kind: 'operating', trend: 'flat' },
      { label: 'Outcome attainment on shipped bets', value: '68%', kind: 'lagging', trend: 'up' },
    ],
    capacitySignals: [
      'Product-manager coverage caps the number of areas with deep discovery',
      'Planning windows compress prioritization bandwidth',
      'Discovery competes with delivery support for the same time',
    ],
    qualitySignals: [
      'Problem statements name the user, the outcome, and the evidence',
      'Prioritization criteria are written and applied consistently',
      'Roadmap clearly marks committed versus exploratory',
    ],
    riskSignals: [
      'Build items entering sprints without a success measure',
      'Roadmap promises made ahead of commitment',
      'Discovery skipped under delivery pressure',
    ],
    stakeholderOutcomes: [
      'Engineering builds against clear, evidence-backed problems',
      'Sales and Customer Success get honest roadmap commitments',
      'Leadership sees a defensible, traceable prioritization',
    ],
    maturityLevel: 'established',
    currentBlockers: [
      'Some build items still enter delivery without a success measure',
      'Roadmap commitment status is not always clearly communicated downstream',
    ],
    nextBestActions: [
      'Require a problem statement and success measure before build commitment',
      'Publish a clear committed-versus-exploratory roadmap view',
      'Protect discovery capacity from delivery-support erosion',
    ],

    responsibilities: [
      'Own roadmap priority and sequencing',
      'Own problem definition and discovery evidence',
      'Translate market and customer reality into prioritized problems',
      'Set and communicate roadmap commitments',
    ],
    services: [
      'Roadmap prioritization and planning',
      'Problem discovery and definition',
      'Roadmap-commitment communication',
      'Feasibility and tradeoff partnership',
    ],
    systems: [
      'Roadmap and prioritization tooling',
      'Discovery and research repository',
      'Outcome-tracking dashboard',
    ],
    decisions: [
      'Set and sequence roadmap priority',
      'Define problems and success measures',
      'Distinguish committed from exploratory roadmap',
    ],
    processes: [
      'Discovery and problem definition',
      'Prioritization and roadmap planning',
      'Commitment communication to downstream orgs',
    ],
    businessOutcomes: [
      'Engineering effort focused on real outcomes',
      'A defensible, traceable roadmap',
      'Honest customer and commercial expectations',
    ],
    artifactsProduced: [
      'Problem statements with success measures',
      'Prioritized roadmaps with commitment status',
      'Discovery findings and evidence',
      'Outcome readouts on shipped bets',
    ],
    governanceAreas: [
      'Prioritization criteria',
      'Roadmap-commitment standards',
      'Discovery-quality bar',
    ],
    notOwned: [
      'Build execution and delivery (Engineering owns)',
      'Architecture patterns (Enterprise Architecture owns)',
      'Commercial terms (Sales and Finance own)',
    ],

    requiredInputs: [
      {
        input: 'Customer reality and adoption signal',
        fromOrgId: 'o-cs',
        format: 'Synthesized voice-of-customer with outcomes and friction',
        timing: 'Each planning cycle and on emerging signal',
        qualityBar: 'Signal is structured, not anecdotal',
      },
      {
        input: 'Technical feasibility and effort signal',
        fromOrgId: 'o-eng',
        format: 'Feasibility notes and rough effort ranges',
        timing: 'Before sequencing build items',
        qualityBar: 'Assumptions and unknowns are explicit',
      },
      {
        input: 'Architecture constraints for major bets',
        fromOrgId: 'o-ea',
        format: 'Pattern and target-state constraints',
        timing: 'Before committing major roadmap items',
        qualityBar: 'Constraints reference an approved pattern',
      },
      {
        input: 'Data and metric definitions for outcomes',
        fromOrgId: 'o-data',
        format: 'Agreed metric definitions and instrumentation',
        timing: 'Before defining success measures',
        qualityBar: 'Metrics are measurable and instrumented',
      },
    ],
    missingInputFailureModes: [
      'Anecdotal signal leads to bets that do not move real outcomes',
      'Missing feasibility creates roadmap commitments engineering cannot meet',
      'Undefined metrics make outcome attainment unverifiable',
    ],
    escalationTriggers: [
      'A build item enters delivery without a success measure',
      'A roadmap commitment is made without feasibility input',
      'Prioritization is overridden without recorded rationale',
    ],
    commonMisconceptions: [
      'That Product writes specs rather than defining problems and outcomes',
      'That every roadmap item is a commitment',
      'That discovery is optional when delivery is under pressure',
    ],
    reworkCauses: [
      'Bets built on anecdotal rather than structured signal',
      'Build items started without success measures',
      'Commitments made ahead of feasibility',
    ],
    delayCauses: [
      'Discovery deferred and reopened mid-build',
      'Prioritization stalled in planning windows',
      'Missing data definitions blocking success measures',
    ],

    outputs: [
      'Prioritized, evidence-backed roadmap',
      'Problem statements with success measures',
      'Clear committed-versus-exploratory communication',
    ],
    servicesOffered: [
      'Roadmap prioritization and planning',
      'Discovery and problem definition',
      'Feasibility and tradeoff partnership',
    ],
    expertise: [
      'Problem definition and outcome design',
      'Prioritization and tradeoff analysis',
      'Customer and market synthesis',
    ],
    decisionSupport: [
      'Evidence-backed prioritization for leadership',
      'Roadmap clarity for Sales and Customer Success',
      'Outcome readouts for investment decisions',
    ],
    enablement: [
      'Clear problems that let engineering build effectively',
      'Honest roadmap status that downstream orgs can rely on',
      'Discovery evidence that de-risks bets',
    ],
    riskReduction: [
      'Success measures reduce wasted build effort',
      'Feasibility input reduces unmeetable commitments',
      'Distinguished commitment status reduces expectation gaps',
    ],
    acceleration: [
      'Pre-defined problems shorten engineering ramp',
      'Cadenced prioritization removes ad-hoc re-sequencing',
    ],
    advisoryRole: [
      'Owner of the why and the what for delivery',
      'Advisor on outcome tradeoffs across stakeholders',
    ],
    reusableArtifacts: [
      'Problem-statement and success-measure templates',
      'Prioritization-criteria framework',
      'Roadmap-communication formats',
    ],
    serviceExpectations: [
      'Roadmap decisions returned within one week of a complete request',
      'Problem statements ready before sprint commitment',
      'Roadmap commitment status refreshed each cycle',
    ],
    bestWaysToEngage: [
      'Bring structured signal, not anecdotes',
      'Ask for the problem and outcome, not a feature spec',
      'Confirm commitment status before promising a date downstream',
    ],

    engagement: {
      howToEngage: 'Route problems and signal through product intake; feasibility and architecture partnership are scheduled before commitment.',
      intakeProcess: 'Submit a problem or signal with evidence and impact; it enters prioritization, not a direct build queue.',
      intakeFields: ['Problem or signal', 'Evidence', 'Affected customers or orgs', 'Desired outcome', 'Urgency'],
      contactChannel: '#product-intake with a shared roadmap view',
      responseRhythm: 'Acknowledged within two business days; prioritized at the next cycle',
      officeHours: 'Weekly roadmap clinic for tradeoff and sequencing questions',
      cadenceStyle: 'balanced',
      escalationPath: 'Director, Product, then CPO for cross-org priority conflicts',
      decisionRights: ['Set roadmap priority', 'Define problems and success measures'],
      approvalRights: ['Approve roadmap commitments', 'Approve scope changes to committed bets'],
    },
    meetingNorms: {
      includeWhen: [
        'A prioritization tradeoff needs a decision',
        'A major bet needs cross-functional feasibility',
        'Roadmap commitments must be aligned across orgs',
      ],
      doNotIncludeWhen: [
        'The roadmap view already answers the question',
        'A signal can be submitted through intake',
        'No decision is being requested',
      ],
      requiredPreRead: 'Problem context, evidence, and the decision requested, shared ahead',
      requiredAgenda: 'The decision and the tradeoff are stated explicitly',
      requiredDecisionOwner: true,
      preferredLength: '45 minutes',
      preferredCadence: 'Roadmap review on the planning cadence; clinics as needed',
      asyncAlternatives: ['Roadmap view', 'Discovery write-up', 'Prioritization comment thread'],
      recurringRules: 'Roadmap review handles tradeoffs and commitments; status reads stay async',
    },
    handoffRules: [
      {
        id: 'ho-prod-1',
        name: 'Problem definition to engineering build',
        checklist: [
          'Problem statement, user, and outcome documented',
          'Success measure and instrumentation agreed',
          'Constraints and open questions listed',
        ],
        definitionOfReady: [
          'Discovery evidence sufficient to commit',
          'Feasibility input incorporated',
          'Success measure defined and instrumentable',
        ],
        definitionOfDone: [
          'Engineering accepts the problem and success measure',
          'Open questions assigned owners',
          'Outcome tracking set up',
        ],
        requiredApprovals: ['Director, Product'],
        requiredArtifacts: ['Problem statement', 'Success measure', 'Discovery summary'],
        handoffOwner: 'Product manager',
        receivingOrgId: 'o-eng',
        failureModes: [
          'Build started without a success measure',
          'Open questions left unowned',
        ],
        recoveryPath: 'Pause commitment, define the success measure with engineering, and assign open questions before build proceeds',
      },
    ],
    risks: [
      { kind: 'decision', description: 'Build items enter delivery without a success measure', severity: 'high', mitigation: 'Gate build commitment on a defined, instrumentable success measure' },
      { kind: 'stakeholder', description: 'Aspirational roadmap items are communicated as commitments', severity: 'medium', mitigation: 'Publish a clear committed-versus-exploratory roadmap view' },
      { kind: 'dependency', description: 'Missing feasibility or data definitions block sound prioritization', severity: 'medium', mitigation: 'Require feasibility and metric inputs before sequencing' },
      { kind: 'capacity', description: 'Delivery support erodes discovery capacity', severity: 'low', mitigation: 'Protect a fixed discovery allocation each cycle' },
    ],

    publishedSections: [...ALL_SECTIONS],
    lastUpdatedAt: '2026-05-18T00:00:00Z',
  },

  /* ── 8 · Engineering (o-eng) ────────────────────────────────────── */
  {
    id: 'card-eng',
    orgId: 'o-eng',

    missionCriticalOutcomes: [
      'The platform is reliable and available for every team that depends on it',
      'Developer velocity stays high through good tooling and a paved road',
      'The data platform is dependable enough to build products and decisions on',
      'Changes ship safely, with quality and reliability as first-class outcomes',
    ],
    successConditions: [
      'Work enters build with a clear problem and success measure',
      'Reliability and developer-experience investment is protected, not deferred',
      'Architecture patterns are adopted before delivery starts',
      'Changes carry tests, observability, and a rollback path',
    ],
    leadingIndicators: [
      'Change failure rate',
      'Deployment frequency and lead time for changes',
      'Share of build items entering with a success measure',
    ],
    laggingIndicators: [
      'Service availability against the reliability target',
      'Mean time to restore after incidents',
    ],
    operatingMetrics: [
      { label: 'Platform availability', value: '99.95%', kind: 'lagging', trend: 'flat' },
      { label: 'Change failure rate', value: '4.8%', kind: 'quality', trend: 'down' },
      { label: 'Deployment lead time (median)', value: '1.3 days', kind: 'operating', trend: 'down' },
      { label: 'Mean time to restore', value: '38 min', kind: 'operating', trend: 'down' },
    ],
    capacitySignals: [
      'Reliability and platform investment competes with feature delivery for the same engineers',
      'On-call and incident load draws from delivery capacity',
      'A fixed number of concurrent large initiatives can be staffed well',
    ],
    qualitySignals: [
      'Changes ship with tests, observability, and a rollback path',
      'Reliability targets are defined per service and tracked',
      'Adopted architecture patterns are followed, not bypassed',
    ],
    riskSignals: [
      'Reliability work repeatedly deferred for features',
      'Build items arriving without a success measure',
      'Rising change failure rate or incident frequency',
    ],
    stakeholderOutcomes: [
      'Every team builds on a reliable platform and paved-road tooling',
      'Product ships outcomes, not just output, against clear problems',
      'Data & AI and Security inherit consistent, instrumented foundations',
    ],
    maturityLevel: 'leading',
    currentBlockers: [
      'Reliability and developer-experience work competes with feature pressure',
      'Some build items still arrive without a defined success measure',
    ],
    nextBestActions: [
      'Protect a fixed reliability and platform-investment allocation each cycle',
      'Enforce a problem-and-success-measure gate at build intake',
      'Keep deployment lead time and change failure rate trending down',
    ],

    responsibilities: [
      'Build and operate the platform every team relies on',
      'Own reliability, availability, and incident response',
      'Own developer experience and paved-road tooling',
      'Operate the data platform foundations with Data & AI',
    ],
    services: [
      'Product and platform engineering delivery',
      'Reliability engineering and incident response',
      'Developer-experience tooling and CI/CD',
      'Data-platform operation',
    ],
    systems: [
      'Production services and the platform runtime',
      'CI/CD and developer tooling',
      'Observability and incident tooling',
      'Data-platform infrastructure',
    ],
    decisions: [
      'Make build and technical implementation calls within patterns',
      'Set reliability targets and on-call practices',
      'Sequence platform and developer-experience investment',
    ],
    processes: [
      'Build, test, and release with rollback',
      'Incident response and post-incident review',
      'Reliability and capacity planning',
    ],
    businessOutcomes: [
      'A reliable platform that the whole company depends on',
      'High developer velocity from good tooling',
      'Outcomes shipped against clear problems',
    ],
    artifactsProduced: [
      'Shipped, instrumented software',
      'Reliability targets and incident reviews',
      'Developer tooling and paved-road documentation',
      'Data-platform pipelines and contracts',
    ],
    governanceAreas: [
      'Reliability and availability standards',
      'Release and change-management discipline',
      'Developer-experience and tooling standards',
    ],
    notOwned: [
      'Roadmap priority and problem definition (Product Management owns)',
      'Architecture patterns and target state (Enterprise Architecture owns)',
      'Security policy (Security owns; Engineering implements)',
    ],

    requiredInputs: [
      {
        input: 'Problem statements with success measures',
        fromOrgId: 'o-prod',
        format: 'Problem, user, outcome, and instrumentable success measure',
        timing: 'Before build commitment',
        qualityBar: 'Outcome is measurable; open questions are owned',
      },
      {
        input: 'Approved architecture patterns and constraints',
        fromOrgId: 'o-ea',
        format: 'Ratified ADR and pattern reference',
        timing: 'Before build starts on cross-cutting work',
        qualityBar: 'Decision is on record and constraints are actionable',
      },
      {
        input: 'Security requirements and controls',
        fromOrgId: 'o-sec',
        format: 'Control requirements mapped to the change',
        timing: 'During design, before release',
        qualityBar: 'Controls are specific and testable',
      },
      {
        input: 'Data contracts and lineage',
        fromOrgId: 'o-data',
        format: 'Source-of-truth and integration contracts',
        timing: 'Before building data-dependent features',
        qualityBar: 'Ownership and lineage are unambiguous',
      },
    ],
    missingInputFailureModes: [
      'Building without a success measure ships output that may not move the outcome',
      'Skipping the architecture decision produces designs that need rework',
      'Late security requirements force redesign before release',
    ],
    escalationTriggers: [
      'A build item arrives without a success measure',
      'A reliability target is at risk for a critical service',
      'A cross-cutting change proceeds without an architecture decision',
    ],
    commonMisconceptions: [
      'That Engineering sets priority rather than delivering against defined problems',
      'That reliability work can always be deferred for features',
      'That implementation freedom extends to bypassing approved patterns',
    ],
    reworkCauses: [
      'Build started without a success measure',
      'Designs that bypassed the architecture decision',
      'Security requirements surfaced after build',
    ],
    delayCauses: [
      'On-call and incident load drawing from delivery',
      'Reliability debt slowing safe change',
      'Missing problem or contract inputs blocking start',
    ],

    outputs: [
      'Reliable, instrumented, shipped software',
      'Paved-road tooling that speeds delivery',
      'Operated data-platform foundations',
    ],
    servicesOffered: [
      'Feature and platform delivery against defined problems',
      'Reliability engineering and incident response',
      'Developer tooling and CI/CD',
    ],
    expertise: [
      'Distributed-systems and platform engineering',
      'Reliability engineering and incident response',
      'Developer-experience and tooling design',
    ],
    decisionSupport: [
      'Feasibility and effort signal for Product',
      'Reliability tradeoff framing for leadership',
      'Technical-risk assessment for major bets',
    ],
    enablement: [
      'A paved road that makes the right thing the easy thing',
      'Reliable foundations other orgs build on',
      'Observability that makes problems debuggable',
    ],
    riskReduction: [
      'Tested, rollback-ready changes reduce incident impact',
      'Reliability investment reduces availability risk',
      'Pattern adoption reduces integration surprises',
    ],
    acceleration: [
      'Paved-road tooling shortens delivery cycles',
      'Reusable platform capabilities remove rebuild',
    ],
    advisoryRole: [
      'Advisor on feasibility and technical tradeoffs',
      'Partner on reliability and platform strategy',
    ],
    reusableArtifacts: [
      'Paved-road tooling and templates',
      'Reliability runbooks and incident-review formats',
      'Platform capabilities and shared libraries',
    ],
    serviceExpectations: [
      'Incidents acknowledged within the on-call response target',
      'Build items accepted within two days of a complete handoff',
      'Reliability reviews held on the defined cadence',
    ],
    bestWaysToEngage: [
      'Bring a problem and a success measure, not a feature spec',
      'Confirm the architecture decision is on record first',
      'Surface security and data needs during design, not at release',
    ],

    engagement: {
      howToEngage: 'Engage through build intake with a defined problem; reliability and platform requests route through the platform queue.',
      intakeProcess: 'Submit a problem with a success measure and constraints; build is committed at planning, not on demand.',
      intakeFields: ['Problem', 'Success measure', 'Constraints', 'Dependencies', 'Target window'],
      contactChannel: '#eng-intake for build; #platform for tooling and reliability',
      responseRhythm: 'Acknowledged within two business days; incidents per the on-call target',
      officeHours: 'Weekly engineering clinic for feasibility and tooling questions',
      cadenceStyle: 'async_first',
      escalationPath: 'Sr Engineering Manager, then CTO for reliability or priority conflicts',
      decisionRights: ['Make implementation calls within patterns', 'Set reliability targets'],
      approvalRights: ['Approve releases and rollbacks', 'Approve platform-investment sequencing'],
    },
    meetingNorms: {
      includeWhen: [
        'A technical tradeoff needs a real-time decision',
        'An incident requires coordinated response',
        'A cross-org reliability or platform decision is needed',
      ],
      doNotIncludeWhen: [
        'A status update can be read in the tracker',
        'A design can be reviewed async in a doc',
        'No decision is being requested',
      ],
      requiredPreRead: 'Design or incident context and the decision requested, shared ahead',
      requiredAgenda: 'The decision and its tradeoffs are stated explicitly',
      requiredDecisionOwner: true,
      preferredLength: '30 minutes',
      preferredCadence: 'Weekly reliability and delivery reviews; incident syncs as triggered',
      asyncAlternatives: ['Design-doc review', 'Pull-request discussion', 'Incident channel'],
      recurringRules: 'Reviews handle decisions and risks; routine status stays async',
    },
    handoffRules: [
      {
        id: 'ho-eng-1',
        name: 'Release to production operation',
        checklist: [
          'Tests and observability in place',
          'Rollback path verified',
          'Reliability and security checks passed',
        ],
        definitionOfReady: [
          'Change tested and reviewed',
          'Success measure instrumented',
          'Rollback and monitoring confirmed',
        ],
        definitionOfDone: [
          'Change live and observed stable',
          'On-call briefed on the change',
          'Outcome tracking active',
        ],
        requiredApprovals: ['Sr Engineering Manager'],
        requiredArtifacts: ['Test results', 'Rollback plan', 'Observability dashboards'],
        handoffOwner: 'Release owner',
        receivingOrgId: 'o-ops',
        failureModes: [
          'Released without a verified rollback path',
          'On-call unaware of the change at incident time',
        ],
        recoveryPath: 'Roll back to the last good state, brief on-call, and re-release once observability is confirmed',
      },
      {
        id: 'ho-eng-2',
        name: 'Data-platform contract handoff',
        checklist: [
          'Contract schema and ownership documented',
          'Lineage and freshness expectations set',
          'Consumer notified of the contract',
        ],
        definitionOfReady: [
          'Source-of-truth agreed with Data & AI',
          'Schema validated',
          'Backward-compatibility assessed',
        ],
        definitionOfDone: [
          'Contract published and discoverable',
          'Consumers acknowledged',
          'Monitoring on freshness active',
        ],
        requiredApprovals: ['Sr Engineering Manager'],
        requiredArtifacts: ['Contract schema', 'Lineage map'],
        handoffOwner: 'Data-platform engineer',
        receivingOrgId: 'o-data',
        failureModes: [
          'Breaking schema change shipped without consumer notice',
          'Freshness expectations undocumented',
        ],
        recoveryPath: 'Restore the prior contract version, notify consumers, and stage the change behind compatibility',
      },
    ],
    risks: [
      { kind: 'capacity', description: 'Reliability and platform work is repeatedly deferred for feature pressure', severity: 'high', mitigation: 'Protect a fixed reliability allocation each cycle' },
      { kind: 'decision', description: 'Build items arrive without a success measure and ship unmeasurable output', severity: 'medium', mitigation: 'Gate build intake on a defined success measure' },
      { kind: 'dependency', description: 'Late architecture, security, or data inputs force redesign', severity: 'medium', mitigation: 'Require those inputs during design, before build' },
      { kind: 'operational', description: 'Rising change failure rate erodes velocity and reliability', severity: 'low', mitigation: 'Keep tests, observability, and rollback mandatory on every change' },
    ],

    publishedSections: [...ALL_SECTIONS],
    lastUpdatedAt: '2026-05-04T00:00:00Z',
  },

  /* ── 9 · Finance (o-fin) ────────────────────────────────────────── */
  {
    id: 'card-fin',
    orgId: 'o-fin',

    missionCriticalOutcomes: [
      'Plans become numbers and numbers become decisions leadership can act on',
      'Capital allocation stays honest and traceable across every org',
      'Forecasts are accurate enough to plan capital and headcount against',
      'Financial close and reporting are timely and reliable',
    ],
    successConditions: [
      'Planning inputs arrive final, not provisional',
      'Forecast assumptions are documented and revisited on a cadence',
      'Spend and headcount requests carry the context to decide on',
      'Close runs to schedule with reconciled numbers',
    ],
    leadingIndicators: [
      'Forecast-input completeness ahead of each cycle',
      'Budget-vs-actual variance trend',
      'Cycle time for spend and headcount approvals',
    ],
    laggingIndicators: [
      'Forecast accuracy at quarter close',
      'Close timeliness against the schedule',
    ],
    operatingMetrics: [
      { label: 'Forecast accuracy at close', value: '93%', kind: 'lagging', trend: 'flat' },
      { label: 'Days to close', value: '5.5 days', kind: 'operating', trend: 'down' },
      { label: 'Budget-vs-actual variance', value: '3.2%', kind: 'quality', trend: 'flat' },
      { label: 'Approval turnaround (median)', value: '2.8 days', kind: 'operating', trend: 'down' },
    ],
    capacitySignals: [
      'Close and planning windows consume most analyst capacity',
      'Ad-hoc analysis competes with the planning cycle for the same team',
      'A fixed FP&A pool supports a bounded number of deep partnerships',
    ],
    qualitySignals: [
      'Forecast assumptions are documented and sourced',
      'Approvals reference the authority matrix',
      'Reconciliations are complete before numbers are published',
    ],
    riskSignals: [
      'Planning inputs arriving provisional or late',
      'Growing budget-vs-actual variance',
      'Approvals made outside the authority matrix',
    ],
    stakeholderOutcomes: [
      'Every org plans against a reliable budget envelope',
      'Leadership allocates capital with traceable rationale',
      'Operations and HR get predictable financial handoffs',
    ],
    maturityLevel: 'developing',
    currentBlockers: [
      'Planning inputs sometimes arrive provisional and force re-work',
      'Some approvals route outside the authority matrix',
    ],
    nextBestActions: [
      'Lock final planning inputs before each cycle opens',
      'Route all approvals through the authority matrix',
      'Shorten close by tightening reconciliation handoffs',
    ],

    responsibilities: [
      'Own financial planning, forecasting, and analysis',
      'Own capital allocation discipline and approval rights',
      'Own financial close and reporting',
      'Provide decision support across organizations',
    ],
    services: [
      'Budgeting and forecasting',
      'Spend and headcount approval',
      'Financial close and reporting',
      'Business decision support and analysis',
    ],
    systems: [
      'Planning and forecasting tooling',
      'General ledger and close system',
      'Spend-approval and authority workflow',
    ],
    decisions: [
      'Set budget envelopes by org',
      'Approve spend and headcount within authority',
      'Sequence capital allocation tradeoffs',
    ],
    processes: [
      'Planning and forecasting cycles',
      'Spend and headcount approval',
      'Monthly and quarterly close',
    ],
    businessOutcomes: [
      'Honest, traceable capital allocation',
      'Reliable forecasts to plan against',
      'Timely, trusted financial reporting',
    ],
    artifactsProduced: [
      'Budgets and forecasts',
      'Approval records and authority matrix',
      'Close packages and financial reports',
      'Decision-support analyses',
    ],
    governanceAreas: [
      'Spend-authority and approval standards',
      'Forecast and reporting discipline',
      'Capital-allocation governance',
    ],
    notOwned: [
      'Operational execution of budgets (each org owns its spend)',
      'Pricing strategy beyond approved bands (Sales and leadership own)',
      'Procurement sourcing (Procurement owns)',
    ],

    requiredInputs: [
      {
        input: 'Headcount and hiring plan',
        fromOrgId: 'o-hr',
        format: 'Confirmed roles, timing, and bands',
        timing: 'Ahead of each planning cycle',
        qualityBar: 'Plan is committed, not aspirational',
      },
      {
        input: 'Operational cost and demand drivers',
        fromOrgId: 'o-ops',
        format: 'Cost drivers and volume assumptions by area',
        timing: 'Before forecast build',
        qualityBar: 'Drivers are sourced and current',
      },
      {
        input: 'Pipeline and revenue forecast',
        fromOrgId: 'o-sales',
        format: 'Weighted pipeline with close assumptions',
        timing: 'Each forecast cycle',
        qualityBar: 'Forecast hygiene is good enough to weight reliably',
      },
      {
        input: 'Procurement commitments and terms',
        fromOrgId: 'o-proc',
        format: 'Committed-spend schedule with timing',
        timing: 'Before close and forecast',
        qualityBar: 'Commitments are confirmed with dates',
      },
    ],
    missingInputFailureModes: [
      'Provisional headcount plans force forecast rework mid-cycle',
      'Unsourced cost drivers produce forecasts no one trusts',
      'Poor pipeline hygiene makes revenue forecasts unreliable',
    ],
    escalationTriggers: [
      'A spend request exceeds authority without escalation',
      'Planning inputs are missing as a cycle opens',
      'Budget-vs-actual variance breaches the threshold',
    ],
    commonMisconceptions: [
      'That Finance executes budgets rather than governing allocation',
      'That a forecast is a commitment rather than a planning estimate',
      'That approvals can bypass the authority matrix when urgent',
    ],
    reworkCauses: [
      'Provisional inputs treated as final',
      'Assumptions undocumented and re-derived',
      'Approvals routed outside authority',
    ],
    delayCauses: [
      'Close and planning windows consuming capacity',
      'Missing or late planning inputs',
      'Ad-hoc analysis competing with the cycle',
    ],

    outputs: [
      'Reliable budgets and forecasts',
      'Traceable approval and allocation decisions',
      'Timely close and reporting',
    ],
    servicesOffered: [
      'Planning and forecasting partnership',
      'Spend and headcount approval',
      'Decision-support analysis',
    ],
    expertise: [
      'Financial planning and analysis',
      'Capital-allocation and tradeoff analysis',
      'Close and reporting discipline',
    ],
    decisionSupport: [
      'Scenario and tradeoff analysis for leadership',
      'Budget envelopes for org planning',
      'Variance analysis to guide corrective action',
    ],
    enablement: [
      'A reliable budget envelope each org can plan against',
      'Clear authority that speeds spend decisions',
      'Trusted numbers that anchor cross-org decisions',
    ],
    riskReduction: [
      'Allocation discipline reduces overspend risk',
      'Documented assumptions reduce forecast disputes',
      'Authority matrix reduces uncontrolled spend',
    ],
    acceleration: [
      'Pre-set authority bands speed routine approvals',
      'Reusable planning templates shorten the cycle',
    ],
    advisoryRole: [
      'Advisor on capital tradeoffs across orgs',
      'Partner on the financial case for major bets',
    ],
    reusableArtifacts: [
      'Budget and forecast templates',
      'Authority matrix and approval templates',
      'Close-package and reporting formats',
    ],
    serviceExpectations: [
      'Spend approvals returned within three business days',
      'Forecast refreshed each cycle on schedule',
      'Close completed within the published timeline',
    ],
    bestWaysToEngage: [
      'Bring final, sourced inputs to planning',
      'Route spend through the authority matrix',
      'Document the assumptions behind any request',
    ],

    engagement: {
      howToEngage: 'Use the planning cycle for budgets and the approval workflow for spend; ad-hoc analysis is scheduled around close.',
      intakeProcess: 'Submit a planning input or spend request with assumptions and authority context; routing follows the matrix.',
      intakeFields: ['Request type', 'Amount or scope', 'Authority level', 'Assumptions', 'Timing'],
      contactChannel: '#finance-intake with the planning calendar and authority matrix',
      responseRhythm: 'Approvals within three business days; analysis scheduled around close',
      officeHours: 'Weekly planning clinic outside close windows',
      cadenceStyle: 'meeting_first',
      escalationPath: 'Director, FP&A, then CFO for allocation conflicts',
      decisionRights: ['Set budget envelopes', 'Approve spend within authority'],
      approvalRights: ['Approve headcount within plan', 'Approve capital allocation tradeoffs'],
    },
    meetingNorms: {
      includeWhen: [
        'A capital-allocation tradeoff needs a decision',
        'A spend request exceeds standard authority',
        'Planning assumptions must be reconciled across orgs',
      ],
      doNotIncludeWhen: [
        'A report can be read asynchronously',
        'A standard spend fits the authority matrix',
        'No decision is being requested',
      ],
      requiredPreRead: 'The numbers, assumptions, and the decision requested, shared ahead',
      requiredAgenda: 'The decision and its financial tradeoff are explicit',
      requiredDecisionOwner: true,
      preferredLength: '45 minutes',
      preferredCadence: 'Planning reviews on the cycle calendar; allocation syncs as needed',
      asyncAlternatives: ['Forecast model review', 'Approval workflow', 'Variance report'],
      recurringRules: 'Reviews handle decisions and tradeoffs; reporting stays async',
    },
    handoffRules: [
      {
        id: 'ho-fin-1',
        name: 'Approved budget to operating org',
        checklist: [
          'Envelope, assumptions, and constraints documented',
          'Authority and exception path stated',
          'Reporting cadence agreed',
        ],
        definitionOfReady: [
          'Planning inputs final and reconciled',
          'Tradeoffs resolved',
          'Envelope approved',
        ],
        definitionOfDone: [
          'Operating org acknowledges the envelope',
          'Variance reporting set up',
          'Exception path understood',
        ],
        requiredApprovals: ['Director, FP&A'],
        requiredArtifacts: ['Approved budget', 'Assumption log'],
        handoffOwner: 'FP&A partner',
        receivingOrgId: 'o-ops',
        failureModes: [
          'Envelope handed off without documented assumptions',
          'Exception path unclear to the operating org',
        ],
        recoveryPath: 'Reissue the envelope with the assumption log and confirm the exception path with the operating org',
      },
    ],
    risks: [
      { kind: 'dependency', description: 'Provisional or late planning inputs force forecast rework', severity: 'high', mitigation: 'Lock final, sourced inputs before each cycle opens' },
      { kind: 'decision', description: 'Spend approved outside the authority matrix undermines allocation discipline', severity: 'medium', mitigation: 'Route all approvals through the authority matrix' },
      { kind: 'capacity', description: 'Close and planning windows crowd out decision-support analysis', severity: 'medium', mitigation: 'Schedule ad-hoc analysis around close windows' },
      { kind: 'stale_knowledge', description: 'Undocumented assumptions get re-derived and disputed', severity: 'low', mitigation: 'Maintain a sourced assumption log with each forecast' },
    ],

    publishedSections: [...ALL_SECTIONS],
    lastUpdatedAt: '2026-04-30T00:00:00Z',
  },

  /* ── 10 · Legal (o-legal) ───────────────────────────────────────── */
  {
    id: 'card-legal',
    orgId: 'o-legal',

    missionCriticalOutcomes: [
      'Commercial and regulatory risk is reduced without stalling the business',
      'Reviews accelerate when intake arrives complete',
      'Contract positions are consistent and defensible',
      'Regulatory obligations are met and traceable',
    ],
    successConditions: [
      'Intake arrives complete, so review starts immediately',
      'Pre-approved fallback positions let the business negotiate within bounds',
      'Risk decisions are documented and consistent across deals',
      'Regulatory changes are translated into actionable guidance',
    ],
    leadingIndicators: [
      'Share of intakes that arrive complete',
      'Review lead time from complete intake',
      'Reuse rate of pre-approved fallback positions',
    ],
    laggingIndicators: [
      'Escalation rate on negotiated terms',
      'Cycle time from request to signed contract',
    ],
    operatingMetrics: [
      { label: 'Complete-intake rate', value: '64%', kind: 'leading', trend: 'up' },
      { label: 'Review lead time (complete intake)', value: '3.5 days', kind: 'operating', trend: 'down' },
      { label: 'Fallback-position reuse', value: '58%', kind: 'quality', trend: 'up' },
      { label: 'Escalations on negotiated terms', value: '9%', kind: 'lagging', trend: 'flat' },
    ],
    capacitySignals: [
      'Counsel capacity is the binding constraint on concurrent reviews',
      'Quarter-end deal pressure compresses review bandwidth',
      'Regulatory work competes with commercial review for the same team',
    ],
    qualitySignals: [
      'Risk decisions are documented and consistent',
      'Fallback positions are pre-approved and reusable',
      'Regulatory guidance is dated and jurisdiction-specific',
    ],
    riskSignals: [
      'Incomplete intake forcing back-and-forth before review can start',
      'Non-standard terms arriving inside the close window',
      'Regulatory guidance drifting past its review date',
    ],
    stakeholderOutcomes: [
      'Sales negotiates within clear, pre-approved bounds',
      'Procurement and HR get timely, consistent reviews',
      'Leadership carries a defensible, traceable risk position',
    ],
    maturityLevel: 'developing',
    currentBlockers: [
      'A large share of intake arrives incomplete and delays review',
      'Some regulatory guidance has aged past its review date',
    ],
    nextBestActions: [
      'Publish an intake checklist and decline incomplete submissions back for completion',
      'Expand the library of pre-approved fallback positions',
      'Refresh aged regulatory guidance and set review dates',
    ],

    responsibilities: [
      'Own commercial contract review and risk position',
      'Own regulatory compliance interpretation',
      'Maintain standard terms and fallback positions',
      'Advise the business on legal risk tradeoffs',
    ],
    services: [
      'Contract review and negotiation support',
      'Regulatory interpretation and guidance',
      'Standard-terms and fallback maintenance',
      'Legal risk advisory',
    ],
    systems: [
      'Contract lifecycle and intake system',
      'Standard-terms and clause library',
      'Regulatory-guidance repository',
    ],
    decisions: [
      'Approve or condition contract terms',
      'Set fallback positions for negotiation',
      'Interpret regulatory requirements for the business',
    ],
    processes: [
      'Intake, triage, and contract review',
      'Fallback-position approval and maintenance',
      'Regulatory-change interpretation and rollout',
    ],
    businessOutcomes: [
      'Reduced commercial and regulatory risk',
      'Faster deals through complete intake and reusable fallbacks',
      'A consistent, defensible risk position',
    ],
    artifactsProduced: [
      'Reviewed contracts and redlines',
      'Standard terms and fallback libraries',
      'Regulatory guidance notes',
      'Risk-decision records',
    ],
    governanceAreas: [
      'Contract-standards and approval governance',
      'Regulatory-compliance interpretation',
      'Risk-decision consistency',
    ],
    notOwned: [
      'Commercial negotiation ownership (Sales owns within fallbacks)',
      'Security control implementation (Security owns)',
      'Procurement sourcing decisions (Procurement owns)',
    ],

    requiredInputs: [
      {
        input: 'Complete deal context and requested terms',
        fromOrgId: 'o-sales',
        format: 'Intake with deal value, counterparty, terms, and timing',
        timing: 'Before negotiation, not at signature',
        qualityBar: 'Intake is complete enough to start review immediately',
      },
      {
        input: 'Security and data-handling requirements',
        fromOrgId: 'o-sec',
        format: 'Control and data-processing requirements',
        timing: 'During review of data-bearing contracts',
        qualityBar: 'Requirements map to applicable standards',
      },
      {
        input: 'Procurement terms and vendor risk',
        fromOrgId: 'o-proc',
        format: 'Vendor terms and risk assessment',
        timing: 'Before vendor contract review',
        qualityBar: 'Risk assessment is current and specific',
      },
      {
        input: 'Policy and people-law context',
        fromOrgId: 'o-hr',
        format: 'People-policy questions with jurisdiction',
        timing: 'Before people-policy changes ship',
        qualityBar: 'Jurisdiction and scope are explicit',
      },
    ],
    missingInputFailureModes: [
      'Incomplete intake forces review to stall on back-and-forth',
      'Missing security context produces contracts that need re-review',
      'Late vendor-risk input delays procurement deals',
    ],
    escalationTriggers: [
      'A non-standard term is requested inside the close window',
      'A regulatory obligation has no clear owner',
      'A contract is signed without required review',
    ],
    commonMisconceptions: [
      'That Legal owns the negotiation rather than setting the bounds for it',
      'That review can start on incomplete intake',
      'That a fallback position, once set, never needs refresh',
    ],
    reworkCauses: [
      'Reviews started on incomplete intake',
      'Missing security or vendor context surfaced mid-review',
      'Inconsistent positions requiring re-decision',
    ],
    delayCauses: [
      'Incomplete intake requiring completion first',
      'Counsel capacity compressed at quarter-end',
      'Regulatory work competing with commercial review',
    ],

    outputs: [
      'Reviewed, risk-positioned contracts',
      'Reusable fallback positions',
      'Actionable regulatory guidance',
    ],
    servicesOffered: [
      'Contract review and negotiation support',
      'Regulatory interpretation',
      'Legal risk advisory',
    ],
    expertise: [
      'Commercial contracting and risk',
      'Regulatory interpretation',
      'Negotiation strategy within risk bounds',
    ],
    decisionSupport: [
      'Risk tradeoff framing for commercial decisions',
      'Regulatory interpretation for the business',
      'Fallback options for negotiation',
    ],
    enablement: [
      'Pre-approved fallbacks that let the business negotiate fast',
      'Complete-intake guidance that accelerates review',
      'Standard terms that reduce per-deal effort',
    ],
    riskReduction: [
      'Consistent positions reduce regulatory exposure',
      'Documented risk decisions reduce re-litigation',
      'Early review reduces late-cycle deal risk',
    ],
    acceleration: [
      'Complete intake accelerates reviews materially',
      'Reusable fallbacks remove escalation loops',
    ],
    advisoryRole: [
      'Advisor on commercial and regulatory risk',
      'Partner to Sales on negotiation strategy',
    ],
    reusableArtifacts: [
      'Standard-terms and clause library',
      'Fallback-position playbook',
      'Regulatory-guidance notes',
    ],
    serviceExpectations: [
      'Complete intakes reviewed within three to five business days',
      'Fallback positions kept current each quarter',
      'Regulatory guidance refreshed on change',
    ],
    bestWaysToEngage: [
      'Submit a complete intake so review can start at once',
      'Negotiate within the pre-approved fallbacks',
      'Bring legal in before the close window, not at signature',
    ],

    engagement: {
      howToEngage: 'Submit a complete intake through the contract workflow; negotiation proceeds within pre-approved fallbacks without per-deal escalation.',
      intakeProcess: 'Open an intake with the required fields; incomplete intakes are returned for completion before review starts.',
      intakeFields: ['Contract type', 'Counterparty', 'Requested terms', 'Deal value', 'Target date'],
      contactChannel: '#legal-intake with the standard-terms and fallback library',
      responseRhythm: 'Complete intakes acknowledged same day; reviewed within three to five days',
      officeHours: 'Weekly commercial-legal clinic for terms questions',
      cadenceStyle: 'async_first',
      escalationPath: 'Sr Counsel, Commercial, then General Counsel for novel risk',
      decisionRights: ['Approve or condition terms', 'Set fallback positions'],
      approvalRights: ['Approve non-standard terms', 'Approve regulatory-guidance rollouts'],
    },
    meetingNorms: {
      includeWhen: [
        'A novel or high-risk term needs a real-time decision',
        'A regulatory change needs cross-org interpretation',
        'A deal is blocked on a legal risk tradeoff',
      ],
      doNotIncludeWhen: [
        'A standard term fits the fallback library',
        'An intake can be reviewed async',
        'No decision is being requested',
      ],
      requiredPreRead: 'The contract or issue and the specific decision requested, shared ahead',
      requiredAgenda: 'The decision and the risk tradeoff are explicit',
      requiredDecisionOwner: true,
      preferredLength: '30 minutes',
      preferredCadence: 'Weekly commercial clinic; risk syncs as needed',
      asyncAlternatives: ['Intake review', 'Fallback library', 'Redline comment thread'],
      recurringRules: 'Clinics handle decisions on novel terms; standard review stays async',
    },
    handoffRules: [
      {
        id: 'ho-legal-1',
        name: 'Reviewed contract back to the business',
        checklist: [
          'Redlines and approved positions documented',
          'Fallbacks and conditions stated',
          'Open risks flagged',
        ],
        definitionOfReady: [
          'Intake complete',
          'Risk position decided',
          'Required cross-org inputs incorporated',
        ],
        definitionOfDone: [
          'Business has the approved positions and fallbacks',
          'Conditions and open risks acknowledged',
          'Signature path clear',
        ],
        requiredApprovals: ['Sr Counsel, Commercial'],
        requiredArtifacts: ['Redlined contract', 'Fallback positions'],
        handoffOwner: 'Reviewing counsel',
        receivingOrgId: 'o-sales',
        failureModes: [
          'Fallbacks communicated verbally and lost',
          'Conditions not understood by the business',
        ],
        recoveryPath: 'Reissue the documented fallbacks and walk the business through conditions before negotiation continues',
      },
    ],
    risks: [
      { kind: 'handoff', description: 'Incomplete intake stalls reviews on back-and-forth before work can start', severity: 'high', mitigation: 'Publish an intake checklist and return incomplete submissions for completion' },
      { kind: 'capacity', description: 'Quarter-end deal pressure compresses counsel review bandwidth', severity: 'medium', mitigation: 'Pull review earlier and reserve close-window capacity' },
      { kind: 'stale_knowledge', description: 'Regulatory guidance ages past review and is applied inconsistently', severity: 'high', mitigation: 'Set review dates and refresh aged guidance each quarter' },
      { kind: 'decision', description: 'Non-standard terms arrive too late for proper risk review', severity: 'medium', mitigation: 'Surface non-standard terms at qualification, not at signature' },
    ],

    publishedSections: [...ALL_SECTIONS],
    lastUpdatedAt: '2026-04-22T00:00:00Z',
  },

  /* ── 11 · Security (o-sec) ──────────────────────────────────────── */
  {
    id: 'card-sec',
    orgId: 'o-sec',

    missionCriticalOutcomes: [
      'The secure path is the default path for every team',
      'Customer and company data stays protected across the platform',
      'Security review accelerates work that arrives with complete context',
      'Threats are detected and responded to before material impact',
    ],
    successConditions: [
      'Controls are expressed as defaults teams inherit, not gates they hit late',
      'Security requirements arrive during design, not before release',
      'Risk decisions are documented and consistent',
      'Detection and response are exercised, not assumed',
    ],
    leadingIndicators: [
      'Share of changes inheriting secure-by-default controls',
      'Security-review lead time from complete intake',
      'Time to remediate critical findings',
    ],
    laggingIndicators: [
      'Incident rate and severity',
      'Audit-finding recurrence',
    ],
    operatingMetrics: [
      { label: 'Changes on secure-by-default controls', value: '82%', kind: 'quality', trend: 'up' },
      { label: 'Critical-finding remediation (median)', value: '4.0 days', kind: 'operating', trend: 'down' },
      { label: 'Security-review lead time', value: '3.0 days', kind: 'operating', trend: 'flat' },
      { label: 'Detection coverage of critical assets', value: '95%', kind: 'leading', trend: 'up' },
    ],
    capacitySignals: [
      'Security-engineering capacity gates concurrent deep reviews',
      'Incident response draws directly from review capacity',
      'Audit and compliance cycles compress engineering bandwidth',
    ],
    qualitySignals: [
      'Controls are automated as secure defaults where possible',
      'Risk decisions are documented and consistent',
      'Detection coverage is measured against critical assets',
    ],
    riskSignals: [
      'Security engaged after design lock, becoming a late gate',
      'Critical findings aging past remediation targets',
      'Detection gaps on critical assets',
    ],
    stakeholderOutcomes: [
      'Engineering inherits secure defaults instead of late blockers',
      'Legal and GRC carry a defensible compliance posture',
      'Customers and leadership trust the platform with their data',
    ],
    maturityLevel: 'established',
    currentBlockers: [
      'Security is sometimes engaged after design is locked',
      'A subset of critical findings ages past remediation targets',
    ],
    nextBestActions: [
      'Move security engagement to design time via secure-by-default controls',
      'Tighten remediation tracking on critical findings',
      'Close detection-coverage gaps on critical assets',
    ],

    responsibilities: [
      'Own security policy and the controls that enforce it',
      'Own threat detection and incident response',
      'Provide security review and secure-by-default tooling',
      'Maintain the company compliance posture with GRC',
    ],
    services: [
      'Security review and threat modeling',
      'Secure-by-default controls and tooling',
      'Detection, monitoring, and incident response',
      'Compliance-control support',
    ],
    systems: [
      'Security tooling and control plane',
      'Detection and monitoring platform',
      'Vulnerability and finding management',
    ],
    decisions: [
      'Set security policy and control requirements',
      'Accept, condition, or reject a security risk',
      'Prioritize remediation and response',
    ],
    processes: [
      'Security review and threat modeling',
      'Detection, alerting, and incident response',
      'Vulnerability management and remediation',
    ],
    businessOutcomes: [
      'Protected data and a trusted platform',
      'A defensible compliance posture',
      'Faster delivery on a secure-by-default road',
    ],
    artifactsProduced: [
      'Security policies and control requirements',
      'Threat models and review records',
      'Detection rules and incident reports',
      'Remediation and finding registers',
    ],
    governanceAreas: [
      'Security policy and control standards',
      'Data protection and access governance',
      'Incident-response governance',
    ],
    notOwned: [
      'Control implementation in services (Engineering implements)',
      'Regulatory interpretation (Legal and GRC own)',
      'Architecture patterns (Enterprise Architecture owns)',
    ],

    requiredInputs: [
      {
        input: 'Design context for changes under review',
        fromOrgId: 'o-eng',
        format: 'Design doc with data flows and trust boundaries',
        timing: 'During design, before release',
        qualityBar: 'Data flows and boundaries are explicit',
      },
      {
        input: 'Architecture patterns and target state',
        fromOrgId: 'o-ea',
        format: 'Approved patterns and integration constraints',
        timing: 'Before control requirements are set',
        qualityBar: 'Patterns are ratified and current',
      },
      {
        input: 'Regulatory and compliance obligations',
        fromOrgId: 'o-grc',
        format: 'Control mappings to applicable frameworks',
        timing: 'Before audit and on regulatory change',
        qualityBar: 'Mappings are framework-specific and current',
      },
      {
        input: 'Data classification and handling requirements',
        fromOrgId: 'o-data',
        format: 'Classification of data the change touches',
        timing: 'During review of data-bearing changes',
        qualityBar: 'Classification is unambiguous per data element',
      },
    ],
    missingInputFailureModes: [
      'Review without design context misses real trust-boundary risk',
      'Unmapped compliance obligations create audit gaps',
      'Unclassified data leads to under- or over-applied controls',
    ],
    escalationTriggers: [
      'A change ships without required security review',
      'A critical finding ages past its remediation target',
      'A detection gap is found on a critical asset',
    ],
    commonMisconceptions: [
      'That Security is a late gate rather than a design-time partner',
      'That controls slow delivery rather than making the secure path the easy path',
      'That Security implements controls rather than setting and verifying them',
    ],
    reworkCauses: [
      'Security engaged after design lock',
      'Controls applied without data classification',
      'Findings re-opened from inconsistent risk decisions',
    ],
    delayCauses: [
      'Incident response drawing from review capacity',
      'Audit cycles compressing bandwidth',
      'Missing design or classification inputs',
    ],

    outputs: [
      'Secure-by-default controls teams inherit',
      'Timely security reviews and threat models',
      'Detection coverage and incident response',
    ],
    servicesOffered: [
      'Security review and threat modeling',
      'Secure-by-default tooling',
      'Incident response',
    ],
    expertise: [
      'Threat modeling and secure design',
      'Detection engineering and response',
      'Compliance-control design',
    ],
    decisionSupport: [
      'Risk framing for design and release decisions',
      'Compliance posture for audit and leadership',
      'Threat context for prioritization',
    ],
    enablement: [
      'Secure defaults that make the safe path the easy path',
      'Threat models that de-risk designs early',
      'Detection that catches issues before impact',
    ],
    riskReduction: [
      'Secure defaults reduce whole classes of risk',
      'Early review reduces late redesign',
      'Detection and response reduce incident impact',
    ],
    acceleration: [
      'Design-time engagement removes late security gates',
      'Reusable controls remove per-change security work',
    ],
    advisoryRole: [
      'Advisor on security risk tradeoffs',
      'Partner on secure architecture and compliance',
    ],
    reusableArtifacts: [
      'Secure-by-default control library',
      'Threat-model templates',
      'Incident-response runbooks',
    ],
    serviceExpectations: [
      'Security reviews returned within three business days of complete context',
      'Critical findings remediated within the target window',
      'Incident response within the defined response target',
    ],
    bestWaysToEngage: [
      'Bring security in at design, not before release',
      'Provide data flows and classification with the request',
      'Adopt secure-by-default controls rather than custom paths',
    ],

    engagement: {
      howToEngage: 'Engage at design time through security review; adopt secure-by-default controls to avoid late gates.',
      intakeProcess: 'Submit a design with data flows and classification; review is scoped by risk.',
      intakeFields: ['Change description', 'Data flows', 'Data classification', 'Trust boundaries', 'Target release'],
      contactChannel: '#security-review with the secure-by-default control catalog',
      responseRhythm: 'Acknowledged within one business day; reviewed within three with complete context',
      officeHours: 'Weekly secure-design clinic',
      cadenceStyle: 'async_first',
      escalationPath: 'Director, Security Engineering, then CISO for risk acceptance',
      decisionRights: ['Set control requirements', 'Accept or condition security risk'],
      approvalRights: ['Approve risk acceptances', 'Approve release on security grounds'],
    },
    meetingNorms: {
      includeWhen: [
        'A security risk needs a real-time accept-or-condition decision',
        'An incident requires coordinated response',
        'A cross-org control change needs alignment',
      ],
      doNotIncludeWhen: [
        'A design can be reviewed async',
        'A standard control fits the catalog',
        'No decision is being requested',
      ],
      requiredPreRead: 'Design context, data flows, and the decision requested, shared ahead',
      requiredAgenda: 'The risk decision and its tradeoff are explicit',
      requiredDecisionOwner: true,
      preferredLength: '30 minutes',
      preferredCadence: 'Weekly secure-design clinic; incident syncs as triggered',
      asyncAlternatives: ['Threat-model review', 'Control catalog', 'Finding tracker'],
      recurringRules: 'Clinics handle risk decisions; routine review stays async',
    },
    handoffRules: [
      {
        id: 'ho-sec-1',
        name: 'Security review to release',
        checklist: [
          'Threat model and findings documented',
          'Required controls verified',
          'Residual risk accepted or conditioned',
        ],
        definitionOfReady: [
          'Design context complete',
          'Data classification provided',
          'Compliance obligations mapped',
        ],
        definitionOfDone: [
          'Findings resolved or risk-accepted',
          'Controls verified in the change',
          'Release approved on security grounds',
        ],
        requiredApprovals: ['Director, Security Engineering'],
        requiredArtifacts: ['Threat model', 'Findings register', 'Risk-acceptance record'],
        handoffOwner: 'Reviewing security engineer',
        receivingOrgId: 'o-eng',
        failureModes: [
          'Released with unresolved critical findings',
          'Risk accepted without a recorded decision',
        ],
        recoveryPath: 'Hold the release, remediate or formally accept the finding, and record the decision before shipping',
      },
    ],
    risks: [
      { kind: 'decision', description: 'Security engaged after design lock becomes a late gate', severity: 'high', mitigation: 'Shift engagement to design time via secure-by-default controls' },
      { kind: 'operational', description: 'Critical findings age past their remediation target', severity: 'high', mitigation: 'Track findings to owners and enforce remediation windows' },
      { kind: 'capacity', description: 'Incident response and audit cycles draw from review capacity', severity: 'medium', mitigation: 'Reserve review capacity separate from response and audit peaks' },
      { kind: 'dependency', description: 'Missing design context or data classification weakens review', severity: 'medium', mitigation: 'Require data flows and classification before review starts' },
    ],

    publishedSections: [...ALL_SECTIONS],
    lastUpdatedAt: '2026-05-20T00:00:00Z',
  },

  /* ── 12 · Data & AI (o-data) ────────────────────────────────────── */
  {
    id: 'card-data',
    orgId: 'o-data',

    missionCriticalOutcomes: [
      'Company data becomes trustworthy enough to base decisions on',
      'Intelligent product features ship on dependable data foundations',
      'Metric definitions are shared, consistent, and instrumented',
      'Data quality and lineage are visible and owned',
    ],
    successConditions: [
      'Each shared metric has one agreed definition and owner',
      'Data contracts and lineage are documented and monitored',
      'Models ship with evaluation and monitoring, not just accuracy claims',
      'Data requests arrive with the decision or feature they serve',
    ],
    leadingIndicators: [
      'Share of shared metrics with a single agreed definition',
      'Data-contract coverage and freshness monitoring',
      'Model evaluation completeness before deployment',
    ],
    laggingIndicators: [
      'Data-quality incident rate',
      'Decision rework traced to inconsistent metrics',
    ],
    operatingMetrics: [
      { label: 'Shared metrics with one definition', value: '76%', kind: 'quality', trend: 'up' },
      { label: 'Pipeline freshness adherence', value: '97%', kind: 'operating', trend: 'flat' },
      { label: 'Models with monitoring in place', value: '88%', kind: 'leading', trend: 'up' },
      { label: 'Data-quality incidents per quarter', value: '6', kind: 'lagging', trend: 'down' },
    ],
    capacitySignals: [
      'Data-engineering capacity gates concurrent pipeline and model work',
      'Ad-hoc analysis competes with platform and model investment',
      'A fixed team supports a bounded number of deep data partnerships',
    ],
    qualitySignals: [
      'Shared metrics carry one definition and an owner',
      'Pipelines have freshness and quality monitoring',
      'Models ship with evaluation and drift monitoring',
    ],
    riskSignals: [
      'Conflicting definitions for the same metric',
      'Pipelines without freshness monitoring',
      'Models deployed without evaluation or monitoring',
    ],
    stakeholderOutcomes: [
      'Product defines outcomes against agreed, instrumented metrics',
      'Engineering builds on dependable data contracts',
      'Leadership and Operations decide on trustworthy numbers',
    ],
    maturityLevel: 'developing',
    currentBlockers: [
      'Some shared metrics still carry conflicting definitions',
      'A subset of pipelines lacks freshness or quality monitoring',
    ],
    nextBestActions: [
      'Converge conflicting metric definitions to a single owned source',
      'Extend freshness and quality monitoring to remaining pipelines',
      'Require evaluation and monitoring before any model deploys',
    ],

    responsibilities: [
      'Own shared metric definitions and the semantic layer',
      'Own data quality, lineage, and contracts',
      'Build and operate models and intelligent features with Engineering',
      'Provide trustworthy data for decisions across orgs',
    ],
    services: [
      'Metric definition and the semantic layer',
      'Data pipelines, contracts, and quality monitoring',
      'Model development, evaluation, and monitoring',
      'Decision-support data and analysis',
    ],
    systems: [
      'Data platform and pipelines',
      'Semantic layer and metric store',
      'Model development and monitoring tooling',
    ],
    decisions: [
      'Set shared metric definitions',
      'Set data-contract and quality standards',
      'Approve model deployment on evaluation grounds',
    ],
    processes: [
      'Metric definition and governance',
      'Data-contract and quality management',
      'Model development, evaluation, and monitoring',
    ],
    businessOutcomes: [
      'Trustworthy decisions across the company',
      'Intelligent features on dependable foundations',
      'Consistent metrics that prevent decision rework',
    ],
    artifactsProduced: [
      'Metric definitions and semantic-layer models',
      'Data contracts and lineage maps',
      'Models with evaluation and monitoring',
      'Decision-support datasets and analyses',
    ],
    governanceAreas: [
      'Metric-definition governance',
      'Data quality and lineage standards',
      'Model evaluation and monitoring standards',
    ],
    notOwned: [
      'Platform infrastructure operation (Engineering owns)',
      'Roadmap priority (Product Management owns)',
      'Data-security policy (Security owns; Data & AI applies)',
    ],

    requiredInputs: [
      {
        input: 'Platform infrastructure and runtime',
        fromOrgId: 'o-eng',
        format: 'Pipeline runtime and storage with SLAs',
        timing: 'Continuously for pipeline operation',
        qualityBar: 'Runtime meets agreed availability and freshness SLAs',
      },
      {
        input: 'Outcome and metric requirements',
        fromOrgId: 'o-prod',
        format: 'Decisions or features the metrics must serve',
        timing: 'Before defining metrics or models',
        qualityBar: 'The decision or feature served is explicit',
      },
      {
        input: 'Data classification and protection requirements',
        fromOrgId: 'o-sec',
        format: 'Classification and handling controls',
        timing: 'Before building data-bearing pipelines',
        qualityBar: 'Classification and controls are specific',
      },
      {
        input: 'Operational data sources and ownership',
        fromOrgId: 'o-ops',
        format: 'Source systems with ownership and update cadence',
        timing: 'Before contracts are set',
        qualityBar: 'Source ownership and cadence are confirmed',
      },
    ],
    missingInputFailureModes: [
      'Without the served decision, metrics get built that no one uses',
      'Unclassified data leads to mis-applied protection controls',
      'Unconfirmed source ownership breaks contracts downstream',
    ],
    escalationTriggers: [
      'Two orgs use conflicting definitions for the same metric',
      'A pipeline loses freshness on a critical dataset',
      'A model is deployed without evaluation or monitoring',
    ],
    commonMisconceptions: [
      'That Data & AI owns the infrastructure rather than the data and models on it',
      'That a model is done at accuracy rather than at evaluation and monitoring',
      'That any metric request can bypass the shared definition',
    ],
    reworkCauses: [
      'Metrics built without the served decision',
      'Contracts set on unconfirmed source ownership',
      'Models shipped without evaluation',
    ],
    delayCauses: [
      'Ad-hoc analysis competing with platform work',
      'Missing classification or source inputs',
      'Definition disputes blocking shared metrics',
    ],

    outputs: [
      'Agreed, instrumented metric definitions',
      'Monitored data contracts and pipelines',
      'Evaluated, monitored models',
    ],
    servicesOffered: [
      'Metric definition and semantic-layer modeling',
      'Data-pipeline and quality engineering',
      'Model development and evaluation',
    ],
    expertise: [
      'Data modeling and semantic-layer design',
      'Data quality, lineage, and contracts',
      'Model evaluation and monitoring',
    ],
    decisionSupport: [
      'Trustworthy datasets for cross-org decisions',
      'Metric clarity for outcome definition',
      'Model performance and drift signal',
    ],
    enablement: [
      'A shared semantic layer that ends metric disputes',
      'Data contracts that let teams build with confidence',
      'Evaluated models other teams can rely on',
    ],
    riskReduction: [
      'Single metric definitions reduce decision rework',
      'Quality monitoring reduces data-incident impact',
      'Model monitoring reduces silent drift risk',
    ],
    acceleration: [
      'Reusable datasets and metrics shorten analysis',
      'Contracts remove repeated integration negotiation',
    ],
    advisoryRole: [
      'Advisor on data trustworthiness and metric design',
      'Partner on model feasibility and evaluation',
    ],
    reusableArtifacts: [
      'Semantic-layer metric definitions',
      'Data-contract and lineage templates',
      'Model-evaluation and monitoring templates',
    ],
    serviceExpectations: [
      'Metric-definition requests resolved within one week',
      'Pipeline freshness monitored against agreed SLAs',
      'Models deployed only with evaluation and monitoring in place',
    ],
    bestWaysToEngage: [
      'Bring the decision or feature the data must serve',
      'Use the shared metric definition rather than a private one',
      'Confirm source ownership and classification before contracts',
    ],

    engagement: {
      howToEngage: 'Route data and metric needs through data intake with the served decision; model work is scoped against evaluation requirements.',
      intakeProcess: 'Submit a request with the decision or feature, sources, and classification; it enters the data backlog.',
      intakeFields: ['Decision or feature served', 'Data sources', 'Metric or model', 'Classification', 'Timing'],
      contactChannel: '#data-intake with the semantic-layer catalog',
      responseRhythm: 'Acknowledged within two business days; scoped at the next planning cycle',
      officeHours: 'Weekly data clinic for metric and model questions',
      cadenceStyle: 'balanced',
      escalationPath: 'Data Science Lead, then CTO for cross-org data conflicts',
      decisionRights: ['Set shared metric definitions', 'Set data-contract standards'],
      approvalRights: ['Approve model deployment on evaluation', 'Approve metric-definition changes'],
    },
    meetingNorms: {
      includeWhen: [
        'A metric-definition conflict needs a decision',
        'A model deployment needs an evaluation sign-off',
        'A cross-org data contract needs alignment',
      ],
      doNotIncludeWhen: [
        'The semantic-layer catalog answers the question',
        'A request fits the data intake',
        'No decision is being requested',
      ],
      requiredPreRead: 'The metric or model context and the decision requested, shared ahead',
      requiredAgenda: 'The decision and its data tradeoff are explicit',
      requiredDecisionOwner: true,
      preferredLength: '30 minutes',
      preferredCadence: 'Weekly data clinic; model-review syncs as needed',
      asyncAlternatives: ['Semantic-layer catalog', 'Contract review', 'Evaluation report'],
      recurringRules: 'Clinics handle definition and model decisions; status stays async',
    },
    handoffRules: [
      {
        id: 'ho-data-1',
        name: 'Model deployment to production use',
        checklist: [
          'Evaluation results and limits documented',
          'Monitoring and drift detection in place',
          'Consumer guidance published',
        ],
        definitionOfReady: [
          'Evaluation meets the bar for the use case',
          'Monitoring configured',
          'Data classification and controls verified',
        ],
        definitionOfDone: [
          'Model live with monitoring active',
          'Consumers acknowledged the limits',
          'Drift alerts routed to an owner',
        ],
        requiredApprovals: ['Data Science Lead'],
        requiredArtifacts: ['Evaluation report', 'Monitoring configuration'],
        handoffOwner: 'Model owner',
        receivingOrgId: 'o-prod',
        failureModes: [
          'Deployed without drift monitoring',
          'Consumers unaware of the model limits',
        ],
        recoveryPath: 'Pause use, enable monitoring, and publish limits before the model is relied on',
      },
    ],
    risks: [
      { kind: 'stale_knowledge', description: 'Conflicting metric definitions cause decision rework across orgs', severity: 'high', mitigation: 'Converge each shared metric to one owned definition' },
      { kind: 'operational', description: 'Pipelines without freshness or quality monitoring fail silently', severity: 'medium', mitigation: 'Extend freshness and quality monitoring to all critical pipelines' },
      { kind: 'dependency', description: 'Unconfirmed source ownership breaks data contracts downstream', severity: 'medium', mitigation: 'Confirm source ownership and cadence before setting contracts' },
      { kind: 'capacity', description: 'Ad-hoc analysis crowds out platform and model investment', severity: 'low', mitigation: 'Protect a fixed platform-investment allocation each cycle' },
    ],

    publishedSections: [...ALL_SECTIONS],
    lastUpdatedAt: '2026-05-27T00:00:00Z',
  },
];
