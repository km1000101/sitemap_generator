import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & { primary?: string; secondary?: string };

export const RealisticChartIcon: React.FC<IconProps> = ({ primary = '#3b82f6', secondary = '#93c5fd', ...props }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
    <defs>
      <linearGradient id="chartBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0b1220" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={secondary} />
        <stop offset="100%" stopColor={primary} />
      </linearGradient>
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.4" />
      </filter>
    </defs>
    <rect x="4" y="6" width="56" height="52" rx="10" fill="url(#chartBg)" stroke="#1e293b"/>
    <g opacity="0.65">
      {Array.from({ length: 5 }).map((_, i) => (
        <line key={i} x1="10" x2="54" y1={18 + i * 8} y2={18 + i * 8} stroke="#334155" strokeDasharray="2 4" />
      ))}
    </g>
    <g filter="url(#softShadow)">
      <rect x="14" y="34" width="8" height="14" rx="2" fill="url(#barGrad)" />
      <rect x="26" y="28" width="8" height="20" rx="2" fill="url(#barGrad)" />
      <rect x="38" y="22" width="8" height="26" rx="2" fill="url(#barGrad)" />
    </g>
    <path d="M14 44 L26 36 L38 30 L50 20" stroke={primary} strokeWidth="2.5" fill="none" filter="url(#softShadow)" />
    <circle cx="50" cy="20" r="3" fill={primary} />
  </svg>
);

export const RealisticListIcon: React.FC<IconProps> = ({ primary = '#3b82f6', secondary = '#93c5fd', ...props }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
    <defs>
      <linearGradient id="paperBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0b1220" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
      <filter id="softShadow2" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.4" />
      </filter>
    </defs>
    <rect x="6" y="8" width="52" height="48" rx="8" fill="url(#paperBg)" stroke="#1e293b" />
    {[0, 1, 2, 3].map(i => (
      <g key={i} filter="url(#softShadow2)">
        <circle cx="16" cy={20 + i * 10} r="3" fill={primary} />
        <rect x="22" y={17 + i * 10} width="28" height="6" rx="3" fill={secondary} />
      </g>
    ))}
  </svg>
);

export const RealisticTagIcon: React.FC<IconProps> = ({ primary = '#3b82f6', secondary = '#93c5fd', ...props }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
    <defs>
      <linearGradient id="tagGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={secondary} />
        <stop offset="100%" stopColor={primary} />
      </linearGradient>
      <filter id="softShadow3" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.4" />
      </filter>
    </defs>
    <g filter="url(#softShadow3)">
      <path d="M12 28 L34 10 C35.5 8.8 37.7 8.9 39.1 10.2 L54 25.1 C55.3 26.5 55.4 28.7 54.2 30.2 L36 52 C34.3 54.2 31 54.2 29.3 52 L12 34.8 C10 32.8 10 30 12 28 Z" fill="url(#tagGrad)" stroke="#1e293b" />
      <circle cx="40" cy="20" r="4" fill="#0b1220" stroke="#1e293b" />
    </g>
  </svg>
);

export const RealisticBranchIcon: React.FC<IconProps> = ({ primary = '#3b82f6', secondary = '#93c5fd', ...props }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
    <defs>
      <linearGradient id="nodeGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={secondary} />
        <stop offset="100%" stopColor={primary} />
      </linearGradient>
      <filter id="softShadow4" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.4" />
      </filter>
    </defs>
    <g stroke="#334155" strokeWidth="2" filter="url(#softShadow4)">
      <path d="M16 20 C28 20, 24 40, 40 40" fill="none" />
    </g>
    <g filter="url(#softShadow4)">
      <circle cx="16" cy="20" r="6" fill="url(#nodeGrad)" />
      <circle cx="40" cy="40" r="6" fill="url(#nodeGrad)" />
      <circle cx="48" cy="24" r="6" fill="url(#nodeGrad)" />
    </g>
  </svg>
);

export const RealisticGlobeIcon: React.FC<IconProps> = ({ primary = '#3b82f6', secondary = '#93c5fd', ...props }) => (
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true" {...props}>
    <defs>
      <radialGradient id="globeGrad" cx="0.5" cy="0.45" r="0.6">
        <stop offset="0%" stopColor={secondary} />
        <stop offset="100%" stopColor={primary} />
      </radialGradient>
      <filter id="softShadowG" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.4" />
      </filter>
    </defs>
    <g filter="url(#softShadowG)">
      <circle cx="32" cy="32" r="20" fill="url(#globeGrad)" stroke="#1e293b" />
      <path d="M12 32h40M32 12v40M18 22c8 6 20 6 28 0M18 42c8-6 20-6 28 0" stroke="#0b1220" strokeOpacity=".25" />
    </g>
  </svg>
);

export const RealisticDocumentIcon: React.FC<IconProps> = ({ primary = '#3b82f6', secondary = '#93c5fd', ...props }) => (
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true" {...props}>
    <defs>
      <linearGradient id="docGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={secondary} />
        <stop offset="100%" stopColor={primary} />
      </linearGradient>
      <filter id="softShadowD" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.4" />
      </filter>
    </defs>
    <g filter="url(#softShadowD)">
      <path d="M16 10h22l10 10v34a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4z" fill="#0f172a" stroke="#1e293b" />
      <path d="M38 10v10h10" fill="#0f172a" stroke="#1e293b" />
      <rect x="20" y="28" width="24" height="4" rx="2" fill="url(#docGrad)" />
      <rect x="20" y="36" width="20" height="4" rx="2" fill="url(#docGrad)" opacity=".8" />
      <rect x="20" y="44" width="16" height="4" rx="2" fill="url(#docGrad)" opacity=".6" />
    </g>
  </svg>
);

export default {
  RealisticChartIcon,
  RealisticListIcon,
  RealisticTagIcon,
  RealisticBranchIcon,
  RealisticGlobeIcon,
  RealisticDocumentIcon,
};


