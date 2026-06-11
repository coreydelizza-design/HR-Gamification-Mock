import type { RequiredInput } from '../lib/types';
import { ORG_BY_ID, ORG_CATEGORY_LABEL } from '../data/organizations';
import { ORG_CARD_BY_ORG } from '../data/orgCards';
import { ORG_DEPENDENCIES } from '../data/orgDependencies';
import { ORG_NEEDS, ORG_OFFERS } from '../data/orgNeedsOffers';
import { SUCCESS_AGREEMENTS } from '../data/successAgreements';
import { ROLE_CARDS_BY_ORG, PEOPLE_BY_ORG } from '../data/roleCards';
import { PERSON_BY_ID, WORK_CARD_BY_PERSON, CARD_ANSWERS } from '../data/people';
import { successFor, orgName } from '../lib/orgData';
import { levelColor } from '../lib/readiness';
import { Ring, StatusPill } from '../components/Shared';
import { IconArrowLeft } from '../components/Icons';
import {
  Panel, LabeledList, Chips, MetricStrip, RiskList, NextBestActions,
  EngagementModelPanel, MeetingNormsPanel, HandoffRulesPanel,
  DependencyPanel, NeedsOffersPanel, NestedIndividualCard, RoleCardPreview,
  CategoryTag, OrgFreshnessBadge, OrgPackBadge, DimensionGrid,
  SuccessAgreementCard,
} from '../components/Org';

interface Props {
  orgId: string | null;
  onBack: () => void;
  onOpenOrg: (id: string) => void;
  onOpenAgreement: (id: string) => void;
}

function RequiredInputs({ inputs }: { inputs: RequiredInput[] }) {
  if (inputs.length === 0) return <span className="card-section-empty">Required inputs not yet documented.</span>;
  return (
    <div className="home-list">
      {inputs.map((ri, i) => (
        <div key={i} className="home-list-item" style={{ gridTemplateColumns: '1fr auto', cursor: 'default' }}>
          <div>
            <div className="hli-title" style={{ fontWeight: 500, fontSize: 12.5 }}>{ri.input}</div>
            <div className="hli-sub">{ri.format} · {ri.timing} · quality bar: {ri.qualityBar}</div>
          </div>
          {ri.fromOrgId && <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)' }}>{orgName(ri.fromOrgId)}</span>}
        </div>
      ))}
    </div>
  );
}

export default function OrganizationCardDetail({ orgId, onBack, onOpenOrg, onOpenAgreement }: Props) {
  const org = orgId ? ORG_BY_ID[orgId] : undefined;
  if (!org) return <div style={{ fontSize: 13, color: 'var(--muted)' }}>Organization not found. <button className="detail-back" onClick={onBack}>Back</button></div>;

  const card = ORG_CARD_BY_ORG[org.id];
  const analysis = successFor(org.id);
  const published = new Set(card?.publishedSections ?? []);
  const agreements = SUCCESS_AGREEMENTS.filter((a) => a.orgIds.includes(org.id));
  const roleCards = ROLE_CARDS_BY_ORG[org.id] ?? [];
  const peopleIds = PEOPLE_BY_ORG[org.id] ?? [];

  const NotPublished = () => <div className="card-section-empty">Section not yet published — this card publishes at catalog depth.</div>;

  return (
    <>
      <button className="detail-back" onClick={onBack}><IconArrowLeft size={13} /> Organization Cards</button>

      <div className="detail-hero">
        <div>
          <div className="detail-title">{org.name}</div>
          <div className="detail-sub">{org.mission}</div>
          <div className="detail-meta-row">
            <CategoryTag category={org.category} />
            <OrgPackBadge packId={org.orgPackId} />
            <OrgFreshnessBadge state={org.freshness} />
            {org.parentOrgId && (
              <button className="cat-tag" style={{ cursor: 'pointer' }} onClick={() => onOpenOrg(org.parentOrgId!)}>
                ↑ {orgName(org.parentOrgId)}
              </button>
            )}
            <span className="tier-chip mono">Tier {org.tier}</span>
          </div>
        </div>
        {analysis && (
          <div style={{ textAlign: 'center' }}>
            <Ring value={analysis.successReadinessScore} max={100} size={92} stroke={6} color={levelColor(analysis.level)} />
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.06em' }}>Success readiness</div>
          </div>
        )}
      </div>

      {/* 1 · Overview */}
      <Panel title="Overview" n="01">
        <div className="agree-grid">
          <div className="agree-block"><div className="agree-block-label">Executive owner</div><div className="agree-block-body">{org.executiveOwner}</div></div>
          <div className="agree-block"><div className="agree-block-label">Operating owner</div><div className="agree-block-body">{org.operatingOwner}</div></div>
          <div className="agree-block"><div className="agree-block-label">Category · members</div><div className="agree-block-body">{ORG_CATEGORY_LABEL[org.category]} · {org.memberCount} people</div></div>
          <div className="agree-block"><div className="agree-block-label">Key partner orgs</div><div className="agree-block-body">{org.partnerOrgIds.map(orgName).join(', ')}</div></div>
        </div>
        {analysis && (
          <div style={{ marginTop: 14 }}>
            <div className="lbl-list-label">Success readiness — {analysis.dimensions.length} explainable dimensions</div>
            <DimensionGrid analysis={analysis} />
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>{analysis.scoreRationale}</div>
          </div>
        )}
      </Panel>

      {/* 2 · How this organization succeeds */}
      <Panel title="How this organization succeeds" n="02">
        {published.has('how_succeeds') && card ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <MetricStrip metrics={card.operatingMetrics} />
            <div className="agree-grid">
              <LabeledList label="Mission-critical outcomes" items={card.missionCriticalOutcomes} />
              <LabeledList label="Top success conditions" items={card.successConditions} />
              <LabeledList label="Leading indicators" items={card.leadingIndicators} />
              <LabeledList label="Lagging indicators" items={card.laggingIndicators} />
              <LabeledList label="Capacity signals" items={card.capacitySignals} />
              <LabeledList label="Quality signals" items={card.qualitySignals} />
              <LabeledList label="Risk signals" items={card.riskSignals} />
              <LabeledList label="Stakeholder outcomes" items={card.stakeholderOutcomes} />
            </div>
            <div className="detail-meta-row">
              <span className="lbl-list-label" style={{ margin: 0 }}>Maturity</span>
              <span className="soft-chip">{card.maturityLevel}</span>
            </div>
            {card.currentBlockers.length > 0 && <LabeledList label="Current blockers" items={card.currentBlockers} />}
            {card.nextBestActions.length > 0 && (
              <div><div className="lbl-list-label">Next best actions</div><NextBestActions actions={card.nextBestActions} /></div>
            )}
          </div>
        ) : <NotPublished />}
      </Panel>

      {/* 3 · What this organization owns */}
      <Panel title="What this organization owns" n="03">
        {published.has('what_owns') && card ? (
          <div className="agree-grid">
            <LabeledList label="Responsibilities" items={card.responsibilities} />
            <LabeledList label="Services" items={card.services} />
            <LabeledList label="Systems" items={card.systems} />
            <LabeledList label="Decisions" items={card.decisions} />
            <LabeledList label="Processes" items={card.processes} />
            <LabeledList label="Business outcomes" items={card.businessOutcomes} />
            <LabeledList label="Artifacts produced" items={card.artifactsProduced} />
            <LabeledList label="Governance areas" items={card.governanceAreas} />
            <div style={{ gridColumn: '1 / -1' }}><LabeledList label="Explicitly NOT owned" items={card.notOwned} empty="Non-ownership not yet stated — a common source of friction." /></div>
          </div>
        ) : <NotPublished />}
      </Panel>

      {/* 4 · What this organization needs from others */}
      <Panel title="What this organization needs from others" n="04">
        {published.has('what_needs') && card ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div><div className="lbl-list-label">Required inputs</div><RequiredInputs inputs={card.requiredInputs} /></div>
            <div className="agree-grid">
              <LabeledList label="Missing-input failure modes" items={card.missingInputFailureModes} />
              <LabeledList label="Escalation triggers" items={card.escalationTriggers} />
              <LabeledList label="Common misconceptions" items={card.commonMisconceptions} />
              <LabeledList label="Rework causes" items={card.reworkCauses} />
              <LabeledList label="Delay causes" items={card.delayCauses} />
            </div>
          </div>
        ) : <NotPublished />}
      </Panel>

      {/* 5 · How this organization helps others succeed */}
      <Panel title="How this organization helps others succeed" n="05">
        {published.has('how_helps') && card ? (
          <div className="agree-grid">
            <LabeledList label="Outputs" items={card.outputs} />
            <LabeledList label="Services offered" items={card.servicesOffered} />
            <LabeledList label="Expertise" items={card.expertise} />
            <LabeledList label="Decision support" items={card.decisionSupport} />
            <LabeledList label="Enablement" items={card.enablement} />
            <LabeledList label="Risk reduction" items={card.riskReduction} />
            <LabeledList label="Acceleration" items={card.acceleration} />
            <LabeledList label="Advisory role" items={card.advisoryRole} />
            <LabeledList label="Reusable artifacts" items={card.reusableArtifacts} />
            <LabeledList label="Service expectations (SLEs)" items={card.serviceExpectations} />
            <div style={{ gridColumn: '1 / -1' }}><LabeledList label="Best ways to engage" items={card.bestWaysToEngage} /></div>
          </div>
        ) : <NotPublished />}
      </Panel>

      {/* 6 · Cross-org dependencies */}
      <Panel title="Cross-org dependencies" n="06">
        <DependencyPanel org={org} dependencies={ORG_DEPENDENCIES} orgName={orgName} onOpenOrg={onOpenOrg} />
        <div style={{ marginTop: 16 }}>
          <NeedsOffersPanel org={org} needs={ORG_NEEDS} offers={ORG_OFFERS} orgName={orgName} />
        </div>
      </Panel>

      {/* 7 · Engagement model */}
      <Panel title="Engagement model" n="07">
        {card ? <EngagementModelPanel card={card} /> : <NotPublished />}
      </Panel>

      {/* 8 · Meeting norms */}
      <Panel title="Meeting norms" n="08">
        {card ? <MeetingNormsPanel card={card} /> : <NotPublished />}
      </Panel>

      {/* 9 · Handoff rules */}
      <Panel title="Handoff rules" n="09">
        {published.has('handoff_rules') && card ? <HandoffRulesPanel card={card} /> : <NotPublished />}
      </Panel>

      {/* 10 · Success agreements */}
      <Panel title="Success agreements" n="10">
        {agreements.length === 0 ? <span className="card-section-empty">No Success Agreements cover this organization yet.</span> : (
          <div>{agreements.map((a) => (
            <SuccessAgreementCard key={a.id} agreement={a} orgNames={a.orgIds.map(orgName)} onOpen={onOpenAgreement} />
          ))}</div>
        )}
      </Panel>

      {/* 11 · People and role cards */}
      <Panel title="People and role cards" n="11">
        <div style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 10 }}>
          Individual cards are nested supporting context — subordinate to the organization.
        </div>
        {roleCards.length > 0 && (
          <div className="home-list" style={{ marginBottom: 14 }}>
            {roleCards.map((rc) => <RoleCardPreview key={rc.id} roleCard={rc} person={rc.personId ? PERSON_BY_ID[rc.personId] : undefined} />)}
          </div>
        )}
        {peopleIds.length > 0 ? (
          <div className="agree-grid">
            {peopleIds.map((pid) => {
              const p = PERSON_BY_ID[pid];
              return p ? <NestedIndividualCard key={pid} person={p} workCard={WORK_CARD_BY_PERSON[pid]} answers={CARD_ANSWERS} /> : null;
            })}
          </div>
        ) : <span className="card-section-empty">No nested individual cards published for this organization in the demo dataset.</span>}
      </Panel>

      {/* 12 · Risks and blockers */}
      <Panel title="Risks and blockers" n="12">
        {published.has('risks') && card ? <RiskList risks={card.risks} /> : <NotPublished />}
      </Panel>

      {/* 13 · Freshness and governance */}
      <Panel title="Freshness and governance" n="13">
        <div className="agree-grid">
          <div className="agree-block"><div className="agree-block-label">Card owner</div><div className="agree-block-body">{org.operatingOwner}</div></div>
          <div className="agree-block"><div className="agree-block-label">Freshness</div><div className="agree-block-body" style={{ display: 'flex', gap: 8, alignItems: 'center' }}><OrgFreshnessBadge state={org.freshness} /></div></div>
          <div className="agree-block"><div className="agree-block-label">Last reviewed</div><div className="agree-block-body">{org.lastReviewedAt.slice(0, 10)}</div></div>
          <div className="agree-block"><div className="agree-block-label">Next review</div><div className="agree-block-body">{org.nextReviewAt.slice(0, 10)}</div></div>
          <div className="agree-block"><div className="agree-block-label">Visibility</div><div className="agree-block-body">{org.visibility}</div></div>
          <div className="agree-block"><div className="agree-block-label">Published sections</div><div className="agree-block-body">{card ? `${card.publishedSections.length} of 13` : 'card not published'}</div></div>
        </div>
        {card && card.publishedSections.length < 13 && (
          <div style={{ marginTop: 12 }}>
            <div className="lbl-list-label">Sections not yet published</div>
            <Chips items={(['overview', 'how_succeeds', 'what_owns', 'what_needs', 'how_helps', 'dependencies', 'engagement', 'meeting_norms', 'handoff_rules', 'agreements', 'people', 'risks', 'freshness'] as const).filter((k) => !published.has(k)).map((k) => k.replace(/_/g, ' '))} />
          </div>
        )}
        <div style={{ fontSize: 11, color: 'var(--subtle)', marginTop: 12 }}>Audit trail · consent · retention — governed by the {org.orgPackId} pack (placeholder for Phase 2).</div>
      </Panel>

      {analysis && (analysis.topRisks.length > 0 || analysis.nextBestActions.length > 0) && (
        <div className="home-card" style={{ marginTop: 18 }}>
          <div className="home-card-head"><div className="home-card-title">Next best actions for {org.name}</div><span className="home-card-meta">from success analysis</span></div>
          <NextBestActions actions={analysis.nextBestActions} />
          {analysis.helpNeededFrom.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div className="lbl-list-label">Most useful help would come from</div>
              <div className="home-list">
                {analysis.helpNeededFrom.slice(0, 4).map((h, i) => (
                  <div key={i} className="home-list-item" style={{ gridTemplateColumns: '1fr auto', cursor: 'pointer' }} onClick={() => onOpenOrg(h.orgId)}>
                    <div><div className="hli-title">{orgName(h.orgId)}</div><div className="hli-sub">{h.why}</div></div>
                    <span className="hli-action">Open →</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
