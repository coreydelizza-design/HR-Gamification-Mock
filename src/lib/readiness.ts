import type {
  Meeting, MeetingFitStatus, WorkingAgreement, AgreementStatus, ReadinessSummary, ReadinessLevel,
} from './types';

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
   Time formatting helpers used by views.
   ───────────────────────────────────────────────────────────────── */
export function formatMeetingTime(meeting: Meeting): string {
  const d = new Date(meeting.startsAt);
  const day = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${day} · ${time} · ${meeting.durationMinutes} min`;
}
