import type { CompatEntry } from '../lib/types';

export const COMPAT: Record<string, CompatEntry> = {
  mc: {
    score: 30,
    label: 'Low friction',
    body: "You're a <strong>Driver</strong>, Maya is an <strong>Analyzer</strong>. Once you set the rhythm this works — the danger is you move before she's finished her analysis and she feels steamrolled.",
    tips: [
      "Send her the headline early; she'll process the depth before you talk.",
      'Read her calendar holds as deep work, not availability.',
      'When she says "let me think on this," that\'s the answer — give her until tomorrow.',
    ],
  },
  mr: {
    score: 46,
    label: 'Moderate friction',
    body: "You're a <strong>Driver</strong>, Marcus is a <strong>Connector</strong>. He builds through consensus and cares about how decisions land. You may make calls before he's brought his team along.",
    tips: [
      "Flag the people-impact early — he'll factor it in if he sees it.",
      "Don't read his silence as agreement. He's processing.",
      "Open meetings warm. Two minutes of check-in isn't wasted; it sets up the rest.",
    ],
  },
  pp: {
    score: 40,
    label: 'Moderate friction',
    body: "You're a <strong>Driver</strong>, Priya is a <strong>Visionary</strong>. You both move fast — but she refines through exploration while you want to converge.",
    tips: [
      "Ask her up front: explore mode or decide mode? She'll match the gear.",
      'Capture her "what ifs," don\'t resolve them on the spot.',
      'Bring one concrete artifact per meeting — it gives her something to push against.',
    ],
  },
  jw: {
    score: 34,
    label: 'Low friction',
    body: "You're both <strong>Drivers</strong>. Same pace, mutual respect. The one risk: <strong>two Drivers can collide over who's making the call.</strong>",
    tips: [
      'Clarify decision ownership up front.',
      'You can both skip the warm-up.',
      "Disagree openly and early. Neither of you takes it personally.",
    ],
  },
  sk: {
    score: 42,
    label: 'Moderate friction',
    body: "You're a <strong>Driver</strong>, Sara is a <strong>Connector</strong>. She'll say yes to too much; your pace can amplify that.",
    tips: [
      "Push back if her deadline sounds optimistic — she'll thank you.",
      "Bring her in early on cross-team decisions; she'll surface what others miss.",
      'Be direct, but stay kind. She acts on feedback fast.',
    ],
  },
  dk: {
    score: 32,
    label: 'Low friction',
    body: "You're a <strong>Driver</strong>, David is an <strong>Analyzer</strong>. He distrusts first answers; you commit fast. Healthy tension if managed.",
    tips: [
      'Schedule deep conversations before 2pm.',
      "Lead with what you don't know. He'll trust the rest.",
      'Pre-share methodology — the meeting starts at his second pass.',
    ],
  },
};
