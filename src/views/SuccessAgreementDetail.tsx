import { SUCCESS_AGREEMENT_BY_ID, SUCCESS_AGREEMENT_SECTIONS } from '../data/successAgreements';
import { useOrgData } from '../lib/demoStore';
import { crossFor, orgName } from '../lib/orgData';
import { IconArrowLeft } from '../components/Icons';
import { AgreementStatusBadge, OrgFreshnessBadge, NextBestActions, LabeledList } from '../components/Org';

interface Props {
  agreementId: string | null;
  onBack: () => void;
  onOpenOrg: (id: string) => void;
}

export default function SuccessAgreementDetail({ agreementId, onBack, onOpenOrg }: Props) {
  const { orgById: ORG_BY_ID } = useOrgData();
  const agreement = agreementId ? SUCCESS_AGREEMENT_BY_ID[agreementId] : undefined;
  if (!agreement) return <div style={{ fontSize: 13, color: 'var(--muted)' }}>Agreement not found. <button className="detail-back" onClick={onBack}>Back</button></div>;

  const sections = SUCCESS_AGREEMENT_SECTIONS.filter((s) => s.agreementId === agreement.id);
  const [aId, bId] = agreement.orgIds;
  const cross = aId && bId ? crossFor(aId, bId) : undefined;

  return (
    <>
      <button className="detail-back" onClick={onBack}><IconArrowLeft size={13} /> Success Agreements</button>

      <div className="detail-hero">
        <div>
          <div className="detail-title">{agreement.title}</div>
          <div className="detail-sub">{agreement.sharedBusinessOutcome}</div>
          <div className="detail-meta-row">
            <AgreementStatusBadge status={agreement.status} />
            <OrgFreshnessBadge state={agreement.freshness} />
            <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>review every {agreement.reviewCadenceDays}d · next {agreement.nextReviewAt.slice(0, 10)}</span>
          </div>
          <div className="detail-meta-row">
            {agreement.orgIds.map((id) => (
              <button key={id} className="cat-tag" style={{ cursor: 'pointer' }} onClick={() => onOpenOrg(id)}>{orgName(id)} · {agreement.ownerByOrg[id]}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Agreement sections */}
      <div className="org-panel">
        <div className="org-panel-head"><span className="org-panel-title">Agreement</span></div>
        <div className="agree-grid">
          {sections.map((s) => (
            <div key={s.id} className="agree-block" style={s.key === 'shared_business_outcome' ? { gridColumn: '1 / -1' } : undefined}>
              <div className="agree-block-label">{s.label}</div>
              <div className="agree-block-body">{s.body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-org analysis */}
      {cross && (
        <div className="org-panel">
          <div className="org-panel-head"><span className="org-panel-title">Mutual success analysis</span></div>
          <div style={{ fontSize: 12.5, color: 'var(--ink)', lineHeight: 1.6, marginBottom: 14 }}>{cross.mutualSummary}</div>
          <div className="agree-grid">
            <LabeledList label={`${ORG_BY_ID[aId!]?.name} needs from ${ORG_BY_ID[bId!]?.name}`} items={cross.aNeedsFromB} empty="None recorded." />
            <LabeledList label={`${ORG_BY_ID[bId!]?.name} needs from ${ORG_BY_ID[aId!]?.name}`} items={cross.bNeedsFromA} empty="None recorded." />
            <LabeledList label={`How ${ORG_BY_ID[aId!]?.name} helps`} items={cross.aHelpsB} empty="None recorded." />
            <LabeledList label={`How ${ORG_BY_ID[bId!]?.name} helps`} items={cross.bHelpsA} empty="None recorded." />
          </div>

          {cross.frictionPoints.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <LabeledList label="Friction points (organization-level)" items={cross.frictionPoints} />
            </div>
          )}

          {cross.recommendedClauses.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <div className="lbl-list-label">Recommended clauses</div>
              <div className="home-list">
                {cross.recommendedClauses.map((c, i) => (
                  <div key={i} className="home-list-item" style={{ gridTemplateColumns: '160px 1fr', cursor: 'default' }}>
                    <span className="soft-chip">{c.forGap}</span>
                    <div><div className="hli-title" style={{ fontWeight: 400, fontSize: 12.5 }}>{c.recommendation}</div><div className="hli-sub">{c.rationale}</div></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 14 }}>
            <div className="lbl-list-label">Meeting fit</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>{cross.meetingGuidance}</div>
          </div>

          {cross.nextBestActions.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <div className="lbl-list-label">Next best actions</div>
              <NextBestActions actions={cross.nextBestActions} />
            </div>
          )}
        </div>
      )}
    </>
  );
}
