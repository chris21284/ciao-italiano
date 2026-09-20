import type { Progress, ReviewCard } from '@/types/progress';
import { XP_PER_CORRECT, XP_PERFECT_BONUS, starsForMistakes } from './xp';
import { isDailyGoalReached } from './daily';
import { dayKey, nextStreak } from './day';
import { nextCard } from './review-schedule';
import { EMPTY_PROGRESS, newlyEarnedBadges } from './progress-stats';

const STORAGE_KEY = 'ciao_italiano_progress';
/** Longueur retenue pour le prénom : de quoi écrire un prénom ou un surnom,
 *  pas un roman — l'accueil doit tenir sur une ligne de téléphone. */
const MAX_NAME_LENGTH = 16;

let state: Progress = EMPTY_PROGRESS;
const listeners = new Set<() => void>();

/** Forme du stockage avant la répétition espacée : une simple liste de mots. */
interface LegacyProgress {
  toReview?: string[];
}

function readFromStorage(): Progress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;
    const stored = JSON.parse(raw) as Partial<Progress> & LegacyProgress;
    // Le contenu vient d'une version précédente du site : on complète les
    // champs manquants plutôt que de repartir de zéro.
    const progress: Progress = { ...EMPTY_PROGRESS, ...stored };

    // Les mots de l'ancienne liste « à revoir » deviennent des fiches à
    // réviser dès aujourd'hui : rien de ce qu'elle a déjà fait n'est perdu.
    if (stored.toReview && Object.keys(progress.review).length === 0) {
      const today = dayKey();
      progress.review = Object.fromEntries(
        stored.toReview.map((wordId) => [wordId, { box: 0, due: today }]),
      );
    }
    return progress;
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

/** Ce qu'une séance terminée rapporte au magasin. */
export interface SessionOutcome {
  /** Mots réussis du premier coup. */
  rightWordIds: string[];
  /** Mots ratés au moins une fois. */
  wrongWordIds: string[];
  /** Durée réelle de la séance, pour l'objectif du jour. */
  seconds: number;
}

function updatedReview(
  review: Record<string, ReviewCard>,
  outcome: SessionOutcome,
  today: string,
): Record<string, ReviewCard> {
  const next = { ...review };
  for (const wordId of outcome.rightWordIds) {
    next[wordId] = nextCard(next[wordId], true, today);
  }
  for (const wordId of outcome.wrongWordIds) {
    next[wordId] = nextCard(next[wordId], false, today);
  }
  return next;
}

/** Compteurs de la journée : ils repartent de zéro au changement de jour. */
function dailyCounters(today: string, xpGained: number, seconds: number) {
  const sameDay = state.lastDay === today;
  return {
    xpToday: (sameDay ? state.xpToday : 0) + xpGained,
    secondsToday: (sameDay ? state.secondsToday : 0) + seconds,
    secondsBefore: sameDay ? state.secondsToday : 0,
  };
}

export interface LessonReward {
  xpGained: number;
  stars: number;
  streak: number;
  /** Badges décrochés à l'instant, à fêter sur l'écran de fin. */
  newBadges: string[];
  xpToday: number;
  secondsToday: number;
  goalReached: boolean;
}

export interface LessonCompletion extends SessionOutcome {
  lessonId: string;
}

/**
 * Enregistre une leçon terminée : XP, étoiles, série du jour, fiches de
 * révision et badges. Renvoie de quoi animer l'écran de fin sans relire le
 * magasin.
 */
export function completeLesson(completion: LessonCompletion): LessonReward {
  const today = dayKey();
  const mistakes = completion.wrongWordIds.length;
  const stars = starsForMistakes(mistakes);
  const xpGained =
    completion.rightWordIds.length * XP_PER_CORRECT + (mistakes === 0 ? XP_PERFECT_BONUS : 0);

  const previous = state.lessons[completion.lessonId];
  const counters = dailyCounters(today, xpGained, completion.seconds);

  const next: Progress = {
    ...state,
    xp: state.xp + xpGained,
    streak: nextStreak(state.streak, state.lastDay, today),
    lastDay: today,
    xpToday: counters.xpToday,
    secondsToday: counters.secondsToday,
    lessons: {
      ...state.lessons,
      [completion.lessonId]: {
        // Rejouer une leçon ne fait jamais perdre d'étoiles.
        stars: Math.max(stars, previous?.stars ?? 0),
        attempts: (previous?.attempts ?? 0) + 1,
      },
    },
    review: updatedReview(state.review, completion, today),
  };

  const newBadges = newlyEarnedBadges(next, today);
  commit({ ...next, badges: [...next.badges, ...newBadges] });

  return {
    xpGained,
    stars,
    streak: next.streak,
    newBadges,
    xpToday: next.xpToday,
    secondsToday: next.secondsToday,
    // Vrai seulement à la séance qui franchit l'objectif : c'est elle qu'on
    // félicite, pas toutes les suivantes.
    goalReached:
      isDailyGoalReached(next.secondsToday) && !isDailyGoalReached(counters.secondsBefore),
  };
}

/** Séance de révision : des XP, et les fiches avancent comme en leçon. */
export function recordReview(outcome: SessionOutcome) {
  const today = dayKey();
  const xpGained = outcome.rightWordIds.length * XP_PER_CORRECT;
  const counters = dailyCounters(today, xpGained, outcome.seconds);

  const next: Progress = {
    ...state,
    xp: state.xp + xpGained,
    streak: nextStreak(state.streak, state.lastDay, today),
    lastDay: today,
    xpToday: counters.xpToday,
    secondsToday: counters.secondsToday,
    review: updatedReview(state.review, outcome, today),
  };

  const newBadges = newlyEarnedBadges(next, today);
  commit({ ...next, badges: [...next.badges, ...newBadges] });

  return { xpGained, newBadges, secondsToday: next.secondsToday };
}

/** Prénom affiché sur l'accueil et les écrans de fin de leçon. */
export function setPlayerName(name: string) {
  const trimmed = name.trim().slice(0, MAX_NAME_LENGTH);
  commit({ ...state, name: trimmed.length > 0 ? trimmed : null });
}

export function resetProgress() {
  commit(EMPTY_PROGRESS);
}
