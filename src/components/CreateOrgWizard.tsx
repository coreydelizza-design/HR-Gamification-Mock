import { useState } from 'react';
import type { OrganizationCategory, RevenueRole } from '../lib/types';
import { createOrganization, useOrgData, type NewOrgInput } from '../lib/demoStore';
import { ORG_PACKS, ORG_PACK_BY_ID } from '../data/orgPacks';
import { Field, TextField, TextArea, EnumSelect, EntitySelect, ChipInput } from './Editors';

interface Props {
  onClose: () => void;
  onCreated: (orgId: string) => void;
}

const CATEGORY_OPTS: Array<{ value: OrganizationCategory; label: string }> = [
  { value: 'leadership', label: 'Leadership' }, { value: 'technology', label: 'Technology' },
  { value: 'revenue', label: 'Revenue' }, { value: 'customer', label: 'Customer' },
  { value: 'people', label: 'People' }, { value: 'finance_legal', label: 'Finance & Legal' },
  { value: 'operations', label: 'Operations' },
];
const REVENUE_OPTS: Array<{ value: RevenueRole; label: string }> = [
  { value: 'pl_owner', label: 'P&L Owner' }, { value: 'revenue_generating', label: 'Revenue Generating' },
  { value: 'revenue_influencing', label: 'Revenue Influencing' }, { value: 'enablement', label: 'Enablement' },
  { value: 'shared_service', label: 'Shared Service' }, { value: 'cost_center', label: 'Cost Center' },
];

export default function CreateOrgWizard({ onClose, onCreated }: Props) {
  const { organizations } = useOrgData();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<NewOrgInput>({
    name: '', category: 'operations', orgPackId: 'pack-operations', revenueRole: 'enablement',
    mission: '', executiveOwner: '', operatingOwner: '', owns: [], needs: [], helps: [],
    parentOrgId: undefined,
  });
  const set = (patch: Partial<NewOrgInput>) => setForm((f) => ({ ...f, ...patch }));

  const orgOpts = organizations.map((o) => ({ id: o.id, label: o.name }));
  const packOpts = ORG_PACKS.map((p) => ({ value: p.id, label: p.name }));
  const pack = ORG_PACK_BY_ID[form.orgPackId];

  const canNext = step === 1 ? form.name.trim().length > 0 : step === 2 ? form.mission.trim().length > 0 : true;

  const finish = () => {
    const id = createOrganization(form);
    onCreated(id);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="modal-title">New organization</div>
            <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 4 }}>Create a card in under a minute, then keep building it live.</div>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="wizard-steps">
          {['Basics', 'Mission & owners', 'Quick-start'].map((label, i) => (
            <div key={label} className={`wizard-step ${step === i + 1 ? 'active' : ''}`}>
              <span className="wizard-step-n">{i + 1}</span>{label}
            </div>
          ))}
        </div>

        {step === 1 && (
          <>
            <Field label="Organization name"><TextField value={form.name} onChange={(v) => set({ name: v })} placeholder="e.g. Revenue Enablement" /></Field>
            <div className="fld-grid">
              <Field label="Category"><EnumSelect value={form.category} onChange={(v) => set({ category: v })} options={CATEGORY_OPTS} /></Field>
              <Field label="Revenue role"><EnumSelect value={form.revenueRole!} onChange={(v) => set({ revenueRole: v })} options={REVENUE_OPTS} /></Field>
            </div>
            <Field label="Org pack" hint={pack ? `Requires ${pack.requiredCardSections.length} sections; intake fields: ${pack.intakeFields?.length ?? 0}` : undefined}>
              <EnumSelect value={form.orgPackId} onChange={(v) => set({ orgPackId: v })} options={packOpts} />
            </Field>
            <Field label="Parent organization (optional)">
              <EntitySelect value={form.parentOrgId ? [form.parentOrgId] : []} onChange={(arr) => set({ parentOrgId: arr[0] })} options={orgOpts} multi={false} />
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <Field label="Mission"><TextArea value={form.mission} onChange={(v) => set({ mission: v })} placeholder="How does this organization succeed?" maxLength={400} /></Field>
            <div className="fld-grid">
              <Field label="Executive owner"><TextField value={form.executiveOwner} onChange={(v) => set({ executiveOwner: v })} placeholder="Name · title" /></Field>
              <Field label="Operating owner"><TextField value={form.operatingOwner} onChange={(v) => set({ operatingOwner: v })} placeholder="Name · title" /></Field>
            </div>
            <div style={{ fontSize: 11, color: 'var(--subtle)' }}>Client people who aren't in the demo are fine — stored as plain names.</div>
          </>
        )}

        {step === 3 && (
          <>
            <Field label="What it owns" hint="3–5 to render respectably right away"><ChipInput value={form.owns ?? []} onChange={(v) => set({ owns: v })} /></Field>
            <Field label="What it needs from others"><ChipInput value={form.needs ?? []} onChange={(v) => set({ needs: v })} /></Field>
            <Field label="How it helps others"><ChipInput value={form.helps ?? []} onChange={(v) => set({ helps: v })} /></Field>
          </>
        )}

        <div className="wizard-nav">
          <button className="btn-ghost btn-sm" onClick={() => step === 1 ? onClose() : setStep(step - 1)}>{step === 1 ? 'Cancel' : 'Back'}</button>
          {step < 3
            ? <button className="btn-primary btn-sm" disabled={!canNext} onClick={() => canNext && setStep(step + 1)}>Next</button>
            : <button className="btn-primary btn-sm" onClick={finish}>Create organization</button>}
        </div>
      </div>
    </div>
  );
}
