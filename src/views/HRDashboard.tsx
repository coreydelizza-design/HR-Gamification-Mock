import { useState } from 'react';
import {
  KPIS, TREND, TEAMS_LB, STYLE_DIST, FRICTION, FRICTION_TEAMS,
  FRICTION_DETAIL, NUDGES_DATA, INSIGHTS_DATA,
} from '../data/hr';
import { STYLES } from '../data/styles';
import {
  barColor, frictionColor, frictionTextColor, frictionLabel, frictionPillCss,
} from '../lib/scoring';
import { Bar } from '../components/Shared';
import type { Nudge, StyleKey } from '../lib/types';

function TrendSVG() {
  const W = 720, H = 170, padL = 8, padR = 8, padT = 14, padB = 24;
  const n = TREND.quarters.length;
  const maxV = 100;
  const x = (i: number) => padL + (W - padL - padR) * (i / (n - 1));
  const y = (v: number) => padT + (H - padT - padB) * (1 - v / maxV);
  const path = (arr: number[]) =>
    arr.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const li = n - 1;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      {[0, 25, 50, 75, 100].map((g) => (
        <g key={g}>
          <line x1={padL} y1={y(g)} x2={W - padR} y2={y(g)} style={{ stroke: 'var(--rule-soft)' }} strokeWidth={1} />
          <text x={padL} y={y(g) - 3} fontSize={9} style={{ fill: 'var(--subtle)' }} fontFamily="JetBrains Mono,monospace">{g}</text>
        </g>
      ))}
      <path d={path(TREND.fresh)} fill="none" style={{ stroke: 'var(--subtle)' }} strokeWidth={2} strokeDasharray="4 3" />
      <path d={path(TREND.completion)} fill="none" style={{ stroke: 'var(--ink)' }} strokeWidth={2.5} />
      {TREND.completion.map((v, i) => <circle key={`c${i}`} cx={x(i)} cy={y(v)} r={3.5} style={{ fill: 'var(--ink)' }} />)}
      {TREND.fresh.map((v, i) => <circle key={`f${i}`} cx={x(i)} cy={y(v)} r={2.5} style={{ fill: 'var(--subtle)' }} />)}
      {TREND.quarters.map((q, i) => (
        <text key={q} x={x(i)} y={H - 8} fontSize={10} style={{ fill: 'var(--muted)' }} textAnchor="middle" fontFamily="Geist,sans-serif">{q}</text>
      ))}
      <text x={x(li) - 6} y={y(TREND.completion[li]) - 9} fontSize={12} style={{ fill: 'var(--ink)' }} textAnchor="end" fontWeight={600} fontFamily="Fraunces,serif">
        {TREND.completion[li]}%
      </text>
    </svg>
  );
}

export default function HRDashboard() {
  const [heatCell, setHeatCell] = useState<string | null>(null);
  const [nudges, setNudges] = useState<Nudge[]>(NUDGES_DATA.map((n) => ({ ...n })));

  const sortedTeams = [...TEAMS_LB].sort((a, b) => b.pct - a.pct);
  const total = (Object.values(STYLE_DIST) as number[]).reduce((s, n) => s + n, 0);
  const maxC = Math.max(...(Object.values(STYLE_DIST) as number[]));

  const heatDetail = (() => {
    if (!heatCell) return null;
    const [i, j] = heatCell.split('-').map(Number);
    const v = FRICTION[i][j];
    const d = FRICTION_DETAIL[`${i}-${j}`] || FRICTION_DETAIL[`${j}-${i}`];
    return d && v !== null ? { d, v } : null;
  })();

  const sendNudge = (idx: number) => {
    const next = [...nudges];
    next[idx] = { ...next[idx], sent: true };
    setNudges(next);
  };

  return (
    <>
      <div style={{ marginBottom: 18 }}>
        <div className="display" style={{ fontSize: 24 }}>People Insights</div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>
          Acme Corp · 100 employees · Q3 2026 · viewing as HR Admin
        </div>
      </div>

      <div className="kpis">
        {KPIS.map((k) => (
          <div key={k.label} className="kpi">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
            <div className={`kpi-delta ${k.up ? 'kpi-up' : 'kpi-flat'}`}>
              {k.up ? '↗ ' : ''}{k.delta}
            </div>
          </div>
        ))}
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title">Completion over time</span>
          <span className="section-meta">Org-wide · last 6 quarters</span>
        </div>
        <div className="card trend-card">
          <TrendSVG />
          <div className="trend-legend">
            <span><span className="legend-dot" style={{ background: 'var(--ink)' }} />Org completion %</span>
            <span><span className="legend-dot" style={{ background: 'var(--subtle)' }} />Profiles kept fresh %</span>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title">By team</span>
          <span className="section-meta">6 teams · sorted by completion</span>
        </div>
        <div className="card">
          {sortedTeams.map((t) => {
            const flag = t.pct >= 90 ? 'ok' : t.pct >= 75 ? 'watch' : 'risk';
            const flagText = flag === 'ok' ? 'On track' : flag === 'watch' ? 'Watch' : 'At risk';
            return (
              <div key={t.team} className="breakdown-row">
                <div>
                  <div style={{ fontWeight: 500 }}>{t.team}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 1 }}>{t.style}</div>
                </div>
                <div><Bar value={t.pct} color={barColor(t.pct)} height={6} /></div>
                <div style={{ textAlign: 'right', fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 500 }}>{t.pct}%</div>
                <div style={{ fontSize: 10.5, color: 'var(--muted)', textAlign: 'right' }}>{t.members} ppl</div>
                <span className={`flag flag-${flag}`}>{flagText}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title">Working-style mix</span>
          <span className="section-meta">How the org self-identifies</span>
        </div>
        <div className="dist">
          <div className="card dist-card">
            {(Object.keys(STYLE_DIST) as StyleKey[]).map((k) => {
              const s = STYLES[k];
              const c = STYLE_DIST[k];
              const pct = Math.round((c / total) * 100);
              return (
                <div key={k} className="dist-item">
                  <div className="dist-top">
                    <span className="dist-label"><span className="style-dot" style={{ background: s.color }} />{s.label}</span>
                    <span style={{ color: 'var(--muted)' }}>{c} · {pct}%</span>
                  </div>
                  <div className="bar-track" style={{ height: 8 }}>
                    <div className="bar-fill" style={{ width: `${(c / maxC) * 100}%`, background: s.color }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.65 }}>
              Acme skews <strong style={{ color: 'var(--ink)', fontWeight: 500 }}>Analyzer and Driver</strong> — an evidence-led culture that also moves fast. High-performing but friction-prone: the analytical teams want proof, the driver teams want speed. See the friction map below for where that costs you.
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title">Cross-team friction map</span>
          <span className="section-meta">Click any cell</span>
        </div>
        <div className="section-desc">
          Predicted communication friction between teams, derived from their working-style mix. Driver-heavy meets Analyzer-heavy clashes on pace; this is the silo-breaking signal no HRIS can show.
        </div>
        <div className="card heat-wrap">
          <table className="heat-grid">
            <tbody>
              <tr>
                <th></th>
                {FRICTION_TEAMS.map((t) => <th key={t}>{t}</th>)}
              </tr>
              {FRICTION_TEAMS.map((rowName, i) => (
                <tr key={rowName}>
                  <th className="rowhead">{rowName}</th>
                  {FRICTION_TEAMS.map((_, j) => {
                    const v = FRICTION[i][j];
                    if (v === null) return <td key={j} className="heat-cell diag">—</td>;
                    return (
                      <td
                        key={j}
                        className="heat-cell"
                        onClick={() => setHeatCell(`${i}-${j}`)}
                        style={{ background: frictionColor(v), color: frictionTextColor(v) }}
                      >{v}</td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="heat-legend">
            <span>Lower friction</span>
            <div className="heat-scale">
              {[22, 38, 48, 58, 70].map((v) => (
                <div key={v} className="heat-swatch" style={{ background: frictionColor(v) }} />
              ))}
            </div>
            <span>Higher friction</span>
          </div>
          <div className="heat-detail">
            {!heatDetail ? (
              <div className="heat-detail-empty">Click a cell to see the style clash and a recommendation.</div>
            ) : (
              <>
                <div className="heat-detail-pair">
                  {heatDetail.d.pair}
                  <span className="heat-score-pill" style={parseStyle(frictionPillCss(heatDetail.v))}>
                    {frictionLabel(heatDetail.v)} · {heatDetail.v}/100
                  </span>
                </div>
                <div className="heat-detail-body">{heatDetail.d.body}</div>
                <div className="heat-detail-rec"><strong>Recommendation: </strong>{heatDetail.d.rec}</div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title">Nudge queue</span>
          <span className="section-meta">Team-grouped · no individual shaming</span>
        </div>
        <div className="section-desc">
          Teams below target completion. Nudges go to the team&apos;s manager, not individuals directly.
        </div>
        <div className="card">
          {nudges.map((nu, idx) => (
            <div key={nu.team} className="nudge-row">
              <div>
                <div style={{ fontWeight: 500, fontSize: 13 }}>{nu.team}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                  {nu.under} of {nu.members} below target completion
                </div>
              </div>
              <div>
                <div className="nudge-count">{nu.under}</div>
                <div className="nudge-count-sub">to nudge</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                {nu.sent
                  ? <button className="btn btn-sent">✓ Sent</button>
                  : <button className="btn btn-primary" onClick={() => sendNudge(idx)}>Nudge manager</button>
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title">What we&apos;re noticing</span>
          <span className="section-meta">Auto-surfaced</span>
        </div>
        <div className="card">
          {INSIGHTS_DATA.map((it, i) => (
            <div key={i} className="insight">
              <div className="insight-icon" style={{ background: it.color, color: it.text }}>{it.icon}</div>
              <div className="insight-body" dangerouslySetInnerHTML={{ __html: it.body }} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// Convert "key:val;key2:val2" string into React style object
function parseStyle(s: string): React.CSSProperties {
  const out: Record<string, string> = {};
  s.split(';').forEach((pair) => {
    const [k, v] = pair.split(':');
    if (!k || !v) return;
    const camel = k.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    out[camel] = v.trim();
  });
  return out as React.CSSProperties;
}
