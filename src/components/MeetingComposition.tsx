import { useState } from 'react';
import type { OrgMeeting } from '../lib/types';
import { useOrgData } from '../lib/demoStore';
import { orgName, successFor } from '../lib/orgData';
import { ORG_CATEGORY_LABEL } from '../data/organizations';
import {
  analyzeMeetingOrgSet, composeExpectationsBrief, briefToMarkdown,
  type MeetingOrgSetAnalysis,
} from '../lib/meetingComposition';
import { isEscalation } from '../lib/proxyEngine';
import { levelColor } from '../lib/readiness';

/* ════════════════════════════════════════════════════════════════
   Selected-org chips — category tint + readiness dot
   ════════════════════════════════════════════════════════════════ */
export function OrgChip({ orgId, onRemove }: { orgId: string; onRemove?: () => void }) {
  const { orgById } = useOrgData();
  const org = orgById[orgId];
  const level = successFor(orgId)?.level ?? 'unknown';
  return (
    <span className="org-chip">
      <span className="org-chip-dot" style={{ background: levelColor(level) }} />
      <span>{org?.name ?? orgId}</span>
      {org && <span className="org-chip-cat">{ORG_CATEGORY_LABEL[org.category]}</span>}
      {onRemove && <button type="button" className="chip-x" onClick={onRemove} aria-label={`Remove ${org?.name}`}>×</button>}
    </span>
  );
}

export function OrgChipRow({ orgIds, onRemove }: { orgIds: string[]; onRemove?: (id: string) => void }) {
  if (orgIds.length === 0) return <span className="card-section-empty">No organizations selected yet.</span>;
  return <div className="org-chip-row">{orgIds.map((id) => <OrgChip key={id} orgId={id} onRemove={onRemove ? () => onRemove(id) : undefined} />)}</div>;
}

/* ════════════════════════════════════════════════════════════════
   Org-set strip — aggregate-first with the 4+ guardrail
   ════════════════════════════════════════════════════════════════ */
const PAIR_STATUS_CLS: Record<string, string> = {
  missing: 'ps-missing', needs_refresh: 'ps-refresh', draft: 'ps-soft', shared: 'ps-soft',
  mutual_review: 'ps-soft', archived: 'ps-soft', published: 'ps-ok',
};

function PairRow({ p }: { p: MeetingOrgSetAnalysis['pairs'][number] }) {
  return (
    <div className="pair-row">
      <span className="pair-orgs">{orgName(p.aId)} ↔ {orgName(p.bId)}</span>
      <span className={`pair-status ${PAIR_STATUS_CLS[p.status]}`}>{p.status === 'missing' ? 'no agreement' : p.status.replace('_', ' ')}</span>
      <span className="pair-rationale">{p.rationale}</span>
    </div>
  );
}

export function OrgSetStrip({ meeting }: { meeting: OrgMeeting }) {
  useOrgData(); // subscribe
  const [expanded, setExpanded] = useState(false);
  const a = analyzeMeetingOrgSet(meeting);
  const n = a.orgIds.length;

  if (n < 2) return <div className="card-section-empty">Add at least two organizations to analyze the relationship set.</div>;

  // ≤3 orgs: pairs may render individually (still worst-first).
  if (n <= 3) {
    return (
      <div className="orgset">
        <div className="orgset-summary">{n} orgs · {a.pairCount} pair relationship{a.pairCount === 1 ? '' : 's'} · {a.agreementsMissing} lack agreements · {a.inputsUnowned} required input{a.inputsUnowned === 1 ? '' : 's'} unowned</div>
        <div className="pair-list">{a.pairs.map((p) => <PairRow key={`${p.aId}-${p.bId}`} p={p} />)}</div>
      </div>
    );
  }

  // 4+ orgs: aggregate strip only, expandable worst-first detail.
  return (
    <div className="orgset">
      <div className="orgset-summary orgset-agg">
        {n} orgs · {a.pairCount} pair relationships · {a.agreementsMissing} lack agreements · {a.inputsUnowned} required inputs unowned · {a.unownedDecisions} unowned decision{a.unownedDecisions === 1 ? '' : 's'}
        <button className="hli-action" onClick={() => setExpanded((e) => !e)}>{expanded ? 'Hide detail' : 'Expand detail'}</button>
      </div>
      {expanded && <div className="pair-list">{a.pairs.map((p) => <PairRow key={`${p.aId}-${p.bId}`} p={p} />)}</div>}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   Escalation owners — suggestions + missing-path gaps
   ════════════════════════════════════════════════════════════════ */
export function EscalationOwnersPanel({
  meeting, onEditOrg, onAddAttendee,
}: { meeting: OrgMeeting; onEditOrg?: (orgId: string) => void; onAddAttendee?: (orgId: string) => void }) {
  useOrgData();
  if (!isEscalation(meeting)) return null;
  const a = analyzeMeetingOrgSet(meeting);
  return (
    <div className="org-panel esc-panel">
      <div className="org-panel-head"><span className="org-panel-title">Escalation-path owners</span><span className="proxy-class pc-critical">People-only</span></div>
      <div style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 10 }}>
        Escalation meetings are people-only by policy — every named owner must attend in person. Suggested required attendees, pulled from each org card.
      </div>
      <div className="home-list">
        {a.escalationOwners.map((e) => (
          <div key={e.orgId} className={`esc-row${e.hasPath ? '' : ' esc-gap'}`}>
            <div>
              <div className="hli-title">{e.hasPath ? (e.ownerName ?? orgName(e.orgId)) : `⚠ ${orgName(e.orgId)} has no published escalation path`}</div>
              <div className="hli-sub">{e.rationale}</div>
            </div>
            {e.hasPath
              ? (onAddAttendee && <button className="btn-ghost btn-sm" onClick={() => onAddAttendee(e.orgId)}>Add as required</button>)
              : (onEditOrg && <button className="btn-primary btn-sm" onClick={() => onEditOrg(e.orgId)}>Add escalation path →</button>)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   Meeting Expectations Brief
   ════════════════════════════════════════════════════════════════ */
export function ExpectationsBriefPanel({ meeting }: { meeting: OrgMeeting }) {
  useOrgData(); // subscribe → recompute on org/agenda/card change
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const analysis = analyzeMeetingOrgSet(meeting);
  const brief = composeExpectationsBrief(meeting, analysis);
  const md = briefToMarkdown(brief);

  const copy = async () => {
    try { await navigator.clipboard.writeText(md); setCopied(true); setTimeout(() => setCopied(false), 1500); }
    catch { /* clipboard blocked — download still available */ }
  };
  const download = () => {
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const safe = meeting.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    const aEl = document.createElement('a');
    aEl.href = url; aEl.download = `expectations-brief-${safe}.md`;
    document.body.appendChild(aEl); aEl.click(); aEl.remove(); URL.revokeObjectURL(url);
  };

  return (
    <div className="org-panel brief-panel">
      <div className="org-panel-head">
        <span className="org-panel-title">Meeting Expectations Brief</span>
        <span style={{ fontSize: 10.5, color: 'var(--muted)', marginLeft: 8 }}>composed from organization cards</span>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', gap: 6 }}>
          <button className="btn-ghost btn-sm" onClick={copy}>{copied ? 'Copied ✓' : 'Copy as Markdown'}</button>
          <button className="btn-ghost btn-sm" onClick={download}>Download .md</button>
        </span>
      </div>

      <div className="brief-purpose">{brief.purpose}</div>

      <div className="brief-orgs">
        {brief.orgs.map((o) => {
          const isOpen = open[o.orgId] ?? meeting.participatingOrgIds.length <= 3;
          return (
            <div key={o.orgId} className="brief-org">
              <button className="brief-org-head" onClick={() => setOpen((s) => ({ ...s, [o.orgId]: !isOpen }))}>
                <span className="brief-org-name">{orgName(o.orgId)}</span>
                <span className="brief-org-toggle">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div className="brief-org-body">
                  {o.walksInExpecting.length > 0 && <BriefList label="Walks in expecting" items={o.walksInExpecting} />}
                  {o.brings.length > 0 && <BriefList label="Brings" items={o.brings} />}
                  {o.decisionRights.length > 0 && <BriefList label="Decision rights in play" items={o.decisionRights} />}
                  {o.norms.length > 0 && <BriefList label="Meeting norms" items={o.norms} />}
                  {o.escalationOwner && <div className="brief-line"><span className="brief-key">Escalation owner</span>{o.escalationOwner}</div>}
                  {o.freshnessNote && <div className="brief-fresh">{o.freshnessNote}</div>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="brief-section">
        <div className="lbl-list-label">What this meeting needs to succeed</div>
        <ul className="brief-checklist">{brief.successChecklist.map((c, i) => <li key={i}>{c}</li>)}</ul>
      </div>

      {brief.caveats.length > 0 && (
        <div className="brief-caveats">
          {brief.caveats.map((c, i) => <div key={i} className="brief-caveat">{c}</div>)}
        </div>
      )}

      <div className="brief-source">{brief.sourceNote}</div>
      <div className="econ-foot">{brief.composedNote}</div>
    </div>
  );
}

function BriefList({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="brief-block">
      <div className="brief-block-label">{label}</div>
      <ul className="lbl-ul">{items.map((it, i) => <li key={i}>{it}</li>)}</ul>
    </div>
  );
}
