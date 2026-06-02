import type { Person } from '../lib/types';
import { computeScore, barColor } from '../lib/scoring';
import { QUESTIONS } from '../data/questions';
import { MEETINGS } from '../data/meetings';
import { TEAM } from '../data/people';
import { Avatar, Bar, Ring, StylePill, TierBadge } from '../components/Shared';
import { IconEdit, IconArrowRight } from '../components/Icons';

function getPerson(id: string, user: Person): Person | null {
  if (id === 'me') return user;
  return TEAM.find((t) => t.id === id) || null;
}

interface Props {
  user: Person;
  onEdit: () => void;
  onOpenMeeting: (id: string) => void;
}

export default function Dashboard({ user, onEdit, onOpenMeeting }: Props) {
  const sc = computeScore(user);
  const next = MEETINGS[0];
  const firstFour = QUESTIONS.slice(0, 4);

  return (
    <>
      <div className="section">
        <div className="section-head">
          <span className="section-title">Your Fieldguide card</span>
          <span className="section-meta">Updated {user.updatedDaysAgo} days ago · streak: {user.streak} weeks</span>
        </div>
        <div className="card hero">
          <div className="hero-main">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Avatar person={user} size={52} />
              <div>
                <div className="hero-name">{user.name}</div>
                <div className="hero-role">{user.role} · {user.location}</div>
              </div>
            </div>
            <div className="hero-badges">
              <StylePill styleKey={user.style} />
              <TierBadge tier={sc.tier} />
            </div>
            <div className="pillars">
              {firstFour.map((q) => {
                const a = user.answers[q.id];
                const shown = a ? a.split('.')[0] + (a.includes('.') ? '.' : '') : null;
                return (
                  <div key={q.id} className="pillar">
                    <div className="pillar-label">{q.short}</div>
                    <div className="pillar-value">
                      {shown ?? <span style={{ color: 'var(--subtle)', fontStyle: 'italic' }}>Not set</span>}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 14 }}>
              <button
                onClick={onEdit}
                style={{
                  background: 'transparent', border: 'none', padding: 0,
                  color: 'var(--accent)', fontWeight: 500, fontSize: 12.5,
                  cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'inherit',
                }}
              >
                <IconEdit size={13} />
                Edit your card
                <IconArrowRight size={13} />
              </button>
            </div>
          </div>
          <div className="hero-side">
            <Ring
              value={sc.pct}
              max={100}
              size={120}
              stroke={6}
              color={barColor(sc.pct)}
            />
            <div className="ring-sub" style={{ marginTop: 12 }}>
              {sc.answered} of {sc.total} questions<br />
              {sc.fresh ? 'Fresh · keep the streak' : 'Stale · refresh soon'}
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title" style={{ fontSize: 17 }}>How you're scored</span>
          <span className="section-meta">Four dimensions, weighted equally</span>
        </div>
        <div className="score-grid">
          {[
            { l: 'Completion', v: `${sc.pct}%`, s: `${sc.answered} of 8 questions`, line: barColor(sc.pct) },
            { l: 'Freshness',  v: sc.fresh ? 'Fresh' : 'Stale', s: `Updated ${user.updatedDaysAgo}d ago`, line: sc.fresh ? 'var(--success)' : 'var(--warning)' },
            { l: 'Depth',      v: sc.depth, s: `${sc.avg} words / answer`, line: sc.depth === 'High' ? 'var(--success)' : sc.depth === 'Medium' ? 'var(--warning)' : 'var(--danger)' },
            { l: 'Streak',     v: `${user.streak}w`, s: 'Quarterly refresh hit', line: 'var(--ink)' },
          ].map((it) => (
            <div key={it.l} className="score-card" style={{ '--accent-line': it.line } as React.CSSProperties}>
              <div className="score-card-label">{it.l}</div>
              <div className="score-card-value">{it.v}</div>
              <div className="score-card-sub">{it.s}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title" style={{ fontSize: 17 }}>Next meeting brief</span>
          <span className="section-meta">Auto-generated 15 min ahead</span>
        </div>
        <div
          className="card card-clickable"
          style={{ padding: '16px 18px' }}
          onClick={() => onOpenMeeting(next.id)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
            <div>
              <div className="display" style={{ fontSize: 16 }}>{next.title}</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>
                {next.when} · {next.duration}
              </div>
            </div>
            <div className="mtg-avs">
              {next.attendees.map((id) => {
                const p = getPerson(id, user);
                return p ? <Avatar key={id} person={p} size={24} /> : null;
              })}
            </div>
          </div>
          <div style={{ fontSize: 12.5, lineHeight: 1.6, marginBottom: 6 }}>{next.summary}</div>
          <span style={{ color: 'var(--accent)', fontWeight: 500, fontSize: 12 }}>Read full brief →</span>
        </div>
      </div>
    </>
  );
}
