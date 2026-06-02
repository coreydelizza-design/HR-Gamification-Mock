import type { Meeting } from '../lib/types';

export const MEETINGS: Meeting[] = [
  {
    id: 'm1', title: 'Q3 planning sync', when: 'Thursday · 2:00pm MT', duration: '45 min',
    attendees: ['me', 'mc', 'mr', 'pp'],
    summary: "Mixed group: one fast-mover, one evidence-led analyzer, one consensus-builder, one big-picture visionary. Lead with the decision, then back it with one slide of data, then leave ten minutes for Marcus to surface objections others won't.",
    tips: [
      { h: 'Send the pre-read 24 hours ahead.', b: "Maya won't engage without it. Priya will skim and react in the room — that's fine." },
      { h: 'Time-box discussion to 25 minutes.', b: 'This group will keep talking. Marcus needs the closure as much as the drivers do.' },
      { h: 'Capture Priya\'s "what if" out loud.', b: "She thinks by talking. Write it down or it's gone." },
    ],
  },
  {
    id: 'm2', title: '1:1 with Marcus', when: 'Tomorrow · 10:30am MT', duration: '30 min',
    attendees: ['me', 'mr'],
    summary: "Marcus is a Connector who reads tone better than text. A directive 1:1 will land harder than the agenda suggests — open with what's going well, then move to the decision you need.",
    tips: [
      { h: 'Open warm.', b: 'Two minutes of genuine check-in. Skip it and the rest of the meeting is uphill.' },
      { h: 'Name the decision early.', b: "Don't bury the ask. Marcus engages faster when he knows where you're landing." },
      { h: 'Leave space for the quiet processing.', b: "If he goes silent, don't fill it. Let him get there." },
    ],
  },
  {
    id: 'm3', title: 'Data review with David', when: 'Friday · 9:00am MT', duration: '60 min',
    attendees: ['me', 'dk'],
    summary: 'Two morning-people in a high-precision conversation. David is an Analyzer who actively distrusts first answers — bring the assumptions and sensitivity checks, not just conclusions.',
    tips: [
      { h: 'Pre-share the model and methodology.', b: "David reads it before. The conversation starts at his second pass, not your first." },
      { h: 'Lead with uncertainty.', b: "Say what you don't know. He'll trust the rest more if you do." },
      { h: 'Schedule it in his morning.', b: "9am is his peak. After 2pm and you've lost him." },
    ],
  },
];
