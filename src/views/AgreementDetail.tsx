import type { Person } from '../lib/types';
import { AGREEMENT_BY_ID, AGREEMENT_SECTIONS } from '../data/agreements';
import { TEAM_BY_ID } from '../data/teams';
import { PERSON_BY_ID } from '../data/people';
import { handoffReadiness, levelColor } from '../lib/readiness';
import { Ring, ReadinessMeter, StatusPill } from '../components/Shared';
import { IconArrowLeft } from '../components/Icons';

interface Props {
  user: Person;
  agreementId: string | null;
  onBack: () => void;
  onOpenTeam: (id: string) => void;
}

export default function AgreementDetail({ user: _user, agreementId, onBack, onOpenTeam }: Props) {
  const agreement = agreementId ? AGREEMENT_BY_ID[agreementId] : undefined;
  const summary = handoffReadiness(agreement, AGREEMENT_SECTIONS);

  if (!agreement) {
    return (
      <div style={{ padding: 24 }}>
        <div className="display" style={{ fontSize: 20 }}>Agreement not found.</div>
        <button onClick={onBack} style={{ marginTop: 12, fontFamily: 'inherit' }}>← Back</button>
      </div>
    );
  }

  const sections = AGREEMENT_SECTIONS.filter((s) => s.agreementId === agreement.id);
  const teams = agreement.teamIds.map((id) => TEAM_BY_ID[id]).filter(Boolean);
  const author = PERSON_BY_ID[agreement.authorPersonId];

  return (
    <>
      <button
        onClick={onBack}
        style={{
          background: 'transparent', border: 'none', color: 'var(--muted)',
          fontSize: 12.5, cursor: 'pointer', padding: 0, marginBottom: 14,
          display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'inherit',
        }}
      >
        <IconArrowLeft size={13} /> Back to Working Agreements
      </button>

      <div className="section">
        <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 24, padding: 22 }}>
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 500, marginBottom: 4 }}>{agreement.title}</div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 10 }}>
              Authored by {author?.name ?? '—'} · review every {agreement.reviewCadenceDays} days · next {new Date(agreement.nextReviewAt).toLocaleDateString()}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              <span className={`admin-status admin-status-${agreement.status === 'published' ? 'connected' : agreement.status === 'review' ? 'coming' : 'available'}`}>{agreement.status}</span>
              <StatusPill level={summary.level}>{summary.label}</StatusPill>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
              {teams.map((t) => (
                <button
                  key={t.id}
                  className="badge-chip"
                  onClick={() => onOpenTeam(t.id)}
                  style={{ cursor: 'pointer', border: '1px solid var(--rule)', background: 'var(--surface-soft)', fontFamily: 'inherit' }}
                >
                  <span className="bc-label">{t.name}</span>
                </button>
              ))}
            </div>
            <ReadinessMeter summary={summary} showRationale />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid var(--rule)', paddingLeft: 18 }}>
            <Ring value={summary.pct} max={100} size={120} stroke={6} color={levelColor(summary.level)} />
            <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 8, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Agreement readiness
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title">Sections</span>
          <span className="section-meta">{sections.length} sections</span>
        </div>
        <div className="agree-grid">
          {sections.map((s) => (
            <div key={s.id} className="agree-block">
              <div className="agree-block-label">{s.label}</div>
              <div className="agree-block-body">{s.body}</div>
            </div>
          ))}
          {sections.length === 0 && (
            <div className="agree-block" style={{ gridColumn: '1 / -1' }}>
              <div className="agree-block-body" style={{ color: 'var(--muted)' }}>No sections drafted yet.</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
