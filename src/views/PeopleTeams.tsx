import { useState } from 'react';
import type { Person } from '../lib/types';
import { PEOPLE, WORK_CARD_BY_PERSON, CARD_ANSWERS } from '../data/people';
import { TEAMS, TEAM_BY_ID, TEAM_CARDS, TEAM_CARD_ANSWERS } from '../data/teams';
import { FRESHNESS_SIGNALS } from '../data/orgInsights';
import { cardReadiness, teamReadiness, freshnessSummary, levelColor } from '../lib/readiness';
import { Avatar, ReadinessMeter, StatusPill, FreshnessBadge, Bar } from '../components/Shared';

interface Props {
  user: Person;
  onOpenPerson: (id: string) => void;
  onOpenTeam: (id: string) => void;
}

type Tab = 'people' | 'teams';

export default function PeopleTeams({ user: _user, onOpenPerson, onOpenTeam }: Props) {
  const [tab, setTab] = useState<Tab>('people');

  return (
    <>
      <div style={{ marginBottom: 14 }}>
        <div className="display" style={{ fontSize: 24 }}>People & Teams</div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>
          Explore people cards and team cards. Click any row to read the card and prepare for collaboration.
        </div>
      </div>

      <div className="tab-strip">
        <button className={tab === 'people' ? 'active' : ''} onClick={() => setTab('people')}>People ({PEOPLE.length})</button>
        <button className={tab === 'teams'  ? 'active' : ''} onClick={() => setTab('teams')}>Teams ({TEAMS.length})</button>
      </div>

      {tab === 'people' && (
        <div>
          {PEOPLE.map((p) => {
            const wc = WORK_CARD_BY_PERSON[p.id];
            const summary = cardReadiness(wc, CARD_ANSWERS);
            const fresh = FRESHNESS_SIGNALS.find((f) => f.subjectId === wc?.id);
            const team = TEAM_BY_ID[p.primaryTeamId];
            return (
              <div key={p.id} className="row-card" onClick={() => onOpenPerson(p.id)}>
                <div className="row-card-head">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar person={p} size={36} />
                    <div>
                      <div className="row-card-title">{p.name}</div>
                      <div className="row-card-meta">{p.role} · {team?.name}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <FreshnessBadge signal={fresh} />
                    <StatusPill level={summary.level}>{summary.label}</StatusPill>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 14, alignItems: 'center' }}>
                  <div className="row-card-body">{summary.rationale}</div>
                  <div style={{ width: 220 }}>
                    <Bar value={summary.pct} color={levelColor(summary.level)} height={6} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'teams' && (
        <div>
          {TEAMS.map((t) => {
            const tc = TEAM_CARDS.find((c) => c.teamId === t.id);
            const summary = teamReadiness(tc, TEAM_CARD_ANSWERS);
            const fresh = freshnessSummary(undefined);
            void fresh;
            const memberCount = PEOPLE.filter((p) => p.primaryTeamId === t.id).length;
            return (
              <div key={t.id} className="row-card" onClick={() => onOpenTeam(t.id)}>
                <div className="row-card-head">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: 'var(--surface-soft)', border: '1px solid var(--rule)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--ink)',
                    }}>{t.shortName.slice(0, 2).toUpperCase()}</div>
                    <div>
                      <div className="row-card-title">{t.name}</div>
                      <div className="row-card-meta">{t.function} · {memberCount} members</div>
                    </div>
                  </div>
                  <StatusPill level={summary.level}>{summary.label}</StatusPill>
                </div>
                <div className="row-card-body">
                  {tc ? tc.mission : 'Team card not yet drafted.'}
                </div>
                <div className="row-card-foot">
                  {tc && tc.weOwn.slice(0, 3).map((o) => (
                    <span key={o} className="badge-chip">
                      <span className="bc-label" style={{ color: 'var(--muted)', fontWeight: 400 }}>Owns:</span>
                      <span className="bc-label">{o}</span>
                    </span>
                  ))}
                </div>
                <div style={{ marginTop: 8 }}>
                  <ReadinessMeter summary={summary} compact />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
