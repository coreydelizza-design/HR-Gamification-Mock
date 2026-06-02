import {
  CARD_ADOPTION, TEAM_CARD_ADOPTION, AGREEMENT_COVERAGE, MEETING_READINESS_RATE,
  READINESS_TREND, FRESHNESS_TREND, ENGAGEMENT_BUCKETS,
  HANDOFF_CLARITY_GAPS, DEPENDENCY_GAPS, NUDGES,
} from '../data/orgInsights';
import { Bar } from '../components/Shared';
import type { AdoptionMetric, TrendSeries, CoverageRow, EngagementBucket } from '../data/orgInsights';

function MetricTile({ m, accent }: { m: AdoptionMetric; accent: string }) {
  return (
    <div
      className="metric-tile"
      style={{ '--accent-line': accent } as React.CSSProperties}
    >
      <div className="metric-tile-label">{m.label}</div>
      <div className="metric-tile-value">{m.pct}%</div>
      <div className={`metric-tile-delta ${m.trend === 'up' ? 'metric-tile-up' : 'metric-tile-flat'}`}>
        {m.trend === 'up' ? '↗ ' : ''}{m.deltaLabel} · {m.count} of {m.total}
      </div>
    </div>
  );
}

function TrendChart({ series }: { series: TrendSeries }) {
  const W = 720, H = 170, padL = 8, padR = 8, padT = 14, padB = 24;
  const n = series.periods.length;
  const maxV = 100;
  const x = (i: number) => padL + (W - padL - padR) * (i / (n - 1));
  const y = (v: number) => padT + (H - padT - padB) * (1 - v / maxV);
  const path = series.values.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const li = n - 1;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      {[0, 25, 50, 75, 100].map((g) => (
        <g key={g}>
          <line x1={padL} y1={y(g)} x2={W - padR} y2={y(g)} style={{ stroke: 'var(--rule-soft)' }} strokeWidth={1} />
          <text x={padL} y={y(g) - 3} fontSize={9} style={{ fill: 'var(--subtle)' }} fontFamily="JetBrains Mono,monospace">{g}</text>
        </g>
      ))}
      <path d={path} fill="none" style={{ stroke: 'var(--ink)' }} strokeWidth={2.5} />
      {series.values.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r={3.5} style={{ fill: 'var(--ink)' }} />)}
      {series.periods.map((p, i) => (
        <text key={p} x={x(i)} y={H - 8} fontSize={10} style={{ fill: 'var(--muted)' }} textAnchor="middle" fontFamily="Geist,sans-serif">{p}</text>
      ))}
      <text x={x(li) - 6} y={y(series.values[li]) - 9} fontSize={12} style={{ fill: 'var(--ink)' }} textAnchor="end" fontWeight={600} fontFamily="Fraunces,serif">
        {series.values[li]}%
      </text>
    </svg>
  );
}

function bucketColor(tone: EngagementBucket['tone']): { bg: string; fg: string; accent: string; border: string } {
  switch (tone) {
    case 'success':   return { bg: 'var(--success-soft)', fg: 'var(--success-text)', accent: 'var(--success)', border: 'var(--success-soft)' };
    case 'warning':   return { bg: 'var(--warning-soft)', fg: 'var(--warning-text)', accent: 'var(--warning)', border: 'var(--warning-soft)' };
    case 'info':      return { bg: 'var(--surface-soft)', fg: 'var(--ink)',          accent: 'var(--muted)',   border: 'var(--rule)' };
    case 'attention': return { bg: 'var(--danger-soft)',  fg: 'var(--danger-text)',  accent: 'var(--danger)',  border: 'var(--danger-soft)' };
  }
}

function statusToLevel(s: CoverageRow['status']): 'ready' | 'almost' | 'attention' {
  return s;
}

function StatusChip({ row }: { row: CoverageRow }) {
  const level = statusToLevel(row.status);
  const bg = level === 'ready' ? 'var(--success-soft)' : level === 'almost' ? 'var(--warning-soft)' : 'var(--danger-soft)';
  const fg = level === 'ready' ? 'var(--success-text)' : level === 'almost' ? 'var(--warning-text)' : 'var(--danger-text)';
  const label = level === 'ready' ? 'Ready' : level === 'almost' ? 'Almost' : 'Attention';
  return <span className="status-pill" style={{ background: bg, color: fg }}>{label}</span>;
}

export default function OrgInsights() {
  return (
    <>
      <div style={{ marginBottom: 18 }}>
        <div className="display" style={{ fontSize: 24 }}>Org Insights</div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>
          Aggregate collaboration clarity. All metrics are organization-wide. No individual rankings, no individual friction scores.
        </div>
      </div>

      <div className="metrics-grid">
        <MetricTile m={CARD_ADOPTION}          accent="var(--success)" />
        <MetricTile m={TEAM_CARD_ADOPTION}     accent="var(--success)" />
        <MetricTile m={AGREEMENT_COVERAGE}     accent="var(--success)" />
        <MetricTile m={MEETING_READINESS_RATE} accent="var(--muted)" />
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title">Readiness over time</span>
          <span className="section-meta">Org-wide · last 6 quarters</span>
        </div>
        <div className="card trend-card">
          <TrendChart series={READINESS_TREND} />
          <div className="trend-legend" style={{ marginTop: 10 }}>
            <span><span className="legend-dot" style={{ background: 'var(--ink)' }} />Card readiness</span>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title">Cards reviewed this quarter</span>
          <span className="section-meta">Freshness trend</span>
        </div>
        <div className="card trend-card">
          <TrendChart series={FRESHNESS_TREND} />
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title">Card state mix</span>
          <span className="section-meta">Aggregate — not individual</span>
        </div>
        <div className="section-desc">
          Every card falls into one of four states. The mix is the planning signal. No individual is named or scored here — these are organizational levers for HR and team leads.
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div className="matrix-grid">
            {ENGAGEMENT_BUCKETS.map((cell) => {
              const t = bucketColor(cell.tone);
              return (
                <div
                  key={cell.key}
                  className="matrix-cell"
                  style={{ background: t.bg, borderColor: t.border, color: t.fg }}
                >
                  <div className="matrix-count" style={{ color: t.accent }}>{cell.count}</div>
                  <div className="matrix-label">{cell.label}</div>
                  <div className="matrix-desc">{cell.desc}</div>
                  <div className="matrix-pct">{cell.pct}% of cards</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title">Working-agreement coverage</span>
          <span className="section-meta">Handoff clarity by team pair</span>
        </div>
        <div className="card">
          {HANDOFF_CLARITY_GAPS.map((row) => (
            <div key={row.label} className="coverage-row">
              <div className="coverage-row-label">{row.label}</div>
              <div className="coverage-row-detail">{row.detail}</div>
              <div style={{ width: '100%' }}>
                <Bar
                  value={row.pct}
                  height={6}
                  color={row.status === 'ready' ? 'var(--success)' : row.status === 'almost' ? 'var(--warning)' : 'var(--danger)'}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <StatusChip row={row} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title">Dependency clarity gaps</span>
          <span className="section-meta">Cross-team work at risk</span>
        </div>
        <div className="card">
          {DEPENDENCY_GAPS.map((row) => (
            <div key={row.label} className="coverage-row">
              <div className="coverage-row-label">{row.label}</div>
              <div className="coverage-row-detail">{row.detail}</div>
              <div style={{ width: '100%' }}>
                <Bar
                  value={row.pct}
                  height={6}
                  color={row.status === 'ready' ? 'var(--success)' : row.status === 'almost' ? 'var(--warning)' : 'var(--danger)'}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <StatusChip row={row} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title">Nudge queue</span>
          <span className="section-meta">Team-grouped · advisory only</span>
        </div>
        <div className="section-desc">
          Nudges are aggregated and advisory. They never trigger performance reviews and never name individuals to teammates.
        </div>
        <div className="card">
          {NUDGES.map((n) => (
            <div key={n.id} className="coverage-row">
              <div className="coverage-row-label">{n.kind.replace(/_/g, ' ')}</div>
              <div className="coverage-row-detail">{n.message}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--muted)', textAlign: 'right' }}>
                {n.audience}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <span className="freshness fr-aging">open</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
