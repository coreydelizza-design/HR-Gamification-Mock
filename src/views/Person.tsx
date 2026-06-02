import type { Person } from '../lib/types';
import { STYLES } from '../data/styles';
import { TEAM } from '../data/people';
import { QUESTIONS } from '../data/questions';
import { COMPAT } from '../data/compat';
import { computeScore } from '../lib/scoring';
import { Avatar, StylePill, TierBadge } from '../components/Shared';
import { IconArrowLeft } from '../components/Icons';

function getPerson(id: string, user: Person): Person | null {
  if (id === 'me') return user;
  return TEAM.find((t) => t.id === id) || null;
}

interface Props {
  user: Person;
  personId: string | null;
  onBack: () => void;
}

export default function PersonView({ user, personId, onBack }: Props) {
  const p = personId ? getPerson(personId, user) : null;
  if (!p) return <div style={{ padding: '2rem', color: 'var(--muted)' }}>Person not found</div>;

  const s = STYLES[p.style];
  const sc = computeScore(p);
  const compat = p.id !== 'me' ? COMPAT[p.id] : null;

  // Energy color palette per style — references CSS variables so light/dark mode swap automatically
  const energyColors: [string, string, string] =
    p.style === 'analyzer' ? ['var(--rule)', 'var(--analyzer-mid)', 'var(--analyzer)']
    : p.style === 'connector' ? ['var(--rule)', 'var(--connector-mid)', 'var(--connector)']
    : p.style === 'visionary' ? ['var(--rule)', 'var(--visionary-mid)', 'var(--visionary)']
    : ['var(--rule)', 'var(--driver-mid)', 'var(--driver)'];

  return (
    <>
      <button className="back-link" onClick={onBack}>
        <IconArrowLeft size={14} /> Back to team
      </button>

      <div className="card person-hero" style={{ marginBottom: 16 }}>
        <div className="person-band" style={{ background: s.band }} />
        <div className="person-inner">
          <div className="person-top">
            <Avatar person={p} size={64} />
            <div style={{ flex: 1 }}>
              <div className="person-eyebrow">How to work with</div>
              <div className="person-name">{p.name}</div>
              <div className="person-role-line">{p.role} · {p.team} · {p.location}</div>
              <div className="person-style"><StylePill styleKey={p.style} /></div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="display" style={{ fontSize: 24 }}>{sc.pct}%</div>
              <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>Complete</div>
            </div>
          </div>
          <div className="person-style-desc">{p.styleDesc}</div>
        </div>
      </div>

      <div className="basics">
        {(['channel', 'hours', 'response'] as const).map((k) => {
          const labels = { channel: 'Best channel', hours: 'Core hours', response: 'Response time' };
          const subKey = `${k}Sub` as const;
          return (
            <div key={k} className="basic">
              <div className="basic-label">{labels[k]}</div>
              <div className="basic-value">
                {p.basics[k]}
                {p.basics[subKey] && <div className="basic-sub">{p.basics[subKey]}</div>}
              </div>
            </div>
          );
        })}
      </div>

      {(p.doList.length > 0 || p.dontList.length > 0) && (
        <div className="dodont">
          <div className="dd-card dd-do">
            <div className="dd-head">✓ This works</div>
            {p.doList.map((t, i) => (
              <div key={i} className="dd-item"><span className="dd-mark">→</span><span>{t}</span></div>
            ))}
            {p.doList.length === 0 && (
              <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>Not yet specified</div>
            )}
          </div>
          <div className="dd-card dd-dont">
            <div className="dd-head">✗ This grates</div>
            {p.dontList.map((t, i) => (
              <div key={i} className="dd-item"><span className="dd-mark">×</span><span>{t}</span></div>
            ))}
            {p.dontList.length === 0 && (
              <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>Not yet specified</div>
            )}
          </div>
        </div>
      )}

      <div className="card energy">
        <div className="energy-head">When to catch {p.name.split(' ')[0]}</div>
        <div className="energy-sub">Energy across a typical workday</div>
        <div className="energy-track">
          {p.energyTrack.map((lvl, i) => (
            <div key={i} className="energy-block" style={{ background: energyColors[lvl] }} />
          ))}
        </div>
        <div className="energy-hours">
          <span>6a</span><span>9a</span><span>12p</span><span>3p</span><span>6p</span>
        </div>
        <div className="energy-legend">
          <span className="energy-key"><span className="energy-swatch" style={{ background: energyColors[2] }} />Peak focus</span>
          <span className="energy-key"><span className="energy-swatch" style={{ background: energyColors[1] }} />Good for collab</span>
          <span className="energy-key"><span className="energy-swatch" style={{ background: energyColors[0] }} />Low — avoid</span>
        </div>
      </div>

      <div className="section-label">In {p.name.split(' ')[0]}&apos;s own words</div>
      <div className="qa-list">
        {QUESTIONS.map((q, i) => {
          const a = p.answers[q.id];
          return (
            <div key={q.id} className="qa-item">
              <div className="qa-q">
                <span className="qa-num">{(i < 9 ? '0' : '') + (i + 1)}</span>
                <span>{q.q}</span>
              </div>
              <div className={`qa-a ${!a ? 'empty' : ''}`}>{a || 'Not yet answered'}</div>
            </div>
          );
        })}
      </div>

      {compat && (
        <div className="compat">
          <div className="compat-eyebrow">How you two work together</div>
          <div className="compat-pair">
            <Avatar person={user} size={36} />
            <span className="compat-vs">you (Alex)</span>
            <Avatar person={p} size={36} />
            <span className="compat-vs">{p.name.split(' ')[0]}</span>
            <div className="compat-score">
              <div className="compat-score-num">{compat.score}</div>
              <div className="compat-score-label">{compat.label} · /100</div>
            </div>
          </div>
          <div className="compat-body" dangerouslySetInnerHTML={{ __html: compat.body }} />
          <div className="compat-tips">
            {compat.tips.map((t, i) => (
              <div key={i} className="compat-tip"><span className="compat-tip-mark">→</span><span>{t}</span></div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
