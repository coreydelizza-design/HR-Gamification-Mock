import { useState } from 'react';
import type { Person, StyleKey } from '../lib/types';
import { STYLES } from '../data/styles';
import { TEAM } from '../data/people';
import { QUESTIONS } from '../data/questions';
import { computeScore, barColor } from '../lib/scoring';
import { Avatar, Bar, StylePill, TierBadge } from '../components/Shared';

interface Props {
  user: Person;
  onOpenPerson: (id: string) => void;
}

type Filter = StyleKey | 'all';

export default function Team({ user, onOpenPerson }: Props) {
  const [filter, setFilter] = useState<Filter>('all');
  const all = [user, ...TEAM];
  const filtered = filter === 'all' ? all : all.filter((p) => p.style === filter);

  const filterOpts: Array<{ k: Filter; label: string }> = [
    { k: 'all', label: 'All' },
    ...Object.keys(STYLES).map((k) => ({ k: k as StyleKey, label: STYLES[k as StyleKey].label })),
  ];

  return (
    <>
      <div style={{ marginBottom: 14 }}>
        <div className="display" style={{ fontSize: 24 }}>Team directory</div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>
          {all.length} people across 6 teams
        </div>
      </div>

      <div className="filter-row">
        {filterOpts.map((o) => (
          <button
            key={o.k}
            className={`filter-chip ${filter === o.k ? 'active' : ''}`}
            onClick={() => setFilter(o.k)}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="team-grid">
        {filtered.map((p) => {
          const sc = computeScore(p);
          return (
            <div
              key={p.id}
              className="card card-clickable emp"
              onClick={() => onOpenPerson(p.id)}
            >
              <div className="emp-head">
                <Avatar person={p} size={38} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="emp-name">{p.name}{p.id === 'me' ? ' (you)' : ''}</div>
                  <div className="emp-role">{p.role} · {p.team}</div>
                </div>
              </div>
              <div style={{ marginBottom: 9 }}>
                <StylePill styleKey={p.style} />
              </div>
              {QUESTIONS.slice(0, 3).map((q) => {
                const a = p.answers[q.id];
                return (
                  <div key={q.id} className="emp-row">
                    <span className="emp-row-label">{q.short}</span>
                    <span className="emp-row-val">
                      {a ? a.split(/[,.]/)[0] : <span style={{ color: 'var(--subtle)', fontStyle: 'italic', fontWeight: 400 }}>Not set</span>}
                    </span>
                  </div>
                );
              })}
              <div className="emp-foot">
                <span style={{ fontWeight: 500 }}>{sc.pct}%</span>
                <div style={{ flex: 1 }}>
                  <Bar value={sc.pct} color={barColor(sc.pct)} height={4} />
                </div>
                <TierBadge tier={sc.tier} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
