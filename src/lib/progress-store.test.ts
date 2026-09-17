import { beforeEach, describe, expect, it } from 'vitest';
import { completeLesson, getSnapshot, recordReview, resetProgress } from './progress-store';
import { DAILY_GOAL_XP, XP_PER_CORRECT, XP_PERFECT_BONUS } from './xp';

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
    });

    expect(reward.xpGained).toBe(2 * XP_PER_CORRECT + XP_PERFECT_BONUS);
    expect(reward.stars).toBe(3);
    expect(reward.streak).toBe(1);
    expect(getSnapshot().xp).toBe(reward.xpGained);
  });

  it('retient les mots ratés pour la révision, sans bonus', () => {
    const reward = completeLesson({
      lessonId: 'saluti-1',
      rightWordIds: ['ciao'],
      wrongWordIds: ['grazie'],
    });

    expect(reward.xpGained).toBe(XP_PER_CORRECT);
    expect(reward.stars).toBe(2);
    expect(getSnapshot().toReview).toEqual(['grazie']);
  });

  it('ne fait jamais perdre d’étoiles en rejouant une leçon', () => {
    completeLesson({ lessonId: 'saluti-1', rightWordIds: ['ciao'], wrongWordIds: [] });
    completeLesson({ lessonId: 'saluti-1', rightWordIds: [], wrongWordIds: ['ciao', 'grazie'] });

    expect(getSnapshot().lessons['saluti-1']).toEqual({ stars: 3, attempts: 2 });
  });

  it('décroche le badge du premier pas une seule fois', () => {
    const first = completeLesson({
      lessonId: 'saluti-1',
      rightWordIds: ['ciao'],
      wrongWordIds: [],
    });
    const second = completeLesson({
      lessonId: 'saluti-2',
      rightWordIds: ['grazie'],
      wrongWordIds: [],
    });

    expect(first.newBadges).toContain('primo-passo');
    expect(second.newBadges).not.toContain('primo-passo');
  });

  it('signale l’objectif du jour au moment où il est franchi', () => {
    const many = Array.from({ length: 10 }, (_, index) => `mot-${index}`);
    const reward = completeLesson({ lessonId: 'saluti-1', rightWordIds: many, wrongWordIds: [] });

    expect(reward.xpToday).toBeGreaterThanOrEqual(DAILY_GOAL_XP);
    expect(reward.goalReached).toBe(true);

    const again = completeLesson({ lessonId: 'saluti-2', rightWordIds: many, wrongWordIds: [] });
    expect(again.goalReached).toBe(false);
  });

  it('survit à un rechargement en relisant le stockage local', () => {
    completeLesson({ lessonId: 'saluti-1', rightWordIds: ['ciao'], wrongWordIds: [] });
    const raw = window.localStorage.getItem('ciao_italiano_progress');
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw as string).lessons['saluti-1'].stars).toBe(3);
  });
});

describe('recordReview', () => {
  it('sort de la liste les mots enfin réussis', () => {
    completeLesson({ lessonId: 'saluti-1', rightWordIds: [], wrongWordIds: ['ciao', 'grazie'] });
    recordReview(['ciao'], ['grazie']);

    expect(getSnapshot().toReview).toEqual(['grazie']);
  });
});
