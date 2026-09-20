/**
 * Durée visée pour une séance quotidienne. Au-delà, le site félicite et
 * propose d'arrêter : mieux vaut dix minutes tous les jours que deux heures
 * un dimanche, et c'est aussi ce qui fait durer le parcours.
 */
export const DAILY_GOAL_SECONDS = 12 * 60;

/** Nombre de nouvelles leçons proposées par jour, révisions en plus. */
export const NEW_LESSONS_PER_DAY = 2;

export function minutesFromSeconds(seconds: number): number {
  return Math.floor(seconds / 60);
}

/** Part de la séance du jour déjà faite, entre 0 et 1. */
export function dailyRatio(secondsToday: number): number {
  return Math.min(secondsToday / DAILY_GOAL_SECONDS, 1);
}

export function isDailyGoalReached(secondsToday: number): boolean {
  return secondsToday >= DAILY_GOAL_SECONDS;
}
