import { useState } from 'react';
import type { MeetingFitStatus } from '../lib/types';
import { ORG_MEETINGS, ORG_MEETING_FIT_BY_MEETING } from '../data/meetingFit';
import { orgName, DEMO_NOW } from '../lib/orgData';
import { meetingFitLabel } from '../lib/readiness';
import { MeetingFitCard } from '../components/Org';

interface Props {
  onOpenMeeting: (id: string) => void;
}

const STATUSES: Array<MeetingFitStatus | 'all'> = ['all', 'ready', 'decision_ready', 'async_recommended', 'at_risk', 'draft'];

export default function MeetingFit({ onOpenMeeting }: Props) {
  const [status, setStatus] = useState<MeetingFitStatus | 'all'>('all');

  const ordered = [...ORG_MEETINGS].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  const filtered = ordered.filter((m) => {
    if (status === 'all') return true;
    return ORG_MEETING_FIT_BY_MEETING[m.id]?.status === status;
  });

  const atRisk = ordered.filter((m) => {
    const f = ORG_MEETING_FIT_BY_MEETING[m.id];
    return f && (f.status === 'at_risk' || f.status === 'draft');
  }).length;

  return (
    <>
      <div className="section-head" style={{ marginBottom: 6 }}>
        <span className="display" style={{ fontSize: 24 }}>Meeting Fit</span>
        <span className="section-meta">{ORG_MEETINGS.length} cross-org meetings · {atRisk} need attention</span>
      </div>
      <div className="section-desc">
        A cross-org meeting is ready when the required organizations are represented, inputs exist, a decision owner
        is present, and the format matches each org's norms. Attendee context is one click away on every meeting.
      </div>

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
            const upcoming = new Date(m.startsAt).getTime() >= DEMO_NOW;
            return (
              <div key={m.id} style={{ opacity: upcoming ? 1 : 0.7 }}>
                <MeetingFitCard meeting={m} fit={ORG_MEETING_FIT_BY_MEETING[m.id]} orgNames={m.participatingOrgIds.map(orgName)} onOpen={onOpenMeeting} />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
