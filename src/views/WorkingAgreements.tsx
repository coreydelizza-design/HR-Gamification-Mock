import { useState } from 'react';
import type { Person, AgreementStatus } from '../lib/types';
import { WORKING_AGREEMENTS, AGREEMENT_SECTIONS } from '../data/agreements';
import { TEAM_BY_ID } from '../data/teams';
import { handoffReadiness } from '../lib/readiness';
import { ReadinessMeter, StatusPill } from '../components/Shared';

interface Props {
  user: Person;
  onOpenAgreement: (id: string) => void;
}

const TAB_LABEL: Record<'draft' | 'published' | 'all', string> = {
  draft: 'Drafts & review',
  published: 'Published',
  all: 'All',
};

export default function WorkingAgreements({ user: _user, onOpenAgreement }: Props) {
  const [tab, setTab] = useState<'draft' | 'published' | 'all'>('all');

  const visible = WORKING_AGREEMENTS.filter((a) => {
    if (tab === 'all') return true;
    if (tab === 'draft') return a.status === 'draft' || a.status === 'review';
    if (tab === 'published') return a.status === 'published';
    return true;
  });

  return (
    <>
      <div style={{ marginBottom: 14 }}>
        <div className="display" style={{ fontSize: 24 }}>Working Agreements</div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>
          Team-to-team operating agreements: mutual needs, required inputs, escalation paths, handoff checklists, and review cadence.
        </div>
      </div>

      <div className="tab-strip">
        {(['all', 'published', 'draft'] as const).map((k) => (
          <button key={k} className={tab === k ? 'active' : ''} onClick={() => setTab(k)}>
            {TAB_LABEL[k]} ({WORKING_AGREEMENTS.filter((a) => {
              if (k === 'all') return true;
              if (k === 'draft') return a.status === 'draft' || a.status === 'review';
              return a.status === 'published';
            }).length})
          </button>
        ))}
      </div>

      <div>
        {visible.map((a) => {
          const summary = handoffReadiness(a, AGREEMENT_SECTIONS);
          const status: AgreementStatus = a.status;
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
                  <span className={`admin-status admin-status-${status === 'published' ? 'connected' : status === 'review' ? 'coming' : 'available'}`}>
                    {status}
                  </span>
                  <StatusPill level={summary.level}>{summary.label}</StatusPill>
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
