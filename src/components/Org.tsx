import type {
  Organization, OrganizationCard, OrgMetric, OrgRisk, OrgDependency,
  OrgNeed, OrgOffer, SuccessAgreement,
  RoleCard, Person, WorkCard, CardAnswer, AgreementStatus, MeetingFitStatus,
  DependencyHealth, FreshnessState, OrgSuccessAnalysis, ReadinessLevel,
  OrgCommercialProfile, RevenueRole, Currency, CommercialMetric,
} from '../lib/types';
import {
  levelColor, levelSoftBg, levelTextColor,
  agreementStatusLabel, agreementStatusLevel,
  meetingFitLabel, meetingFitLevel,
} from '../lib/readiness';
import { ORG_CATEGORY_LABEL } from '../data/organizations';
import { ORG_PACK_BY_ID } from '../data/orgPacks';
import { Bar, StatusPill, Avatar } from './Shared';

/* ═══════════════════════════════════════════════════════════════
   Badges & small chips
   ═══════════════════════════════════════════════════════════════ */

export function CategoryTag({ category }: { category: Organization['category'] }) {
  return <span className="cat-tag">{ORG_CATEGORY_LABEL[category]}</span>;
}

const HEALTH_LEVEL: Record<DependencyHealth, ReadinessLevel> = {
  healthy: 'ready', at_risk: 'almost', blocked: 'attention', unknown: 'unknown',
};
const HEALTH_LABEL: Record<DependencyHealth, string> = {
  healthy: 'Healthy', at_risk: 'At risk', blocked: 'Blocked', unknown: 'Unknown',
};
export function DependencyHealthBadge({ health }: { health: DependencyHealth }) {
  const level = HEALTH_LEVEL[health];
  return <StatusPill level={level}>{HEALTH_LABEL[health]}</StatusPill>;
}

export function AgreementStatusBadge({ status }: { status: AgreementStatus }) {
  return <StatusPill level={agreementStatusLevel(status)}>{agreementStatusLabel(status)}</StatusPill>;
}

export function MeetingFitBadge({ status }: { status: MeetingFitStatus }) {
  return <StatusPill level={meetingFitLevel(status)}>{meetingFitLabel(status)}</StatusPill>;
}

const FRESH_CLASS: Record<FreshnessState, string> = {
  fresh: 'fr-fresh', aging: 'fr-aging', stale: 'fr-stale', unpublished: 'fr-unknown',
};
const FRESH_LABEL: Record<FreshnessState, string> = {
  fresh: 'Fresh', aging: 'Aging', stale: 'Stale', unpublished: 'Unpublished',
};
export function OrgFreshnessBadge({ state }: { state: FreshnessState }) {
  return <span className={`freshness ${FRESH_CLASS[state]}`}>{FRESH_LABEL[state]}</span>;
}

export function OrgPackBadge({ packId }: { packId: string }) {
  const pack = ORG_PACK_BY_ID[packId];
  return <span className="badge-chip"><span className="bc-label">{pack?.name ?? packId}</span></span>;
}

/* ── Commercial profile display ───────────────────────────────── */
const REVENUE_ROLE_META: Record<RevenueRole, { label: string; cls: string }> = {
  pl_owner:            { label: 'P&L Owner',           cls: 'rev-pl' },
  revenue_generating:  { label: 'Revenue Generating',  cls: 'rev-gen' },
  revenue_influencing: { label: 'Revenue Influencing', cls: 'rev-infl' },
  enablement:          { label: 'Enablement',          cls: 'rev-enb' },
  shared_service:      { label: 'Shared Service',      cls: 'rev-shared' },
  cost_center:         { label: 'Cost Center',         cls: 'rev-cost' },
};

export function RevenueRoleBadge({ role }: { role: RevenueRole }) {
  const m = REVENUE_ROLE_META[role];
  return <span className={`rev-badge ${m.cls}`}>{m.label}</span>;
}

const CURRENCY_SYMBOL: Record<Currency, string> = { USD: '$', EUR: '€', GBP: '£' };
export function formatAmount(amount: number, currency: Currency): string {
  const s = CURRENCY_SYMBOL[currency];
  if (amount >= 1_000_000_000) return `${s}${(amount / 1_000_000_000).toFixed(amount % 1_000_000_000 === 0 ? 0 : 1)}B`;
  if (amount >= 1_000_000) return `${s}${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1)}M`;
  if (amount >= 1_000) return `${s}${(amount / 1_000).toFixed(amount % 1_000 === 0 ? 0 : 1)}K`;
  return `${s}${amount}`;
}

const METRIC_LABEL: Record<CommercialMetric, string> = {
  revenue: 'Revenue', bookings: 'Bookings', renewals: 'Renewals',
  pipeline: 'Pipeline', nrr: 'NRR', cost_savings: 'Cost savings',
};

export function CommercialStrip({ profile }: { profile: OrgCommercialProfile }) {
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
        <RevenueRoleBadge role={profile.revenueRole} />
        <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)' }}>{profile.fiscalYear}</span>
        {typeof profile.headcount === 'number' && <span className="soft-chip">{profile.headcount} headcount</span>}
        {profile.costCenterCode && <span className="soft-chip">CC {profile.costCenterCode}</span>}
      </div>
      {profile.targets.length > 0 && (
        <div className="commercial-strip">
          {profile.targets.map((t, i) => (
            <div key={i} className="tgt-tile">
              <div className="tgt-amount">{t.metric === 'nrr' ? `${t.amount}%` : formatAmount(t.amount, t.currency)}</div>
              <div className="tgt-metric">{METRIC_LABEL[t.metric]}</div>
              {typeof t.attainmentPct === 'number' && (
                <div style={{ marginTop: 6 }}>
                  <Bar value={t.attainmentPct} color={t.attainmentPct >= 90 ? 'var(--success)' : t.attainmentPct >= 70 ? 'var(--warning)' : 'var(--danger)'} height={4} />
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>{t.attainmentPct}% attainment</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {profile.keyCommercialMetrics.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <Chips items={profile.keyCommercialMetrics} />
        </div>
      )}
    </div>
  );
}

export function StrengthChip({ strength }: { strength: OrgDependency['strength'] }) {
  return <span className="mono strength-chip">{strength}</span>;
}

/* ═══════════════════════════════════════════════════════════════
   Render primitives
   ═══════════════════════════════════════════════════════════════ */

export function Panel({ title, n, action, children }: { title: string; n?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="org-panel">
      <div className="org-panel-head">
        {n && <span className="org-panel-n">{n}</span>}
        <span className="org-panel-title">{title}</span>
        {action && <span style={{ marginLeft: 'auto' }}>{action}</span>}
      </div>
      <div className="org-panel-body">{children}</div>
    </div>
  );
}

export function LabeledList({ label, items, empty = 'Not yet published.' }: { label: string; items: string[]; empty?: string }) {
  return (
    <div className="lbl-list">
      <div className="lbl-list-label">{label}</div>
      {items.length === 0
        ? <div className="card-section-empty">{empty}</div>
        : <ul className="lbl-ul">{items.map((it, i) => <li key={i}>{it}</li>)}</ul>}
    </div>
  );
}

export function Chips({ items }: { items: string[] }) {
  if (items.length === 0) return <span className="card-section-empty">Not yet published.</span>;
  return <div className="chip-row">{items.map((it, i) => <span key={i} className="soft-chip">{it}</span>)}</div>;
}

export function MetricStrip({ metrics }: { metrics: OrgMetric[] }) {
  if (metrics.length === 0) return null;
  return (
    <div className="metric-strip">
      {metrics.map((m, i) => (
        <div key={i} className="metric-strip-cell">
          <div className="metric-strip-value">{m.value}</div>
          <div className="metric-strip-label">{m.label}</div>
          <div className="metric-strip-kind mono">{m.kind}{m.trend ? ` · ${m.trend}` : ''}</div>
        </div>
      ))}
    </div>
  );
}

const RISK_LEVEL: Record<OrgRisk['severity'], ReadinessLevel> = {
  low: 'ready', medium: 'almost', high: 'attention',
};
export function RiskList({ risks }: { risks: OrgRisk[] }) {
  if (risks.length === 0) return <span className="card-section-empty">No risks recorded.</span>;
  return (
    <div className="home-list">
      {risks.map((r, i) => (
        <div key={i} className="home-list-item" style={{ gridTemplateColumns: 'auto 1fr auto', cursor: 'default' }}>
          <span className="mono risk-kind">{r.kind.replace(/_/g, ' ')}</span>
          <div>
            <div className="hli-title" style={{ fontWeight: 400, fontSize: 12.5 }}>{r.description}</div>
            {r.mitigation && <div className="hli-sub">Mitigation: {r.mitigation}</div>}
          </div>
          <StatusPill level={RISK_LEVEL[r.severity]}>{r.severity}</StatusPill>
        </div>
      ))}
    </div>
  );
}

export function NextBestActions({ actions }: { actions: string[] }) {
  if (actions.length === 0) return <span className="card-section-empty">No actions outstanding.</span>;
  return (
    <ul className="nba-list">
      {actions.map((a, i) => <li key={i}><span className="nba-arrow mono">→</span>{a}</li>)}
    </ul>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Composite panels (shared across detail views)
   ═══════════════════════════════════════════════════════════════ */

export function EngagementModelPanel({ card }: { card: OrganizationCard }) {
  const e = card.engagement;
  return (
    <div className="agree-grid">
      <div className="agree-block"><div className="agree-block-label">How to engage</div><div className="agree-block-body">{e.howToEngage}</div></div>
      <div className="agree-block"><div className="agree-block-label">Intake process</div><div className="agree-block-body">{e.intakeProcess}</div></div>
      <div className="agree-block"><div className="agree-block-label">Contact · rhythm</div><div className="agree-block-body">{e.contactChannel} · {e.responseRhythm}{e.officeHours ? ` · ${e.officeHours}` : ''}</div></div>
      <div className="agree-block"><div className="agree-block-label">Cadence</div><div className="agree-block-body">{e.cadenceStyle.replace(/_/g, '-')}</div></div>
      <div className="agree-block"><div className="agree-block-label">Decision rights</div><div className="agree-block-body"><Chips items={e.decisionRights} /></div></div>
      <div className="agree-block"><div className="agree-block-label">Approval rights</div><div className="agree-block-body"><Chips items={e.approvalRights} /></div></div>
      <div className="agree-block" style={{ gridColumn: '1 / -1' }}><div className="agree-block-label">Escalation path</div><div className="agree-block-body">{e.escalationPath}</div></div>
      {e.intakeFields.length > 0 && (
        <div className="agree-block" style={{ gridColumn: '1 / -1' }}><div className="agree-block-label">Required intake fields</div><div className="agree-block-body"><Chips items={e.intakeFields} /></div></div>
      )}
    </div>
  );
}

export function MeetingNormsPanel({ card }: { card: OrganizationCard }) {
  const m = card.meetingNorms;
  return (
    <div className="agree-grid">
      <div className="agree-block"><div className="agree-block-label">Include when</div><div className="agree-block-body"><Chips items={m.includeWhen} /></div></div>
      <div className="agree-block"><div className="agree-block-label">Do not include when</div><div className="agree-block-body"><Chips items={m.doNotIncludeWhen} /></div></div>
      <div className="agree-block"><div className="agree-block-label">Required pre-read</div><div className="agree-block-body">{m.requiredPreRead}</div></div>
      <div className="agree-block"><div className="agree-block-label">Required agenda</div><div className="agree-block-body">{m.requiredAgenda}</div></div>
      <div className="agree-block"><div className="agree-block-label">Length · cadence</div><div className="agree-block-body">{m.preferredLength} · {m.preferredCadence}</div></div>
      <div className="agree-block"><div className="agree-block-label">Decision owner required</div><div className="agree-block-body">{m.requiredDecisionOwner ? 'Yes' : 'No'}</div></div>
      {m.asyncAlternatives.length > 0 && (
        <div className="agree-block"><div className="agree-block-label">Async alternatives</div><div className="agree-block-body"><Chips items={m.asyncAlternatives} /></div></div>
      )}
      <div className="agree-block"><div className="agree-block-label">Recurring rules</div><div className="agree-block-body">{m.recurringRules}</div></div>
    </div>
  );
}

export function HandoffRulesPanel({ card }: { card: OrganizationCard }) {
  if (card.handoffRules.length === 0) return <span className="card-section-empty">No handoff rules published yet.</span>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {card.handoffRules.map((h) => (
        <div key={h.id} className="fit-cell">
          <div className="fit-cell-label">{h.name} · owner: {h.handoffOwner}</div>
          <div className="agree-grid" style={{ marginTop: 8 }}>
            <div><div className="lbl-list-label">Checklist</div><ul className="lbl-ul">{h.checklist.map((c, i) => <li key={i}>{c}</li>)}</ul></div>
            <div><div className="lbl-list-label">Definition of done</div><ul className="lbl-ul">{h.definitionOfDone.map((c, i) => <li key={i}>{c}</li>)}</ul></div>
            {h.definitionOfReady.length > 0 && <div><div className="lbl-list-label">Definition of ready</div><ul className="lbl-ul">{h.definitionOfReady.map((c, i) => <li key={i}>{c}</li>)}</ul></div>}
            {h.failureModes.length > 0 && <div><div className="lbl-list-label">Failure modes</div><ul className="lbl-ul">{h.failureModes.map((c, i) => <li key={i}>{c}</li>)}</ul></div>}
          </div>
          {h.recoveryPath && <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 8 }}>Recovery: {h.recoveryPath}</div>}
        </div>
      ))}
    </div>
  );
}

export function DependencyPanel({
  org, dependencies, orgName, onOpenOrg,
}: { org: Organization; dependencies: OrgDependency[]; orgName: (id: string) => string; onOpenOrg?: (id: string) => void }) {
  const upstream = dependencies.filter((d) => d.fromOrgId === org.id);   // org depends on others
  const downstream = dependencies.filter((d) => d.toOrgId === org.id);   // others depend on org
  const Row = ({ d, otherId, dir }: { d: OrgDependency; otherId: string; dir: string }) => (
    <div className="home-list-item" style={{ gridTemplateColumns: '1fr auto auto', cursor: onOpenOrg ? 'pointer' : 'default' }} onClick={() => onOpenOrg?.(otherId)}>
      <div>
        <div className="hli-title">{dir} {orgName(otherId)}</div>
        <div className="hli-sub">{d.requiredInput || d.outputProvided} — {d.risk}</div>
      </div>
      <StrengthChip strength={d.strength} />
      <DependencyHealthBadge health={d.health} />
    </div>
  );
  return (
    <div className="agree-grid">
      <div>
        <div className="lbl-list-label">Upstream — {org.name} depends on</div>
        <div className="home-list">{upstream.length === 0 ? <span className="card-section-empty">None mapped.</span> : upstream.map((d) => <Row key={d.id} d={d} otherId={d.toOrgId} dir="↑" />)}</div>
      </div>
      <div>
        <div className="lbl-list-label">Downstream — depend on {org.name}</div>
        <div className="home-list">{downstream.length === 0 ? <span className="card-section-empty">None mapped.</span> : downstream.map((d) => <Row key={d.id} d={d} otherId={d.fromOrgId} dir="↓" />)}</div>
      </div>
    </div>
  );
}

export function NeedsOffersPanel({
  org, needs, offers, orgName,
}: { org: Organization; needs: OrgNeed[]; offers: OrgOffer[]; orgName: (id: string) => string }) {
  const myNeeds = needs.filter((n) => n.ownerOrgId === org.id);
  const myOffers = offers.filter((o) => o.ownerOrgId === org.id);
  const NEED_LEVEL: Record<OrgNeed['status'], ReadinessLevel> = { covered: 'ready', open: 'almost', gap: 'attention' };
  return (
    <div className="agree-grid">
      <div>
        <div className="lbl-list-label">Needs from other organizations</div>
        <div className="home-list">
          {myNeeds.length === 0 ? <span className="card-section-empty">None documented.</span> : myNeeds.map((n) => (
            <div key={n.id} className="home-list-item" style={{ gridTemplateColumns: '1fr auto', cursor: 'default' }}>
              <div><div className="hli-title" style={{ fontWeight: 400, fontSize: 12.5 }}>{n.description}</div><div className="hli-sub">from {orgName(n.needFromOrgId)} · {n.format} · {n.timing}</div></div>
              <StatusPill level={NEED_LEVEL[n.status]}>{n.status}</StatusPill>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="lbl-list-label">Helps other organizations by</div>
        <div className="home-list">
          {myOffers.length === 0 ? <span className="card-section-empty">None documented.</span> : myOffers.map((o) => (
            <div key={o.id} className="home-list-item" style={{ gridTemplateColumns: '1fr auto', cursor: 'default' }}>
              <div><div className="hli-title" style={{ fontWeight: 400, fontSize: 12.5 }}>{o.description}</div><div className="hli-sub">to {orgName(o.offeredToOrgId)} · {o.serviceLevel}</div></div>
              <span className="freshness fr-unknown">{o.active ? 'active' : 'paused'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Nested individual context (the meeting-prep survival rule)
   ═══════════════════════════════════════════════════════════════ */

export function NestedIndividualCard({
  person, workCard, answers,
}: { person: Person; workCard?: WorkCard; answers: CardAnswer[] }) {
  const get = (key: string) => answers.find((a) => a.cardId === workCard?.id && a.sectionKey === key)?.body;
  const comm = get('communication');
  const mtg = get('meetings');
  const esc = get('escalation');
  return (
    <div className="nested-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <Avatar person={person} size={32} />
        <div>
          <div className="hli-title">{person.name}</div>
          <div className="hli-sub">{person.role} · {person.timeZone.split('/')[1]?.replace('_', ' ')} · {person.workingHours}</div>
        </div>
      </div>
      {comm && <div className="nested-line"><span className="nested-key mono">comms</span>{comm}</div>}
      {mtg && <div className="nested-line"><span className="nested-key mono">meetings</span>{mtg}</div>}
      {esc && <div className="nested-line"><span className="nested-key mono">escalation</span>{esc}</div>}
      {!comm && !mtg && !esc && <div className="card-section-empty">Individual card not yet detailed.</div>}
    </div>
  );
}

export function RoleCardPreview({ roleCard, person }: { roleCard: RoleCard; person?: Person }) {
  return (
    <div className="home-list-item" style={{ gridTemplateColumns: person ? '36px 1fr auto' : '1fr auto', cursor: 'default' }}>
      {person && <Avatar person={person} size={36} />}
      <div>
        <div className="hli-title">{roleCard.title}{person ? ` · ${person.name}` : ''}</div>
        <div className="hli-sub">{roleCard.responsibilities.slice(0, 3).join(' · ')}</div>
      </div>
      <span className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{roleCard.smeTags[0]}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Preview cards (catalog, home, list views)
   ═══════════════════════════════════════════════════════════════ */

export function OrgCardPreview({
  org, score, level, revenueRole, onOpen,
}: { org: Organization; score?: number; level?: ReadinessLevel; revenueRole?: RevenueRole; onOpen: (id: string) => void }) {
  return (
    <button className="org-preview" onClick={() => onOpen(org.id)}>
      <div className="org-preview-head">
        <div>
          <div className="org-preview-name">{org.name}</div>
          <div className="org-preview-mission">{org.mission}</div>
        </div>
        <CategoryTag category={org.category} />
      </div>
      {revenueRole && <div style={{ marginBottom: 10 }}><RevenueRoleBadge role={revenueRole} /></div>}
      <div className="org-preview-foot">
        <span className="mono org-preview-owner">{org.executiveOwner}</span>
        <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
          <OrgFreshnessBadge state={org.freshness} />
          {typeof score === 'number' && level && (
            <StatusPill level={level}>{score}% ready</StatusPill>
          )}
          {org.tier === 2 && <span className="tier-chip mono">catalog</span>}
        </span>
      </div>
      {typeof score === 'number' && level && (
        <div style={{ marginTop: 10 }}><Bar value={score} color={levelColor(level)} height={4} /></div>
      )}
    </button>
  );
}

export function SuccessAgreementCard({
  agreement, orgNames, onOpen,
}: { agreement: SuccessAgreement; orgNames: string[]; onOpen: (id: string) => void }) {
  return (
    <div className="row-card" onClick={() => onOpen(agreement.id)}>
      <div className="row-card-head">
        <span className="row-card-title">{agreement.title}</span>
        <AgreementStatusBadge status={agreement.status} />
      </div>
      <div className="row-card-body">{agreement.sharedBusinessOutcome}</div>
      <div className="row-card-foot">
        <span className="row-card-meta">{orgNames.join(' ↔ ')}</span>
        <span className="row-card-meta">next review {agreement.nextReviewAt.slice(0, 10)}</span>
        <OrgFreshnessBadge state={agreement.freshness} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Org success dimensions panel (used in detail + insights)
   ═══════════════════════════════════════════════════════════════ */
export function DimensionGrid({ analysis }: { analysis: OrgSuccessAnalysis }) {
  return (
    <div className="dim-grid">
      {analysis.dimensions.map((d) => (
        <div key={d.key} className="dim-cell" title={d.summary.rationale}>
          <div className="dim-cell-top">
            <span className="dim-cell-label">{d.label}</span>
            <span className="mono dim-cell-pct" style={{ color: levelColor(d.summary.level) }}>{d.summary.pct}%</span>
          </div>
          <Bar value={d.summary.pct} color={levelColor(d.summary.level)} height={4} />
          <div className="dim-cell-rationale">{d.summary.rationale}</div>
        </div>
      ))}
    </div>
  );
}

export { levelColor, levelSoftBg, levelTextColor };
