import type { ReviewCard } from '@/types/progress';
import { dayKey } from './day';

/**
 * Nombre de jours avant de revoir un mot, selon sa boîte. Un mot fraîchement
 * raté revient le jour même, puis les écarts s'allongent : c'est le principe
 * de la répétition espacée, et c'est lui qui transforme 900 mots en trois mois
 * de séances plutôt qu'en une semaine de bachotage.
 */
export const BOX_DELAYS = [0, 1, 2, 4, 8, 16, 32];

export const MAX_BOX = BOX_DELAYS.length - 1;

function addDays(day: string, days: number): string {
  const [year, month, date] = day.split('-').map(Number);
  const result = new Date(year ?? 1970, (month ?? 1) - 1, date ?? 1);
  result.setDate(result.getDate() + days);
  return dayKey(result);
}

/** Fiche d'un mot rencontré pour la première fois. */
export function firstCard(today: string): ReviewCard {
  return { box: 1, due: addDays(today, BOX_DELAYS[1] as number) };
}

/** Nouvelle fiche après une réponse : on monte d'une boîte, ou on retombe. */
export function nextCard(
  card: ReviewCard | undefined,
  correct: boolean,
  today: string,
): ReviewCard {
  if (!correct) return { box: 0, due: today };
  const box = Math.min((card?.box ?? 0) + 1, MAX_BOX);
  return { box, due: addDays(today, BOX_DELAYS[box] as number) };
}

export function isDue(card: ReviewCard, today: string): boolean {
  return card.due <= today;
}

/**
 * Mots à revoir aujourd'hui, les plus en retard d'abord, puis les moins bien
 * sus : on commence par ce qui est le plus près d'être oublié.
 */
export function dueWordIds(review: Record<string, ReviewCard>, today = dayKey()): string[] {
  return Object.entries(review)
    .filter(([, card]) => isDue(card, today))
    .sort(([, a], [, b]) => (a.due === b.due ? a.box - b.box : a.due < b.due ? -1 : 1))
    .map(([wordId]) => wordId);
}

/** Mots considérés comme acquis : vus juste au moins quatre fois d'affilée. */
export function masteredCount(review: Record<string, ReviewCard>): number {
  return Object.values(review).filter((card) => card.box >= 4).length;
}
