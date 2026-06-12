import { useMemo } from 'react';
import { useOrgData } from '../lib/demoStore';
import { ORG_DEPENDENCIES } from '../data/orgDependencies';
import { SUCCESS_AGREEMENTS } from '../data/successAgreements';
import { ORG_MEETING_FITS } from '../data/meetingFit';
import { ORG_PACK_BY_ID } from '../data/orgPacks';
import { successFor, orgName } from '../lib/orgData';
import { OpportunitySummary } from '../components/Proxy';

interface Props {
  onOpenOrg: (id: string) => void;
  onOpenAgreement?: (id: string) => void;
  onOpenMeeting?: (id: string) => void;
}

export default function OrgInsights({ onOpenOrg, onOpenAgreement, onOpenMeeting }: Props) {
  const { organizations: ORGANIZATIONS, orgCardByOrg: ORG_CARD_BY_ORG } = useOrgData();
  const analyses = useMemo(() => ORGANIZATIONS.map((o) => ({ org: o, a: successFor(o.id)! })), [ORGANIZATIONS]);

  const cardCoverage = Math.round(ORGANIZATIONS.reduce((s, o) => s + ((ORG_CARD_BY_ORG[o.id]?.publishedSections.length ?? 0) / 13), 0) / ORGANIZATIONS.length * 100);
  const freshMix = {
    fresh: ORGANIZATIONS.filter((o) => o.freshness === 'fresh').length,
    aging: ORGANIZATIONS.filter((o) => o.freshness === 'aging').length,
    stale: ORGANIZATIONS.filter((o) => o.freshness === 'stale').length,
  };
  const agrPublished = SUCCESS_AGREEMENTS.filter((a) => a.status === 'published').length;
  const staleAgreements = SUCCESS_AGREEMENTS.filter((a) => a.status === 'needs_refresh').length;
  const depRisk = ORG_DEPENDENCIES.filter((d) => d.health === 'at_risk' || d.health === 'blocked').length;
  const meetingsNotReady = ORG_MEETING_FITS.filter((f) => f.status === 'at_risk' || f.status === 'draft').length;

  const tiles: Array<{ label: string; value: string; detail: string }> = [
    { label: 'Org-card coverage', value: `${cardCoverage}%`, detail: 'Avg published sections across 36 orgs' },
    { label: 'Agreement coverage', value: `${agrPublished}/${SUCCESS_AGREEMENTS.length}`, detail: `${staleAgreements} need refresh` },
    { label: 'Dependency risk', value: `${depRisk}`, detail: `of ${ORG_DEPENDENCIES.length} dependencies at risk or blocked` },
    { label: 'Meetings not ready', value: `${meetingsNotReady}`, detail: `of ${ORG_MEETING_FITS.length} cross-org meetings` },
  ];

  // Commercial clarity — the revenue engine's operating-model clarity.
  const revenueResponsible = analyses.filter(({ org }) => {
    const r = ORG_CARD_BY_ORG[org.id]?.commercial?.revenueRole;
    return r === 'pl_owner' || r === 'revenue_generating';
  });
  const revClear = revenueResponsible.filter(({ a }) => a.successReadinessScore >= 80).length;
  const revClarityPct = revenueResponsible.length ? Math.round(revClear / revenueResponsible.length * 100) : 0;
  const revNeedsWork = revenueResponsible.filter(({ org, a }) => org.freshness === 'stale' || a.successReadinessScore < 70);

  const dimPct = (a: ReturnType<typeof successFor>, key: string) => a?.dimensions.find((d) => d.key === key)?.summary.pct ?? 100;
  const unclearOwnership = analyses.filter(({ a }) => dimPct(a, 'ownership') < 60);
  const staleCards = analyses.filter(({ org }) => org.freshness === 'stale');
  const missingInputs = analyses.filter(({ a }) => dimPct(a, 'inputs') < 55);
  const missingHandoffs = analyses.filter(({ a }) => dimPct(a, 'handoff') < 40);
  const noEscalation = analyses.filter(({ a }) => dimPct(a, 'escalation') === 0);
  const bestHelpers = [...analyses].sort((x, y) => y.a.helpOfferedTo.length - x.a.helpOfferedTo.length).slice(0, 4);

  const packAdoption = useMemo(() => {
    const counts: Record<string, number> = {};
    ORGANIZATIONS.forEach((o) => { counts[o.orgPackId] = (counts[o.orgPackId] ?? 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [ORGANIZATIONS]);

  const QuestionList = ({ title, items, empty }: { title: string; items: typeof analyses; empty: string }) => (
    <div className="home-card">
      <div className="home-card-head"><div className="home-card-title">{title}</div><span className="home-card-meta">{items.length}</span></div>
      <div className="home-list">
        {items.length === 0 ? <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{empty}</div> : items.slice(0, 6).map(({ org }) => (
          <div key={org.id} className="home-list-item" style={{ gridTemplateColumns: '1fr auto', cursor: 'pointer' }} onClick={() => onOpenOrg(org.id)}>
            <div><div className="hli-title">{org.name}</div></div>
            <span className="hli-action">Open →</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className="section-head" style={{ marginBottom: 6 }}>
        <span className="display" style={{ fontSize: 24 }}>Org Insights</span>
        <span className="section-meta">Aggregate organizational clarity · nothing individual</span>
      </div>
      <div className="section-desc">
        Where the enterprise operating model is unclear — at the organization and relationship level only.
        No individual metric, ranking, or comparison appears here.
      </div>

      {/* Opportunity — the headline: annual meeting spend vs recoverable, by driver */}
      <div className="home-card" style={{ marginBottom: 18 }}>
        <div className="home-card-head">
          <div className="home-card-title">Opportunity — meeting cost vs operating-model gaps</div>
          <span className="home-card-meta">org-level only</span>
        </div>
        <OpportunitySummary onOpenAgreement={onOpenAgreement} onOpenMeeting={onOpenMeeting} />
      </div>

      <div className="metrics-grid">
        {tiles.map((t) => (
          <div key={t.label} className="metric-tile">
            <div className="metric-tile-label">{t.label}</div>
            <div className="metric-tile-value">{t.value}</div>
            <div className="metric-tile-delta metric-tile-flat">{t.detail}</div>
          </div>
        ))}
      </div>

      <div className="home-card" style={{ marginBottom: 18 }}>
        <div className="home-card-head"><div className="home-card-title">Card freshness mix</div><span className="home-card-meta">36 organizations</span></div>
        <div style={{ display: 'flex', height: 12, borderRadius: 999, overflow: 'hidden', border: '1px solid var(--rule)' }}>
          <div style={{ width: `${freshMix.fresh / ORGANIZATIONS.length * 100}%`, background: 'var(--success)' }} title={`${freshMix.fresh} fresh`} />
          <div style={{ width: `${freshMix.aging / ORGANIZATIONS.length * 100}%`, background: 'var(--warning)' }} title={`${freshMix.aging} aging`} />
          <div style={{ width: `${freshMix.stale / ORGANIZATIONS.length * 100}%`, background: 'var(--danger)' }} title={`${freshMix.stale} stale`} />
        </div>
        <div className="trend-legend">
          <span><span className="legend-dot" style={{ background: 'var(--success)' }} />{freshMix.fresh} fresh</span>
          <span><span className="legend-dot" style={{ background: 'var(--warning)' }} />{freshMix.aging} aging</span>
          <span><span className="legend-dot" style={{ background: 'var(--danger)' }} />{freshMix.stale} stale</span>
        </div>
      </div>

      <div className="home-card" style={{ marginBottom: 18 }}>
        <div className="home-card-head">
          <div className="home-card-title">Commercial clarity</div>
          <span className="home-card-meta">revenue engine</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 500 }}>{revClarityPct}%</span>
          <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>
            Your revenue engine's operating model is <strong>{revClarityPct}%</strong> clear —
            {revClear} of {revenueResponsible.length} revenue-responsible organizations (P&amp;L owners and revenue-generating)
            have a card at ready threshold.
          </span>
        </div>
        {revNeedsWork.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <div className="lbl-list-label">Revenue-responsible orgs with stale or low-clarity cards</div>
            <div className="home-list">
              {revNeedsWork.map(({ org, a }) => (
                <div key={org.id} className="home-list-item" style={{ gridTemplateColumns: '1fr auto auto', cursor: 'pointer' }} onClick={() => onOpenOrg(org.id)}>
                  <div><div className="hli-title">{org.name}</div><div className="hli-sub">{ORG_CARD_BY_ORG[org.id]?.commercial?.revenueRole.replace('_', ' ')}</div></div>
                  <span className="freshness fr-unknown" style={{ alignSelf: 'center' }}>{org.freshness}</span>
                  <span className="hli-action">{a.successReadinessScore}% →</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={{ fontSize: 10.5, color: 'var(--subtle)', marginTop: 10 }}>Computed from organization-level readiness only. No individual attainment, quota, or revenue is attributed to any person.</div>
      </div>

      <div className="home-grid">
        <QuestionList title="Unclear about what they own" items={unclearOwnership} empty="Every org has stated its ownership." />
        <QuestionList title="Stale cards" items={staleCards} empty="No stale cards." />
      </div>
      <div className="home-grid">
        <QuestionList title="Need to define required inputs" items={missingInputs} empty="Inputs documented everywhere." />
        <QuestionList title="Missing handoff checklists" items={missingHandoffs} empty="Handoffs documented." />
      </div>
      <div className="home-grid">
        <QuestionList title="No escalation path" items={noEscalation} empty="Escalation paths defined." />
        <div className="home-card">
          <div className="home-card-head"><div className="home-card-title">Helping others succeed well</div><span className="home-card-meta">top 4</span></div>
          <div className="home-list">
            {bestHelpers.map(({ org, a }) => (
              <div key={org.id} className="home-list-item" style={{ gridTemplateColumns: '1fr auto', cursor: 'pointer' }} onClick={() => onOpenOrg(org.id)}>
                <div><div className="hli-title">{org.name}</div><div className="hli-sub">{a.helpOfferedTo.length} downstream relationships</div></div>
                <span className="hli-action">Open →</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="home-card">
        <div className="home-card-head"><div className="home-card-title">Org-pack adoption</div><span className="home-card-meta">11 packs</span></div>
        <div>
          {packAdoption.map(([packId, count]) => (
            <div key={packId} className="coverage-row">
              <span className="coverage-row-label">{ORG_PACK_BY_ID[packId]?.name ?? packId}</span>
              <span className="coverage-row-detail">{ORG_PACK_BY_ID[packId]?.description}</span>
              <span className="coverage-row-pct">{count} orgs</span>
              <span className="coverage-row-pct">{Math.round(count / ORGANIZATIONS.length * 100)}%</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 11, color: 'var(--subtle)', marginTop: 16, lineHeight: 1.6 }}>
        All figures aggregate at the organization level. Fieldguide never ranks, scores, or compares individuals —
        by design and by data shape. Friction is named between organizations ({orgName('o-eng')} ↔ {orgName('o-prod')}), never between people.
      </div>
    </>
  );
}
