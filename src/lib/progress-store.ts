import type { Progress } from '@/types/progress';
import { DAILY_GOAL_XP, XP_PER_CORRECT, XP_PERFECT_BONUS, starsForMistakes } from './xp';
import { dayKey, nextStreak } from './day';
import { EMPTY_PROGRESS, newlyEarnedBadges } from './progress-stats';

const STORAGE_KEY = 'ciao_italiano_progress';
/** Au-delà, la liste de révision décourage plus qu'elle n'aide. */
const MAX_TO_REVIEW = 40;

let state: Progress = EMPTY_PROGRESS;
const listeners = new Set<() => void>();

function readFromStorage(): Progress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;
    // Le contenu vient d'une version précédente du site : on complète les
    // champs manquants plutôt que de repartir de zéro.
    return { ...EMPTY_PROGRESS, ...(JSON.parse(raw) as Partial<Progress>) };
  } catch {
    return EMPTY_PROGRESS;
  }
}

if (typeof window !== 'undefined') {
  state = readFromStorage();
}

function commit(next: Progress) {
  state = next;
  // Comme la lecture, l'écriture est protégée : navigation privée, quota
  // atteint ou stockage bloqué ne doivent pas casser la leçon en cours, qui
  // continue alors en mémoire.
  try {
    window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Progression non enregistrée : perdue au rechargement, utilisable ici.
  }
  for (const listener of listeners) listener();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): Progress {
  return state;
}

export function getServerSnapshot(): Progress {
  return EMPTY_PROGRESS;
}

export interface LessonOutcome {
  lessonId: string;
  /** Mots réussis du premier coup. */
  rightWordIds: string[];
  /** Mots ratés au moins une fois pendant la leçon. */
  wrongWordIds: string[];
}

export interface LessonReward {
  xpGained: number;
  stars: number;
  streak: number;
  /** Badges décrochés à l'instant, à fêter sur l'écran de fin. */
  newBadges: string[];
  xpToday: number;
  goalReached: boolean;
}

/**
 * Enregistre une leçon terminée : XP, étoiles, série du jour, mots à revoir et
 * badges. Renvoie de quoi animer l'écran de fin sans relire le magasin.
 */
export function completeLesson(outcome: LessonOutcome): LessonReward {
  const today = dayKey();
  const mistakes = outcome.wrongWordIds.length;
  const stars = starsForMistakes(mistakes);
  const xpGained =
    outcome.rightWordIds.length * XP_PER_CORRECT + (mistakes === 0 ? XP_PERFECT_BONUS : 0);

  const previous = state.lessons[outcome.lessonId];
  const sameDay = state.lastDay === today;
  const toReview = [
    ...outcome.wrongWordIds,
    ...state.toReview.filter(
      (wordId) => !outcome.wrongWordIds.includes(wordId) && !outcome.rightWordIds.includes(wordId),
    ),
  ].slice(0, MAX_TO_REVIEW);

  const next: Progress = {
    ...state,
    xp: state.xp + xpGained,
    streak: nextStreak(state.streak, state.lastDay, today),
    lastDay: today,
    xpToday: (sameDay ? state.xpToday : 0) + xpGained,
    lessons: {
      ...state.lessons,
      [outcome.lessonId]: {
        // Rejouer une leçon ne fait jamais perdre d'étoiles.
        stars: Math.max(stars, previous?.stars ?? 0),
        attempts: (previous?.attempts ?? 0) + 1,
      },
    },
    toReview,
  };

  const newBadges = newlyEarnedBadges(next, today);
  commit({ ...next, badges: [...next.badges, ...newBadges] });

  return {
    xpGained,
    stars,
    streak: next.streak,
    newBadges,
    xpToday: next.xpToday,
    goalReached: next.xpToday >= DAILY_GOAL_XP && (sameDay ? state.xpToday : 0) < DAILY_GOAL_XP,
  };
}

/** Séance d'entraînement : des XP, et les mots redressés quittent la liste. */
export function recordReview(rightWordIds: string[], wrongWordIds: string[]) {
  const today = dayKey();
  const sameDay = state.lastDay === today;
  const xpGained = rightWordIds.length * XP_PER_CORRECT;

  commit({
    ...state,
    xp: state.xp + xpGained,
    streak: nextStreak(state.streak, state.lastDay, today),
    lastDay: today,
    xpToday: (sameDay ? state.xpToday : 0) + xpGained,
    toReview: [
      ...wrongWordIds,
      ...state.toReview.filter(
        (wordId) => !rightWordIds.includes(wordId) && !wrongWordIds.includes(wordId),
      ),
    ].slice(0, MAX_TO_REVIEW),
  });

  return { xpGained };
}

export function resetProgress() {
  commit(EMPTY_PROGRESS);
}
