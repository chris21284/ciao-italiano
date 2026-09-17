import { describe, expect, it } from 'vitest';
import { currentStreak, dayKey, nextStreak, previousDayKey } from './day';

describe('dayKey', () => {
  it('utilise le calendrier local, pas UTC', () => {
    // 1er janvier 2026, 00h30 en heure locale : en UTC on serait encore le 31.
    expect(dayKey(new Date(2026, 0, 1, 0, 30))).toBe('2026-01-01');
  });
});

describe('previousDayKey', () => {
  it('recule d’un jour, y compris en changeant de mois', () => {
    expect(previousDayKey('2026-03-02')).toBe('2026-03-01');
    expect(previousDayKey('2026-03-01')).toBe('2026-02-28');
  });
});

describe('nextStreak', () => {
  it('ne compte pas deux fois la même journée', () => {
    expect(nextStreak(4, '2026-05-10', '2026-05-10')).toBe(4);
  });

  it('prolonge la série quand la veille est comptée', () => {
    expect(nextStreak(4, '2026-05-09', '2026-05-10')).toBe(5);
  });

  it('repart à 1 après un trou', () => {
    expect(nextStreak(9, '2026-05-01', '2026-05-10')).toBe(1);
    expect(nextStreak(0, null, '2026-05-10')).toBe(1);
  });
});

describe('currentStreak', () => {
  it('garde la série tant que la veille compte', () => {
    expect(currentStreak(3, '2026-05-09', '2026-05-10')).toBe(3);
    expect(currentStreak(3, '2026-05-10', '2026-05-10')).toBe(3);
  });

  it('la remet à zéro dès qu’un jour est sauté', () => {
    expect(currentStreak(3, '2026-05-08', '2026-05-10')).toBe(0);
    expect(currentStreak(0, null, '2026-05-10')).toBe(0);
  });
});
