import type { Person, ViewKey } from '../lib/types';
import { PERSON_BY_ID, WORK_CARD_BY_PERSON, CARD_ANSWERS, PEOPLE } from '../data/people';
import { MEETINGS, MEETING_ATTENDEES, FIT_BY_MEETING } from '../data/meetings';
import { WORKING_AGREEMENTS, AGREEMENT_SECTIONS } from '../data/agreements';
import { FRESHNESS_SIGNALS, NUDGES } from '../data/orgInsights';
import { TEAM_BY_ID, TEAM_CARD_BY_TEAM, TEAM_CARDS, TEAM_CARD_ANSWERS } from '../data/teams';
import { ACTIVE_OPERATING_NORMS, PARTNER_ORG_PACKS } from '../data/operatingNorms';
import { ACTIVE_ORG_PACK, ORGANIZATION } from '../data/enterprise';
import {
  cardReadiness, freshnessSummary, meetingReadiness, handoffReadiness,
  teamReadiness, agreementCoverage, agreementStatusLabel, agreementStatusLevel,
  levelColor, formatMeetingTime,
} from '../lib/readiness';
import { Avatar, Ring, ReadinessMeter, StatusPill, FreshnessBadge, Bar } from '../components/Shared';

interface Props {
  user: Person;
  onNavigate: (v: ViewKey) => void;
  onOpenMeeting: (id: string) => void;
  onOpenPerson: (id: string) => void;
  onOpenTeam: (id: string) => void;
  onOpenAgreement: (id: string) => void;
}

export default function Home({ user, onNavigate, onOpenMeeting, onOpenPerson, onOpenTeam, onOpenAgreement }: Props) {
  const card = WORK_CARD_BY_PERSON[user.id];
  const cardSummary = cardReadiness(card, CARD_ANSWERS);
  const freshness = FRESHNESS_SIGNALS.find((f) => f.subjectId === card?.id);
  const freshSummary = freshnessSummary(freshness);

  // Next meeting (earliest in the future relative to demo "now")
  const NOW = new Date('2026-06-03T13:00:00Z').getTime();
  const upcoming = [...MEETINGS]
    .filter((m) => new Date(m.startsAt).getTime() >= NOW)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  const next = upcoming[0];
  const nextBrief = next ? FIT_BY_MEETING[next.id] : undefined;
  const nextAtt = next ? MEETING_ATTENDEES.filter((a) => a.meetingId === next.id) : [];
  const nextSummary = meetingReadiness(nextBrief, nextAtt);

  // People to review: attendees of the next meeting other than me
  const peopleToReview = next
    ? nextAtt.map((a) => PERSON_BY_ID[a.personId]).filter((p) => p && p.id !== user.id)
    : [];

  // Teams relevant to upcoming work: the required-team-ids of the next meeting
  const teamsToReview = next ? next.requiredTeamIds.map((tid) => TEAM_BY_ID[tid]).filter(Boolean) : [];

  // Aggregate Collaboration Readiness rollups (six categories)
  const allCardSummaries = PEOPLE.map((p) => cardReadiness(WORK_CARD_BY_PERSON[p.id], CARD_ANSWERS));
  const cardReadinessAvg = Math.round(allCardSummaries.reduce((s, x) => s + x.pct, 0) / allCardSummaries.length);

  const allTeamSummaries = TEAM_CARDS.map((tc) => teamReadiness(tc, TEAM_CARD_ANSWERS));
  const teamReadinessAvg = Math.round(allTeamSummaries.reduce((s, x) => s + x.pct, 0) / allTeamSummaries.length);

  const upcomingFitSummaries = MEETINGS
    .map((m) => meetingReadiness(FIT_BY_MEETING[m.id], MEETING_ATTENDEES.filter((a) => a.meetingId === m.id)));
  const meetingReadinessAvg = Math.round(upcomingFitSummaries.reduce((s, x) => s + x.pct, 0) / upcomingFitSummaries.length);

  const allHandoffs = WORKING_AGREEMENTS.map((a) => handoffReadiness(a, AGREEMENT_SECTIONS));
  const handoffReadinessAvg = Math.round(allHandoffs.reduce((s, x) => s + x.pct, 0) / allHandoffs.length);

  const freshCount = FRESHNESS_SIGNALS.filter((f) => f.status === 'fresh').length;
  const freshnessAvg = Math.round((freshCount / FRESHNESS_SIGNALS.length) * 100);

  const agreementCov = agreementCoverage(WORKING_AGREEMENTS);

  const readinessRollups: Array<{ label: string; pct: number; rationale: string }> = [
    { label: 'Card Readiness',      pct: cardReadinessAvg,    rationale: 'Average across all org-visible work cards.' },
    { label: 'Team Readiness',      pct: teamReadinessAvg,    rationale: 'Average across all team cards.' },
    { label: 'Meeting Readiness',   pct: meetingReadinessAvg, rationale: 'Average across upcoming meetings with a fit brief.' },
    { label: 'Handoff Readiness',   pct: handoffReadinessAvg, rationale: 'Average handoff completeness across working agreements.' },
    { label: 'Freshness',           pct: freshnessAvg,        rationale: `${freshCount} of ${FRESHNESS_SIGNALS.length} cards reviewed in the last 90 days.` },
    { label: 'Agreement Coverage',  pct: agreementCov.pct,    rationale: agreementCov.rationale },
  ];

  // Handoff Clarity items: missing-input rows from upcoming briefs + unclear escalation paths
  const meetingsWithMissingInputs = MEETINGS
    .map((m) => ({ m, brief: FIT_BY_MEETING[m.id] }))
    .filter(({ brief }) => brief && brief.requiredInputs.some((i) => !i.received));

  const agreementsNeedingEscalation = WORKING_AGREEMENTS.filter((a) => {
    const sections = AGREEMENT_SECTIONS.filter((s) => s.agreementId === a.id);
    const esc = sections.find((s) => s.key === 'escalation_path');
    return !esc || !esc.body.trim();
  });

  const teamsMissingPartnerCards = TEAMS_WITHOUT_PARTNER_CARDS();

  // Stale-card nudges + suggested actions
  const myNudges = NUDGES.filter((n) => n.audience === 'person' && n.audienceId === user.id);
  const agreementSuggestions = WORKING_AGREEMENTS
    .filter((a) => a.status === 'draft' || a.status === 'mutual_review' || a.status === 'shared' || a.status === 'needs_refresh')
    .slice(0, 3);
  const orgNudges = NUDGES.filter((n) => n.audience !== 'person').slice(0, 2);

  return (
    <>
      <div style={{ marginBottom: 18 }}>
        <div className="display" style={{ fontSize: 24 }}>Good morning, {user.name.split(' ')[0]}.</div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>
          Here is what you need to know to work well today.
        </div>
      </div>

      <div className="home-grid">
        {/* A · My Fieldguide Readiness */}
        <div className="home-card">
          <div className="home-card-head">
            <div>
              <div className="home-card-title">My Fieldguide readiness</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>{cardSummary.rationale}</div>
            </div>
            <span className="home-card-meta">{freshSummary.label}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <Ring value={cardSummary.pct} max={100} size={96} stroke={6} color={levelColor(cardSummary.level)} />
            <div style={{ flex: 1 }}>
              <ReadinessMeter summary={cardSummary} />
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
                <FreshnessBadge signal={freshness} />
                <span className="freshness" style={{ background: 'var(--surface-soft)', color: 'var(--muted)' }}>
                  Visibility · {card?.visibility ?? 'org'}
                </span>
              </div>
              <button
                onClick={() => onNavigate('mycard')}
                style={{
                  marginTop: 12, background: 'transparent', border: 'none', padding: 0,
                  color: 'var(--accent)', fontWeight: 500, fontSize: 12.5,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >Update my Fieldguide →</button>
            </div>
          </div>
        </div>

        {/* B · Next Meeting Fit */}
        <div className="home-card">
          <div className="home-card-head">
            <div>
              <div className="home-card-title">Next meeting fit</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>{next ? formatMeetingTime(next) : 'No upcoming meeting'}</div>
            </div>
            {nextBrief && <StatusPill level={nextSummary.level}>{nextSummary.label}</StatusPill>}
          </div>
          {next ? (
            <>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{next.title}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.55, marginBottom: 10 }}>{next.agendaSummary}</div>
              <ReadinessMeter summary={nextSummary} showRationale />
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 8 }}>
                {nextBrief?.requiredInputs.filter((i) => !i.received).length ?? 0} required inputs outstanding · decision owner: {nextBrief && PERSON_BY_ID[nextBrief.decisionOwnerPersonId]?.name}
              </div>
              {nextBrief?.asyncRecommendation && (
                <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 4, fontStyle: 'italic' }}>
                  Async suggestion: {nextBrief.asyncRecommendation}
                </div>
              )}
              <button
                onClick={() => onOpenMeeting(next.id)}
                style={{
                  marginTop: 12, background: 'transparent', border: 'none', padding: 0,
                  color: 'var(--accent)', fontWeight: 500, fontSize: 12.5,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >Improve meeting fit →</button>
            </>
          ) : (
            <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>You are clear today.</div>
          )}
        </div>
      </div>

      <div className="home-grid">
        {/* C · Team cards to review */}
        <div className="home-card">
          <div className="home-card-head">
            <div className="home-card-title">Team cards to review</div>
            <span className="home-card-meta">{teamsToReview.length} teams</span>
          </div>
          <div className="home-list">
            {teamsToReview.length === 0 && (
              <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>No team-card prep needed.</div>
            )}
            {teamsToReview.map((t) => {
              const tc = TEAM_CARD_BY_TEAM[t.id];
              const tcSummary = teamReadiness(tc, TEAM_CARD_ANSWERS);
              return (
                <div key={t.id} className="home-list-item" onClick={() => onOpenTeam(t.id)} style={{ cursor: 'pointer' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: 'var(--surface-soft)', border: '1px solid var(--rule)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--ink)',
                  }}>{t.shortName.slice(0, 2).toUpperCase()}</div>
                  <div>
                    <div className="hli-title">{t.name}</div>
                    <div className="hli-sub">{tc ? tc.mission : 'Team card not yet published.'}</div>
                  </div>
                  <StatusPill level={tcSummary.level}>{tcSummary.label}</StatusPill>
                </div>
              );
            })}
          </div>
        </div>

        {/* People to review before today's meeting */}
        <div className="home-card">
          <div className="home-card-head">
            <div className="home-card-title">People to review</div>
            <span className="home-card-meta">{peopleToReview.length} cards</span>
          </div>
          <div className="home-list">
            {peopleToReview.length === 0 && (
              <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>No prep needed — you are working solo.</div>
            )}
            {peopleToReview.map((p) => {
              const wc = WORK_CARD_BY_PERSON[p.id];
              const sig = FRESHNESS_SIGNALS.find((f) => f.subjectId === wc?.id);
              return (
                <div key={p.id} className="home-list-item" onClick={() => onOpenPerson(p.id)} style={{ cursor: 'pointer' }}>
                  <Avatar person={p} size={36} />
                  <div>
                    <div className="hli-title">{p.name}</div>
                    <div className="hli-sub">{p.role} · {TEAM_BY_ID[p.primaryTeamId]?.name}</div>
                  </div>
                  <FreshnessBadge signal={sig} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* D · Working Agreements snapshot */}
      <div className="home-grid">
        <div className="home-card" style={{ gridColumn: '1 / -1' }}>
          <div className="home-card-head">
            <div className="home-card-title">Working agreements</div>
            <span className="home-card-meta">
              {agreementCov.label} · {agreementCov.pct}%
            </span>
          </div>
          <div style={{ marginBottom: 12 }}>
            <ReadinessMeter summary={agreementCov} />
          </div>
          <div className="home-list">
            {WORKING_AGREEMENTS.slice(0, 5).map((a) => {
              const level = agreementStatusLevel(a.status);
              const label = agreementStatusLabel(a.status);
              const teams = a.teamIds.slice(0, 3).map((id) => TEAM_BY_ID[id]?.shortName).filter(Boolean).join(' · ');
              return (
                <div key={a.id} className="home-list-item" onClick={() => onOpenAgreement(a.id)} style={{ cursor: 'pointer' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--surface-soft)', border: '1px solid var(--rule)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textTransform: 'uppercase' }}>
                    {a.status.charAt(0)}
                  </div>
                  <div>
                    <div className="hli-title">{a.title}</div>
                    <div className="hli-sub">{teams} · next review {new Date(a.nextReviewAt).toLocaleDateString()}</div>
                  </div>
                  <StatusPill level={level}>{label}</StatusPill>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* E · Handoff Clarity */}
      <div className="home-grid">
        <div className="home-card" style={{ gridColumn: '1 / -1' }}>
          <div className="home-card-head">
            <div className="home-card-title">Handoff clarity</div>
            <span className="home-card-meta">Operational gaps</span>
          </div>
          <div className="home-list">
            {meetingsWithMissingInputs.length === 0 && agreementsNeedingEscalation.length === 0 && teamsMissingPartnerCards.length === 0 && (
              <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>No outstanding handoff gaps.</div>
            )}
            {meetingsWithMissingInputs.map(({ m, brief }) => {
              const missing = brief!.requiredInputs.filter((i) => !i.received);
              return (
                <div key={'mwm-' + m.id} className="home-list-item" onClick={() => onOpenMeeting(m.id)} style={{ cursor: 'pointer' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--warning-soft)', color: 'var(--warning-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>↦</div>
                  <div>
                    <div className="hli-title">{m.title}: missing {missing.length} required input{missing.length === 1 ? '' : 's'}</div>
                    <div className="hli-sub">{missing.map((i) => `${TEAM_BY_ID[i.teamId]?.shortName ?? i.teamId}: ${i.input}`).join(' · ')}</div>
                  </div>
                  <span className="hli-action">Open →</span>
                </div>
              );
            })}
            {agreementsNeedingEscalation.map((a) => (
              <div key={'aes-' + a.id} className="home-list-item" onClick={() => onOpenAgreement(a.id)} style={{ cursor: 'pointer' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--danger-soft)', color: 'var(--danger-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>!</div>
                <div>
                  <div className="hli-title">{a.title}: escalation path not yet defined</div>
                  <div className="hli-sub">Without an escalation path the handoff stalls when something goes wrong.</div>
                </div>
                <span className="hli-action">Open →</span>
              </div>
            ))}
            {teamsMissingPartnerCards.map((t) => (
              <div key={'tmpc-' + t.id} className="home-list-item" onClick={() => onOpenTeam(t.id)} style={{ cursor: 'pointer' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--surface-soft)', border: '1px solid var(--rule)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{t.shortName.slice(0,2).toUpperCase()}</div>
                <div>
                  <div className="hli-title">{t.name}: no partner team references on the card</div>
                  <div className="hli-sub">Partner team links make handoffs traceable.</div>
                </div>
                <span className="hli-action">Open →</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* F · Collaboration Readiness */}
      <div className="home-grid">
        <div className="home-card" style={{ gridColumn: '1 / -1' }}>
          <div className="home-card-head">
            <div className="home-card-title">Collaboration readiness</div>
            <span className="home-card-meta">Aggregate · not individual</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {readinessRollups.map((r) => (
              <div key={r.label} className="fit-cell">
                <div className="fit-cell-label">{r.label}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 500 }}>{r.pct}%</span>
                </div>
                <div style={{ marginTop: 6 }}>
                  <Bar value={r.pct} color={r.pct >= 80 ? 'var(--success)' : r.pct >= 55 ? 'var(--warning)' : 'var(--danger)'} height={5} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8, lineHeight: 1.5 }}>{r.rationale}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 12, lineHeight: 1.55 }}>
            Readiness is an org-level signal. Individuals are not ranked or compared.
          </div>
        </div>
      </div>

      {/* G · Org Context */}
      <div className="home-grid">
        <div className="home-card" style={{ gridColumn: '1 / -1' }}>
          <div className="home-card-head">
            <div>
              <div className="home-card-title">Org context</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>
                {ORGANIZATION.name} · pack: {ACTIVE_ORG_PACK.name}
              </div>
            </div>
            <span className="home-card-meta">Operating norms</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>
                Active norms in your pack
              </div>
              <div className="home-list">
                {ACTIVE_OPERATING_NORMS.map((n) => (
                  <div key={n.id} className="home-list-item" style={{ cursor: 'default' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--surface-soft)', border: '1px solid var(--rule)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>·</div>
                    <div>
                      <div className="hli-title">{n.label}</div>
                      <div className="hli-sub">{n.detail}</div>
                    </div>
                    <span className="hli-action">Active</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>
                Partner org packs
              </div>
              <div className="home-list">
                {PARTNER_ORG_PACKS.map((p) => (
                  <div key={p.id} className="home-list-item" style={{ cursor: 'default' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--surface-soft)', border: '1px solid var(--rule)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>OP</div>
                    <div>
                      <div className="hli-title">{p.name}</div>
                      <div className="hli-sub">{p.context}</div>
                    </div>
                    <span className="hli-action">{p.visibilityDefault}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stale-card nudges + suggested actions */}
      <div className="home-grid">
        <div className="home-card">
          <div className="home-card-head">
            <div className="home-card-title">Stale card nudges</div>
            <span className="home-card-meta">{myNudges.length} for you</span>
          </div>
          {myNudges.length === 0 ? (
            <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>No personal nudges open. Nice cadence.</div>
          ) : (
            <div className="home-list">
              {myNudges.map((n) => (
                <div key={n.id} className="home-list-item" onClick={() => onNavigate('mycard')} style={{ cursor: 'pointer' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--warning-soft)', color: 'var(--warning-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>○</div>
                  <div>
                    <div className="hli-title">{n.kind === 'stale_card' ? 'Stale card' : 'Refresh before meeting'}</div>
                    <div className="hli-sub">{n.message}</div>
                  </div>
                  <span className="hli-action">Open →</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="home-card">
          <div className="home-card-head">
            <div className="home-card-title">Suggested actions</div>
            <span className="home-card-meta">{agreementSuggestions.length + orgNudges.length} suggestions</span>
          </div>
          <div className="home-list">
            {agreementSuggestions.map((a) => {
              const handoff = handoffReadiness(a, AGREEMENT_SECTIONS);
              return (
                <div key={a.id} className="home-list-item" onClick={() => onOpenAgreement(a.id)} style={{ cursor: 'pointer' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--surface-soft)', border: '1px solid var(--rule)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textTransform: 'uppercase' }}>{a.status.charAt(0)}</div>
                  <div>
                    <div className="hli-title">{a.title}</div>
                    <div className="hli-sub">{handoff.rationale}</div>
                  </div>
                  <StatusPill level={handoff.level}>{handoff.label}</StatusPill>
                </div>
              );
            })}
            {orgNudges.map((n) => (
              <div key={n.id} className="home-list-item" style={{ cursor: 'default' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--surface-soft)', border: '1px solid var(--rule)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>•</div>
                <div>
                  <div className="hli-title">{n.kind.replace(/_/g, ' ')}</div>
                  <div className="hli-sub">{n.message}</div>
                </div>
                <span className="hli-action">Advisory</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function TEAMS_WITHOUT_PARTNER_CARDS() {
  return TEAM_CARDS.filter((tc) => !tc.partnerTeamIds || tc.partnerTeamIds.length === 0)
    .map((tc) => TEAM_BY_ID[tc.teamId])
    .filter(Boolean);
}
