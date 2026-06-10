import type {
  Organization, OrganizationCard, OrgDependency, OrgNeed, OrgOffer,
  SuccessAgreement, SuccessAgreementSection, OrgMeeting, OrgMeetingFit,
  OrgSuccessAnalysis, OrgDimension, CrossOrgSuccessAnalysis, SuccessAgreementClause,
  ReadinessSummary, ReadinessLevel, FreshnessState,
} from './types';

/**
 * Organization success analysis. Same discipline as lib/readiness.ts:
 *   - deterministic (no randomness, no dates beyond the records themselves)
 *   - explainable (every dimension carries a plain-language rationale)
 *   - weights visible in code
 *   - nothing persisted or scored per person
 *
 * All friction is expressed at the organization / relationship level.
 * There is no individual ranking, friction score, or comparison anywhere.
 */

const READY = 80;
const ALMOST = 55;

function bucket(pct: number): ReadinessLevel {
  if (pct >= READY) return 'ready';
  if (pct >= ALMOST) return 'almost';
  return 'attention';
}

const LEVEL_LABEL: Record<ReadinessLevel, string> = {
  ready: 'Clear', almost: 'Developing', attention: 'Needs attention', unknown: 'Not started',
};

function summary(pct: number, rationale: string): ReadinessSummary {
  const level = bucket(pct);
  return { level, pct, label: LEVEL_LABEL[level], rationale };
}

/** Score a list-backed clarity signal: how many of `parts` are non-empty. */
function coverage(parts: Array<string[] | string | undefined>): number {
  const filled = parts.filter((p) => (Array.isArray(p) ? p.length > 0 : !!p && p.trim().length > 0)).length;
  return parts.length === 0 ? 0 : Math.round((filled / parts.length) * 100);
}

const FRESHNESS_PCT: Record<FreshnessState, number> = {
  fresh: 100, aging: 60, stale: 25, unpublished: 0,
};

/* ═══════════════════════════════════════════════════════════════
   analyzeOrganizationSuccess
   ═══════════════════════════════════════════════════════════════ */
export function analyzeOrganizationSuccess(
  org: Organization,
  card: OrganizationCard | undefined,
  allDeps: OrgDependency[],
  allAgreements: SuccessAgreement[],
  allNeeds: OrgNeed[],
  allOffers: OrgOffer[],
  meetings: OrgMeeting[],
  meetingFits: OrgMeetingFit[],
): OrgSuccessAnalysis {
  const deps = allDeps.filter((d) => d.fromOrgId === org.id || d.toOrgId === org.id);
  const upstreamDeps = allDeps.filter((d) => d.fromOrgId === org.id); // this org depends on others
  const downstreamDeps = allDeps.filter((d) => d.toOrgId === org.id); // others depend on this org
  const agreements = allAgreements.filter((a) => a.orgIds.includes(org.id));
  const needs = allNeeds.filter((n) => n.ownerOrgId === org.id);
  const offers = allOffers.filter((o) => o.ownerOrgId === org.id);
  const orgMeetings = meetings.filter((m) => m.participatingOrgIds.includes(org.id));
  const orgFits = meetingFits.filter((f) => orgMeetings.some((m) => m.id === f.meetingId));

  /* ── 11 dimensions ───────────────────────────────────────────── */
  const dims: OrgDimension[] = [];
  const add = (key: string, label: string, s: ReadinessSummary) => dims.push({ key, label, summary: s });

  // 1 Mission Clarity
  const missionPct = card
    ? coverage([org.mission, card.missionCriticalOutcomes, card.successConditions, card.leadingIndicators, card.stakeholderOutcomes])
    : (org.mission ? 40 : 0);
  add('mission', 'Mission Clarity', summary(missionPct,
    card ? `Mission, outcomes, and success conditions ${missionPct >= READY ? 'are well defined' : 'need more definition'}.`
         : 'Success model not yet published.'));

  // 2 Ownership Clarity
  const ownPct = card ? coverage([card.responsibilities, card.services, card.decisions, card.businessOutcomes, card.notOwned]) : 0;
  add('ownership', 'Ownership Clarity', summary(ownPct,
    card && card.notOwned.length === 0 ? 'Owns is defined, but what it does NOT own is unstated — a common source of friction.'
      : ownPct >= READY ? 'Responsibilities and explicit non-ownership are clear.' : 'Ownership boundaries are partly defined.'));

  // 3 Input Clarity
  const inputsDefined = card?.requiredInputs ?? [];
  const inputQuality = inputsDefined.length === 0 ? 0
    : Math.round((inputsDefined.filter((i) => i.format && i.timing && i.qualityBar).length / inputsDefined.length) * 100);
  add('inputs', 'Input Clarity', summary(card ? inputQuality : 0,
    inputsDefined.length === 0 ? 'Required inputs from other organizations are not documented.'
      : `${inputsDefined.length} required inputs documented${inputQuality < READY ? ', some missing format/timing/quality bar' : ' with format, timing, and quality bar'}.`));

  // 4 Output Clarity
  const outPct = card ? coverage([card.outputs, card.servicesOffered, card.serviceExpectations, card.bestWaysToEngage]) : 0;
  add('outputs', 'Output Clarity', summary(outPct,
    card ? `How this organization helps others ${outPct >= READY ? 'is concrete, with service expectations' : 'is partly defined'}.` : 'Outputs not yet published.'));

  // 5 Dependency Health
  const depPct = deps.length === 0 ? 50 : Math.round((deps.filter((d) => d.health === 'healthy').length / deps.length) * 100);
  const atRisk = deps.filter((d) => d.health === 'at_risk' || d.health === 'blocked');
  add('dependency', 'Dependency Health', summary(deps.length === 0 ? 50 : depPct,
    deps.length === 0 ? 'No cross-org dependencies mapped yet.'
      : atRisk.length ? `${atRisk.length} of ${deps.length} dependencies are at risk or blocked.` : `All ${deps.length} dependencies are healthy.`));

  // 6 Handoff Readiness
  const handoffs = card?.handoffRules ?? [];
  const handoffPct = handoffs.length === 0 ? 0
    : Math.round((handoffs.filter((h) => h.checklist.length && h.definitionOfDone.length && h.handoffOwner).length / handoffs.length) * 100);
  add('handoff', 'Handoff Readiness', summary(card ? handoffPct : 0,
    handoffs.length === 0 ? 'No handoff rules published — handoffs stall when something goes wrong.'
      : `${handoffs.length} handoff rule(s) defined${handoffPct >= READY ? ' end-to-end' : ', some missing a checklist or owner'}.`));

  // 7 Meeting Readiness
  const fitReady = orgFits.filter((f) => f.status === 'ready' || f.status === 'decision_ready').length;
  const meetingPct = orgFits.length === 0 ? 50 : Math.round((fitReady / orgFits.length) * 100);
  add('meeting', 'Meeting Readiness', summary(orgFits.length === 0 ? 50 : meetingPct,
    orgFits.length === 0 ? 'No cross-org meetings evaluated.'
      : `${fitReady} of ${orgFits.length} cross-org meetings are ready or decision-ready.`));

  // 8 Decision Clarity
  const decPct = card ? coverage([card.engagement?.decisionRights, card.engagement?.approvalRights, card.decisions]) : 0;
  add('decision', 'Decision Clarity', summary(decPct,
    card && card.engagement?.decisionRights?.length ? 'Decision and approval rights are stated.' : 'Decision rights are not clearly stated.'));

  // 9 Escalation Clarity
  const escOk = !!card?.engagement?.escalationPath?.trim();
  add('escalation', 'Escalation Clarity', summary(escOk ? 100 : 0,
    escOk ? 'A clear escalation path is published.' : 'No escalation path is defined.'));

  // 10 Freshness
  add('freshness', 'Freshness', summary(FRESHNESS_PCT[org.freshness],
    org.freshness === 'fresh' ? `Reviewed recently; next review ${org.nextReviewAt.slice(0, 10)}.`
      : org.freshness === 'aging' ? 'Card is aging — a refresh would help.'
      : org.freshness === 'stale' ? 'Card is stale and overdue for review.' : 'Card is not yet published.'));

  // 11 Agreement Coverage
  const published = agreements.filter((a) => a.status === 'published').length;
  const agrPct = agreements.length === 0 ? 0 : Math.round((published / agreements.length) * 100);
  add('agreements', 'Agreement Coverage', summary(agrPct,
    agreements.length === 0 ? 'No Success Agreements cover this organization’s key relationships.'
      : `${published} of ${agreements.length} agreements published${agreements.some((a) => a.status === 'needs_refresh') ? '; some need refresh' : ''}.`));

  /* ── Overall score (mean of dimensions) ──────────────────────── */
  const score = Math.round(dims.reduce((s, d) => s + d.summary.pct, 0) / dims.length);
  const ranked = [...dims].sort((a, b) => b.summary.pct - a.summary.pct);
  const topEnablers = ranked.slice(0, 3).filter((d) => d.summary.pct >= ALMOST).map((d) => `${d.label}: ${d.summary.rationale}`);
  const topRisks = [...ranked].reverse().slice(0, 3).filter((d) => d.summary.pct < READY).map((d) => `${d.label}: ${d.summary.rationale}`);

  /* ── Cross-org help ──────────────────────────────────────────── */
  const helpNeededFrom = [
    ...needs.filter((n) => n.status !== 'covered').map((n) => ({ orgId: n.needFromOrgId, why: n.description })),
    ...upstreamDeps.filter((d) => d.health !== 'healthy').map((d) => ({ orgId: d.toOrgId, why: `${d.requiredInput} (${d.health})` })),
  ];
  const helpOfferedTo = [
    ...offers.filter((o) => o.active).map((o) => ({ orgId: o.offeredToOrgId, why: o.description })),
    ...downstreamDeps.map((d) => ({ orgId: d.fromOrgId, why: d.outputProvided })),
  ];

  /* ── Next best actions ───────────────────────────────────────── */
  const actions: string[] = [];
  if (!escOk) actions.push('Publish an escalation path so handoffs do not stall.');
  if (handoffs.length === 0) actions.push('Add at least one handoff checklist with a definition of done.');
  if (inputsDefined.length === 0) actions.push('Document the required inputs this organization needs from others.');
  if (card && card.notOwned.length === 0) actions.push('State explicitly what this organization does NOT own.');
  atRisk.slice(0, 2).forEach((d) => actions.push(`Repair the ${d.health} dependency on ${d.toOrgId === org.id ? d.fromOrgId : d.toOrgId}: ${d.risk}.`));
  agreements.filter((a) => a.status === 'needs_refresh').slice(0, 2).forEach((a) => actions.push(`Refresh the agreement “${a.title}”.`));
  if (org.freshness === 'stale') actions.push('Review the organization card — it is overdue.');
  (card?.nextBestActions ?? []).forEach((a) => actions.push(a));

  return {
    orgId: org.id,
    successReadinessScore: score,
    scoreRationale: `Mean of 11 explainable dimensions (${dims.filter((d) => d.summary.pct >= READY).length} clear, ${dims.filter((d) => d.summary.pct < ALMOST).length} need attention).`,
    level: bucket(score),
    dimensions: dims,
    topEnablers,
    topRisks,
    helpNeededFrom: dedupeHelp(helpNeededFrom),
    helpOfferedTo: dedupeHelp(helpOfferedTo),
    nextBestActions: dedupe(actions).slice(0, 6),
  };
}

/* ═══════════════════════════════════════════════════════════════
   analyzeCrossOrgSuccess
   ═══════════════════════════════════════════════════════════════ */
export function analyzeCrossOrgSuccess(
  orgA: Organization,
  orgB: Organization,
  allDeps: OrgDependency[],
  allAgreements: SuccessAgreement[],
  allSections: SuccessAgreementSection[],
  allNeeds: OrgNeed[],
  allOffers: OrgOffer[],
  cardA: OrganizationCard | undefined,
  cardB: OrganizationCard | undefined,
  meetings: OrgMeeting[],
  meetingFits: OrgMeetingFit[],
): CrossOrgSuccessAnalysis {
  const between = (x: string, y: string) => (d: OrgDependency) =>
    (d.fromOrgId === x && d.toOrgId === y) || (d.fromOrgId === y && d.toOrgId === x);

  const pairDeps = allDeps.filter(between(orgA.id, orgB.id));
  const aNeedsFromB = [
    ...allNeeds.filter((n) => n.ownerOrgId === orgA.id && n.needFromOrgId === orgB.id).map((n) => n.description),
    ...allDeps.filter((d) => d.fromOrgId === orgA.id && d.toOrgId === orgB.id).map((d) => d.requiredInput),
  ];
  const bNeedsFromA = [
    ...allNeeds.filter((n) => n.ownerOrgId === orgB.id && n.needFromOrgId === orgA.id).map((n) => n.description),
    ...allDeps.filter((d) => d.fromOrgId === orgB.id && d.toOrgId === orgA.id).map((d) => d.requiredInput),
  ];
  const aHelpsB = [
    ...allOffers.filter((o) => o.ownerOrgId === orgA.id && o.offeredToOrgId === orgB.id).map((o) => o.description),
    ...allDeps.filter((d) => d.toOrgId === orgA.id && d.fromOrgId === orgB.id).map((d) => d.outputProvided),
  ];
  const bHelpsA = [
    ...allOffers.filter((o) => o.ownerOrgId === orgB.id && o.offeredToOrgId === orgA.id).map((o) => o.description),
    ...allDeps.filter((d) => d.toOrgId === orgB.id && d.fromOrgId === orgA.id).map((d) => d.outputProvided),
  ];

  const agreement = allAgreements.find((a) => a.orgIds.includes(orgA.id) && a.orgIds.includes(orgB.id));
  const agreementSections = agreement ? allSections.filter((s) => s.agreementId === agreement.id) : [];

  // Shared outcomes — from agreement, else inferred from both missions.
  const sharedOutcomes = agreement
    ? [agreement.sharedBusinessOutcome]
    : [`${orgA.name} and ${orgB.name} share an interest in a clean handoff between their work.`];

  // Friction points — org-level only.
  const friction: string[] = [];
  pairDeps.filter((d) => d.health !== 'healthy').forEach((d) => friction.push(`${d.health === 'blocked' ? 'Blocked' : 'At-risk'} dependency: ${d.risk}`));
  allNeeds.filter((n) => (n.ownerOrgId === orgA.id && n.needFromOrgId === orgB.id) || (n.ownerOrgId === orgB.id && n.needFromOrgId === orgA.id))
    .filter((n) => n.status === 'gap').forEach((n) => friction.push(`Uncovered need: ${n.description}`));
  if (!agreement) friction.push('No Success Agreement governs this relationship.');
  else if (agreement.status === 'needs_refresh') friction.push('The governing Success Agreement needs refresh.');
  if (!cardA) friction.push(`${orgA.name} has not published its organization card.`);
  if (!cardB) friction.push(`${orgB.name} has not published its organization card.`);

  // Recommended clauses — a need with no covering agreement section becomes a clause.
  const haveSectionKeys = new Set(agreementSections.map((s) => s.key));
  const clauses: SuccessAgreementClause[] = [];
  if (!haveSectionKeys.has('required_inputs') && (aNeedsFromB.length || bNeedsFromA.length)) {
    clauses.push({ forGap: 'Required inputs', recommendation: 'Document the inputs each org needs, with format, timing, and quality bar.', rationale: 'Inputs are exchanged but not specified — the top cause of rework.' });
  }
  if (!haveSectionKeys.has('handoff_checklist')) {
    clauses.push({ forGap: 'Handoff checklist', recommendation: 'Define a shared definition of ready / done for the handoff.', rationale: 'No agreed handoff checklist exists for this relationship.' });
  }
  if (!haveSectionKeys.has('escalation_path')) {
    clauses.push({ forGap: 'Escalation path', recommendation: 'Name who to escalate to, and when, on both sides.', rationale: 'Without an escalation path, problems sit until the next meeting.' });
  }
  if (!haveSectionKeys.has('decision_rights')) {
    clauses.push({ forGap: 'Decision rights', recommendation: 'Clarify which org owns which decision at the boundary.', rationale: 'Unclear decision ownership is a recurring friction at this boundary.' });
  }

  // Meeting fit guidance for the pair.
  const pairMeetings = meetings.filter((m) => m.participatingOrgIds.includes(orgA.id) && m.participatingOrgIds.includes(orgB.id));
  const pairFits = meetingFits.filter((f) => pairMeetings.some((m) => m.id === f.meetingId));
  const meetingGuidance = pairMeetings.length === 0
    ? `No recurring ${orgA.name}↔${orgB.name} meeting is tracked. If inputs are exchanged regularly, a short cadence with a named decision owner would help.`
    : pairFits.some((f) => f.status === 'at_risk')
      ? `A tracked ${orgA.name}↔${orgB.name} meeting is at risk — close the missing inputs before it runs.`
      : `Tracked ${orgA.name}↔${orgB.name} meetings are on track.`;

  const nextBestActions: string[] = [];
  clauses.slice(0, 3).forEach((c) => nextBestActions.push(`Add a “${c.forGap}” clause to the ${orgA.name}↔${orgB.name} agreement.`));
  pairDeps.filter((d) => d.health !== 'healthy').slice(0, 2).forEach((d) => nextBestActions.push(`Repair: ${d.risk}.`));
  if (!agreement) nextBestActions.push(`Draft a ${orgA.name}↔${orgB.name} Success Agreement.`);

  const mutualSummary = `${orgA.name} relies on ${orgB.name} for ${aNeedsFromB[0] ?? 'shared inputs'}; ${orgB.name} relies on ${orgA.name} for ${bNeedsFromA[0] ?? 'shared inputs'}. ${agreement ? `Governed by “${agreement.title}” (${agreement.status.replace('_', ' ')}).` : 'No agreement governs this relationship yet.'}`;

  return {
    orgAId: orgA.id, orgBId: orgB.id,
    mutualSummary,
    aNeedsFromB: dedupe(aNeedsFromB), bNeedsFromA: dedupe(bNeedsFromA),
    aHelpsB: dedupe(aHelpsB), bHelpsA: dedupe(bHelpsA),
    sharedOutcomes,
    frictionPoints: dedupe(friction),
    recommendedClauses: clauses,
    meetingGuidance,
    nextBestActions: dedupe(nextBestActions),
  };
}

/* ── helpers ─────────────────────────────────────────────────── */
function dedupe(arr: string[]): string[] {
  return Array.from(new Set(arr.filter((s) => s && s.trim().length > 0)));
}
function dedupeHelp(arr: Array<{ orgId: string; why: string }>): Array<{ orgId: string; why: string }> {
  const seen = new Set<string>();
  const out: Array<{ orgId: string; why: string }> = [];
  for (const h of arr) {
    const k = h.orgId + '|' + h.why;
    if (!seen.has(k)) { seen.add(k); out.push(h); }
  }
  return out;
}

export { bucket as orgScoreBucket };
