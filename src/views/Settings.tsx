import { GS_SECTIONS, GS_PRESETS } from '../data/gamification';
import type { GSSection } from '../lib/types';

interface Props {
  gs: Record<string, boolean>;
  setGs: (gs: Record<string, boolean>) => void;
}

const RISK_LABELS: Record<string, { label: string; cls: string }> = {
  low: { label: 'Low risk',    cls: 'risk-low' },
  med: { label: 'Team only',   cls: 'risk-med' },
  pro: { label: 'Cost or PTO', cls: 'risk-pro' },
};

const TAG_CLS = (tag: GSSection['tag']) =>
  tag === 'safe' ? 'gs-tag-safe' : tag === 'rec' ? 'gs-tag-rec' : 'gs-tag-careful';

const detectPreset = (gs: Record<string, boolean>): string | null => {
  for (const k of Object.keys(GS_PRESETS)) {
    const target = GS_PRESETS[k];
    let match = true;
    for (const sec of GS_SECTIONS) {
      for (const o of sec.opts) {
        const shouldBe = target.includes(o.id);
        if (!!gs[o.id] !== shouldBe) match = false;
      }
    }
    if (match) return k;
  }
  return null;
};

export default function Settings({ gs, setGs }: Props) {
  const applyPreset = (name: string) => {
    const target = GS_PRESETS[name];
    const next: Record<string, boolean> = {};
    for (const sec of GS_SECTIONS) {
      for (const o of sec.opts) next[o.id] = target.includes(o.id);
    }
    setGs(next);
  };

  const toggle = (id: string) => setGs({ ...gs, [id]: !gs[id] });

  const currentPreset = detectPreset(gs);
  let total = 0, on = 0;
  for (const sec of GS_SECTIONS) {
    for (const o of sec.opts) {
      total++;
      if (gs[o.id]) on++;
    }
  }

  const advice =
    on >= 16 ? 'Aggressive configuration — well-suited to early-stage / high-trust orgs. Not recommended for unionized workforces.'
    : on >= 11 ? 'Balanced default — appropriate for most mid-market and enterprise customers. Safe to roll out without legal review in most US jurisdictions.'
    : on >= 6 ? 'Conservative configuration — privacy-first, ideal for unionized workforces, EU operations, or regulated industries.'
    : on >= 1 ? 'Minimal — completion rates will likely lag. Consider enabling Personal momentum and Smart nudges at minimum.'
    : 'Nothing enabled. Completion will only happen via manager mandate.';

  return (
    <>
      <div style={{ marginBottom: 14 }}>
        <div className="display" style={{ fontSize: 24 }}>Gamification settings</div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>
          Org admin · configure motivation for your culture
        </div>
      </div>
      <div className="section-desc">
        <strong style={{ color: 'var(--ink)', fontWeight: 500 }}>Three principles:</strong> Lead with intrinsic. Team beats individual. Reward effort, not outcome.
      </div>

      <div className="preset-row">
        <span className="preset-label">Quick presets:</span>
        {(['conservative', 'balanced', 'aggressive', 'off'] as const).map((p) => {
          let label: string = p === 'off' ? 'All off' : (p.charAt(0).toUpperCase() + p.slice(1));
          if (p === 'balanced') label += ' (recommended)';
          return (
            <button
              key={p}
              className={`preset-btn ${currentPreset === p ? 'active' : ''}`}
              onClick={() => applyPreset(p)}
            >
              {label}
            </button>
          );
        })}
      </div>

      {GS_SECTIONS.map((sec) => {
        const enabledHere = sec.opts.filter((o) => gs[o.id]).length;
        return (
          <div key={sec.id} className="section">
            <div className="section-head">
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span className="section-title" style={{ fontSize: 17 }}>{sec.title}</span>
                <span className={`gs-section-tag ${TAG_CLS(sec.tag)}`}>{sec.tagLabel}</span>
              </div>
              <span className="section-meta">{enabledHere} of {sec.opts.length} on</span>
            </div>
            <div className="section-desc">{sec.desc}</div>
            {sec.opts.map((o) => {
              const isOn = !!gs[o.id];
              const risk = RISK_LABELS[o.risk];
              return (
                <div key={o.id} className="gs-row" onClick={() => toggle(o.id)}>
                  <div>
                    <div className="gs-row-name">{o.name}</div>
                    <div className="gs-row-desc">{o.desc}</div>
                  </div>
                  <span className={`gs-risk ${risk.cls}`}>{risk.label}</span>
                  <div className={`toggle ${isOn ? 'on' : ''}`} />
                </div>
              );
            })}
          </div>
        );
      })}

      <div className="gs-footnote">
        <span className="display" style={{ fontSize: 15 }}>
          {currentPreset ? currentPreset.charAt(0).toUpperCase() + currentPreset.slice(1) : 'Custom'}
        </span>
        {' '}·{' '}<strong>{on}</strong> of {total} enabled
        <br /><br />
        {advice}
      </div>
    </>
  );
}
