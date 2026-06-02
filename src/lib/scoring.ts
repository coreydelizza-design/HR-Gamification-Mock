import type { Person, Score, Tier } from './types';
import { QUESTIONS } from '../data/questions';

export function computeScore(u: Person): Score {
  let ans = 0, tw = 0;
  for (const q of QUESTIONS) {
    const v = (u.answers[q.id] || '').trim();
    if (v.length) { ans++; tw += v.split(/\s+/).length; }
  }
  const pct = Math.round((ans / QUESTIONS.length) * 100);
  const avg = ans ? Math.round(tw / ans) : 0;
  const depth: Score['depth'] = avg >= 12 ? 'High' : avg >= 7 ? 'Medium' : 'Low';
  const fresh = u.updatedDaysAgo <= 90;
  let tier: Tier = 'incomplete';
  if (pct >= 90 && fresh && depth !== 'Low') tier = 'gold';
  else if (pct >= 75 && fresh) tier = 'silver';
  else if (pct >= 50) tier = 'bronze';
  return { pct, answered: ans, total: QUESTIONS.length, depth, avg, fresh, tier };
}

export function barColor(p: number): string {
  return p >= 90 ? 'var(--success)'
    : p >= 75 ? 'var(--warning)'
    : p >= 50 ? 'var(--muted)'
    : 'var(--ink)';
}

export function frictionColor(v: number): string {
  if (v <= 30) return 'var(--heat-1)';
  if (v <= 40) return 'var(--heat-2)';
  if (v <= 50) return 'var(--heat-3)';
  if (v <= 60) return 'var(--heat-4)';
  if (v <= 68) return 'var(--heat-5)';
  return 'var(--heat-6)';
}

export function frictionTextColor(v: number): string {
  return v <= 50 ? 'var(--heat-text-light)' : 'var(--heat-text-dark)';
}

export function frictionLabel(v: number): string {
  return v <= 30 ? 'Low' : v <= 50 ? 'Moderate' : v <= 65 ? 'Elevated' : 'High';
}

export function frictionPillCss(v: number): string {
  if (v <= 30) return 'background:var(--success-soft);color:var(--success-text)';
  if (v <= 50) return 'background:var(--warning-soft);color:var(--warning-text)';
  return 'background:var(--danger-soft);color:var(--danger-text)';
}
