import type { Person } from '../lib/types';
import { CARD_SECTIONS } from '../data/cardSections';
import { PERSON_BY_ID, WORK_CARD_BY_PERSON, CARD_ANSWERS } from '../data/people';
import { TEAM_BY_ID } from '../data/teams';
import { FRESHNESS_SIGNALS } from '../data/orgInsights';
import { EARNED_BADGES } from '../data/badges';
import { cardReadiness, freshnessSummary, levelColor } from '../lib/readiness';
import { Avatar, Ring, ReadinessMeter, StatusPill, FreshnessBadge } from '../components/Shared';
import { IconArrowLeft } from '../components/Icons';

interface Props {
  user: Person;
  personId: string | null;
  onBack: () => void;
}

export default function PersonDetail({ user, personId, onBack }: Props) {
  const target = personId ? (personId === user.id ? user : PERSON_BY_ID[personId] ?? user) : user;
  const card = WORK_CARD_BY_PERSON[target.id];
  const summary = cardReadiness(card, CARD_ANSWERS);
  const freshness = FRESHNESS_SIGNALS.find((f) => f.subjectId === card?.id);
  const freshSummary = freshnessSummary(freshness);
  const team = TEAM_BY_ID[target.primaryTeamId];
  const badges = EARNED_BADGES.filter((b) => b.awardedTo === 'person' && b.awardedToId === target.id);

  const answerFor = (key: string) =>
    CARD_ANSWERS.find((a) => a.cardId === card?.id && a.sectionKey === key);

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
        <IconArrowLeft size={13} /> Back to People & Teams
      </button>

      <div className="section">
        <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 24, padding: 22 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <Avatar person={target} size={52} />
              <div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 500 }}>{target.name}</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>
                  {target.role} · {team?.name} · {target.location}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>
                  Working hours: {target.workingHours}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              <StatusPill level={summary.level}>{summary.label}</StatusPill>
              <FreshnessBadge signal={freshness} />
              {badges.map((b) => (
                <span key={b.id} className="badge-chip">
                  <span className="bc-dot" />
                  <span className="bc-label">{b.label}</span>
                </span>
              ))}
            </div>
            <ReadinessMeter summary={summary} showRationale />
            <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 8 }}>{freshSummary.rationale}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid var(--rule)', paddingLeft: 18 }}>
            <Ring value={summary.pct} max={100} size={120} stroke={6} color={levelColor(summary.level)} />
            <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 8, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Card readiness
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title">Sections</span>
          <span className="section-meta">How {target.name.split(' ')[0]} works</span>
        </div>
        <div className="card" style={{ padding: '4px 22px' }}>
          {CARD_SECTIONS.filter((s) => s.appliesTo.includes('work') && s.key !== 'visibility' && s.key !== 'freshness').map((s) => {
            const a = answerFor(s.key);
            const has = !!a?.body.trim();
            return (
              <div key={s.key} className="card-section-block">
                <div className="card-section-head">
                  <span className="card-section-label">{s.label}</span>
                </div>
                {has ? (
                  <div className="card-section-body">{a!.body}</div>
                ) : (
                  <div className="card-section-empty">Not yet answered.</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
