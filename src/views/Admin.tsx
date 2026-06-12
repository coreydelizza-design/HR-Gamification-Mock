import { useState } from 'react';
import type { RoleBand, Currency, ViewKey } from '../lib/types';
import { ENTERPRISE } from '../data/enterprise';
import {
  useOrgData, resetDemo, renameEnterprise, exportSession, importSession,
  saveSnapshot, listSnapshots, restoreSnapshot, updateRateCard,
} from '../lib/demoStore';
import { ORG_PACKS } from '../data/orgPacks';
import { ROLE_BAND_LABEL, ROLE_BAND_ORDER, DEFAULT_MULTIPLIER } from '../data/rateCard';
import { money } from '../lib/proxyEngine';

const ORG_CARD_SECTIONS = [
  'Overview', 'How this organization succeeds', 'What this organization owns',
  'What it needs from others', 'How it helps others succeed', 'Cross-org dependencies',
  'Engagement model', 'Meeting norms', 'Handoff rules', 'Success agreements',
  'People and role cards', 'Risks and blockers', 'Freshness and governance',
];

const INTEGRATIONS: Array<{ name: string; status: 'connected' | 'available' | 'coming' }> = [
  { name: 'HRIS (Workday)', status: 'available' },
  { name: 'Microsoft Teams', status: 'connected' },
  { name: 'Slack', status: 'connected' },
  { name: 'Outlook', status: 'available' },
  { name: 'Google Calendar', status: 'available' },
  { name: 'ServiceNow', status: 'coming' },
  { name: 'Jira', status: 'available' },
  { name: 'Asana', status: 'coming' },
  { name: 'Monday', status: 'coming' },
  { name: 'Salesforce', status: 'connected' },
  { name: 'Power BI', status: 'coming' },
];

const VISIBILITY_SCOPES = [
  { scope: 'Organization-visible', detail: 'Default. Any employee can read the organization card.' },
  { scope: 'Partner-visible', detail: 'Card visible to named partner organizations only.' },
  { scope: 'Manager-visible', detail: 'Nested individual context visible to the person’s manager.' },
  { scope: 'Private individual context', detail: 'Focus, feedback, and personal notes stay with the individual.' },
];

type Tab = 'enterprise' | 'workshop' | 'ratecard' | 'catalog' | 'templates' | 'packs' | 'governance' | 'integrations';

export default function Admin({ onNewOrg, onNavigate }: { onNewOrg: () => void; onNavigate?: (v: ViewKey) => void }) {
  const [tab, setTab] = useState<Tab>('enterprise');
  const { organizations: ORGANIZATIONS, enterpriseLabel, modified, rateCard } = useOrgData();
  const [renameDraft, setRenameDraft] = useState(enterpriseLabel);
  const [importMsg, setImportMsg] = useState<string>('');
  const snapshots = listSnapshots();

  // Rate card editor — local draft of band base salaries + multiplier + currency.
  const [bases, setBases] = useState<Record<RoleBand, number>>(() =>
    ROLE_BAND_ORDER.reduce((acc, b) => { acc[b] = rateCard.bands[b].annualBase; return acc; }, {} as Record<RoleBand, number>));
  const [multiplier, setMultiplier] = useState(rateCard.loadedCostMultiplier);
  const [currency, setCurrency] = useState<Currency>(rateCard.currency);
  const derivedHourly = (band: RoleBand) => Math.round((bases[band] * multiplier) / 2080);

  const onReset = () => {
    if (window.confirm('Reset all demo data to the pristine seed? Any unsaved edits and created organizations will be discarded.')) {
      resetDemo();
    }
  };

  const onExport = () => {
    const data = exportSession();
    const safe = (data.enterpriseLabel || 'fieldguide').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    const date = data.exportedAt.slice(0, 10);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `fieldguide-session-${safe}-${date}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  const onImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!window.confirm(`Import session "${parsed.enterpriseLabel ?? 'unknown'}"? This overwrites the current demo data.`)) return;
        const res = importSession(parsed);
        setImportMsg(res.ok ? 'Session imported.' : `Import failed: ${res.error}`);
      } catch (e) {
        setImportMsg(`Import failed: ${String(e)}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <div className="section-head" style={{ marginBottom: 12 }}>
        <span className="display" style={{ fontSize: 24 }}>Admin</span>
        <span className="section-meta">{ENTERPRISE.name} · demo-static configuration</span>
      </div>

      {onNavigate && (
        <button type="button" className="estimator-tile" onClick={() => onNavigate('estimator')}>
          <div>
            <div className="estimator-tile-title">Meeting Cost Estimator →</div>
            <div className="estimator-tile-sub">The consultant's pocket tool — what-if rosters, conversion savings, and the enterprise opportunity, live against the rate card.</div>
          </div>
          <span className="estimator-tile-arrow">→</span>
        </button>
      )}

      <div className="tab-strip">
        {([['enterprise', 'Enterprise'], ['workshop', 'Workshop'], ['ratecard', 'Rate Card'], ['catalog', 'Org Catalog'], ['templates', 'Card Templates'], ['packs', 'Org Packs'], ['governance', 'Visibility & Governance'], ['integrations', 'Integrations']] as Array<[Tab, string]>).map(([k, label]) => (
          <button key={k} className={tab === k ? 'active' : ''} onClick={() => setTab(k)}>{label}</button>
        ))}
      </div>

      {tab === 'enterprise' && (
        <>
          <div className="card" style={{ padding: '4px 22px' }}>
            {[
              ['Enterprise name', enterpriseLabel, 'White-label display name across the product. Rename it in the Workshop section.'],
              ['Primary domain', ENTERPRISE.primaryDomain, 'Used for SSO and email matching.'],
              ['Region', ENTERPRISE.region, 'Data residency and default locale.'],
              ['Default card template', 'Full 13-section organization card', 'Applied to new organizations.'],
              ['Freshness cadence', 'Review every 90 days', 'Cards aging past cadence are flagged.'],
              ['Default visibility', 'Organization-visible', 'Default scope for new cards.'],
              ['Review cadence', 'Quarterly operating review', 'When org cards are revisited enterprise-wide.'],
            ].map(([label, value, desc]) => (
              <div className="admin-row" key={label}>
                <div><div className="admin-row-label">{label}</div><div className="admin-row-desc">{desc}</div></div>
                <div className="admin-row-value">{value}</div>
              </div>
            ))}
          </div>
          <div className="admin-row" style={{ marginTop: 16, gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
            <div>
              <div className="admin-row-label">Demo data state</div>
              <div className="admin-row-desc">{modified ? 'Demo data has been modified this session (edits / created orgs / imported session).' : 'Clean — running the pristine seed dataset.'}</div>
            </div>
            <button className="btn-danger" onClick={onReset}>Reset demo data</button>
          </div>
        </>
      )}

      {tab === 'workshop' && (
        <>
          <div className="section-desc">Run a client session with no backend: rename the enterprise, create organizations, and save / load the whole session as JSON. State lives in localStorage and exported files; nothing leaves the browser.</div>
          <div className="workshop-grid">
            <div className="card" style={{ padding: 18 }}>
              <div className="admin-row-label" style={{ marginBottom: 8 }}>Enterprise name</div>
              <div className="admin-row-desc" style={{ marginBottom: 10 }}>Walk into the demo with the client's name on the masthead.</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="inp" value={renameDraft} onChange={(e) => setRenameDraft(e.target.value)} placeholder={enterpriseLabel} />
                <button className="btn-primary btn-sm" onClick={() => renameEnterprise(renameDraft.trim())}>Rename</button>
              </div>
            </div>
            <div className="card" style={{ padding: 18 }}>
              <div className="admin-row-label" style={{ marginBottom: 8 }}>Create organization</div>
              <div className="admin-row-desc" style={{ marginBottom: 10 }}>Build a new org card live during the session.</div>
              <button className="btn-primary btn-sm" onClick={onNewOrg}>+ New organization</button>
            </div>
          </div>

          <div className="card" style={{ padding: 18, marginTop: 12 }}>
            <div className="admin-row-label" style={{ marginBottom: 8 }}>Session file</div>
            <div className="admin-row-desc" style={{ marginBottom: 10 }}>The exported JSON is the consulting deliverable — it maps 1:1 onto the future Supabase seed shape (see docs/WORKSHOP_MODE.md).</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <button className="btn-ghost btn-sm" onClick={onExport}>↓ Export session</button>
              <label className="btn-ghost btn-sm" style={{ cursor: 'pointer' }}>
                ↑ Import session
                <input type="file" accept="application/json,.json" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) onImportFile(f); e.target.value = ''; }} />
              </label>
              <button className="btn-ghost btn-sm" onClick={saveSnapshot}>Save snapshot</button>
              {importMsg && <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>{importMsg}</span>}
            </div>
          </div>

          <div className="card" style={{ padding: 18, marginTop: 12 }}>
            <div className="admin-row-label" style={{ marginBottom: 8 }}>Recent local snapshots</div>
            {snapshots.length === 0 ? (
              <div className="admin-row-desc">No snapshots yet — "Save snapshot" keeps up to 3 in this browser.</div>
            ) : snapshots.map((s) => (
              <div key={s.slot} className="snapshot-row">
                <div>
                  <div className="admin-row-label">{s.enterpriseLabel}</div>
                  <div className="admin-row-desc">{s.orgCount} organizations · saved {new Date(s.savedAt).toLocaleString()}</div>
                </div>
                <button className="btn-ghost btn-sm" onClick={() => { if (window.confirm('Restore this snapshot? Overwrites current demo data.')) restoreSnapshot(s.slot); }}>Restore</button>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'ratecard' && (
        <>
          <div className="section-desc">
            One rate card per enterprise. Rates attach to <strong>role bands (seats), never to a named person</strong> —
            no individual compensation is stored, displayed, or implied. Every figure derived from this card is an
            estimate for decision-making, not payroll math.
          </div>
          {rateCard.illustrative && <div className="illustrative-banner">Illustrative defaults — these public-benchmark salaries have not been edited yet. Adjust below to fit the client.</div>}

          <div className="card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 14 }}>
              <div>
                <div className="admin-row-label" style={{ marginBottom: 6 }}>Loaded cost multiplier</div>
                <input className="inp" type="number" step="0.01" style={{ width: 110 }} value={multiplier} onChange={(e) => setMultiplier(Number(e.target.value) || DEFAULT_MULTIPLIER)} />
                <div className="admin-row-desc">benefits / overhead on base comp</div>
              </div>
              <div>
                <div className="admin-row-label" style={{ marginBottom: 6 }}>Currency</div>
                <select className="inp" style={{ width: 90 }} value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
                  {(['USD', 'EUR', 'GBP'] as Currency[]).map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="rate-table">
              <div className="rate-head"><span>Band</span><span>Annual base</span><span>Hourly (derived)</span><span>Half-hour (derived)</span></div>
              {ROLE_BAND_ORDER.map((band) => (
                <div key={band} className="rate-row">
                  <span>{ROLE_BAND_LABEL[band]}</span>
                  <span><input className="inp" type="number" step="1000" style={{ width: 130 }} value={bases[band]} onChange={(e) => setBases((b) => ({ ...b, [band]: Number(e.target.value) || 0 }))} /></span>
                  <span className="mono">{money(derivedHourly(band), currency)}</span>
                  <span className="mono">{money(Math.round(derivedHourly(band) / 2), currency)}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 14 }}>
              <button className="btn-primary btn-sm" onClick={() => updateRateCard(bases, multiplier, currency)}>Apply rate card</button>
            </div>
          </div>

          <div className="card" style={{ padding: 18, marginTop: 12 }}>
            <div className="admin-row-label" style={{ marginBottom: 8 }}>Methodology</div>
            <ul className="lbl-ul" style={{ fontSize: 12 }}>
              <li><strong>Cost formula:</strong> hourly = band base × loaded multiplier ÷ 2080; meeting cost = Σ live-attendee band hourly × duration.</li>
              <li><strong>Opportunity formula:</strong> recoverable = informational live attendance + duplicate meetings + async-eligible status meetings + agreement-gap escalations, annualized by cadence (weekly ×48, biweekly ×24, monthly ×12).</li>
              <li><strong>Seat, not person:</strong> a rate belongs to a role band, never to an individual. No compensation is ever stored or attributed to a named employee.</li>
              <li><strong>Estimates only:</strong> all figures are for decision-making, not payroll, and always render with a tilde (~).</li>
              <li><strong>Expectations Brief:</strong> composed deterministically from published organization cards — purpose, per-org expectations (only agenda-relevant sections, matched on agenda item kind + keyword overlap), the success checklist, missing-agreement caveats, and a freshness source note. No LLM (an LLM-polished rendering is a Phase-5 extension). Markdown copy/download use the same composition function — single source.</li>
            </ul>
          </div>
        </>
      )}

      {tab === 'catalog' && (
        <>
          <div className="section-head" style={{ marginBottom: 8 }}>
            <span className="section-meta">Create, parent, assign owners and packs, and activate organizations. Demo-static.</span>
            <button className="btn-primary btn-sm" onClick={onNewOrg}>+ New organization</button>
          </div>
          <div className="card" style={{ padding: '4px 22px' }}>
            {ORGANIZATIONS.slice(0, 14).map((o) => (
              <div className="admin-row" key={o.id} style={{ gridTemplateColumns: '1fr 200px' }}>
                <div><div className="admin-row-label">{o.name}</div><div className="admin-row-desc">Tier {o.tier} · {o.executiveOwner}{o.parentOrgId ? ` · parent: ${o.parentOrgId}` : ''}</div></div>
                <div className="admin-row-value">{o.orgPackId}</div>
              </div>
            ))}
            <div className="admin-row"><div className="admin-row-desc">…and {ORGANIZATIONS.length - 14} more organizations in the catalog.</div><div /></div>
          </div>
        </>
      )}

      {tab === 'templates' && (
        <>
          <div className="section-desc">The default organization card template. Packs mark which sections are required vs. optional.</div>
          <div className="card" style={{ padding: '4px 22px' }}>
            {ORG_CARD_SECTIONS.map((s, i) => (
              <div className="admin-row" key={s} style={{ gridTemplateColumns: '1fr 120px' }}>
                <div><div className="admin-row-label">{String(i + 1).padStart(2, '0')} · {s}</div></div>
                <div className="admin-row-value">{i < 5 || i === 6 ? 'required' : 'optional'}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'packs' && (
        <>
          <div className="section-desc">Eleven function-specific packs. Each defines required sections, intake fields, handoff and decision-rights templates, success metrics, freshness cadence, badge language, and nudge cadence.</div>
          <div className="org-grid">
            {ORG_PACKS.map((p) => (
              <div key={p.id} className="org-preview" style={{ cursor: 'default' }}>
                <div className="org-preview-head"><div className="org-preview-name">{p.name}</div></div>
                <div className="org-preview-mission">{p.description}</div>
                <div style={{ marginTop: 10, fontSize: 11, color: 'var(--muted)' }}>
                  <div>Required sections: {p.requiredCardSections.length}</div>
                  <div>Intake fields: {p.intakeFields?.length ?? 0}</div>
                  <div>Freshness: every {p.freshnessCadenceDays ?? 90}d · nudge every {p.nudgeCadenceDays}d</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'governance' && (
        <>
          <div className="section-desc">Visibility scopes and compliance scaffolding. Individual context is protected by design.</div>
          <div className="card" style={{ padding: '4px 22px' }}>
            {VISIBILITY_SCOPES.map((v) => (
              <div className="admin-row" key={v.scope}>
                <div><div className="admin-row-label">{v.scope}</div><div className="admin-row-desc">{v.detail}</div></div>
                <div className="admin-row-value">enabled</div>
              </div>
            ))}
            {[['Consent records', 'Per-person consent for publish and partner visibility'], ['Audit log', 'Every publish/edit recorded with actor and diff'], ['Data retention', '730 days default · 2555 for regulated packs']].map(([label, desc]) => (
              <div className="admin-row" key={label}>
                <div><div className="admin-row-label">{label}</div><div className="admin-row-desc">{desc}</div></div>
                <div className="admin-row-value">placeholder</div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'integrations' && (
        <>
          <div className="section-desc">Connection points for HR, collaboration, and BI systems. Status chips only in the demo.</div>
          <div className="card" style={{ padding: '4px 22px' }}>
            {INTEGRATIONS.map((it) => (
              <div className="admin-row" key={it.name} style={{ gridTemplateColumns: '1fr 140px' }}>
                <div><div className="admin-row-label">{it.name}</div></div>
                <div style={{ alignSelf: 'center' }}>
                  <span className={`admin-status admin-status-${it.status}`}>{it.status}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
