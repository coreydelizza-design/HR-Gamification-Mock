import type { Person } from '../lib/types';
import { MEETINGS, MEETING_ATTENDEES, FIT_BY_MEETING } from '../data/meetings';
import { TEAM_BY_ID } from '../data/teams';
import { PERSON_BY_ID } from '../data/people';
import { meetingReadiness, formatMeetingTime } from '../lib/readiness';
import { ReadinessMeter, StatusPill, Avatar } from '../components/Shared';

interface Props {
  user: Person;
  onOpenMeeting: (id: string) => void;
}

export default function Meetings({ user: _user, onOpenMeeting }: Props) {
  return (
    <>
      <div style={{ marginBottom: 14 }}>
        <div className="display" style={{ fontSize: 24 }}>Meetings</div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>
          Meeting fit and readiness for everything on your calendar. Click a meeting to open its brief.
        </div>
      </div>

      <div>
        {MEETINGS.map((m) => {
          const brief = FIT_BY_MEETING[m.id];
          const att = MEETING_ATTENDEES.filter((a) => a.meetingId === m.id);
          const owner = PERSON_BY_ID[m.ownerPersonId];
          const summary = meetingReadiness(brief, att);
          return (
            <div key={m.id} className="row-card" onClick={() => onOpenMeeting(m.id)}>
              <div className="row-card-head">
                <div>
                  <div className="row-card-title">{m.title}</div>
                  <div className="row-card-meta">{formatMeetingTime(m)} · facilitator {owner?.name ?? '—'}</div>
                </div>
                <StatusPill level={summary.level}>{summary.label}</StatusPill>
              </div>
              <div className="row-card-body">{m.agendaSummary}</div>
              <div className="row-card-foot">
                <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>Required teams:</span>
                {m.requiredTeamIds.map((tid) => (
                  <span key={tid} className="badge-chip">
                    <span className="bc-label">{TEAM_BY_ID[tid]?.shortName ?? tid}</span>
                  </span>
                ))}
              </div>
              <div className="row-card-foot">
                <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>Attendees:</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  {att.map((a) => {
                    const p = PERSON_BY_ID[a.personId];
                    return p ? <Avatar key={a.id} person={p} size={22} /> : null;
                  })}
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <ReadinessMeter summary={summary} compact />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
