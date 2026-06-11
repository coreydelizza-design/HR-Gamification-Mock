import { useEffect, useRef, useState } from 'react';

/**
 * Editor primitives — built once, reused across every section editor, the
 * commercial editor, and the create-org wizard. No component library: native
 * <select>, styled inputs, and a chip-input pattern.
 *
 * Field-shape contract (see REBUILD prompt): closed unions -> EnumSelect,
 * string lists -> ChipInput, entity references -> EntitySelect, short text ->
 * TextField, long text -> TextArea, numbers/dates -> NumberField/DateField.
 */

/* ── ChipInput ────────────────────────────────────────────────── */
export function ChipInput({
  value, onChange, placeholder = 'Type and press Enter… (paste a list to split)',
}: { value: string[]; onChange: (next: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState('');

  const addMany = (raw: string) => {
    const parts = raw.split(/[\n\r]+/).map((s) => s.trim()).filter(Boolean);
    if (parts.length === 0) return;
    const next = [...value];
    for (const p of parts) if (!next.includes(p)) next.push(p);
    onChange(next);
  };
  const commitDraft = () => {
    const t = draft.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setDraft('');
  };

  return (
    <div className="chip-input" onClick={(e) => (e.currentTarget.querySelector('input') as HTMLInputElement)?.focus()}>
      {value.map((c, i) => (
        <span key={i} className="chip-tag">
          {c}
          <button type="button" className="chip-x" aria-label={`Remove ${c}`} onClick={(e) => { e.stopPropagation(); onChange(value.filter((_, j) => j !== i)); }}>×</button>
        </span>
      ))}
      <input
        value={draft}
        placeholder={value.length === 0 ? placeholder : ''}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); commitDraft(); }
          else if (e.key === 'Backspace' && draft === '' && value.length) onChange(value.slice(0, -1));
        }}
        onPaste={(e) => {
          const text = e.clipboardData.getData('text');
          if (/[\n\r]/.test(text)) { e.preventDefault(); addMany(text); }
        }}
        onBlur={commitDraft}
      />
    </div>
  );
}

/* ── EnumSelect ───────────────────────────────────────────────── */
export function EnumSelect<T extends string>({
  value, onChange, options, placeholder,
}: { value: T; onChange: (v: T) => void; options: Array<{ value: T; label: string }>; placeholder?: string }) {
  return (
    <select className="inp" value={value} onChange={(e) => onChange(e.target.value as T)}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

/* ── EntitySelect (searchable multi/single reference picker) ───── */
export function EntitySelect({
  value, onChange, options, multi = true, placeholder = 'Search…',
}: {
  value: string[]; onChange: (next: string[]) => void;
  options: Array<{ id: string; label: string }>; multi?: boolean; placeholder?: string;
}) {
  const [q, setQ] = useState('');
  const filtered = options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase()));
  const labelOf = (id: string) => options.find((o) => o.id === id)?.label ?? id;
  const toggle = (id: string) => {
    if (value.includes(id)) onChange(value.filter((v) => v !== id));
    else onChange(multi ? [...value, id] : [id]);
  };
  return (
    <div className="ent-picker">
      {value.length > 0 && (
        <div className="ent-selected">
          {value.map((id) => (
            <span key={id} className="chip-tag">{labelOf(id)}
              <button type="button" className="chip-x" onClick={() => toggle(id)}>×</button>
            </span>
          ))}
        </div>
      )}
      <input className="inp" value={q} placeholder={placeholder} onChange={(e) => setQ(e.target.value)} style={{ marginBottom: 6 }} />
      <div className="ent-options">
        {filtered.length === 0 && <div style={{ padding: 10, fontSize: 12, color: 'var(--muted)' }}>No matches.</div>}
        {filtered.slice(0, 40).map((o) => (
          <button type="button" key={o.id} className={`ent-opt ${value.includes(o.id) ? 'sel' : ''}`} onClick={() => toggle(o.id)}>
            {value.includes(o.id) ? '✓ ' : ''}{o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Simple text/number/date fields ───────────────────────────── */
export function TextField({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input type="text" className="inp" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
}
export function TextArea({ value, onChange, placeholder, maxLength }: { value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number }) {
  return <textarea className="inp" value={value} placeholder={placeholder} maxLength={maxLength} onChange={(e) => onChange(e.target.value)} />;
}
export function NumberField({ value, onChange, placeholder }: { value: number | undefined; onChange: (v: number | undefined) => void; placeholder?: string }) {
  return <input type="number" className="inp" value={value ?? ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))} />;
}
export function DateField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <input type="date" className="inp" value={value ? value.slice(0, 10) : ''} onChange={(e) => onChange(e.target.value)} />;
}

/* ── Labeled field wrapper ────────────────────────────────────── */
export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="fld">
      <label className="fld-label">{label}</label>
      {children}
      {hint && <div className="fld-hint">{hint}</div>}
    </div>
  );
}

/* ── SectionEditFrame (Save/Cancel + keyboard) ────────────────── */
export function SectionEditFrame({
  title, onSave, onCancel, children,
}: { title?: string; onSave: () => void; onCancel: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') { e.preventDefault(); onSave(); }
      else if (e.key === 'Escape') { e.preventDefault(); onCancel(); }
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [onSave, onCancel]);

  return (
    <div className="sec-edit" ref={ref}>
      {title && <div className="fld-label" style={{ marginBottom: 12 }}>{title}</div>}
      {children}
      <div className="sec-edit-actions">
        <button type="button" className="btn-ghost btn-sm" onClick={onCancel}>Cancel <span className="mono" style={{ opacity: 0.6 }}>Esc</span></button>
        <button type="button" className="btn-primary btn-sm" onClick={onSave}>Save <span className="mono" style={{ opacity: 0.6 }}>⌘S</span></button>
      </div>
    </div>
  );
}
