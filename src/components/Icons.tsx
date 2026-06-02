import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

const sw = 2;
const base = (children: React.ReactNode, size = 15, className?: string) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className}>
    {children}
  </svg>
);

export const IconDash = ({ size, className }: IconProps) => base(
  <>
    <rect x="3" y="3" width="7" height="9" />
    <rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" />
    <rect x="3" y="16" width="7" height="5" />
  </>, size, className
);
export const IconUser = ({ size, className }: IconProps) => base(
  <>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </>, size, className
);
export const IconUsers = ({ size, className }: IconProps) => base(
  <>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </>, size, className
);
export const IconTrophy = ({ size, className }: IconProps) => base(
  <>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
  </>, size, className
);
export const IconCal = ({ size, className }: IconProps) => base(
  <>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </>, size, className
);
export const IconChart = ({ size, className }: IconProps) => base(
  <>
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </>, size, className
);
export const IconSettings = ({ size, className }: IconProps) => base(
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </>, size, className
);
export const IconRoad = ({ size, className }: IconProps) => base(
  <>
    <polyline points="12 2 12 6" />
    <polyline points="12 10 12 14" />
    <polyline points="12 18 12 22" />
  </>, size, className
);
export const IconEdit = ({ size, className }: IconProps) => base(
  <>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" />
  </>, size, className
);
export const IconArrowRight = ({ size, className }: IconProps) => base(
  <path d="M5 12h14M12 5l7 7-7 7" />, size, className
);
export const IconArrowLeft = ({ size, className }: IconProps) => base(
  <path d="M19 12H5M12 19l-7-7 7-7" />, size, className
);
export const IconCheck = ({ size, className }: IconProps) => (
  <svg width={size || 15} height={size || 15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
export const IconChevDown = ({ size, className }: IconProps) => base(
  <path d="M6 9l6 6 6-6" />, size, className
);
export const IconFlame = ({ size, className }: IconProps) => (
  <svg width={size || 15} height={size || 15} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.3-2.4.4-5 2-5 3 0 6 4.4 6 9a6 6 0 0 1-12 0c0-1.5.5-2.8 1.5-3.5a2.5 2.5 0 0 0 1 2" />
  </svg>
);
export const IconSun = ({ size, className }: IconProps) => base(
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </>, size, className
);
export const IconMoon = ({ size, className }: IconProps) => base(
  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />, size, className
);
