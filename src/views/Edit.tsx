import { useState } from 'react';
import type { Person } from '../lib/types';
import { QUESTIONS } from '../data/questions';
import { computeScore, barColor } from '../lib/scoring';
import { Bar, TierBadge } from '../components/Shared';
import { IconCheck, IconChevDown } from '../components/Icons';

interface Props {
  user: Person;
  setUser: (u: Person) => void;
  onDone: () => void;
}

const TIER_TITLE = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

export default function Edit({ user, setUser, onDone }: Props) {
  const sc = computeScore(user);
  const [activeQ, setActiveQ] = useState<string | null>('reach');

  const update = (id: string, value: string) => {
    setUser({ ...user, answers: { ...user.answers, [id]: value }, updatedDaysAgo: 0 });
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div className="display" style={{ fontSize: 24 }}>Edit your card</div>
          <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>
            Eight questions. Short answers in your own words.
          </div>
        </div>
        <button className="btn btn-primary" onClick={onDone}>
          <IconCheck size={13} /> Done
        </button>
      </div>

      <div className="edit-strip">
        <div>
          <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500, marginBottom: 3 }}>
            Completion
          </div>
          <div className="display" style={{ fontSize: 22 }}>{sc.pct}%</div>
        </div>
        <div style={{ flex: 1 }}>
          <Bar value={sc.pct} color={barColor(sc.pct)} height={5} />
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 5 }}>
            {sc.answered} of {sc.total} answered · current tier:{' '}
            <strong style={{ color: 'var(--ink)', fontWeight: 500 }}>{TIER_TITLE(sc.tier)}</strong>
          </div>
        </div>
        <TierBadge tier={sc.tier} />
      </div>

      {QUESTIONS.map((q, i) => {
        const v = user.answers[q.id] || '';
        const active = activeQ === q.id;
        const ansd = v.trim().length > 0;
        const wc = v.split(/\s+/).filter((w) => w.length > 0).length;
        const depth = wc >= 12 ? 'High' : wc >= 7 ? 'Medium' : 'Low';

        return (
          <div key={q.id} className={`q-item ${active ? 'active' : ''}`}>
            <button className="q-head" onClick={() => setActiveQ(active ? null : q.id)}>
              <span className="q-num">{(i < 9 ? '0' : '') + (i + 1)}</span>
              <div style={{ minWidth: 0 }}>
                <div className="q-text">{q.q}</div>
                {!active && ansd && <div className="q-preview">{v}</div>}
              </div>
              <span className={`q-state ${ansd ? 'q-done' : 'q-empty'}`}>
                {ansd ? 'Answered' : 'Empty'}
              </span>
              <span style={{ color: 'var(--subtle)', display: 'inline-flex', transform: active ? 'rotate(180deg)' : undefined, transition: 'transform 150ms' }}>
                <IconChevDown size={14} />
              </span>
            </button>
            {active && (
              <div className="q-body">
                <textarea
                  rows={3}
                  value={v}
                  onChange={(e) => update(q.id, e.target.value)}
                  placeholder="Write a sentence or two in your own words…"
                />
                <div className="q-meta">
                  <span>{wc} words</span>
                  <span>Depth: {depth}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
