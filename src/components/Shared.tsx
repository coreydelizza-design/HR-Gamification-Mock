import type { Person, Team, ReadinessLevel, ReadinessSummary, FreshnessSignal } from '../lib/types';
import { levelColor, levelSoftBg, levelTextColor } from '../lib/readiness';

/* ─────────────────────────────────────────────────────────────────
   Avatar — initials in a tinted circle. visualKey is a deterministic
   color seed only; it is not a personality identifier.
   ───────────────────────────────────────────────────────────────── */
const VISUAL_BG: Record<Person['visualKey'], string> = {
  a: 'var(--accent-1-soft)',
  b: 'var(--accent-2-soft)',
  c: 'var(--accent-3-soft)',
  d: 'var(--accent-4-soft)',
};
const VISUAL_FG: Record<Person['visualKey'], string> = {
  a: 'var(--accent-1-text)',
  b: 'var(--accent-2-text)',
  c: 'var(--accent-3-text)',
  d: 'var(--accent-4-text)',
};

export function Avatar({ person, size = 32 }: { person: Person; size?: number }) {
  return (
    <div
      className="av"
      style={{
        width: size, height: size,
        fontSize: Math.round(size * 0.36),
        background: VISUAL_BG[person.visualKey],
        color: VISUAL_FG[person.visualKey],
      }}
    >
      {person.initials}
    </div>
  );
}

export function TeamMark({ team, size = 28 }: { team: Team; size?: number }) {
  return (
    <div
      className="team-mark"
      style={{
        width: size, height: size,
        fontSize: Math.round(size * 0.34),
        background: VISUAL_BG[team.visualKey],
        color: VISUAL_FG[team.visualKey],
      }}
    >
      {team.shortName.slice(0, 2).toUpperCase()}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Bar — generic progress bar.
   ───────────────────────────────────────────────────────────────── */
export function Bar({ value, color = 'var(--ink)', height = 5 }: { value: number; color?: string; height?: number }) {
  return (
    <div className="bar-track" style={{ height }}>
      <div className="bar-fill" style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Ring — circular progress. Kept from prior build; used in Home
   and My Fieldguide hero.
   ───────────────────────────────────────────────────────────────── */
interface RingProps {
  value: number;
  max: number;
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  showValue?: boolean;
  centerText?: string;
}

export function Ring({
  value, max,
  size = 80, stroke = 4,
  color = 'var(--ink)',
  trackColor = 'var(--rule-soft)',
  label,
  showValue = true,
  centerText,
}: RingProps) {
  const pct = Math.max(0, Math.min(value / max, 1));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * pct;
  const fontSize = Math.max(11, Math.round(size * 0.22));
  const displayText = centerText ?? `${Math.round(value)}${max === 100 ? '%' : ''}`;

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
            {displayText}
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

/* ─────────────────────────────────────────────────────────────────
   ReadinessMeter — horizontal bar + status word.
   Renders a readiness summary as a professional progress indicator.
   ───────────────────────────────────────────────────────────────── */
export function ReadinessMeter({
  summary,
  showRationale = false,
  compact = false,
}: { summary: ReadinessSummary; showRationale?: boolean; compact?: boolean }) {
  const color = levelColor(summary.level);
  return (
    <div className={`readiness-meter${compact ? ' rm-compact' : ''}`}>
      <div className="rm-row">
        <span className="rm-label">{summary.label}</span>
        <span className="rm-pct">{summary.pct}%</span>
      </div>
      <Bar value={summary.pct} color={color} height={compact ? 4 : 6} />
      {showRationale && (
        <div className="rm-rationale">{summary.rationale}</div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   StatusPill — semantic status word.
   ───────────────────────────────────────────────────────────────── */
export function StatusPill({
  level,
  children,
}: { level: ReadinessLevel; children: React.ReactNode }) {
  return (
    <span
      className="status-pill"
      style={{ background: levelSoftBg(level), color: levelTextColor(level) }}
    >
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────
   FreshnessBadge — small marker tied to FreshnessSignal.
   ───────────────────────────────────────────────────────────────── */
export function FreshnessBadge({ signal }: { signal: FreshnessSignal | undefined }) {
  if (!signal) {
    return <span className="freshness fr-unknown">Freshness — n/a</span>;
  }
  const cls = signal.status === 'fresh' ? 'fr-fresh'
    : signal.status === 'aging' ? 'fr-aging' : 'fr-stale';
  const label = signal.status === 'fresh' ? 'Fresh'
    : signal.status === 'aging' ? 'Aging' : 'Stale';
  return (
    <span className={`freshness ${cls}`}>
      {label} · {signal.daysSinceUpdate}d
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SectionCard — a section block with title + body.
   ───────────────────────────────────────────────────────────────── */
export function SectionCard({
  title,
  meta,
  children,
}: { title: string; meta?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="section">
      <div className="section-head">
        <span className="section-title">{title}</span>
        {meta && <span className="section-meta">{meta}</span>}
      </div>
      {children}
    </div>
  );
}
