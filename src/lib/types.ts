export type StyleKey = 'driver' | 'analyzer' | 'connector' | 'visionary';
export type Tier = 'gold' | 'silver' | 'bronze' | 'incomplete';
export type ViewKey =
  | 'dashboard' | 'edit' | 'team' | 'person' | 'meetings'
  | 'leaderboard' | 'hr' | 'employees' | 'settings'
  | 'methodology' | 'roadmap';

export interface StyleConfig {
  label: string;
  desc: string;
  cls: string;
  band: string;
  bg: string;
  fg: string;
  color: string;
}

export interface Question {
  id: string;
  q: string;
  short: string;
}

export interface Basics {
  channel: string;
  channelSub: string;
  hours: string;
  hoursSub: string;
  response: string;
  responseSub: string;
}

export interface Person {
  id: string;
  name: string;
  initials: string;
  role: string;
  team: string;
  location: string;
  style: StyleKey;
  streak: number;
  updatedDaysAgo: number;
  styleDesc: string;
  basics: Basics;
  doList: string[];
  dontList: string[];
  energyTrack: number[];
  answers: Record<string, string>;
}

export interface TeamLB {
  team: string;
  members: number;
  pct: number;
  style: string;
}

export interface MeetingTip {
  h: string;
  b: string;
}

export interface Meeting {
  id: string;
  title: string;
  when: string;
  duration: string;
  attendees: string[];
  summary: string;
  tips: MeetingTip[];
}

export interface CompatEntry {
  score: number;
  label: string;
  body: string;
  tips: string[];
}

export interface FrictionDetail {
  pair: string;
  body: string;
  rec: string;
}

export interface KPI {
  label: string;
  value: string;
  delta: string;
  up: boolean;
}

export interface Trend {
  quarters: string[];
  completion: number[];
  fresh: number[];
}

export interface Nudge {
  team: string;
  under: number;
  members: number;
  sent: boolean;
}

export interface Insight {
  color: string;
  text: string;
  icon: string;
  body: string;
}

export interface GSOption {
  id: string;
  name: string;
  desc: string;
  risk: 'low' | 'med' | 'pro';
}

export interface GSSection {
  id: string;
  title: string;
  tag: 'safe' | 'rec' | 'careful';
  tagLabel: string;
  desc: string;
  opts: GSOption[];
}

export interface RoadmapItem {
  d: boolean;
  t: string;
}

export interface RoadmapPhase {
  num: string;
  title: string;
  status: 'done' | 'next' | 'later';
  desc: string;
  items: RoadmapItem[];
}

export interface Score {
  pct: number;
  answered: number;
  total: number;
  depth: 'High' | 'Medium' | 'Low';
  avg: number;
  fresh: boolean;
  tier: Tier;
}

export interface EngagementCell {
  key: 'champions' | 'stale' | 'onboarding' | 'disengaged';
  label: string;
  desc: string;
  count: number;
  pct: number;
  tone: 'success' | 'warning' | 'info' | 'danger';
}
