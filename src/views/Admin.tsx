import { useState } from 'react';
import { ENTERPRISE, ORGANIZATION, ORG_PACKS, ACTIVE_ORG_PACK } from '../data/enterprise';
import { CARD_SECTIONS } from '../data/cardSections';
import {
  INTEGRATIONS, TEAM_TEMPLATES, NUDGE_CADENCES, RETENTION_OPTIONS,
  CONSENT_RECORDS, AUDIT_LOGS,
} from '../data/admin';
import { BADGE_CATALOG } from '../data/badges';
import { PERSON_BY_ID } from '../data/people';

export default function Admin() {
  const [packId, setPackId] = useState<string>(ACTIVE_ORG_PACK.id);
  const pack = ORG_PACKS.find((p) => p.id === packId) ?? ACTIVE_ORG_PACK;

  return (
    <>
      <div style={{ marginBottom: 18 }}>
        <div className="display" style={{ fontSize: 24 }}>Admin</div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>
          Enterprise and organization configuration. Changes here apply org-wide.
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title">Organization</span>
          <span className="section-meta">{ENTERPRISE.name}</span>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div className="admin-row">
            <div>
              <div className="admin-row-label">Organization name</div>
              <div className="admin-row-desc">The org displayed in the top-bar crumb and on every card.</div>
            </div>
            <div className="admin-row-value">{ORGANIZATION.name}</div>
          </div>
          <div className="admin-row">
            <div>
              <div className="admin-row-label">Region</div>
              <div className="admin-row-desc">Primary region for data residency.</div>
            </div>
            <div className="admin-row-value">{ENTERPRISE.region}</div>
          </div>
          <div className="admin-row">
            <div>
              <div className="admin-row-label">Industry / size</div>
              <div className="admin-row-desc">Used to recommend default Org Packs.</div>
            </div>
            <div className="admin-row-value">{ORGANIZATION.industry} · {ORGANIZATION.size}</div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title">Org Pack</span>
          <span className="section-meta">Required sections · meeting-fit rules · visibility defaults · badge language · nudge cadence · retention</span>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
            {ORG_PACKS.map((p) => (
              <button
                key={p.id}
                className={`filter-chip ${packId === p.id ? 'active' : ''}`}
                onClick={() => setPackId(p.id)}
              >{p.name}</button>
            ))}
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 16 }}>
            {pack.description}
          </div>

          <div className="admin-row">
            <div>
              <div className="admin-row-label">Required card sections</div>
              <div className="admin-row-desc">Cards must have these sections answered to publish.</div>
            </div>
            <div className="admin-row-value">
              {pack.requiredCardSections.map((k) => CARD_SECTIONS.find((s) => s.key === k)?.label ?? k).join(' · ')}
            </div>
          </div>

          <div className="admin-row">
            <div>
              <div className="admin-row-label">Visibility default</div>
              <div className="admin-row-desc">Where new cards are visible unless an individual changes it.</div>
            </div>
            <div className="admin-row-value">{pack.visibilityDefault}</div>
          </div>

          <div className="admin-row">
            <div>
              <div className="admin-row-label">Nudge cadence</div>
              <div className="admin-row-desc">How often the system reminds people to refresh their cards.</div>
            </div>
            <div className="admin-row-value">{pack.nudgeCadenceDays} days · {NUDGE_CADENCES.find((c) => c.days === pack.nudgeCadenceDays)?.label ?? 'custom'}</div>
          </div>

          <div className="admin-row">
            <div>
              <div className="admin-row-label">Data retention</div>
              <div className="admin-row-desc">Default lifetime of audit logs and superseded card versions.</div>
            </div>
            <div className="admin-row-value">{pack.dataRetentionDays} days · {RETENTION_OPTIONS.find((r) => r.days === pack.dataRetentionDays)?.label ?? 'custom'}</div>
          </div>

          <div className="admin-row">
            <div>
              <div className="admin-row-label">Meeting fit rules</div>
              <div className="admin-row-desc">Rules used to compute meeting readiness. Each rule is advisory.</div>
            </div>
            <div className="admin-row-value" style={{ lineHeight: 1.7 }}>
              {pack.meetingFitRules.map((r) => r.label).join(' · ')}
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title">Team templates</span>
          <span className="section-meta">{TEAM_TEMPLATES.length} templates</span>
        </div>
        <div className="card">
          {TEAM_TEMPLATES.map((t) => (
            <div key={t.id} className="coverage-row">
              <div className="coverage-row-label">{t.label}</div>
              <div className="coverage-row-detail">{t.description}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: 'var(--muted)', textAlign: 'right' }}>
                {t.defaultSections.length} sections
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <span className="admin-status admin-status-available">template</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title">Badge language</span>
          <span className="section-meta">Always tied to readiness, freshness, or collaboration hygiene</span>
        </div>
        <div className="section-desc">
          Fieldguide deliberately constrains its recognition vocabulary. Every badge below rewards clarity or hygiene; none reward personality, ranking, or perceived performance.
        </div>
        <div className="card" style={{ padding: '6px 18px' }}>
          {(Object.keys(BADGE_CATALOG) as Array<keyof typeof BADGE_CATALOG>).map((key) => {
            const b = BADGE_CATALOG[key];
            return (
              <div key={key} style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--rule-soft)' }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{b.label}</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.55 }}>{b.description}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title">Integrations</span>
          <span className="section-meta">Identity · calendar · messaging · HRIS · docs · video</span>
        </div>
        <div className="card">
          {INTEGRATIONS.map((i) => (
            <div key={i.id} className="coverage-row">
              <div className="coverage-row-label">{i.name}</div>
              <div className="coverage-row-detail">{i.description}</div>
              <div style={{ fontSize: 10.5, color: 'var(--muted)', fontFamily: "'JetBrains Mono', monospace", textAlign: 'right', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {i.category}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <span className={`admin-status admin-status-${i.status === 'connected' ? 'connected' : i.status === 'coming_soon' ? 'coming' : 'available'}`}>
                  {i.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title">Consent & audit</span>
          <span className="section-meta">Compliance scaffolding</span>
        </div>
        <div className="section-desc">
          Phase 1 stores consent and audit records statically. The shape is preserved so that a future Supabase migration can plug these tables in with no schema rework.
        </div>
        <div className="card" style={{ padding: '6px 18px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '10px 0' }}>
            Recent consent grants ({CONSENT_RECORDS.length})
          </div>
          {CONSENT_RECORDS.slice(0, 4).map((c) => {
            const person = PERSON_BY_ID[c.personId];
            return (
              <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, padding: '10px 0', borderTop: '1px solid var(--rule-soft)', fontSize: 12 }}>
                <span>{person?.name ?? c.personId}</span>
                <span style={{ color: 'var(--muted)' }}>{c.scope.replace('_', ' ')}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: 'var(--muted)' }}>
                  {new Date(c.grantedAt).toLocaleDateString()} · {c.version}
                </span>
              </div>
            );
          })}

          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '18px 0 10px' }}>
            Recent audit entries ({AUDIT_LOGS.length})
          </div>
          {AUDIT_LOGS.slice(0, 4).map((log) => {
            const actor = PERSON_BY_ID[log.actorPersonId];
            return (
              <div key={log.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr auto', gap: 12, padding: '10px 0', borderTop: '1px solid var(--rule-soft)', fontSize: 12 }}>
                <span>{actor?.name ?? log.actorPersonId} · <span style={{ color: 'var(--muted)' }}>{log.action.replace('_', ' ')}</span></span>
                <span style={{ color: 'var(--muted)' }}>{log.diffSummary}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: 'var(--muted)' }}>
                  {new Date(log.at).toLocaleDateString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
