import { useState } from 'react';
import type { MeetingFitStatus } from '../lib/types';
import { ORG_MEETINGS, ORG_MEETING_FIT_BY_MEETING } from '../data/meetingFit';
import { orgName, DEMO_NOW } from '../lib/orgData';
import { meetingFitLabel } from '../lib/readiness';
import { useOrgData } from '../lib/demoStore';
import {
  classifyMeeting, meetingEconomics, recoverableOpportunity, assessUrgency, money,
} from '../lib/proxyEngine';
import { MeetingFitBadge } from '../components/Org';
import { MeetingClassBadge, UrgencyBadge } from '../components/Proxy';

interface Props {
  onOpenMeeting: (id: string) => void;
}

const STATUSES: Array<MeetingFitStatus | 'all'> = ['all', 'ready', 'decision_ready', 'async_recommended', 'at_risk', 'draft'];
const WEEK_MS = 7 * 86_400_000;

export default function MeetingFit({ onOpenMeeting }: Props) {
  const { rateCard } = useOrgData(); // subscribe for live economics
  const [status, setStatus] = useState<MeetingFitStatus | 'all'>('all');
  const cur = rateCard.currency;

  const ordered = [...ORG_MEETINGS].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  const filtered = ordered.filter((m) => {
    if (status === 'all') return true;
    return ORG_MEETING_FIT_BY_MEETING[m.id]?.status === status;
  });

  const atRisk = ordered.filter((m) => {
    const f = ORG_MEETING_FIT_BY_MEETING[m.id];
    return f && (f.status === 'at_risk' || f.status === 'draft');
  }).length;

  // "This week" totals across meetings starting within 7 days of now.
  const weekMeetings = ordered.filter((m) => {
    const t = new Date(m.startsAt).getTime();
    return t >= DEMO_NOW && t <= DEMO_NOW + WEEK_MS;
  });
  const weekCost = weekMeetings.reduce((s, m) => s + meetingEconomics(m).costEstimate, 0);
  const weekRecover = weekMeetings.reduce((s, m) => s + recoverableOpportunity(m).amount, 0);

  return (
    <>
      <div className="section-head" style={{ marginBottom: 6 }}>
        <span className="display" style={{ fontSize: 24 }}>Meeting Fit</span>
        <span className="section-meta">{ORG_MEETINGS.length} cross-org meetings · {atRisk} need attention</span>
      </div>
      <div className="section-desc">
        A cross-org meeting is ready when the required organizations are represented, inputs exist, a decision owner
        is present, and the format matches each org's norms. Each meeting now also carries a class, a cost estimate,
        and its recoverable opportunity.
      </div>

      {weekMeetings.length > 0 && (
        <div className="week-strip">
          <span>This week: <strong className="mono">{money(weekCost, cur)}</strong> across {weekMeetings.length} meeting{weekMeetings.length === 1 ? '' : 's'}</span>
          <span className="week-recover">· <strong className="mono">{money(weekRecover, cur)}</strong> recoverable</span>
        </div>
      )}

      <div className="filter-row">
        {STATUSES.map((s) => (
          <button key={s} className={`filter-chip ${status === s ? 'active' : ''}`} onClick={() => setStatus(s)}>
            {s === 'all' ? 'All' : meetingFitLabel(s as MeetingFitStatus)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? <div style={{ fontSize: 13, color: 'var(--muted)', padding: '24px 0' }}>No meetings match.</div> : (
        <div style={{ marginTop: 6 }}>
          {filtered.map((m) => {
            const fit = ORG_MEETING_FIT_BY_MEETING[m.id];
            const upcoming = new Date(m.startsAt).getTime() >= DEMO_NOW;
            const { cls } = classifyMeeting(m);
            const eco = meetingEconomics(m);
            const t = assessUrgency(m);
            const anyOverdue = [...t.agendaUrgency, ...t.inputUrgency].some((x) => x.urgency === 'overdue');
            const anyDue = [...t.agendaUrgency, ...t.inputUrgency].some((x) => x.urgency === 'due_this_week');
            const missing = fit?.requiredInputs.filter((i) => !i.received).length ?? 0;
            return (
              <div key={m.id} className="row-card" style={{ opacity: upcoming ? 1 : 0.72, cursor: 'pointer' }} onClick={() => onOpenMeeting(m.id)}>
                <div className="row-card-head">
                  <span className="row-card-title">{m.title}</span>
                  <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                    <MeetingClassBadge cls={cls} />
                    {fit && <MeetingFitBadge status={fit.status} />}
                    {anyOverdue ? <UrgencyBadge urgency="overdue" /> : anyDue ? <UrgencyBadge urgency="due_this_week" /> : null}
                  </span>
                </div>
                <div className="row-card-body">{m.agendaSummary}</div>
                <div className="row-card-foot">
                  <span className="row-card-meta">{m.participatingOrgIds.map(orgName).join(' ↔ ')}</span>
                  <span className="row-card-meta">{new Date(m.startsAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · {m.durationMinutes}m</span>
                  <span className="mono meeting-cost">{money(eco.costEstimate, cur)}</span>
                  <span className="mono meeting-recover">{money(eco.recoverableOpportunity, cur)} recoverable</span>
                  {missing > 0 && <span className="freshness fr-stale">{missing} input{missing === 1 ? '' : 's'} missing</span>}
                  {fit && !fit.decisionOwnerPresent && <span className="freshness fr-aging">no decision owner</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
