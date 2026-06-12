import { useMemo, useState } from 'react';
import type { OrgMeeting, MeetingAgendaItem, AgendaItemKind, MeetingCadence } from '../lib/types';
import { useOrgData, createMeeting } from '../lib/demoStore';
import { PEOPLE_BY_ORG } from '../data/roleCards';
import { ME } from '../data/people';
import { Field, TextField, TextArea, EntitySelect, EnumSelect, DateField } from './Editors';
import { OrgChipRow, OrgSetStrip, EscalationOwnersPanel, ExpectationsBriefPanel } from './MeetingComposition';
import { EconomicsStrip, MeetingClassBadge } from './Proxy';
import { classifyMeeting } from '../lib/proxyEngine';

interface Props {
  onClose: () => void;
  onCreated: (id: string) => void;
}

const KINDS: Array<{ value: AgendaItemKind; label: string }> = [
  { value: 'decision', label: 'Decision' },
  { value: 'input_review', label: 'Input review' },
  { value: 'status', label: 'Status' },
  { value: 'escalation', label: 'Escalation' },
];
const CADENCES: Array<{ value: MeetingCadence; label: string }> = [
  { value: 'one_time', label: 'One-time' }, { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Biweekly' }, { value: 'monthly', label: 'Monthly' },
];

export default function MeetingComposer({ onClose, onCreated }: Props) {
  const { organizations } = useOrgData();
  const [title, setTitle] = useState('');
  const [orgIds, setOrgIds] = useState<string[]>([]);
  const [meetingType, setMeetingType] = useState<'standard' | 'escalation'>('standard');
  const [cadence, setCadence] = useState<MeetingCadence>('one_time');
  const [decisionRequested, setDecisionRequested] = useState('');
  const [agenda, setAgenda] = useState<MeetingAgendaItem[]>([{ topic: '', kind: 'decision' }]);

  const orgOptions = useMemo(() => organizations.map((o) => ({ id: o.id, label: o.name })), [organizations]);

  // Invitees derive from the selected orgs (people mapped to those orgs); fall back to the viewer.
  const invitees = useMemo(() => {
    const set = new Set<string>();
    for (const id of orgIds) (PEOPLE_BY_ORG[id] ?? []).forEach((p) => set.add(p));
    const list = Array.from(set);
    return list.length ? list : [ME.id];
  }, [orgIds]);

  // The live draft meeting — every downstream view recomputes from this object.
  const draft: OrgMeeting = useMemo(() => ({
    id: 'draft-meeting',
    title: title || 'Untitled meeting',
    startsAt: '2026-06-15T16:00:00Z',
    durationMinutes: 50,
    participatingOrgIds: orgIds,
    requiredOrgIds: orgIds,
    attendeePersonIds: invitees,
    inviteePersonIds: invitees,
    decisionOwnerPersonId: invitees[0],
    decisionRequested: decisionRequested || 'State the decision or outcome this meeting must produce.',
    agendaSummary: agenda.map((a) => a.topic).filter(Boolean).join('; ') || 'Agenda to be set.',
    meetingType,
    cadence,
    agenda: agenda.filter((a) => a.topic.trim()),
  }), [title, orgIds, invitees, decisionRequested, agenda, meetingType, cadence]);

  const { cls, rationale } = classifyMeeting(draft);
  const canCreate = title.trim().length > 0 && orgIds.length >= 2 && agenda.some((a) => a.topic.trim());

  const setAgendaItem = (i: number, patch: Partial<MeetingAgendaItem>) =>
    setAgenda((prev) => prev.map((a, j) => (j === i ? { ...a, ...patch } : a)));
  const addAgenda = () => setAgenda((prev) => [...prev, { topic: '', kind: 'status' }]);
  const removeAgenda = (i: number) => setAgenda((prev) => prev.filter((_, j) => j !== i));

  const create = () => {
    if (!canCreate) return;
    const { id: _omit, ...rest } = draft;
    void _omit;
    onCreated(createMeeting(rest));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal composer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="modal-title">Compose a meeting</div>
            <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 4 }}>Pick the organizations and agenda — the relationship analysis, economics, and expectations brief assemble live.</div>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="composer-grid">
          <div className="composer-form">
            <Field label="Meeting title">
              <TextField value={title} onChange={setTitle} placeholder="e.g. Q3 Delivery Risk Review" />
            </Field>

            <Field label="Participating organizations" hint="Searchable · no upper limit · everything recomputes on change">
              <EntitySelect value={orgIds} onChange={setOrgIds} options={orgOptions} placeholder="Search the 36-org catalog…" />
            </Field>
            <OrgChipRow orgIds={orgIds} onRemove={(id) => setOrgIds(orgIds.filter((x) => x !== id))} />

            <div className="composer-row">
              <Field label="Type">
                <EnumSelect value={meetingType} onChange={setMeetingType} options={[{ value: 'standard', label: 'Standard' }, { value: 'escalation', label: 'Escalation (people-only)' }]} />
              </Field>
              <Field label="Cadence">
                <EnumSelect value={cadence} onChange={setCadence} options={CADENCES} />
              </Field>
            </div>

            <Field label="Decision or outcome">
              <TextArea value={decisionRequested} onChange={setDecisionRequested} placeholder="What must this meeting produce?" />
            </Field>

            <Field label="Agenda" hint="Each item: topic · kind · optional need-by date">
              <div className="agenda-editor">
                {agenda.map((a, i) => (
                  <div key={i} className="agenda-edit-row">
                    <TextField value={a.topic} onChange={(v) => setAgendaItem(i, { topic: v })} placeholder="Agenda topic" />
                    <EnumSelect value={a.kind} onChange={(v) => setAgendaItem(i, { kind: v })} options={KINDS} />
                    <DateField value={a.needBy?.date ?? ''} onChange={(v) => setAgendaItem(i, { needBy: v ? { date: v } : undefined })} />
                    <button type="button" className="chip-x" onClick={() => removeAgenda(i)} aria-label="Remove agenda item">×</button>
                  </div>
                ))}
                <button type="button" className="btn-ghost btn-sm" onClick={addAgenda}>+ Agenda item</button>
              </div>
            </Field>
          </div>

          <div className="composer-preview">
            <div className="composer-preview-head">
              <span className="org-panel-title">Live</span>
              <MeetingClassBadge cls={cls} title={rationale} />
            </div>

            <div className="lbl-list-label" style={{ marginTop: 4 }}>Relationship set</div>
            <OrgSetStrip meeting={draft} />

            {orgIds.length >= 2 && (
              <>
                <div className="lbl-list-label" style={{ marginTop: 14 }}>Economics</div>
                <EconomicsStrip meeting={draft} />
                <EscalationOwnersPanel meeting={draft} />
                <div style={{ marginTop: 14 }}><ExpectationsBriefPanel meeting={draft} /></div>
              </>
            )}
          </div>
        </div>

        <div className="composer-actions">
          <button className="btn-ghost btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn-primary btn-sm" disabled={!canCreate} onClick={create}>Create meeting</button>
        </div>
      </div>
    </div>
  );
}
