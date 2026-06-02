import type { Person, ViewKey } from '../lib/types';
import type { Theme } from '../lib/theme';
import { IconSun, IconMoon } from './Icons';
import { ORGANIZATION } from '../data/enterprise';

const LABELS: Record<ViewKey, string> = {
  home:       'Home',
  mycard:     'My Fieldguide',
  people:     'People & Teams',
  meetings:   'Meetings',
  agreements: 'Working Agreements',
  insights:   'Org Insights',
  admin:      'Admin',
  person:     'Person',
  team:       'Team',
  meeting:    'Meeting',
  agreement:  'Agreement',
};

interface Props {
  view: ViewKey;
  crumbName?: string;
  user: Person;
  theme: Theme;
  onToggleTheme: () => void;
}

export default function TopBar({ view, crumbName, user: _user, theme, onToggleTheme }: Props) {
  const isDetail = view === 'person' || view === 'team' || view === 'meeting' || view === 'agreement';
  const crumbLabel = isDetail && crumbName ? crumbName : LABELS[view];

  return (
    <div className="topbar">
      <div className="crumb">
        {ORGANIZATION.name}
        <span style={{ margin: '0 8px', color: 'var(--subtle)' }}>/</span>
        <strong>{crumbLabel}</strong>
      </div>
      <div className="topbar-r">
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
