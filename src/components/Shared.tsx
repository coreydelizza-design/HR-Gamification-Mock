import type { Person, StyleKey, Tier } from '../lib/types';
import { STYLES } from '../data/styles';

export function Avatar({ person, size = 40 }: { person: Person; size?: number }) {
  const s = STYLES[person.style];
  return (
    <div
      className={`av ${s.cls}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.36),
      }}
    >
      {person.initials}
    </div>
  );
}

export function StylePill({ styleKey }: { styleKey: StyleKey }) {
  const s = STYLES[styleKey];
  return (
    <span className="pill" style={{ background: s.bg, color: s.fg }}>
      ⚡ {s.label} · {s.desc}
    </span>
  );
}

const TIER_LABELS: Record<Tier, string> = {
  gold: 'Gold', silver: 'Silver', bronze: 'Bronze', incomplete: 'Incomplete',
};

export function TierBadge({ tier }: { tier: Tier }) {
  const star = tier === 'gold' ? '★ ' : '';
  return <span className={`tier tier-${tier}`}>{star}{TIER_LABELS[tier]}</span>;
}

export function Bar({ value, color = 'var(--ink)', height = 5 }: { value: number; color?: string; height?: number }) {
  return (
    <div className="bar-track" style={{ height }}>
      <div className="bar-fill" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}
