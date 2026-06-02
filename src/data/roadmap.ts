import type { RoadmapPhase } from '../lib/types';

export const ROADMAP: RoadmapPhase[] = [
  {
    num: 'Phase 1', title: 'Core platform (this prototype)', status: 'done',
    desc: "The employee surface plus HR analytics plus gamification controls. Everything you've seen so far.",
    items: [
      { d: true, t: 'Employee profile card — the eight questions, in their own words' },
      { d: true, t: 'Team directory with working-style filters' },
      { d: true, t: 'AI-generated meeting briefs (attendee-aware)' },
      { d: true, t: 'Team-vs-team leaderboard (no individual ranking)' },
      { d: true, t: 'HR analytics dashboard with cross-team friction heatmap' },
      { d: true, t: 'Configurable gamification — five categories, presets per culture' },
    ],
  },
  {
    num: 'Phase 2', title: 'Workflow integrations', status: 'next',
    desc: 'Where Fieldguide stops being a destination and starts being ambient. This is the phase that drives sustained usage.',
    items: [
      { d: false, t: 'Slack app — pre-meeting brief delivery, refresh nudges, streak freeze' },
      { d: false, t: 'Google Calendar / Outlook integration — auto-inject briefs into invites' },
      { d: false, t: 'Microsoft Teams app surface — profile card sidebar' },
      { d: false, t: 'HRIS sync (Workday, BambooHR, Rippling) — auto-populate org chart' },
      { d: false, t: 'SSO (Okta, Azure AD) — enterprise readiness' },
    ],
  },
  {
    num: 'Phase 3', title: 'Real AI — not just templating', status: 'next',
    desc: 'The current briefs are deterministic from style data. The next layer is real LLM-generated, conversation-aware insight.',
    items: [
      { d: false, t: 'LLM-generated meeting briefs using actual attendee answers, not just styles' },
      { d: false, t: 'Auto-suggested card improvements ("you said you prefer async but you reply in <1hr — update reach?")' },
      { d: false, t: '1:1 prep briefs that learn from past 1:1 outcomes' },
      { d: false, t: 'New hire onboarding — auto-generated "who to meet first" recommendations' },
    ],
  },
  {
    num: 'Phase 4', title: 'Manager intelligence layer', status: 'later',
    desc: 'The product surface managers buy when they roll out org-wide. Higher ARR per seat than the employee tier.',
    items: [
      { d: false, t: 'Team composition diagnostic — "your team is 80% Driver, here\'s the blind spot"' },
      { d: false, t: 'Hiring fit recommendations based on existing team style mix' },
      { d: false, t: 'Cross-functional project staffing recommendations' },
      { d: false, t: '1:1 cadence and agenda generator personalized per report' },
    ],
  },
  {
    num: 'Phase 5', title: 'Enterprise & governance', status: 'later',
    desc: 'What you build when you sell into orgs with >5,000 employees, works councils, GDPR / SOC 2 requirements.',
    items: [
      { d: false, t: 'Role-based access — managers see their team, HR sees aggregates' },
      { d: false, t: 'Data residency controls (EU / US / sovereign deployments)' },
      { d: false, t: 'Audit logs and admin event history' },
      { d: false, t: 'Employee data export and right-to-delete tooling' },
      { d: false, t: 'Custom question sets per org (replace the default eight)' },
    ],
  },
];
