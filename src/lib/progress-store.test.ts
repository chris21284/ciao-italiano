import { beforeEach, describe, expect, it } from 'vitest';
import {
  completeLesson,
  getSnapshot,
  recordReview,
  resetProgress,
  setPlayerName,
  setSoundEnabled,
} from './progress-store';
import { XP_PER_CORRECT, XP_PERFECT_BONUS } from './xp';
import { dayKey } from './day';

const today = dayKey();

beforeEach(() => {
  window.localStorage.clear();
  resetProgress();
});

describe('completeLesson', () => {
  it('verse les XP, le bonus du sans-faute et trois étoiles', () => {
    const reward = completeLesson({
      lessonId: 'saluti-1',
      rightWordIds: ['ciao', 'grazie'],
      wrongWordIds: [],
      seconds: 90,
    });

    expect(reward.xpGained).toBe(2 * XP_PER_CORRECT + XP_PERFECT_BONUS);
    expect(reward.stars).toBe(3);
    expect(reward.streak).toBe(1);
    expect(getSnapshot().xp).toBe(reward.xpGained);
  });

  it('compte le temps passé dans la séance du jour', () => {
    completeLesson({
      lessonId: 'saluti-1',
      rightWordIds: ['ciao'],
      wrongWordIds: [],
      seconds: 120,
    });
    const reward = completeLesson({
      lessonId: 'saluti-2',
      rightWordIds: ['grazie'],
      wrongWordIds: [],
      seconds: 150,
    });

    expect(reward.secondsToday).toBe(270);
    expect(getSnapshot().secondsToday).toBe(270);
  });

  it('programme la révision des mots réussis et ramène les ratés à aujourd’hui', () => {
    completeLesson({
      lessonId: 'saluti-1',
      rightWordIds: ['ciao'],
      wrongWordIds: ['grazie'],
      seconds: 60,
    });

    const { review } = getSnapshot();
    expect(review['ciao']?.box).toBe(1);
    expect(review['ciao']?.due).not.toBe(today);
    expect(review['grazie']).toEqual({ box: 0, due: today });
  });

  it('ne donne pas le bonus quand un mot a été raté', () => {
    const reward = completeLesson({
      lessonId: 'saluti-1',
      rightWordIds: ['ciao'],
      wrongWordIds: ['grazie'],
      seconds: 60,
    });

    expect(reward.xpGained).toBe(XP_PER_CORRECT);
    expect(reward.stars).toBe(2);
  });

  it('ne fait jamais perdre d’étoiles en rejouant une leçon', () => {
    completeLesson({ lessonId: 'saluti-1', rightWordIds: ['ciao'], wrongWordIds: [], seconds: 60 });
    completeLesson({
      lessonId: 'saluti-1',
      rightWordIds: [],
      wrongWordIds: ['ciao', 'grazie'],
      seconds: 60,
    });

    expect(getSnapshot().lessons['saluti-1']).toEqual({ stars: 3, attempts: 2 });
  });

  it('décroche le badge du premier pas une seule fois', () => {
    const first = completeLesson({
      lessonId: 'saluti-1',
      rightWordIds: ['ciao'],
      wrongWordIds: [],
      seconds: 60,
    });
    const second = completeLesson({
      lessonId: 'saluti-2',
      rightWordIds: ['grazie'],
      wrongWordIds: [],
      seconds: 60,
    });

    expect(first.newBadges).toContain('primo-passo');
    expect(second.newBadges).not.toContain('primo-passo');
  });

  it('survit à un rechargement en relisant le stockage local', () => {
    completeLesson({ lessonId: 'saluti-1', rightWordIds: ['ciao'], wrongWordIds: [], seconds: 60 });
    const raw = window.localStorage.getItem('ciao_italiano_progress');
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw as string).lessons['saluti-1'].stars).toBe(3);
  });
});

describe('recordReview', () => {
  it('fait monter d’une boîte le mot enfin réussi', () => {
    completeLesson({
      lessonId: 'saluti-1',
      rightWordIds: [],
      wrongWordIds: ['ciao', 'grazie'],
      seconds: 60,
    });
    recordReview({ rightWordIds: ['ciao'], wrongWordIds: ['grazie'], seconds: 45 });

    const { review, secondsToday } = getSnapshot();
    expect(review['ciao']?.box).toBe(1);
    expect(review['grazie']?.box).toBe(0);
    expect(secondsToday).toBe(105);
  });
});

describe('setPlayerName', () => {
  it('enregistre le prénom sans les espaces en trop', () => {
    setPlayerName('  Lucie  ');
    expect(getSnapshot().name).toBe('Lucie');
  });

  it('tronque un prénom trop long pour la carte d’accueil', () => {
    setPlayerName('Anne-Charlotte-Émilie');
    expect(getSnapshot().name).toHaveLength(16);
  });

  it('revient à l’anonymat sur une saisie vide', () => {
    setPlayerName('Lucie');
    setPlayerName('   ');
    expect(getSnapshot().name).toBeNull();
  });

  it('survit à une leçon terminée', () => {
    setPlayerName('Lucie');
    completeLesson({ lessonId: 'saluti-1', rightWordIds: ['ciao'], wrongWordIds: [], seconds: 60 });
    expect(getSnapshot().name).toBe('Lucie');
  });
});

describe('setSoundEnabled', () => {
  it('retient qu’elle n’entend rien, pour ne plus poser la question', () => {
    setSoundEnabled(false);
    expect(getSnapshot().soundChecked).toBe(true);
    expect(getSnapshot().soundEnabled).toBe(false);
  });

  it('se rallume depuis la page des progrès', () => {
    setSoundEnabled(false);
    setSoundEnabled(true);
    expect(getSnapshot().soundEnabled).toBe(true);
  });
});
