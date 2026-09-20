import { describe, expect, it } from 'vitest';
import { allLessons, allWords, units } from './index';

/**
 * Le contenu est écrit à la main : ces garde-fous évitent les erreurs qui ne
 * se verraient qu'en jouant — un identifiant recopié d'un mot à l'autre
 * écraserait sa fiche de révision, une leçon trop courte casserait le tirage
 * des exercices.
 */
describe('contenu du parcours', () => {
  it('tient au moins trois mois de séances quotidiennes', () => {
    expect(units.length).toBeGreaterThanOrEqual(30);
    expect(allLessons.length).toBeGreaterThanOrEqual(110);
    expect(allWords.length).toBeGreaterThanOrEqual(700);
  });

  it('n’a aucun identifiant de mot en double', () => {
    const ids = allWords.map((word) => word.id);
    expect([...new Set(ids)]).toHaveLength(ids.length);
  });

  it('n’a aucun identifiant de leçon ni d’unité en double', () => {
    const lessonIds = allLessons.map((lesson) => lesson.id);
    const unitIds = units.map((unit) => unit.id);
    expect([...new Set(lessonIds)]).toHaveLength(lessonIds.length);
    expect([...new Set(unitIds)]).toHaveLength(unitIds.length);
  });

  it('donne six mots à chaque leçon', () => {
    for (const lesson of allLessons) {
      expect(lesson.words, lesson.id).toHaveLength(6);
    }
  });

  it('remplit tous les champs de chaque mot', () => {
    for (const word of allWords) {
      expect(word.it.length, word.id).toBeGreaterThan(0);
      expect(word.fr.length, word.id).toBeGreaterThan(0);
      expect(word.emoji.length, word.id).toBeGreaterThan(0);
      expect(word.say.length, word.id).toBeGreaterThan(0);
    }
  });

  it('accompagne chaque forme conjuguée de son infinitif et de son pronom', () => {
    const conjugated = allWords.filter((word) => word.verb);
    expect(conjugated.length).toBeGreaterThanOrEqual(100);
    for (const word of conjugated) {
      expect(word.it, word.id).toBe(`${word.verb?.pronoun} ${word.verb?.form}`);
      expect(word.verb?.infinitive.length, word.id).toBeGreaterThan(0);
    }
  });
});
