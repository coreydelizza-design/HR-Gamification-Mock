import type {
  Person, WorkCard, TeamCard, CardAnswer, Meeting, MeetingFitBrief, MeetingFitStatus, MeetingAttendee,
  WorkingAgreement, AgreementStatus, AgreementSection, FreshnessSignal, ReadinessSummary, ReadinessLevel,
} from './types';
import { CARD_SECTIONS } from '../data/cardSections';
import { ACTIVE_ORG_PACK } from '../data/enterprise';

/**
 * Readiness model. All scoring here is:
 *  - explainable (each function returns a plain-language rationale)
 *  - advisory (no thresholds that punish; "attention" is not "failing")
 *  - additive (more clarity, more readiness)
 *
 * No individual ranking, no friction scoring, no personality inference.
 */

const READY_THRESHOLD = 80;
const ALMOST_THRESHOLD = 55;

function bucket(pct: number): ReadinessLevel {
  if (pct >= READY_THRESHOLD) return 'ready';
  if (pct >= ALMOST_THRESHOLD) return 'almost';
  return 'attention';
}

const LEVEL_LABEL: Record<ReadinessLevel, string> = {
  ready: 'Ready',
  almost: 'Almost ready',
  attention: 'Needs attention',
  unknown: 'Not started',
};

/* ─────────────────────────────────────────────────────────────────
   1. Card Readiness — for an individual WorkCard.
   ───────────────────────────────────────────────────────────────── */
export function cardReadiness(
  card: WorkCard | undefined,
  answers: CardAnswer[],
): ReadinessSummary {
  if (!card) {
    return { level: 'unknown', pct: 0, label: LEVEL_LABEL.unknown, rationale: 'No work card has been started yet.' };
  }
  const required = CARD_SECTIONS.filter((s) =>
    s.appliesTo.includes('work') && ACTIVE_ORG_PACK.requiredCardSections.includes(s.key),
  );
  const optional = CARD_SECTIONS.filter((s) =>
    s.appliesTo.includes('work') && !ACTIVE_ORG_PACK.requiredCardSections.includes(s.key),
  );
  const filled = (sectionKey: string) =>
    answers.some((a) => a.cardId === card.id && a.sectionKey === sectionKey && a.body.trim().length > 0);

  const requiredFilled = required.filter((s) => filled(s.key)).length;
  const optionalFilled = optional.filter((s) => filled(s.key)).length;

  const requiredScore = required.length === 0 ? 1 : requiredFilled / required.length;
  const optionalScore = optional.length === 0 ? 0 : optionalFilled / optional.length;
  // Required is 70%, optional rounds out the picture for the remaining 30%.
  const pct = Math.round((requiredScore * 0.7 + optionalScore * 0.3) * 100);

  let rationale: string;
  if (requiredFilled < required.length) {
    const missing = required.filter((s) => !filled(s.key)).map((s) => s.label).join(', ');
    rationale = `Required sections still open: ${missing}.`;
  } else if (optionalScore < 0.5) {
    rationale = 'All required sections answered. Adding more context would help teammates engage.';
  } else {
    rationale = 'All required sections answered with meaningful context.';
  }
  return { level: bucket(pct), pct, label: LEVEL_LABEL[bucket(pct)], rationale };
}

/* ─────────────────────────────────────────────────────────────────
   2. Team Readiness — for a TeamCard.
   ───────────────────────────────────────────────────────────────── */
export function teamReadiness(
  card: TeamCard | undefined,
  answers: CardAnswer[],
): ReadinessSummary {
  if (!card) {
    return { level: 'unknown', pct: 0, label: LEVEL_LABEL.unknown, rationale: 'No team card published.' };
  }
  const checks: Array<[string, boolean]> = [
    ['Mission stated',           card.mission.trim().length > 0],
    ['What the team owns',       card.weOwn.length > 0],
    ['What the team produces',   card.weProduce.length > 0],
    ['What the team needs',      card.weNeed.length > 0],
    ['How partners engage well', card.bestEngagement.trim().length > 0],
    ['Decision owners named',    card.decisionOwners.length > 0],
    ['Communication section',    answers.some((a) => a.cardId === card.id && a.sectionKey === 'communication' && a.body.trim().length > 0)],
    ['Decision-making section',  answers.some((a) => a.cardId === card.id && a.sectionKey === 'decisions' && a.body.trim().length > 0)],
  ];
  const passed = checks.filter(([, v]) => v).length;
  const pct = Math.round((passed / checks.length) * 100);
  const missing = checks.filter(([, v]) => !v).map(([label]) => label);
  const rationale = missing.length === 0
    ? 'Team card is complete and ready for partner teams.'
    : `Still to add: ${missing.join(', ')}.`;
  return { level: bucket(pct), pct, label: LEVEL_LABEL[bucket(pct)], rationale };
}

/* ─────────────────────────────────────────────────────────────────
   3. Meeting Readiness — uses the MeetingFitBrief.
   ───────────────────────────────────────────────────────────────── */
const FIT_STATUS_LABEL: Record<MeetingFitStatus, string> = {
  draft:             'Draft',
  ready:             'Ready',
  decision_ready:    'Decision-ready',
  async_recommended: 'Async recommended',
  at_risk:           'At risk',
};

const FIT_STATUS_LEVEL: Record<MeetingFitStatus, ReadinessLevel> = {
  draft:             'attention',
  ready:             'ready',
  decision_ready:    'ready',
  async_recommended: 'almost',
  at_risk:           'attention',
};

export function meetingFitLabel(status: MeetingFitStatus): string { return FIT_STATUS_LABEL[status]; }
export function meetingFitLevel(status: MeetingFitStatus): ReadinessLevel { return FIT_STATUS_LEVEL[status]; }

export function meetingReadiness(
  brief: MeetingFitBrief | undefined,
  attendees: MeetingAttendee[],
): ReadinessSummary {
  if (!brief) {
    return { level: 'unknown', pct: 0, label: LEVEL_LABEL.unknown, rationale: 'No meeting brief generated yet.' };
  }
  const inputsReceived = brief.requiredInputs.filter((i) => i.received).length;
  const inputsTotal = Math.max(brief.requiredInputs.length, 1);
  const inputsScore = inputsReceived / inputsTotal;

  const agendaScore = brief.agendaReadiness === 'complete' ? 1
    : brief.agendaReadiness === 'partial' ? 0.6 : 0.2;

  const prereadConfirmed = attendees.filter((a) => a.preReadConfirmed).length;
  const prereadScore = attendees.length === 0 ? 1 : prereadConfirmed / attendees.length;

  const pct = Math.round((inputsScore * 0.4 + agendaScore * 0.35 + prereadScore * 0.25) * 100);

  // Honor the brief's declared status for the level/label (operations override score),
  // but keep the percentage as the underlying signal.
  const level = FIT_STATUS_LEVEL[brief.status];
  const label = FIT_STATUS_LABEL[brief.status];

  const rationale = brief.prepGaps.length > 0
    ? `Open prep items: ${brief.prepGaps[0]}${brief.prepGaps.length > 1 ? ` (+${brief.prepGaps.length - 1} more)` : ''}.`
    : 'Inputs received, agenda complete, pre-reads confirmed.';

  return { level, pct, label, rationale };
}

/* ─────────────────────────────────────────────────────────────────
   4. Handoff Readiness — derived from an agreement's handoff section.
   ───────────────────────────────────────────────────────────────── */
export function handoffReadiness(
  agreement: WorkingAgreement | undefined,
  sections: AgreementSection[],
): ReadinessSummary {
  if (!agreement) {
    return { level: 'unknown', pct: 0, label: LEVEL_LABEL.unknown, rationale: 'No agreement found.' };
  }
  const handoff = sections.find((s) => s.agreementId === agreement.id && s.key === 'handoff_checklist');
  const escalation = sections.find((s) => s.agreementId === agreement.id && s.key === 'escalation_path');
  const required = sections.find((s) => s.agreementId === agreement.id && s.key === 'required_inputs');
  const review = sections.find((s) => s.agreementId === agreement.id && s.key === 'review_cadence');

  const checks: Array<[string, boolean]> = [
    ['Handoff checklist',  !!handoff?.body.trim()],
    ['Escalation path',    !!escalation?.body.trim()],
    ['Required inputs',    !!required?.body.trim()],
    ['Review cadence set', !!review?.body.trim()],
  ];
  const passed = checks.filter(([, v]) => v).length;
  const pct = Math.round((passed / checks.length) * 100);
  const missing = checks.filter(([, v]) => !v).map(([label]) => label);
  const rationale = missing.length === 0
    ? 'Handoff is documented end-to-end.'
    : `Missing: ${missing.join(', ')}.`;
  return { level: bucket(pct), pct, label: LEVEL_LABEL[bucket(pct)], rationale };
}

/* ─────────────────────────────────────────────────────────────────
   5. Freshness — already partly precomputed.
   ───────────────────────────────────────────────────────────────── */
export function freshnessSummary(signal: FreshnessSignal | undefined): ReadinessSummary {
  if (!signal) {
    return { level: 'unknown', pct: 0, label: LEVEL_LABEL.unknown, rationale: 'No freshness signal recorded.' };
  }
  if (signal.status === 'fresh') {
    return { level: 'ready', pct: 100, label: 'Fresh', rationale: `Reviewed ${signal.daysSinceUpdate} days ago.` };
  }
  if (signal.status === 'aging') {
    return { level: 'almost', pct: 65, label: 'Aging', rationale: `Last reviewed ${signal.daysSinceUpdate} days ago — a refresh would help.` };
  }
  return { level: 'attention', pct: 25, label: 'Stale', rationale: `Not reviewed in ${signal.daysSinceUpdate} days.` };
}

/* ─────────────────────────────────────────────────────────────────
   6. Agreement Coverage — across a list of agreements.
   ───────────────────────────────────────────────────────────────── */
const AGREEMENT_STATUS_LABEL: Record<AgreementStatus, string> = {
  draft:         'Draft',
  shared:        'Shared',
  mutual_review: 'Mutual review',
  published:     'Published',
  needs_refresh: 'Needs refresh',
  archived:      'Archived',
};

const AGREEMENT_STATUS_LEVEL: Record<AgreementStatus, ReadinessLevel> = {
  draft:         'attention',
  shared:        'almost',
  mutual_review: 'almost',
  published:     'ready',
  needs_refresh: 'almost',
  archived:      'unknown',
};

export function agreementStatusLabel(s: AgreementStatus): string { return AGREEMENT_STATUS_LABEL[s]; }
export function agreementStatusLevel(s: AgreementStatus): ReadinessLevel { return AGREEMENT_STATUS_LEVEL[s]; }

export function agreementCoverage(agreements: WorkingAgreement[]): ReadinessSummary {
  if (agreements.length === 0) {
    return { level: 'unknown', pct: 0, label: LEVEL_LABEL.unknown, rationale: 'No agreements found.' };
  }
  const published = agreements.filter((a) => a.status === 'published').length;
  const inReview = agreements.filter((a) => a.status === 'mutual_review' || a.status === 'shared').length;
  const refresh = agreements.filter((a) => a.status === 'needs_refresh').length;
  const pct = Math.round((published / agreements.length) * 100);
  const rationale = `${published} of ${agreements.length} published`
    + (inReview ? `, ${inReview} in review` : '')
    + (refresh ? `, ${refresh} need refresh` : '')
    + '.';
  return { level: bucket(pct), pct, label: LEVEL_LABEL[bucket(pct)], rationale };
}

/* ─────────────────────────────────────────────────────────────────
   Color helpers — semantic only.
   ───────────────────────────────────────────────────────────────── */
export function levelColor(level: ReadinessLevel): string {
  switch (level) {
    case 'ready':     return 'var(--success)';
    case 'almost':    return 'var(--warning)';
    case 'attention': return 'var(--danger)';
    case 'unknown':   return 'var(--muted)';
  }
}

export function levelSoftBg(level: ReadinessLevel): string {
  switch (level) {
    case 'ready':     return 'var(--success-soft)';
    case 'almost':    return 'var(--warning-soft)';
    case 'attention': return 'var(--danger-soft)';
    case 'unknown':   return 'var(--surface-soft)';
  }
}

export function levelTextColor(level: ReadinessLevel): string {
  switch (level) {
    case 'ready':     return 'var(--success-text)';
    case 'almost':    return 'var(--warning-text)';
    case 'attention': return 'var(--danger-text)';
    case 'unknown':   return 'var(--muted)';
  }
}

/* ─────────────────────────────────────────────────────────────────
   Convenience: roll-up for a single person across signals.
   ───────────────────────────────────────────────────────────────── */
export interface PersonReadinessRollup {
  person: Person;
  card: ReadinessSummary;
  freshness: ReadinessSummary;
}

export function rollupForPerson(
  person: Person,
  card: WorkCard | undefined,
  answers: CardAnswer[],
  freshness: FreshnessSignal | undefined,
): PersonReadinessRollup {
  return {
    person,
    card: cardReadiness(card, answers),
    freshness: freshnessSummary(freshness),
  };
}

/* ─────────────────────────────────────────────────────────────────
   Time formatting helpers used by views.
   ───────────────────────────────────────────────────────────────── */
export function relativeDays(iso: string, refIso: string): number {
  const a = new Date(iso).getTime();
  const b = new Date(refIso).getTime();
  return Math.max(0, Math.round((b - a) / 86_400_000));
}

export function formatMeetingTime(meeting: Meeting): string {
  const d = new Date(meeting.startsAt);
  const day = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${day} · ${time} · ${meeting.durationMinutes} min`;
}
