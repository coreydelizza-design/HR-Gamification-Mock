import type { Person, ViewKey } from '../lib/types';
import {
  IconDash, IconUser, IconUsers, IconTrophy, IconCal, IconChart, IconSettings, IconRoad,
} from './Icons';

interface NavEntry {
  key: ViewKey;
  label: string;
  Icon: React.FC<{ size?: number; className?: string }>;
  section: 'employee' | 'admin' | 'meta';
}

const NAV: NavEntry[] = [
  { key: 'dashboard',   label: 'Dashboard',     Icon: IconDash,     section: 'employee' },
  { key: 'edit',        label: 'My card',       Icon: IconUser,     section: 'employee' },
  { key: 'team',        label: 'Team',          Icon: IconUsers,    section: 'employee' },
  { key: 'meetings',    label: 'Meetings',      Icon: IconCal,      section: 'employee' },
  { key: 'leaderboard', label: 'Leaderboard',   Icon: IconTrophy,   section: 'employee' },
  { key: 'hr',          label: 'HR Dashboard',  Icon: IconChart,    section: 'admin' },
  { key: 'employees',   label: 'All employees', Icon: IconUsers,    section: 'admin' },
  { key: 'settings',    label: 'Settings',      Icon: IconSettings, section: 'admin' },
  { key: 'methodology', label: 'Methodology',   Icon: IconChart,    section: 'meta' },
  { key: 'roadmap',     label: 'Roadmap',       Icon: IconRoad,     section: 'meta' },
];

const SECTION_LABELS: Record<NavEntry['section'], string> = {
  employee: 'For you',
  admin: 'For HR',
  meta: 'About this prototype',
};

interface Props {
  view: ViewKey;
  user: Person;
  onNavigate: (v: ViewKey) => void;
}

export default function Sidebar({ view, user, onNavigate }: Props) {
  const sections: NavEntry['section'][] = ['employee', 'admin', 'meta'];

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">F</span>
        <div>
          <div className="brand-name">Fieldguide</div>
          <div className="brand-tag">v1 · unified</div>
        </div>
      </div>

      {sections.map((sec) => (
        <div key={sec}>
          <div className="nav-group-label">{SECTION_LABELS[sec]}</div>
          {NAV.filter((n) => n.section === sec).map((n) => {
            const active = view === n.key || (n.key === 'team' && view === 'person');
            const Icon = n.Icon;
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
        <div className={`av style-${user.style}`} style={{ width: 32, height: 32, fontSize: 12 }}>
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
