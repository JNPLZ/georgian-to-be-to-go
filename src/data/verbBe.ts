import type { ConjugationTable } from '../types/index';

export const verbBe: ConjugationTable = {
  present: {
    '1s': 'ვარ',
    '2s': 'ხარ',
    '3s': 'არის',
    '1p': 'ვართ',
    '2p': 'ხართ',
    '3p': 'არიან',
  },
  past: {
    '1s': 'ვიყავი',
    '2s': 'იყავი',
    '3s': 'იყო',
    '1p': 'ვიყავით',
    '2p': 'იყავით',
    '3p': 'იყვნენ',
  },
  future: {
    '1s': 'ვიქნები',
    '2s': 'იქნები',
    '3s': 'იქნება',
    '1p': 'ვიქნებით',
    '2p': 'იქნებით',
    '3p': 'იქნებიან',
  },
};
