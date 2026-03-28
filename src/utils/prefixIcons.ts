import type { GoPrefix } from '../types/index';

/** Inline SVG icons for each directional prefix. Sized for inline use (~24×16 or 14×20). */
export const prefixIcons: Record<GoPrefix, string> = {
  // → away from speaker
  mi: `<svg viewBox="0 0 24 14" width="24" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <line x1="3" y1="7" x2="18" y2="7"/>
    <polyline points="13,3 18,7 13,11"/>
  </svg>`,

  // ← coming towards speaker
  mo: `<svg viewBox="0 0 24 14" width="24" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <line x1="21" y1="7" x2="6" y2="7"/>
    <polyline points="11,3 6,7 11,11"/>
  </svg>`,

  // → into box
  she: `<svg viewBox="0 0 26 14" width="26" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="15" y="1" width="10" height="12" rx="1.5"/>
    <line x1="1" y1="7" x2="14" y2="7"/>
    <polyline points="10,3 15,7 10,11"/>
  </svg>`,

  // box → out
  ga: `<svg viewBox="0 0 26 14" width="26" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="1" y="1" width="10" height="12" rx="1.5"/>
    <line x1="11" y1="7" x2="24" y2="7"/>
    <polyline points="19,3 24,7 19,11"/>
  </svg>`,

  // ↑ up
  a: `<svg viewBox="0 0 14 22" width="14" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <line x1="7" y1="20" x2="7" y2="5"/>
    <polyline points="3,9 7,4 11,9"/>
  </svg>`,

  // ↓ down
  cha: `<svg viewBox="0 0 14 22" width="14" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <line x1="7" y1="2" x2="7" y2="17"/>
    <polyline points="3,13 7,18 11,13"/>
  </svg>`,

  // arch over
  gada: `<svg viewBox="0 0 26 14" width="26" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M 2 13 Q 13 1 24 13"/>
    <polyline points="19,10 24,13 21,8"/>
  </svg>`,

  // →| arrow to wall
  tsa: `<svg viewBox="0 0 26 14" width="26" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <line x1="2" y1="7" x2="18" y2="7"/>
    <polyline points="14,3 19,7 14,11"/>
    <line x1="23" y1="1" x2="23" y2="13"/>
  </svg>`,

  // multiple small arches → habitual / repeated movement
  da: `<svg viewBox="0 0 26 14" width="26" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M 1 11 Q 5 3 9 11"/>
    <path d="M 9 11 Q 13 3 17 11"/>
    <path d="M 17 11 Q 21 3 23 11"/>
    <polyline points="20,8 24,11 20,13"/>
  </svg>`,
};
