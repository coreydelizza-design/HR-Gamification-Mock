import type {
  OrgMeeting, OrgMeetingFit, MeetingClass, MeetingInvitee, InviteeCriticality,
  RepresentationRequirement, AttendanceMode, RemitDigestItem, Urgency, NeedBy,
  MeetingCadence, RateCard, MeetingEconomics, EnterpriseOpportunity, RoleBand,
  SuccessAgreement, RemitDigestKind, DelegationGrant, MeetingAgendaItem,
} from './types';
import { ORG_MEETING_BY_ID, ORG_MEETING_FIT_BY_MEETING } from '../data/meetingFit';
import { MEETING_META } from '../data/proxy';
import { SUCCESS_AGREEMENT_BY_ID } from '../data/successAgreements';
import { ORG_OF_PERSON, ROLE_CARD_BY_PERSON, roleBandOfPerson } from '../data/roleCards';
import { ROLE_BAND_LABEL, ROLE_BAND_ORDER } from '../data/rateCard';
import { getState, indexOf } from './demoStore';
import { orgName, DEMO_NOW } from './orgData';

/**
 * proxyEngine — deterministic, explainable, template-driven. No LLM calls.
 *
 * Every public function returns a rationale alongside its result. Economics are
 * estimates derived from the rate card (the seat, never the person). Two-sided
 * consent is enforced here in code, not just in the UI: organizer floors are
 * tighten-only, and critical invitees in critical meetings are non-delegable.
 * See docs/AGENT_REPRESENTATION_LOCK.md and docs/MEETING_FIT_ENGINE.md.
 */

const WEEK_MS = 7 * 86_400_000;

/* ── attendance state (the individual's self-assigned mode) ──────── */
export type AttendanceState = Record<string, Record<string, { mode: AttendanceMode; grantedAt?: string; revoked?: boolean }>>;

export function currentAttendance(): AttendanceState {
  return getState().attendance ?? {};
}

export function occurrencesPerYear(cadence: MeetingCadence): number {
  switch (cadence) {
    case 'weekly': return 48;
    case 'biweekly': return 24;
    case 'monthly': return 12;
    case 'one_time': return 1;
  }
}

/* ── money formatting — estimates always carry a tilde ───────────── */
const CCY: Record<string, string> = { USD: '$', EUR: '€', GBP: '£' };
export function money(n: number, currency = 'USD'): string {
  const sym = CCY[currency] ?? '$';
  return `~${sym}${Math.round(n).toLocaleString('en-US')}`;
}
export function moneyAnnual(n: number, currency = 'USD'): string {
  const sym = CCY[currency] ?? '$';
  if (n >= 1000) return `≈ ${sym}${Math.round(n / 1000).toLocaleString('en-US')}K/year`;
  return `≈ ${sym}${Math.round(n).toLocaleString('en-US')}/year`;
}

/* ════════════════════════════════════════════════════════════════
   Classification
   ════════════════════════════════════════════════════════════════ */

const agreementOf = (m: OrgMeeting): SuccessAgreement | undefined =>
  m.governingAgreementId ? SUCCESS_AGREEMENT_BY_ID[m.governingAgreementId] : undefined;

export interface MeetingClassResult { cls: MeetingClass; rationale: string }

/** Resolve composition data: a meeting's own inline fields override the seed meta,
 *  so composed / edited meetings are self-contained and recompute through one path. */
export interface ResolvedMeta {
  agenda: MeetingAgendaItem[];
  cadence: MeetingCadence;
  inviteePersonIds: string[];
  inputNeedBy?: Record<string, { date: string; reason?: string }>;
  duplicateOf?: string;
}
export function metaOf(meeting: OrgMeeting): ResolvedMeta {
  const seed = MEETING_META[meeting.id];
  return {
    agenda: meeting.agenda ?? seed?.agenda ?? [],
    cadence: meeting.cadence ?? seed?.cadence ?? 'one_time',
    inviteePersonIds: meeting.inviteePersonIds ?? seed?.inviteePersonIds ?? meeting.attendeePersonIds,
    inputNeedBy: meeting.inputNeedBy ?? seed?.inputNeedBy,
    duplicateOf: meeting.duplicateOf ?? seed?.duplicateOf,
  };
}

export function isEscalation(meeting: OrgMeeting): boolean {
  return meeting.meetingType === 'escalation';
}

export function classifyMeeting(meeting: OrgMeeting): MeetingClassResult {
  if (isEscalation(meeting)) {
    return { cls: 'critical', rationale: 'Escalation meetings are people-only by policy — forced to critical; no seat is delegable.' };
  }
  const meta = metaOf(meeting);
  if (meta?.duplicateOf) {
    const other = ORG_MEETING_BY_ID[meta.duplicateOf];
    return {
      cls: 'duplicate',
      rationale: `Duplicates "${other?.title ?? meta.duplicateOf}" — same organizations, overlapping agenda, and no new required inputs since that occurrence. Recommend cancel or merge.`,
    };
  }
  const agenda = meta?.agenda ?? [];
  const decisionRight = agenda.find((a) => a.kind === 'decision' && (a.exercisesDecisionRight || a.reviewsAgreement));
  const escalation = agenda.find((a) => a.kind === 'escalation');
  if (decisionRight || escalation) {
    const why = decisionRight
      ? `exercises a decision right / agreement review: "${decisionRight.topic}"`
      : `invokes an escalation path: "${escalation!.topic}"`;
    return { cls: 'critical', rationale: `Critical — an agenda item ${why}.` };
  }
  const needsInput = agenda.some((a) => a.kind === 'input_review' || a.kind === 'decision');
  if (needsInput) {
    return { cls: 'representational', rationale: 'Representational — an organization’s input is needed but no decision right is exercised here.' };
  }
  return { cls: 'informational', rationale: 'Informational — status / FYI only; no input or decision is required to proceed.' };
}

export interface CriticalityResult { criticality: InviteeCriticality; rationale: string }

/** classifyInvitee — criticality + rationale citing card / role / input data. */
export function classifyInvitee(
  personId: string,
  meeting: OrgMeeting,
  fit = ORG_MEETING_FIT_BY_MEETING[meeting.id],
): CriticalityResult {
  const meta = metaOf(meeting);
  const orgSlug = ORG_OF_PERSON[personId] ?? '';
  const roleCard = ROLE_CARD_BY_PERSON[personId];
  const { cls } = classifyMeeting(meeting);
  const isOwner = meeting.decisionOwnerPersonId === personId;

  // 1 · owns a required input that is missing and past its need-by → escalation elevation
  const missing = (fit?.requiredInputs ?? []).find((ri) => ri.orgId === orgSlug && !ri.received);
  if (missing) {
    const nb = meta?.inputNeedBy?.[missing.input];
    if (nb && new Date(nb.date).getTime() < DEMO_NOW) {
      return {
        criticality: 'critical',
        rationale: `Owns a required input now overdue — "${missing.input}" was needed by ${fmtDate(nb.date)}; its absence blocks the decision.`,
      };
    }
  }

  // 2 · decision owner exercising a decision right in a critical meeting
  if (isOwner && cls === 'critical') {
    const right = (meta?.agenda ?? []).find((a) => a.exercisesDecisionRight || a.reviewsAgreement);
    const cite = roleCard ? ` — ${roleCard.title} decision rights` : '';
    return { criticality: 'critical', rationale: `Decision right: "${right?.topic ?? meeting.decisionRequested}"${cite}.` };
  }

  // 3 · owner-party to an agreement under review
  const agr = agreementOf(meeting);
  if (agr && agr.orgIds.includes(orgSlug) && (meta?.agenda ?? []).some((a) => a.reviewsAgreement)) {
    return { criticality: 'critical', rationale: `Owner-party to ${agr.title}, which is under review on the agenda.` };
  }

  // 4 · contributing — their org's needs/offers intersect the agenda
  if (meeting.requiredOrgIds.includes(orgSlug) || meeting.participatingOrgIds.includes(orgSlug)) {
    return { criticality: 'contributing', rationale: `${orgName(orgSlug)}’s input is needed — its needs/offers intersect the agenda topics.` };
  }
  if (isOwner) {
    return { criticality: 'contributing', rationale: 'Facilitates the session and owns the follow-up, but exercises no decision right here.' };
  }

  // 5 · informational
  return { criticality: 'informational', rationale: `Not identified as critical or contributing for ${orgName(orgSlug) || 'their org'} — attending for awareness only.` };
}

const REQ_RANK: Record<RepresentationRequirement, number> = {
  agent_optional: 0, org_delegate_minimum: 1, person_required: 2,
};

/** The organizer's suggested floor. Organizers may TIGHTEN this, never loosen below it. */
export function defaultRequirement(cls: MeetingClass, crit: InviteeCriticality): RepresentationRequirement {
  if (crit === 'critical' && cls === 'critical') return 'person_required';
  if (crit === 'informational') return 'agent_optional';
  return 'org_delegate_minimum';
}

/** Tighten-only guard: a target floor is allowed iff it is at least as strict as the default. */
export function canSetRequirement(def: RepresentationRequirement, target: RepresentationRequirement): boolean {
  return REQ_RANK[target] >= REQ_RANK[def];
}

/** An individual may delegate only when the floor permits it (person_required blocks). */
export function canDelegate(requirement: RepresentationRequirement, cls: MeetingClass, crit: InviteeCriticality): boolean {
  if (crit === 'critical' && cls === 'critical') return false; // non-negotiable
  return requirement !== 'person_required';
}

/* ════════════════════════════════════════════════════════════════
   Invitees — the single source the roster, economics, and digests use
   ════════════════════════════════════════════════════════════════ */

export function inviteesFor(meeting: OrgMeeting, attendance: AttendanceState = currentAttendance()): MeetingInvitee[] {
  const meta = metaOf(meeting);
  const fit = ORG_MEETING_FIT_BY_MEETING[meeting.id];
  const { cls } = classifyMeeting(meeting);
  const escalation = isEscalation(meeting);
  const roster = meta.inviteePersonIds;
  return roster.map((personId) => {
    const { criticality, rationale } = classifyInvitee(personId, meeting, fit);
    // Escalation meetings are people-only: every floor is person_required.
    const requirement = escalation ? 'person_required' : defaultRequirement(cls, criticality);
    const a = attendance[meeting.id]?.[personId];
    const grant: DelegationGrant | undefined = a?.mode === 'delegate' && !a.revoked
      ? { personId, meetingId: meeting.id, grantedAt: a.grantedAt ?? '', scope: 'own_remit' }
      : undefined;
    return {
      personId,
      orgSlug: ORG_OF_PERSON[personId] ?? '',
      criticality,
      criticalityRationale: rationale,
      requirement,
      chosenMode: a?.mode ?? 'live',
      delegationGrant: grant,
    };
  });
}

/* ════════════════════════════════════════════════════════════════
   Remit-scoped digest preview (what the delegate captures — never a transcript)
   ════════════════════════════════════════════════════════════════ */

export function buildRemitDigestPreview(personId: string, meeting: OrgMeeting): RemitDigestItem[] {
  const meta = metaOf(meeting);
  const orgSlug = ORG_OF_PERSON[personId] ?? '';
  const myOrg = orgName(orgSlug) || 'your organization';
  const roleCard = ROLE_CARD_BY_PERSON[personId];
  const items: RemitDigestItem[] = [];
  const push = (kind: RemitDigestKind, text: string, ref: string) => items.push({ kind, text, sourceRemitRef: ref });

  for (const a of meta?.agenda ?? []) {
    if (a.kind === 'decision' || a.kind === 'escalation') {
      push('decision_affecting_dependency',
        `Decision on "${a.topic}" and how it affects ${myOrg}’s dependencies.`,
        `${myOrg} card · Dependencies`);
    } else if (a.kind === 'input_review') {
      push('input_requested',
        `Any input requested from ${myOrg} on "${a.topic}".`,
        `${myOrg} card · What it owns`);
    }
  }
  if (roleCard) {
    push('ask_of_my_org',
      `Asks that land on the ${roleCard.title} seat — e.g. ${roleCard.responsibilities[0]}.`,
      `Role card · ${roleCard.title}`);
  }
  push('action_in_my_remit',
    `Action items that fall inside ${myOrg}’s remit.`,
    `${myOrg} card · Responsibilities`);

  // De-dupe and cap — a digest, not a feed.
  const seen = new Set<string>();
  return items.filter((i) => (seen.has(i.text) ? false : (seen.add(i.text), true))).slice(0, 5);
}

/* ════════════════════════════════════════════════════════════════
   Urgency + timing flags
   ════════════════════════════════════════════════════════════════ */

export function urgencyOf(needBy: NeedBy | undefined, now = DEMO_NOW): Urgency {
  if (!needBy) return 'no_pressure';
  const d = new Date(needBy.date).getTime();
  if (d < now) return 'overdue';
  if (d <= now + WEEK_MS) return 'due_this_week';
  return 'on_track';
}

export interface TimingAssessment {
  agendaUrgency: Array<{ topic: string; urgency: Urgency; needBy?: NeedBy }>;
  inputUrgency: Array<{ input: string; orgId: string; urgency: Urgency; missing: boolean; needBy?: NeedBy }>;
  scheduledPastDeadline?: string;     // rationale
  premature?: string;                 // rationale
  overdueInputs: string[];            // rationales (escalation triggers)
  asyncStrengthened?: string;         // rationale
}

export function assessUrgency(meeting: OrgMeeting, now = DEMO_NOW): TimingAssessment {
  const meta = metaOf(meeting);
  const fit = ORG_MEETING_FIT_BY_MEETING[meeting.id];
  const startMs = new Date(meeting.startsAt).getTime();
  const agenda = meta?.agenda ?? [];

  const agendaUrgency = agenda.map((a) => ({ topic: a.topic, urgency: urgencyOf(a.needBy, now), needBy: a.needBy }));

  const inputUrgency = (fit?.requiredInputs ?? []).map((ri) => {
    const nb = meta?.inputNeedBy?.[ri.input];
    const needBy: NeedBy | undefined = nb ? { date: nb.date, reason: nb.reason } : undefined;
    return { input: ri.input, orgId: ri.orgId, urgency: urgencyOf(needBy, now), missing: !ri.received, needBy };
  });

  // scheduled-past-deadline: a decision's need-by falls before the meeting itself
  let scheduledPastDeadline: string | undefined;
  for (const a of agenda) {
    if (a.kind === 'decision' && a.needBy && new Date(a.needBy.date).getTime() < startMs) {
      scheduledPastDeadline = `Scheduled past the decision deadline — "${a.topic}" was needed by ${fmtDate(a.needBy.date)}, but the meeting is ${fmtDate(meeting.startsAt)}.`;
      break;
    }
  }

  // overdue-input escalation: a required input is missing and its need-by has passed
  const overdueInputs = inputUrgency
    .filter((i) => i.missing && i.urgency === 'overdue')
    .map((i) => `Escalation trigger: ${orgName(i.orgId)} input "${i.input}" was due ${fmtDate(i.needBy!.date)} and is still missing — its owner becomes critical.`);

  // premature: every required input is not due until after the meeting
  const withNeedBy = inputUrgency.filter((i) => i.needBy);
  let premature: string | undefined;
  if (withNeedBy.length > 0 && withNeedBy.every((i) => new Date(i.needBy!.date).getTime() > startMs)) {
    const latest = withNeedBy.map((i) => i.needBy!.date).sort().slice(-1)[0];
    premature = `Premature — required inputs are not due until ${fmtDate(latest)}, after the meeting on ${fmtDate(meeting.startsAt)}. Recommend rescheduling after the inputs land.`;
  }

  // async strengthened: informational class with no time pressure on the agenda
  const { cls } = classifyMeeting(meeting);
  let asyncStrengthened: string | undefined;
  if (cls === 'informational' && agendaUrgency.every((a) => a.urgency === 'no_pressure' || a.urgency === 'on_track')) {
    asyncStrengthened = 'No time pressure on the agenda — an async digest by end of week achieves the same outcome as meeting live.';
  }

  return { agendaUrgency, inputUrgency, scheduledPastDeadline, premature, overdueInputs, asyncStrengthened };
}

/* ════════════════════════════════════════════════════════════════
   Economics — estimates from the rate card (the seat, never the person)
   ════════════════════════════════════════════════════════════════ */

function rateCardOf(): RateCard { return getState().rateCard; }
function hourlyOf(personId: string, rc: RateCard): number { return rc.bands[roleBandOfPerson(personId)].hourly; }
const seatCost = (personId: string, durMin: number, rc: RateCard) => hourlyOf(personId, rc) * (durMin / 60);

export function marginalCost(band: RoleBand, durationMin: number, rc: RateCard = rateCardOf()): number {
  return rc.bands[band].hourly * (durationMin / 60);
}

/* ── What-if estimator — same rate-card math, no duplicate formulas ── */
export interface RosterEstimate {
  seats: number;
  perOccurrence: number;
  perHalfHour: number;          // combined burn rate for a 30-minute block
  annual: number;
  recoverablePerOccurrence: number;
  recoverableAnnual: number;
}

export function estimateRoster(
  bandCounts: Partial<Record<RoleBand, number>>,
  durationMin: number,
  cadence: MeetingCadence,
  convertCount: number,
  rc: RateCard = rateCardOf(),
): RosterEstimate {
  // Expand to per-seat hourly rates so conversion can target the costliest seats.
  const seatHourly: number[] = [];
  for (const band of ROLE_BAND_ORDER) {
    for (let i = 0; i < (bandCounts[band] ?? 0); i++) seatHourly.push(rc.bands[band].hourly);
  }
  const occ = occurrencesPerYear(cadence);
  const perOccurrence = seatHourly.reduce((s, h) => s + h * (durationMin / 60), 0);
  const perHalfHour = seatHourly.reduce((s, h) => s + h * 0.5, 0);
  const convert = Math.max(0, Math.min(convertCount, seatHourly.length));
  const recoverablePerOccurrence = [...seatHourly].sort((a, b) => b - a)
    .slice(0, convert).reduce((s, h) => s + h * (durationMin / 60), 0);
  return {
    seats: seatHourly.length,
    perOccurrence,
    perHalfHour,
    annual: perOccurrence * occ,
    recoverablePerOccurrence,
    recoverableAnnual: recoverablePerOccurrence * occ,
  };
}

function bandBreakdown(personIds: string[]): string {
  const counts: Partial<Record<RoleBand, number>> = {};
  personIds.forEach((p) => { const b = roleBandOfPerson(p); counts[b] = (counts[b] ?? 0) + 1; });
  return ROLE_BAND_ORDER.filter((b) => counts[b]).map((b) => `${counts[b]} ${ROLE_BAND_LABEL[b].toLowerCase()}`).join(', ');
}

export interface Recoverable { amount: number; rationale: string }

export function recoverableOpportunity(
  meeting: OrgMeeting, rc: RateCard = rateCardOf(), attendance: AttendanceState = currentAttendance(),
): Recoverable {
  const dur = meeting.durationMinutes;
  const invitees = inviteesFor(meeting, attendance);
  const live = invitees.filter((i) => (i.chosenMode ?? 'live') === 'live');
  const { cls } = classifyMeeting(meeting);
  const total = live.reduce((s, i) => s + seatCost(i.personId, dur, rc), 0);

  if (isEscalation(meeting)) {
    return { amount: 0, rationale: `${money(0, rc.currency)} — escalation meetings are not delegation-eligible (people-only by policy). Every seat must attend live.` };
  }

  if (cls === 'duplicate') {
    const meta = metaOf(meeting);
    const other = meta?.duplicateOf ? ORG_MEETING_BY_ID[meta.duplicateOf] : undefined;
    return { amount: total, rationale: `${money(total, rc.currency)} recoverable per occurrence — this meeting duplicates "${other?.title ?? 'another meeting'}"; cancel or merge it.` };
  }

  const infLive = live.filter((i) => i.criticality === 'informational');
  const infCost = infLive.reduce((s, i) => s + seatCost(i.personId, dur, rc), 0);
  const asyncEligible = cls === 'informational' || cls === 'representational';
  const contribLive = asyncEligible ? live.filter((i) => i.criticality === 'contributing') : [];
  const contribCost = contribLive.reduce((s, i) => s + seatCost(i.personId, dur, rc), 0);
  const amount = infCost + contribCost;

  const parts: string[] = [];
  if (infLive.length) parts.push(`${infLive.length} informational attendee${infLive.length === 1 ? '' : 's'} (${money(infCost, rc.currency)})`);
  if (contribLive.length) parts.push(`async-eligible status items (${money(contribCost, rc.currency)})`);
  const rationale = amount > 0
    ? `${money(amount, rc.currency)} of ${money(total, rc.currency)} recoverable: ${parts.join(' + ')}.`
    : `Fully cast — every live seat is critical or contributing to a live decision.`;
  return { amount, rationale };
}

export function meetingEconomics(
  meeting: OrgMeeting, rc: RateCard = rateCardOf(), attendance: AttendanceState = currentAttendance(),
): MeetingEconomics {
  const dur = meeting.durationMinutes;
  const invitees = inviteesFor(meeting, attendance);
  const modeOf = (i: typeof invitees[number]) => i.chosenMode ?? 'live';
  const live = invitees.filter((i) => modeOf(i) === 'live');
  const delegate = invitees.filter((i) => modeOf(i) === 'delegate');
  const async = invitees.filter((i) => modeOf(i) === 'async_digest');

  const costEstimate = live.reduce((s, i) => s + seatCost(i.personId, dur, rc), 0);
  const costAvoided = [...delegate, ...async].reduce((s, i) => s + seatCost(i.personId, dur, rc), 0);
  const recoverable = recoverableOpportunity(meeting, rc, attendance).amount;

  const meta = metaOf(meeting);
  const occ = occurrencesPerYear(meta?.cadence ?? 'one_time');
  const recurring = occ > 1;

  return {
    durationMin: dur,
    liveCount: live.length,
    delegateCount: delegate.length,
    asyncCount: async.length,
    hoursCost: live.length * (dur / 60),
    hoursReturned: (delegate.length + async.length) * (dur / 60),
    costEstimate,
    costAvoided,
    recoverableOpportunity: recoverable,
    annualizedRecurringCost: recurring ? costEstimate * occ : undefined,
    annualizedRecoverable: recurring ? recoverable * occ : undefined,
    rationale: `${invitees.length} attendees · ${bandBreakdown(invitees.map((i) => i.personId))} · ${dur} min${recurring ? ` · ${meta!.cadence} (×${occ}/yr)` : ''}`,
  };
}

/** The live cost accruing per second at the current roster's combined rate (the ticker). */
export function liveBurnPerSecond(meeting: OrgMeeting, rc: RateCard = rateCardOf(), attendance: AttendanceState = currentAttendance()): number {
  const invitees = inviteesFor(meeting, attendance).filter((i) => (i.chosenMode ?? 'live') === 'live');
  const hourly = invitees.reduce((s, i) => s + hourlyOf(i.personId, rc), 0);
  return hourly / 3600;
}

/* ════════════════════════════════════════════════════════════════
   Enterprise opportunity — annualized, non-overlapping driver buckets
   ════════════════════════════════════════════════════════════════ */

export function enterpriseOpportunity(
  meetings: OrgMeeting[] = Object.keys(MEETING_META).map((id) => ORG_MEETING_BY_ID[id]).filter(Boolean),
  rc: RateCard = rateCardOf(),
  attendance: AttendanceState = currentAttendance(),
): EnterpriseOpportunity {
  let spend = 0, informational = 0, duplicate = 0, asyncEligible = 0, gap = 0;

  for (const meeting of meetings) {
    const meta = metaOf(meeting);
    if (!meta) continue;
    const dur = meeting.durationMinutes;
    const occ = occurrencesPerYear(meta.cadence);
    const { cls } = classifyMeeting(meeting);
    const invitees = inviteesFor(meeting, attendance);
    const live = invitees.filter((i) => (i.chosenMode ?? 'live') === 'live');
    const agr = agreementOf(meeting);
    const hasGap = meta.agenda.some((a) => a.kind === 'escalation') && (!agr || agr.status !== 'published');

    for (const i of live) {
      const annual = seatCost(i.personId, dur, rc) * occ;
      spend += annual;
      // Each live seat lands in at most one recoverable bucket (priority order).
      if (cls === 'duplicate') duplicate += annual;
      else if (hasGap) gap += annual;
      else if (i.criticality === 'informational') informational += annual;
      else if ((cls === 'informational' || cls === 'representational') && i.criticality === 'contributing') asyncEligible += annual;
    }
  }

  const byDriver: EnterpriseOpportunity['byDriver'] = [
    { driver: 'informational_attendance', amount: informational, rationale: `${money(informational, rc.currency)}/yr of seat-time is informational attendees sitting live in meetings they could take as a delegate or async digest.` },
    { driver: 'duplicate_meetings', amount: duplicate, rationale: `${money(duplicate, rc.currency)}/yr is spent on recurring meetings that duplicate another — merge or cancel them.` },
    { driver: 'async_eligible', amount: asyncEligible, rationale: `${money(asyncEligible, rc.currency)}/yr is contributing seats in status/representational meetings that an async digest would serve.` },
    { driver: 'agreement_gap_escalations', amount: gap, rationale: `${money(gap, rc.currency)}/yr is escalation meetings on org pairs with no published Success Agreement — publish the agreement and the escalations stop.` },
  ];

  return { annualMeetingSpend: spend, recoverable: informational + duplicate + asyncEligible + gap, byDriver };
}

/* ── per-meeting helper for the gap driver's "fix" link ──────────── */
export function agreementGapMeeting(meeting: OrgMeeting): { agreementId?: string; status?: string } | undefined {
  const meta = metaOf(meeting);
  const agr = agreementOf(meeting);
  if (meta?.agenda.some((a) => a.kind === 'escalation') && (!agr || agr.status !== 'published')) {
    return { agreementId: agr?.id, status: agr?.status ?? 'missing' };
  }
  return undefined;
}

/* ── shared date formatter ───────────────────────────────────────── */
export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/* ── label maps for the UI ───────────────────────────────────────── */
export const MEETING_CLASS_LABEL: Record<MeetingClass, string> = {
  critical: 'Critical', representational: 'Representational', informational: 'Informational', duplicate: 'Duplicate',
};
export const CRITICALITY_LABEL: Record<InviteeCriticality, string> = {
  critical: 'Critical', contributing: 'Contributing', informational: 'Informational',
};
export const REQUIREMENT_LABEL: Record<RepresentationRequirement, string> = {
  person_required: 'Person required', org_delegate_minimum: 'Org delegate min.', agent_optional: 'Agent optional',
};
export const MODE_LABEL: Record<AttendanceMode, string> = {
  live: 'Attend live', delegate: 'Send delegate', async_digest: 'Async digest', not_needed: 'Not needed',
};
export const URGENCY_LABEL: Record<Urgency, string> = {
  overdue: 'Overdue', due_this_week: 'Due this week', on_track: 'On track', no_pressure: 'No pressure',
};
