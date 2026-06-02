import { ROADMAP } from '../data/roadmap';

const STATUS_LABEL = { done: 'Built', next: 'Up next', later: 'Later' } as const;

export default function Roadmap() {
  return (
    <>
      <div style={{ marginBottom: 18 }}>
        <div className="display" style={{ fontSize: 24 }}>Roadmap</div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>
          What&apos;s built, what&apos;s next, and where this product goes from here
        </div>
      </div>

      {ROADMAP.map((ph) => (
        <div key={ph.num} className="road-phase">
          <div className="road-phase-head">
            <div>
              <span className="road-phase-num">{ph.num}</span>
              <div className="road-phase-title">{ph.title}</div>
            </div>
            <span className={`road-phase-status status-${ph.status}`}>{STATUS_LABEL[ph.status]}</span>
          </div>
          <div className="road-phase-desc">{ph.desc}</div>
          <div className="road-list">
            {ph.items.map((it, i) => (
              <div key={i} className="road-item">
                <span className={it.d ? 'road-check' : 'road-todo'}>{it.d ? '✓' : '○'}</span>
                <span style={{ color: it.d ? 'var(--ink)' : 'var(--muted)' }}>{it.t}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="road-cta">
        <div className="road-cta-eyebrow">This repo</div>
        <div className="road-cta-title">Phase 1 — shipped as a Vite + React + TypeScript build</div>
        <div className="road-cta-body">
          Everything in Phase 1 is in this repository. Data lives in{' '}
          <code>src/data/</code> (people, friction, gamification, roadmap). Views in{' '}
          <code>src/views/</code>. The next move is Phase 2 — wiring this UI to Supabase for persistence, then layering on the Slack and Calendar integrations.
        </div>
      </div>
    </>
  );
}
