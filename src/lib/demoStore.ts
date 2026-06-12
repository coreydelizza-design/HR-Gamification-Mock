import { useSyncExternalStore } from 'react';
import type {
  Organization, OrganizationCard, OrganizationCategory, OrgTier,
  EngagementModel, OrgMeetingNorms, OrgCommercialProfile,
  RateCard, AttendanceMode, RoleBand, Currency, OrgMeeting,
} from './types';
import { ORGANIZATIONS } from '../data/organizations';
import { ORG_CARDS } from '../data/orgCards';
import { ORG_COMMERCIAL } from '../data/orgCommercial';
import { ENTERPRISE } from '../data/enterprise';
import { DEFAULT_RATE_CARD, buildRateCard } from '../data/rateCard';
import { ORG_MEETINGS } from '../data/meetingFit';

/**
 * demoStore — the mutable in-memory data source that powers interactive,
 * no-backend workshop sessions.
 *
 * It owns the only two record types a consultant edits live: Organizations
 * and their Organization Cards (plus the enterprise display label). Everything
 * else (dependencies, agreements, meetings, packs) stays static seed and is
 * imported directly by the analysis engine.
 *
 * Source of truth: an immutable `DemoState` object, replaced wholesale on
 * every mutation so React's useSyncExternalStore re-renders subscribers. The
 * state is persisted (debounced) to localStorage and is the exact shape that
 * Workshop export/import round-trips — and that the future Supabase seed maps
 * onto 1:1. See docs/WORKSHOP_MODE.md.
 */

export const SCHEMA_VERSION = 3 as const;
const STATE_KEY = 'fieldguide:demo-state:v3';
const SNAPSHOT_KEY = (n: number) => `fieldguide:demo-snapshot:${n}`;
export const MAX_SNAPSHOTS = 3;

/** Per-meeting, per-person attendance choice (self-assigned by the individual). */
export type AttendanceState = Record<string, Record<string, { mode: AttendanceMode; grantedAt?: string; revoked?: boolean }>>;

export interface DemoState {
  schemaVersion: typeof SCHEMA_VERSION;
  enterpriseLabel: string;
  organizations: Organization[];
  orgCards: OrganizationCard[];
  rateCard: RateCard;            // v3.5b — one per enterprise, Admin-editable
  attendance: AttendanceState;   // v3.5b — delegation / async choices + consent grants
  meetings: OrgMeeting[];        // v3.5c — user-composed meetings (overlay on the seed)
  modified: boolean;
}

export interface SessionFile extends DemoState {
  enterpriseLabel: string;
  exportedAt: string;
}

export interface SnapshotMeta {
  slot: number;
  enterpriseLabel: string;
  savedAt: string;
  orgCount: number;
}

/* ── clone + seed ─────────────────────────────────────────────── */
function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

function seedState(): DemoState {
  // Attach commercial profiles (org-level only) onto the seed cards.
  const orgCards = clone(ORG_CARDS).map((c) =>
    ORG_COMMERCIAL[c.orgId] ? { ...c, commercial: clone(ORG_COMMERCIAL[c.orgId]) } : c,
  );
  return {
    schemaVersion: SCHEMA_VERSION,
    enterpriseLabel: ENTERPRISE.name,
    organizations: clone(ORGANIZATIONS),
    orgCards,
    rateCard: clone(DEFAULT_RATE_CARD),
    attendance: {},
    meetings: [],
    modified: false,
  };
}

function loadState(): DemoState {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STATE_KEY) : null;
    if (!raw) return seedState();
    const parsed = JSON.parse(raw) as DemoState;
    if (parsed.schemaVersion !== SCHEMA_VERSION || !Array.isArray(parsed.organizations) || !Array.isArray(parsed.orgCards)) {
      return seedState(); // version/shape mismatch → discard and reload static data
    }
    // Backfill the v3.5b fields if an in-version state predates them.
    if (!parsed.rateCard) parsed.rateCard = clone(DEFAULT_RATE_CARD);
    if (!parsed.attendance) parsed.attendance = {};
    if (!Array.isArray(parsed.meetings)) parsed.meetings = [];
    return parsed;
  } catch {
    return seedState();
  }
}

/* ── store internals ──────────────────────────────────────────── */
let state: DemoState = loadState();
const listeners = new Set<() => void>();

let persistTimer: ReturnType<typeof setTimeout> | null = null;
function persist() {
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    try {
      window.localStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch {
      /* storage blocked/full — degrade silently to in-memory */
    }
  }, 250);
}

function commit(next: DemoState) {
  state = next;
  listeners.forEach((l) => l());
  persist();
}

export function getState(): DemoState {
  return state;
}

export function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}

/* ── derived index (memoized per state identity) ──────────────── */
export interface OrgIndex {
  organizations: Organization[];
  orgById: Record<string, Organization>;
  orgCards: OrganizationCard[];
  orgCardByOrg: Record<string, OrganizationCard>;
  orgCardById: Record<string, OrganizationCard>;
  tier1: Organization[];
  tier2: Organization[];
  enterpriseLabel: string;
  rateCard: RateCard;
  attendance: AttendanceState;
  meetings: OrgMeeting[];          // seed + user-composed, ready for the list/detail
  modified: boolean;
}

const indexCache = new WeakMap<DemoState, OrgIndex>();
export function indexOf(s: DemoState): OrgIndex {
  const hit = indexCache.get(s);
  if (hit) return hit;
  const idx: OrgIndex = {
    organizations: s.organizations,
    orgById: Object.fromEntries(s.organizations.map((o) => [o.id, o])),
    orgCards: s.orgCards,
    orgCardByOrg: Object.fromEntries(s.orgCards.map((c) => [c.orgId, c])),
    orgCardById: Object.fromEntries(s.orgCards.map((c) => [c.id, c])),
    tier1: s.organizations.filter((o) => o.tier === 1),
    tier2: s.organizations.filter((o) => o.tier === 2),
    enterpriseLabel: s.enterpriseLabel,
    rateCard: s.rateCard,
    attendance: s.attendance,
    meetings: [...ORG_MEETINGS, ...s.meetings],
    modified: s.modified,
  };
  indexCache.set(s, idx);
  return idx;
}

/* ── React hooks ──────────────────────────────────────────────── */
export function useDemoState(): DemoState {
  return useSyncExternalStore(subscribe, getState, getState);
}
export function useOrgData(): OrgIndex {
  return indexOf(useDemoState());
}

/* ── factories ────────────────────────────────────────────────── */
const BLANK_ENGAGEMENT: EngagementModel = {
  howToEngage: '', intakeProcess: '', intakeFields: [], contactChannel: '',
  responseRhythm: '', cadenceStyle: 'balanced', escalationPath: '',
  decisionRights: [], approvalRights: [],
};
const BLANK_NORMS: OrgMeetingNorms = {
  includeWhen: [], doNotIncludeWhen: [], requiredPreRead: '', requiredAgenda: '',
  requiredDecisionOwner: true, preferredLength: '25 min', preferredCadence: '',
  asyncAlternatives: [], recurringRules: '',
};

export function blankOrgCard(orgId: string): OrganizationCard {
  return {
    id: `card-${orgId.replace(/^o-/, '')}`,
    orgId,
    missionCriticalOutcomes: [], successConditions: [], leadingIndicators: [],
    laggingIndicators: [], operatingMetrics: [], capacitySignals: [], qualitySignals: [],
    riskSignals: [], stakeholderOutcomes: [], maturityLevel: 'forming',
    currentBlockers: [], nextBestActions: [],
    responsibilities: [], services: [], systems: [], decisions: [], processes: [],
    businessOutcomes: [], artifactsProduced: [], governanceAreas: [], notOwned: [],
    requiredInputs: [], missingInputFailureModes: [], escalationTriggers: [],
    commonMisconceptions: [], reworkCauses: [], delayCauses: [],
    outputs: [], servicesOffered: [], expertise: [], decisionSupport: [], enablement: [],
    riskReduction: [], acceleration: [], advisoryRole: [], reusableArtifacts: [],
    serviceExpectations: [], bestWaysToEngage: [],
    engagement: clone(BLANK_ENGAGEMENT),
    meetingNorms: clone(BLANK_NORMS),
    handoffRules: [], risks: [],
    publishedSections: ['overview'],
    lastUpdatedAt: new Date().toISOString(),
  };
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 24);
}

export interface NewOrgInput {
  name: string;
  category: OrganizationCategory;
  parentOrgId?: string;
  orgPackId: string;
  revenueRole?: OrgCommercialProfile['revenueRole'];
  mission: string;
  executiveOwner: string;
  operatingOwner: string;
  owns?: string[];
  needs?: string[];
  helps?: string[];
}

/* ── mutators ─────────────────────────────────────────────────── */

/** Merge a partial payload into an org card section and republish it. */
export function updateOrgCardSection(
  orgId: string,
  sectionKey: OrganizationCard['publishedSections'][number],
  payload: Partial<OrganizationCard>,
): void {
  const orgCards = state.orgCards.map((c) => {
    if (c.orgId !== orgId) return c;
    const published = new Set(c.publishedSections);
    published.add(sectionKey);
    return { ...c, ...payload, publishedSections: Array.from(published), lastUpdatedAt: new Date().toISOString() };
  });
  commit({ ...state, orgCards, modified: true });
}

/** Patch organization-level (overview) fields. */
export function updateOrganization(orgId: string, patch: Partial<Organization>): void {
  const organizations = state.organizations.map((o) =>
    o.id === orgId ? { ...o, ...patch, lastReviewedAt: new Date().toISOString() } : o,
  );
  commit({ ...state, organizations, modified: true });
}

export function updateCommercialProfile(orgId: string, profile: OrgCommercialProfile): void {
  const orgCards = state.orgCards.map((c) =>
    c.orgId === orgId
      ? { ...c, commercial: profile, publishedSections: Array.from(new Set([...c.publishedSections, 'overview' as const])), lastUpdatedAt: new Date().toISOString() }
      : c,
  );
  commit({ ...state, orgCards, modified: true });
}

export function createOrganization(input: NewOrgInput): string {
  const existing = new Set(state.organizations.map((o) => o.id));
  let base = `o-${slugify(input.name)}`;
  let id = base;
  let n = 2;
  while (existing.has(id)) { id = `${base}-${n++}`; }

  const now = new Date().toISOString();
  const org: Organization = {
    id,
    enterpriseId: ENTERPRISE.id,
    name: input.name,
    category: input.category,
    tier: 2 as OrgTier,
    mission: input.mission,
    executiveOwner: input.executiveOwner,
    operatingOwner: input.operatingOwner,
    parentOrgId: input.parentOrgId,
    orgPackId: input.orgPackId,
    memberCount: 0,
    partnerOrgIds: [],
    freshness: 'unpublished',
    lastReviewedAt: now,
    nextReviewAt: now,
    visibility: 'org',
    createdAt: now,
  };

  const card = blankOrgCard(id);
  if (input.owns?.length) card.responsibilities = input.owns;
  if (input.needs?.length) card.requiredInputs = input.needs.map((s) => ({ input: s, format: '', timing: '', qualityBar: '' }));
  if (input.helps?.length) card.outputs = input.helps;
  if (input.revenueRole) {
    card.commercial = { revenueRole: input.revenueRole, fiscalYear: 'FY2026', targets: [], keyCommercialMetrics: [] };
  }
  const published = new Set(card.publishedSections);
  if (input.owns?.length) published.add('what_owns');
  if (input.needs?.length) published.add('what_needs');
  if (input.helps?.length) published.add('how_helps');
  card.publishedSections = Array.from(published);

  commit({
    ...state,
    organizations: [...state.organizations, org],
    orgCards: [...state.orgCards, card],
    modified: true,
  });
  return id;
}

export function renameEnterprise(label: string): void {
  commit({ ...state, enterpriseLabel: label || ENTERPRISE.name, modified: true });
}

/* ── composed meetings (overlay on the seeded set) ────────────────── */
/** All meetings the product knows about: seeded + user-composed. */
export function allMeetings(): OrgMeeting[] {
  return [...ORG_MEETINGS, ...state.meetings];
}
export function meetingByIdAll(id: string): OrgMeeting | undefined {
  return allMeetings().find((m) => m.id === id);
}
function slugifyMeeting(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 28);
}
/** Persist a composed meeting; returns its assigned id. */
export function createMeeting(input: Omit<OrgMeeting, 'id'>): string {
  const existing = new Set(allMeetings().map((m) => m.id));
  let base = `m-${slugifyMeeting(input.title) || 'meeting'}`;
  let id = base; let n = 2;
  while (existing.has(id)) id = `${base}-${n++}`;
  const meeting: OrgMeeting = { ...input, id };
  commit({ ...state, meetings: [...state.meetings, meeting], modified: true });
  return id;
}

/* ── rate card (the seat, never the person) ───────────────────────── */
/** Rebuild the enterprise rate card from base salaries + multiplier; marks it edited. */
export function updateRateCard(
  bases: Record<RoleBand, number>, multiplier: number, currency: Currency,
): void {
  const rateCard = buildRateCard(bases, multiplier, currency, false);
  commit({ ...state, rateCard, modified: true });
}

/* ── attendance: the individual self-assigns their own mode ───────── */
/** Set (or clear) a person's attendance mode for a meeting. Choosing 'delegate'
 *  records a consent grant timestamp; switching away revokes it. */
export function setAttendanceMode(meetingId: string, personId: string, mode: AttendanceMode): void {
  const meetingMap = { ...(state.attendance[meetingId] ?? {}) };
  if (mode === 'live') {
    delete meetingMap[personId];
  } else {
    meetingMap[personId] = {
      mode,
      grantedAt: mode === 'delegate' ? new Date().toISOString() : undefined,
      revoked: false,
    };
  }
  const attendance = { ...state.attendance, [meetingId]: meetingMap };
  commit({ ...state, attendance, modified: true });
}

export function resetDemo(): void {
  try { window.localStorage.removeItem(STATE_KEY); } catch { /* ignore */ }
  commit(seedState());
}

/* ── session export / import ──────────────────────────────────── */
export function exportSession(): SessionFile {
  return { ...clone(state), exportedAt: new Date().toISOString() };
}

export function importSession(file: unknown): { ok: boolean; error?: string } {
  try {
    const f = file as Partial<SessionFile>;
    if (!f || f.schemaVersion !== SCHEMA_VERSION) return { ok: false, error: `Unsupported schema version (need ${SCHEMA_VERSION}).` };
    if (!Array.isArray(f.organizations) || !Array.isArray(f.orgCards)) return { ok: false, error: 'Malformed session: missing organizations/cards.' };
    commit({
      schemaVersion: SCHEMA_VERSION,
      enterpriseLabel: f.enterpriseLabel || ENTERPRISE.name,
      organizations: clone(f.organizations),
      orgCards: clone(f.orgCards),
      rateCard: f.rateCard ? clone(f.rateCard) : clone(DEFAULT_RATE_CARD),
      attendance: f.attendance ? clone(f.attendance) : {},
      meetings: Array.isArray(f.meetings) ? clone(f.meetings) : [],
      modified: true,
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

/* ── local snapshots (up to MAX_SNAPSHOTS) ────────────────────── */
export function saveSnapshot(): void {
  // shift 2→3, 1→2, then write current to slot 1
  try {
    for (let i = MAX_SNAPSHOTS - 1; i >= 1; i--) {
      const prev = window.localStorage.getItem(SNAPSHOT_KEY(i));
      if (prev) window.localStorage.setItem(SNAPSHOT_KEY(i + 1), prev);
    }
    const payload = JSON.stringify({ ...exportSession(), savedAt: new Date().toISOString() });
    window.localStorage.setItem(SNAPSHOT_KEY(1), payload);
    listeners.forEach((l) => l());
  } catch { /* ignore */ }
}

export function listSnapshots(): SnapshotMeta[] {
  const out: SnapshotMeta[] = [];
  for (let i = 1; i <= MAX_SNAPSHOTS; i++) {
    try {
      const raw = window.localStorage.getItem(SNAPSHOT_KEY(i));
      if (!raw) continue;
      const p = JSON.parse(raw) as SessionFile & { savedAt?: string };
      out.push({ slot: i, enterpriseLabel: p.enterpriseLabel, savedAt: p.savedAt ?? p.exportedAt, orgCount: p.organizations.length });
    } catch { /* skip */ }
  }
  return out;
}

export function restoreSnapshot(slot: number): { ok: boolean; error?: string } {
  try {
    const raw = window.localStorage.getItem(SNAPSHOT_KEY(slot));
    if (!raw) return { ok: false, error: 'Snapshot not found.' };
    return importSession(JSON.parse(raw));
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
