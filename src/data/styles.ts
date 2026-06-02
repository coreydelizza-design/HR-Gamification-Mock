import type { StyleConfig, StyleKey } from '../lib/types';

export const STYLES: Record<StyleKey, StyleConfig> = {
  driver: {
    label: 'Driver',
    desc: 'Direct & decisive',
    cls: 'style-driver',
    band: 'var(--driver-band)',
    bg: 'var(--driver-soft)',
    fg: 'var(--driver-text)',
    color: 'var(--driver)',
  },
  analyzer: {
    label: 'Analyzer',
    desc: 'Evidence-led',
    cls: 'style-analyzer',
    band: 'var(--analyzer-band)',
    bg: 'var(--analyzer-soft)',
    fg: 'var(--analyzer-text)',
    color: 'var(--analyzer)',
  },
  connector: {
    label: 'Connector',
    desc: 'Consensus & care',
    cls: 'style-connector',
    band: 'var(--connector-band)',
    bg: 'var(--connector-soft)',
    fg: 'var(--connector-text)',
    color: 'var(--connector)',
  },
  visionary: {
    label: 'Visionary',
    desc: 'Big-picture catalyst',
    cls: 'style-visionary',
    band: 'var(--visionary-band)',
    bg: 'var(--visionary-soft)',
    fg: 'var(--visionary-text)',
    color: 'var(--visionary)',
  },
};
