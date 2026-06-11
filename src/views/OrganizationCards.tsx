import { useMemo, useState } from 'react';
import type { Organization, OrganizationCategory } from '../lib/types';
import { ORGANIZATIONS, ORG_CATEGORY_LABEL } from '../data/organizations';
import { successFor } from '../lib/orgData';
import { OrgCardPreview } from '../components/Org';

interface Props {
  onOpenOrg: (id: string) => void;
}

type ReadinessFilter = 'all' | 'ready' | 'attention' | 'stale';
const CATEGORIES: Array<OrganizationCategory | 'all'> = ['all', 'leadership', 'technology', 'revenue', 'customer', 'people', 'finance_legal', 'operations'];

export default function OrganizationCards({ onOpenOrg }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<OrganizationCategory | 'all'>('all');
  const [readiness, setReadiness] = useState<ReadinessFilter>('all');
  const [tier, setTier] = useState<'all' | 1 | 2>('all');

  const scored = useMemo(() => ORGANIZATIONS.map((o) => {
    const a = successFor(o.id);
    return { org: o, score: a?.successReadinessScore ?? 0, level: a?.level ?? 'unknown' as const };
  }), []);

  const filtered = useMemo(() => scored.filter(({ org, score }) => {
    if (category !== 'all' && org.category !== category) return false;
    if (tier !== 'all' && org.tier !== tier) return false;
    if (readiness === 'ready' && score < 80) return false;
    if (readiness === 'attention' && score >= 55) return false;
    if (readiness === 'stale' && org.freshness !== 'stale') return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      if (!org.name.toLowerCase().includes(q) && !org.mission.toLowerCase().includes(q) && !org.executiveOwner.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [scored, category, tier, readiness, query]);

  const tier1 = filtered.filter((x) => x.org.tier === 1);
  const tier2 = filtered.filter((x) => x.org.tier === 2);

  const renderGroup = (label: string, items: typeof filtered) => items.length === 0 ? null : (
    <div className="section">
      <div className="section-head">
        <span className="section-title">{label}</span>
        <span className="section-meta">{items.length} organization{items.length === 1 ? '' : 's'}</span>
      </div>
      <div className="org-grid">
        {items.map(({ org, score, level }) => (
          <OrgCardPreview key={org.id} org={org} score={score} level={level} onOpen={onOpenOrg} />
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className="section-head" style={{ marginBottom: 6 }}>
        <span className="display" style={{ fontSize: 24 }}>Organization Cards</span>
        <span className="section-meta">{ORGANIZATIONS.length} organizations · the primary operating object</span>
      </div>
      <div className="section-desc">
        Org charts show reporting structure. Fieldguide shows working structure — how each organization succeeds,
        what it owns, what it needs, and how it helps others.
      </div>

      <div className="filter-row">
        <div className="topbar-search" style={{ minWidth: 220 }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, mission, owner…"
            style={{ border: 'none', background: 'transparent', color: 'var(--ink)', fontFamily: 'inherit', fontSize: 12, width: '100%', outline: 'none' }}
          />
        </div>
      </div>

      <div className="filter-row">
        {CATEGORIES.map((c) => (
          <button key={c} className={`filter-chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
            {c === 'all' ? 'All categories' : ORG_CATEGORY_LABEL[c]}
          </button>
        ))}
      </div>
      <div className="filter-row">
        {([['all', 'All readiness'], ['ready', 'Ready (≥80%)'], ['attention', 'Needs attention'], ['stale', 'Stale cards']] as Array<[ReadinessFilter, string]>).map(([k, label]) => (
          <button key={k} className={`filter-chip ${readiness === k ? 'active' : ''}`} onClick={() => setReadiness(k)}>{label}</button>
        ))}
        {([['all', 'All tiers'], [1, 'Tier 1 · rich'], [2, 'Tier 2 · catalog']] as Array<['all' | 1 | 2, string]>).map(([k, label]) => (
          <button key={String(k)} className={`filter-chip ${tier === k ? 'active' : ''}`} onClick={() => setTier(k)}>{label}</button>
        ))}
      </div>

      {filtered.length === 0
        ? <div style={{ fontSize: 13, color: 'var(--muted)', padding: '24px 0' }}>No organizations match these filters.</div>
        : (<>
            {renderGroup('Tier 1 — rich cards', tier1)}
            {renderGroup('Tier 2 — catalog', tier2)}
          </>)}
    </>
  );
}

export type { Organization };
