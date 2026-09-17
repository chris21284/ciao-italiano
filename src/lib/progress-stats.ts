import type { Progress } from '@/types/progress';
import type { BadgeStats } from '@/data/badges';
import { allLessons, units } from '@/data/units';
import { badges } from '@/data/badges';
import { currentStreak, dayKey } from './day';

export const EMPTY_PROGRESS: Progress = {
  xp: 0,
  streak: 0,
  lastDay: null,
  xpToday: 0,
  lessons: {},
  toReview: [],
  badges: [],
};

export function isLessonDone(progress: Progress, lessonId: string): boolean {
  return progress.lessons[lessonId] !== undefined;
}

/**
 * Une leçon est ouverte si c'est la première du parcours ou si celle qui la
 * précède est terminée : on avance sur un chemin, pas dans un menu.
 */
export function isLessonUnlocked(progress: Progress, lessonId: string): boolean {
  const index = allLessons.findIndex((lesson) => lesson.id === lessonId);
  if (index <= 0) return index === 0;
  const previous = allLessons[index - 1];
  return previous ? isLessonDone(progress, previous.id) : false;
}

/** Prochaine leçon à faire — cible du gros bouton « Continuer ». */
export function nextLesson(progress: Progress) {
  return allLessons.find((lesson) => !isLessonDone(progress, lesson.id)) ?? null;
}

export function learnedWordIds(progress: Progress): string[] {
  return allLessons
    .filter((lesson) => isLessonDone(progress, lesson.id))
    .flatMap((lesson) => lesson.words.map((word) => word.id));
}

export function computeStats(progress: Progress, today = dayKey()): BadgeStats {
  const results = Object.values(progress.lessons);
  return {
    xp: progress.xp,
    streak: currentStreak(progress.streak, progress.lastDay, today),
    lessonsDone: results.length,
    perfectLessons: results.filter((result) => result.stars === 3).length,
    wordsLearned: learnedWordIds(progress).length,
    unitsDone: units.filter((unit) =>
      unit.lessons.every((lesson) => isLessonDone(progress, lesson.id)),
    ).length,
  };
}

/** Badges mérités mais pas encore enregistrés — ceux à fêter à l'écran. */
export function newlyEarnedBadges(progress: Progress, today = dayKey()): string[] {
  const stats = computeStats(progress, today);
  return badges
    .filter((badge) => !progress.badges.includes(badge.id) && badge.isEarned(stats))
    .map((badge) => badge.id);
}
