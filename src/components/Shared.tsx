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

interface RingProps {
  value: number;
  max: number;
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  showValue?: boolean;
}

export function Ring({
  value, max,
  size = 80, stroke = 4,
  color = 'var(--ink)',
  trackColor = 'var(--rule-soft)',
  label,
  showValue = true,
}: RingProps) {
  const pct = Math.max(0, Math.min(value / max, 1));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * pct;
  const fontSize = Math.max(11, Math.round(size * 0.22));

  return (
    <div style={{ textAlign: 'center', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width={size} height={size} style={{ display: 'block' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${c - dash}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dasharray 240ms ease-out' }}
        />
        {showValue && (
          <text
            x={size / 2} y={size / 2 + 1}
            textAnchor="middle" dominantBaseline="middle"
            fill={color}
            fontFamily="'Fraunces', serif"
            fontSize={fontSize}
            fontWeight={500}
          >
            {Math.round(value)}{max === 100 && '%'}
          </text>
        )}
      </svg>
      {label && (
        <div style={{
          fontSize: 9, color: 'var(--muted)',
          fontFamily: "'JetBrains Mono', monospace",
          textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600,
        }}>{label}</div>
      )}
    </div>
  );
}
