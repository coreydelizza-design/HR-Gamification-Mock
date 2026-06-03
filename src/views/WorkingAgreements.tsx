import { useState } from 'react';
import type { Person } from '../lib/types';
import { WORKING_AGREEMENTS, AGREEMENT_SECTIONS } from '../data/agreements';
import { TEAM_BY_ID } from '../data/teams';
import { handoffReadiness, agreementStatusLabel, agreementStatusLevel } from '../lib/readiness';
import { ReadinessMeter, StatusPill } from '../components/Shared';

interface Props {
  user: Person;
  onOpenAgreement: (id: string) => void;
}

type Tab = 'all' | 'in_progress' | 'published' | 'attention';

const TAB_LABEL: Record<Tab, string> = {
  all:         'All',
  in_progress: 'Draft · Shared · Mutual review',
  published:   'Published',
  attention:   'Needs refresh',
};

function inTab(status: string, tab: Tab): boolean {
  if (tab === 'all') return true;
  if (tab === 'in_progress') return status === 'draft' || status === 'shared' || status === 'mutual_review';
  if (tab === 'published') return status === 'published';
  if (tab === 'attention') return status === 'needs_refresh';
  return true;
}

function statusBadgeClass(status: string): string {
  if (status === 'published') return 'admin-status admin-status-connected';
  if (status === 'needs_refresh') return 'admin-status admin-status-coming';
  return 'admin-status admin-status-available';
}

export default function WorkingAgreements({ user: _user, onOpenAgreement }: Props) {
  const [tab, setTab] = useState<Tab>('all');

  const visible = WORKING_AGREEMENTS.filter((a) => inTab(a.status, tab));

  return (
    <>
      <div style={{ marginBottom: 14 }}>
        <div className="display" style={{ fontSize: 24 }}>Working Agreements</div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>
          Team-to-team operating agreements: mutual needs, required inputs, escalation paths, handoff checklists, decision rights, and review cadence.
        </div>
      </div>

      <div className="tab-strip">
        {(['all', 'published', 'in_progress', 'attention'] as const).map((k) => (
          <button key={k} className={tab === k ? 'active' : ''} onClick={() => setTab(k)}>
            {TAB_LABEL[k]} ({WORKING_AGREEMENTS.filter((a) => inTab(a.status, k)).length})
          </button>
        ))}
      </div>

      <div>
        {visible.map((a) => {
          const summary = handoffReadiness(a, AGREEMENT_SECTIONS);
          const teams = a.teamIds.map((id) => TEAM_BY_ID[id]).filter(Boolean);
          return (
            <div key={a.id} className="row-card" onClick={() => onOpenAgreement(a.id)}>
              <div className="row-card-head">
                <div>
                  <div className="row-card-title">{a.title}</div>
                  <div className="row-card-meta">
                    {teams.map((t) => t.shortName).join(' · ')} · review every {a.reviewCadenceDays}d · next {new Date(a.nextReviewAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className={statusBadgeClass(a.status)}>
                    {agreementStatusLabel(a.status)}
                  </span>
                  <StatusPill level={agreementStatusLevel(a.status)}>{agreementStatusLabel(a.status)}</StatusPill>
                </div>
              </div>
              <div className="row-card-body">{summary.rationale}</div>
              <div style={{ marginTop: 10 }}>
                <ReadinessMeter summary={summary} compact />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
