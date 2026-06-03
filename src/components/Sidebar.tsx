import type { Person, ViewKey } from '../lib/types';
import {
  IconDash, IconUser, IconUsers, IconCal, IconCheck, IconChart, IconSettings,
} from './Icons';

interface NavEntry {
  key: ViewKey;
  label: string;
  Icon: React.FC<{ size?: number; className?: string }>;
  section: 'you' | 'org';
}

const NAV: NavEntry[] = [
  { key: 'home',       label: 'Home',                Icon: IconDash,     section: 'you' },
  { key: 'mycard',     label: 'My Fieldguide',       Icon: IconUser,     section: 'you' },
  { key: 'people',     label: 'People & Teams',      Icon: IconUsers,    section: 'you' },
  { key: 'meetings',   label: 'Meetings',            Icon: IconCal,      section: 'you' },
  { key: 'agreements', label: 'Working Agreements',  Icon: IconCheck,    section: 'you' },
  { key: 'insights',   label: 'Org Insights',        Icon: IconChart,    section: 'org' },
  { key: 'admin',      label: 'Admin',               Icon: IconSettings, section: 'org' },
];

const SECTION_LABELS: Record<NavEntry['section'], string> = {
  you: 'Workspace',
  org: 'Organization',
};

interface Props {
  view: ViewKey;
  user: Person;
  onNavigate: (v: ViewKey) => void;
}

// Map detail views back to their parent nav key so the sidebar stays highlighted.
const PARENT_OF: Partial<Record<ViewKey, ViewKey>> = {
  person: 'people',
  team: 'people',
  meeting: 'meetings',
  agreement: 'agreements',
};

export default function Sidebar({ view, user, onNavigate }: Props) {
  const sections: NavEntry['section'][] = ['you', 'org'];
  const activeKey: ViewKey = PARENT_OF[view] ?? view;

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">F</span>
        <div>
          <div className="brand-name">Fieldguide</div>
          <div className="brand-tag">Collaboration intelligence</div>
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

      <div className="sidebar-foot">
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
    </aside>
  );
}
