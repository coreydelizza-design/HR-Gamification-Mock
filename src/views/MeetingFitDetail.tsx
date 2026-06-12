import { useState } from 'react';
import { ORG_MEETING_BY_ID, ORG_MEETING_FIT_BY_MEETING } from '../data/meetingFit';
import { SUCCESS_AGREEMENT_BY_ID } from '../data/successAgreements';
import { PERSON_BY_ID, WORK_CARD_BY_PERSON, CARD_ANSWERS, ME } from '../data/people';
import { orgName } from '../lib/orgData';
import { formatMeetingTime } from '../lib/readiness';
import { useOrgData } from '../lib/demoStore';
import { classifyMeeting, inviteesFor } from '../lib/proxyEngine';
import type { Meeting } from '../lib/types';
import { IconArrowLeft } from '../components/Icons';
import { MeetingFitBadge, NestedIndividualCard, OrgFreshnessBadge } from '../components/Org';
import {
  MeetingClassBadge, EconomicsStrip, AgendaList, TimingBanners,
  RosterTable, DigestPreview, DuplicateMergeCard,
} from '../components/Proxy';

interface Props {
  meetingId: string | null;
  onBack: () => void;
  onOpenOrg: (id: string) => void;
  onOpenAgreement: (id: string) => void;
  onOpenMeeting?: (id: string) => void;
}

export default function MeetingFitDetail({ meetingId, onBack, onOpenOrg, onOpenAgreement, onOpenMeeting }: Props) {
  useOrgData(); // subscribe so attendance changes re-toggle the digest panel
  const meeting = meetingId ? ORG_MEETING_BY_ID[meetingId] : undefined;
  const [actingAs, setActingAs] = useState<string>(ME.id);
  if (!meeting) return <div style={{ fontSize: 13, color: 'var(--muted)' }}>Meeting not found. <button className="detail-back" onClick={onBack}>Back</button></div>;

  const fit = ORG_MEETING_FIT_BY_MEETING[meeting.id];
  const decisionOwner = PERSON_BY_ID[meeting.decisionOwnerPersonId];
  const followUp = fit ? PERSON_BY_ID[fit.followUpOwnerPersonId] : undefined;
  const agreement = meeting.governingAgreementId ? SUCCESS_AGREEMENT_BY_ID[meeting.governingAgreementId] : undefined;
  const { cls, rationale } = classifyMeeting(meeting);

  // The acting persona's own row — drives the digest preview when they delegate.
  const actingInvitee = inviteesFor(meeting).find((i) => i.personId === actingAs);
  const actingDelegating = actingInvitee?.chosenMode === 'delegate';

  const timeStr = formatMeetingTime({ startsAt: meeting.startsAt, durationMinutes: meeting.durationMinutes } as Meeting);

  return (
    <>
      <button className="detail-back" onClick={onBack}><IconArrowLeft size={13} /> Meeting Fit</button>

      <div className="detail-hero">
        <div>
          <div className="detail-title">{meeting.title}</div>
          <div className="detail-sub">{meeting.agendaSummary}</div>
          <div className="detail-meta-row">
            <MeetingClassBadge cls={cls} title={rationale} />
            {fit && <MeetingFitBadge status={fit.status} />}
            <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{timeStr}</span>
          </div>
          <div className="detail-meta-row">
            {meeting.participatingOrgIds.map((id) => (
              <button key={id} className="cat-tag" style={{ cursor: 'pointer' }} onClick={() => onOpenOrg(id)}>{orgName(id)}</button>
            ))}
          </div>
          <div className="class-rationale">{rationale}</div>
        </div>
      </div>

      <TimingBanners meeting={meeting} />

      {/* Economics — the centerpiece */}
      <div className="org-panel">
        <div className="org-panel-head"><span className="org-panel-title">Meeting economics</span></div>
        <EconomicsStrip meeting={meeting} />
      </div>

      <DuplicateMergeCard meeting={meeting} onOpenMeeting={onOpenMeeting} />

      {/* Agenda with need-by + urgency */}
      <div className="org-panel">
        <div className="org-panel-head"><span className="org-panel-title">Agenda</span></div>
        <AgendaList meeting={meeting} />
      </div>

      {/* Roster — two-sided consent */}
      <div className="org-panel">
        <div className="org-panel-head">
          <span className="org-panel-title">Roster &amp; representation</span>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--muted)' }}>Acting as <strong>{PERSON_BY_ID[actingAs]?.name}</strong></span>
        </div>
        <RosterTable meeting={meeting} actingAs={actingAs} onActAs={setActingAs} />
      </div>

      {actingDelegating && <DigestPreview personId={actingAs} meeting={meeting} />}

      <div className="fit-grid">
        <div className="fit-cell">
          <div className="fit-cell-label">Decision requested</div>
          <div className="fit-cell-body">{meeting.decisionRequested}</div>
        </div>
        <div className="fit-cell">
          <div className="fit-cell-label">Decision owner</div>
          <div className="fit-cell-body">
            {fit?.decisionOwnerPresent ? (decisionOwner?.name ?? '—') : <span style={{ color: 'var(--danger-text)' }}>Not present — at risk</span>}
          </div>
        </div>
        <div className="fit-cell">
          <div className="fit-cell-label">Required inputs</div>
          <div className="fit-list" style={{ marginTop: 6 }}>
            {(fit?.requiredInputs ?? []).map((ri, i) => (
              <div key={i} className="fit-list-item">
                <span className={ri.received ? 'fit-check' : 'fit-cross'}>{ri.received ? '✓' : '✕'}</span>
                <span>{ri.input}</span>
                <span className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{orgName(ri.orgId)}</span>
              </div>
            ))}
            {(!fit || fit.requiredInputs.length === 0) && <span className="card-section-empty">None tracked.</span>}
          </div>
        </div>
        <div className="fit-cell">
          <div className="fit-cell-label">Readiness reasoning</div>
          <div className="fit-cell-body" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span>Agenda: {fit?.agendaReadiness ?? '—'}</span>
            <span>Format matches norms: {fit?.formatMatchesNorms ? 'yes' : 'no'}</span>
            {fit && fit.missingOrgIds.length > 0 && <span style={{ color: 'var(--danger-text)' }}>Missing: {fit.missingOrgIds.map(orgName).join(', ')}</span>}
            {fit?.asyncRecommendation && <span style={{ fontStyle: 'italic' }}>Async: {fit.asyncRecommendation}</span>}
          </div>
        </div>
      </div>

      {fit && (
        <div className="fit-grid" style={{ marginTop: 12 }}>
          <div className="fit-cell"><div className="fit-cell-label">Handoff impact</div><div className="fit-cell-body">{fit.handoffImpact}</div></div>
          <div className="fit-cell"><div className="fit-cell-label">Cross-org risk</div><div className="fit-cell-body">{fit.createsOrResolvesRisk}</div></div>
          <div className="fit-cell"><div className="fit-cell-label">Next best action</div><div className="fit-cell-body">{fit.nextBestAction}</div></div>
          <div className="fit-cell"><div className="fit-cell-label">Follow-up owner</div><div className="fit-cell-body">{followUp?.name ?? '—'}</div></div>
        </div>
      )}

      {agreement && (
        <div className="org-panel">
          <div className="org-panel-head"><span className="org-panel-title">Applicable Success Agreement</span></div>
          <div className="row-card" onClick={() => onOpenAgreement(agreement.id)}>
            <div className="row-card-head"><span className="row-card-title">{agreement.title}</span><OrgFreshnessBadge state={agreement.freshness} /></div>
            <div className="row-card-body">{agreement.sharedBusinessOutcome}</div>
          </div>
        </div>
      )}

      {/* Attendee context — the meeting-prep survival rule */}
      <div className="org-panel">
        <div className="org-panel-head"><span className="org-panel-title">Attendee context</span></div>
        <div style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 12 }}>
          Individual cards for everyone in the room — communication, meetings, and escalation preferences — so you can prepare.
        </div>
        <div className="agree-grid">
          {meeting.attendeePersonIds.map((pid) => {
            const p = PERSON_BY_ID[pid];
            return p ? <NestedIndividualCard key={pid} person={p} workCard={WORK_CARD_BY_PERSON[pid]} answers={CARD_ANSWERS} /> : null;
          })}
        </div>
      </div>
    </>
  );
}
