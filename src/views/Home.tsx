import type { Person, ViewKey } from '../lib/types';
import { ME, PERSON_BY_ID, WORK_CARD_BY_PERSON, CARD_ANSWERS } from '../data/people';
import { MEETINGS, MEETING_ATTENDEES, FIT_BY_MEETING } from '../data/meetings';
import { WORKING_AGREEMENTS, AGREEMENT_SECTIONS } from '../data/agreements';
import { FRESHNESS_SIGNALS, NUDGES } from '../data/orgInsights';
import { TEAM_BY_ID, TEAM_CARD_BY_TEAM } from '../data/teams';
import {
  cardReadiness, freshnessSummary, meetingReadiness, handoffReadiness, levelColor,
  formatMeetingTime,
} from '../lib/readiness';
import { Avatar, Ring, ReadinessMeter, StatusPill, FreshnessBadge } from '../components/Shared';

interface Props {
  user: Person;
  onNavigate: (v: ViewKey) => void;
  onOpenMeeting: (id: string) => void;
  onOpenPerson: (id: string) => void;
  onOpenTeam: (id: string) => void;
  onOpenAgreement: (id: string) => void;
}

export default function Home({ user, onNavigate, onOpenMeeting, onOpenPerson, onOpenTeam, onOpenAgreement }: Props) {
  const card = WORK_CARD_BY_PERSON[user.id];
  const cardSummary = cardReadiness(card, CARD_ANSWERS);
  const freshness = FRESHNESS_SIGNALS.find((f) => f.subjectId === card?.id);
  const freshSummary = freshnessSummary(freshness);

  // Next meeting (earliest in the future relative to demo "now")
  const NOW = new Date('2026-06-02T13:00:00Z').getTime();
  const upcoming = [...MEETINGS]
    .filter((m) => new Date(m.startsAt).getTime() >= NOW)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  const next = upcoming[0];
  const nextBrief = next ? FIT_BY_MEETING[next.id] : undefined;
  const nextAtt = next ? MEETING_ATTENDEES.filter((a) => a.meetingId === next.id) : [];
  const nextSummary = meetingReadiness(nextBrief, nextAtt);

  // People to review: attendees of the next meeting other than me
  const peopleToReview = next
    ? nextAtt.map((a) => PERSON_BY_ID[a.personId]).filter((p) => p && p.id !== user.id)
    : [];

  // Teams relevant to upcoming work: the required-team-ids of the next meeting
  const teamsToReview = next ? next.requiredTeamIds.map((tid) => TEAM_BY_ID[tid]).filter(Boolean) : [];

  // Stale nudges relevant to me (audience = person && audienceId = me) and any I should know about as a leader
  const myNudges = NUDGES.filter((n) => n.audience === 'person' && n.audienceId === user.id);
  const orgNudges = NUDGES.filter((n) => n.audience !== 'person').slice(0, 3);

  // Suggested collaboration actions: surface any draft or in-review agreements
  const agreementSuggestions = WORKING_AGREEMENTS
    .filter((a) => a.status === 'draft' || a.status === 'review')
    .slice(0, 3);

  return (
    <>
      <div style={{ marginBottom: 18 }}>
        <div className="display" style={{ fontSize: 24 }}>Good morning, {user.name.split(' ')[0]}.</div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>
          Here is what to know to work well today — your card readiness, the next meeting, the people and teams you will engage, and where collaboration could be tighter.
        </div>
      </div>

      <div className="home-grid">
        {/* My card readiness */}
        <div className="home-card">
          <div className="home-card-head">
            <div>
              <div className="home-card-title">My card readiness</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>{cardSummary.rationale}</div>
            </div>
            <span className="home-card-meta">{freshSummary.label}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <Ring value={cardSummary.pct} max={100} size={96} stroke={6} color={levelColor(cardSummary.level)} />
            <div style={{ flex: 1 }}>
              <ReadinessMeter summary={cardSummary} />
              <div style={{ marginTop: 10 }}>
                <FreshnessBadge signal={freshness} />
              </div>
              <button
                onClick={() => onNavigate('mycard')}
                style={{
                  marginTop: 12, background: 'transparent', border: 'none', padding: 0,
                  color: 'var(--accent)', fontWeight: 500, fontSize: 12.5,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >Open my Fieldguide →</button>
            </div>
          </div>
        </div>

        {/* Next meeting readiness */}
        <div className="home-card">
          <div className="home-card-head">
            <div>
              <div className="home-card-title">Next meeting</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>{next ? formatMeetingTime(next) : 'No upcoming meeting'}</div>
            </div>
            {nextBrief && <StatusPill level={nextSummary.level}>{nextSummary.label}</StatusPill>}
          </div>
          {next ? (
            <>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{next.title}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.55, marginBottom: 10 }}>{next.agendaSummary}</div>
              <ReadinessMeter summary={nextSummary} showRationale />
              <button
                onClick={() => onOpenMeeting(next.id)}
                style={{
                  marginTop: 12, background: 'transparent', border: 'none', padding: 0,
                  color: 'var(--accent)', fontWeight: 500, fontSize: 12.5,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >Open meeting fit brief →</button>
            </>
          ) : (
            <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>You are clear today.</div>
          )}
        </div>
      </div>

      <div className="home-grid">
        {/* People cards to review */}
        <div className="home-card">
          <div className="home-card-head">
            <div className="home-card-title">People to review before today’s meeting</div>
            <span className="home-card-meta">{peopleToReview.length} cards</span>
          </div>
          <div className="home-list">
            {peopleToReview.length === 0 && (
              <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>No prep needed — you are working solo.</div>
            )}
            {peopleToReview.map((p) => {
              const wc = WORK_CARD_BY_PERSON[p.id];
              const sig = FRESHNESS_SIGNALS.find((f) => f.subjectId === wc?.id);
              return (
                <div key={p.id} className="home-list-item" onClick={() => onOpenPerson(p.id)} style={{ cursor: 'pointer' }}>
                  <Avatar person={p} size={36} />
                  <div>
                    <div className="hli-title">{p.name}</div>
                    <div className="hli-sub">{p.role} · {TEAM_BY_ID[p.primaryTeamId]?.name}</div>
                  </div>
                  <FreshnessBadge signal={sig} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Team cards to review */}
        <div className="home-card">
          <div className="home-card-head">
            <div className="home-card-title">Team cards relevant to upcoming work</div>
            <span className="home-card-meta">{teamsToReview.length} teams</span>
          </div>
          <div className="home-list">
            {teamsToReview.length === 0 && (
              <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>No team-card prep needed.</div>
            )}
            {teamsToReview.map((t) => {
              const tc = TEAM_CARD_BY_TEAM[t.id];
              return (
                <div key={t.id} className="home-list-item" onClick={() => onOpenTeam(t.id)} style={{ cursor: 'pointer' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: 'var(--surface-soft)', border: '1px solid var(--rule)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--ink)',
                  }}>{t.shortName.slice(0, 2).toUpperCase()}</div>
                  <div>
                    <div className="hli-title">{t.name}</div>
                    <div className="hli-sub">{tc ? tc.mission : 'Team card not yet published.'}</div>
                  </div>
                  <span className="hli-action">{tc ? 'View →' : 'Draft'}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="home-grid">
        {/* Stale card nudges (mine) */}
        <div className="home-card">
          <div className="home-card-head">
            <div className="home-card-title">Stale card nudges</div>
            <span className="home-card-meta">{myNudges.length} for you</span>
          </div>
          {myNudges.length === 0 ? (
            <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>No personal nudges open. Nice cadence.</div>
          ) : (
            <div className="home-list">
              {myNudges.map((n) => (
                <div key={n.id} className="home-list-item" onClick={() => onNavigate('mycard')} style={{ cursor: 'pointer' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--warning-soft)', color: 'var(--warning-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>○</div>
                  <div>
                    <div className="hli-title">{n.kind === 'stale_card' ? 'Stale card' : 'Refresh before meeting'}</div>
                    <div className="hli-sub">{n.message}</div>
                  </div>
                  <span className="hli-action">Open →</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Suggested collaboration actions */}
        <div className="home-card">
          <div className="home-card-head">
            <div className="home-card-title">Suggested collaboration actions</div>
            <span className="home-card-meta">{agreementSuggestions.length + orgNudges.length} suggestions</span>
          </div>
          <div className="home-list">
            {agreementSuggestions.map((a) => {
              const handoff = handoffReadiness(a, AGREEMENT_SECTIONS);
              return (
                <div key={a.id} className="home-list-item" onClick={() => onOpenAgreement(a.id)} style={{ cursor: 'pointer' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--surface-soft)', border: '1px solid var(--rule)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textTransform: 'uppercase' }}>{a.status}</div>
                  <div>
                    <div className="hli-title">{a.title}</div>
                    <div className="hli-sub">{handoff.rationale}</div>
                  </div>
                  <StatusPill level={handoff.level}>{handoff.label}</StatusPill>
                </div>
              );
            })}
            {orgNudges.map((n) => (
              <div key={n.id} className="home-list-item" style={{ cursor: 'default' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--surface-soft)', border: '1px solid var(--rule)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>•</div>
                <div>
                  <div className="hli-title">{n.kind.replace(/_/g, ' ')}</div>
                  <div className="hli-sub">{n.message}</div>
                </div>
                <span className="hli-action">Advisory</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// Avoid an unused-import warning when ME is not actively referenced in this view.
void ME;
