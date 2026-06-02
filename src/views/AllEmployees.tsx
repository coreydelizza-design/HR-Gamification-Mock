import { useState, useMemo } from 'react';
import type { Person, Tier } from '../lib/types';
import { TEAM } from '../data/people';
import { computeScore, barColor } from '../lib/scoring';
import { Avatar, Bar, TierBadge } from '../components/Shared';

type SortKey = 'name' | 'team' | 'pct' | 'days' | 'streak' | 'tier';
type SortDir = 'asc' | 'desc';
type Filter = 'all' | 'gold' | 'stale' | 'incomplete' | 'fresh';

const TIER_ORDER: Record<Tier, number> = { gold: 0, silver: 1, bronze: 2, incomplete: 3 };

interface Props {
  user: Person;
  onOpenPerson: (id: string) => void;
}

export default function AllEmployees({ user, onOpenPerson }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('pct');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [filter, setFilter] = useState<Filter>('all');

  const all = useMemo(() => [user, ...TEAM].map((p) => {
    const s = computeScore(p);
    return { p, s };
  }), [user]);

  const filtered = useMemo(() => {
    return all.filter(({ p, s }) => {
      if (filter === 'all') return true;
      if (filter === 'gold') return s.tier === 'gold';
      if (filter === 'stale') return !s.fresh;
      if (filter === 'incomplete') return s.tier === 'incomplete';
      if (filter === 'fresh') return p.updatedDaysAgo <= 30;
      return true;
    });
  }, [all, filter]);

  const sorted = useMemo(() => {
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      switch (sortKey) {
        case 'name':   return a.p.name.localeCompare(b.p.name) * dir;
        case 'team':   return a.p.team.localeCompare(b.p.team) * dir;
        case 'pct':    return (a.s.pct - b.s.pct) * dir;
        case 'days':   return (a.p.updatedDaysAgo - b.p.updatedDaysAgo) * dir;
        case 'streak': return (a.p.streak - b.p.streak) * dir;
        case 'tier':   return (TIER_ORDER[a.s.tier] - TIER_ORDER[b.s.tier]) * dir;
      }
    });
  }, [filtered, sortKey, sortDir]);

  const setSort = (k: SortKey) => {
    if (k === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(k); setSortDir(k === 'name' || k === 'team' ? 'asc' : 'desc'); }
  };

  const indicator = (k: SortKey) => sortKey === k ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

  const FILTERS: Array<{ k: Filter; label: string }> = [
    { k: 'all',         label: `All (${all.length})` },
    { k: 'gold',        label: `Gold (${all.filter(({ s }) => s.tier === 'gold').length})` },
    { k: 'fresh',       label: `Refreshed <30d (${all.filter(({ p }) => p.updatedDaysAgo <= 30).length})` },
    { k: 'stale',       label: `Stale (${all.filter(({ s }) => !s.fresh).length})` },
    { k: 'incomplete',  label: `Incomplete (${all.filter(({ s }) => s.tier === 'incomplete').length})` },
  ];

  return (
    <>
      <div style={{ marginBottom: 14 }}>
        <div className="display" style={{ fontSize: 24 }}>All employees</div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>
          HR view of every card across the org. Click any row to open the profile.
        </div>
      </div>

      <div className="filter-row">
        {FILTERS.map((f) => (
          <button
            key={f.k}
            className={`filter-chip ${filter === f.k ? 'active' : ''}`}
            onClick={() => setFilter(f.k)}
          >{f.label}</button>
        ))}
      </div>

      <div className="emp-table-wrap">
        <table className="emp-table">
          <thead>
            <tr>
              <th className={sortKey === 'name' ? 'sorted' : ''} onClick={() => setSort('name')}>Name{indicator('name')}</th>
              <th className={sortKey === 'team' ? 'sorted' : ''} onClick={() => setSort('team')}>Team{indicator('team')}</th>
              <th className={sortKey === 'pct' ? 'sorted' : ''} onClick={() => setSort('pct')} style={{ textAlign: 'right' }}>Complete{indicator('pct')}</th>
              <th className={sortKey === 'days' ? 'sorted' : ''} onClick={() => setSort('days')} style={{ textAlign: 'right' }}>Days since refresh{indicator('days')}</th>
              <th className={sortKey === 'streak' ? 'sorted' : ''} onClick={() => setSort('streak')} style={{ textAlign: 'right' }}>Streak{indicator('streak')}</th>
              <th className={sortKey === 'tier' ? 'sorted' : ''} onClick={() => setSort('tier')}>Tier{indicator('tier')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(({ p, s }) => (
              <tr key={p.id} onClick={() => onOpenPerson(p.id)}>
                <td className="col-name">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar person={p} size={28} />
                    <span>{p.name}{p.id === 'me' ? ' (you)' : ''}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--muted)' }}>{p.team}</td>
                <td className="col-num">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                    <span>{s.pct}%</span>
                    <div style={{ width: 56 }}><Bar value={s.pct} color={barColor(s.pct)} height={4} /></div>
                  </div>
                </td>
                <td className="col-num" style={{ color: p.updatedDaysAgo > 60 ? 'var(--warning)' : 'var(--muted)' }}>{p.updatedDaysAgo}d</td>
                <td className="col-num">{p.streak}w</td>
                <td><TierBadge tier={s.tier} /></td>
                <td style={{ color: 'var(--muted)', textAlign: 'right', fontSize: 11 }}>View →</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="emp-table-meta">
          <span>{sorted.length} of {all.length}</span>
          <span>Sorted by {sortKey} {sortDir === 'asc' ? 'ascending' : 'descending'}</span>
        </div>
      </div>
    </>
  );
}
