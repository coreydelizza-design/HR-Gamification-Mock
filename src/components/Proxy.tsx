import { useEffect, useRef, useState } from 'react';
import type {
  OrgMeeting, MeetingClass, InviteeCriticality, RepresentationRequirement,
  AttendanceMode, RoleBand, Urgency,
} from '../lib/types';
import {
  classifyMeeting, inviteesFor, meetingEconomics, recoverableOpportunity,
  buildRemitDigestPreview, assessUrgency, liveBurnPerSecond, marginalCost,
  canDelegate, defaultRequirement, canSetRequirement, agreementGapMeeting,
  enterpriseOpportunity, money, moneyAnnual, occurrencesPerYear,
  MEETING_CLASS_LABEL, CRITICALITY_LABEL, REQUIREMENT_LABEL, MODE_LABEL, URGENCY_LABEL,
} from '../lib/proxyEngine';
import { MEETING_META } from '../data/proxy';
import { roleBandOfPerson, ROLE_CARD_BY_PERSON } from '../data/roleCards';
import { ROLE_BAND_LABEL } from '../data/rateCard';
import { PERSON_BY_ID, ME } from '../data/people';
import { SUCCESS_AGREEMENT_BY_ID } from '../data/successAgreements';
import { useOrgData, setAttendanceMode } from '../lib/demoStore';
import { orgName } from '../lib/orgData';
import { Avatar } from './Shared';

/* ════════════════════════════════════════════════════════════════
   Badges & chips
   ════════════════════════════════════════════════════════════════ */
const CLASS_CLS: Record<MeetingClass, string> = {
  critical: 'pc-critical', representational: 'pc-representational',
  informational: 'pc-informational', duplicate: 'pc-duplicate',
};
export function MeetingClassBadge({ cls, title }: { cls: MeetingClass; title?: string }) {
  return <span className={`proxy-class ${CLASS_CLS[cls]}`} title={title}>{MEETING_CLASS_LABEL[cls]}</span>;
}

const CRIT_CLS: Record<InviteeCriticality, string> = {
  critical: 'cp-critical', contributing: 'cp-contributing', informational: 'cp-informational',
};
export function CriticalityPill({ criticality, rationale }: { criticality: InviteeCriticality; rationale?: string }) {
  return <span className={`crit-pill ${CRIT_CLS[criticality]}`} title={rationale}>{CRITICALITY_LABEL[criticality]}</span>;
}

export function RequirementChip({ requirement }: { requirement: RepresentationRequirement }) {
  return <span className="req-chip mono">{REQUIREMENT_LABEL[requirement]}</span>;
}

export function RoleBandChip({ band }: { band: RoleBand }) {
  return <span className="band-chip mono">{ROLE_BAND_LABEL[band]}</span>;
}

const URG_CLS: Record<Urgency, string> = {
  overdue: 'ug-overdue', due_this_week: 'ug-due', on_track: 'ug-ontrack', no_pressure: 'ug-nopressure',
};
export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  if (urgency === 'no_pressure') return null;
  return <span className={`urg-badge ${URG_CLS[urgency]}`}>{URGENCY_LABEL[urgency]}</span>;
}

/* ════════════════════════════════════════════════════════════════
   Live cost ticker — the demo moment
   ════════════════════════════════════════════════════════════════ */
export function LiveCostTicker({ meeting }: { meeting: OrgMeeting }) {
  const { rateCard } = useOrgData();
  const [running, setRunning] = useState(false);
  const [accrued, setAccrued] = useState(0);
  const startRef = useRef<number>(0);
  const baseRef = useRef<number>(0);
  const burn = liveBurnPerSecond(meeting); // $/sec at current live roster

  useEffect(() => {
    if (!running) return;
    startRef.current = performance.now();
    baseRef.current = accrued;
    const id = setInterval(() => {
      const elapsed = (performance.now() - startRef.current) / 1000;
      setAccrued(baseRef.current + burn * elapsed);
    }, 100);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, burn]);

  return (
    <div className="ticker">
      <div>
        <div className="econ-label">Live cost ticker</div>
        <div className="ticker-value mono">{money(accrued, rateCard.currency)}</div>
        <div className="econ-sub">{money(burn * 60, rateCard.currency)}/min at the current live roster</div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button className="btn-ghost btn-sm" onClick={() => setRunning((r) => !r)}>{running ? 'Pause' : 'Start'}</button>
        <button className="btn-ghost btn-sm" onClick={() => { setRunning(false); setAccrued(0); }}>Reset</button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   Economics strip
   ════════════════════════════════════════════════════════════════ */
export function EconomicsStrip({ meeting }: { meeting: OrgMeeting }) {
  const { rateCard } = useOrgData(); // subscribe for live recompute
  const eco = meetingEconomics(meeting);
  const cur = rateCard.currency;
  return (
    <div className="econ-wrap">
      <div className="econ-strip">
        <div className="econ-cell">
          <div className="econ-label">Cost estimate</div>
          <div className="econ-value mono">{money(eco.costEstimate, cur)}</div>
          <div className="econ-sub">{eco.rationale}</div>
        </div>
        <div className="econ-cell econ-recover">
          <div className="econ-label">Recoverable opportunity</div>
          <div className="econ-value mono">{money(eco.recoverableOpportunity, cur)}</div>
          <div className="econ-sub">{recoverableOpportunity(meeting).rationale}</div>
        </div>
        <div className="econ-cell">
          <div className="econ-label">Cost avoided so far</div>
          <div className="econ-value mono">{money(eco.costAvoided, cur)}</div>
          <div className="econ-sub">{eco.delegateCount} delegate · {eco.asyncCount} async · {eco.hoursReturned.toFixed(1)}h returned</div>
        </div>
        {eco.annualizedRecurringCost != null && (
          <div className="econ-cell">
            <div className="econ-label">Annualized (recurring)</div>
            <div className="econ-value mono">{moneyAnnual(eco.annualizedRecurringCost, cur)}</div>
            <div className="econ-sub">{moneyAnnual(eco.annualizedRecoverable ?? 0, cur)} recoverable</div>
          </div>
        )}
      </div>
      <LiveCostTicker meeting={meeting} />
      <div className="econ-foot">Estimates from the rate card — band rates attach to the seat, never a person. See Admin → Rate Card · Methodology.</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   Agenda + timing
   ════════════════════════════════════════════════════════════════ */
export function AgendaList({ meeting }: { meeting: OrgMeeting }) {
  const meta = MEETING_META[meeting.id];
  const timing = assessUrgency(meeting);
  const KIND_LABEL: Record<string, string> = { decision: 'Decision', input_review: 'Input review', status: 'Status', escalation: 'Escalation' };
  return (
    <div className="home-list">
      {(meta?.agenda ?? []).map((a, i) => {
        const u = timing.agendaUrgency[i]?.urgency ?? 'no_pressure';
        return (
          <div key={i} className="home-list-item" style={{ gridTemplateColumns: 'auto 1fr auto', cursor: 'default' }}>
            <span className="mono agenda-kind">{KIND_LABEL[a.kind] ?? a.kind}</span>
            <div>
              <div className="hli-title" style={{ fontWeight: 400, fontSize: 12.5 }}>{a.topic}</div>
              {a.needBy && <div className="hli-sub">Needed by {new Date(a.needBy.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}{a.needBy.reason ? ` — ${a.needBy.reason}` : ''}</div>}
            </div>
            <UrgencyBadge urgency={u} />
          </div>
        );
      })}
    </div>
  );
}

export function TimingBanners({ meeting }: { meeting: OrgMeeting }) {
  const t = assessUrgency(meeting);
  const banners: Array<{ tone: string; text: string }> = [];
  if (t.scheduledPastDeadline) banners.push({ tone: 'tb-danger', text: t.scheduledPastDeadline });
  t.overdueInputs.forEach((r) => banners.push({ tone: 'tb-danger', text: r }));
  if (t.premature) banners.push({ tone: 'tb-warn', text: t.premature });
  if (t.asyncStrengthened) banners.push({ tone: 'tb-info', text: t.asyncStrengthened });
  if (banners.length === 0) return null;
  return (
    <div className="timing-banners">
      {banners.map((b, i) => <div key={i} className={`timing-banner ${b.tone}`}>{b.text}</div>)}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   Roster table — two-sided consent in the UI
   ════════════════════════════════════════════════════════════════ */
const MODES: AttendanceMode[] = ['live', 'delegate', 'async_digest'];

export function RosterTable({
  meeting, actingAs, onActAs,
}: { meeting: OrgMeeting; actingAs: string; onActAs: (id: string) => void }) {
  const { rateCard } = useOrgData(); // subscribe
  const { cls } = classifyMeeting(meeting);
  const invitees = inviteesFor(meeting);

  return (
    <div className="roster">
      <div className="roster-head">
        <span>Attendee</span><span>Band</span><span>Criticality</span><span>Organizer floor</span><span>Attendance</span>
      </div>
      {invitees.map((inv) => {
        const person = PERSON_BY_ID[inv.personId];
        const band = roleBandOfPerson(inv.personId);
        const acting = inv.personId === actingAs;
        const mode = inv.chosenMode ?? 'live';
        const delegable = canDelegate(inv.requirement, cls, inv.criticality);
        const blockedReason = inv.criticality === 'critical' && cls === 'critical'
          ? 'Critical invitee in a critical meeting — non-delegable. Person required.'
          : inv.requirement === 'person_required'
            ? 'Organizer floor is “person required”.' : '';
        return (
          <div key={inv.personId} className={`roster-row${acting ? ' roster-acting' : ''}`}>
            <span className="roster-name">
              {person && <Avatar person={person} size={26} />}
              <span>
                <span className="hli-title">{person?.name ?? inv.personId}</span>
                {mode === 'delegate' && <span className="agent-tag" title="A delegate always identifies as an agent.">Agent delegate</span>}
                <span className="hli-sub">{orgName(inv.orgSlug)}</span>
              </span>
            </span>
            <span><RoleBandChip band={band} /></span>
            <span><CriticalityPill criticality={inv.criticality} rationale={inv.criticalityRationale} /></span>
            <span><RequirementChip requirement={inv.requirement} /></span>
            <span className="roster-mode">
              {acting ? (
                <select
                  className="mode-select"
                  value={mode}
                  onChange={(e) => setAttendanceMode(meeting.id, inv.personId, e.target.value as AttendanceMode)}
                >
                  {MODES.map((m) => (
                    <option key={m} value={m} disabled={m === 'delegate' && !delegable}>
                      {MODE_LABEL[m]}{m === 'delegate' && !delegable ? ' — blocked' : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="roster-static">
                  <span className="mono" style={{ fontSize: 11 }}>{MODE_LABEL[mode]}</span>
                  <button className="act-as" onClick={() => onActAs(inv.personId)} title="Delegation is self-assigned — in the live product each person controls only their own row.">Act as this person</button>
                </span>
              )}
              {acting && !delegable && <div className="mode-block">{blockedReason}</div>}
            </span>
          </div>
        );
      })}
      <div className="roster-foot">
        Marginal cost reference: adding a C-level is {money(marginalCost('c_level', meeting.durationMinutes), rateCard.currency)} for this meeting · {money(marginalCost('c_level', 30), rateCard.currency)} per half hour.
        Delegation is self-assigned — the selector is enabled only on the row you are acting as.
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   Remit-scoped digest preview — never a transcript
   ════════════════════════════════════════════════════════════════ */
const DIGEST_KIND_LABEL: Record<string, string> = {
  ask_of_my_org: 'Ask of my org', decision_affecting_dependency: 'Decision affecting a dependency',
  action_in_my_remit: 'Action in my remit', input_requested: 'Input requested',
};
export function DigestPreview({ personId, meeting }: { personId: string; meeting: OrgMeeting }) {
  const { attendance } = useOrgData();
  const items = buildRemitDigestPreview(personId, meeting);
  const person = PERSON_BY_ID[personId];
  const grant = attendance[meeting.id]?.[personId];
  const when = grant?.grantedAt ? new Date(grant.grantedAt).toLocaleString() : 'now';
  return (
    <div className="digest-panel">
      <div className="digest-head">
        <span className="org-panel-title">What your delegate will capture</span>
        <span className="agent-tag">Agent · {person?.name}</span>
      </div>
      <div className="digest-consent">
        ✓ Consent recorded — <strong>{person?.name}</strong> delegated this meeting · scope: own remit · granted {when} · revocable any time (switch the row back to “Attend live”).
      </div>
      <div className="digest-note">
        Remit-scoped — your delegate captures only items in {orgName(ORG_CARD_BY_PERSON_ORG(personId))}’s responsibility domain.
        <strong> No transcript. No notes about other attendees.</strong>
      </div>
      <div className="home-list">
        {items.map((it, i) => (
          <div key={i} className="digest-item">
            <span className="digest-kind mono">{DIGEST_KIND_LABEL[it.kind] ?? it.kind}</span>
            <div>
              <div className="hli-title" style={{ fontWeight: 400, fontSize: 12.5 }}>{it.text}</div>
              <div className="hli-sub">source: {it.sourceRemitRef}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function ORG_CARD_BY_PERSON_ORG(personId: string): string {
  return ROLE_CARD_BY_PERSON[personId]?.orgId ?? '';
}

/* ════════════════════════════════════════════════════════════════
   Duplicate merge / cancel recommendation
   ════════════════════════════════════════════════════════════════ */
export function DuplicateMergeCard({ meeting, onOpenMeeting }: { meeting: OrgMeeting; onOpenMeeting?: (id: string) => void }) {
  const { cls, rationale } = classifyMeeting(meeting);
  const { rateCard } = useOrgData();
  if (cls !== 'duplicate') return null;
  const meta = MEETING_META[meeting.id];
  const eco = meetingEconomics(meeting);
  const occ = occurrencesPerYear(meta?.cadence ?? 'one_time');
  return (
    <div className="merge-card">
      <div className="merge-head">Merge or cancel recommended</div>
      <div className="merge-body">{rationale}</div>
      <div className="merge-cost">
        Removing it returns {moneyAnnual(eco.costEstimate * occ, rateCard.currency)} ({money(eco.costEstimate, rateCard.currency)} × {occ}/yr).
      </div>
      {meta?.duplicateOf && onOpenMeeting && (
        <button className="btn-ghost btn-sm" onClick={() => onOpenMeeting(meta.duplicateOf!)}>Open the meeting it duplicates →</button>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   Enterprise opportunity summary — SHARED by Org Insights + Estimator
   ════════════════════════════════════════════════════════════════ */
const DRIVER_LABEL: Record<string, string> = {
  informational_attendance: 'Informational attendance',
  duplicate_meetings: 'Duplicate meetings',
  async_eligible: 'Async-eligible status meetings',
  agreement_gap_escalations: 'Agreement-gap escalations',
};
export function OpportunitySummary({
  onOpenAgreement, onOpenMeeting,
}: { onOpenAgreement?: (id: string) => void; onOpenMeeting?: (id: string) => void }) {
  const { rateCard } = useOrgData(); // subscribe
  const opp = enterpriseOpportunity();
  const cur = rateCard.currency;
  const pct = opp.annualMeetingSpend > 0 ? Math.round((opp.recoverable / opp.annualMeetingSpend) * 100) : 0;

  return (
    <div className="opp-card">
      <div className="opp-head">
        <div>
          <div className="econ-label">Annual meeting spend (as cast)</div>
          <div className="opp-spend mono">{moneyAnnual(opp.annualMeetingSpend, cur)}</div>
        </div>
        <div className="opp-arrow">→</div>
        <div>
          <div className="econ-label">Annual recoverable opportunity</div>
          <div className="opp-recover mono">{moneyAnnual(opp.recoverable, cur)}</div>
          <div className="econ-sub">{pct}% of annual meeting spend is recoverable</div>
        </div>
      </div>
      <div className="opp-drivers">
        {opp.byDriver.map((d) => (
          <div key={d.driver} className="driver-row">
            <span className="driver-label">{DRIVER_LABEL[d.driver]}</span>
            <span className="driver-amount mono">{moneyAnnual(d.amount, cur)}</span>
            <span className="driver-rationale">{d.rationale}</span>
            {d.driver === 'agreement_gap_escalations' && onOpenAgreement && (
              <button className="hli-action" onClick={() => onOpenAgreement(SUCCESS_AGREEMENT_BY_ID['sa-sales-legal']?.id ?? 'sa-sales-legal')}>Publish the agreement →</button>
            )}
            {d.driver === 'duplicate_meetings' && onOpenMeeting && (
              <button className="hli-action" onClick={() => onOpenMeeting('m-prod-eng-sync')}>Merge the duplicate →</button>
            )}
          </div>
        ))}
      </div>
      <div className="econ-foot">
        Org-level economics only. No per-person delegation metric exists; rates attach to role bands (seats), never people.
      </div>
    </div>
  );
}

export const VIEWER_ID = ME.id;

/* re-exports for callers */
export { agreementGapMeeting, defaultRequirement, canSetRequirement };
