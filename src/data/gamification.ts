import type { GSSection } from '../lib/types';

export const GS_SECTIONS: GSSection[] = [
  {
    id: 'personal', title: 'Personal momentum', tag: 'safe', tagLabel: 'Always on',
    desc: 'Private to the user. Builds habit through self-comparison, not social pressure.',
    opts: [
      { id: 'streak',     name: 'Personal streak counter',   desc: 'Weeks-since-refresh, visible only to the user. Duolingo-style habit lock.', risk: 'low' },
      { id: 'ring',       name: 'Completion progress ring',  desc: 'Visual feedback for the eight questions.', risk: 'low' },
      { id: 'history',    name: 'Profile history timeline',  desc: 'How the card has evolved over time.', risk: 'low' },
      { id: 'milestones', name: 'Personal milestone badges', desc: 'First complete, first refresh, first depth-high.', risk: 'low' },
    ],
  },
  {
    id: 'team', title: 'Team social proof', tag: 'rec', tagLabel: 'Recommended',
    desc: 'The Uplight zone. Team-vs-team aggregates only, never individual ranking.',
    opts: [
      { id: 'lb',          name: 'Team leaderboard',              desc: 'Department-level completion. Public to all employees.', risk: 'low' },
      { id: 'teamstreak',  name: 'Team streaks',                  desc: 'Consecutive quarters a team has held Gold tier.', risk: 'low' },
      { id: 'challenges',  name: 'Quarterly team challenges',     desc: 'Time-boxed pushes that reset each quarter.', risk: 'low' },
      { id: 'crosscompat', name: 'Cross-team friction heatmap',   desc: 'HR-visible only. Shows team style clashes.', risk: 'med' },
    ],
  },
  {
    id: 'recognition', title: 'Recognition & peer signals', tag: 'careful', tagLabel: 'Opt-in per org',
    desc: 'Peer-visible mechanics. Review with works council before enabling in EU/unionized workforces.',
    opts: [
      { id: 'cardofweek',   name: 'Card of the week',           desc: 'AI surfaces one well-written card weekly. Aspirational, not ranked.', risk: 'med' },
      { id: 'endorsements', name: 'Peer endorsements',          desc: '"Helped me prep" counts on cards.', risk: 'med' },
      { id: 'mentors',      name: 'Working-style mentor badge', desc: 'Detailed cards get tagged for cross-team consults.', risk: 'med' },
      { id: 'newhire',      name: 'New hire spotlight',         desc: 'Welcome new hires by their card in week 1.', risk: 'low' },
    ],
  },
  {
    id: 'rewards', title: 'External rewards', tag: 'careful', tagLabel: 'Org-funded',
    desc: 'Real-world value tied to completion. Best as a finite quarterly campaign, not always-on.',
    opts: [
      { id: 'bonusly',    name: 'Bonusly / WorkTango integration', desc: 'Points on Gold tier and depth-high refresh.', risk: 'pro' },
      { id: 'charity',    name: 'Charity match per Gold tier',     desc: '$5–25 per employee reaching Gold quarterly.', risk: 'low' },
      { id: 'teamtreats', name: 'Team treats for winning quarter', desc: 'Coffee, lunch, swag for the top team.', risk: 'low' },
      { id: 'pto',        name: 'PTO hour per annual refresh',     desc: 'Bonus PTO for keeping card fresh four quarters.', risk: 'pro' },
    ],
  },
  {
    id: 'nudges', title: 'Smart nudges & habit loops', tag: 'safe', tagLabel: 'Default on',
    desc: 'Highest-ROI category. Duolingo-style habit mechanics — quiet, contextual, individually delivered.',
    opts: [
      { id: 'stale',      name: 'Stale profile reminders',       desc: 'Slack nudge at 60 and 80 days since refresh.', risk: 'low' },
      { id: 'premeeting', name: 'Pre-meeting refresh prompt',    desc: 'If stale and you have a meeting tomorrow, refresh first.', risk: 'low' },
      { id: 'cal',        name: 'Calendar brief injection',      desc: 'Auto-inject briefs into meeting invites.', risk: 'low' },
      { id: 'freeze',     name: 'Streak freeze (1 per month)',   desc: 'Forgiveness mechanic for missed refresh.', risk: 'low' },
      { id: 'onboarding', name: 'New hire onboarding sequence',  desc: 'Card baked into week 1–2 onboarding.', risk: 'low' },
    ],
  },
];

export const GS_PRESETS: Record<string, string[]> = {
  conservative: ['streak','ring','history','milestones','lb','teamstreak','newhire','charity','stale','cal','freeze','onboarding'],
  balanced:     ['streak','ring','history','milestones','lb','teamstreak','challenges','newhire','teamtreats','stale','premeeting','cal','freeze','onboarding'],
  aggressive:   ['streak','ring','history','milestones','lb','teamstreak','challenges','crosscompat','cardofweek','endorsements','mentors','newhire','bonusly','charity','teamtreats','stale','premeeting','cal','freeze','onboarding'],
  off:          [],
};
