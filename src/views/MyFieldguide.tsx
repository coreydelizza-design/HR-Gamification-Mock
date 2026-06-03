import { useState } from 'react';
import type { Person, ViewKey, VisibilityScope } from '../lib/types';
import { CARD_SECTIONS } from '../data/cardSections';
import { WORK_CARD_BY_PERSON, CARD_ANSWERS } from '../data/people';
import { TEAM_BY_ID } from '../data/teams';
import { FRESHNESS_SIGNALS } from '../data/orgInsights';
import { EARNED_BADGES } from '../data/badges';
import { cardReadiness, freshnessSummary, levelColor } from '../lib/readiness';
import { Avatar, Ring, ReadinessMeter, StatusPill, FreshnessBadge } from '../components/Shared';

interface Props {
  user: Person;
  onNavigate: (v: ViewKey) => void;
}

type PreviewAs = 'me' | 'teammate' | 'partner' | 'manager';

const PREVIEW_OPTIONS: Array<{ k: PreviewAs; label: string; scope: VisibilityScope[] }> = [
  { k: 'me',       label: 'Just me',          scope: ['private', 'team', 'partners', 'org'] },
  { k: 'manager',  label: 'My manager',       scope: ['team', 'partners', 'org'] },
  { k: 'teammate', label: 'A teammate',       scope: ['team', 'partners', 'org'] },
  { k: 'partner',  label: 'A partner team',   scope: ['partners', 'org'] },
];

function visibilityLabel(s: VisibilityScope): string {
  switch (s) {
    case 'private':  return 'Private';
    case 'team':     return 'Team';
    case 'partners': return 'Partner teams';
    case 'org':      return 'Org';
  }
}

export default function MyFieldguide({ user, onNavigate: _onNavigate }: Props) {
  const [previewAs, setPreviewAs] = useState<PreviewAs>('me');
  const previewScopes = PREVIEW_OPTIONS.find((p) => p.k === previewAs)!.scope;

  const card = WORK_CARD_BY_PERSON[user.id];
  const summary = cardReadiness(card, CARD_ANSWERS);
  const freshness = FRESHNESS_SIGNALS.find((f) => f.subjectId === card?.id);
  const freshSummary = freshnessSummary(freshness);
  const team = TEAM_BY_ID[user.primaryTeamId];

  const answerFor = (key: string) =>
    CARD_ANSWERS.find((a) => a.cardId === card?.id && a.sectionKey === key);

  const myBadges = EARNED_BADGES.filter((b) => b.awardedTo === 'person' && b.awardedToId === user.id);

  return (
    <>
      <div style={{ marginBottom: 18 }}>
        <div className="display" style={{ fontSize: 24 }}>My Fieldguide</div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>
          The operating manual for how you work. Visible to {visibilityLabel(card?.visibility ?? 'org').toLowerCase()} by default.
        </div>
      </div>

      <div className="section">
        <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 24, padding: 22 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <Avatar person={user} size={52} />
              <div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 500 }}>{user.name}</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>
                  {user.role} · {team?.name} · {user.location}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>
                  Working hours: {user.workingHours}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
              <StatusPill level={summary.level}>{summary.label}</StatusPill>
              <FreshnessBadge signal={freshness} />
              {myBadges.map((b) => (
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
          <span className="section-title">Preview</span>
          <span className="section-meta">See your Fieldguide the way others do</span>
        </div>
        <div className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>Preview as:</span>
          {PREVIEW_OPTIONS.map((p) => (
            <button
              key={p.k}
              className={`filter-chip ${previewAs === p.k ? 'active' : ''}`}
              onClick={() => setPreviewAs(p.k)}
            >{p.label}</button>
          ))}
          <span style={{ fontSize: 11.5, color: 'var(--muted)', marginLeft: 'auto' }}>
            Sections outside this scope are hidden in the preview, not deleted.
          </span>
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title">Sections</span>
          <span className="section-meta">{CARD_SECTIONS.filter((s) => s.appliesTo.includes('work')).length} sections</span>
        </div>
        <div className="card" style={{ padding: '4px 22px' }}>
          {CARD_SECTIONS.filter((s) => s.appliesTo.includes('work')).map((s) => {
            const a = answerFor(s.key);
            const has = !!a?.body.trim();
            const days = a ? Math.max(0, Math.round((Date.now() - new Date(a.lastUpdatedAt).getTime()) / 86_400_000)) : null;
            const visibility: VisibilityScope = a?.visibility ?? card?.visibility ?? 'org';
            const inScope = previewScopes.includes(visibility);

            // Meta sections handle themselves
            if (s.key === 'visibility') {
              return (
                <div key={s.key} className="card-section-block">
                  <div className="card-section-head">
                    <span className="card-section-label">{s.label}</span>
                    <span className="card-section-meta">Default: {card?.visibility ?? 'org'}</span>
                  </div>
                  <div className="card-section-body" style={{ color: 'var(--muted)' }}>
                    This card defaults to <strong style={{ color: 'var(--ink)', fontWeight: 500 }}>{visibilityLabel(card?.visibility ?? 'org').toLowerCase()}</strong>. Individual sections can be scoped tighter.
                  </div>
                </div>
              );
            }
            if (s.key === 'freshness') {
              return (
                <div key={s.key} className="card-section-block">
                  <div className="card-section-head">
                    <span className="card-section-label">{s.label}</span>
                    <span className="card-section-meta">Last reviewed {freshness?.daysSinceUpdate ?? '—'}d ago</span>
                  </div>
                  <div className="card-section-body" style={{ color: 'var(--muted)' }}>
                    {freshSummary.rationale}
                  </div>
                </div>
              );
            }

            return (
              <div key={s.key} className="card-section-block">
                <div className="card-section-head">
                  <span className="card-section-label">
                    {s.label}
                    {s.required && <span style={{ color: 'var(--muted)', marginLeft: 6, fontWeight: 400 }}> · required</span>}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className={`freshness ${visibility === 'private' ? 'fr-stale' : visibility === 'team' ? 'fr-aging' : 'fr-fresh'}`}>
                      {visibilityLabel(visibility)}
                    </span>
                    <span className="card-section-meta">{has ? `Updated ${days}d ago` : 'Not yet answered'}</span>
                  </span>
                </div>
                {previewAs !== 'me' && !inScope ? (
                  <div className="card-section-empty">
                    Hidden in this preview — only visible at scope: {visibilityLabel(visibility)}.
                  </div>
                ) : has ? (
                  <div className="card-section-body">{a!.body}</div>
                ) : (
                  <div className="card-section-empty">
                    {s.prompt} <span style={{ color: 'var(--subtle)' }}>— {s.helpText}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
