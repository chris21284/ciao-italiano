/**
 * Clé de jour `AAAA-MM-JJ` en heure **locale** : `toISOString()` est en UTC et
 * ferait basculer la série un peu avant minuit en France.
 */
export function dayKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function previousDayKey(key: string): string {
  const [year, month, day] = key.split('-').map(Number);
  const date = new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1);
  date.setDate(date.getDate() - 1);
  return dayKey(date);
}

/**
 * Nouvelle valeur de la série après une leçon terminée aujourd'hui :
 * inchangée si la journée est déjà comptée, +1 si la veille l'était, sinon on
 * repart de 1.
 */
export function nextStreak(streak: number, lastDay: string | null, today: string): number {
  if (lastDay === today) return Math.max(streak, 1);
  if (lastDay !== null && lastDay === previousDayKey(today)) return streak + 1;
  return 1;
}

/** Une série non entretenue hier ou aujourd'hui est retombée à zéro. */
export function currentStreak(streak: number, lastDay: string | null, today: string): number {
  if (lastDay === null) return 0;
  if (lastDay === today || lastDay === previousDayKey(today)) return streak;
  return 0;
}
