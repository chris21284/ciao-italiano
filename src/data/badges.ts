/** Statistiques dérivées de la progression, seule entrée des badges. */
export interface BadgeStats {
  xp: number;
  streak: number;
  lessonsDone: number;
  perfectLessons: number;
  wordsLearned: number;
  unitsDone: number;
  /** Mots revus juste plusieurs fois d'affilée, donc vraiment sus. */
  masteredWords: number;
}

export interface Badge {
  id: string;
  label: string;
  emoji: string;
  /** Ce qu'il reste à faire, montré tant que le badge est verrouillé. */
  hint: string;
  isEarned: (stats: BadgeStats) => boolean;
}

export const badges: Badge[] = [
  {
    id: 'primo-passo',
    label: 'Primo passo',
    emoji: '🐣',
    hint: 'Termine ta première leçon',
    isEarned: (stats) => stats.lessonsDone >= 1,
  },
  {
    id: 'perfetto',
    label: 'Perfetto!',
    emoji: '💎',
    hint: 'Réussis une leçon sans aucune faute',
    isEarned: (stats) => stats.perfectLessons >= 1,
  },
  {
    id: 'dieci-parole',
    label: '10 parole',
    emoji: '📚',
    hint: 'Apprends 10 mots',
    isEarned: (stats) => stats.wordsLearned >= 10,
  },
  {
    id: 'cinquanta-parole',
    label: '50 parole',
    emoji: '🧠',
    hint: 'Apprends 50 mots',
    isEarned: (stats) => stats.wordsLearned >= 50,
  },
  {
    id: 'cento-parole',
    label: '100 parole',
    emoji: '🦉',
    hint: 'Apprends 100 mots',
    isEarned: (stats) => stats.wordsLearned >= 100,
  },
  {
    id: 'serie-3',
    label: 'Série de 3',
    emoji: '🔥',
    hint: 'Joue 3 jours de suite',
    isEarned: (stats) => stats.streak >= 3,
  },
  {
    id: 'serie-7',
    label: 'Série de 7',
    emoji: '☄️',
    hint: 'Joue 7 jours de suite',
    isEarned: (stats) => stats.streak >= 7,
  },
  {
    id: 'unita',
    label: 'Unité bouclée',
    emoji: '🏅',
    hint: 'Termine toutes les leçons d’une unité',
    isEarned: (stats) => stats.unitsDone >= 1,
  },
  {
    id: 'tre-unita',
    label: 'Triplé',
    emoji: '🏆',
    hint: 'Termine 3 unités',
    isEarned: (stats) => stats.unitsDone >= 3,
  },
  {
    id: 'cinque-perfette',
    label: 'Sans faute × 5',
    emoji: '⭐',
    hint: 'Réussis 5 leçons parfaites',
    isEarned: (stats) => stats.perfectLessons >= 5,
  },
  {
    id: 'mille-xp',
    label: '1000 XP',
    emoji: '🚀',
    hint: 'Atteins 1000 XP',
    isEarned: (stats) => stats.xp >= 1000,
  },
  {
    id: 'duecento-parole',
    label: '200 parole',
    emoji: '📖',
    hint: 'Apprends 200 mots',
    isEarned: (stats) => stats.wordsLearned >= 200,
  },
  {
    id: 'cinquecento-parole',
    label: '500 parole',
    emoji: '🗂️',
    hint: 'Apprends 500 mots',
    isEarned: (stats) => stats.wordsLearned >= 500,
  },
  {
    id: 'memoria',
    label: 'Mémoire d’or',
    emoji: '🧲',
    hint: 'Aie 100 mots bien ancrés en mémoire',
    isEarned: (stats) => stats.masteredWords >= 100,
  },
  {
    id: 'serie-30',
    label: 'Série de 30',
    emoji: '🌟',
    hint: 'Joue 30 jours de suite',
    isEarned: (stats) => stats.streak >= 30,
  },
  {
    id: 'cinquemila-xp',
    label: '5000 XP',
    emoji: '🛸',
    hint: 'Atteins 5000 XP',
    isEarned: (stats) => stats.xp >= 5000,
  },
  {
    id: 'dieci-unita',
    label: '10 unités',
    emoji: '🗺️',
    hint: 'Termine 10 unités',
    isEarned: (stats) => stats.unitsDone >= 10,
  },
  {
    id: 'venti-unita',
    label: '20 unités',
    emoji: '🧭',
    hint: 'Termine 20 unités',
    isEarned: (stats) => stats.unitsDone >= 20,
  },
  {
    id: 'maestra',
    label: 'Maestra',
    emoji: '👑',
    hint: 'Termine toutes les unités du parcours',
    isEarned: (stats) => stats.unitsDone >= 30,
  },
];

export function findBadge(badgeId: string) {
  return badges.find((badge) => badge.id === badgeId);
}
