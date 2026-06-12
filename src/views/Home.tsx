import { useMemo } from 'react';
import type { Person, ViewKey } from '../lib/types';
import { useOrgData } from '../lib/demoStore';
import { ORG_DEPENDENCIES } from '../data/orgDependencies';
import { SUCCESS_AGREEMENTS } from '../data/successAgreements';
import { ORG_MEETINGS, ORG_MEETING_FITS, ORG_MEETING_FIT_BY_MEETING } from '../data/meetingFit';
import { successFor, orgName } from '../lib/orgData';
import { levelColor } from '../lib/readiness';
import { classifyMeeting, inviteesFor, canDelegate, marginalCost, money } from '../lib/proxyEngine';
import { roleBandOfPerson } from '../data/roleCards';
import { Bar, StatusPill } from '../components/Shared';
import { AgreementStatusBadge, MeetingFitBadge } from '../components/Org';

interface Props {
  user: Person;
  onNavigate: (v: ViewKey) => void;
  onOpenOrg: (id: string) => void;
  onOpenAgreement: (id: string) => void;
  onOpenMeeting: (id: string) => void;
}

const SPINE: Array<{ label: string; viewKey?: ViewKey }> = [
  { label: 'Organization Catalog', viewKey: 'organizations' },
  { label: 'Organization Card', viewKey: 'organizations' },
  { label: 'Success Model', viewKey: 'organizations' },
  { label: 'Cross-Org Needs', viewKey: 'collaboration-map' },
  { label: 'Success Agreements', viewKey: 'success-agreements' },
  { label: 'Meeting Fit', viewKey: 'meeting-fit' },
  { label: 'Collaboration Map', viewKey: 'collaboration-map' },
  { label: 'Org Intelligence', viewKey: 'org-insights' },
];

const HELP_ROTATION = [
  'Enterprise Architecture helps Engineering by clarifying target-state patterns before delivery starts.',
  'Revenue Operations helps Sales by improving forecast hygiene and instrumenting the pipeline.',
  'Customer Success helps Product by surfacing the retention signals behind the roadmap.',
  'Legal helps Sales by reducing commercial risk and accelerating reviews when intake is complete.',
];

export default function Home({ user, onNavigate, onOpenOrg, onOpenAgreement, onOpenMeeting }: Props) {
  const { organizations: ORGANIZATIONS, orgById: ORG_BY_ID, orgCardByOrg: ORG_CARD_BY_ORG, rateCard } = useOrgData();
  const analyses = useMemo(() => ORGANIZATIONS.map((o) => ({ org: o, a: successFor(o.id)! })), [ORGANIZATIONS]);

  // "Your week" — the signed-in persona's meetings, delegate-eligibility, returnable seat-time.
  const myWeek = useMemo(() => {
    const mine = ORG_MEETINGS.filter((m) => inviteesFor(m).some((i) => i.personId === user.id));
    let eligible = 0; let returnable = 0;
    const band = roleBandOfPerson(user.id);
    for (const m of mine) {
      const inv = inviteesFor(m).find((i) => i.personId === user.id);
      if (!inv) continue;
      const { cls } = classifyMeeting(m);
      if (canDelegate(inv.requirement, cls, inv.criticality)) {
        eligible += 1;
        returnable += marginalCost(band, m.durationMinutes, rateCard);
      }
    }
    return { count: mine.length, eligible, returnable };
  }, [user.id, rateCard]);

  // Six enterprise readiness meters
  const cardCoverage = Math.round(ORGANIZATIONS.reduce((s, o) => s + ((ORG_CARD_BY_ORG[o.id]?.publishedSections.length ?? 0) / 13), 0) / ORGANIZATIONS.length * 100);
  const agrPublished = SUCCESS_AGREEMENTS.filter((a) => a.status === 'published').length;
  const agreementCoverage = Math.round(agrPublished / SUCCESS_AGREEMENTS.length * 100);
  const fitReady = ORG_MEETING_FITS.filter((f) => f.status === 'ready' || f.status === 'decision_ready').length;
  const meetingFitReadiness = Math.round(fitReady / ORG_MEETING_FITS.length * 100);
  const orgsWithHandoff = ORGANIZATIONS.filter((o) => (ORG_CARD_BY_ORG[o.id]?.handoffRules.length ?? 0) > 0).length;
  const handoffClarity = Math.round(orgsWithHandoff / ORGANIZATIONS.length * 100);
  const depHealthy = ORG_DEPENDENCIES.filter((d) => d.health === 'healthy').length;
  const dependencyHealth = Math.round(depHealthy / ORG_DEPENDENCIES.length * 100);
  const freshCount = ORGANIZATIONS.filter((o) => o.freshness === 'fresh').length;
  const freshness = Math.round(freshCount / ORGANIZATIONS.length * 100);
  const revenueResponsible = analyses.filter(({ org }) => {
    const r = ORG_CARD_BY_ORG[org.id]?.commercial?.revenueRole;
    return r === 'pl_owner' || r === 'revenue_generating';
  });
  const revClear = revenueResponsible.filter(({ a }) => a.successReadinessScore >= 80).length;
  const revenueClarity = revenueResponsible.length ? Math.round(revClear / revenueResponsible.length * 100) : 0;

  const meters: Array<{ label: string; pct: number; rationale: string }> = [
    { label: 'Org-card coverage', pct: cardCoverage, rationale: 'Average of published sections across all 36 organizations.' },
    { label: 'Agreement coverage', pct: agreementCoverage, rationale: `${agrPublished} of ${SUCCESS_AGREEMENTS.length} Success Agreements published.` },
    { label: 'Meeting-fit readiness', pct: meetingFitReadiness, rationale: `${fitReady} of ${ORG_MEETING_FITS.length} cross-org meetings ready.` },
    { label: 'Handoff clarity', pct: handoffClarity, rationale: `${orgsWithHandoff} organizations have published handoff rules.` },
    { label: 'Dependency health', pct: dependencyHealth, rationale: `${depHealthy} of ${ORG_DEPENDENCIES.length} dependencies healthy.` },
    { label: 'Freshness', pct: freshness, rationale: `${freshCount} of ${ORGANIZATIONS.length} cards reviewed recently.` },
    { label: 'Revenue-engine clarity', pct: revenueClarity, rationale: `${revClear} of ${revenueResponsible.length} revenue-responsible orgs are at ready threshold.` },
  ];

  const needingAttention = [...analyses]
    .filter(({ org, a }) => a.successReadinessScore < 70 || org.freshness === 'stale')
    .sort((x, y) => x.a.successReadinessScore - y.a.successReadinessScore)
    .slice(0, 5);

  const criticalRelationships = [...SUCCESS_AGREEMENTS]
    .sort((a, b) => statusRank(a.status) - statusRank(b.status))
    .slice(0, 5);

  const meetingsAtRisk = ORG_MEETINGS
    .map((m) => ({ m, fit: ORG_MEETING_FIT_BY_MEETING[m.id] }))
    .filter(({ fit }) => fit && (fit.status === 'at_risk' || fit.status === 'draft'));

  const aggregatedActions = useMemo(() => {
    const seen = new Set<string>();
    const out: Array<{ orgId: string; action: string }> = [];
    for (const { org, a } of analyses) {
      for (const action of a.nextBestActions) {
        if (!seen.has(action)) { seen.add(action); out.push({ orgId: org.id, action }); }
        if (out.length >= 7) break;
      }
      if (out.length >= 7) break;
    }
    return out;
  }, [analyses]);

  return (
    <>
      <div style={{ marginBottom: 18 }}>
        <div className="display" style={{ fontSize: 24 }}>Good morning, {user.name.split(' ')[0]}.</div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>
          Here is where organizational clarity needs attention today.
        </div>
      </div>

      <div className="spine-strip" aria-label="Product spine">
        {SPINE.map((s, i) => (
          <button key={s.label} type="button" className="spine-node" onClick={() => s.viewKey && onNavigate(s.viewKey)} title={`Open ${s.label}`}>
            <span className="spine-index">{String(i + 1).padStart(2, '0')}</span>
            <span className="spine-label">{s.label}</span>
          </button>
        ))}
      </div>

      {/* 1 · Enterprise Collaboration Readiness */}
      <div className="home-grid">
        <div className="home-card" style={{ gridColumn: '1 / -1' }}>
          <div className="home-card-head">
            <div className="home-card-title">Enterprise collaboration readiness</div>
            <span className="home-card-meta">Aggregate · not individual</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12 }}>
            {meters.map((m) => (
              <div key={m.label} className="fit-cell">
                <div className="fit-cell-label">{m.label}</div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 500, marginTop: 2 }}>{m.pct}%</div>
                <div style={{ marginTop: 6 }}><Bar value={m.pct} color={m.pct >= 80 ? 'var(--success)' : m.pct >= 55 ? 'var(--warning)' : 'var(--danger)'} height={5} /></div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8, lineHeight: 1.5 }}>{m.rationale}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {myWeek.count > 0 && (
        <div className="home-grid">
          <button type="button" className="home-card your-week" style={{ gridColumn: '1 / -1', textAlign: 'left', cursor: 'pointer' }} onClick={() => onNavigate('meeting-fit')}>
            <div className="home-card-head">
              <div className="home-card-title">Your week</div>
              <span className="home-card-meta">{user.name.split(' ')[0]} · Meeting Fit →</span>
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.6 }}>
              <strong>{myWeek.count}</strong> meeting{myWeek.count === 1 ? '' : 's'} ·{' '}
              <strong>{myWeek.eligible}</strong> delegate-eligible ·{' '}
              <strong className="mono">{money(myWeek.returnable, rateCard.currency)}</strong> of your seat-time returnable.
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
              Delegation is yours to assign — only you control your own row. Critical seats in critical meetings stay person-required.
            </div>
          </button>
        </div>
      )}

      <div className="home-grid">
        {/* 2 · Organizations Needing Attention */}
        <div className="home-card">
          <div className="home-card-head">
            <div className="home-card-title">Organizations needing attention</div>
            <span className="home-card-meta">{needingAttention.length}</span>
          </div>
          <div className="home-list">
            {needingAttention.map(({ org, a }) => (
              <div key={org.id} className="home-list-item" style={{ gridTemplateColumns: '1fr auto', cursor: 'pointer' }} onClick={() => onOpenOrg(org.id)}>
                <div>
                  <div className="hli-title">{org.name}</div>
                  <div className="hli-sub">{a.topRisks[0] ?? org.mission}</div>
                </div>
                <StatusPill level={a.level}>{a.successReadinessScore}%</StatusPill>
              </div>
            ))}
          </div>
        </div>

        {/* 3 · Critical Cross-Org Relationships */}
        <div className="home-card">
          <div className="home-card-head">
            <div className="home-card-title">Critical cross-org relationships</div>
            <span className="home-card-meta">agreements</span>
          </div>
          <div className="home-list">
            {criticalRelationships.map((a) => (
              <div key={a.id} className="home-list-item" style={{ gridTemplateColumns: '1fr auto', cursor: 'pointer' }} onClick={() => onOpenAgreement(a.id)}>
                <div>
                  <div className="hli-title">{a.orgIds.map(orgName).join(' ↔ ')}</div>
                  <div className="hli-sub">{a.title}</div>
                </div>
                <AgreementStatusBadge status={a.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="home-grid">
        {/* 4 · Meetings at Risk */}
        <div className="home-card">
          <div className="home-card-head">
            <div className="home-card-title">Meetings at risk</div>
            <span className="home-card-meta">{meetingsAtRisk.length}</span>
          </div>
          <div className="home-list">
            {meetingsAtRisk.length === 0 && <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>No meetings at risk.</div>}
            {meetingsAtRisk.map(({ m, fit }) => (
              <div key={m.id} className="home-list-item" style={{ gridTemplateColumns: '1fr auto', cursor: 'pointer' }} onClick={() => onOpenMeeting(m.id)}>
                <div>
                  <div className="hli-title">{m.title}</div>
                  <div className="hli-sub">{fit?.nextBestAction}</div>
                </div>
                {fit && <MeetingFitBadge status={fit.status} />}
              </div>
            ))}
          </div>
        </div>

        {/* 5 · How Organizations Help Each Other */}
        <div className="home-card">
          <div className="home-card-head">
            <div className="home-card-title">How organizations help each other</div>
            <span className="home-card-meta">working structure</span>
          </div>
          <div className="home-list">
            {HELP_ROTATION.map((h, i) => (
              <div key={i} className="home-list-item" style={{ gridTemplateColumns: 'auto 1fr', cursor: 'default' }}>
                <span className="mono" style={{ fontSize: 10, color: 'var(--subtle)' }}>{String(i + 1).padStart(2, '0')}</span>
                <div className="hli-sub" style={{ marginTop: 0 }}>{h}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6 · Next Best Actions */}
      <div className="home-grid">
        <div className="home-card" style={{ gridColumn: '1 / -1' }}>
          <div className="home-card-head">
            <div className="home-card-title">Next best actions</div>
            <span className="home-card-meta">aggregated across organizations</span>
          </div>
          <div className="home-list">
            {aggregatedActions.map(({ orgId, action }, i) => (
              <div key={i} className="home-list-item" style={{ gridTemplateColumns: '120px 1fr auto', cursor: 'pointer' }} onClick={() => onOpenOrg(orgId)}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{ORG_BY_ID[orgId]?.name}</span>
                <div className="hli-sub" style={{ marginTop: 0 }}>{action}</div>
                <span className="hli-action">Open →</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function statusRank(s: string): number {
  return { needs_refresh: 0, draft: 1, shared: 2, mutual_review: 3, published: 4, archived: 5 }[s] ?? 9;
}
