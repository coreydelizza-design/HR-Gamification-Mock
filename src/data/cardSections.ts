import type { CardSection } from '../lib/types';

/**
 * The ten standard WorkCard sections. Order is the display order.
 * `appliesTo` lets us reuse section definitions across WorkCards and TeamCards.
 */
export const CARD_SECTIONS: CardSection[] = [
  {
    key: 'communication',
    label: 'Communication',
    prompt: 'How is the best way to reach me, and on what channels?',
    helpText: 'Channels, response time expectations, when not to ping.',
    required: true,
    appliesTo: ['work', 'team'],
  },
  {
    key: 'meetings',
    label: 'Meetings',
    prompt: 'How do I work best in meetings?',
    helpText: 'Pre-read habits, energy in real-time vs async, when a meeting is worth holding.',
    required: true,
    appliesTo: ['work'],
  },
  {
    key: 'feedback',
    label: 'Feedback',
    prompt: 'How do I prefer to give and receive feedback?',
    helpText: 'Timing, channel, directness, what helps it land.',
    required: false,
    appliesTo: ['work'],
  },
  {
    key: 'decisions',
    label: 'Decision-making',
    prompt: 'How do I make decisions, and how can others help me decide well?',
    helpText: 'Evidence, pace, who needs to be in the room, what reverses a decision.',
    required: true,
    appliesTo: ['work', 'team'],
  },
  {
    key: 'focus',
    label: 'Focus time',
    prompt: 'When am I most focused, and how do I protect deep work?',
    helpText: 'Energy curves, calendar protection, signals it is time to step back.',
    required: false,
    appliesTo: ['work'],
  },
  {
    key: 'escalation',
    label: 'Escalation',
    prompt: 'When and how should something be escalated to me — or past me?',
    helpText: 'Thresholds, channels, who to copy, when not to wait.',
    required: false,
    appliesTo: ['work', 'team'],
  },
  {
    key: 'needs_from_others',
    label: 'What I need from others',
    prompt: 'What do I need from collaborators to do my best work?',
    helpText: 'Inputs, lead time, context, autonomy or partnership.',
    required: false,
    appliesTo: ['work'],
  },
  {
    key: 'count_on_me',
    label: 'What others can count on me for',
    prompt: 'What can teammates reliably count on from me?',
    helpText: 'Strengths I bring, commitments I keep, where I add leverage.',
    required: false,
    appliesTo: ['work'],
  },
  {
    key: 'visibility',
    label: 'Visibility',
    prompt: 'Who can see this card?',
    helpText: 'Defaults: org, team, partner teams only, or private.',
    required: false,
    appliesTo: ['work', 'team'],
  },
  {
    key: 'freshness',
    label: 'Freshness',
    prompt: 'When was this last reviewed?',
    helpText: 'Cards stay useful when they are reviewed at least quarterly.',
    required: false,
    appliesTo: ['work', 'team'],
  },
];

export const CARD_SECTION_BY_KEY: Record<string, CardSection> = Object.fromEntries(
  CARD_SECTIONS.map((s) => [s.key, s]),
);
