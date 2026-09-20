import { describe, expect, it } from 'vitest';
import { DAILY_GOAL_SECONDS, dailyRatio, isDailyGoalReached, minutesFromSeconds } from './daily';

describe('séance du jour', () => {
  it('vise une douzaine de minutes', () => {
    expect(DAILY_GOAL_SECONDS).toBe(720);
  });

  it('remplit l’anneau au prorata, sans jamais le dépasser', () => {
    expect(dailyRatio(0)).toBe(0);
    expect(dailyRatio(360)).toBeCloseTo(0.5);
    expect(dailyRatio(3600)).toBe(1);
  });

  it('déclare la séance finie une fois l’objectif atteint', () => {
    expect(isDailyGoalReached(719)).toBe(false);
    expect(isDailyGoalReached(720)).toBe(true);
  });

  it('arrondit les minutes vers le bas', () => {
    expect(minutesFromSeconds(119)).toBe(1);
  });
});
