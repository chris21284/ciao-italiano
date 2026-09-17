import { describe, expect, it } from 'vitest';
import { levelFromXp, levelProgress, levelTitle, starsForMistakes, xpForLevel } from './xp';

describe('xpForLevel', () => {
  it('démarre le niveau 1 à zéro', () => {
    expect(xpForLevel(1)).toBe(0);
  });

  it('écarte les paliers de 50 XP supplémentaires à chaque niveau', () => {
    expect(xpForLevel(2)).toBe(100);
    expect(xpForLevel(3)).toBe(250);
    expect(xpForLevel(4)).toBe(450);
  });
});

describe('levelFromXp', () => {
  it('reste au niveau 1 juste avant le palier', () => {
    expect(levelFromXp(0)).toBe(1);
    expect(levelFromXp(99)).toBe(1);
  });

  it('monte d’un niveau pile au palier', () => {
    expect(levelFromXp(100)).toBe(2);
    expect(levelFromXp(250)).toBe(3);
  });
});

describe('levelTitle', () => {
  it('donne un titre à chaque niveau, même au-delà de la liste', () => {
    expect(levelTitle(1)).toBe('Curieuse');
    expect(levelTitle(99)).toBe('Étoile italienne');
  });
});

describe('levelProgress', () => {
  it('situe la progression dans le niveau courant', () => {
    const progress = levelProgress(175);
    expect(progress.level).toBe(2);
    expect(progress.xpInLevel).toBe(75);
    expect(progress.xpForNextLevel).toBe(150);
    expect(progress.ratio).toBeCloseTo(0.5);
  });
});

describe('starsForMistakes', () => {
  it('récompense le sans-faute de trois étoiles', () => {
    expect(starsForMistakes(0)).toBe(3);
    expect(starsForMistakes(1)).toBe(2);
    expect(starsForMistakes(4)).toBe(1);
  });
});
