import { TEAMS_LB } from '../data/hr';
import { barColor } from '../lib/scoring';
import { Bar, TierBadge } from '../components/Shared';
import type { Tier } from '../lib/types';

export default function Leaderboard() {
  const sorted = [...TEAMS_LB].sort((a, b) => b.pct - a.pct);

  return (
    <>
      <div style={{ marginBottom: 8 }}>
        <div className="display" style={{ fontSize: 24 }}>Team leaderboard</div>
        <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 4 }}>
          Q3 · team vs team only
        </div>
      </div>
      <div className="section-desc">
        No individual rankings. Completion is a team metric — managers see who needs nudging, employees see how their team stacks up.
      </div>

      {sorted.map((t, i) => {
        const tier: Tier = t.pct >= 90 ? 'gold' : t.pct >= 75 ? 'silver' : 'bronze';
        return (
          <div key={t.team} className="lb-row">
            <span className="lb-rank">{(i < 9 ? '0' : '') + (i + 1)}</span>
            <div>
              <div className="lb-name">{t.team}</div>
              <div className="lb-sub">{t.members} members · {t.style}</div>
            </div>
            <div><Bar value={t.pct} color={barColor(t.pct)} height={6} /></div>
            <div className="lb-pct">{t.pct}%</div>
            <div style={{ textAlign: 'right' }}><TierBadge tier={tier} /></div>
          </div>
        );
      })}

      <div className="lb-callout">
        <span style={{ fontSize: 18 }}>🏆</span>
        <div>
          <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 3, color: 'var(--ink)' }}>
            Engineering wins the quarter — three Gold tiers in a row
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.55 }}>
            Sales is up six points from last quarter but still bronze. Their manager has a nudge queued for the four reps under 60%.
          </div>
        </div>
      </div>
    </>
  );
}
