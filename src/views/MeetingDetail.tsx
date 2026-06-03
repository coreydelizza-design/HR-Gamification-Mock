import type { Person } from '../lib/types';
import { MEETING_BY_ID, MEETING_ATTENDEES, FIT_BY_MEETING } from '../data/meetings';
import { TEAM_BY_ID, TEAM_CARD_BY_TEAM } from '../data/teams';
import { PERSON_BY_ID, WORK_CARD_BY_PERSON, CARD_ANSWERS } from '../data/people';
import { AGREEMENT_BY_ID } from '../data/agreements';
import { FRESHNESS_SIGNALS } from '../data/orgInsights';
import { meetingReadiness, cardReadiness, formatMeetingTime, levelColor } from '../lib/readiness';
import { Avatar, Ring, ReadinessMeter, StatusPill, FreshnessBadge } from '../components/Shared';
import { IconArrowLeft } from '../components/Icons';

interface Props {
  user: Person;
  meetingId: string | null;
  onBack: () => void;
  onOpenPerson: (id: string) => void;
}

export default function MeetingDetail({ user: _user, meetingId, onBack, onOpenPerson }: Props) {
  const meeting = meetingId ? MEETING_BY_ID[meetingId] : undefined;
  const brief = meeting ? FIT_BY_MEETING[meeting.id] : undefined;
  const attendees = meeting ? MEETING_ATTENDEES.filter((a) => a.meetingId === meeting.id) : [];
  const summary = meetingReadiness(brief, attendees);

  if (!meeting) {
    return (
      <div style={{ padding: 24 }}>
        <div className="display" style={{ fontSize: 20 }}>Meeting not found.</div>
        <button onClick={onBack} style={{ marginTop: 12, fontFamily: 'inherit' }}>← Back</button>
      </div>
    );
  }

  const decisionOwner = brief ? PERSON_BY_ID[brief.decisionOwnerPersonId] : undefined;

  return (
    <>
      <button
        onClick={onBack}
        style={{
          background: 'transparent', border: 'none', color: 'var(--muted)',
          fontSize: 12.5, cursor: 'pointer', padding: 0, marginBottom: 14,
          display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'inherit',
        }}
      >
        <IconArrowLeft size={13} /> Back to Meetings
      </button>

      <div className="section">
        <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 24, padding: 22 }}>
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 500, marginBottom: 4 }}>{meeting.title}</div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 10 }}>{formatMeetingTime(meeting)}</div>
            <div style={{ fontSize: 13.5, lineHeight: 1.65, marginBottom: 10 }}>{meeting.agendaSummary}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
              <strong style={{ color: 'var(--ink)', fontWeight: 500 }}>Decision requested: </strong>{meeting.decisionRequested}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <StatusPill level={summary.level}>{summary.label}</StatusPill>
              {brief && <span className="freshness fr-fresh">Fit brief generated</span>}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid var(--rule)', paddingLeft: 18 }}>
            <Ring value={summary.pct} max={100} size={120} stroke={6} color={levelColor(summary.level)} />
            <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 8, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Meeting readiness
            </div>
          </div>
        </div>
      </div>

      {brief && (
        <>
          <div className="section">
            <div className="section-head">
              <span className="section-title">Meeting Fit</span>
              <span className="section-meta">{summary.rationale}</span>
            </div>
            <div className="card" style={{ padding: 18 }}>
              <ReadinessMeter summary={summary} showRationale />
              <div className="fit-grid">
                <div className="fit-cell">
                  <div className="fit-cell-label">Attendee context</div>
                  <div className="fit-cell-body">{brief.attendeeContext}</div>
                </div>
                <div className="fit-cell">
                  <div className="fit-cell-label">Decision owner</div>
                  <div className="fit-cell-body">
                    {decisionOwner ? <>{decisionOwner.name} <span style={{ color: 'var(--muted)' }}>· {decisionOwner.role}</span></> : '—'}
                  </div>
                </div>
                <div className="fit-cell">
                  <div className="fit-cell-label">Required team inputs</div>
                  <div className="fit-cell-body">
                    <div className="fit-list">
                      {brief.requiredInputs.map((i) => {
                        const team = TEAM_BY_ID[i.teamId];
                        const tc = team ? TEAM_CARD_BY_TEAM[team.id] : undefined;
                        return (
                          <div key={i.teamId + i.input} className="fit-list-item" title={tc ? `${team!.name}: ${tc.mission}` : team?.name}>
                            <span className={i.received ? 'fit-check' : 'fit-cross'}>{i.received ? '✓' : '○'}</span>
                            <span>{i.input} <span style={{ color: 'var(--muted)' }}>— {team?.shortName ?? i.teamId}</span></span>
                            <span style={{ fontSize: 10.5, color: 'var(--muted)', fontFamily: "'JetBrains Mono', monospace" }}>{i.received ? 'in' : 'pending'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="fit-cell">
                  <div className="fit-cell-label">Agenda readiness</div>
                  <div className="fit-cell-body">
                    <strong style={{ fontWeight: 500 }}>{brief.agendaReadiness}</strong>
                    {brief.prepGaps.length > 0 && (
                      <ul style={{ margin: '8px 0 0', paddingLeft: 16, lineHeight: 1.55, color: 'var(--muted)' }}>
                        {brief.prepGaps.map((g) => <li key={g}>{g}</li>)}
                      </ul>
                    )}
                  </div>
                </div>
                {brief.governingAgreementId && (
                  <div className="fit-cell">
                    <div className="fit-cell-label">Governing agreement</div>
                    <div className="fit-cell-body">
                      {AGREEMENT_BY_ID[brief.governingAgreementId]?.title ?? '—'}
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
                        The handoff and escalation rules from this agreement apply to the meeting.
                      </div>
                    </div>
                  </div>
                )}
                {brief.asyncRecommendation && (
                  <div className="fit-cell">
                    <div className="fit-cell-label">Async recommendation</div>
                    <div className="fit-cell-body">{brief.asyncRecommendation}</div>
                  </div>
                )}
                <div className="fit-cell" style={{ gridColumn: '1 / -1' }}>
                  <div className="fit-cell-label">Suggested follow-up</div>
                  <div className="fit-cell-body">{brief.suggestedFollowUp}</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="section">
        <div className="section-head">
          <span className="section-title">Attendees</span>
          <span className="section-meta">{attendees.length} people</span>
        </div>
        <div className="card" style={{ padding: '6px 18px' }}>
          {attendees.map((a) => {
            const p = PERSON_BY_ID[a.personId];
            if (!p) return null;
            const wc = WORK_CARD_BY_PERSON[p.id];
            const cs = cardReadiness(wc, CARD_ANSWERS);
            const fs = FRESHNESS_SIGNALS.find((f) => f.subjectId === wc?.id);
            return (
              <div
                key={a.id}
                onClick={() => onOpenPerson(p.id)}
                style={{ display: 'grid', gridTemplateColumns: '36px 1fr auto auto auto', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--rule-soft)', cursor: 'pointer' }}
              >
                <Avatar person={p} size={32} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name} <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: 11.5 }}>· {a.role.replace('_', ' ')}</span></div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{p.role}</div>
                </div>
                <FreshnessBadge signal={fs} />
                <StatusPill level={cs.level}>{cs.label}</StatusPill>
                <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {a.preReadConfirmed ? '✓ pre-read' : '○ pre-read'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
