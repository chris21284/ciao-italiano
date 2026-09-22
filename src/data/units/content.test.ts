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
    // Deux à trois leçons par jour au début, moins ensuite quand les
    // révisions prennent leur place : il en faut de quoi tenir ~90 jours.
    expect(units.length).toBeGreaterThanOrEqual(50);
    expect(allLessons.length).toBeGreaterThanOrEqual(200);
    expect(allWords.length).toBeGreaterThanOrEqual(1200);
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

  it('n’enseigne jamais deux fois la même expression italienne', () => {
    // Deux entrées identiques, ce sont deux fiches de révision pour un seul
    // mot : elle le reverrait deux fois plus souvent, sans raison.
    const seen = new Map<string, string>();
    const doubles: string[] = [];
    for (const word of allWords) {
      const previous = seen.get(word.it);
      if (previous) doubles.push(`${word.it} (${previous} / ${word.id})`);
      else seen.set(word.it, word.id);
    }
    expect(doubles).toEqual([]);
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
    expect(conjugated.length).toBeGreaterThanOrEqual(130);
    for (const word of conjugated) {
      expect(word.it, word.id).toBe(`${word.verb?.pronoun} ${word.verb?.form}`);
      expect(word.verb?.infinitive.length, word.id).toBeGreaterThan(0);
    }
  });
});
