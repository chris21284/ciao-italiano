import { describe, expect, it } from 'vitest';
import type { Word } from '@/types/lesson';
import { allWords, findLesson } from '@/data/units';
import { buildLessonExercises, buildReviewExercises, canSpell } from './exercise-builder';

const lesson = findLesson('colori-1');

function words(): Word[] {
  return lesson?.words ?? [];
}

describe('buildLessonExercises', () => {
  it('pose une question par mot de la leçon', () => {
    const exercises = buildLessonExercises(words(), allWords, 42);
    expect(exercises).toHaveLength(words().length);
    expect(new Set(exercises.map((exercise) => exercise.word.id)).size).toBe(words().length);
  });

  it('propose quatre choix dont la bonne réponse, sans doublon', () => {
    const exercises = buildLessonExercises(words(), allWords, 7);
    for (const exercise of exercises) {
      if (exercise.kind === 'spell') continue;
      const expected = exercise.kind === 'choice-it-fr' ? exercise.word.fr : exercise.word.it;
      expect(exercise.options).toHaveLength(4);
      expect(exercise.options).toContain(expected);
      expect(new Set(exercise.options).size).toBe(4);
    }
  });

  it('mélange les lettres sans jamais livrer le mot déjà écrit', () => {
    const exercises = buildLessonExercises(words(), allWords, 3);
    for (const exercise of exercises) {
      if (exercise.kind !== 'spell') continue;
      expect([...exercise.letters].sort()).toEqual([...exercise.word.it].sort());
      expect(exercise.letters.join('')).not.toBe(exercise.word.it);
    }
  });

  it('rejoue le même tirage pour une même graine', () => {
    expect(buildLessonExercises(words(), allWords, 99)).toEqual(
      buildLessonExercises(words(), allWords, 99),
    );
  });
});

describe('canSpell', () => {
  it('écarte les phrases et les mots trop longs', () => {
    expect(canSpell({ id: 'a', it: 'rosso', fr: 'rouge', emoji: '🔴', say: 'rosso' })).toBe(true);
    expect(canSpell({ id: 'b', it: 'ho fame', fr: 'faim', emoji: '😋', say: 'o fa-mé' })).toBe(
      false,
    );
    expect(canSpell({ id: 'c', it: 'arrivederci', fr: 'au revoir', emoji: '🤚', say: 'ari' })).toBe(
      false,
    );
  });
});

describe('buildReviewExercises', () => {
  it('commence par les mots à revoir puis complète jusqu’à la taille demandée', () => {
    const toReview = allWords.slice(0, 3);
    const exercises = buildReviewExercises(toReview, allWords, 5, 10);
    expect(exercises).toHaveLength(10);
    const firstThree = exercises.slice(0, 3).map((exercise) => exercise.word.id);
    expect(firstThree.sort()).toEqual(toReview.map((word) => word.id).sort());
  });

  it('se limite aux mots disponibles quand ils sont moins nombreux', () => {
    const seen = allWords.slice(0, 4);
    expect(buildReviewExercises([], seen, 1, 10)).toHaveLength(4);
  });
});

describe('exercices de conjugaison', () => {
  const verbLesson = findLesson('verbo-essere');

  it('interroge les formes conjuguées avec l’infinitif et le pronom', () => {
    const exercises = buildLessonExercises(verbLesson?.words ?? [], allWords, 11);
    const conjugations = exercises.filter((exercise) => exercise.kind === 'conjugate');
    expect(conjugations.length).toBeGreaterThan(0);

    for (const exercise of conjugations) {
      expect(exercise.word.verb?.infinitive).toBe('essere');
      expect(exercise.options).toContain(exercise.word.verb?.form);
    }
  });

  it('pioche ses pièges parmi les autres formes du même verbe', () => {
    const exercises = buildLessonExercises(verbLesson?.words ?? [], allWords, 4);
    const forms = new Set((verbLesson?.words ?? []).map((word) => word.verb?.form));

    for (const exercise of exercises) {
      if (exercise.kind !== 'conjugate') continue;
      for (const option of exercise.options) {
        expect(forms, option).toContain(option);
      }
    }
  });

  it('ne mélange jamais les lettres d’une forme conjuguée', () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      const exercises = buildLessonExercises(verbLesson?.words ?? [], allWords, seed);
      expect(exercises.some((exercise) => exercise.kind === 'spell')).toBe(false);
    }
  });
});
