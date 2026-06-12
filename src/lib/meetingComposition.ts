import type {
  OrgMeeting, AgreementStatus, MeetingAgendaItem,
} from './types';
import { getState, indexOf } from './demoStore';
import { orgName } from './orgData';
import { metaOf, classifyMeeting, isEscalation, fmtDate } from './proxyEngine';
import { SUCCESS_AGREEMENTS } from '../data/successAgreements';
import { ORG_NEEDS } from '../data/orgNeedsOffers';
import { ORG_OF_PERSON } from '../data/roleCards';
import { PERSON_BY_ID } from '../data/people';
import { ORG_MEETING_FIT_BY_MEETING } from '../data/meetingFit';

/**
 * Meeting composition — deterministic org-set analysis and the Meeting
 * Expectations Brief. Both are PURE and card-cited: every line traces to a
 * published organization card section. No LLM calls (an LLM-polished rendering
 * is a marked Phase-5 extension point only). Pairwise relationship analysis
 * reuses the same agreement / needs data the rest of the product reads.
 */

/* ════════════════════════════════════════════════════════════════
   Org-set analysis — aggregate pairwise across C(n,2) pairs
   ════════════════════════════════════════════════════════════════ */

export interface PairRel {
  aId: string; bId: string;
  agreementId?: string;
  status: AgreementStatus | 'missing';
  rationale: string;
  worst: number;                 // sort key: missing(3) > needs_refresh(2) > other(1) > published(0)
}
export interface OrgSetInput {
  input: string; ownerOrgId: string; providerOrgId?: string;
  inRoom: boolean; present: boolean; needBy?: string; rationale: string;
}
export interface OrgSetDecision {
  topic: string; holderOrgId?: string; inRoom: boolean; rationale: string;
}
export interface OrgSetEscalationOwner {
  orgId: string; ownerName?: string; path?: string; hasPath: boolean; rationale: string;
}
export interface MeetingOrgSetAnalysis {
  orgIds: string[];
  pairCount: number;
  pairs: PairRel[];
  agreementsMissing: number;
  agreementsNeedRefresh: number;
  agreementsHealthy: number;
  requiredInputs: OrgSetInput[];
  inputsUnowned: number;
  decisions: OrgSetDecision[];
  unownedDecisions: number;
  escalationOwners: OrgSetEscalationOwner[];
  escalationGaps: string[];      // orgIds with no published escalation path
}

const AGREEMENT_WORST: Record<AgreementStatus | 'missing', number> = {
  missing: 3, needs_refresh: 2, draft: 1, shared: 1, mutual_review: 1, archived: 1, published: 0,
};

function agreementBetween(a: string, b: string): { id?: string; status: AgreementStatus | 'missing' } {
  const agr = SUCCESS_AGREEMENTS.find((s) => s.orgIds.includes(a) && s.orgIds.includes(b));
  return agr ? { id: agr.id, status: agr.status } : { status: 'missing' };
}

/** analyzeMeetingOrgSet — runs the pairwise relationship analysis across all
 *  C(n,2) pairs and aggregates to meeting level. Every output carries a rationale. */
export function analyzeMeetingOrgSet(meeting: OrgMeeting): MeetingOrgSetAnalysis {
  const idx = indexOf(getState());
  const orgIds = meeting.participatingOrgIds;
  const meta = metaOf(meeting);
  const inSet = (id: string) => orgIds.includes(id);

  // pairs
  const pairs: PairRel[] = [];
  for (let i = 0; i < orgIds.length; i++) {
    for (let j = i + 1; j < orgIds.length; j++) {
      const a = orgIds[i], b = orgIds[j];
      const { id, status } = agreementBetween(a, b);
      const rationale = status === 'missing'
        ? `${orgName(a)} ↔ ${orgName(b)}: no published Success Agreement — expectations derive from each org's card only.`
        : status === 'published'
          ? `${orgName(a)} ↔ ${orgName(b)}: Success Agreement published and governing.`
          : `${orgName(a)} ↔ ${orgName(b)}: agreement ${status.replace('_', ' ')} — not yet a reliable floor.`;
      pairs.push({ aId: a, bId: b, agreementId: id, status, rationale, worst: AGREEMENT_WORST[status] });
    }
  }
  pairs.sort((x, y) => y.worst - x.worst);
  const agreementsMissing = pairs.filter((p) => p.status === 'missing').length;
  const agreementsNeedRefresh = pairs.filter((p) => p.status === 'needs_refresh').length;
  const agreementsHealthy = pairs.filter((p) => p.status === 'published').length;

  // required inputs — from the meeting fit (seeded) unioned with intra-set org needs
  const inputs: OrgSetInput[] = [];
  const seen = new Set<string>();
  const fit = ORG_MEETING_FIT_BY_MEETING[meeting.id];
  for (const ri of fit?.requiredInputs ?? []) {
    if (seen.has(ri.input)) continue;
    seen.add(ri.input);
    const nb = meta.inputNeedBy?.[ri.input]?.date;
    inputs.push({
      input: ri.input, ownerOrgId: ri.orgId, inRoom: inSet(ri.orgId),
      present: ri.received, needBy: nb,
      rationale: inSet(ri.orgId)
        ? `${orgName(ri.orgId)} owns this input (its org card §What it owns).`
        : `${orgName(ri.orgId)} owns this input but is NOT in the room — unowned here.`,
    });
  }
  for (const n of ORG_NEEDS) {
    if (!inSet(n.ownerOrgId)) continue;
    if (seen.has(n.description)) continue;
    seen.add(n.description);
    inputs.push({
      input: n.description, ownerOrgId: n.needFromOrgId, providerOrgId: n.needFromOrgId,
      inRoom: inSet(n.needFromOrgId), present: n.status === 'covered',
      rationale: inSet(n.needFromOrgId)
        ? `${orgName(n.ownerOrgId)} needs this from ${orgName(n.needFromOrgId)} (§What it needs · ${n.timing}).`
        : `${orgName(n.ownerOrgId)} needs this from ${orgName(n.needFromOrgId)}, who is NOT in the room — unowned here.`,
    });
  }
  const inputsUnowned = inputs.filter((i) => !i.inRoom).length;

  // decisions — which org holds each decision-kind agenda item
  const ownerOrg = ORG_OF_PERSON[meeting.decisionOwnerPersonId];
  const decisions: OrgSetDecision[] = meta.agenda
    .filter((a) => a.kind === 'decision')
    .map((a) => {
      const inRoom = !!ownerOrg && inSet(ownerOrg);
      return {
        topic: a.topic,
        holderOrgId: ownerOrg,
        inRoom,
        rationale: inRoom
          ? `${orgName(ownerOrg)} holds this decision (decision owner ${PERSON_BY_ID[meeting.decisionOwnerPersonId]?.name ?? ''}).`
          : `No represented org holds this decision — the decision owner's org (${orgName(ownerOrg) || 'unknown'}) is not in the room.`,
      };
    });
  const unownedDecisions = decisions.filter((d) => !d.inRoom).length;

  // escalation owners — per participating org, from its card §Engagement Model
  const escalationOwners: OrgSetEscalationOwner[] = orgIds.map((id) => {
    const org = idx.orgById[id];
    const card = idx.orgCardByOrg[id];
    const path = card?.engagement?.escalationPath?.trim();
    return {
      orgId: id,
      ownerName: org?.operatingOwner,
      path: path || undefined,
      hasPath: !!path,
      rationale: path
        ? `Escalation path owner — ${orgName(id)} org card §Engagement Model: "${path}".`
        : `${orgName(id)} has no published escalation path — add one to its org card §Engagement Model.`,
    };
  });
  const escalationGaps = escalationOwners.filter((e) => !e.hasPath).map((e) => e.orgId);

  return {
    orgIds, pairCount: pairs.length, pairs,
    agreementsMissing, agreementsNeedRefresh, agreementsHealthy,
    requiredInputs: inputs, inputsUnowned,
    decisions, unownedDecisions,
    escalationOwners, escalationGaps,
  };
}

/* ════════════════════════════════════════════════════════════════
   Meeting Expectations Brief — deterministic, card-cited composition
   ════════════════════════════════════════════════════════════════ */

export interface OrgExpectation {
  orgId: string;
  walksInExpecting: string[];     // §Needs
  brings: string[];               // §Helps Others Succeed
  decisionRights: string[];       // §Engagement Model
  norms: string[];                // §Meeting Norms
  escalationOwner?: string;       // name · role + path
  freshnessNote?: string;
}
export interface ExpectationsBrief {
  title: string;
  type: 'standard' | 'escalation';
  className: string;
  purpose: string;
  orgs: OrgExpectation[];
  successChecklist: string[];
  caveats: string[];              // missing-agreement flags, unowned items
  sourceNote: string;
  composedNote: string;
}

const STOP = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'into', 'over', 'per', 'a', 'an', 'of', 'to', 'on', 'in', 'is', 'are', 'be', 'how', 'what', 'each', 'any', 'its', 'our', 'their']);
function tokens(s: string): Set<string> {
  return new Set(s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3 && !STOP.has(w)));
}
function overlaps(text: string, agendaTokens: Set<string>): boolean {
  for (const t of tokens(text)) if (agendaTokens.has(t)) return true;
  return false;
}

/** composeExpectationsBrief — pure; every line derives from published org cards. */
export function composeExpectationsBrief(meeting: OrgMeeting, analysis: MeetingOrgSetAnalysis): ExpectationsBrief {
  const idx = indexOf(getState());
  const meta = metaOf(meeting);
  const { cls } = classifyMeeting(meeting);
  const escalation = isEscalation(meeting);
  const agendaText = meta.agenda.map((a) => a.topic).join(' ') + ' ' + meeting.decisionRequested;
  const agendaTokens = tokens(agendaText);
  const hasDecision = meta.agenda.some((a) => a.kind === 'decision');
  const hasInput = meta.agenda.some((a) => a.kind === 'decision' || a.kind === 'input_review');

  // purpose line
  const decisionItem = meta.agenda.find((a) => a.kind === 'decision');
  const need = decisionItem?.needBy ? ` — needed by ${fmtDate(decisionItem.needBy.date)}` : '';
  const purpose = `${meeting.title} · ${escalation ? 'escalation' : 'standard'} · ${cls} — ${meeting.decisionRequested}${need}`;

  // per-org expectations (only agenda-relevant sections render; empty omitted)
  const orgs: OrgExpectation[] = meeting.participatingOrgIds.map((id) => {
    const card = idx.orgCardByOrg[id];
    const org = idx.orgById[id];
    const esc = analysis.escalationOwners.find((e) => e.orgId === id);

    // Relevant when the agenda calls for input; prefer keyword-matched inputs,
    // fall back to the first few so a real org never shows an empty section.
    const allInputs = card?.requiredInputs ?? [];
    const matchedInputs = allInputs.filter((ri) => overlaps(`${ri.input} ${ri.qualityBar}`, agendaTokens));
    const inputs = !hasInput ? [] : (matchedInputs.length ? matchedInputs : allInputs).slice(0, 4)
      .map((ri) => `${ri.input}${ri.format ? ` · ${ri.format}` : ''}${ri.qualityBar ? ` · bar: ${ri.qualityBar}` : ''}${ri.timing ? ` · ${ri.timing}` : ''}`);

    const helps = [...(card?.outputs ?? []), ...(card?.servicesOffered ?? [])]
      .filter((h) => agendaTokens.size === 0 || overlaps(h, agendaTokens))
      .slice(0, 4);
    const bringsFallback = (card?.outputs ?? []).slice(0, 2);
    const brings = helps.length ? helps : bringsFallback;

    const rights = hasDecision
      ? (card?.engagement?.decisionRights ?? []).slice(0, 4)
      : [];

    const m = card?.meetingNorms;
    const norms = m ? [
      m.requiredPreRead ? `Pre-read required: ${m.requiredPreRead}` : '',
      `Decision owner required: ${m.requiredDecisionOwner ? 'yes' : 'no'}`,
      m.preferredLength ? `Preferred length: ${m.preferredLength}` : '',
      m.asyncAlternatives?.length ? `Async preference: ${m.asyncAlternatives[0]}` : '',
    ].filter(Boolean) : [];

    const freshnessNote = org ? `card ${org.freshness} · reviewed ${org.lastReviewedAt.slice(0, 10)}` : undefined;

    return {
      orgId: id,
      walksInExpecting: inputs,
      brings,
      decisionRights: rights,
      norms,
      escalationOwner: esc?.hasPath ? `${esc.ownerName ?? orgName(id)} — ${esc.path}` : undefined,
      freshnessNote,
    };
  });

  // success checklist
  const successChecklist: string[] = [];
  for (const ri of analysis.requiredInputs) {
    successChecklist.push(`${ri.present ? '✓' : '✕'} ${ri.input} — owner ${orgName(ri.ownerOrgId)}${ri.inRoom ? '' : ' (NOT in room)'}${ri.needBy ? ` · need by ${fmtDate(ri.needBy)}` : ''}`);
  }
  for (const d of analysis.decisions) {
    successChecklist.push(`${d.inRoom ? '✓' : '✕'} Decision: ${d.topic} — ${d.inRoom ? `held by ${orgName(d.holderOrgId!)}` : 'no represented org holds it'}`);
  }
  const preReadOrgs = meeting.participatingOrgIds.filter((id) => idx.orgCardByOrg[id]?.meetingNorms?.requiredPreRead);
  if (preReadOrgs.length) successChecklist.push(`◻ Pre-read obligations: ${preReadOrgs.map(orgName).join(', ')} require a pre-read`);

  // caveats — missing-agreement flags per pair + unowned items
  const caveats: string[] = [];
  for (const p of analysis.pairs.filter((x) => x.status === 'missing')) {
    caveats.push(`${orgName(p.aId)} ↔ ${orgName(p.bId)}: no published Success Agreement — expectations below derive from individual org cards only.`);
  }
  for (const ri of analysis.requiredInputs.filter((x) => !x.inRoom)) {
    caveats.push(`Unowned input: "${ri.input}" — ${orgName(ri.ownerOrgId)} is not in the room.`);
  }
  for (const d of analysis.decisions.filter((x) => !x.inRoom)) {
    caveats.push(`Unowned decision: "${d.topic}" — the decision owner's org is not represented.`);
  }
  for (const id of analysis.escalationGaps) {
    caveats.push(`${orgName(id)} has no published escalation path — add one to its org card.`);
  }

  // source note — worst two orgs by freshness
  const byStale = [...meeting.participatingOrgIds]
    .map((id) => idx.orgById[id])
    .filter(Boolean)
    .sort((a, b) => new Date(a.lastReviewedAt).getTime() - new Date(b.lastReviewedAt).getTime())
    .slice(0, 2);
  const sourceNote = `Every line above derives from published organization cards. Stale cards produce stale expectations — last refresh dates: ${byStale.map((o) => `${o.name} (${o.lastReviewedAt.slice(0, 10)})`).join(', ')}.`;

  return {
    title: meeting.title,
    type: escalation ? 'escalation' : 'standard',
    className: cls,
    purpose,
    orgs,
    successChecklist,
    caveats,
    sourceNote,
    composedNote: 'Composed from organization cards — deterministic, no AI. (An LLM-polished rendering is a Phase-5 extension.)',
  };
}

/* ════════════════════════════════════════════════════════════════
   Markdown export — SAME composition, single source
   ════════════════════════════════════════════════════════════════ */
export function briefToMarkdown(brief: ExpectationsBrief): string {
  const L: string[] = [];
  L.push(`# Meeting Expectations Brief — ${brief.title}`);
  L.push('');
  L.push(`_${brief.composedNote}_`);
  L.push('');
  L.push(`**Purpose:** ${brief.purpose}`);
  L.push('');
  for (const o of brief.orgs) {
    L.push(`## ${orgName(o.orgId)}`);
    if (o.walksInExpecting.length) { L.push(`**Walks in expecting:**`); o.walksInExpecting.forEach((x) => L.push(`- ${x}`)); }
    if (o.brings.length) { L.push(`**Brings:**`); o.brings.forEach((x) => L.push(`- ${x}`)); }
    if (o.decisionRights.length) { L.push(`**Decision rights in play:**`); o.decisionRights.forEach((x) => L.push(`- ${x}`)); }
    if (o.norms.length) { L.push(`**Meeting norms:**`); o.norms.forEach((x) => L.push(`- ${x}`)); }
    if (o.escalationOwner) L.push(`**Escalation owner:** ${o.escalationOwner}`);
    L.push('');
  }
  L.push(`## What this meeting needs to succeed`);
  brief.successChecklist.forEach((x) => L.push(`- ${x}`));
  L.push('');
  if (brief.caveats.length) {
    L.push(`## Caveats`);
    brief.caveats.forEach((x) => L.push(`- ${x}`));
    L.push('');
  }
  L.push(`> ${brief.sourceNote}`);
  L.push('');
  return L.join('\n');
}
