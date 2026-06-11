import type { Person, ViewKey } from '../lib/types';
import type { Theme } from '../lib/theme';
import { IconSun, IconMoon, IconSearch } from './Icons';
import { useOrgData } from '../lib/demoStore';

const LABELS: Record<ViewKey, string> = {
  home:                       'Home',
  organizations:              'Organization Cards',
  'organization-detail':      'Organization',
  'collaboration-map':        'Collaboration Map',
  'success-agreements':       'Success Agreements',
  'success-agreement-detail': 'Success Agreement',
  'meeting-fit':              'Meeting Fit',
  'meeting-fit-detail':       'Meeting Fit',
  'org-insights':             'Org Insights',
  admin:                      'Admin',
};

const DETAIL_VIEWS: ViewKey[] = ['organization-detail', 'success-agreement-detail', 'meeting-fit-detail'];

interface Props {
  view: ViewKey;
  crumbName?: string;
  user: Person;
  theme: Theme;
  onToggleTheme: () => void;
}

export default function TopBar({ view, crumbName, user: _user, theme, onToggleTheme }: Props) {
  const { organizations, enterpriseLabel, modified } = useOrgData();
  const isDetail = DETAIL_VIEWS.includes(view);
  const crumbLabel = isDetail && crumbName ? crumbName : LABELS[view];

  const staleCount = organizations.filter((o) => o.freshness === 'stale').length;
  const agingCount = organizations.filter((o) => o.freshness === 'aging').length;
  const freshness = staleCount > 0
    ? `${staleCount} stale · ${agingCount} aging`
    : `${agingCount} aging`;

  return (
    <div className="topbar">
      <div className="crumb">
        {enterpriseLabel}
        <span style={{ margin: '0 8px', color: 'var(--subtle)' }}>/</span>
        <strong>{crumbLabel}</strong>
      </div>
      <div className="topbar-r">
        {modified && (
          <span className="edited-dot" title="Demo data modified — export your session or reset to pristine demo data">
            <span className="edited-dot-mark" /> Demo data modified
          </span>
        )}
        <div className="topbar-search" aria-hidden>
          <IconSearch size={13} />
          <span>Search organizations…</span>
        </div>
        <span className="topbar-chip" title="Card freshness across all organizations">
          {freshness}
        </span>
        <span className="topbar-chip topbar-chip-muted" title="Organizations · packs">
          {organizations.length} orgs · 11 packs
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
