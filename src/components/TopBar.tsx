import type { Person, ViewKey } from '../lib/types';
import type { Theme } from '../lib/theme';
import { IconFlame, IconSun, IconMoon } from './Icons';

const LABELS: Record<ViewKey, string> = {
  dashboard: 'Dashboard',
  edit: 'My card',
  team: 'Team',
  person: 'Person',
  meetings: 'Meetings',
  leaderboard: 'Leaderboard',
  hr: 'HR Dashboard',
  employees: 'All employees',
  settings: 'Settings',
  methodology: 'Methodology',
  roadmap: 'Roadmap',
};

interface Props {
  view: ViewKey;
  crumbName?: string;
  user: Person;
  theme: Theme;
  onToggleTheme: () => void;
}

export default function TopBar({ view, crumbName, user, theme, onToggleTheme }: Props) {
  const crumbLabel = view === 'person' && crumbName ? crumbName : LABELS[view];

  return (
    <div className="topbar">
      <div className="crumb">
        {user.team}
        <span style={{ margin: '0 8px', color: 'var(--subtle)' }}>/</span>
        <strong>{crumbLabel}</strong>
      </div>
      <div className="topbar-r">
        <span className="streak-pill">
          <IconFlame size={11} />
          {user.streak}w streak
        </span>
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? <IconMoon size={15} /> : <IconSun size={15} />}
        </button>
      </div>
    </div>
  );
}
