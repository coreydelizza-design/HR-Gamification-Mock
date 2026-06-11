import { useState } from 'react';
import type {
  Organization, OrganizationCard, OrgCardSectionKey, OrgMetric, RequiredInput,
  OrgRisk, HandoffRule, EngagementModel, OrgMeetingNorms,
} from '../lib/types';
import {
  updateOrgCardSection, updateOrganization, useOrgData,
} from '../lib/demoStore';
import { ORG_PACKS } from '../data/orgPacks';
import { PEOPLE } from '../data/people';
import {
  ChipInput, EnumSelect, EntitySelect, TextField, TextArea, NumberField, DateField,
  Field, SectionEditFrame,
} from './Editors';

/**
 * Data-driven Organization Card section editors. One SectionEditor renders the
 * right structured inputs for any section from a field spec, and writes through
 * demoStore so analyzeOrganizationSuccess re-runs and readiness moves on save.
 *
 * Field-shape rules: closed unions -> <select>, string lists -> chip input,
 * entity refs -> searchable select, short/long text -> input/textarea,
 * numbers/dates -> number/date. Free text is the exception.
 */

type Target = 'card' | 'org' | 'engagement' | 'meetingNorms';
type Kind =
  | 'chips' | 'text' | 'textarea' | 'number' | 'date'
  | 'enum' | 'bool' | 'entities' | 'entity'
  | 'reqInputs' | 'metrics' | 'risks';

interface FieldSpec {
  key: string;
  label: string;
  kind: Kind;
  target: Target;
  options?: Array<{ value: string; label: string }>;
  entitySource?: 'orgs' | 'people' | 'packs';
  hint?: string;
}

const MATURITY = ['forming', 'developing', 'established', 'leading'].map((v) => ({ value: v, label: v }));
const CADENCE_STYLE = [
  { value: 'async_first', label: 'Async-first' },
  { value: 'meeting_first', label: 'Meeting-first' },
  { value: 'balanced', label: 'Balanced' },
];
const FRESHNESS = ['fresh', 'aging', 'stale', 'unpublished'].map((v) => ({ value: v, label: v }));
const VISIBILITY = ['org', 'team', 'partners', 'private'].map((v) => ({ value: v, label: v }));
const CATEGORY = ['leadership', 'technology', 'revenue', 'customer', 'people', 'finance_legal', 'operations'].map((v) => ({ value: v, label: v.replace('_', ' & ') }));
const LENGTH = ['15 min', '25 min', '50 min'].map((v) => ({ value: v, label: v }));
const MEETING_CADENCE = ['Weekly', 'Biweekly', 'Monthly', 'Quarterly', 'As needed'].map((v) => ({ value: v, label: v }));

const SECTION_SPECS: Partial<Record<OrgCardSectionKey, FieldSpec[]>> = {
  overview: [
    { key: 'mission', label: 'Mission', kind: 'textarea', target: 'org' },
    { key: 'executiveOwner', label: 'Executive owner', kind: 'text', target: 'org' },
    { key: 'operatingOwner', label: 'Operating owner', kind: 'text', target: 'org' },
    { key: 'category', label: 'Category', kind: 'enum', target: 'org', options: CATEGORY },
    { key: 'orgPackId', label: 'Org pack', kind: 'entity', target: 'org', entitySource: 'packs' },
    { key: 'parentOrgId', label: 'Parent organization', kind: 'entity', target: 'org', entitySource: 'orgs' },
    { key: 'partnerOrgIds', label: 'Key partner organizations', kind: 'entities', target: 'org', entitySource: 'orgs' },
    { key: 'memberCount', label: 'Member count', kind: 'number', target: 'org' },
    { key: 'visibility', label: 'Visibility', kind: 'enum', target: 'org', options: VISIBILITY },
  ],
  how_succeeds: [
    { key: 'missionCriticalOutcomes', label: 'Mission-critical outcomes', kind: 'chips', target: 'card' },
    { key: 'successConditions', label: 'Top success conditions', kind: 'chips', target: 'card' },
    { key: 'leadingIndicators', label: 'Leading indicators', kind: 'chips', target: 'card' },
    { key: 'laggingIndicators', label: 'Lagging indicators', kind: 'chips', target: 'card' },
    { key: 'operatingMetrics', label: 'Operating metrics', kind: 'metrics', target: 'card', hint: 'Format: Label :: Value (e.g. SLO attainment :: 99.2%)' },
    { key: 'capacitySignals', label: 'Capacity signals', kind: 'chips', target: 'card' },
    { key: 'qualitySignals', label: 'Quality signals', kind: 'chips', target: 'card' },
    { key: 'riskSignals', label: 'Risk signals', kind: 'chips', target: 'card' },
    { key: 'stakeholderOutcomes', label: 'Stakeholder outcomes', kind: 'chips', target: 'card' },
    { key: 'maturityLevel', label: 'Maturity level', kind: 'enum', target: 'card', options: MATURITY },
    { key: 'currentBlockers', label: 'Current blockers', kind: 'chips', target: 'card' },
    { key: 'nextBestActions', label: 'Next best actions', kind: 'chips', target: 'card' },
  ],
  what_owns: [
    { key: 'responsibilities', label: 'Responsibilities', kind: 'chips', target: 'card' },
    { key: 'services', label: 'Services', kind: 'chips', target: 'card' },
    { key: 'systems', label: 'Systems', kind: 'chips', target: 'card' },
    { key: 'decisions', label: 'Decisions', kind: 'chips', target: 'card' },
    { key: 'processes', label: 'Processes', kind: 'chips', target: 'card' },
    { key: 'businessOutcomes', label: 'Business outcomes', kind: 'chips', target: 'card' },
    { key: 'artifactsProduced', label: 'Artifacts produced', kind: 'chips', target: 'card' },
    { key: 'governanceAreas', label: 'Governance areas', kind: 'chips', target: 'card' },
    { key: 'notOwned', label: 'Explicitly NOT owned', kind: 'chips', target: 'card' },
  ],
  what_needs: [
    { key: 'requiredInputs', label: 'Required inputs', kind: 'reqInputs', target: 'card' },
    { key: 'missingInputFailureModes', label: 'Missing-input failure modes', kind: 'chips', target: 'card' },
    { key: 'escalationTriggers', label: 'Escalation triggers', kind: 'chips', target: 'card' },
    { key: 'commonMisconceptions', label: 'Common misconceptions', kind: 'chips', target: 'card' },
    { key: 'reworkCauses', label: 'Rework causes', kind: 'chips', target: 'card' },
    { key: 'delayCauses', label: 'Delay causes', kind: 'chips', target: 'card' },
  ],
  how_helps: [
    { key: 'outputs', label: 'Outputs', kind: 'chips', target: 'card' },
    { key: 'servicesOffered', label: 'Services offered', kind: 'chips', target: 'card' },
    { key: 'expertise', label: 'Expertise', kind: 'chips', target: 'card' },
    { key: 'decisionSupport', label: 'Decision support', kind: 'chips', target: 'card' },
    { key: 'enablement', label: 'Enablement', kind: 'chips', target: 'card' },
    { key: 'riskReduction', label: 'Risk reduction', kind: 'chips', target: 'card' },
    { key: 'acceleration', label: 'Acceleration', kind: 'chips', target: 'card' },
    { key: 'advisoryRole', label: 'Advisory role', kind: 'chips', target: 'card' },
    { key: 'reusableArtifacts', label: 'Reusable artifacts', kind: 'chips', target: 'card' },
    { key: 'serviceExpectations', label: 'Service expectations (SLEs)', kind: 'chips', target: 'card' },
    { key: 'bestWaysToEngage', label: 'Best ways to engage', kind: 'chips', target: 'card' },
  ],
  dependencies: [
    { key: 'partnerOrgIds', label: 'Partner organizations', kind: 'entities', target: 'org', entitySource: 'orgs', hint: 'Cross-org dependency edges are seeded; partner links are the card-owned field.' },
  ],
  engagement: [
    { key: 'howToEngage', label: 'How to engage', kind: 'text', target: 'engagement' },
    { key: 'intakeProcess', label: 'Intake process', kind: 'textarea', target: 'engagement' },
    { key: 'intakeFields', label: 'Required intake fields', kind: 'chips', target: 'engagement' },
    { key: 'contactChannel', label: 'Contact channel', kind: 'text', target: 'engagement' },
    { key: 'responseRhythm', label: 'Response rhythm', kind: 'text', target: 'engagement' },
    { key: 'officeHours', label: 'Office hours', kind: 'text', target: 'engagement' },
    { key: 'cadenceStyle', label: 'Cadence style', kind: 'enum', target: 'engagement', options: CADENCE_STYLE },
    { key: 'escalationPath', label: 'Escalation path', kind: 'textarea', target: 'engagement' },
    { key: 'decisionRights', label: 'Decision rights', kind: 'chips', target: 'engagement' },
    { key: 'approvalRights', label: 'Approval rights', kind: 'chips', target: 'engagement' },
  ],
  meeting_norms: [
    { key: 'includeWhen', label: 'Include when', kind: 'chips', target: 'meetingNorms' },
    { key: 'doNotIncludeWhen', label: 'Do not include when', kind: 'chips', target: 'meetingNorms' },
    { key: 'requiredPreRead', label: 'Required pre-read', kind: 'text', target: 'meetingNorms' },
    { key: 'requiredAgenda', label: 'Required agenda', kind: 'text', target: 'meetingNorms' },
    { key: 'requiredDecisionOwner', label: 'Decision owner required', kind: 'bool', target: 'meetingNorms' },
    { key: 'preferredLength', label: 'Preferred length', kind: 'enum', target: 'meetingNorms', options: LENGTH },
    { key: 'preferredCadence', label: 'Preferred cadence', kind: 'enum', target: 'meetingNorms', options: MEETING_CADENCE },
    { key: 'asyncAlternatives', label: 'Async alternatives', kind: 'chips', target: 'meetingNorms' },
    { key: 'recurringRules', label: 'Recurring rules', kind: 'textarea', target: 'meetingNorms' },
  ],
  risks: [
    { key: 'risks', label: 'Risks and blockers', kind: 'risks', target: 'card' },
  ],
  freshness: [
    { key: 'freshness', label: 'Freshness', kind: 'enum', target: 'org', options: FRESHNESS },
    { key: 'lastReviewedAt', label: 'Last reviewed', kind: 'date', target: 'org' },
    { key: 'nextReviewAt', label: 'Next review', kind: 'date', target: 'org' },
    { key: 'visibility', label: 'Visibility', kind: 'enum', target: 'org', options: VISIBILITY },
  ],
};

export function isSectionEditable(key: OrgCardSectionKey): boolean {
  return key === 'handoff_rules' || !!SECTION_SPECS[key];
}

/* ── value read / write helpers ───────────────────────────────── */
function readValue(spec: FieldSpec, org: Organization, card: OrganizationCard): unknown {
  if (spec.target === 'org') return (org as unknown as Record<string, unknown>)[spec.key];
  if (spec.target === 'engagement') return (card.engagement as unknown as Record<string, unknown>)[spec.key];
  if (spec.target === 'meetingNorms') return (card.meetingNorms as unknown as Record<string, unknown>)[spec.key];
  return (card as unknown as Record<string, unknown>)[spec.key];
}

/* ── the editor ───────────────────────────────────────────────── */
export function SectionEditor({
  org, card, sectionKey, onDone,
}: { org: Organization; card: OrganizationCard; sectionKey: OrgCardSectionKey; onDone: () => void }) {
  if (sectionKey === 'handoff_rules') return <HandoffEditor org={org} card={card} onDone={onDone} />;

  const specs = SECTION_SPECS[sectionKey] ?? [];
  const { organizations } = useOrgData();
  const [draft, setDraft] = useState<Record<string, unknown>>(() => {
    const d: Record<string, unknown> = {};
    for (const s of specs) d[s.key] = readValue(s, org, card);
    return d;
  });
  const set = (k: string, v: unknown) => setDraft((d) => ({ ...d, [k]: v }));

  const orgOptions = organizations.filter((o) => o.id !== org.id).map((o) => ({ id: o.id, label: o.name }));
  const peopleOptions = PEOPLE.map((p) => ({ id: p.id, label: p.name }));
  const packOptions = ORG_PACKS.map((p) => ({ id: p.id, label: p.name }));
  const entOptions = (src?: string) => src === 'people' ? peopleOptions : src === 'packs' ? packOptions : orgOptions;

  const save = () => {
    const cardPatch: Record<string, unknown> = {};
    const orgPatch: Record<string, unknown> = {};
    const engagement: EngagementModel = { ...card.engagement };
    const norms: OrgMeetingNorms = { ...card.meetingNorms };
    let touchedEngagement = false, touchedNorms = false;

    for (const s of specs) {
      const v = draft[s.key];
      if (s.target === 'org') orgPatch[s.key] = v;
      else if (s.target === 'engagement') { (engagement as unknown as Record<string, unknown>)[s.key] = v; touchedEngagement = true; }
      else if (s.target === 'meetingNorms') { (norms as unknown as Record<string, unknown>)[s.key] = v; touchedNorms = true; }
      else cardPatch[s.key] = v;
    }
    if (touchedEngagement) cardPatch.engagement = engagement;
    if (touchedNorms) cardPatch.meetingNorms = norms;

    if (Object.keys(orgPatch).length) updateOrganization(org.id, orgPatch as Partial<Organization>);
    if (Object.keys(cardPatch).length) updateOrgCardSection(org.id, sectionKey, cardPatch as Partial<OrganizationCard>);
    else if (!Object.keys(orgPatch).length) updateOrgCardSection(org.id, sectionKey, {}); // mark published even if empty
    onDone();
  };

  return (
    <SectionEditFrame onSave={save} onCancel={onDone}>
      <div className="fld-grid">
        {specs.map((s) => {
          const full = s.kind === 'textarea' || s.kind === 'chips' || s.kind === 'reqInputs' || s.kind === 'metrics' || s.kind === 'risks' || s.kind === 'entities';
          return (
            <div key={s.key} style={full ? { gridColumn: '1 / -1' } : undefined}>
              <Field label={s.label} hint={s.hint}>
                {renderField(s, draft[s.key], (v) => set(s.key, v), entOptions(s.entitySource))}
              </Field>
            </div>
          );
        })}
      </div>
    </SectionEditFrame>
  );
}

function renderField(s: FieldSpec, value: unknown, onChange: (v: unknown) => void, entOptions: Array<{ id: string; label: string }>) {
  switch (s.kind) {
    case 'chips':
      return <ChipInput value={(value as string[]) ?? []} onChange={onChange} />;
    case 'text':
      return <TextField value={(value as string) ?? ''} onChange={onChange} />;
    case 'textarea':
      return <TextArea value={(value as string) ?? ''} onChange={onChange} maxLength={600} />;
    case 'number':
      return <NumberField value={value as number | undefined} onChange={onChange} />;
    case 'date':
      return <DateField value={(value as string) ?? ''} onChange={(d) => onChange(d ? new Date(d).toISOString() : '')} />;
    case 'enum':
      return <EnumSelect value={(value as string) ?? ''} onChange={onChange} options={s.options ?? []} placeholder="Select…" />;
    case 'bool':
      return <EnumSelect value={value ? 'yes' : 'no'} onChange={(v) => onChange(v === 'yes')} options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} />;
    case 'entities':
      return <EntitySelect value={(value as string[]) ?? []} onChange={onChange} options={entOptions} multi />;
    case 'entity':
      return <EntitySelect value={value ? [value as string] : []} onChange={(arr) => onChange(arr[0])} options={entOptions} multi={false} />;
    case 'reqInputs': {
      const inputs = (value as RequiredInput[]) ?? [];
      const labels = inputs.map((i) => i.input);
      return <ChipInput value={labels} onChange={(next) => onChange(next.map((t) => inputs.find((i) => i.input === t) ?? { input: t, format: '', timing: '', qualityBar: '' }))} placeholder="Required input name…" />;
    }
    case 'metrics': {
      const ms = (value as OrgMetric[]) ?? [];
      const labels = ms.map((m) => `${m.label} :: ${m.value}`);
      return <ChipInput value={labels} onChange={(next) => onChange(next.map((t) => {
        const [label, val] = t.split('::').map((x) => x.trim());
        const existing = ms.find((m) => m.label === label);
        return existing ? { ...existing, value: val ?? existing.value } : { label: label ?? t, value: val ?? '', kind: 'operating' as const };
      }))} placeholder="Label :: Value" />;
    }
    case 'risks': {
      const rs = (value as OrgRisk[]) ?? [];
      const labels = rs.map((r) => r.description);
      return <ChipInput value={labels} onChange={(next) => onChange(next.map((t) => rs.find((r) => r.description === t) ?? { kind: 'operational' as const, description: t, severity: 'medium' as const }))} placeholder="Risk description…" />;
    }
    default:
      return null;
  }
}

/* ── handoff rules editor (first rule) ────────────────────────── */
function HandoffEditor({ org, card, onDone }: { org: Organization; card: OrganizationCard; onDone: () => void }) {
  const existing: HandoffRule | undefined = card.handoffRules[0];
  const [name, setName] = useState(existing?.name ?? '');
  const [checklist, setChecklist] = useState<string[]>(existing?.checklist ?? []);
  const [dod, setDod] = useState<string[]>(existing?.definitionOfDone ?? []);
  const [owner, setOwner] = useState(existing?.handoffOwner ?? '');

  const save = () => {
    const rule: HandoffRule = {
      id: existing?.id ?? `ho-${org.id}-1`,
      name: name || 'Primary handoff',
      checklist,
      definitionOfReady: existing?.definitionOfReady ?? [],
      definitionOfDone: dod,
      requiredApprovals: existing?.requiredApprovals ?? [],
      requiredArtifacts: existing?.requiredArtifacts ?? [],
      handoffOwner: owner,
      receivingOrgId: existing?.receivingOrgId,
      failureModes: existing?.failureModes ?? [],
      recoveryPath: existing?.recoveryPath ?? '',
    };
    const rest = card.handoffRules.slice(1);
    updateOrgCardSection(org.id, 'handoff_rules', { handoffRules: [rule, ...rest] });
    onDone();
  };

  return (
    <SectionEditFrame onSave={save} onCancel={onDone}>
      <Field label="Handoff name"><TextField value={name} onChange={setName} /></Field>
      <Field label="Handoff owner (role)"><TextField value={owner} onChange={setOwner} /></Field>
      <Field label="Checklist"><ChipInput value={checklist} onChange={setChecklist} /></Field>
      <Field label="Definition of done"><ChipInput value={dod} onChange={setDod} /></Field>
    </SectionEditFrame>
  );
}
