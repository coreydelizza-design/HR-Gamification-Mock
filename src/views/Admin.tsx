import { useState } from 'react';
import { ENTERPRISE } from '../data/enterprise';
import {
  useOrgData, resetDemo, renameEnterprise, exportSession, importSession,
  saveSnapshot, listSnapshots, restoreSnapshot,
} from '../lib/demoStore';
import { ORG_PACKS } from '../data/orgPacks';

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

type Tab = 'enterprise' | 'workshop' | 'catalog' | 'templates' | 'packs' | 'governance' | 'integrations';

export default function Admin({ onNewOrg }: { onNewOrg: () => void }) {
  const [tab, setTab] = useState<Tab>('enterprise');
  const { organizations: ORGANIZATIONS, enterpriseLabel, modified } = useOrgData();
  const [renameDraft, setRenameDraft] = useState(enterpriseLabel);
  const [importMsg, setImportMsg] = useState<string>('');
  const snapshots = listSnapshots();

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

      <div className="tab-strip">
        {([['enterprise', 'Enterprise'], ['workshop', 'Workshop'], ['catalog', 'Org Catalog'], ['templates', 'Card Templates'], ['packs', 'Org Packs'], ['governance', 'Visibility & Governance'], ['integrations', 'Integrations']] as Array<[Tab, string]>).map(([k, label]) => (
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
