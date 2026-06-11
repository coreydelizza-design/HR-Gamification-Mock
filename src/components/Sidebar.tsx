import type { Person, ViewKey } from '../lib/types';
import {
  IconDash, IconBuilding, IconNetwork, IconCheck, IconCal, IconChart, IconSettings,
} from './Icons';

interface NavEntry {
  key: ViewKey;
  label: string;
  Icon: React.FC<{ size?: number; className?: string }>;
  section: 'work' | 'org';
}

const NAV: NavEntry[] = [
  { key: 'home',                label: 'Home',                Icon: IconDash,     section: 'work' },
  { key: 'organizations',       label: 'Organization Cards',  Icon: IconBuilding, section: 'work' },
  { key: 'collaboration-map',   label: 'Collaboration Map',   Icon: IconNetwork,  section: 'work' },
  { key: 'success-agreements',  label: 'Success Agreements',  Icon: IconCheck,    section: 'work' },
  { key: 'meeting-fit',         label: 'Meeting Fit',         Icon: IconCal,      section: 'work' },
  { key: 'org-insights',        label: 'Org Insights',        Icon: IconChart,    section: 'org'  },
  { key: 'admin',               label: 'Admin',               Icon: IconSettings, section: 'org'  },
];

const SECTION_LABELS: Record<NavEntry['section'], string> = {
  work: 'Collaboration',
  org: 'Enterprise',
};

interface Props {
  view: ViewKey;
  user: Person;
  onNavigate: (v: ViewKey) => void;
}

// Map detail views back to their parent nav key so the sidebar stays highlighted.
const PARENT_OF: Partial<Record<ViewKey, ViewKey>> = {
  'organization-detail': 'organizations',
  'success-agreement-detail': 'success-agreements',
  'meeting-fit-detail': 'meeting-fit',
};

export default function Sidebar({ view, user, onNavigate }: Props) {
  const sections: NavEntry['section'][] = ['work', 'org'];
  const activeKey: ViewKey = PARENT_OF[view] ?? view;

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">F</span>
        <div>
          <div className="brand-name">Fieldguide</div>
          <div className="brand-tag">Collaboration readiness</div>
        </div>
      </div>

      {sections.map((sec) => (
        <div key={sec}>
          <div className="nav-group-label">{SECTION_LABELS[sec]}</div>
          {NAV.filter((n) => n.section === sec).map((n) => {
            const Icon = n.Icon;
            const active = activeKey === n.key;
            return (
              <button
                key={n.key}
                className={`nav-item ${active ? 'active' : ''}`}
                onClick={() => onNavigate(n.key)}
              >
                <Icon size={15} />
                <span>{n.label}</span>
              </button>
            );
          })}
        </div>
      ))}

      <div className="sidebar-foot" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 12 }}>
        <div style={{
          fontSize: 10.5, color: 'var(--muted)', lineHeight: 1.5,
          fontStyle: 'italic', paddingBottom: 12, borderBottom: '1px solid var(--rule)',
        }}>
          Working structure, not reporting structure.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            className="av"
            style={{
              width: 32, height: 32, fontSize: 12,
              background: 'var(--accent-1-soft)', color: 'var(--accent-1-text)',
            }}
          >
            {user.initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sidebar-foot-name">{user.name}</div>
            <div className="sidebar-foot-role">{user.role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
