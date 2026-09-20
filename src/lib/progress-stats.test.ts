import { describe, expect, it } from 'vitest';
import type { Progress } from '@/types/progress';
import { units } from '@/data/units';
import {
  computeStats,
  EMPTY_PROGRESS,
  isLessonUnlocked,
  newlyEarnedBadges,
  nextLesson,
} from './progress-stats';

function withLessons(lessonIds: string[], stars = 3): Progress {
  return {
    ...EMPTY_PROGRESS,
    lessons: Object.fromEntries(lessonIds.map((id) => [id, { stars, attempts: 1 }])),
  };
}

describe('isLessonUnlocked', () => {
  it('ouvre la toute première leçon d’emblée', () => {
    expect(isLessonUnlocked(EMPTY_PROGRESS, 'saluti-1')).toBe(true);
  });

  it('garde la suivante fermée tant que la précédente n’est pas faite', () => {
    expect(isLessonUnlocked(EMPTY_PROGRESS, 'saluti-2')).toBe(false);
    expect(isLessonUnlocked(withLessons(['saluti-1']), 'saluti-2')).toBe(true);
  });

  it('ouvre la première leçon de l’unité suivante', () => {
    const firstUnit = units[0]?.lessons.map((lesson) => lesson.id) ?? [];
    expect(isLessonUnlocked(withLessons(firstUnit), 'colori-1')).toBe(true);
  });
});

describe('nextLesson', () => {
  it('pointe la première leçon non terminée', () => {
    expect(nextLesson(EMPTY_PROGRESS)?.id).toBe('saluti-1');
    expect(nextLesson(withLessons(['saluti-1']))?.id).toBe('saluti-2');
  });
});

describe('computeStats', () => {
  it('compte les mots des leçons terminées et les unités bouclées', () => {
    const firstUnit = units[0];
    const lessonIds = firstUnit?.lessons.map((lesson) => lesson.id) ?? [];
    const stats = computeStats(withLessons(lessonIds), '2026-05-10');

    expect(stats.lessonsDone).toBe(lessonIds.length);
    expect(stats.perfectLessons).toBe(lessonIds.length);
    expect(stats.unitsDone).toBe(1);
    expect(stats.wordsLearned).toBe(
      firstUnit?.lessons.reduce((total, lesson) => total + lesson.words.length, 0),
    );
  });

  it('compte les mots bien ancrés', () => {
    const progress = {
      ...EMPTY_PROGRESS,
      review: { a: { box: 5, due: '2026-06-01' }, b: { box: 1, due: '2026-05-11' } },
    };
    expect(computeStats(progress, '2026-05-10').masteredWords).toBe(1);
  });

  it('ignore une série abandonnée depuis plusieurs jours', () => {
    const progress = { ...EMPTY_PROGRESS, streak: 6, lastDay: '2026-05-01' };
    expect(computeStats(progress, '2026-05-10').streak).toBe(0);
  });
});

describe('newlyEarnedBadges', () => {
  it('signale le premier badge après une leçon', () => {
    expect(newlyEarnedBadges(withLessons(['saluti-1']), '2026-05-10')).toContain('primo-passo');
  });

  it('ne redonne pas un badge déjà enregistré', () => {
    const progress = { ...withLessons(['saluti-1']), badges: ['primo-passo', 'perfetto'] };
    expect(newlyEarnedBadges(progress, '2026-05-10')).not.toContain('primo-passo');
  });
});
