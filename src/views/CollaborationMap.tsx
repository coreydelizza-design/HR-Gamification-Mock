import { useState } from 'react';
import type { CollabEdge, OrganizationCategory } from '../lib/types';
import { ORG_CATEGORY_LABEL } from '../data/organizations';
import { useOrgData } from '../lib/demoStore';
import { COLLAB_EDGES } from '../data/collaborationMap';
import { SUCCESS_AGREEMENT_BY_ID } from '../data/successAgreements';
import { crossFor, orgName } from '../lib/orgData';
import {
  DependencyHealthBadge, StrengthChip, CategoryTag, AgreementStatusBadge,
  LabeledList, NextBestActions,
} from '../components/Org';

interface Props {
  onOpenOrg: (id: string) => void;
  onOpenAgreement: (id: string) => void;
}

type Mode = 'enterprise' | 'selected' | 'mutual' | 'risk';

const CATEGORY_ORDER: OrganizationCategory[] = ['leadership', 'technology', 'revenue', 'customer', 'people', 'finance_legal', 'operations'];

function EdgeCard({ edge, onOpenAgreement }: { edge: CollabEdge; onOpenAgreement: (id: string) => void }) {
  const agreement = edge.governingAgreementId ? SUCCESS_AGREEMENT_BY_ID[edge.governingAgreementId] : undefined;
  return (
    <div className="map-edge">
      <div className="map-edge-head">
        <span className="map-edge-orgs">{orgName(edge.sourceOrgId)} → {orgName(edge.targetOrgId)}</span>
        <DependencyHealthBadge health={edge.health} />
      </div>
      <div className="map-edge-detail">{edge.outputProvided} — needs: {edge.requiredInput}</div>
      <div className="map-edge-detail" style={{ marginTop: 4 }}>{edge.risk}</div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
        <span className="mono" style={{ fontSize: 10, color: 'var(--subtle)' }}>{edge.dependencyType}</span>
        <StrengthChip strength={edge.strength} />
        {agreement && <button className="cat-tag" style={{ cursor: 'pointer' }} onClick={() => onOpenAgreement(agreement.id)}>agreement</button>}
      </div>
    </div>
  );
}

export default function CollaborationMap({ onOpenOrg, onOpenAgreement }: Props) {
  const { organizations: ORGANIZATIONS, orgById: ORG_BY_ID, tier1: TIER1_ORGS } = useOrgData();
  const [mode, setMode] = useState<Mode>('enterprise');
  const [selOrg, setSelOrg] = useState<string>('o-eng');
  const [pairA, setPairA] = useState<string>('o-sales');
  const [pairB, setPairB] = useState<string>('o-legal');

  return (
    <>
      <div className="section-head" style={{ marginBottom: 6 }}>
        <span className="display" style={{ fontSize: 24 }}>Collaboration Map</span>
        <span className="section-meta">{COLLAB_EDGES.length} relationships across {ORGANIZATIONS.length} organizations</span>
      </div>
      <div className="section-desc">Working structure, not reporting structure — who provides what to whom, and where it is at risk.</div>

      <div className="filter-row">
        <div className="seg">
          {(['enterprise', 'selected', 'mutual', 'risk'] as Mode[]).map((m) => (
            <button key={m} className={mode === m ? 'active' : ''} onClick={() => setMode(m)}>
              {m === 'enterprise' ? 'Enterprise' : m === 'selected' ? 'Selected org' : m === 'mutual' ? 'Mutual success' : 'Risk'}
            </button>
          ))}
        </div>
      </div>

      {mode === 'enterprise' && (
        <div>
          {CATEGORY_ORDER.map((cat) => {
            const orgs = ORGANIZATIONS.filter((o) => o.category === cat);
            if (orgs.length === 0) return null;
            return (
              <div key={cat} className="map-cat-group">
                <div className="map-cat-title">{ORG_CATEGORY_LABEL[cat]}</div>
                <div className="org-grid">
                  {orgs.map((o) => {
                    const out = COLLAB_EDGES.filter((e) => e.sourceOrgId === o.id).length;
                    const inc = COLLAB_EDGES.filter((e) => e.targetOrgId === o.id).length;
                    return (
                      <button key={o.id} className="org-preview" onClick={() => onOpenOrg(o.id)}>
                        <div className="org-preview-head">
                          <div className="org-preview-name">{o.name}</div>
                          <CategoryTag category={o.category} />
                        </div>
                        <div className="org-preview-foot">
                          <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)' }}>provides to {out} · depends on {inc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {mode === 'selected' && (() => {
        const org = ORG_BY_ID[selOrg];
        const upstream = COLLAB_EDGES.filter((e) => e.targetOrgId === selOrg);   // providers feeding this org
        const downstream = COLLAB_EDGES.filter((e) => e.sourceOrgId === selOrg); // this org provides to
        return (
          <>
            <div className="filter-row">
              {TIER1_ORGS.map((o) => (
                <button key={o.id} className={`filter-chip ${selOrg === o.id ? 'active' : ''}`} onClick={() => setSelOrg(o.id)}>{o.name}</button>
              ))}
            </div>
            <div className="map-cols">
              <div>
                <div className="map-col-label">Upstream — provides to {org?.name}</div>
                {upstream.length === 0 ? <div className="card-section-empty">None mapped.</div> : upstream.map((e) => <EdgeCard key={e.id} edge={e} onOpenAgreement={onOpenAgreement} />)}
              </div>
              <div>
                <div className="map-col-label">{org?.name}</div>
                <button className="org-preview" onClick={() => onOpenOrg(selOrg)}>
                  <div className="org-preview-head"><div className="org-preview-name">{org?.name}</div>{org && <CategoryTag category={org.category} />}</div>
                  <div className="org-preview-mission">{org?.mission}</div>
                </button>
              </div>
              <div>
                <div className="map-col-label">Downstream — {org?.name} provides to</div>
                {downstream.length === 0 ? <div className="card-section-empty">None mapped.</div> : downstream.map((e) => <EdgeCard key={e.id} edge={e} onOpenAgreement={onOpenAgreement} />)}
              </div>
            </div>
          </>
        );
      })()}

      {mode === 'mutual' && (() => {
        const cross = crossFor(pairA, pairB);
        return (
          <>
            <div className="filter-row" style={{ gap: 12, alignItems: 'center' }}>
              <select className="admin-row-value" value={pairA} onChange={(e) => setPairA(e.target.value)}>
                {ORGANIZATIONS.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
              <span className="mono" style={{ color: 'var(--muted)' }}>↔</span>
              <select className="admin-row-value" value={pairB} onChange={(e) => setPairB(e.target.value)}>
                {ORGANIZATIONS.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
            {pairA === pairB ? <div className="card-section-empty">Pick two different organizations.</div> : cross && (
              <div className="org-panel" style={{ borderTop: 'none' }}>
                <div style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>{cross.mutualSummary}</div>
                <div className="agree-grid">
                  <LabeledList label={`${orgName(pairA)} needs from ${orgName(pairB)}`} items={cross.aNeedsFromB} empty="None recorded." />
                  <LabeledList label={`${orgName(pairB)} needs from ${orgName(pairA)}`} items={cross.bNeedsFromA} empty="None recorded." />
                  <LabeledList label={`How ${orgName(pairA)} helps`} items={cross.aHelpsB} empty="None recorded." />
                  <LabeledList label={`How ${orgName(pairB)} helps`} items={cross.bHelpsA} empty="None recorded." />
                </div>
                {cross.frictionPoints.length > 0 && <div style={{ marginTop: 14 }}><LabeledList label="Friction points" items={cross.frictionPoints} /></div>}
                {cross.nextBestActions.length > 0 && <div style={{ marginTop: 14 }}><div className="lbl-list-label">Next best actions</div><NextBestActions actions={cross.nextBestActions} /></div>}
              </div>
            )}
          </>
        );
      })()}

      {mode === 'risk' && (() => {
        const riskEdges = COLLAB_EDGES.filter((e) => e.health === 'at_risk' || e.health === 'blocked' || e.health === 'unknown');
        const staleOrgs = ORGANIZATIONS.filter((o) => o.freshness === 'stale');
        return (
          <>
            <div className="org-panel" style={{ borderTop: 'none', paddingTop: 0 }}>
              <div className="org-panel-head"><span className="org-panel-title">At-risk & blocked relationships</span><span className="section-meta">{riskEdges.length}</span></div>
              {riskEdges.map((e) => <EdgeCard key={e.id} edge={e} onOpenAgreement={onOpenAgreement} />)}
            </div>
            <div className="org-panel">
              <div className="org-panel-head"><span className="org-panel-title">Stale organization cards</span><span className="section-meta">{staleOrgs.length}</span></div>
              <div className="home-list">
                {staleOrgs.map((o) => (
                  <div key={o.id} className="home-list-item" style={{ gridTemplateColumns: '1fr auto', cursor: 'pointer' }} onClick={() => onOpenOrg(o.id)}>
                    <div><div className="hli-title">{o.name}</div><div className="hli-sub">last reviewed {o.lastReviewedAt.slice(0, 10)}</div></div>
                    <span className="hli-action">Open →</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      })()}
    </>
  );
}
