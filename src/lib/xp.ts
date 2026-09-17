/** Points gagnés par bonne réponse du premier coup. */
export const XP_PER_CORRECT = 10;
/** Bonus versé quand la leçon est terminée sans aucune faute. */
export const XP_PERFECT_BONUS = 20;
/** Objectif du jour : deux leçons propres suffisent à le remplir. */
export const DAILY_GOAL_XP = 100;

const LEVEL_TITLES = [
  'Curieuse',
  'Apprentie',
  'Exploratrice',
  'Aventurière',
  'Championne',
  'Experte',
  'Maestra',
  'Super Maestra',
  'Étoile italienne',
];

/**
 * XP cumulés nécessaires pour atteindre `level`. Les paliers s'écartent de
 * 50 XP à chaque niveau (100, 250, 450, 700...) : les premiers niveaux tombent
 * vite, ce qui accroche, les suivants se méritent.
 */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  const steps = level - 1;
  return 100 * steps + (50 * steps * (steps - 1)) / 2;
}

export function levelFromXp(xp: number): number {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) level += 1;
  return level;
}

export function levelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length) - 1] ?? 'Étoile italienne';
}

/** Où en est-on dans le niveau courant — pour la barre de progression. */
export function levelProgress(xp: number) {
  const level = levelFromXp(xp);
  const start = xpForLevel(level);
  const next = xpForLevel(level + 1);
  return {
    level,
    title: levelTitle(level),
    xpInLevel: xp - start,
    xpForNextLevel: next - start,
    ratio: (xp - start) / (next - start),
  };
}

/** 3 étoiles sans faute, 2 avec une faute, 1 au-delà. */
export function starsForMistakes(mistakes: number): number {
  if (mistakes === 0) return 3;
  if (mistakes === 1) return 2;
  return 1;
}
