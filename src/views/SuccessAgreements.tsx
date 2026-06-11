import { useMemo, useState } from 'react';
import type { AgreementStatus } from '../lib/types';
import { SUCCESS_AGREEMENTS } from '../data/successAgreements';
import { useOrgData } from '../lib/demoStore';
import { orgName } from '../lib/orgData';
import { agreementStatusLabel } from '../lib/readiness';
import { SuccessAgreementCard } from '../components/Org';

interface Props {
  onOpenAgreement: (id: string) => void;
  onOpenOrg: (id: string) => void;
}

const STATUSES: Array<AgreementStatus | 'all' | 'needs_refresh'> = ['all', 'published', 'mutual_review', 'shared', 'draft', 'needs_refresh'];

export default function SuccessAgreements({ onOpenAgreement }: Props) {
  const { organizations: ORGANIZATIONS } = useOrgData();
  const [status, setStatus] = useState<AgreementStatus | 'all'>('all');
  const [orgFilter, setOrgFilter] = useState<string>('all');

  const orgsWithAgreements = useMemo(() => {
    const ids = new Set(SUCCESS_AGREEMENTS.flatMap((a) => a.orgIds));
    return ORGANIZATIONS.filter((o) => ids.has(o.id));
  }, [ORGANIZATIONS]);

  const filtered = SUCCESS_AGREEMENTS.filter((a) => {
    if (status !== 'all' && a.status !== status) return false;
    if (orgFilter !== 'all' && !a.orgIds.includes(orgFilter)) return false;
    return true;
  });

  const needsRefresh = SUCCESS_AGREEMENTS.filter((a) => a.status === 'needs_refresh');

  return (
    <>
      <div className="section-head" style={{ marginBottom: 6 }}>
        <span className="display" style={{ fontSize: 24 }}>Success Agreements</span>
        <span className="section-meta">{SUCCESS_AGREEMENTS.length} agreements · six-state lifecycle</span>
      </div>
      <div className="section-desc">
        Working documents that govern how two organizations succeed together — shared outcome, what each needs,
        handoffs, decision rights, and review cadence. Not legal contracts.
      </div>

      {needsRefresh.length > 0 && (
        <div className="home-card" style={{ marginBottom: 18, borderColor: 'var(--warning)' }}>
          <div className="home-card-head">
            <div className="home-card-title">Needs refresh</div>
            <span className="home-card-meta">{needsRefresh.length}</span>
          </div>
          <div className="home-list">
            {needsRefresh.map((a) => (
              <div key={a.id} className="home-list-item" style={{ gridTemplateColumns: '1fr auto', cursor: 'pointer' }} onClick={() => onOpenAgreement(a.id)}>
                <div><div className="hli-title">{a.title}</div><div className="hli-sub">{a.orgIds.map(orgName).join(' ↔ ')} · review was due {a.nextReviewAt.slice(0, 10)}</div></div>
                <span className="hli-action">Open →</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="filter-row">
        {STATUSES.map((s) => (
          <button key={s} className={`filter-chip ${status === s ? 'active' : ''}`} onClick={() => setStatus(s as AgreementStatus | 'all')}>
            {s === 'all' ? 'All statuses' : agreementStatusLabel(s as AgreementStatus)}
          </button>
        ))}
      </div>
      <div className="filter-row">
        <button className={`filter-chip ${orgFilter === 'all' ? 'active' : ''}`} onClick={() => setOrgFilter('all')}>All organizations</button>
        {orgsWithAgreements.map((o) => (
          <button key={o.id} className={`filter-chip ${orgFilter === o.id ? 'active' : ''}`} onClick={() => setOrgFilter(o.id)}>{o.name}</button>
        ))}
      </div>

      {filtered.length === 0 ? <div style={{ fontSize: 13, color: 'var(--muted)', padding: '24px 0' }}>No agreements match these filters.</div> : (
        <div style={{ marginTop: 6 }}>
          {filtered.map((a) => <SuccessAgreementCard key={a.id} agreement={a} orgNames={a.orgIds.map(orgName)} onOpen={onOpenAgreement} />)}
        </div>
      )}
    </>
  );
}
