import type { Person } from '../lib/types';
import { TEAM_BY_ID, TEAM_CARDS, TEAM_CARD_ANSWERS } from '../data/teams';
import { PEOPLE, PERSON_BY_ID } from '../data/people';
import { EARNED_BADGES } from '../data/badges';
import { COLLAB_NEEDS, COLLAB_OFFERS, DEPENDENCIES } from '../data/agreements';
import { teamReadiness, levelColor } from '../lib/readiness';
import { Avatar, ReadinessMeter, StatusPill, Ring } from '../components/Shared';
import { IconArrowLeft } from '../components/Icons';

interface Props {
  user: Person;
  teamId: string | null;
  onBack: () => void;
  onOpenPerson: (id: string) => void;
}

export default function TeamDetail({ user: _user, teamId, onBack, onOpenPerson }: Props) {
  const team = teamId ? TEAM_BY_ID[teamId] : undefined;
  const card = team ? TEAM_CARDS.find((c) => c.teamId === team.id) : undefined;
  const summary = teamReadiness(card, TEAM_CARD_ANSWERS);
  const members = team ? PEOPLE.filter((p) => p.primaryTeamId === team.id) : [];
  const owner = card ? PERSON_BY_ID[card.ownerPersonId] : undefined;
  const badges = team ? EARNED_BADGES.filter((b) => b.awardedTo === 'team' && b.awardedToId === team.id) : [];

  const needs   = team ? COLLAB_NEEDS.filter((n) => n.ownerTeamId === team.id) : [];
  const offers  = team ? COLLAB_OFFERS.filter((o) => o.ownerTeamId === team.id) : [];
  const depsOut = team ? DEPENDENCIES.filter((d) => d.fromTeamId === team.id) : [];
  const depsIn  = team ? DEPENDENCIES.filter((d) => d.toTeamId === team.id) : [];

  if (!team) {
    return (
      <div style={{ padding: 24 }}>
        <div className="display" style={{ fontSize: 20 }}>Team not found.</div>
        <button onClick={onBack} style={{ marginTop: 12, fontFamily: 'inherit' }}>← Back</button>
      </div>
    );
  }

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
        <IconArrowLeft size={13} /> Back to People & Teams
      </button>

      <div className="section">
        <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 24, padding: 22 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 10,
                background: 'var(--surface-soft)', border: '1px solid var(--rule)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600, color: 'var(--ink)',
              }}>{team.shortName.toUpperCase()}</div>
              <div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 500 }}>{team.name}</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>
                  {team.function} · {members.length} members{owner ? ` · Owner: ${owner.name}` : ''}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 13.5, lineHeight: 1.6, marginBottom: 12 }}>
              {card ? card.mission : 'Mission not yet drafted.'}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              <StatusPill level={summary.level}>{summary.label}</StatusPill>
              {card?.publishedAt && (
                <span className="freshness fr-fresh">Published · {card.visibility}</span>
              )}
              {badges.map((b) => (
                <span key={b.id} className="badge-chip">
                  <span className="bc-dot" />
                  <span className="bc-label">{b.label}</span>
                </span>
              ))}
            </div>
            <ReadinessMeter summary={summary} showRationale />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid var(--rule)', paddingLeft: 18 }}>
            <Ring value={summary.pct} max={100} size={120} stroke={6} color={levelColor(summary.level)} />
            <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 8, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Team readiness
            </div>
          </div>
        </div>
      </div>

      {card && (
        <>
          <div className="section">
            <div className="section-head">
              <span className="section-title">What this team owns and does not own</span>
            </div>
            <div className="agree-grid">
              <div className="agree-block">
                <div className="agree-block-label">We own</div>
                <div className="agree-block-body">
                  <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.6 }}>
                    {card.weOwn.map((x) => <li key={x}>{x}</li>)}
                  </ul>
                </div>
              </div>
              <div className="agree-block">
                <div className="agree-block-label">We do not own</div>
                <div className="agree-block-body">
                  {card.weDontOwn.length === 0 ? <span style={{ color: 'var(--muted)' }}>Not specified.</span> : (
                    <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.6 }}>
                      {card.weDontOwn.map((x) => <li key={x}>{x}</li>)}
                    </ul>
                  )}
                </div>
              </div>
              <div className="agree-block">
                <div className="agree-block-label">We produce</div>
                <div className="agree-block-body">
                  <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.6 }}>
                    {card.weProduce.map((x) => <li key={x}>{x}</li>)}
                  </ul>
                </div>
              </div>
              <div className="agree-block">
                <div className="agree-block-label">Required inputs</div>
                <div className="agree-block-body">
                  <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.6 }}>
                    {card.weNeed.map((x) => <li key={x}>{x}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="section">
            <div className="section-head">
              <span className="section-title">How to engage this team</span>
            </div>
            <div className="agree-grid">
              <div className="agree-block">
                <div className="agree-block-label">Engagement</div>
                <div className="agree-block-body">{card.bestEngagement}</div>
              </div>
              <div className="agree-block">
                <div className="agree-block-label">Response expectations</div>
                <div className="agree-block-body">{card.responseExpectations}</div>
              </div>
              <div className="agree-block">
                <div className="agree-block-label">Common blockers</div>
                <div className="agree-block-body">
                  {card.commonBlockers.length === 0 ? <span style={{ color: 'var(--muted)' }}>None declared.</span> : (
                    <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.6 }}>
                      {card.commonBlockers.map((x) => <li key={x}>{x}</li>)}
                    </ul>
                  )}
                </div>
              </div>
              <div className="agree-block">
                <div className="agree-block-label">Meeting norms</div>
                <div className="agree-block-body">{card.meetingNorms}</div>
              </div>
              <div className="agree-block">
                <div className="agree-block-label">Escalation path</div>
                <div className="agree-block-body">{card.escalationPath}</div>
              </div>
              <div className="agree-block">
                <div className="agree-block-label">Decision rights</div>
                <div className="agree-block-body">
                  <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.6 }}>
                    {card.decisionRights.map((x) => <li key={x}>{x}</li>)}
                  </ul>
                  <div style={{ marginTop: 8, color: 'var(--muted)', fontSize: 11.5 }}>
                    Owners: {card.decisionOwners.join(' · ')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="section">
            <div className="section-head">
              <span className="section-title">Partner teams and downstream impact</span>
            </div>
            <div className="agree-grid">
              <div className="agree-block">
                <div className="agree-block-label">Partner teams</div>
                <div className="agree-block-body">
                  {card.partnerTeamIds.length === 0 ? <span style={{ color: 'var(--muted)' }}>None declared.</span> : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {card.partnerTeamIds.map((tid) => {
                        const pt = TEAM_BY_ID[tid];
                        return pt ? <span key={tid} className="badge-chip"><span className="bc-label">{pt.name}</span></span> : null;
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div className="agree-block">
                <div className="agree-block-label">Downstream impact</div>
                <div className="agree-block-body">{card.downstreamImpact}</div>
              </div>
            </div>
          </div>

          <div className="section">
            <div className="section-head">
              <span className="section-title">Collaboration plumbing</span>
              <span className="section-meta">Needs · offers · dependencies</span>
            </div>
            <div className="card" style={{ padding: 18 }}>
              <div className="agree-grid">
                <div className="agree-block">
                  <div className="agree-block-label">Needs from other teams</div>
                  <div className="agree-block-body">
                    {needs.length === 0 ? <span style={{ color: 'var(--muted)' }}>None declared.</span> : (
                      <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.6 }}>
                        {needs.map((n) => (
                          <li key={n.id}>
                            {n.description} <span style={{ color: 'var(--muted)' }}>
                              — from {TEAM_BY_ID[n.needFromTeamId]?.shortName ?? n.needFromTeamId} · {n.status}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="agree-block">
                  <div className="agree-block-label">Offers to other teams</div>
                  <div className="agree-block-body">
                    {offers.length === 0 ? <span style={{ color: 'var(--muted)' }}>None declared.</span> : (
                      <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.6 }}>
                        {offers.map((o) => (
                          <li key={o.id}>{o.description} <span style={{ color: 'var(--muted)' }}>— to {TEAM_BY_ID[o.offeredToTeamId]?.shortName ?? o.offeredToTeamId} · SLA {o.sla}</span></li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="agree-block">
                  <div className="agree-block-label">Dependencies on this team</div>
                  <div className="agree-block-body">
                    {depsIn.length === 0 ? <span style={{ color: 'var(--muted)' }}>None.</span> : (
                      <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.6 }}>
                        {depsIn.map((d) => <li key={d.id}>{d.description} <span style={{ color: 'var(--muted)' }}>— from {TEAM_BY_ID[d.fromTeamId]?.shortName ?? d.fromTeamId} · {d.status}</span></li>)}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="agree-block">
                  <div className="agree-block-label">Dependencies this team has</div>
                  <div className="agree-block-body">
                    {depsOut.length === 0 ? <span style={{ color: 'var(--muted)' }}>None.</span> : (
                      <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.6 }}>
                        {depsOut.map((d) => <li key={d.id}>{d.description} <span style={{ color: 'var(--muted)' }}>— on {TEAM_BY_ID[d.toTeamId]?.shortName ?? d.toTeamId} · {d.status}</span></li>)}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="section">
        <div className="section-head">
          <span className="section-title">Members</span>
          <span className="section-meta">{members.length} people</span>
        </div>
        <div className="card" style={{ padding: '6px 18px' }}>
          {members.map((m) => (
            <div
              key={m.id}
              onClick={() => onOpenPerson(m.id)}
              style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--rule-soft)', cursor: 'pointer' }}
            >
              <Avatar person={m} size={32} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{m.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{m.role}</div>
              </div>
              <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: "'JetBrains Mono', monospace" }}>View →</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
