import { describe, expect, it } from 'vitest';
import {
  BOX_DELAYS,
  MAX_BOX,
  dueWordIds,
  firstCard,
  isDue,
  masteredCount,
  nextCard,
} from './review-schedule';

describe('nextCard', () => {
  it('fait monter d’une boîte et repousse la prochaine fois', () => {
    const first = nextCard(undefined, true, '2026-05-10');
    expect(first).toEqual({ box: 1, due: '2026-05-11' });

    const second = nextCard(first, true, '2026-05-11');
    expect(second).toEqual({ box: 2, due: '2026-05-13' });
  });

  it('ramène un mot raté à aujourd’hui, quelle que soit sa boîte', () => {
    expect(nextCard({ box: 5, due: '2026-06-01' }, false, '2026-05-10')).toEqual({
      box: 0,
      due: '2026-05-10',
    });
  });

  it('ne dépasse jamais la dernière boîte', () => {
    expect(nextCard({ box: MAX_BOX, due: '2026-05-01' }, true, '2026-05-10').box).toBe(MAX_BOX);
  });

  it('espace de plus en plus les rendez-vous', () => {
    expect(BOX_DELAYS).toEqual([...BOX_DELAYS].sort((a, b) => a - b));
  });
});

describe('firstCard', () => {
  it('programme un premier rappel dès le lendemain', () => {
    expect(firstCard('2026-05-10')).toEqual({ box: 1, due: '2026-05-11' });
  });
});

describe('isDue', () => {
  it('compte comme dû tout ce qui tombe aujourd’hui ou avant', () => {
    expect(isDue({ box: 1, due: '2026-05-10' }, '2026-05-10')).toBe(true);
    expect(isDue({ box: 1, due: '2026-05-01' }, '2026-05-10')).toBe(true);
    expect(isDue({ box: 1, due: '2026-05-11' }, '2026-05-10')).toBe(false);
  });
});

describe('dueWordIds', () => {
  it('sort les plus en retard d’abord, puis les moins bien sus', () => {
    const review = {
      recent: { box: 3, due: '2026-05-10' },
      vieux: { box: 2, due: '2026-05-02' },
      fragile: { box: 0, due: '2026-05-10' },
      futur: { box: 1, due: '2026-05-20' },
    };
    expect(dueWordIds(review, '2026-05-10')).toEqual(['vieux', 'fragile', 'recent']);
  });
});

describe('masteredCount', () => {
  it('ne compte que les mots montés haut dans les boîtes', () => {
    expect(
      masteredCount({
        a: { box: 4, due: '2026-06-01' },
        b: { box: 6, due: '2026-07-01' },
        c: { box: 2, due: '2026-05-12' },
      }),
    ).toBe(2);
  });
});
